"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useProductStore } from "@/stores/product-store";
import { ProductTable } from "@/components/admin/products/product-table";
import { buttonVariants } from "@/components/ui/button";

export default function AdminProductsPage() {
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus produk ini?"
    );

    if (!confirmed) {
      return;
    }

    await deleteProduct(id);
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="text-muted-foreground">
            Kelola produk toko Anda.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className={buttonVariants({ variant: "default" })}
        >
          + Add Product
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading && products.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">
          Memuat produk...
        </div>
      ) : (
        <ProductTable
          products={products}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}