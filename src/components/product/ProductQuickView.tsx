"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Minus, Plus, ShoppingCart, X } from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cart-store";

type ProductQuickViewProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductQuickView({ product, open, onClose }: ProductQuickViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open) return;
  
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
  
    document.addEventListener("keydown", handleEscape);
  
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

  return () => {
    document.removeEventListener("keydown", handleEscape);
    document.body.style.overflow = originalOverflow;
  };
}, [open, onClose]);
  
  if (!open || !product) {
    return null;
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      return;
    }

    addItem(product, quantity);
    onClose();
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${product.name}`}
    >
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* CLOSE */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-md transition hover:bg-gray-100 hover:text-gray-900"
          aria-label="Tutup quick view"
        >
          <X size={20} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* IMAGE */}
          <div className="relative flex min-h-[320px] items-center justify-center bg-gray-50 p-8 md:min-h-[520px]">
            <div className="relative h-[300px] w-full md:h-[420px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* INFO */}
          <div className="flex flex-col p-6 md:p-8">
            <div className="mb-2 flex items-center gap-2">
              <Eye
                size={16}
                className="text-blue-600"
              />

              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Quick View
              </span>
            </div>

            <Link
              href={`/products/${product.id}`}
              onClick={onClose}
              className="text-sm font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-700"
            >
              {product.category}
            </Link>

            <h2 className="mt-3 text-2xl font-bold leading-tight text-gray-900 md:text-3xl">
              {product.name}
            </h2>

            {/* RATING */}
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map(
                  (_, index) => (
                    <span
                      key={index}
                      className={
                        index <
                        Math.round(
                          product.rating ?? 0
                        )
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    >
                      ★
                    </span>
                  )
                )}
              </div>

              <span className="text-sm text-gray-500">
                {product.rating ?? 0}
              </span>
            </div>

            {/* PRICE */}
            <div className="mt-6 rounded-xl bg-blue-50 p-4">
              <p className="text-sm text-gray-500">
                Harga
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900">
                Deskripsi
              </h3>

              <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>

            {/* STOCK */}
            <div className="mt-5">
              <span className="text-sm font-semibold text-gray-900">
                Stok:
              </span>{" "}
              <span
                className={
                  isOutOfStock
                    ? "text-sm font-medium text-red-500"
                    : "text-sm text-green-600"
                }
              >
                {isOutOfStock
                  ? "Habis"
                  : `${product.stock} tersedia`}
              </span>
            </div>

            {/* QUANTITY */}
            {!isOutOfStock && (
              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-900">
                  Jumlah
                </span>

                <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                    aria-label="Kurangi jumlah"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="flex h-10 min-w-12 items-center justify-center border-x border-gray-200 px-3 text-sm font-semibold text-gray-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= product.stock
                    }
                    className="flex h-10 w-10 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Tambah jumlah"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-auto pt-7">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart size={20} />

                {isOutOfStock
                  ? "Stok Habis"
                  : "Masukkan ke Keranjang"}
              </button>

              <Link
                href={`/products/${product.id}`}
                onClick={onClose}
                className="mt-3 flex w-full items-center justify-center rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Lihat Detail Produk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}