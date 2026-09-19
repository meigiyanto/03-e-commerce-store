"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Package, Star, Tag } from "lucide-react";
import { ProductFormData, productSchema } from "@/schemas/product-schema";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}

export function ProductForm({ initialData, onSubmit, isSubmitting = false }: ProductFormProps) {
  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      image: "",
      category: "",
      rating: 0,
      stock: 0,
    },
  });

  useEffect(() => {
    if (!initialData) return;
  
    form.reset({
      name: initialData.name,
      price: initialData.price,
      description: initialData.description,
      image: initialData.image,
      category: initialData.category,
      rating: initialData.rating,
      stock: initialData.stock,
    });
  }, [initialData, form]);

  const imageUrl = useWatch({
    control: form.control,
    name: "image",
  });
  const price = useWatch({
    control: form.control,
    name: "price",
  });
  const stock = useWatch({
    control: form.control,
    name: "stock",
  });
  const rating = useWatch({
    control: form.control,
    name: "rating",
  });

  const errors = form.formState.errors;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Basic Information */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Informasi Produk
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Informasi dasar produk yang akan ditampilkan.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              {/* Product name */}
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium"
                >
                  Nama Produk
                </label>

                <input
                  id="name"
                  {...form.register("name")}
                  placeholder="Contoh: Wireless Headphone"
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />

                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Tag className="h-4 w-4" />
                  Kategori
                </label>

                <input
                  id="category"
                  {...form.register("category")}
                  placeholder="Contoh: Electronics"
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />

                {errors.category && (
                  <p className="text-sm text-destructive">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium"
                >
                  Deskripsi
                </label>

                <textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Jelaskan detail produk, fitur, material, ukuran, dan informasi lainnya..."
                  rows={7}
                  className="w-full resize-y rounded-lg border bg-background px-3 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />

                {errors.description && (
                  <p className="text-sm text-destructive">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Price & Inventory */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Package className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Harga & Inventori
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Atur harga, stok, dan rating produk.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              {/* Price */}
              <div className="space-y-2">
                <label
                  htmlFor="price"
                  className="text-sm font-medium"
                >
                  Harga
                </label>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                  </span>

                  <input
                    id="price"
                    type="number"
                    min="0"
                    {...form.register("price", {
                      valueAsNumber: true,
                    })}
                    className="h-11 w-full rounded-lg border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />
                </div>

                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <label
                  htmlFor="stock"
                  className="text-sm font-medium"
                >
                  Stok
                </label>

                <input
                  id="stock"
                  type="number"
                  min="0"
                  {...form.register("stock", {
                    valueAsNumber: true,
                  })}
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                />

                {errors.stock && (
                  <p className="text-sm text-destructive">
                    {errors.stock.message}
                  </p>
                )}
              </div>

              {/* Rating */}
              <div className="space-y-2 sm:col-span-2">
                <label
                  htmlFor="rating"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Star className="h-4 w-4" />
                  Rating
                </label>

                <div className="relative">
                  <input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    {...form.register("rating", {
                      valueAsNumber: true,
                    })}
                    className="h-11 w-full rounded-lg border bg-background px-3 pr-12 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
                  />

                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    / 5
                  </span>
                </div>

                {errors.rating && (
                  <p className="text-sm text-destructive">
                    {errors.rating.message}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Gunakan nilai antara 0 sampai 5.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Image */}
          <section className="rounded-2xl border bg-white shadow-sm">
            <div className="border-b px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <ImageIcon className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="font-semibold">
                    Gambar Produk
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Masukkan URL gambar produk.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              {/* Preview */}
              <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
                {{imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="Preview produk"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                    <ImageIcon className="h-10 w-10" />

                    <p className="text-sm">
                      Preview gambar
                    </p>
                  </div>
                )}
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <label
                  htmlFor="image"
                  className="text-sm font-medium"
                >
                  Image URL
                </label>

                <input
                  id="image"
                  {...form.register("image")}
                  placeholder="https://example.com/image.jpg"
                  className="h-11 w-full rounded-lg border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                />

                {errors.image && (
                  <p className="text-sm text-destructive">
                    {errors.image.message}
                  </p>
                )}

                <p className="text-xs leading-5 text-muted-foreground">
                  Gunakan URL gambar yang dapat diakses secara
                  publik.
                </p>
              </div>
            </div>
          </section>

          {/* Summary */}
          <section className="rounded-2xl border bg-black text-white shadow-sm">
            <div className="p-6">
              <h2 className="font-semibold">
                Ringkasan
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/60">
                    Harga
                  </span>

                  <span className="font-medium">
                    Rp{" "}
                    {(
                      Number(price) || 0
                    ).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/60">
                    Stok
                  </span>

                  <span className="font-medium">
                    {Number(stock) || 0}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">
                    Rating
                  </span>

                  <span className="font-medium">
                    {(Number(rating) || 0).toFixed(
                      1
                    )}{" "}
                    / 5
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-xl text-sm font-semibold"
          >
            {isSubmitting
              ? "Menyimpan..."
              : initialData
                ? "Update Product"
                : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}

