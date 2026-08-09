"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useStore } from "@/context/store-context";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const liked = isInWishlist(product.id);

  function handleAddToCart() {
    addToCart(product);
  }

  function handleWishlist() {
    toggleWishlist(product.id);
  }

  return (
    <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product image */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link
          href={`/products/${product.id}`}
          aria-label={`View ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Wishlist */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            liked
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={liked}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition ${
            liked
              ? "bg-red-500 text-white"
              : "bg-white/90 text-slate-700 hover:bg-white hover:text-red-500"
          }`}
        >
          <Heart
            size={18}
            fill={liked ? "currentColor" : "none"}
          />
        </button>

        {/* Product Rating */}
        <div className="mt-3 flex items-center gap-2">
          <div
            className="flex text-amber-400"
            aria-label={`Rating ${product.rating ?? 0} dari 5`}
          >
            {"★★★★★".split("").map((star, index) => (
              <span
                key={index}
                className={
                  index < Math.round(product.rating ?? 0)
                    ? "text-amber-400"
                    : "text-slate-200"
                }
              >
                {star}
              </span>
            ))}
          </div>

          <span className="text-sm font-medium text-slate-600">
            {(product.rating ?? 0).toFixed(1)}
          </span>
        </div>

        {/* Category */}
        <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
          {product.category}
        </span>
      </div>

      {/* Product information */}
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h2 className="line-clamp-1 text-lg font-semibold text-slate-900 transition hover:text-cyan-700">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
          {product.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <p className="text-xl font-semibold text-slate-900">
            ${product.price.toFixed(2)}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 active:scale-95"
          >
            <ShoppingCart size={16} />
            Add
          </button>
        </div>
      </div>
    </article>
  );
}
