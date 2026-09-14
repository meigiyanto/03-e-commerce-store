import { create } from "zustand"; 
import { persist } from "zustand/middleware";
import { Product } from "@/types/product";

export type CartItem = Product & {
  quantity: number;
};

type CartStore = {
  items: CartItem[];

  addItem: (
    product: Product,
    quantity?: number
  ) => void;

  removeItem: (
    productId: number
  ) => void;

  increaseQuantity: (
    productId: number
  ) => void;

  decreaseQuantity: (
    productId: number
  ) => void;

  clearCart: () => void;

  getTotalItems: () => number;

  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === product.id
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity:
                        item.quantity + quantity,
                    }
                  : item
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...product,
                quantity,
              },
            ],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.id !== productId
          ),
        })),

      increaseQuantity: (productId) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
          ),
        })),

      decreaseQuantity: (productId) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === productId
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item
            )
            .filter(
              (item) =>
                item.quantity > 0
            ),
        })),

      clearCart: () =>
        set({
          items: [],
        }),

      getTotalItems: () =>
        get().items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        ),

      getTotalPrice: () =>
        get().items.reduce(
          (total, item) =>
            total +
            item.price * item.quantity,
          0
        ),
    }),
    {
      name: "nexashop-cart",
    }
  )
);