import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

const MAX_ITEMS = 8;

type RecentlyViewedState = {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
};

export const useRecentlyViewedStore =
  create<RecentlyViewedState>()(
    persist(
      (set) => ({
        items: [],
        addItem: (product) =>
          set((state) => ({
            items: [
              product,
              ...state.items.filter(
                (item) => item.id !== product.id
              ),
            ].slice(0, MAX_ITEMS),
          })),
        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter(
              (item) => item.id !== id
            ),
          })),
        clear: () =>
          set({
            items: [],
          }),
      }),
      {
        name: "nexashop-recently-viewed",
      }
    )
  );