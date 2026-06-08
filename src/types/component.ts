export enum ComponentType {
  concentrate = "Thành phần cơ bản",
  syrup = "Syrup",
  milk_mix = "Hỗn hợp sữa",
  foam = "Kem",
  sauce = "Sốt",
  tea_base = "Trà nền",
  fruit_base = "Trái cây",
  powder_mix = "Hỗn hợp bột",
  topping = "Topping",
  other = "Khác",
}

export interface Component {
  id: string;
  name: string;
  description: string;
  component_type: keyof typeof ComponentType;
}

export interface ComponentRecipeItem {
  id?: string;
  component_id: string;
  ingredient_id: string;
  quantity: number;
}
