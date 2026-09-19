export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating: number;
  reviewCount?: number;
  stock: number;
  createdAt?: string;
  updatedAt?: string;
  specifications?: Record<string, string>;
}

export type ProductInput = Omit<Product, "id" | "reviewCount" | "createdAt" | "updatedAt">;

export type ProductUpdateInput = Partial<ProductInput>;
