import { ErrorCode } from "./error-codes";

export const errorMessageMap: Record<
  ErrorCode,
  { title: string; detailMessage?: string }
> = {
  [ErrorCode.DUPLICATE_DATA]: { title: "Dữ liệu đã tồn tại" },
  [ErrorCode.FOREIGN_KEY_INVALID]: { title: "Dữ liệu liên kết không hợp lệ" },
  [ErrorCode.MISSING_REQUIRED_FIELD]: {
    title: "Vui lòng nhập đầy đủ thông tin",
  },
  [ErrorCode.INVALID_INPUT]: { title: "Dữ liệu không hợp lệ" },
  [ErrorCode.NOT_FOUND]: { title: "Không tìm thấy dữ liệu" },
  [ErrorCode.CONNECTION_EXCEPTION]: {
    title: "Không thể kết nói",
    detailMessage:
      "Có vẻ như kết nối Internet của bạn đang không ổn định.\nVui lòng kiểm tra lại thiết bị mạng và thử lại sau ít phút",
  },
  [ErrorCode.FAILED]: { title: "Đã có lỗi xảy ra, vui lòng thử lại" },
};

export const mapErrorToMessage = (error: unknown): string => {
  if (!(error instanceof Error)) {
    return "Đã xảy ra lỗi không xác định";
  }

  const code = error.message as ErrorCode;

  return errorMessageMap[code].title ?? "Đã có lỗi xảy ra, vui lòng thử lại";
};
