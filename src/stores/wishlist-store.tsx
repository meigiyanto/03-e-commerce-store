import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  ids: string[];
  toggleItem: (id: string) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggleItem: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id], })),
      removeItem: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clearWishlist: () => set({ ids: [] }),
    }),
    { name: "nexashop-wishlist-v2", partialize: (s) => ({ ids: s.ids }) },
  ),
);
