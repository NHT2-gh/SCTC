import { orderService } from "@/services/order.service";
import { ServerActionResponse } from "@/types/common";
import { OrderDetail } from "@/types/order";
import { mapErrorToMessage } from "../error/app-error";

export async function serverActionGetOrderDetail(
  trackingCode: string,
): Promise<ServerActionResponse<OrderDetail | null>> {
  try {
    const result = await orderService.getOrderDetail(trackingCode);

    return {
      data: result.data,
      message: result.message,
      error: result.message!,
      success: result.success,
    };
  } catch (error) {
    return {
      data: null,
      message: "Failed to get order detail",
      error: mapErrorToMessage(error),
      success: false,
    };
  }
}
