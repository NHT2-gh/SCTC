import { orderService } from "@/services/order.service";
import { ServerActionResponse } from "@/types/common";
import { OrderDetail } from "@/types/order";
import { mapErrorToMessage } from "../error/app-error";
import { ErrorCode } from "../error/error-codes";

export async function serverActionGetOrderDetail(
  trackingCode: string,
): Promise<ServerActionResponse<OrderDetail | null>> {
  try {
    const result = await orderService.getOrderDetail(trackingCode);

    return {
      data: result.data,
      success: result.success,
      error: result.success
        ? null
        : {
            code: ErrorCode.FAILED,
            message: mapErrorToMessage(ErrorCode.FAILED),
          },
    };
  } catch (error) {
    return {
      data: null,
      success: false,
      error: { message: mapErrorToMessage(error) },
    };
  }
}
