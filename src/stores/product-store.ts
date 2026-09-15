import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products as initialProducts } from "@/data/products";
import {
  Product,
  ProductInput,
} from "@/types/product";

interface ProductState {
  products: Product[];
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addProduct: (product: ProductInput) => void;
  updateProduct: (id: string,product: Partial<ProductInput>) => void;
  deleteProduct: (id: string) => void;
}

export const useProductStore =
  create<ProductState>()(
    persist(
      (set) => ({
        products: initialProducts,
        hasHydrated: false,
        setHasHydrated: (state) => {
          set({hasHydrated: state,});
        },
        addProduct: (product) => {
          const newProduct: Product = {
            id: crypto.randomUUID(),
            ...product,
          };

          set((state) => ({
            products: [
              ...state.products,
              newProduct,
            ],
          }));
        },
        updateProduct: (
          id,
          updatedProduct
        ) => {
          set((state) => ({
            products: state.products.map(
              (product) =>
                product.id === id
                  ? {
                      ...product,
                      ...updatedProduct,
                    }
                  : product
            ),
          }));
        },
        deleteProduct: (id) => {
          set((state) => ({
            products: state.products.filter(
              (product) => product.id !== id
            ),
          }));
        },
      }),
      {
        name: "product-storage",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  );