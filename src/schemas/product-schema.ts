import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(3, "Nama produk minimal 3 karakter"),
  price: z.number().finite().min(0, "Harga tidak boleh negatif"),
  description: z.string().trim().min(10, "Deskripsi minimal 10 karakter"),
  image: z.string().trim().url("URL gambar tidak valid"),
  category: z.string().trim().min(1, "Kategori wajib diisi"),
  rating: z.number().finite().min(0).max(5),
  stock: z.number().int().min(0, "Stock tidak boleh negatif"),
});

export const productUpdateSchema = productSchema.partial();

export type ProductFormData = z.infer<typeof productSchema>;
export type ProductUpdateData = z.infer<typeof productUpdateSchema>;
