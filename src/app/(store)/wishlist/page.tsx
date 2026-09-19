"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, ShoppingBag, ShoppingCart, Star, Trash2, X } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItem = useCartStore((state) => state.addItem);
  const handleAddToCart = (product: (typeof items)[number]) => {addItem(product);};

  return (
    <main className="min-h-screen bg-gray-50">
      
      {/* ================= BREADCRUMB ================= */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm md:px-8">
          <Link
            href="/"
            className="text-gray-500 transition hover:text-blue-600"
          >
            Beranda
          </Link>

          <ChevronRight
            size={16}
            className="text-gray-400"
          />

          <span className="font-medium text-gray-900">
            Wishlist
          </span>
        </div>
      </div>

      {/* ================= HEADER ================= */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <Heart
                    size={24}
                    className="fill-red-500"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                    Wishlist
                  </p>

                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                    Produk Favorit Anda
                  </h1>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-gray-500 md:text-base">
                Simpan produk yang Anda sukai dan
                tambahkan ke keranjang kapan saja.
              </p>
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

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        {/* ================= EMPTY STATE ================= */}
        {items.length === 0 ? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">

            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Heart size={38} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Wishlist Anda Masih Kosong
            </h2>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
              Belum ada produk favorit yang Anda simpan.
              Jelajahi katalog kami dan tambahkan produk
              yang Anda sukai ke wishlist.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <ShoppingBag size={19} />
              Jelajahi Produk
            </Link>
          </div>
        ) : (
          <>
            {/* ================= TOOLBAR ================= */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-gray-500">
                Anda memiliki{" "}
                <span className="font-bold text-gray-900">
                  {items.length}
                </span>{" "}
                produk favorit
              </p>

              <Link
                href="/products"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Tambah Produk Favorit →
              </Link>
            </div>

            {/* ================= WISHLIST ITEMS ================= */}
            <div className="space-y-4">
  {items.map((item) => (
    <article
      key={item.id}
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex flex-col gap-5 p-4 sm:flex-row sm:items-center sm:p-5">

        {/* Product Image */}
        <Link
          href={`/products/${item.id}`}
          className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:h-32 sm:w-32"
        >
          <Image
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Product Information */}
        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-4">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                {item.category}
              </p>

              <Link
                href={`/products/${item.id}`}
              >
                <h2 className="mt-2 text-lg font-bold text-gray-900 transition hover:text-blue-600">
                  {item.name}
                </h2>
              </Link>
            </div>

            {/* Remove */}
            <button
              type="button"
              onClick={() =>
                removeItem(item.id)
              }
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-red-50 hover:text-red-500"
              aria-label={`Hapus ${item.name}`}
            >
              <X size={20} />
            </button>

          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">

            <div className="flex">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={`${item.id}-star-${index}`}
                  size={15}
                  className={
                    index <
                    Math.round(
                      item.rating ?? 0
                    )
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <span className="text-xs font-medium text-gray-600">
              {item.rating ?? 0}
            </span>

            <span className="text-xs text-gray-400">
              •
            </span>

            <span className="text-xs text-gray-400">
              {item.reviewCount ?? 0} ulasan
            </span>

          </div>

          {/* Price */}
          <p className="mt-4 text-xl font-bold text-blue-600">
            {formatPrice(item.price)}
          </p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 flex-col gap-2 sm:w-44">

          <button
            type="button"
            onClick={() =>
              handleAddToCart(item)
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ShoppingCart size={18} />
            Ke Keranjang
          </button>

          <Link
            href={`/products/${item.id}`}
            className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
          >
            Lihat Produk
          </Link>

        </div>
      </div>
    </article>
  ))}
</div>

          </>
        )}
      </section>
      
    </main>
  );
}