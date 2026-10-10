"use client";
import React from "react";
import {
  useGetHistoryStoreStatus,
  useUpsertHistoryStoreStatus,
} from "@/hooks/queries/use-store";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/table";
import { ColumnDef } from "@/components/table/table-header";
import { DataEmpty } from "@/components/common/table/state";
import { formatDateTime } from "@/utils/format-data";
import { Switch } from "@/components/ui/switch";
import { UpsertHistoryFormInRow } from "./sub-components";
import { FormProvider, useForm } from "react-hook-form";
import { StoreStatusType } from "@/types/store";
import Form from "@/components/form/Form";
import { showToast } from "@/lib/toast";
import { mapErrorToMessage } from "@/lib/error/app-error";
import { EditIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusStoreValidationType } from "@/schemas/validation/status-store.validation";

const columns: ColumnDef[] = [
  {
    key: "status",
    title: "Status",
  },
  { key: "start_time", title: "Start Time" },
  { key: "end_time", title: "End Time" },
  { key: "created_at", title: "Created At" },
  { key: "updated_at", title: "Updated At" },

  { key: "is_active", title: "Active" },
  { key: "actions", title: "" },
];

export default function StatusManagement() {
  const { data: historyStatus, refetch } = useGetHistoryStoreStatus();
  const upsertHistory = useUpsertHistoryStoreStatus();
  const upsertForm = useForm<StatusStoreValidationType>({
    defaultValues: {
      is_active: false,
      time_end: "",
      time_start: "",
      created_at: new Date().toLocaleString(),
      updated_at: new Date().toLocaleString(),
      status: StoreStatusType.break,
    },
  });

  const { handleSubmit, setValue, reset } = upsertForm;

  const onSubmit = async (data: StatusStoreValidationType) => {
    try {
      const result = await upsertHistory.mutateAsync(data);
      if (result.success) {
        refetch();
        reset();
        showToast.success({ title: "Cập nhật thành công" });
      }
    } catch (error) {
      showToast.error({ title: mapErrorToMessage(error) });
    }
  };

  return (
    <FormProvider {...upsertForm}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full block overflow-x-scroll"
      >
        <Table title="Store History">
          <TableHeader columns={columns} />
          <TableBody className="[&_td]:min-w-[150px]">
            {!historyStatus?.success ||
              (historyStatus?.data.length === 0 && (
                <DataEmpty
                  message={
                    !historyStatus?.success
                      ? "Lỗi hệ thống không thể truy cập lịch sử"
                      : historyStatus?.data.length === 0 && "Không tìm thấy"
                  }
                  colSpan={columns.length}
                />
              ))}

            {historyStatus &&
              historyStatus?.data.length > 0 &&
              historyStatus?.data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="capitalize">{item.status}</TableCell>
                  <TableCell>
                    {formatDateTime(item.time_start, { withTime: true })}
                  </TableCell>
                  <TableCell className="capitalize">
                    {formatDateTime(item.time_end, { withTime: true })}
                  </TableCell>
                  <TableCell className="capitalize">
                    {item.created_at ? formatDateTime(item.created_at) : "Now"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {item.updated_at ? formatDateTime(item.updated_at) : "Now"}
                  </TableCell>

                  <TableCell>
                    <Switch
                      type="switch"
                      value={item.is_active}
                      handleOnChange={(value) => {
                        onSubmit({
                          id: item.id,
                          is_active: value,
                          time_start: item.time_start,
                          status: item.status,
                        });
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      onClick={() => {
                        setValue("id", item.id);
                        setValue("status", item.status);
                        setValue("time_start", item.time_start);
                        setValue("time_end", item.time_end);
                        setValue("is_active", item.is_active);
                      }}
                      size="sm"
                      variant="outline"
                    >
                      <EditIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

            <UpsertHistoryFormInRow onSubmit={handleSubmit(onSubmit)} />
          </TableBody>
        </Table>
      </Form>
    </FormProvider>
  );
}
