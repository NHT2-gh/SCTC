"use clinet";
import React, { useState } from "react";

import Link from "next/link";
import QRCode from "react-qr-code";
import { useModal } from "@/hooks/useModal";
import Modal from "@/components/ui/modal/modal";
import { APP_ROUTES } from "@/config/app-routes";
import { useGetTable } from "@/hooks/queries/use-overview";
import { TableHeader } from "@/components/table";
import { ColumnDefinition } from "@/components/table/table-header";
import {
  CheckCircle2Icon,
  ScanQrCode,
  SquareArrowOutUpRightIcon,
  XCircleIcon,
} from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const colums: ColumnDefinition[] = [
  {
    key: "name",
    title: "Name",
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
      <Table title="QR Order">
        <TableHeader columns={colums} />
        <TableBody>
          <TableRow>
            <TableCell>Takeaway</TableCell>
            <TableCell className="">
              <CheckCircle2Icon fill="green" stroke="white" />
            </TableCell>
            <TableCell className="flex items-center gap-10">
              <button
                onClick={() => {
                  modalViewQRCode.openModal();
                  setTableSelected("*");
                }}
              >
                <ScanQrCode />
              </button>
              <Link target="_blank" href={`${window.location.origin}/tables/*`}>
                <button>
                  <SquareArrowOutUpRightIcon
                    className="text-blue-500"
                    strokeWidth={2}
                  />
                </button>
              </Link>
            </TableCell>
          </TableRow>
          {tables?.data.map((table) => (
            <TableRow key={table.id}>
              <TableCell>{table.name}</TableCell>
              <TableCell>
                {table.is_active ? (
                  <CheckCircle2Icon fill="green" stroke="white" />
                ) : (
                  <XCircleIcon fill="red" stroke="white" />
                )}
              </TableCell>
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
    </section>
  );
}
