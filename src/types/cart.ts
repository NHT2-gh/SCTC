import { MenuItem, OptionType } from "./menu";

export interface SelectedOption {
  id: string;
  component_id: string;
  component_name: string;
  price: number;
  option_type: keyof typeof OptionType;
  description?: string;
  limit?: number;
}

export interface CartItem {
  id: string;
  menu_item: MenuItem;
  quantity: number;
  selected_options: SelectedOption[];
  note?: string;
}

export interface AddCartItemPayload {
  menu_item: MenuItem;
  quantity?: number;
  selected_options?: SelectedOption[];
  note?: string;
}

export interface UpdateCartItemQuantityPayload {
  item_id: string;
  quantity: number;
}

export interface UpdateCartItemNotePayload {
  item_id: string;
  note: string;
}

export interface UpdateCartItemOptionsPayload {
  item_id: string;
  selected_options: SelectedOption[];
}
