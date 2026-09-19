"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronRight, Heart, ShoppingBag, ShoppingCart, Star, Trash2, X } from "lucide-react";
import { Product } from "@/type/product";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function WishlistPage() {
  // Mencegah masalah Hydration Mismatch dari Zustand persist
  const [isMounted, setIsMounted] = useState(false);
  const items = useWishlistStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <p className="text-gray-500">Memuat wishlist...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* BREADCRUMB */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm md:px-8">
          <Link href="/" className="text-gray-500 transition hover:text-blue-600">
            Beranda
          </Link>
          <ChevronRight size={16} className="text-gray-400" />
          <span className="font-medium text-gray-900">Wishlist</span>
        </div>
      </div>

      {/* HEADER */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <Heart size={24} className="fill-red-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Wishlist</p>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                    Produk Favorit Anda
                  </h1>
                </div>
              </div>
            </div>

            {items.length > 0 && (
              <button
                type="button"
                onClick={clearWishlist}
                className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={17} />
                Hapus Semua
              </button>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        {items.length === 0 ? (
          <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Heart size={38} />
            </div>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Wishlist Anda Masih Kosong</h2>
            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <ShoppingBag size={19} />
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <article
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 transition hover:shadow-lg sm:p-5"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <Link
                    href={`/products/${item.id}`}
                    className="relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={128}
                      height={128}
                      className="h-full w-full object-contain"
                    />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                          {item.category}
                        </p>
                        <Link href={`/products/${item.id}`}>
                          <h2 className="mt-1 text-lg font-bold text-gray-900 hover:text-blue-600">
                            {item.name}
                          </h2>
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <p className="mt-3 text-xl font-bold text-blue-600">{formatPrice(item.price)}</p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:w-44">
                    <button
                      type="button"
                      onClick={() => addItem(item)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      <ShoppingCart size={18} />
                      Ke Keranjang
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}