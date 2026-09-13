"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product"; 
import { useCartStore } from "@/stores/cart-store";

type ProductCardProps = { product: Product; };

export default function ProductCard({ product, }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const handleAddToCart = () => { addItem(product); };
    
    return (
        <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

          {/* Product Image */}
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        
          {/* Product Content */}
          <div className="p-4">
            <p className="mb-2 text-sm text-blue-600">
              {product.category}
            </p>
        
            <h3 className="text-lg font-semibold text-gray-900">
              {product.name}
            </h3>
        
            <div className="mt-4 flex items-center justify-between">
              <p className="text-lg font-bold text-gray-900">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
        
              <button
                className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                aria-label="Tambah ke keranjang"
              >
                <ShoppingCart size={18} />
              </button>
            </div>
          </div>
        </div>
    )
}