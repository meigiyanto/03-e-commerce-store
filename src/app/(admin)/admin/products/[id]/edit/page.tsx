"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import { ProductForm } from "@/components/admin/products/product-form";

import { ProductFormData } from "@/schemas/product-schema";

import { useProductStore } from "@/stores/product-store";

export default function EditProductPage() {
  const router = useRouter();

  const params = useParams();

  const id = params.id as string;

  const product = useProductStore(
    (state) => state.products.find(
      (product) => product.id === id
    )
  );

  const updateProduct = useProductStore(
    (state) => state.updateProduct
  );

  if (!product) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">
          Product Not Found
        </h1>
      </div>
    );
  }

  function handleSubmit(
    data: ProductFormData
  ) {
    updateProduct(id, data);

    router.push("/admin/products");
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