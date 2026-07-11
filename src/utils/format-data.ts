export function formatDate(date: Date): string {
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatCurrency(price: number): string {
  return Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export const formatDateTime = (
  dateString?: string | null,
  options?: {
    withTime?: boolean;
    formatString?: "dd-mm-yyyy" | "yyyy-mm-dd";
  },
): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "-";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  if (!options?.withTime) {
    if (options?.formatString === "dd-mm-yyyy")
      return `${day}-${month}-${year}`;
    else return `${year}-${month}-${day}`;
  }

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const formatDateTimev2 = (
  dateString?: string | null,
  options?: {
    withTime?: boolean;
    formatString?: "dd-mm-yyyy" | "yyyy-mm-dd";
  },
): string => {
  if (!dateString) return "-";

  // Hỗ trợ:
  // 2026-07-11T18:00:00+00:00
  // 2026-07-11 18:00:00+00:00
  // 2026-07-11T18:00:00Z
  const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);

  if (!match) return "-";

  const [, year, month, day, hours, minutes] = match;

  const date =
    options?.formatString === "yyyy-mm-dd"
      ? `${year}-${month}-${day}`
      : `${day}-${month}-${year}`;

  if (!options?.withTime) {
    return date;
  }

  return `${date} ${hours}:${minutes}`;
};

export async function convertBlobUrlToFile(blobUrl: string) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`, {
    type: mimeType,
  });
  return file;
}
