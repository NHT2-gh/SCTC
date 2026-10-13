import Reac from "react";

export interface DataStateProps {
  isLoading?: boolean;
  isEmpty?: boolean;
  isError?: boolean;
}

export default function DataState({
  isLoading,
  isEmpty,
  isError,
}: DataStateProps) {
  const messageData = isLoading
    ? "Đang tải dữ liệu ..."
    : isError
      ? "Lỗi khi tải dữ liệu."
      : isEmpty
        ? "Không tìm thấy dữ liệu."
        : null;

  return messageData ? (
    <div className="w-full text-center text-sm font-normal text-gray-600 dark:text-gray-400 italic">
      {messageData}
    </div>
  ) : null;
}
