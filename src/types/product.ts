import { SelectedOption } from "./cart";
import { Component } from "./component";
import { Ingredient } from "./ingredient";
import { MenuItem } from "./menu";

export enum ProductType {
  food = "food",
  coffee = "coffee",
  cocktail = "cocktail",
  matcha = "matcha",
  houjicha = "houjicha",
  tea = "tea",
  cacao = "cacao",
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  cost: number;
  selling_price: number;
  image_url: string[];
  is_active: boolean;
  is_only_allow_dinein: boolean;
  product_type: ProductType;
}

export interface ProductDetail {
  info: MenuItem;
  options: {
    custom: SelectedOption[];
    fixed: SelectedOption[];
  };
  isAllowOrder: boolean;
}

export interface ProductRecipeVersion {
  id: string;
  product_id: string;
  version_number: number;
  is_actice: boolean;
  note: boolean;
  products: Product;
}

export enum ItemType {
  INGREDIENT = "ingredient",
  COMPONENT = "component",
}

export interface ProductRecipeItem {
  id?: string;
  recipe_version_id: string;
  component_id: string;
  ingredient_id: string;
  components: Component;
  ingredients: Ingredient;
  quantity: number;
  item_type: ItemType;
}
