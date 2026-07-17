import { mapErrorToMessage } from "@/lib/error/app-error";
import { createPayment } from "@/lib/momo/create-payment";
import { PaymentType } from "@/types/order";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trackingCodes, paymentType, tableId } = body;

    if (!trackingCodes) {
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

    const payment = await createPayment(trackingCodes, paymentType, tableId);

    console.log(payment);
    return NextResponse.json({
      success: true,
      data: payment,
    });
  } catch (error) {
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
