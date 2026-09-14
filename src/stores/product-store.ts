import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  Product,
  ProductInput,
} from "@/types/product";

import { products as initialProducts } from "@/data/products";

interface ProductState {
  products: Product[];

  addProduct: (
    product: ProductInput
  ) => void;

  updateProduct: (
    id: string,
    product: Partial<ProductInput>
  ) => void;

  deleteProduct: (
    id: string
  ) => void;
}

export const useProductStore =
  create<ProductState>()(
    persist(
      (set) => ({
        products: initialProducts,

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
              (product) =>
                product.id !== id
            ),
          }));
        },
      }),
      {
        name: "product-storage",
      }
    )
  );