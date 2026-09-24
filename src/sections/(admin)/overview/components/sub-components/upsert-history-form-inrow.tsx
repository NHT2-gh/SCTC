import { TableCell, TableRow } from "@/components/ui/table";
import { useFormContext, useWatch } from "react-hook-form";
import React, { useEffect } from "react";
import { StoreStatusType } from "@/types/store";
import { FormField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { StatusStoreValidationType } from "@/schemas/validation/status-store.validation";

export default function UpsertHistoryFormInRow({
  onSubmit,
}: {
  onSubmit: () => void;
}) {
  const upsertFormContext = useFormContext<StatusStoreValidationType>();
  const currentValue = useWatch({
    control: upsertFormContext.control,
    name: ["status", "is_active", "time_start", "time_end"],
  });

  return (
    <TableRow className="bg-emerald-50/50 border [&_td]:px-1">
      <TableCell>
        <FormField
          field={{
            name: "status",
            type: "select",
            value: currentValue[0],
            options: Object.entries(StoreStatusType).map(([key, value]) => {
              return {
                value: key,
                label: value,
              };
            }),
          }}
          form={upsertFormContext}
        />
      </TableCell>
      <TableCell>
        <FormField
          field={{
            id: "time_start",
            value: currentValue[2],
            name: "time_start",
            type: "date",
            pickerType: "datetime",
            placeholder: "Start Time",
          }}
          form={upsertFormContext}
        />
      </TableCell>
      <TableCell>
        <FormField
          field={{
            id: "time_end",
            value: currentValue[3],
            name: "time_end",
            type: "date",
            pickerType: "datetime",
            placeholder: "End Time",
          }}
          form={upsertFormContext}
        />
      </TableCell>
      <TableCell>
        <FormField
          field={{
            name: "created_at",
            type: "text",
          }}
          form={upsertFormContext}
        />
      </TableCell>
      <TableCell>
        <FormField
          field={{
            name: "updated_at",
            type: "text",
          }}
          form={upsertFormContext}
        />
      </TableCell>
      <TableCell>
        <FormField
          field={{ name: "is_active", type: "switch", value: currentValue[1] }}
          form={upsertFormContext}
        />
      </TableCell>

      <TableCell>
        <Button onClick={onSubmit} type="submit">
          Save
        </Button>
      </TableCell>
    </TableRow>
  );
}
