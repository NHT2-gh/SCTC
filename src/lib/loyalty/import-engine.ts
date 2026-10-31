import * as XLSX from "xlsx";
import {
  ImportResult,
  isImportConfigComplete,
  isValidSourceFileName,
  type SourceImportConfig,
} from "@/lib/loyalty/import-config";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ROWS = 50_000;
const HEADER_SCAN_LIMIT = 30;

function normalizeText(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFC")
    .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeStatus(value: unknown): string {
  return (
    String(value ?? "")
      // Chuẩn hóa Unicode tiếng Việt
      .normalize("NFC")
      // Xóa ký tự điều khiển và ký tự vô hình
      .replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\uFEFF]/g, "")
      // Chuẩn hóa khoảng trắng liên tiếp
      .replace(/\s+/g, " ")
      .trim()
      .toLocaleLowerCase("vi-VN")
  );
}

function normalizeHeader(value: unknown): string {
  return normalizeText(value).toLocaleLowerCase("vi-VN");
}

function isEmptyRow(row: unknown[]): boolean {
  return row.every(
    (cell) => cell === null || cell === undefined || normalizeText(cell) === "",
  );
}

function parseAmount(
  value: unknown,
  format: SourceImportConfig["amountFormat"],
): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) && value >= 0 ? value : null;
  }

  let text = normalizeText(value);
  if (!text) return null;

  // Xóa ký hiệu tiền tệ và khoảng trắng, nhưng giữ dấu âm
  // để từ chối số tiền âm bên dưới.
  text = text.replace(/[^\d.,+-]/g, "");

  if (!text || !/\d/.test(text)) return null;

  if (format === "vi-VN") {
    // Ví dụ: 85.000 hoặc 85.000,50
    if (text.includes(",")) {
      text = text.replace(/\./g, "").replace(",", ".");
    } else {
      // Theo quy ước VN, dấu chấm được coi là phân cách hàng nghìn.
      text = text.replace(/\./g, "");
    }
  } else {
    // Ví dụ: 85,000.50
    if (text.includes(".")) {
      text = text.replace(/,/g, "");
    } else if (text.includes(",")) {
      text = text.replace(",", ".");
    }
  }

  const amount = Number(text);

  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function isValidDateParts(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
): boolean {
  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    !Number.isInteger(hour) ||
    !Number.isInteger(minute) ||
    !Number.isInteger(second) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59 ||
    second < 0 ||
    second > 59
  ) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

// File nguồn đang dùng giờ Việt Nam (UTC+7).
// Trả về ISO UTC để dữ liệu lưu database không phụ thuộc timezone máy chạy.
function vietnamTimeToIso(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
): string | null {
  if (!isValidDateParts(year, month, day, hour, minute, second)) {
    return null;
  }

  const utcMillis =
    Date.UTC(year, month - 1, day, hour, minute, second) - 7 * 60 * 60 * 1000;

  return new Date(utcMillis).toISOString();
}

function parseDate(
  value: unknown,
  format: SourceImportConfig["dateFormat"],
): string | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return value.toISOString();
  }

  if (typeof value === "number" && format === "excel") {
    const parts = XLSX.SSF.parse_date_code(value);
    if (!parts) return null;

    return vietnamTimeToIso(
      parts.y,
      parts.m,
      parts.d,
      parts.H ?? 0,
      parts.M ?? 0,
      Math.floor(parts.S ?? 0),
    );
  }

  const text = normalizeText(value);
  if (!text) return null;

  // ISO timestamp có timezone rõ ràng.
  if (
    format === "iso" &&
    /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/i.test(text)
  ) {
    const timestamp = Date.parse(text);
    return Number.isNaN(timestamp) ? null : new Date(timestamp).toISOString();
  }

  // Cho phép ISO date/time không kèm timezone, hiểu là giờ Việt Nam.
  if (format === "iso" || format === "yyyy-mm-dd hh:mm:ss") {
    const match = text.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?$/,
    );

    if (match) {
      return vietnamTimeToIso(
        Number(match[1]),
        Number(match[2]),
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6] ?? 0),
      );
    }
  }

  if (format === "dd mmm yyyy h:mm a") {
    const match = text.match(
      /^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM)$/i,
    );

    if (!match) return null;

    const [, dayText, monthText, yearText, hourText, minuteText, period] =
      match;

    const months: Record<string, number> = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12,
    };

    const day = Number(dayText);
    const month = months[monthText.toLowerCase()];
    const year = Number(yearText);
    const hour12 = Number(hourText);
    const minute = Number(minuteText);

    if (
      month === undefined ||
      hour12 < 1 ||
      hour12 > 12 ||
      minute < 0 ||
      minute > 59
    ) {
      return null;
    }

    const hour24 = (hour12 % 12) + (period.toUpperCase() === "PM" ? 12 : 0);

    return vietnamTimeToIso(year, month, day, hour24, minute, 0);
  }

  return null;
}

