import { MenuItem, OptionType } from "./menu";

export interface SelectedOption {
  id: string;
  component_id?: string;
  ingredient_id?: string;
  ingredient_name?: string;
  component_name?: string;
  price: number;
  option_type: OptionType;
  option_id: string;
  is_default?: boolean;
  menu_item_id?: string;
  description?: string;
  limit?: number | null;
}

export interface CartItem {
  id: string;
  menu_item: MenuItem;
  quantity: number;
  selected_options: SelectedOption[];
  line_note?: string;
}

export interface AddCartItemPayload {
  menu_item: MenuItem;
  quantity?: number;
  selected_options?: SelectedOption[];
  line_note?: string;
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
