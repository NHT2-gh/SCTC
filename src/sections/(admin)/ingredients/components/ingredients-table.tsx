"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  useEditIngredient,
  useIngredients,
} from "@/hooks/queries/use-ingredient";
import { DataEmpty } from "@/components/common/table/state";
import { TableHeader, TableTitle } from "@/components/table";
import { ColumnDef } from "@/components/table/table-header";
import { SearchBar } from "@/components/search-bar";
import { formatCurrency } from "@/utils/format-data";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  ingredientValidationSchema,
  IngredientValidationSchema,
} from "@/schemas/validation/ingredient.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  IngredientCategoryType,
  MapTextIngredientCategoryType,
  UnitType,
} from "@/types/ingredient";
import { Edit2Icon } from "lucide-react";
import { FormField } from "@/components/form";
import Form from "@/components/form/Form";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const columns: ColumnDef[] = [
  { key: "code", title: "Mã" },
  { key: "categoryName", title: "Danh mục" },
  { key: "name", title: "Tên" },
  { key: "purchase_quantity", title: "SL mua" },
  { key: "purchase_price", title: "Giá mua" },
  { key: "yield_percentage", title: "% Thu hồi" },
  { key: "cost_per_unit", title: "Giá cost / đơn vị" },
  { key: "notes", title: "Ghi chú" },
  { key: "action", title: "" },
];

