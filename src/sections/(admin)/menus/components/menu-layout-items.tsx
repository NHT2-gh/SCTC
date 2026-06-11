"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/table";
import { useGetMenuLayouts } from "@/hooks/queries/use-menu";
import { TableHeaderColumn } from "@/components/table/table-header";
import { DataEmpty } from "@/components/common/table/state";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { Button } from "@/components/ui/button";
import { MenuLayoutItem } from "@/types/menu";
import { formatCurrency } from "@/utils/format-data";

interface MenuLayoutItemsProps {
  items: MenuLayoutItem[];
  onSelect: (item: MenuLayoutItem) => void;
}

const columns: TableHeaderColumn[] = [
  {
    key: "product",
    title: "Sản phẩm",
  },
  {
    key: "description",
    title: "Mô tả",
  },
  {
    key: "selling_price",
    title: "Giá bán",
  },
  {
    key: "position",
    title: "Thông số",
  },
];
export default function MenuLayoutItems({
  items,
  onSelect,
}: MenuLayoutItemsProps) {
  return (
    <section className="space-y-10 flex-1">
      <Table>
        <TableHeader columns={columns} />
        <TableBody>
          {items?.length === 0 && (
            <DataEmpty message={"Không có items"} colSpan={columns.length} />
          )}

          {items.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-neutral-100"
              onDoubleClick={() => {
                onSelect(item);
              }}
            >
              <TableCell>{item.drinks.name}</TableCell>
              <TableCell>{item.drinks.description || "///"}</TableCell>
              <TableCell>{formatCurrency(item.drinks.selling_price)}</TableCell>
              <TableCell>{`x: ${item.x}, y: ${item.y}, w: ${item.w}, h: ${item.h}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
