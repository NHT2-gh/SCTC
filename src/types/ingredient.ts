export enum UnitType {
  gram = "g",
  ml = "ml",
}

export enum IngredientCategoryType {
  TEA = "TEA",
  SYRUP = "SYRUP",
  FRUIT = "FRUIT",
  OTHER = "OTHER",
  POWDER = "POWDER",
  TOPPING = "TOPPING",
  MILK = "MILK",
  MATCHA = "MATCHA",
  HOUJICHA = "HOUJICHA",
  DAIRY = "DAIRY",
  COFFEE = "COFFEE",
  ALCOHOL = "ALCOHOL",
  JUICE = "JUICE",
}
export const MapTextIngredientCategoryType = {
  [IngredientCategoryType.TEA]: "Trà",
  [IngredientCategoryType.SYRUP]: "Syrup",
  [IngredientCategoryType.FRUIT]: "Trái cây",
  [IngredientCategoryType.OTHER]: "Khác",
  [IngredientCategoryType.POWDER]: "Bột",
  [IngredientCategoryType.TOPPING]: "Topping",
  [IngredientCategoryType.MILK]: "Sữa",
  [IngredientCategoryType.MATCHA]: "Matcha",
  [IngredientCategoryType.HOUJICHA]: "Houjicha",
  [IngredientCategoryType.DAIRY]: "Sữa",
  [IngredientCategoryType.COFFEE]: "Cà phê",
  [IngredientCategoryType.ALCOHOL]: "Rượu",
  [IngredientCategoryType.JUICE]: "Nước ép",
};

export interface Ingredient {
  id: string;
  code: string;
  category_code: IngredientCategoryType;
  name: string;
  purchase_quantity: number;
  purchase_price: number;
  yield_percentage: number;
  cost_per_unit: number;
  notes?: string;
  unit: UnitType;
}
