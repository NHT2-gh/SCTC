"use client";
import { TableHeader } from "@/components/table";
import { ColumnDef } from "@/components/table/table-header";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useLoyaltyImportBatches } from "@/hooks/queries/use-customer-service";
import React from "react";

const columns: ColumnDef[] = [
  {
    key: "file_name",
    title: "File Name",
  },
  {
    key: "source",
    title: "Source",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "total_rows",
    title: "Total Rows",
  },
  {
    key: "matched_rows",
    title: "Matched Rows",
  },
  {
    key: "verified_claims",
    title: "Verified Claims",
  },
  {
    key: "processed_count",
    title: "Processed Count",
  },
  {
    key: "created_at",
    title: "Created At",
  },
];

export default function LoyaltyImportBatchesTable() {
  const { data } = useLoyaltyImportBatches();
  return (
    <Table>
      <TableHeader columns={columns} />
      <TableBody>
        {data?.data?.map((batch) => (
          <TableRow key={batch.id}>
            <TableCell>{batch.file_name}</TableCell>
            <TableCell>{batch.source}</TableCell>
            <TableCell>{batch.status}</TableCell>
            <TableCell>{batch.total_rows}</TableCell>
            <TableCell>{batch.matched_rows}</TableCell>
            <TableCell>{batch.verified_claims}</TableCell>
            <TableCell>{batch.processed_count}</TableCell>
            <TableCell>{batch.created_at}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
