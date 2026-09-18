import { create } from "zustand";
import { Product, ProductInput } from "@/types/product";

interface ProductState {
  products: Product[];
  hasHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductInput) => Promise<Product | null>;
  updateProduct: (id: string,product: Partial<ProductInput>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  setHasHydrated: (state: boolean) => void;
}

export const useProductStore =
  create<ProductState>((set) => ({
    products: [],
    hasHydrated: false,
    isLoading: false,
    error: null,
    setHasHydrated: (state) => {
      set({
        hasHydrated: state,
      });
    },
    fetchProducts: async () => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response = await fetch(
          "/api/products",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            "Gagal mengambil produk."
          );
        }

        const products: Product[] =
          await response.json();

        set({
          products,
          isLoading: false,
          hasHydrated: true,
          error: null,
        });
      } catch (error) {
        console.error(
          "fetchProducts error:",
          error
        );

        set({
          isLoading: false,
          hasHydrated: true,
          error:
            error instanceof Error
              ? error.message
              : "Gagal mengambil produk.",
        });
      }
    },
    addProduct: async (product) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response = await fetch(
          "/api/products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Gagal membuat produk."
          );
        }

        set((state) => ({
          products: [
            data,
            ...state.products,
          ],
          isLoading: false,
        }));

        return data;
      } catch (error) {
        console.error(
          "addProduct error:",
          error
        );

        set({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Gagal membuat produk.",
        });

        return null;
      }
    },
    updateProduct: async (id, product) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response = await fetch(
          `/api/products/${id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Gagal memperbarui produk."
          );
        }

        set((state) => ({
          products: state.products.map(
            (item) =>
              item.id === id
                ? data
                : item
          ),
          isLoading: false,
        }));

        return data;
      } catch (error) {
        console.error(
          "updateProduct error:",
          error
        );

        set({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Gagal memperbarui produk.",
        });

        return null;
      }
    },
    deleteProduct: async (id) => {
      set({
        isLoading: true,
        error: null,
      });

      try {
        const response = await fetch(
          `/api/products/${id}`,
          {
            method: "DELETE",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Gagal menghapus produk."
          );
        }

        set((state) => ({
          products: state.products.filter(
            (product) =>
              product.id !== id
          ),
          isLoading: false,
        }));

        return true;
      } catch (error) {
        console.error(
          "deleteProduct error:",
          error
        );

        set({
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Gagal menghapus produk.",
        });

        return false;
      }
    },
  }));