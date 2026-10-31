"use client";
import { useCallback, useMemo, useState } from "react";

import { useDropzone } from "react-dropzone";
import { useModal } from "@/hooks/useModal";
import { TableHeader } from "@/components/table";
import Modal from "@/components/ui/modal/modal";
import { Button } from "@/components/ui/button";
import {
  IMPORT_CONFIGS,
  ImportResult,
  isImportConfigComplete,
  isValidSourceFileName,
  type LoyaltySource,
} from "@/lib/loyalty/import-config";
import { parseImportFile } from "@/lib/loyalty/import-engine";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const SOURCE_LABELS: Record<LoyaltySource, string> = {
  grabfood: "GrabFood",
  xanhsm: "Xanh SM",
  befood: "beFood",
};

export default function ModalImportFile() {
  const modal = useModal();

  const [source, setSource] = useState<LoyaltySource>("grabfood");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconcileMessage, setReconcileMessage] = useState("");
  const [previewOrderLimit, setPreviewOrderLimit] = useState(10);
  const config = IMPORT_CONFIGS[source];
  const isConfigured = isImportConfigComplete(config);

  const resetImportState = () => {
    setResult(null);
    setError("");
    setReconcileMessage("");
  };

  const handleSourceChange = (value: LoyaltySource) => {
    setSource(value);
    resetImportState();
  };

  const parseFile = useCallback(
    async (selectedFile: File) => {
      setFile(selectedFile);
      setResult(null);
      setError("");

      if (!isConfigured) {
        setError(`Source ${SOURCE_LABELS[source]} chưa được cấu hình.`);
        return;
      }

      setIsParsing(true);

      try {
        const parsed = await parseImportFile(selectedFile, config);
        setResult(parsed);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể đọc file. Vui lòng kiểm tra lại.",
        );
      } finally {
        setIsParsing(false);
      }
    },
    [config, isConfigured, source],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];

      if (selectedFile) {
        void parseFile(selectedFile);
      }
    },
    [parseFile],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      multiple: false,
      disabled: !isConfigured || isParsing,
      maxSize: 10 * 1024 * 1024,
      accept: {
        "text/csv": [".csv"],
        "application/vnd.ms-excel": [".xls", ".csv"],
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
          ".xlsx",
        ],
      },
    });

  const previewOrders = useMemo(
    () => result?.orders.slice(0, previewOrderLimit) ?? [],
    [result, previewOrderLimit],
  );

  const closeModal = () => {
    resetImportState();
    modal.closeModal();
  };

  const handleCheckFile = async () => {
    // 1. Kiểm tra file đã được chọn chưa
    if (!file) {
      setError("Vui lòng chọn file cần kiểm tra.");
      setResult(null);
      return;
    }

    // 2. Chặn thao tác khi đang xử lý
    if (isParsing || isReconciling) {
      return;
    }

    // 3. Reset kết quả preview và thông báo cũ
    setError("");
    setResult(null);
    setReconcileMessage("");

    // 4. Kiểm tra tên file theo source
    if (!isValidSourceFileName(file.name, source)) {
      setError(
        `Tên file không hợp lệ. File phải bắt đầu bằng "${source}-" ` +
          `và có định dạng CSV, XLS hoặc XLSX.`,
      );
      return;
    }

    // 5. Lấy cấu hình import tương ứng
    const config = IMPORT_CONFIGS[source];

    if (!config || !isImportConfigComplete(config)) {
      setError(`Source "${source}" chưa được cấu hình import đầy đủ.`);
      return;
    }

    // 6. Bắt đầu parse file
    setIsParsing(true);

    try {
      const parsedResult = await parseImportFile(file, config);

      // 7. Lưu kết quả để render preview
      setResult(parsedResult);

      if (parsedResult.orders.length === 0) {
        setError("Không tìm thấy đơn hàng hợp lệ trong file.");
      } else if (parsedResult.errors.length > 0) {
        setError(
          `Đã đọc file nhưng có ${parsedResult.errors.length} dòng lỗi. ` +
            "Vui lòng kiểm tra danh sách lỗi trước khi đối soát.",
        );
      }
    } catch (err) {
      setResult(null);

      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi đọc file. Vui lòng thử lại.",
      );
    } finally {
      setIsParsing(false);
    }
  };

  const handleReconcile = async () => {
    if (!file || !result || isReconciling) return;

    if (result.orders.length === 0) {
      setReconcileMessage("Không có đơn hợp lệ để đối soát.");
      return;
    }

    if (result.errors.length > 0) {
      setReconcileMessage(
        "File còn dòng lỗi. Vui lòng xử lý lỗi và Preview lại trước khi đối soát.",
      );
      return;
    }

    setIsReconciling(true);
    setReconcileMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("source", source);

      const response = await fetch("/api/loyalty/reconcile/import", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.error ?? `Đối soát thất bại (HTTP ${response.status}).`,
        );
      }

      setReconcileMessage(
        payload?.message ?? "Đối soát đã được server xử lý thành công.",
      );
    } catch (err) {
      setReconcileMessage(
        err instanceof Error
          ? err.message
          : "Không thể thực hiện đối soát. Vui lòng thử lại.",
      );
    } finally {
      setIsReconciling(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={modal.openModal}>
        Import File
      </Button>

      <Modal isOpen={modal.isOpen} onClose={closeModal}>
        <div className="max-h-[85vh] overflow-y-auto p-1">
          <h2 className="mb-5 text-xl font-bold">Import đơn hàng tích điểm</h2>

          <div className="mb-4">
            <label
              htmlFor="loyalty-source"
              className="mb-2 block text-sm font-medium"
            >
              Nguồn dữ liệu
            </label>
            <Select
              id="loyalty-source"
              value={source}
              onChange={(event) =>
                handleSourceChange(event.target.value as LoyaltySource)
              }
              className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm dark:border-gray-700"
              type={"select"}
              options={[
                ...(Object.keys(SOURCE_LABELS) as LoyaltySource[]).map(
                  (sourceKey) => ({
                    value: sourceKey,
                    label: SOURCE_LABELS[sourceKey],
                  }),
                ),
              ]}
            />

            {!isConfigured && (
              <p className="mt-2 text-sm text-amber-600">
                Source này chưa thể import. Cần khai báo tên cột, trạng thái
                hoàn tất và quy tắc đọc dữ liệu trước.
              </p>
            )}
          </div>

          <div
            {...getRootProps()}
            className={`rounded-xl border border-dashed p-7 text-center transition ${
              isDragActive
                ? "border-blue-500 bg-blue-50 dark:bg-gray-800"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            } ${
              !isConfigured || isParsing
                ? "cursor-not-allowed opacity-60"
                : "cursor-pointer"
            }`}
          >
            <input {...getInputProps()} />

            <div className="text-sm font-medium">
              {isParsing
                ? "Đang đọc file..."
                : isDragActive
                  ? "Thả file vào đây"
                  : "Kéo thả file vào đây hoặc nhấn để chọn"}
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Hỗ trợ CSV, XLS, XLSX · Tối đa 10 MB
            </p>
          </div>

          {file && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
              <div className="font-medium break-all">{file.name}</div>
              <div className="mt-1 text-gray-500">
                {(file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          )}

          {fileRejections.length > 0 && (
            <p className="mt-3 text-sm text-red-500">
              File không hợp lệ hoặc vượt quá dung lượng cho phép.
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {result && (
            <section className="mt-5">
              <div className="flex gap-2 mb-2">
                <h3 className="mb-3 font-semibold">Kết quả kiểm tra</h3>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCheckFile}
                  disabled={!file || isParsing || isReconciling}
                  className="ml-auto"
                >
                  {isParsing ? "Đang kiểm tra..." : "Kiểm tra lại"}
                </Button>

                {result && (
                  <Button
                    size="sm"
                    onClick={handleReconcile}
                    disabled={
                      isParsing ||
                      isReconciling ||
                      result.orders.length === 0 ||
                      result.errors.length > 0
                    }
                  >
                    {isReconciling ? "Đang đối soát..." : "Tiến hành đối soát"}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Summary label="Tổng đơn hàng" value={result.totalRows} />
                <Summary label="Đơn hợp lệ" value={result.orders.length} />
                <Summary label="Bỏ qua" value={result.skippedRows} />
                <Summary label="Lỗi" value={result.errors.length} />
              </div>

              <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <Table
                  isEmpty={previewOrders.length === 0}
                  className="w-full min-w-[620px] text-left text-sm"
                >
                  <TableHeader
                    columns={[
                      { key: "orderNumber", title: "Mã đặt hàng" },
                      { key: "shortCode", title: "Mã đơn hàng ngắn" },
                      { key: "completedAt", title: "Hoàn tất lúc" },
                      { key: "paidAmount", title: "Doanh thu" },
                      { key: "points", title: "Điểm" },
                    ]}
                  />

                  <TableBody>
                    {previewOrders.map((order) => (
                      <TableRow
                        key={`${order.rowNumber}-${order.orderNumber}`}
                        className="border-t border-gray-200 dark:border-gray-700"
                      >
                        <TableCell>{order.orderNumber}</TableCell>
                        <TableCell>{order.shortCode}</TableCell>
                        <TableCell>
                          {new Date(order.completedAt).toLocaleString("vi-VN", {
                            timeZone: "Asia/Ho_Chi_Minh",
                          })}
                        </TableCell>
                        <TableCell>
                          {order.paidAmount.toLocaleString("vi-VN")} ₫
                        </TableCell>
                        <TableCell>{order.points.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {result.orders.length > 10 && (
                <p className="mt-2 text-xs text-gray-500">
                  Đang hiển thị {previewOrderLimit}/{result.orders.length} đơn
                  hợp lệ.
                  <button
                    onClick={() =>
                      previewOrderLimit === result.orders.length
                        ? setPreviewOrderLimit(10)
                        : setPreviewOrderLimit(result?.orders.length)
                    }
                    className="text-blue-400 underline ml-5"
                  >
                    {previewOrderLimit === result.orders.length
                      ? "Thu gọn hiển thị"
                      : "Hiển thị toàn bộ"}
                  </button>
                </p>
              )}

              {result.errors.length > 0 && (
                <details className="mt-4 rounded-lg border border-red-200 p-3">
                  <summary className="cursor-pointer text-sm font-medium text-red-600">
                    Xem {result.errors.length} dòng lỗi
                  </summary>

                  <ul className="mt-3 space-y-2 text-sm">
                    {result.errors.slice(0, 100).map((item) => (
                      <li key={`${item.rowNumber}-${item.message}`}>
                        <span className="font-medium">
                          Dòng {item.rowNumber}:
                        </span>{" "}
                        {item.message}
                      </li>
                    ))}
                  </ul>

                  {result.errors.length > 100 && (
                    <p className="mt-2 text-xs text-gray-500">
                      Chỉ hiển thị 100 lỗi đầu tiên.
                    </p>
                  )}
                </details>
              )}

              <p className="mt-3 text-xs text-gray-500">
                Đây là kết quả preview. Chưa có dữ liệu nào được ghi vào
                database.
              </p>
            </section>
          )}

          <div className="mt-5 flex justify-end">
            <Button variant="outline" size="sm" onClick={closeModal}>
              Đóng
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}
