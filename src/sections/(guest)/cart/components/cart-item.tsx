import { SelectedOption, type CartItem } from "@/types/cart";
import React from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatCurrency } from "@/utils/format-data";
import { useCart } from "@/hooks/use-cart";
import { useUrlState } from "@/hooks/use-url-state";
import CustomNumberInput from "../../products/components/custom-number-input";

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
    <div className="cart-item w-full flex gap-3">
      <div
        onClick={() => setEditCartItem(item.id)}
        className="size-[3.75rem] cursor-pointer aspect-square flex justify-center items-center rounded-lg"
      >
        {item.menu_item.products.image_url ? (
          <Image
            unoptimized
            src={item.menu_item.products.image_url[0]}
            alt={item.menu_item.products.name}
            width={50}
            height={50}
          />
        ) : (
          <ImageOff />
        )}
      </div>

      <div className="w-full flex justify-between items-center text-xs gap-3">
        <div
          onClick={() => setEditCartItem(item.id)}
          className="text-xs text-left cursor-pointer space-y-1 grow"
        >
          <h2 className="text-base">{item.menu_item.products.name}</h2>

          {item.selected_options && item.selected_options.length > 0 && (
            <p className="overflow-hidden space-x-0.5 text-nowrap max-w-[10.5625rem] text-ellipsis">
              {item.selected_options
                .filter((option) => option.component_name !== "Bình thường")
                .map((option) => (
                  <span
                    className="inline-flex text-[#6E6E6E] gap-0.5 after:content-[','] last:after:hidden"
                    key={option.id}
                  >
                    {option.component_name}
                  </span>
                ))}
            </p>
          )}
          {item.line_note && <span className=" italic">{item.line_note}</span>}
          <p className="text-[#B60F14] text-base">
            {formatCurrency(itemPrice)}
          </p>
        </div>

        <CustomNumberInput
          className="[&_button]:bg-[unset] [&_svg]:text-[#8D1111] [&_.number-input]:bg-[#E2DDCD99]"
          value={item.quantity}
          setValue={(value) =>
            updateQuantity({ item_id: item.id, quantity: value })
          }
        />
      </div>
    </div>
  );
}
