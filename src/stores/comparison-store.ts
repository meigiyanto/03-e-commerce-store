import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

const MAX_COMPARE = 4;

type ComparisonState = {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  isSelected: (id: string) => boolean;
};

export const useComparisonStore =
  create<ComparisonState>()(
    persist(
      (set, get) => ({
        items: [],

        toggleItem: (product) =>
          set((state) => {
            const exists = state.items.some(
              (item) => item.id === product.id
            );

            if (exists) {
              return {
                items: state.items.filter(
                  (item) => item.id !== product.id
                ),
              };
            }

            if (state.items.length >= MAX_COMPARE) {
              return state;
            }

            return {
              items: [
                ...state.items,
                product,
              ],
            };
          }),

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

        isSelected: (id) =>
          get().items.some(
            (item) => item.id === id
          ),
      }),
      {
        name: "nexashop-comparison",
      }
    )
  );