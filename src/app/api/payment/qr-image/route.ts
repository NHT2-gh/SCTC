import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { message: "Missing image URL" },
        { status: 400 },
      );
    }

    const parsedUrl = new URL(url);

    // Chỉ cho phép lấy ảnh từ VietQR.
    if (
      parsedUrl.protocol !== "https:" ||
      parsedUrl.hostname !== "api.vietqr.io" ||
      !parsedUrl.pathname.startsWith("/image/")
    ) {
      return NextResponse.json(
        { message: "Invalid image URL" },
        { status: 400 },
      );
    }

    const response = await fetch(parsedUrl.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Cannot fetch QR image" },
        { status: response.status },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { message: "Invalid image response" },
        { status: 502 },
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[QR Proxy Error]", error);

    return NextResponse.json(
      { message: "QR image proxy failed" },
      { status: 500 },
    );
  }
}
