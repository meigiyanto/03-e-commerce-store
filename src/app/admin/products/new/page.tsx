"use client";

import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { ProductForm } from "@/components/admin/products/product-form";
import { ProductFormData } from "@/schemas/product-schema";
import { useProductStore } from "@/stores/product-store";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CreateProductPage() {
  const router = useRouter();
  const addProduct = useProductStore(
    (state) => state.addProduct
  );

  async function handleSubmit(data: ProductFormData) {
    const product = await addProduct(data);

    if (!product) {
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Produk
        </Link>

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white">
            <PackagePlus className="h-6 w-6" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Tambah Produk
            </h1>

            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Tambahkan produk baru ke katalog toko Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <ProductForm onSubmit={handleSubmit} />

      {/* Bottom navigation */}
      <div className="flex justify-end border-t pt-6">
        <Link
          href="/admin/products"
          className={cn(
            buttonVariants({
              variant: "outline",
            })
          )}
        >
          Kembali ke Produk
        </Link>
      </div>
    </div>
  );
}

