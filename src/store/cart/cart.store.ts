"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartActions, CartState } from "./config";
import { STORAGE_KEYS } from "../storage_keys";
import { CartItem } from "@/types/cart";
import {
  isSameCartItem,
  mergeDuplicatedItems,
  normalizeSelectedOptions,
} from "./helper";
import { v4 as uuidv4 } from "uuid";

export type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      add_item: (payload) => {
        set((state) => {
          const normalizedOptions = normalizeSelectedOptions(
            payload.selected_options ?? [],
          );

          const incoming = {
            menu_item: payload.menu_item,
            selected_options: normalizedOptions,
            note: payload.note?.trim(),
          };

          const existing = state.items.find((item) =>
            isSameCartItem(item, incoming),
          );

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.id === existing.id
                  ? {
                      ...item,
                      quantity: item.quantity + (payload.quantity ?? 1),
                    }
                  : item,
              ),
            };
          }

          console.log(normalizedOptions, incoming, existing);

          const newItem: CartItem = {
            id: uuidv4(),
            menu_item: payload.menu_item,
            quantity: payload.quantity ?? 1,
            selected_options: normalizedOptions,
            note: payload.note?.trim(),
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      remove_item: (item_id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== item_id),
        }));
      },

      update_quantity: (payload) => {
        set((state) => ({
          items: state.items
            .map((item) => {
              if (item.id !== payload.item_id) {
                return item;
              }

              return {
                ...item,
                quantity: payload.quantity,
              };
            })
            .filter((item) => item.quantity > 0),
        }));
      },

      update_options: (payload) => {
        set((state) => {
          const items = state.items.map((item) =>
            item.id === payload.item_id
              ? {
                  ...item,
                  selected_options: normalizeSelectedOptions(
                    payload.selected_options,
                  ),
                }
              : item,
          );

          return {
            items: mergeDuplicatedItems(items),
          };
        });
      },

      update_note: (payload) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== payload.item_id) {
              return item;
            }

            return {
              ...item,
              note: payload.note.trim(),
            };
          }),
        }));
      },

      clear: () => {
        set({
          items: [],
        });
      },
    }),
    {
      name: STORAGE_KEYS.CART,
      partialize: (state) => ({
        items: state.items,
      }),
    },
  ),
);
