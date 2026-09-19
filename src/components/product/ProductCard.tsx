"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Heart, ShoppingCart } from "lucide-react";
import ProductRating from "@/components/product/ProductRating";
import ProductQuickView from "@/components/product/ProductQuickView";

import { Product } from "@/types/product";
import { Scale } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useComparisonStore } from "@/stores/comparison-store";
import { useWishlistStore } from "@/stores/wishlist-store";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isFavorite = useWishlistStore((state) => state.items.some((item) => item.id === product.id));

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      return;
    }

    addItem(product);
  };

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    toggleItem(product);
  };

  const handleQuickView = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsQuickViewOpen(true);
  };

  const toggleCompare = useComparisonStore((state) => state.toggleItem);
  const isCompared = useComparisonStore((state) => state.isSelected(product.id));
  const compareItems = useComparisonStore((state) => state.items);

  return (
    <>
      <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
        {/* PRODUCT IMAGE */}
        <Link href={`/products/${product.id}`}>
          <div className="relative h-60 overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform group-hover:scale-105"
            />

            {/* ACTION BUTTONS */}
            <div className="absolute right-3 top-3 flex flex-col gap-2">
              {/* QUICK VIEW */}
              <button
                type="button"
                onClick={handleQuickView}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 hover:bg-gray-50"
                aria-label={`Lihat cepat ${product.name}`}
              >
                <Eye
                  size={19}
                  className="text-gray-600"
                />
              </button>

              {/* WISHLIST */}
              <button
                type="button"
                onClick={handleFavorite}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110 hover:bg-gray-50"
                aria-label={
                  isFavorite
                    ? "Hapus dari wishlist"
                    : "Tambah ke wishlist"
                }
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

              {/* PRODUCT COMPARE */}
              <button
                type="button"
                onClick={() => toggleCompare(product)}
                disabled={
                  !isCompared && compareItems.length >= 4
                }
                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                  isCompared
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                } ${
                  !isCompared && compareItems.length >= 4
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
                title={
                  isCompared
                    ? "Hapus dari perbandingan"
                    : compareItems.length >= 4
                      ? "Maksimal 4 produk"
                      : "Bandingkan produk"
                }
                aria-label={
                  isCompared
                    ? `Hapus ${product.name} dari perbandingan`
                    : `Bandingkan ${product.name}`
                }
              >
                <Scale size={17} />
              </button>
            </div>
          </div>
        </Link>

        {/* PRODUCT INFO */}
        <div className="p-4">
          {/* CATEGORY */}
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600">
            {product.category}
          </p>

          {/* NAME */}
          <Link href={`/products/${product.id}`}>
            <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-semibold text-gray-900 transition hover:text-blue-600">
              {product.name}
            </h3>
          </Link>

          {/* RATING */}
          {"rating" in product && (
            <div className="mt-2">
              <ProductRating
                rating={product.rating}
                reviewCount={product.reviewCount ?? 0}
              />
            </div>
          )}

          {/* PRICE + CART */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-lg font-bold text-blue-600">
              Rp{" "}
              {product.price.toLocaleString(
                "id-ID"
              )}
            </p>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={`Tambah ${product.name} ke keranjang`}
            >
              <ShoppingCart size={18} />
            </button>
          </div>

          {/* STOCK STATUS */}
          <p
            className={`mt-2 text-xs ${
              product.stock > 0
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} stok tersedia`
              : "Stok habis"}
          </p>
        </div>
      </div>

      {/* QUICK VIEW MODAL */}
      <ProductQuickView
        product={product}
        open={isQuickViewOpen}
        onClose={() =>
          setIsQuickViewOpen(false)
        }
      />
    </>
  );
}