export default function IngredientsTable() {
  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const {
    data: ingredientsData,
    isLoading: isLoadingIngredients,
    refetch,
    error,
  } = useIngredients({ searchText: searchText });
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [editIngredientIndex, setEditIngredientIndex] = useState<number>();
  const updateIngredient = useEditIngredient();
  const editIngredient = useMemo(() => {
    if (typeof editIngredientIndex === "number")
      return ingredientsData?.data[editIngredientIndex];
    else return undefined;
  }, [ingredientsData?.data, editIngredientIndex]);

  const editForm = useForm<IngredientValidationSchema>({
    resolver: zodResolver(ingredientValidationSchema),
    defaultValues: {
      id: editIngredient?.id || "",
      name: editIngredient?.name || "",
      category_code:
        (editIngredient?.category_code as IngredientCategoryType) ||
        IngredientCategoryType.OTHER,
      purchase_price: editIngredient?.purchase_price || 0,
      yield_percentage: editIngredient?.yield_percentage || 0,
      unit: editIngredient?.unit || UnitType.gram,
      purchase_quantity: editIngredient?.purchase_quantity || 0,
      notes: editIngredient?.notes || "",
    },
  });

  const { handleSubmit, setValue } = editForm;

  const onSubmit = async (data: IngredientValidationSchema) => {
    try {
      const result = await updateIngredient.mutateAsync(data);
      if (result.success) {
        showToast.success({
          title: "Cập nhật nguyên liệu thành công",
          description: "Đã cập nhật thông tin nguyên liệu",
        });
        setEditIngredientIndex(undefined);
        refetch();
      }
    } catch (error) {
      showToast.error({
        title: "Lỗi hệ thống",
        description: "Vui lòng thử lại",
      });
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-xl">
      <Form className="!grid-cols-1" onSubmit={handleSubmit(onSubmit)}>
        <TableTitle title="Bảng nguyên liệu">
          <SearchBar
            ref={searchInputRef}
            handleKeyDown={(value) => {
              setSearchText(value);
            }}
            handleOnChange={(value) => {
              if (!value.trim()) setSearchText(undefined);
            }}
          />
        </TableTitle>
        <Table>
          <TableHeader columns={columns} />
          <TableBody>
            {(ingredientsData?.data.length === 0 ||
              isLoadingIngredients ||
              error) && (
              <DataEmpty
                colSpan={columns.length}
                message={
                  isLoadingIngredients
                    ? "Đang tải dữ liệu..."
                    : ingredientsData?.data.length
                      ? "Không tìm thấy nguyên liệu"
                      : "Lỗi hệ thống vui lòng thử lại"
                }
              />
            )}
            {ingredientsData?.data.map((ingredient, index) => (
              <TableRow
                key={ingredient.id}
                className={cn(
                  "[&_td]:min-w-[120px] ",
                  index === editIngredientIndex ? "bg-blue-50" : "",
                )}
              >
                <TableCell>
                  {index === editIngredientIndex ? (
                    <FormField
                      field={{
                        type: "text",
                        placeholder: "Mã nguyên liệu",
                        name: "code",
                      }}
                      form={editForm}
                    />
                  ) : (
                    ingredient.code
                  )}
                </TableCell>
                <TableCell>
                  {index === editIngredientIndex ? (
                    <FormField
                      field={{
                        type: "select",
                        placeholder: "Danh mục",
                        name: "category_code",
                        options: Object.values(IngredientCategoryType).map(
                          (category) => ({
                            value: category,
                            label: MapTextIngredientCategoryType[category],
                          }),
                        ),
                      }}
                      form={editForm}
                    />
                  ) : (
                    ingredient.category_code
                  )}
                </TableCell>
                <TableCell>
                  {index === editIngredientIndex ? (
                    <FormField
                      field={{
                        type: "text",
                        placeholder: "Tên nguyên liệu",
                        name: "name",
                      }}
                      form={editForm}
                    />
                  ) : (
                    ingredient.name
                  )}
                </TableCell>
                <TableCell>
                  {index === editIngredientIndex ? (
                    <FormField
                      field={{
                        type: "number",
                        placeholder: "Số lượng mua",
                        name: "purchase_quantity",
                      }}
                      form={editForm}
                    />
                  ) : (
                    ingredient.purchase_quantity
                  )}
                </TableCell>
                <TableCell>
                  {index === editIngredientIndex ? (
                    <FormField
                      field={{
                        type: "number",
                        placeholder: "Giá mua",
                        name: "purchase_price",
                      }}
                      form={editForm}
                    />
                  ) : (
                    formatCurrency(ingredient.purchase_price)
                  )}
                </TableCell>
                <TableCell>
                  {index === editIngredientIndex ? (
                    <FormField
                      field={{
                        type: "number",
                        placeholder: "% Thu hồi",
                        name: "yield_percentage",
                      }}
                      form={editForm}
                    />
                  ) : (
                    ingredient.yield_percentage + "%"
                  )}
                </TableCell>
                <TableCell>
                  {index === editIngredientIndex ? (
                    <FormField
                      field={{
                        type: "number",
                        placeholder: "Giá cost / đơn vị",
                        name: "cost_per_unit",
                      }}
                      form={editForm}
                    />
                  ) : (
                    formatCurrency(ingredient.cost_per_unit)
                  )}
                </TableCell>
                <TableCell>
                  {index === editIngredientIndex ? (
                    <FormField
                      field={{
                        type: "text",
                        placeholder: "Ghi chú",
                        name: "notes",
                      }}
                      form={editForm}
                    />
                  ) : (
                    ingredient.notes
                  )}
                </TableCell>

                <TableCell>
                  {index === editIngredientIndex ? (
                    <Button
                      onClick={handleSubmit(onSubmit)}
                      className="w-full h-fit"
                    >
                      Cập nhật
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setValue("id", ingredient.id);
                        setValue("name", ingredient.name);
                        setValue("code", ingredient.code);
                        setValue("category_code", ingredient.category_code);
                        setValue(
                          "purchase_quantity",
                          ingredient.purchase_quantity,
                        );
                        setValue("purchase_price", ingredient.purchase_price);
                        setValue(
                          "yield_percentage",
                          ingredient.yield_percentage,
                        );
                        setValue("unit", ingredient.unit);
                        setValue("notes", ingredient.notes);
                        setEditIngredientIndex(index);
                      }}
                    >
                      <Edit2Icon className="size-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Form>
    </div>
  );
}
