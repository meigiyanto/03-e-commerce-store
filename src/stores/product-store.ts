import { create } from "zustand";
import type { Product, ProductInput, ProductUpdateInput } from "@/types/product";

type ProductState = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  addProduct: (product: ProductInput) => Promise<Product | null>;
  updateProduct: (id: string, product: ProductUpdateInput ) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ?? `Request gagal (${response.status}).`,
    );
  }

  return data as T;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/products", {
        cache: "no-store",
      });

      const products = await parseResponse<Product[]>(response);
      set({ products, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil produk.",
      });
    }
  },

  addProduct: async (product) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const created = await parseResponse<Product>(response);

      set((state) => ({
        products: [created, ...state.products],
        isLoading: false,
      }));

      return created;
    } catch (error) {
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
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const updated = await parseResponse<Product>(response);

      set((state) => ({
        products: state.products.map((item) =>
          item.id === id ? updated : item,
        ),
        isLoading: false,
      }));

      return updated;
    } catch (error) {
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
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      await parseResponse<{ message: string }>(response);

      set((state) => ({
        products: state.products.filter((item) => item.id !== id),
        isLoading: false,
      }));

      return true;
    } catch (error) {
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
