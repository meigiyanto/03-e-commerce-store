"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProductFormData,
  productSchema,
} from "@/schemas/product-schema";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: ProductFormData) => void;
  isSubmitting?: boolean;
}

export function ProductForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
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
    if (initialData) {
      form.reset({
        name: initialData.name,
        price: initialData.price,
        description: initialData.description,
        image: initialData.image,
        category: initialData.category,
        rating: initialData.rating,
        stock: initialData.stock,
      });
    }
  }, [initialData, form]);

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Product Name
        </Label>

        <Input
          id="name"
          placeholder="Masukkan nama produk"
          {...form.register("name")}
        />

        {form.formState.errors.name && (
          <p className="text-sm text-destructive">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">
          Price
        </Label>

        <Input
          id="price"
          type="number"
          {...form.register("price", {
            valueAsNumber: true,
          })}
        />

        {form.formState.errors.price && (
          <p className="text-sm text-destructive">
            {form.formState.errors.price.message}
          </p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">
          Category
        </Label>

        <Input
          id="category"
          placeholder="Contoh: Electronics"
          {...form.register("category")}
        />

        {form.formState.errors.category && (
          <p className="text-sm text-destructive">
            {form.formState.errors.category.message}
          </p>
        )}
      </div>

      {/* Image */}
      <div className="space-y-2">
        <Label htmlFor="image">
          Image URL
        </Label>

        <Input
          id="image"
          placeholder="https://..."
          {...form.register("image")}
        />

        {form.formState.errors.image && (
          <p className="text-sm text-destructive">
            {form.formState.errors.image.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          placeholder="Masukkan deskripsi produk"
          {...form.register("description")}
        />

        {form.formState.errors.description && (
          <p className="text-sm text-destructive">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <Label htmlFor="rating">
          Rating
        </Label>

        <Input
          id="rating"
          type="number"
          min="0"
          max="5"
          step="0.1"
          {...form.register("rating", {
            valueAsNumber: true,
          })}
        />

        {form.formState.errors.rating && (
          <p className="text-sm text-destructive">
            {form.formState.errors.rating.message}
          </p>
        )}
      </div>

      {/* Stock */}
      <div className="space-y-2">
        <Label htmlFor="stock">
          Stock
        </Label>

        <Input
          id="stock"
          type="number"
          min="0"
          {...form.register("stock", {
            valueAsNumber: true,
          })}
        />

        {form.formState.errors.stock && (
          <p className="text-sm text-destructive">
            {form.formState.errors.stock.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting
          ? "Saving..."
          : initialData
            ? "Update Product"
            : "Create Product"}
      </Button>
    </form>
  );
}