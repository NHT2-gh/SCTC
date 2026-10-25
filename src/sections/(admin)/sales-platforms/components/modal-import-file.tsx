"use client";

import React, { useCallback, useState } from "react";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/table";

type PreviewData = {
  file: File;
  sheetNames: string[];
  sheetName: string;
  rows: string[][];
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_PREVIEW_ROWS = 100;

export default function ModalImportFile() {
  const modal = useModal();

  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const readSheet = useCallback(
    (workbook: XLSX.WorkBook, sheetName: string) => {
      const worksheet = workbook.Sheets[sheetName];

      const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      const rows = rawRows.map((row) => row.map((cell) => String(cell ?? "")));

      setPreview((current) =>
        current ? { ...current, sheetName, rows } : null,
      );
    },
    [],
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];

    if (!file) return;

    setError("");
    setPreview(null);

    if (file.size > MAX_FILE_SIZE) {
      setError("File vượt quá giới hạn 10 MB.");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !["xlsx", "xls", "csv"].includes(extension)) {
      setError("Chỉ hỗ trợ file .xlsx, .xls hoặc .csv.");
      return;
    }

    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: false,
      });

      if (workbook.SheetNames.length === 0) {
        throw new Error("File không có sheet dữ liệu.");
      }

      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];

      const rawRows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
        header: 1,
        defval: "",
        raw: false,
      });

      const rows = rawRows.map((row) => row.map((cell) => String(cell ?? "")));

      setPreview({
        file,
        sheetNames: workbook.SheetNames,
        sheetName: firstSheet,
        rows,
      });

      // Giữ workbook để có thể chuyển sheet mà không đọc file lại.
      // Workbook được lưu trong ref ở phần code hoàn chỉnh bên dưới
      // nếu bạn muốn mở rộng xử lý nhiều sheet.
    } catch (err) {
      console.error("File preview error:", err);
      setError("Không thể đọc file. Hãy kiểm tra định dạng và nội dung file.");
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    multiple: false,
    noClick: true,
    maxSize: MAX_FILE_SIZE,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    onDropRejected: (rejections) => {
      const rejection = rejections[0];

      if (rejection?.errors.some((item) => item.code === "file-too-large")) {
        setError("File vượt quá giới hạn 10 MB.");
      } else {
        setError("File không hợp lệ. Hãy chọn file Excel hoặc CSV.");
      }
    },
  });

  const handleClose = () => {
    setPreview(null);
    setError("");
    setLoading(false);
    modal.closeModal();
  };

  const headers = preview?.rows[0] ?? [];
  const dataRows = preview?.rows.slice(1) ?? [];
  const nonEmptyRows = dataRows.filter((row) =>
    row.some((cell) => cell.trim() !== ""),
  );

  return (
    <>
      <Button variant="outline" size="sm" onClick={modal.openModal}>
        Import File
      </Button>

      <Modal isOpen={modal.isOpen} onClose={handleClose}>
        <div className="w-full">
          <h2 className="mb-5 text-xl font-bold text-gray-800 dark:text-white">
            Import File
          </h2>

          {/* Upload area */}
          <div
            {...getRootProps()}
            className={`rounded-xl border border-dashed p-7 transition lg:p-10 ${
              isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }`}
          >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="M12 16V4m0 0L7 9m5-5 5 5" />
                  <path d="M20 16.5v2A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-2" />
                </svg>
              </div>

              <h3 className="mb-2 font-semibold text-gray-800 dark:text-white">
                {isDragActive ? "Thả file vào đây" : "Kéo thả file vào đây"}
              </h3>

              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Hỗ trợ XLSX, XLS và CSV · Tối đa 10 MB
              </p>

              <Button type="button" variant="outline" size="sm" onClick={open}>
                Chọn file
              </Button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <p className="mt-4 text-sm text-gray-500">
              Đang đọc dữ liệu file...
            </p>
          )}

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30"
            >
              {error}
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="mt-6">
              <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="min-w-0 grow">
                  <p className="break-all font-medium text-gray-800 dark:text-white">
                    {preview.file.name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {(preview.file.size / 1024).toFixed(1)} KB ·{" "}
                    {nonEmptyRows.length} dòng dữ liệu
                  </p>
                </div>

                <Button type="button" size="sm" className="">
                  Tiến hành đối chiếu
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={open}
                >
                  Chọn file khác
                </Button>
              </div>

              {preview.sheetNames.length > 1 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <label
                    htmlFor="preview-sheet"
                    className="text-sm font-medium"
                  >
                    Sheet:
                  </label>

                  <select
                    id="preview-sheet"
                    value={preview.sheetName}
                    onChange={async (event) => {
                      const sheetName = event.target.value;

                      try {
                        const buffer = await preview.file.arrayBuffer();
                        const workbook = XLSX.read(buffer, {
                          type: "array",
                        });
                        readSheet(workbook, sheetName);
                      } catch {
                        setError("Không thể đọc sheet được chọn.");
                      }
                    }}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
                  >
                    {preview.sheetNames.map((sheet) => (
                      <option key={sheet} value={sheet}>
                        {sheet}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <p className="mb-2 text-xs text-gray-500">
                Đang hiển thị tối đa {MAX_PREVIEW_ROWS} dòng dữ liệu đầu tiên.
                Dòng đầu tiên được xem là tiêu đề cột.
              </p>

              <div className="max-h-[360px] overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
                {preview.rows.length === 0 ? (
                  <p className="p-6 text-center text-sm text-gray-500">
                    Sheet này chưa có dữ liệu.
                  </p>
                ) : (
                  <Table className="max-h-[50vh]">
                    <TableHeader
                      columns={headers.map((header, index) => ({
                        key: index.toString(),
                        title: header || `Cột ${index + 1}`,
                      }))}
                    />
                    <TableBody>
                      {nonEmptyRows
                        .slice(0, MAX_PREVIEW_ROWS)
                        .map((row, rowIndex) => (
                          <TableRow
                            key={rowIndex}
                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          >
                            {headers.map((_, columnIndex) => (
                              <TableCell key={columnIndex}>
                                {row[columnIndex] ?? ""}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </div>

              {nonEmptyRows.length > MAX_PREVIEW_ROWS && (
                <p className="mt-2 text-xs text-gray-500">
                  Còn {nonEmptyRows.length - MAX_PREVIEW_ROWS} dòng chưa được
                  hiển thị trong preview.
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
