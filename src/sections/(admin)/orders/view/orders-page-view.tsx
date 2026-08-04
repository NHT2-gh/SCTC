"use client";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { BrushCleaning, FilterIcon, RotateCw } from "lucide-react";
import {
  useGetAllOrder,
  useUpdateOrderStatus,
} from "@/hooks/queries/use-order";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/toast";
import { useModal } from "@/hooks/useModal";
import { FormField } from "@/components/form";
import { useFilter } from "@/hooks/use-filter";
import { Button } from "@/components/ui/button";
import { useUrlState } from "@/hooks/use-url-state";
import { formatCurrency } from "@/utils/format-data";
import OrderItemCard from "../components/order-item";
import { useGetTable } from "@/hooks/queries/use-overview";
import { FilterStatus, ModalViewOrder } from "../components";
import { MainContainer } from "@/components/common/page-layout";
import { OrderStatus, PaymentMethod, PaymentType } from "@/types/order";
import { FilterBoxRender } from "@/components/filter/filter-box-render";
import { orderFilterConfig } from "@/schemas/filter-schemas/order-schema";

export default function OrdersPageView() {
  const modalViewOrder = useModal();
  const { data: tables } = useGetTable();
  const updateOrderStatus = useUpdateOrderStatus();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [orderView, setOrderView] = useUrlState("view_order", "");
  const { filterValues, updateFilter, removeFilter, clearFilters } = useFilter({
    filterConfigs: orderFilterConfig,
    initSubmit: true,
  });
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const { data: orders, refetch: refetchOrders } = useGetAllOrder({
    filters: filterValues,
    page: 1,
    limit: 100,
  });
  const [orderIdsSelected, setIdsOrderSelected] = useState<string[]>([]);

  useEffect(() => {
    setIdsOrderSelected(
      filterValues["status"] === OrderStatus.DONE && filterValues["table_id"]
        ? orders?.data.map((oder) => oder.id) || []
        : [],
    );
  }, [filterValues["status"]]);

  useEffect(() => {
    if (orderView) modalViewOrder.openModal();
  }, [orderView, orderView]);

  const handleUpdateStatus = async (ids: string[], status: OrderStatus) => {
    try {
      const result = await updateOrderStatus.mutateAsync({
        ids: ids,
        status: status,
      });

      if (result.success) {
        refetchOrders();

        showToast.success({ title: "Order updated successfully" });
      }
    } catch (error) {
      showToast.error({ title: "Error updating order" });
    }
  };

  const handlePayment = async () => {
    if (orderIdsSelected.length === 0) {
      showToast.error({ title: "Vui lòng chọn đơn hàng cần thanh toán" });
      return;
    }

    try {
      const result = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: orderIdsSelected,
          paymentType:
            orderIdsSelected.length === 1
              ? PaymentType.INDIVIDUAL
              : PaymentType.GROUP,
          tableId: filterValues["table_id"],
          paymentMethod: PaymentMethod.QR,
        }),
      });

      const data = await result.json();

      if (data.success && data.data.qrUrl) {
        setQrUrl(data.data.qrUrl);
      } else {
        showToast.error({
          title: data.message || "Tạo liên kết thanh toán thất bại",
        });
      }
    } catch (error) {
      console.error(error);
      showToast.error({ title: "Lỗi kết nối đến máy chủ" });
    }
  };

  return (
    <>
      <MainContainer title={"Orders"}>
        <div className="relative flex flex-col gap-2">
          <FilterStatus
            filterValues={filterValues}
            updateFilter={updateFilter}
            removeFilter={removeFilter}
            countOrder={orders?.data.length}
          />

          <div className="flex items-center gap-4">
            <Button
              onClick={() => {
                setFiltersOpen(!filtersOpen);
              }}
              className="grow "
            >
              <FilterIcon /> Filter
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                refetchOrders();
                setQrUrl(null);
              }}
              className="shrink-0"
            >
              <RotateCw />
            </Button>

            <Button
              onClick={() => {
                filterValues.length !== 0 && clearFilters();
                orderIdsSelected.length !== 0 && setIdsOrderSelected([]);
              }}
              variant="outline"
              disabled={
                filterValues.length === 0 && orderIdsSelected.length === 0
              }
              className="shrink-0"
            >
              <BrushCleaning />
            </Button>
          </div>

          {filtersOpen && (
            <FilterBoxRender
              filterConfigs={orderFilterConfig}
              handleFilterChange={updateFilter}
              handleClearAllFilters={clearFilters}
              filterValues={filterValues}
            >
              {tables?.data && (
                <FormField
                  className="w-full md:w-[18.75rem]"
                  field={{
                    type: "select",
                    name: "tableId",
                    placeholder: "Select table",
                    label: "Bàn",
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
              )}
            </FilterBoxRender>
          )}

          <div className="w-full grow p-2 pb-[4.75rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[63vh] overflow-y-scroll">
            {orders?.data.map((order) => (
              <div
                key={order.id}
                className={cn(
                  "bg-white",
                  orderIdsSelected.includes(order.id) &&
                    "rounded-lg bg-green-50",
                )}
              >
                <OrderItemCard
                  order={order}
                  onSelected={(orderId) => {
                    setIdsOrderSelected((prev) => {
                      if (prev.includes(orderId)) {
                        return prev.filter((id) => id !== orderId);
                      }
                      return [...prev, orderId];
                    });
                  }}
                  onViewed={(trackingCode) => {
                    setOrderView(trackingCode);
                  }}
                  onConfirm={(orderId) => {
                    handleUpdateStatus([orderId], OrderStatus.CONFIRMED);
                  }}
                  onCancel={(orderId) => {
                    handleUpdateStatus([orderId], OrderStatus.CANCELLED);
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {orders?.data && (
          <div className="p-2 bg-white absolute bottom-4 left-10 right-10 border md:left-[unset] md:max-w-[300px] border-brand-500 border-dashed rounded-lg">
            {orderIdsSelected.length > 0 && (
              <h3 className="font-bold">
                Selected: {orderIdsSelected.length} orders
              </h3>
            )}

            <h3 className="font-bold">
              Total Amount:
              <span className="ml-2 text-brand-500">
                {formatCurrency(
                  orderIdsSelected.reduce((acc, orderId) => {
                    const orderData = orders?.data.find(
                      (order) => order.id === orderId,
                    );
                    return acc + (orderData?.subtotal || 0);
                  }, 0),
                )}
              </span>
            </h3>

            <Button
              size="sm"
              variant="outline"
              disabled={filterValues["status"] === OrderStatus.COMPLETED}
              onClick={() => handlePayment()}
              className="w-full mt-2 bg-lime-200"
            >
              Thanh toán
            </Button>

            {qrUrl && (
              <div className="mt-2 w-fit mx-auto rounded-lg overflow-hidden">
                <Link href={qrUrl} target="_blank">
                  <Image src={qrUrl} alt="QR Code" width={200} height={200} />
                </Link>
                <button
                  className="w-full mt-2 bg-lime-200 rounded-lg px-2 py-1"
                  onClick={() => {
                    handleUpdateStatus(orderIdsSelected, OrderStatus.COMPLETED);
                    setQrUrl(null);
                  }}
                >
                  Đã nhận tiền.
                </button>
              </div>
            )}
          </div>
        )}
      </MainContainer>

      {modalViewOrder.isOpen && orderView && (
        <ModalViewOrder
          className="bg-white"
          isOpen={modalViewOrder.isOpen}
          onClose={() => {
            modalViewOrder.closeModal();
            setOrderView(undefined);
          }}
          trackingCode={orderView}
          onUpdateStatus={(id, status) => handleUpdateStatus(id, status)}
        />
      )}
    </>
  );
}
