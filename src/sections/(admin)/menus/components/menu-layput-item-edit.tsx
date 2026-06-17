import { FormField } from "@/components/form";
import { MenuLayoutItemEditValidation } from "@/schemas/validation/menu.validation";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function MenuLayputItemEdit() {
  const editForm = useFormContext<MenuLayoutItemEditValidation>();

  return (
    <>
      <FormField
        form={editForm}
        field={{
          name: "w",
          label: "Width",
          type: "number",
        }}
      />
      <FormField
        form={editForm}
        field={{
          name: "h",
          label: "Height",
          type: "number",
        }}
      />
      <FormField
        form={editForm}
        field={{
          name: "x",
          label: "X",
          type: "number",
        }}
      />
      <FormField
        form={editForm}
        field={{
          name: "y",
          label: "Y",
          type: "number",
        }}
      />
    </>
  );
}
