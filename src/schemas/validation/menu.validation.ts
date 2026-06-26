import { OptionType } from "@/types/menu";
import * as z from "zod";

export const MenuLayoutItemEditValidation = z.object({
  id: z.string(),
  menuId: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  page: z.number(),
});

export const productInfoValidation = z.object({
  id: z.string(),
  name: z.string(),
  selling_price: z.number(),
  description: z.string().nullable(),
  image_url: z.array(z.string()).nullable().optional(),
});

export const productOptionValidation = z.object({
  id: z.string(),
  option_id: z.string(),
  price: z.number(),
  option_name: z.string().optional(),
  option_type: z
    .enum(Object.entries(OptionType).map(([key, _]) => key))
    .optional(),
  menuItemId: z.string().optional(),
  component_id: z.string().optional(),
  description: z.string().optional(),
  limit: z.number().optional(),
});

export const menuItemEditValidation = z.object({
  info: productInfoValidation,
  options: z.array(productOptionValidation),
});

export type ProductOptionValidation = z.infer<typeof productOptionValidation>;

export type ProductInfoValidation = z.infer<typeof productInfoValidation>;

export type MenuItemEditValidation = z.infer<typeof menuItemEditValidation>;
export type MenuLayoutItemEditValidation = z.infer<
  typeof MenuLayoutItemEditValidation
>;
