import { SelectedOption, type CartItem } from "@/types/cart";
import React from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatCurrency } from "@/utils/format-data";
import { useCart } from "@/hooks/use-cart";
import { useUrlState } from "@/hooks/use-url-state";
import CustomNumberInput from "../../products/view/components/custom-number-input";
import { CloseIcon } from "@/icons";

export default function CartItem({ item }: { item: CartItem }) {
  const { updateQuantity } = useCart();
  const [_, setEditCartItem] = useUrlState("edit");
  const itemPrice =
    item.menu_item.products.selling_price +
    item.selected_options.reduce(
      (total: number, option: SelectedOption) => total + option.price,
      0,
    );

  return (
    <div className="cart-item w-full flex gap-2">
      <div
        onClick={() => setEditCartItem(item.id)}
        className="size-[3.75rem] cursor-pointer aspect-square flex justify-center items-center rounded-lg"
      >
        {item.menu_item.products.image_url ? (
          <Image
            src={item.menu_item.products.image_url}
            alt={item.menu_item.products.name}
            width={60}
            height={60}
          />
        ) : (
          <ImageOff />
        )}
      </div>

      <div className="w-full flex justify-between items-center text-xs">
        <div
          onClick={() => setEditCartItem(item.id)}
          className="text-xs text-left cursor-pointer space-y-1.5"
        >
          <h2>{item.menu_item.products.name}</h2>

          {item.selected_options && item.selected_options.length > 0 && (
            <div className="flex gap-1">
              {item.selected_options.map((option) => (
                <span
                  className="inline-flex text-[#6E6E6E] gap-1 after:content-[','] last:after:hidden"
                  key={option.id}
                >
                  {option.component_name}
                </span>
              ))}
            </div>
          )}

          <p className="text-[#B60F14] text-base">
            {formatCurrency(itemPrice)}
          </p>

          {item.note && <span className=" italic">{item.note}</span>}
        </div>

        <CustomNumberInput
          value={item.quantity}
          setValue={(value) =>
            updateQuantity({ item_id: item.id, quantity: value })
          }
        />
      </div>
    </div>
  );
}
