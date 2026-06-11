export enum MenuEnumType {
  drink = "Drink",
  cocktail = "Cocktail",
  food = "Food",
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

export interface Drink {
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
  drinks: Drink;
}

export interface MenuLayoutItem {
  id: string;
  drinks: Drink;
  x: number;
  y: number;
  w: number;
  h: number;
}
