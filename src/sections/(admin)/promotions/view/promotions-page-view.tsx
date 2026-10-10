"use client";
import { MainContainer } from "@/components/common/page-layout";
import { DataEmpty } from "@/components/common/table/state";
import { FormRenderer } from "@/components/form";
import TableHeader, { ColumnDef } from "@/components/table/table-header";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal/modal";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  useGetAllPromotion,
  useGetPromotionDetail,
  useUpdatePromotion,
} from "@/hooks/queries/use-promotion";
import { useModal } from "@/hooks/useModal";
import { showToast } from "@/lib/toast";
import { addPromotionFormSchema } from "@/schemas/form-schemas/promotion-form-schema";
import { promotionValidation } from "@/schemas/validation/promotion.validation";
import {
  PromotionDiscountType,
  PromotionStatusMapText,
} from "@/types/promotions";
import { formatCurrency } from "@/utils/format-data";
import { error } from "console";
import { ViewIcon } from "lucide-react";
import React, { useState } from "react";

const columns: ColumnDef[] = [
  { key: "name", title: "Tên", width: 130 },
  { key: "description", title: "Mô tả", width: 130 },
  { key: "discount_value", title: "Giá trị giảm", width: 130 },
  { key: "time", title: "Thời gian", width: 130 },
  { key: "is_active", title: "Trạng thái", width: 130 },
  { key: "actions", title: "" },
];

export default function PromotionPageView() {
  const { data: promotions, isLoading, isError } = useGetAllPromotion();
  const [promotionIdSelected, setPromotionIdSelected] = useState<string>();
  const updatePromotion = useUpdatePromotion();
  const { data: promotionData } = useGetPromotionDetail(promotionIdSelected);
  const modalUpdate = useModal();

  const handleSubmit = async (data: promotionValidation) => {
    try {
      const result = await updatePromotion.mutateAsync(data);
      if (result.success) {
        showToast.success({ title: "Cập nhật khuyến mã thành công" });
      }
    } catch (err) {
      showToast.error({ title: "Lỗi khi cập nhật khuyến mã" });
    }
  };

  return (
    <MainContainer title={"Khuyến mãi"}>
      <Table>
        <TableHeader columns={columns} />
        <TableBody>
          {isLoading ? (
            <DataEmpty message={"Đang tải dữ liệu"} colSpan={columns.length} />
          ) : isError ? (
            <DataEmpty
              message={"Có lỗi xảy ra khi tải dữ liệu"}
              colSpan={columns.length}
            />
          ) : !promotions?.data || promotions?.data.length === 0 ? (
            <DataEmpty message={"Không có dữ liệu"} colSpan={columns.length} />
          ) : (
            promotions?.data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description || "-"}</TableCell>
                <TableCell>
                  {item.discount_type === PromotionDiscountType.percentage
                    ? item.discount_value + " %"
                    : formatCurrency(item.discount_value)}
                </TableCell>
                <TableCell>
                  {item.start_at || "∞"} - {item.end_at || "∞"}
                </TableCell>
                <TableCell>{PromotionStatusMapText[item.status]}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPromotionIdSelected(item.id);
                      modalUpdate.openModal();
                    }}
                  >
                    <ViewIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {modalUpdate.isOpen && promotionData && (
        <Modal isOpen={modalUpdate.isOpen} onClose={modalUpdate.closeModal}>
          <FormRenderer
            schema={addPromotionFormSchema}
            onSubmit={handleSubmit}
            defaultValues={{
              id: promotionData.data.id,
              name: promotionData?.data?.name,
              description: promotionData?.data?.description,
              discount_value: promotionData?.data?.discount_value,
              trigger: promotionData?.data?.trigger,
              discount_type: promotionData?.data?.discount_type,
              conditions: {
                ...promotionData?.data?.conditions,
                time_apply: {
                  time_range: [
                    promotionData?.data?.start_at,
                    promotionData?.data?.end_at,
                  ],
                },
              },
              limit: promotionData?.data?.limit,
              status: promotionData?.data?.status,
            }}
            submitButtonText="Cập nhật"
            onError={(error) => console.log(error)}
          />
        </Modal>
      )}
    </MainContainer>
  );
}
