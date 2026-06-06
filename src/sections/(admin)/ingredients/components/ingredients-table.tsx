"use client";
import React, { InputHTMLAttributes, useRef, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useIngredients } from "@/hooks/queries/use-ingredient";
import { DataEmpty } from "@/components/common/table/state";
import { TableHeader, TableTitle } from "@/components/table";
import { TableHeaderColumn } from "@/components/table/table-header";
import { SearchBar } from "@/components/search-bar";

const columns: TableHeaderColumn[] = [
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
    error,
  } = useIngredients({ searchText: searchText });
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="border border-gray-200 rounded-xl">
      <TableTitle title="Bảng nguyên liệu">
        <SearchBar
          inputRef={searchInputRef}
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
          {ingredientsData?.data.map((ingredient) => (
            <TableRow key={ingredient.id}>
              <TableCell>{ingredient.code}</TableCell>
              <TableCell>{ingredient.category_code}</TableCell>
              <TableCell>{ingredient.name}</TableCell>
              <TableCell>{ingredient.purchase_quantity}</TableCell>
              <TableCell>{ingredient.purchase_price}</TableCell>
              <TableCell>{ingredient.yield_percentage}</TableCell>
              <TableCell>{ingredient.cost_per_unit}</TableCell>
              <TableCell>{ingredient.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
