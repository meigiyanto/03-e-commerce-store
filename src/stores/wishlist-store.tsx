import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { Product } from "@/types/product";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
};

type WishlistState = {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggleItem: (product) =>
        set((s) => ({
          items: s.items.some((x) => x.id === product.id) ? s.items.filter((x) => x.id !== product.id) : [...s.items, product],
        })),
      removeItem: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: "nexashop-wishlist-v2" }
  )
);