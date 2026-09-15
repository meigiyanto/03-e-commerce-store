"use client";

import { useRouter } from "next/navigation";
import { ProductForm } from "@/components/admin/products/product-form";
import { ProductFormData } from "@/schemas/product-schema";
import { useProductStore } from "@/stores/product-store";

export default function CreateProductPage() {
  const router = useRouter();
  const addProduct = useProductStore((state) => state.addProduct);

  async function handleSubmit(data: ProductFormData) {
    const product = await addProduct(data);

    if (!product) {
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Add Product
        </h1>

        <p className="text-muted-foreground">
          Tambahkan produk baru ke katalog toko.
        </p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
      />
    </div>
  );
}