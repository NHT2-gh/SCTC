"use client";
import { MainContainer } from "@/components/common/page-layout";
import {
  useGetAllOrder,
  useUpdateOrderStatus,
} from "@/hooks/queries/use-order";
import { OrderStatus } from "@/types/order";
import React, { useEffect } from "react";
import OrderItemCard from "../components/order-item";
import { showToast } from "@/lib/toast";
import { useModal } from "@/hooks/useModal";
import { FilterStatus, ModalViewOrder } from "../components";
import { useFilter } from "@/hooks/use-filter";
import { useUrlState } from "@/hooks/use-url-state";
import { FormField } from "@/components/form";
import { useGetTable } from "@/hooks/queries/use-overview";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format-data";

export default function OrdersPageView() {
  const modalViewOrder = useModal();
  const { data: tables } = useGetTable();
  const updateOrderStatus = useUpdateOrderStatus();
  const [orderIdView, setOrderIdView] = useUrlState("view_order", "");
  const { filterValues, updateFilter, removeFilter, clearFilters } = useFilter({
    filterConfigs: [
      {
        type: "checkbox",
        key: "status",
        options: Object.entries(OrderStatus).map(([key, value]) => ({
          label: value,
          value: key,
        })),
      },
    ],
    initSubmit: true,
  });
  const { data: orders, refetch: refetchOrders } = useGetAllOrder({
    filters: filterValues,
  });

  useEffect(() => {
    if (orderIdView) modalViewOrder.openModal();
  }, [orderIdView, setOrderIdView]);

  const handleUpdateStatus = async (
    tracking_orders: string[],
    status: OrderStatus,
  ) => {
    try {
      const result = await updateOrderStatus.mutateAsync({
        trackingCodes: tracking_orders,
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
        <div className="relative space-y-2">
          <FilterStatus
            filterValues={filterValues}
            updateFilter={updateFilter}
            removeFilter={removeFilter}
            countOrder={orders?.data.length}
          />

          {tables?.data && (
            <div className="flex items-center gap-4">
              <FormField
                className="w-full md:w-[18.75rem]"
                field={{
                  type: "select",
                  name: "tableId",
                  placeholder: "Select table",
                  handleOnChange: (value: string) => {
                    updateFilter("table_id", Number(value));
                  },
                  options: tables?.data.map((table) => {
                    return {
                      label: table.name,
                      value: Number(table.id),
                    };
                  }),
                }}
              />

              <Button variant="outline" onClick={() => refetchOrders()}>
                Refetch
              </Button>

              <Button onClick={() => clearFilters()} className="w-fit">
                Clear
              </Button>
            </div>
          )}

          <div className="w-full py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:max-h-[65vh] max-h-[60vh] overflow-y-scroll ">
            {orders?.data.map((order) => (
              <OrderItemCard
                key={order.tracking_order}
                order={order}
                onSelected={(orderId) => {
                  setOrderIdView(orderId);
                }}
                onConfirm={(orderId) => {
                  handleUpdateStatus([orderId], OrderStatus.CONFIRMED);
                }}
                onCancel={(orderId) => {
                  handleUpdateStatus([orderId], OrderStatus.CANCELLED);
                }}
              />
            ))}
          </div>
        </div>
        {orders?.data && filterValues["status"] === OrderStatus.DONE && (
          <div className="p-2 bg-white absolute bottom-4 right-10 border border-brand-500 border-dashed rounded-lg">
            <h3 className="font-bold">
              Total Amount:
              <span className="ml-2 text-brand-500">
                {formatCurrency(
                  orders?.data.reduce(
                    (acc, order) => acc + order.subtotal,
                    0,
                  ) || 0,
                )}
              </span>
            </h3>

            {orders?.data && (
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleUpdateStatus(
                    orders.data.map((oder) => oder.tracking_order) || [],
                    OrderStatus.COMPLETED,
                  )
                }
                className="w-full mt-2 bg-lime-200"
              >
                Đã thanh toán
              </Button>
            )}
          </div>
        )}
      </MainContainer>

      {modalViewOrder.isOpen && orderIdView && (
        <ModalViewOrder
          isOpen={modalViewOrder.isOpen}
          onClose={() => {
            modalViewOrder.closeModal();
            setOrderIdView(undefined);
          }}
          trackingCode={orderIdView}
          onUpdateStatus={(trackingCode, status) =>
            handleUpdateStatus([trackingCode], status)
          }
        />
      )}
    </>
  );
}
