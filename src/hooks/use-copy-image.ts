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
    typeof navigator.clipboard?.write === "function" &&
    typeof ClipboardItem !== "undefined"
  );
};

const downloadImage = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = fileName;
  a.style.display = "none";

  document.body.appendChild(a);

  try {
    a.click();
  } catch (event) {
    console.log(event);
  } finally {
    a.remove();

    // Cho trình duyệt thời gian xử lý download.
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }
};

const createImageBlob = (node: HTMLElement): Promise<Blob> => {
  return htmlToImage
    .toBlob(node, {
      pixelRatio: 2,
      backgroundColor: "#fff",
    })
    .then((blob) => {
      if (!blob) {
        throw new Error("Failed to generate image");
      }

      return blob;
    });
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
        error: new Error("Node not found"),
      };
    }

    try {
      // Tạo Promise nhưng chưa await, để có thể gọi clipboard
      // ngay trong lượt xử lý click của người dùng.
      const blobPromise = createImageBlob(node);

      if (canUseClipboard()) {
        try {
          const item = new ClipboardItem({
            "image/png": blobPromise,
          });

          // Gọi write trước khi await quá trình render ảnh.
          await navigator.clipboard.write([item]);

          return {
            success: true,
            method: "clipboard",
          };
        } catch (clipboardError) {
          console.log(clipboardError);
          // Clipboard thất bại: thử tải ảnh xuống.
          try {
            const blob = await blobPromise;
            downloadImage(blob, fileName);

            return {
              success: true,
              method: "download",
              error: clipboardError,
            };
          } catch (fallbackError) {
            return {
              success: false,
              method: "none",
              error: fallbackError,
            };
          }
        }
      }

      // Trình duyệt không hỗ trợ clipboard.
      const blob = await blobPromise;
      downloadImage(blob, fileName);

      return {
        success: true,
        method: "download",
      };
    } catch (error) {
      return {
        success: false,
        method: "none",
        error: "Copy image failed",
      };
    }
  };

  return {
    copyImage,
    isMobile,
  };
};
