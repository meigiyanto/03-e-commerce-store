"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";

import ProductRating from "@/components/product/ProductRating";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const addItem = useCartStore(
    (state) => state.addItem
  );

  const toggleItem = useWishlistStore(
    (state) => state.toggleItem
  );

  const isFavorite = useWishlistStore(
    (state) =>
      state.items.some(
        (item) => item.id === product.id
      )
  );

  const handleAddToCart = () => {
    addItem(product);
  };

  const handleFavorite = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();

    toggleItem(product);
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Product Image */}
      <Link href={`/products/${product.id}`}>
        <div className="relative h-60 overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="
              object-cover
              transition-transform
              group-hover:scale-105
            "
          />
          <button
            type="button"
            onClick={handleFavorite}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
            aria-label="Tambah ke wishlist"
          >
            <Heart
              size={20}
              className={
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }
            />
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
          {product.category}
        </p>

        <Link href={`/products/${product.id}`}>
          <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-semibold text-gray-900 transition hover:text-blue-600">
            {product.name}
          </h3>
        </Link>

        {"rating" in product && (
          <div className="mt-2">
            <ProductRating
              rating={product.rating}
              reviewCount={
                "reviewCount" in product
                  ? product.reviewCount
                  : 0
              }
            />
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-blue-600">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700"
            aria-label={`Tambah ${product.name} ke keranjang`}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}