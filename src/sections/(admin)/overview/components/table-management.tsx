"use clinet";
import { TableHeader, TableTitle } from "@/components/table";
import { TableHeaderColumn } from "@/components/table/table-header";
import Modal from "@/components/ui/modal/modal";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { APP_ROUTES } from "@/config/app-routes";
import { useGetTable } from "@/hooks/queries/use-overview";
import { useModal } from "@/hooks/useModal";
import { ScanQrCode } from "lucide-react";
import React, { useState } from "react";
import QRCode from "react-qr-code";

const colums: TableHeaderColumn[] = [
  {
    key: "table_number",
    title: "Table Number",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "action",
    title: "",
  },
];

export default function TableManagement() {
  const { data: tables, isLoading, error } = useGetTable();
  const [tableSelected, setTableSelected] = useState<string>();
  const modalViewQRCode = useModal();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(process.env.NEXT_PUBLIC_DOMAIN_URL);
  return (
    <section>
      <TableTitle title="Table Management" />
      <Table>
        <TableHeader columns={colums} />
        <TableBody>
          {tables?.data.map((table) => (
            <TableRow key={table.id}>
              <TableCell>{table.name}</TableCell>
              <TableCell>{table.is_active ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                <button
                  onClick={() => {
                    modalViewQRCode.openModal();
                    setTableSelected(table.qr_token);
                  }}
                >
                  <ScanQrCode />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {modalViewQRCode.isOpen && tableSelected && (
        <Modal
          isOpen={modalViewQRCode.isOpen}
          onClose={modalViewQRCode.closeModal}
          className="flex justify-center items-center"
        >
          <QRCode
            size={200}
            style={{ height: "auto", maxWidth: "200", width: "100%" }}
            value={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/${APP_ROUTES.GUEST.TABLE.DETAIL(tableSelected)}`}
            viewBox={`0 0 200 200`}
          />
        </Modal>
      )}
    </section>
  );
}
