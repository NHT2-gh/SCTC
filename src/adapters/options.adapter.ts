import { SelectedOption } from "@/types/cart";
import { ItemOptionDetail, MenuItemOption } from "@/types/menu";
import { v4 } from "uuid";

export function OptionsAdapter(options: ItemOptionDetail[]): SelectedOption[] {
  return options.map((option) => {
    return {
      id: String(option.id),
      option_id: option.option_id,
      menu_item_id: option.menu_item_id,
      component_id: option.menu_items_options.components.id,
      component_name: option.menu_items_options.option_name,
      price: option.menu_items_options.price,
      option_type: option.menu_items_options.option_type,
      description: option.menu_items_options.description,
      limit: option.limit,
    };
  });
}

export function FixedOptionAdapter(
  fiexedOptions: MenuItemOption[],
): SelectedOption[] {
  return fiexedOptions.map((option) => ({
    id: v4(),
    option_id: String(option.id),
    component_id: String(option.id),
    component_name: option.option_name,
    description: option.description,
    price: option.price,
    option_type: option.option_type,
  }));
}
