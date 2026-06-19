import { SelectedOption, type CartItem } from "@/types/cart";
import React from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatCurrency } from "@/utils/format-data";

export default function CartItem({ item }: { item: CartItem }) {
  const itemPrice =
    item.menu_item.products.selling_price +
    item.selected_options.reduce(
      (total: number, option: SelectedOption) => total + option.price,
      0,
    );

  return (
    <div className="cart-item flex items-center gap-4">
      {item.menu_item.products.image_url ? (
        <Image
          src={item.menu_item.products.image_url}
          alt={item.menu_item.products.name}
          width={80}
          height={80}
        />
      ) : (
        <div className="size-[3.75rem] aspect-square bg-neutral-200 flex justify-center items-center rounded-lg">
          <ImageOff />
        </div>
      )}

      <div className="w-full flex justify-between items-center text-xs">
        <div className="text-xs">
          <h2>
            {item.menu_item.products.name} x {item.quantity}
          </h2>

          {item.selected_options && item.selected_options.length > 0 && (
            <div className="flex gap-1">
              {item.selected_options.map((option) => (
                <span
                  className="inline-flex text-[#79725B] gap-1 after:content-[','] last:after:hidden"
                  key={option.id}
                >
                  {option.component_name}
                </span>
              ))}
            </div>
          )}
          <p className="italic">{item.note || "Đây là note"}</p>
          {item.note && (
            <span className=" italic">{item.note || "Đây là note"}</span>
          )}
        </div>
        <span>{formatCurrency(itemPrice)}</span>
      </div>
    </div>
  );
}
