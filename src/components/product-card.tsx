"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useStore } from "@/context/store-context";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const liked = isWishlisted(product.id);

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <img src={product.image} alt={product.name} className="h-56 w-full object-cover" />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
          {product.badge}
        </div>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          className={`absolute right-4 top-4 rounded-full p-2 ${liked ? "bg-cyan-500 text-white" : "bg-white/90 text-slate-700"}`}
        >
          <Heart size={16} />
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-600">{product.category}</p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-semibold text-slate-900">${product.price}</p>
            <p className="text-sm text-slate-500">★ {product.rating}</p>
          </div>
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            <ShoppingBag size={16} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
