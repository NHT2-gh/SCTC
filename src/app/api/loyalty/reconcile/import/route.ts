import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

import {
  IMPORT_CONFIGS,
  isImportConfigComplete,
  type LoyaltySource,
} from "@/lib/loyalty/import-config";
import { parseImportFile } from "@/lib/loyalty/import-engine";
import { adminSupabase } from "@/supabase/supabaseAdmin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const SUPPORTED_EXTENSIONS = [".csv", ".xls", ".xlsx"];

function isValidSource(value: unknown): value is LoyaltySource {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(IMPORT_CONFIGS, value)
  );
}

function isValidFileName(fileName: string, source: LoyaltySource): boolean {
  const normalizedName = fileName.trim().toLowerCase();

  const hasValidPrefix = normalizedName.startsWith(`${source.toLowerCase()}-`);

  const hasValidExtension = SUPPORTED_EXTENSIONS.some((extension) =>
    normalizedName.endsWith(extension),
  );

  return hasValidPrefix && hasValidExtension;
}

async function calculateFileHash(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  return createHash("sha256").update(buffer).digest("hex");
}

export async function POST(request: NextRequest) {
  let batchId: string | null = null;

  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const sourceValue = formData.get("source");

    // 1. Validate source
    if (!isValidSource(sourceValue)) {
      return NextResponse.json(
        { message: "Invalid loyalty source." },
        { status: 400 },
      );
    }

    const source = sourceValue;
    const config = IMPORT_CONFIGS[source];

    if (!config.enabled || !isImportConfigComplete(config)) {
      return NextResponse.json(
        { message: "This import source is not enabled or configured." },
        { status: 400 },
      );
    }

    // 2. Validate file
    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Import file is required." },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { message: "Import file is empty." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File size exceeds the 20MB limit." },
        { status: 400 },
      );
    }

    if (!isValidFileName(file.name, source)) {
      return NextResponse.json(
        {
          message: `File name must start with "${source}-" and use CSV, XLS or XLSX.`,
        },
        { status: 400 },
      );
    }

    // 3. Parse and validate the original file on the server
    const parseResult = await parseImportFile(file, config);

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        {
          message: "Import file contains invalid rows.",
          totalRows: parseResult.totalRows,
          skippedRows: parseResult.skippedRows,
          duplicateRows: parseResult.duplicateRows,
          errors: parseResult.errors,
        },
        { status: 422 },
      );
    }

    if (parseResult.orders.length === 0) {
      return NextResponse.json(
        {
          message: "No completed orders found in the import file.",
          totalRows: parseResult.totalRows,
          skippedRows: parseResult.skippedRows,
          duplicateRows: parseResult.duplicateRows,
        },
        { status: 422 },
      );
    }

    // 4. Calculate file hash for batch traceability
    const fileHash = await calculateFileHash(file);

    // 5. Create import batch
    const { data: batch, error: batchError } = await adminSupabase
      .from("loyalty_import_batches")
      .insert({
        source,
        file_name: file.name,
        file_hash: fileHash,
        status: "processing",
        total_rows: parseResult.totalRows,
      })
      .select("id")
      .single();

    if (batchError || !batch) {
      console.error("Failed to create import batch:", batchError);

      return NextResponse.json(
        { message: "Failed to create import batch." },
        { status: 500 },
      );
    }

    batchId = batch.id;

    // 6. Reconcile using server-parsed orders only
    const { data: reconciliation, error: reconciliationError } =
      await adminSupabase.rpc("reconcile_loyalty_import_batch", {
        p_batch_id: batchId,
        p_orders: parseResult.orders,
        p_total_rows: parseResult.orders.length,
      });

    if (reconciliationError) {
      console.error("Loyalty reconciliation failed:", reconciliationError);

      // RPC is atomic. Mark the batch as failed in a separate request.
      const { data, error: updateBatchError } = await adminSupabase
        .from("loyalty_import_batches")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error_message: reconciliationError.message,
        })
        .eq("id", batchId);

      if (updateBatchError) {
        console.error(
          "Failed to update import batch status:",
          updateBatchError,
        );
      }

      return NextResponse.json(
        {
          message: "Reconciliation failed.",
          batchId,
          error: reconciliationError.message,
        },
        { status: 500 },
      );
    }

    // 7. Return reconciliation result
    return NextResponse.json(
      {
        message: "Reconciliation completed.",
        batchId,
        reconciliation,
        parsing: {
          totalRows: parseResult.totalRows,
          importedOrders: parseResult.orders.length,
          skippedRows: parseResult.skippedRows,
          duplicateRows: parseResult.duplicateRows,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Import API error:", error);

    if (batchId) {
      await adminSupabase
        .from("loyalty_import_batches")
        .update({
          status: "failed",
          completed_at: new Date().toISOString(),
          error_message:
            error instanceof Error ? error.message : "Unknown import error",
        })
        .eq("id", batchId);
    }

    return NextResponse.json(
      {
        message: "An unexpected error occurred during import.",
      },
      { status: 500 },
    );
  }
}
