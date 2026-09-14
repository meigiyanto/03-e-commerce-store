import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Product } from "@/types/product";

interface WishlistState {
  items: Product[];

  addItem: (item: Product) => void;

  removeItem: (id: string) => void;

  toggleItem: (item: Product) => void;

  isFavorite: (id: string) => boolean;

  clearWishlist: () => void;
}

export const useWishlistStore =
  create<WishlistState>()(
    persist(
      (set, get) => ({
        items: [],

        addItem: (item) => {
          const exists = get().items.some(
            (wishlistItem) =>
              wishlistItem.id === item.id
          );

          if (!exists) {
            set((state) => ({
              items: [
                ...state.items,
                item,
              ],
            }));
          }
        },

        removeItem: (id) => {
          set((state) => ({
            items: state.items.filter(
              (item) => item.id !== id
            ),
          }));
        },

        toggleItem: (item) => {
          const exists = get().items.some(
            (wishlistItem) =>
              wishlistItem.id === item.id
          );

          if (exists) {
            set((state) => ({
              items: state.items.filter(
                (wishlistItem) =>
                  wishlistItem.id !== item.id
              ),
            }));
          } else {
            set((state) => ({
              items: [
                ...state.items,
                item,
              ],
            }));
          }
        },

        isFavorite: (id) =>
          get().items.some(
            (item) => item.id === id
          ),

        clearWishlist: () =>
          set({
            items: [],
          }),
      }),
      {
        name: "nexashop-wishlist",
      }
    )
  );

