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
import { FilterStatus, ModalViewOrder } from "../components";
import { useFilter } from "@/hooks/use-filter";
import { useUrlState } from "@/hooks/use-url-state";
import { FormField } from "@/components/form";
import { useGetTable } from "@/hooks/queries/use-overview";
import { Button } from "@/components/ui/button";

export default function OrdersPageView() {
  const modalViewOrder = useModal();
  const { data: tables } = useGetTable();
  const [orderIdView, setOrderIdView] = useUrlState("view_order", "");
  const updateOrderStatus = useUpdateOrderStatus();
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
  }, [orderIdView]);

  const handleUpdateStatus = async (
    tracking_order: string,
    status: OrderStatus,
  ) => {
    try {
      const result = await updateOrderStatus.mutateAsync({
        trackingCode: tracking_order,
        status: status,
      });

      if (result.success) {
        showToast.success({ title: "Order updated successfully" });
        refetchOrders();
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
            <div className="flex items-center justify-between">
              <FormField
                className="w-full md:w-fit"
                field={{
                  type: "select",
                  name: "tableId",
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

              <Button onClick={() => clearFilters()} className="w-fit">
                Clear
              </Button>
            </div>
          )}

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-scroll ">
            {orders?.data.map((order) => (
              <OrderItemCard
                key={order.tracking_order}
                order={order}
                onSelected={(orderId) => {
                  setOrderIdView(orderId);
                }}
                onConfirm={(orderId) => {
                  handleUpdateStatus(orderId, OrderStatus.CONFIRMED);
                }}
                onCancel={(orderId) => {
                  handleUpdateStatus(orderId, OrderStatus.CANCELLED);
                }}
              />
            ))}
          </div>
        </div>
      </MainContainer>

      {modalViewOrder.isOpen && orderIdView && (
        <ModalViewOrder
          isOpen={modalViewOrder.isOpen}
          onClose={() => {
            modalViewOrder.closeModal();
            setOrderIdView(undefined);
          }}
          trackingCode={orderIdView}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </>
  );
}
