import { cn } from "@/lib/utils";
import React from "react";
import { Checkbox } from "../ui/input";
import { TableCell, TableHeader as TableHeaderUI, TableRow } from "../ui/table";

export interface ColumnDef {
  key: string;
  title: string;
  className?: string;
  description?: string;
  isHiddenOnMobile?: boolean;
  width?: number;
}

export default function TableHeader({
  columns,
  selectAll = false,
  handleSelectAll,
  className,
}: {
  columns: ColumnDef[];
  className?: string;
  selectAll?: boolean;
  handleSelectAll?: (isSelectAll: boolean) => void;
}) {
  if (!columns) return;
  return (
    <TableHeaderUI
      className={cn(
        "w-full border-b bg-gray-50 dark:bg-black border-gray-100 dark:border-white/5",
        className,
      )}
    >
      <TableRow>
        {handleSelectAll ? (
          <TableCell
            isHeader
            className={cn("font-medium px-2 sm:px-6 text-theme-xs text-start", {
              "hidden md:table-cell": columns[0].isHiddenOnMobile,
            })}
          >
            <Checkbox
              id={columns[0].key}
              checked={selectAll}
              onChange={() => handleSelectAll?.(!selectAll)}
              label={columns[0].title}
            />
          </TableCell>
        ) : (
          <TableCell
            isHeader
            className={cn("font-medium px-2 sm:px-6 text-theme-xs text-start", {
              "hidden md:table-cell": columns[0].isHiddenOnMobile,
            })}
          >
            {columns[0].title}
          </TableCell>
        )}

        {columns.slice(1).map((cell, index) => (
          <TableCell
            key={index}
            isHeader
            className={cn(
              "font-medium px-2 sm:px-6 text-theme-xs text-start",
              { "text-center": cell.description },
              { "hidden md:table-cell": cell.isHiddenOnMobile },
              cell.className,
            )}
          >
            {cell.title}
            {cell.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {"(" + cell.description + ")"}
              </p>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHeaderUI>
  );
}
