import { ProductType } from "./product";

export enum DaysOfWeek {
  SUNDAY = "0",
  MONDAY = "1",
  TUESDAY = "2",
  WEDNESDAY = "3",
  THURSDAY = "4",
  FRIDAY = "5",
  SATURDAY = "6",
}

export const DaysOfWeekMapText: Record<DaysOfWeek, string> = {
  [DaysOfWeek.SUNDAY]: "Chủ nhật",
  [DaysOfWeek.MONDAY]: "Thứ 2",
  [DaysOfWeek.TUESDAY]: "Thứ 3",
  [DaysOfWeek.WEDNESDAY]: "Thứ 4",
  [DaysOfWeek.THURSDAY]: "Thứ 5",
  [DaysOfWeek.FRIDAY]: "Thứ 6",
  [DaysOfWeek.SATURDAY]: "Thứ 7",
};

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

export const PromotionStatusMapText: Record<PromotionStatusType, string> = {
  [PromotionStatusType.draft]: "Bản nháp",
  [PromotionStatusType.active]: "Đang hoạt động",
  [PromotionStatusType.inactive]: "Không hoạt động",
  [PromotionStatusType.expired]: "Hết hạn",
};

export const TriggerTypeMapText: Record<TriggerType, string> = {
  [TriggerType.coupon]: "Mã khuyến mãi",
  [TriggerType.manual]: "Thủ công",
  [TriggerType.automatic]: "Tự động",
};

export const PromotionDiscountTypeMapText: Record<
  PromotionDiscountType,
  string
> = {
  [PromotionDiscountType.percentage]: "Phần trăm",
  [PromotionDiscountType.fixed_amount]: "Số tiền cố định",
  [PromotionDiscountType.fixed_price]: "Giá cố định",
  [PromotionDiscountType.item_discount]: "Giảm giá sản phẩm",
};

export interface Promotion {
  id: string;
  name: string;
  description: string | null;
  trigger: TriggerType;
  discount_type: PromotionDiscountType;
  discount_value: number;
  status: PromotionStatusType;
  conditions: Conditions;
  limit: number;
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
    hour_range: { start: string; end: string };
    date_range: { from: string; to: string };
  };
}

export interface OrderDiscount {
  id: string;
  promotion_id: string;
  order_id: string;
  discount_value: number;
  created_at: string;
  promotion_snapshot: Promotion;
  applied_by: string;
  reason: string;
}

export interface RequestApplyPromotion {
  promotions: Promotion[];
  order_id: string;
}
