"use client";
import React from "react";
import {
  useGetHistoryStoreStatus,
  useUpsertHistoryStoreStatus,
} from "@/hooks/queries/use-store";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TableHeader } from "@/components/table";
import { ColumnDef } from "@/components/table/table-header";
import { formatDateTime, formatDateTimev2 } from "@/utils/format-data";
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
  const {
    data: historyStatus,
    refetch,
    isError,
    isLoading,
  } = useGetHistoryStoreStatus();
  const upsertHistory = useUpsertHistoryStoreStatus();
  const upsertForm = useForm<StatusStoreValidationType>({
    defaultValues: {
      is_active: false,
      time_end: "",
      time_start: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: StoreStatusType.break,
    },
  });

  const { handleSubmit, setValue, reset, getValues } = upsertForm;

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

  console.log(getValues("time_start"));

  return (
    <FormProvider {...upsertForm}>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full block overflow-x-scroll"
      >
        <Table title="Store History" isError={isError} isLoading={isLoading}>
          <TableHeader columns={columns} />
          <TableBody className="[&_td]:min-w-[150px]">
            {historyStatus &&
              historyStatus?.data.length > 0 &&
              historyStatus?.data.map((item) => (
                <TableRow
                  className={getValues("id") === item.id ? "bg-blue-100" : ""}
                  key={item.id}
                >
                  <TableCell className="capitalize">{item.status}</TableCell>
                  <TableCell>
                    {formatDateTimev2(item.time_start, { withTime: true })}
                  </TableCell>
                  <TableCell className="capitalize">
                    {formatDateTimev2(item.time_end, { withTime: true })}
                  </TableCell>
                  <TableCell className="capitalize">
                    {item.created_at
                      ? formatDateTimev2(item.created_at)
                      : "Now"}
                  </TableCell>
                  <TableCell className="capitalize">
                    {item.updated_at
                      ? formatDateTimev2(item.updated_at)
                      : "Now"}
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
                        console.log(item.time_start);
                        setValue("id", item.id);
                        setValue("status", item.status);
                        setValue("time_start", item.time_start);
                        setValue(
                          "time_end",
                          item.time_end ? item.time_end : undefined,
                        );
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
