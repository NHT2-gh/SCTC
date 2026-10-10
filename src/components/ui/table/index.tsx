import { DataEmpty } from "@/components/common/table/state";
import { TableTitle } from "@/components/table";
import { TableTitleProps } from "@/components/table/table-title";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

// Props for Table
interface TableProps extends Partial<TableTitleProps> {
  children: ReactNode; // Table content (thead, tbody, etc.)
  className?: string; // Optional className for styling
  isLoading?: boolean;
  isError?: boolean;
  dataLength?: number;
  colSpan?: number;
}

// Props for TableHeader
interface TableHeaderProps {
  children: ReactNode; // Header row(s)
  className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
  children: ReactNode; // Body row(s)
  className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
  children: ReactNode; // Cells (th or td)
  className?: string; // Optional className for styling
  onClick?: () => void;
  onDoubleClick?: () => void;
}

// Props for TableCell
interface TableCellProps {
  children: ReactNode; // Cell content
  isHeader?: boolean; // If true, renders as <th>, otherwise <td>
  className?: string; // Optional className for styling
  colSpan?: number;
}

// Table Component
const Table: React.FC<TableProps> = ({
  children,
  className,
  title,
  isLoading,
  isError,
  dataLength,
  colSpan,
}) => {
  return (
    <div slot="table">
      {title && <TableTitle title={title} />}
      <div className={cn("max-w-full overflow-x-auto", className)}>
        {!isLoading && (
          <table className={` w-full scrollbar-hidden`}>
            {colSpan && (
              <DataEmpty
                message={
                  isLoading
                    ? "Loading..."
                    : dataLength === 0
                      ? "No customers found"
                      : isError
                        ? "Error!"
                        : null
                }
                colSpan={colSpan}
              />
            )}
            {children}
          </table>
        )}
      </div>
    </div>
  );
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
  return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
  return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({
  children,
  className,
  onClick,
  onDoubleClick,
}) => {
  return (
    <tr
      className={cn(
        "w-full border-b border-gray-100 dark:border-white/5",
        className,
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {children}
    </tr>
  );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({
  children,
  className,
  colSpan,
}) => {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "table-cell min-w-fit text-xs dark:text-gray-400 text-start text-gray-800 px-3 py-2 md:px-6 md:py-3 ",
        className,
      )}
    >
      {children}
    </td>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell };
