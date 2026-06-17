import {
  AddCartItemPayload,
  CartItem,
  UpdateCartItemNotePayload,
  UpdateCartItemOptionsPayload,
  UpdateCartItemQuantityPayload,
} from "@/types/cart";
import { string } from "zod";

export const CART_LIMITS = {
  MAX_QUANTITY_PER_ITEM: 99,
} as const;

export const CUSTOMER_LIMITS = {
  NAME_MAX_LENGTH: 100,
  PHONE_MAX_LENGTH: 20,
  NOTE_MAX_LENGTH: 500,
} as const;

export interface CartState {
  items: CartItem[];
}

export interface CartActions {
  add_item(payload: AddCartItemPayload): void;
  remove_item(item_id: string): void;
  update_quantity(payload: UpdateCartItemQuantityPayload): void;
  update_options(payload: UpdateCartItemOptionsPayload): void;
  update_note(payload: UpdateCartItemNotePayload): void;
  clear(): void;
}

export interface CartItemPricing {
  base_price: number;
  options_price: number;
  unit_price: number;
  total_price: number;
}

export interface CartSummary {
  item_count: number;
  subtotal: number;
}
