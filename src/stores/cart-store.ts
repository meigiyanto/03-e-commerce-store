import { create } from "zustand"; 
import { Product } from "@/types/product";

export type CartItem = Product & { quantity: number; };

type CartStore = {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    increaseQuantity: (productId: number) => void;
    decreaseQuantity: (productId: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
    items: [],
    addItem: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find( (item) => item.id === product.id );

        // Jika produk sudah ada di cart
        if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                    }
                  : item
              ),
            };
          }

        // Jika produk belum ada di cart
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
    removeItem: (productId) => set((state) => ({ items: state.items.filter( (item) => item.id !== productId ), })),
    increaseQuantity: (productId) => set((state) => ({ items: state.items.map((item) => item.id === productId ? { ...item, quantity: item.quantity + 1, } : item ), })),
    decreaseQuantity: (productId) => set((state) => ({ items: state.items .map((item) => item.id === productId ? { ...item, quantity: item.quantity - 1, } : item ) .filter((item) => item.quantity > 0), })),
    clearCart: () => set({ items: [],
    }),}
));