import { Component } from "./component";
import { Product } from "./product";

export enum MenuEnumType {
  fixed = "Cố định",
  cocktail = "Cocktail",
  food = "Food",
}

export enum OptionType {
  topping = "Topping",
  extra = "Extra",
  upgrade = "Upgrade",
  replace = "Replace",
  ice = "Đá",
  sweet = "Độ ngọt",
  alcoholic = "Độ cồn",
}

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
  components: Component;
  option_type: keyof typeof OptionType;
  option_name: string;
  description?: string;
  is_default?: boolean;
}

export interface ItemOptionDetail {
  id: string;
  option_id: string;
  menu_item_id: string;
  menu_items_options: MenuItemOption;
  menu_items: MenuItem;
  limit: number;
}
