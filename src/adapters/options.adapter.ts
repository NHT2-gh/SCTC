import { SelectedOption } from "@/types/cart";
import { ItemOptionDetail } from "@/types/menu";

export function OptionsAdapter(options: ItemOptionDetail[]): SelectedOption[] {
  return options.map((option) => {
    return {
      id: option.id,
      component_id: option.menu_items_options.components.id,
      component_name: option.menu_items_options.components.name,
      price: option.menu_items_options.price,
      option_type: option.menu_items_options.option_type,
      limit: option.limit,
    };
  });
}
