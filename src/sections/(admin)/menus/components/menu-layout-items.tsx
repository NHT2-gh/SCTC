"use client";
import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/table";
import { ColumnDef } from "@/components/table/table-header";
import { DataEmpty } from "@/components/common/table/state";

import { MenuLayoutItem } from "@/types/menu";
import { formatCurrency } from "@/utils/format-data";

interface MenuLayoutItemsProps {
  items: MenuLayoutItem[];
  onSelect: (item: MenuLayoutItem) => void;
}

const columns: ColumnDef[] = [
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
    <section className="space-y-10 flex-1 ">
      <Table className="max-h-[50vh]">
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
              <TableCell>{item.menu_items.product.name}</TableCell>
              <TableCell>
                {item.menu_items.product.description || "///"}
              </TableCell>
              <TableCell>
                {formatCurrency(item.menu_items.product.selling_price)}
              </TableCell>
              <TableCell>{`x: ${item.x}, y: ${item.y}, w: ${item.w}, h: ${item.h}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
