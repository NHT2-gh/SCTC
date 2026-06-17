import * as z from "zod";

export const MenuLayoutItemEditValidation = z.object({
  id: z.string(),
  menuId: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
});

export type MenuLayoutItemEditValidation = z.infer<
  typeof MenuLayoutItemEditValidation
>;
