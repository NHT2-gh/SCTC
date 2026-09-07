"use clinet";
import React, { useState } from "react";

import Link from "next/link";
import QRCode from "react-qr-code";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/modal/modal";
import { APP_ROUTES } from "@/config/app-routes";
import { useGetTable } from "@/hooks/queries/use-overview";
import { TableHeader, TableTitle } from "@/components/table";
import { ColumnDefinition } from "@/components/table/table-header";
import { ScanQrCode, SquareArrowOutUpRightIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const colums: ColumnDefinition[] = [
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
              <TableCell className="flex items-center gap-10">
                <button
                  onClick={() => {
                    modalViewQRCode.openModal();
                    setTableSelected(table.qr_token);
                  }}
                >
                  <ScanQrCode />
                </button>
                <Link
                  target="_blank"
                  href={`${window.location.origin}${APP_ROUTES.GUEST.TABLE.DETAIL(table.qr_token)}`}
                >
                  <button>
                    <SquareArrowOutUpRightIcon
                      className="text-blue-500"
                      strokeWidth={2}
                    />
                  </button>
                </Link>
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
            value={`${window.location.origin}/${APP_ROUTES.GUEST.TABLE.DETAIL(tableSelected)}`}
            viewBox={`0 0 200 200`}
          />
        </Modal>
      )}

      <div className="mx-auto space-y-5 p-3 border w-fit rounded-2xl mt-10">
        <p>QR Code for takeaway order</p>
        <Link target="_blank" href={`${window.location.origin}/tables/*`}>
          <QRCode
            size={200}
            style={{
              height: "auto",
              maxWidth: "200",
              width: "100%",

              marginTop: "30px",
            }}
            value={`${window.location.origin}/tables/*`}
            viewBox={`0 0 200 200`}
          />
        </Link>
      </div>
    </section>
  );
}
