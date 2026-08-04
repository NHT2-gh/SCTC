import { ProductType } from "./product";

export enum PromotionDiscountType {
  percentage = "percentage",
  fixed_amount = "fixed_amount",
  fixed_price = "fixed_price",
  item_discount = "item_discount",
}

export enum TriggerType {
  coupon = "coupon",
  manual = "manual",
  automatic = "automatic",
}

export enum PromotionStatusType {
  draft = "draft",
  active = "active",
  inactive = "inactive",
  expired = "expired",
}

export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  trigger: TriggerType;
  discount_type: PromotionDiscountType;
  discount_value: number;
  status: PromotionStatusType;
  conditions: Conditions;
  start_at: string;
  end_at: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Conditions {
  min_order_value: number;
  max_discount_value: number;
  min_discount_amount: number;
  max_usage_per_user: number;
  applicable_categories?: ProductType;
  time_apply?: {
    days_of_week: number[];
    time_range: { start: string; end: string };
  };
}
