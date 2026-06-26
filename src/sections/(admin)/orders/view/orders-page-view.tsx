"use client";
import { MainContainer } from "@/components/common/page-layout";
import {
  useGetAllOrder,
  useUpdateOrderStatus,
} from "@/hooks/queries/use-order";
import { OrderStatus } from "@/types/order";
import React, { useEffect, useState } from "react";
import OrderItemCard from "../components/order-item";
import { showToast } from "@/lib/toast";
import { useModal } from "@/hooks/useModal";
import { ModalViewOrder } from "../components";

export default function OrdersPageView() {
  const { data: orders, isPending, isLoading } = useGetAllOrder();
  const updateOrderStatus = useUpdateOrderStatus();
  const modalViewOrder = useModal();
  const [orderSelected, setOrderSelected] = useState<string>();

  useEffect(() => {
    if (orderSelected) modalViewOrder.openModal();
  }, [orderSelected]);

  if (isLoading) return <div>Loading...</div>;

  if (isPending || !orders) return <div>No orders</div>;

  const handleUpdateStatus = async (order_id: string, status: OrderStatus) => {
    try {
      const result = await updateOrderStatus.mutateAsync({
        order_id: order_id,
        status: status,
      });
      if (result.success) {
        showToast.success({ title: "Order updated successfully" });
      }
    } catch (error) {
      showToast.error({ title: "Error updating order" });
    }
  };

  return (
    <>
      <MainContainer title={"Orders"}>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders?.data.map((order) => (
            <OrderItemCard
              key={order.tracking_order}
              order={order}
              onSelected={(orderId) => {
                setOrderSelected(orderId);
              }}
              onConfirm={(orderId) => {
                handleUpdateStatus(orderId, OrderStatus.CONFIRMED);
              }}
            />
          ))}
        </div>
      </MainContainer>

      {modalViewOrder.isOpen && orderSelected && (
        <ModalViewOrder
          isOpen={modalViewOrder.isOpen}
          onClose={modalViewOrder.closeModal}
          trackingCode={orderSelected}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </>
  );
}
