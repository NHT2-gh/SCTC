export type LoyaltySource = "grabfood" | "xanhsm" | "befood";

export type DateFormat =
  | "excel"
  | "iso"
  | "yyyy-mm-dd hh:mm:ss"
  | "dd/mm/yyyy hh:mm:ss";

export type AmountFormat = "vi-VN" | "en-US";

export interface SourceImportConfig {
  source: LoyaltySource;

  // Tên cột thực tế trong file nguồn.
  columns: {
    orderNumber: string;
    completedAt: string;
    status: string;
    paidAmount: string;
  };

  completedStatuses: string[];
  dateFormat: DateFormat;
  amountFormat: AmountFormat;

  // Hệ số và cách làm tròn điểm có thể thay đổi theo source.
  pointsPerCurrencyUnit: number;
  pointsPrecision: number;

  // Có thể mở import khi đã cấu hình đủ các trường cần thiết.
  enabled: boolean;
}
export interface ImportedOrder {
  orderNumber: string;
  completedAt: string;
  status: string;
  paidAmount: number;
  points: number;
  source: SourceImportConfig["source"];
  rowNumber: number;
}

export interface ImportRowError {
  rowNumber: number;
  message: string;
}

export interface ImportResult {
  orders: ImportedOrder[];
  errors: ImportRowError[];
  totalRows: number;
  skippedRows: number;
  duplicateRows: number;
}

export const IMPORT_CONFIGS: Record<LoyaltySource, SourceImportConfig> = {
  grabfood: {
    source: "grabfood",
    columns: {
      orderNumber: "Mã đơn hàng ngắn",
      completedAt: "Cập nhật vào",
      status: "Trạng thái",
      paidAmount: "Doanh thu ròng",
    },
    completedStatuses: ["Đã hoàn tất", "Đã hoàn thành"],
    dateFormat: "dd/mm/yyyy hh:mm:ss",
    amountFormat: "vi-VN",
    pointsPerCurrencyUnit: 30_000,
    pointsPrecision: 2,
    enabled: true,
  },

  xanhsm: {
    source: "xanhsm",
    columns: {
      orderNumber: "",
      completedAt: "",
      status: "",
      paidAmount: "",
    },
    completedStatuses: [],
    dateFormat: "iso",
    amountFormat: "vi-VN",
    pointsPerCurrencyUnit: 30_000,
    pointsPrecision: 2,
    enabled: false,
  },

  befood: {
    source: "befood",
    columns: {
      orderNumber: "",
      completedAt: "",
      status: "",
      paidAmount: "",
    },
    completedStatuses: [],
    dateFormat: "dd/mm/yyyy hh:mm:ss",
    amountFormat: "vi-VN",
    pointsPerCurrencyUnit: 30_000,
    pointsPrecision: 2,
    enabled: false,
  },
};

export function isImportConfigComplete(config: SourceImportConfig): boolean {
  const requiredColumns = Object.values(config.columns);

  return (
    config.enabled &&
    requiredColumns.every((column) => column.trim().length > 0) &&
    config.completedStatuses.length > 0 &&
    config.pointsPerCurrencyUnit > 0
  );
}

export function isValidSourceFileName(
  fileName: string,
  source: LoyaltySource,
): boolean {
  const normalizedName = fileName.trim().toLowerCase();
  const validExtensions = [".csv", ".xls", ".xlsx"];

  const hasValidPrefix = normalizedName.startsWith(`${source}-`);
  const hasValidExtension = validExtensions.some((extension) =>
    normalizedName.endsWith(extension),
  );

  return hasValidPrefix && hasValidExtension;
}
