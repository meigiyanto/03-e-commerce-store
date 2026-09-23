"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/products/product-form";
import { ProductFormData } from "@/schemas/product-schema";
import { Product } from "@/types/product";
import { useProductStore } from "@/stores/product-store";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{id: string;}>();
  const id = params.id;
  const updateProduct = useProductStore((state) => state.updateProduct);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        setIsLoading(true);

        const response = await fetch(
          `/api/products/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ??
              "Produk tidak ditemukan."
          );
        }

        setProduct(data);
      } catch (error) {
        console.error("loadProduct error:",error);

        setError(error instanceof Error ? error.message : "Gagal mengambil produk.");
      } finally {
        setIsLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  async function handleSubmit(data: ProductFormData) {
    const updatedProduct = await updateProduct(id, data);

    if (!updatedProduct) {
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="rounded-lg border bg-white p-10 text-center">
          Memuat produk...
        </div>
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">
          Product Not Found
        </h1>

        {error && (
          <p className="mt-2 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Edit Product
        </h1>

        <p className="text-muted-foreground">
          Perbarui informasi produk.
        </p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
      />
    </div>
  );
}