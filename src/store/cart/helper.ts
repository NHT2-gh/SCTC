import { CartItem, SelectedOption } from "@/types/cart";
import { CartItemPricing, CartSummary } from "./config";

export function normalizeSelectedOptions(
  options: SelectedOption[],
): SelectedOption[] {
  const map = new Map<string, SelectedOption>();

  for (const option of options) {
    map.set(option.id, option);
  }

  return Array.from(map.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export function buildCartItemKey(
  item: Pick<CartItem, "menu_item" | "selected_options" | "note">,
) {
  const optionIds = normalizeSelectedOptions(item.selected_options).map(
    (o) => o.id,
  );

  return JSON.stringify({
    menu_item: item.menu_item,
    selected_options: optionIds,
    note: item.note?.trim() ?? "",
  });
}

export function isSameCartItem(
  a: Pick<CartItem, "menu_item" | "selected_options" | "note">,
  b: Pick<CartItem, "menu_item" | "selected_options" | "note">,
) {
  return buildCartItemKey(a) === buildCartItemKey(b);
}

export function mergeDuplicatedItems(items: CartItem[]): CartItem[] {
  const map = new Map<string, CartItem>();

  for (const item of items) {
    const key = buildCartItemKey(item);

    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        ...item,
        selected_options: [...item.selected_options],
      });

      continue;
    }

    existing.quantity += item.quantity;
  }

  return Array.from(map.values());
}

export function getCartItemPricing(item: CartItem): CartItemPricing {
  const basePrice = item.menu_item.products.selling_price;

  const optionsPrice = item.selected_options.reduce(
    (total: number, option: SelectedOption) => total + option.price,
    0,
  );

  const unitPrice = basePrice + optionsPrice;

  return {
    base_price: basePrice,
    options_price: optionsPrice,
    unit_price: unitPrice,
    total_price: unitPrice * item.quantity,
  };
}

export function getCartSummary(items: CartItem[]): CartSummary {
  return items.reduce<CartSummary>(
    (summary, item) => {
      summary.item_count += item.quantity;
      summary.subtotal += getCartItemPricing(item).total_price;

      return summary;
    },
    {
      item_count: 0,
      subtotal: 0,
    },
  );
}
