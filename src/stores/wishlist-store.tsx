import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
    id: string | number;
    name: string;
    price: number;
    image: string;
    category: string;
    rating?: number;
    reviewCount?: number;
}

interface WishlistState {
    items: WishlistItem[];
    addItem: (item: WishlistItem) => void;
    removeItem: (id: string | number) => void;
    toggleItem: (item: WishlistItem) => void;
    isFavorite: (id: string | number) => boolean;
    clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
    persist((set, get) => ({
        items: [],
        addItem: (item) => {
            const exists = get().items.some(
                (wishlistItem) => wishlistItem.id === item.id
            );
        
            if (!exists) {
                set((state) => ({
                    items: [...state.items, item],
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
            const exists = get().items.some((wishlistItem) => wishlistItem.id === item.id);
    
            if (exists) {
                set((state) => ({
                    items: state.items.filter((wishlistItem) => wishlistItem.id !== item.id),
                }));
            } else {
                set((state) => ({
                    items: [...state.items, item],
                }));
            }
        },
        isFavorite: (id) => {
            return get().items.some((item) => item.id === id);
        },
        clearWishlist: () => {
            set({items: [],});
          },
        }),
        {
          name: "wishlist-storage",
        }
    )
)