import { StoreStatusType } from "@/types/store";
import z from "zod";

export const statusStoreValidationSchema = z.object({
  id: z.number().optional(),
  status: z.enum(StoreStatusType),
  time_start: z.string().min(1, "Time Start is requied"),
  time_end: z.string().optional(),
  is_active: z.boolean().default(false),
  hours_start: z.number().optional(),
  hours_end: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type StatusStoreValidationType = z.infer<
  typeof statusStoreValidationSchema
>;
