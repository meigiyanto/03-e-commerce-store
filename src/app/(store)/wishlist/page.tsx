"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, ShoppingBag, ShoppingCart, Trash2, X } from "lucide-react";
import { useHydrated } from "@/hooks/use-hydrated";

import { useWishlistStore } from "@/stores/wishlist-store";
import { useCartStore } from "@/stores/cart-store";
import type { Product } from "@/types/product";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

function Breadcrumb() {
  return (
    <div className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm md:px-8">
        <Link
          href="/"
          className="text-gray-500 transition-colors hover:text-blue-600"
        >
          Beranda
        </Link>

        <ChevronRight size={16} className="text-gray-400" />

        <span className="font-medium text-gray-900">Wishlist</span>
      </div>
    </div>
  );
}

function WishlistHeader({ itemCount, onClear }: {
  itemCount: number;
  onClear: () => void;
}) {
  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
              <Heart size={24} className="fill-red-500" />
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

          {itemCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 size={17} />
              Hapus Semua
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function EmptyWishlist() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
        <Heart size={38} />
      </div>

      <h2 className="mt-6 text-2xl font-bold text-gray-900">
        Wishlist Anda Masih Kosong
      </h2>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        Simpan produk favorit Anda ke wishlist agar lebih mudah ditemukan
        kembali.
      </p>

      <Link
        href="/products"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <ShoppingBag size={19} />
        Jelajahi Produk
      </Link>
    </div>
  );
}

function WishlistItem({ product, onRemove, onAddToCart }: {
  product: Product;
  onRemove: (id: string) => void;
  onAddToCart: (product: Product) => void;
}) {
  const productUrl = `/products/${product.id}`;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-lg sm:p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {/* PRODUCT IMAGE */}
        <Link
          href={productUrl}
          className="relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:w-32"
          aria-label={`Lihat ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={128}
            height={128}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* PRODUCT INFO */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                {product.category}
              </p>

              <Link href={productUrl}>
                <h2 className="mt-1 line-clamp-2 text-lg font-bold text-gray-900 transition-colors hover:text-blue-600">
                  {product.name}
                </h2>
              </Link>
            </div>

            <button
              type="button"
              onClick={() => onRemove(product.id)}
              className="shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label={`Hapus ${product.name} dari wishlist`}
              title="Hapus dari wishlist"
            >
              <X size={20} />
            </button>
          </div>

          <p className="mt-3 text-xl font-bold text-blue-600">
            {formatPrice(product.price)}
          </p>

          {product.stock <= 0 && (
            <p className="mt-1 text-sm font-medium text-red-500">
              Stok habis
            </p>
          )}
        </div>

        {/* ACTION */}
        <div className="flex shrink-0 flex-col gap-2 sm:w-44">
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <ShoppingCart size={18} />
            {product.stock > 0 ? "Ke Keranjang" : "Stok Habis"}
          </button>

          <Link
            href={productUrl}
            className="flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Lihat Produk
          </Link>
        </div>
      </div>
    </article>
  );
}

function WishlistLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <p className="text-gray-500">Memuat wishlist...</p>
      </div>
    </main>
  );
}

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addItem = useCartStore((state) => state.addItem);
  const hydrated = useHydrated();
  
  if (!hydrated) {
    return <WishlistLoading />
  }

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) return;

    addItem(product);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Breadcrumb />

      <WishlistHeader
        itemCount={items.length}
        onClear={clearWishlist}
      />

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        {items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="space-y-4">
            {items.map((product) => (
              <WishlistItem
                key={product.id}
                product={product}
                onRemove={removeItem}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}