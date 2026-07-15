import { createPayment } from "@/lib/momo/create-payment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.trackingCode) {
      return NextResponse.json(
        {
          success: false,
          message: "trackingCode is required",
        },
        {
          status: 400,
        },
      );
    }

    const payment = await createPayment(body.trackingCode);

    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("[MoMo Create Payment]", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
