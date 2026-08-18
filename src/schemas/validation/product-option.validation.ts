import { OptionType } from "@/types/menu";
import { z } from "zod";

export const upsertProductOptionValidation = z.object({
  id: z.number().optional(),
  option_name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price is required"),
  description: z.string().optional(),
  option_type: z.enum(Object.entries(OptionType).map(([key, _]) => key)),
  component_id: z.uuid().nullable().optional(),
  ingredient_id: z.uuid().nullable().optional(),
  is_default: z.boolean().optional(),
});

export type UpsertProductOptionValidation = z.infer<
  typeof upsertProductOptionValidation
>;
