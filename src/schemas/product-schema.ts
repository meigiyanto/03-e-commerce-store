import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(3, "Nama produk minimal 3 karakter"),

  price: z
    .number({
      error: "Harga harus berupa angka",
    })
    .min(0, "Harga tidak boleh negatif"),

  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter"),

  image: z
    .string()
    .url("URL gambar tidak valid"),

  category: z
    .string()
    .min(1, "Kategori wajib diisi"),

  rating: z
    .number({
      error: "Rating harus berupa angka",
    })
    .min(0)
    .max(5),

  stock: z
    .number({
      error: "Stock harus berupa angka",
    })
    .int()
    .min(0, "Stock tidak boleh negatif"),
});

export type ProductFormData = z.infer<
  typeof productSchema
>;