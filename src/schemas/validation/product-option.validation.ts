import { OptionType } from "@/types/menu";
import { z } from "zod";

export const addProductOptionValidation = z.object({
  option_name: z.string().min(1, "Name is required"),
  price: z.number().min(1, "Price is required"),
  description: z.string().optional(),
  option_type: z.enum(Object.entries(OptionType).map(([key, _]) => key)),
  component_id: z.uuid().nullable().optional(),
  ingredient_id: z.uuid().nullable().optional(),
});

export type AddProductOptionValidation = z.infer<
  typeof addProductOptionValidation
>;
