export interface Ingredient {
  id: string;
  code: string;
  category_code: string;
  name: string;
  purchase_quantity: number;
  purchase_price: number;
  yield_percentage: number;
  cost_per_unit: number;
  notes?: string;
  ingredient_categories?: IngredientCategories;
}

export interface IngredientCategories {
  name: string;
  category_code: string;
}
