import { Component } from "./component";

export enum MenuEnumType {
  drink = "Drink",
  cocktail = "Cocktail",
  food = "Food",
}

export enum MenuOptionType {
  topping = "Topping",
  extra = "Extra",
  upgrade = "Upgrade",
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

export interface Product {
  id: string;
  name: string;
  description: string;
  selling_price: number;
  image_url: string;
  is_active: boolean;
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
}

export interface MenuItemOption {
  id: string;
  price: number;
  components: Component;
  option_type: keyof typeof MenuOptionType;
}

export interface ItemOptionDetail {
  id: string;
  menu_item_id: string;
  menu_items_options: MenuItemOption;
  menu_items: MenuItem;
  limit: number;
}
