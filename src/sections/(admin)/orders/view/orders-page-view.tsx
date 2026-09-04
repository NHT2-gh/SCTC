"use client";
import React, { useEffect, useMemo, useState } from "react";

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
import ModalAlert from "@/components/modal/alerts/modal-alert";
import { Order, OrderStatus, PaymentMethod, PaymentType } from "@/types/order";
import { FilterBoxRender } from "@/components/filter/filter-box-render";
import { orderFilterConfig } from "@/schemas/filter-schemas/order-schema";
import { _product_setting } from "@/_mocks/_setting/_product_detal_setting";
import InputText from "@/components/ui/input/input-text";

const limit = 24;

export default function OrdersPageView() {
  const modalViewOrder = useModal();
  const { data: tables } = useGetTable();
  const updateOrderStatus = useUpdateOrderStatus();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [orderView, setOrderView] = useUrlState("view_order", "");
  const [searchText, setSearchText] = useState<string>();
  const { filterValues, updateFilter, removeFilter, clearFilters } = useFilter({
    filterConfigs: orderFilterConfig,
    initSubmit: true,
  });
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const {
    data: orders,
    refetch: refetchOrders,
    fetchNextPage,
    hasNextPage,
  } = useGetAllOrder({
    filters: filterValues,
    searchText: searchText,
    page: 1,
    limit: limit,
  });
  const [orderIdsSelected, setIdsOrderSelected] = useState<string[]>([]);
  const modalConfirmPayment = useModal();
  const modalConfirmCancelOrder = useModal();

  const allOrders: Order[] = React.useMemo(() => {
    // If we only have initial data and haven't fetched more pages yet
    if (!orders?.pages) {
      return [];
    }
    return orders.pages.flatMap((page) => page.data);
  }, [orders]);

  const totalAmount = useMemo(() => {
    setQrUrl(null);

    return orderIdsSelected.reduce((acc, orderId) => {
      const orderData = allOrders.find((order) => order.id === orderId);
      return acc + (orderData?.subtotal || 0);
    }, 0);
  }, [orderIdsSelected, allOrders]);

  useEffect(() => {
    setIdsOrderSelected(
      filterValues["status"] === OrderStatus.DONE && filterValues["table_id"]
        ? allOrders.map((oder) => oder.id) || []
        : [],
    );
  }, [filterValues["status"], allOrders]);

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
            countOrder={allOrders.length}
          />

          <div className="flex flex-wrap items-center gap-4">
            <InputText
              type={"text"}
              placeholder="Search by order code, customer name"
              value={searchText}
              handleOnChange={(value) => {
                setSearchText(String(value));
              }}
            />
            <Button
              onClick={() => {
                setFiltersOpen(!filtersOpen);
              }}
              className="grow max-w-[100px] md:grow-0"
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
                    value: String(filterValues["table_id"]),
                    handleOnChange: (value: string) => {
                      updateFilter("table_id", String(value));
                    },
                    options: tables?.data.map((table) => {
                      return {
                        label: table.name,
                        value: String(table.id),
                      };
                    }),
                  }}
                />
              )}
            </FilterBoxRender>
          )}
          <section className="max-h-[60vh] max-w-full overflow-auto">
            <div className="w-fit h-fit columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 2xl:columns-6">
              {allOrders?.map((order) => (
                <div
                  key={order.id}
                  className={cn(
                    "w-[250px] break-inside-avoid mb-4",
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
                    onCancel={() => {
                      modalConfirmCancelOrder.openModal();
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {hasNextPage &&
            orderIdsSelected.length === 0 &&
            allOrders.length >= limit && (
              <Button
                variant="outline"
                className="w-fit mx-auto"
                onClick={() => fetchNextPage()}
              >
                Xem thêm
              </Button>
            )}
        </div>

        {allOrders && orderIdsSelected.length > 0 && (
          <div className="p-2 bg-white absolute bottom-5 sm:bottom-10 left-10 right-10 border md:left-[unset] md:max-w-[300px] border-brand-500 border-dashed rounded-lg">
            <h3 className="font-bold">
              Total Amount:
              <span className="ml-2 text-brand-500">
                {formatCurrency(totalAmount)}
              </span>
            </h3>

            {orderIdsSelected.length > 0 && (
              <h3 className="font-bold">
                Selected: {orderIdsSelected.length} orders ({" "}
                {allOrders
                  .filter((order) => orderIdsSelected.includes(order.id))
                  .reduce((acc, order) => {
                    return acc + order.order_items_count;
                  }, 0)}
                {"  items )"}
              </h3>
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={
                _product_setting.processOrder[
                  filterValues["status"] as OrderStatus
                ]?.value >= 5
              }
              onClick={() => handlePayment()}
              className="w-full mt-2 bg-lime-200"
            >
              Thanh toán
            </Button>

            {qrUrl && totalAmount > 0 && (
              <div className="mt-2 w-fit mx-auto rounded-lg overflow-hidden">
                <Link href={qrUrl} target="_blank">
                  <Image src={qrUrl} alt="QR Code" width={200} height={200} />
                </Link>
                <button
                  disabled={!qrUrl}
                  className="w-full mt-2 bg-lime-200 rounded-lg px-2 py-1"
                  onClick={() => {
                    modalConfirmPayment.openModal();
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
            refetchOrders();
            setOrderView(undefined);
          }}
          trackingCode={orderView}
          onUpdateStatus={(id, status) => handleUpdateStatus(id, status)}
        />
      )}

      {modalConfirmPayment.isOpen && qrUrl && (
        <ModalAlert
          isOpen={modalConfirmPayment.isOpen}
          onClose={modalConfirmPayment.closeModal}
          type={"success"}
          title={"Bạn chắc chắn đã nhận tiền từ khách hàng?"}
          onConfirm={() => {
            handleUpdateStatus(orderIdsSelected, OrderStatus.COMPLETED);
            setQrUrl(null);
          }}
          confirmText={"Đã nhận"}
        />
      )}

      {modalConfirmCancelOrder.isOpen && (
        <ModalAlert
          isOpen={modalConfirmCancelOrder.isOpen}
          onClose={modalConfirmCancelOrder.closeModal}
          type={"warning"}
          title={`Bạn có chắc chắn muốn hủy ${orderIdsSelected.length} đơn hàng này?`}
          description={"Hành động này không thể hoàn tác"}
          onConfirm={() => {
            handleUpdateStatus(orderIdsSelected, OrderStatus.CANCELLED);
            modalConfirmCancelOrder.closeModal();
            setIdsOrderSelected([]);
          }}
          confirmText={"Hủy đơn hàng"}
        />
      )}
    </>
  );
}