function findHeaderRow(
  rows: unknown[][],
  config: SourceImportConfig,
): { headerIndex: number; columnIndexes: Record<string, number> } | null {
  const expectedColumns = Object.entries(config.columns).map(
    ([field, columnName]) => ({
      field,
      name: normalizeHeader(columnName),
    }),
  );

  const scanLimit = Math.min(rows.length, HEADER_SCAN_LIMIT);

  for (let rowIndex = 0; rowIndex < scanLimit; rowIndex++) {
    const row = rows[rowIndex] ?? [];
    const headerIndexes = new Map<string, number>();

    row.forEach((cell, index) => {
      const name = normalizeHeader(cell);
      if (name && !headerIndexes.has(name)) {
        headerIndexes.set(name, index);
      }
    });

    const columnIndexes: Record<string, number> = {};
    let allFound = true;

    for (const column of expectedColumns) {
      const index = headerIndexes.get(column.name);

      if (index === undefined) {
        allFound = false;
        break;
      }

      columnIndexes[column.field] = index;
    }

    if (allFound) {
      return { headerIndex: rowIndex, columnIndexes };
    }
  }

  return null;
}

function getCell(
  row: unknown[],
  columnIndexes: Record<string, number>,
  field: string,
): unknown {
  return row[columnIndexes[field]];
}

function roundPoints(value: number, precision: number): number {
  const multiplier = 10 ** precision;
  return Math.floor((value + Number.EPSILON) * multiplier) / multiplier;
}

export async function parseImportFile(
  file: File,
  config: SourceImportConfig,
): Promise<ImportResult> {
  const result: ImportResult = {
    orders: [],
    errors: [],
    totalRows: 0,
    skippedRows: 0,
    duplicateRows: 0,
  };

  if (!isValidSourceFileName(file.name, config.source)) {
    throw new Error(
      `Tên file không hợp lệ. File phải bắt đầu bằng "${config.source}-" ` +
        `và có định dạng CSV, XLS hoặc XLSX.`,
    );
  }

  if (!isImportConfigComplete(config)) {
    throw new Error(
      `Chưa cấu hình đầy đủ quy tắc import cho source "${config.source}".`,
    );
  }

  if (file.size === 0) {
    throw new Error("File đang trống.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Dung lượng file tối đa là 10 MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase();
  if (!extension || !["csv", "xls", "xlsx"].includes(extension)) {
    throw new Error("Chỉ hỗ trợ file CSV, XLS hoặc XLSX.");
  }

  const buffer = await file.arrayBuffer();

  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: false,
  });

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error("File không có sheet dữ liệu.");
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json<unknown[]>(sheet, {
    header: 1,
    defval: null,
    raw: true,
    blankrows: false,
  });

  const header = findHeaderRow(rows, config);

  if (!header) {
    const expected = Object.values(config.columns).join(", ");
    throw new Error(`Không tìm thấy đủ các cột bắt buộc: ${expected}`);
  }

  const dataRows = rows.slice(header.headerIndex + 1);

  if (dataRows.length > MAX_ROWS) {
    throw new Error(
      `File vượt quá giới hạn ${MAX_ROWS.toLocaleString()} dòng.`,
    );
  }

  const completedStatuses = new Set(
    config.completedStatuses.map(normalizeStatus),
  );
  const seenOrderNumbers = new Set<string>();

  for (let index = 0; index < dataRows.length; index++) {
    const row = dataRows[index];
    const rowNumber = header.headerIndex + index + 2;

    if (isEmptyRow(row)) {
      continue;
    }

    result.totalRows++;

    const status = normalizeText(getCell(row, header.columnIndexes, "status"));

    const orderNumber = normalizeText(
      getCell(row, header.columnIndexes, "orderNumber"),
    );

    const completedAt = parseDate(
      getCell(row, header.columnIndexes, "completedAt"),
      config.dateFormat,
    );

    const paidAmount = parseAmount(
      getCell(row, header.columnIndexes, "paidAmount"),
      config.amountFormat,
    );

    const shortCode = normalizeText(
      getCell(row, header.columnIndexes, "shortCode"),
    );

    const rowErrors: string[] = [];

    if (
      !completedStatuses.has(normalizeStatus(status)) ||
      !orderNumber ||
      paidAmount === null
    ) {
      result.skippedRows++;
      continue;
    }

    if (seenOrderNumbers.has(orderNumber)) {
      rowErrors.push(`Mã đơn hàng bị trùng: ${orderNumber}.`);
      result.duplicateRows++;
    }

    if (!completedAt) {
      rowErrors.push("Ngày giờ hoàn tất không hợp lệ.");
    }

    if (rowErrors.length > 0) {
      result.errors.push({
        rowNumber,
        message: rowErrors.join(" "),
      });
      continue;
    }

    seenOrderNumbers.add(orderNumber);

    const points = roundPoints(
      (paidAmount ?? 0) / config.pointsPerCurrencyUnit,
      config.pointsPrecision,
    );

    if (completedAt && paidAmount) {
      result.orders.push({
        orderNumber,
        completedAt,
        status,
        paidAmount,
        points,
        source: config.source,
        rowNumber,
        shortCode,
      });
    }
  }

  return result;
}
