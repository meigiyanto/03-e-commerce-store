"use client";

import Link from "next/link";
import { useProductStore } from "@/stores/product-store";
import { ProductTable } from "@/components/admin/products/product-table";
import { Button } from "@/components/ui/button";

export default function AdminProductsPage() {
  const products = useProductStore(
    (state) => state.products
  );

  const deleteProduct = useProductStore(
    (state) => state.deleteProduct
  );

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus produk ini?"
    );

    if (!confirmed) {
      return;
    }

    deleteProduct(id);
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

        <Button asChild>
          <Link href="/admin/products/new">
            + Add Product
          </Link>
        </Button>
      </div>

      <ProductTable
        products={products}
        onDelete={handleDelete}
      />
    </div>
  );
}