"use client";
import { MainContainer } from "@/components/common/page-layout";
import { DataEmpty } from "@/components/common/table/state";
import { TableHeader } from "@/components/table";
import { ColumnDef } from "@/components/table/table-header";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useGetAllCustomer } from "@/hooks/queries/use-customer";
import React from "react";

const columns: ColumnDef[] = [
  {
    key: "name",
    title: "Name",
  },
  { key: "phone", title: "Phone Number" },
  { key: "points_balance", title: "Point Balance" },
  { key: "created_at", title: "Created At" },
];

export default function CustomersPageView() {
  const { data: customers, isLoading, isError } = useGetAllCustomer();
  return (
    <MainContainer title={"Customers"}>
      <Table
        isError={isError}
        isLoading={isLoading}
        dataLength={customers?.data?.length || 0}
        colSpan={columns.length}
      >
        <TableHeader columns={columns} />
        <TableBody>
          {customers?.data.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.name}</TableCell>
              <TableCell>{customer.phone}</TableCell>
              <TableCell>{customer.points_balance}</TableCell>
              <TableCell>{customer.created_at}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MainContainer>
  );
}
