import Label from "@/components/form/label/label";
import { RequestState } from "@/types/common";
import { CheckCircle2, X } from "lucide-react";
import React from "react";

interface BoxResultProps {
  title?: string;
  state: RequestState;
}
export default function BoxResult({ title = "Result", state }: BoxResultProps) {
  if (state.isSuccess === undefined) return null;
  return (
    <div className="bg-neutral-100 rounded-lg p-3">
      <Label className="font-bold text-base">{title}</Label>

      <p className="flex gap-2 items-center text-danger text-sm mt-3">
        {state.isSuccess ? (
          <CheckCircle2 fill="#16a34a" stroke="white" />
        ) : (
          (state.isSuccess === false || state.isError === true) && (
            <X fill="#dc2626" />
          )
        )}

        {state.message}
      </p>
    </div>
  );
}
