import * as htmlToImage from "html-to-image";

type CopyResult = {
  success: boolean;
  method: "clipboard" | "download" | "none";
  error?: unknown;
};

const canUseClipboard = () => {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    window.isSecureContext &&
    typeof navigator.clipboard?.write === "function" &&
    typeof ClipboardItem !== "undefined"
  );
};

const createImageBlob = async (node: HTMLElement): Promise<Blob> => {
  const blob = await htmlToImage.toBlob(node, {
    pixelRatio: 2,
    backgroundColor: "#fff",
  });

  if (!blob) {
    throw new Error("Failed to generate bill image");
  }

  return blob;
};

const downloadImage = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  a.style.display = "none";

  document.body.appendChild(a);

  try {
    a.click();
  } finally {
    a.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 3000);
  }
};

export const useCopyImage = () => {
  const isMobile =
    typeof navigator !== "undefined" &&
    /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const copyImage = async (
    node: HTMLElement | null,
    fileName: string,
  ): Promise<CopyResult> => {
    if (!node) {
      return {
        success: false,
        method: "none",
        error: new Error("Bill element not found"),
      };
    }

    // Bắt đầu tạo ảnh ngay trong lần click.
    const blobPromise = createImageBlob(node);

    // Thử Clipboard trước nếu trình duyệt hỗ trợ.
    if (canUseClipboard()) {
      try {
        const item = new ClipboardItem({
          "image/png": blobPromise,
        });

        await navigator.clipboard.write([item]);

        return {
          success: true,
          method: "clipboard",
        };
      } catch (clipboardError) {
        console.warn("[SCTC] Clipboard failed:", clipboardError);

        // Kiểm tra xem nguyên nhân có phải do tạo ảnh không.
        try {
          const blob = await blobPromise;

          // Clipboard bị chặn nhưng ảnh vẫn tạo được.
          downloadImage(blob, fileName);

          return {
            success: true,
            method: "download",
            error: clipboardError,
          };
        } catch (imageError) {
          console.error("[SCTC] Image generation failed:", imageError);

          return {
            success: false,
            method: "none",
            error: imageError,
          };
        }
      }
    }

    // Không hỗ trợ Clipboard hoặc không phải secure context.
    try {
      const blob = await blobPromise;

      downloadImage(blob, fileName);

      return {
        success: true,
        method: "download",
      };
    } catch (error) {
      console.error("[SCTC] Image generation failed:", error);

      return {
        success: false,
        method: "none",
        error,
      };
    }
  };

  return {
    copyImage,
    isMobile,
  };
};
