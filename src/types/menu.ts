import { Component } from "./component";
import { Ingredient } from "./ingredient";
import { Product } from "./product";

export enum MenuEnumType {
  fixed = "Cố định",
  cocktail = "Cocktail",
  food = "Food",
}

export enum OptionType {
  topping = "topping",
  extra = "extra",
  upgrade = "upgrade",
  replace = "replace",
  ice = "ice",
  sweet = "sweet",
  alcoholic = "alcoholic",
}

export const OptionTypeMapText: Record<OptionType, string> = {
  [OptionType.topping]: "Topping",
  [OptionType.extra]: "Extra",
  [OptionType.upgrade]: "Upgrade",
  [OptionType.replace]: "Replace",
  [OptionType.ice]: "Đá",
  [OptionType.sweet]: "Độ ngọt",
  [OptionType.alcoholic]: "Độ cồn",
};

export type MenuType = keyof typeof MenuEnumType;

export interface Menu {
  id: string;
  name: string;
  is_published: boolean;
  publish_at: string;
  unpublish_at: string;
  type: MenuType;
}

export interface MenuItem {
  id: string;
  menu_id: string;
  products: Product;
}

export interface MenuLayoutItem {
  id: string;
  menu_items: MenuItem;
  x: number;
  y: number;
  w: number;
  h: number;
  page: number;
}

export interface MenuItemOption {
  id: string;
  price: number;
  components?: Component;
  ingredients?: Ingredient;
  option_type: OptionType;
  option_name: string;
  description?: string;
  limit: number | null;
  is_default?: boolean;
}

export interface ItemOptionDetail {
  id: string;
  option_id: string;
  menu_item_id: string;
  menu_items_options: MenuItemOption;
  menu_items: MenuItem;
  limit: number | null;
}
