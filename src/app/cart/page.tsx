"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity,0);
  const totalItems = items.reduce((total, item) => total + item.quantity,0);

  // Empty Cart
  if (items.length === 0) {
    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-7xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="rounded-full bg-blue-100 p-5 text-blue-600 sm:p-6">
          <ShoppingBag size={44} className="sm:hidden" />
          <ShoppingBag size={48} className="hidden sm:block" />
        </div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Keranjang Anda Kosong
        </h1>

        <p className="mt-3 max-w-md px-4 text-sm text-gray-500 sm:text-base">
          Anda belum menambahkan produk ke keranjang.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:px-6"
        >
          <ArrowLeft size={18} />
          Mulai Belanja
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-3 py-6 sm:px-4 sm:py-8 md:px-8 md:py-10">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Keranjang Belanja
        </h1>

        <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
          {totalItems} produk di keranjang Anda
        </p>
      </div>

      <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
        {/* Cart Items */}
        <div className="min-w-0 space-y-3 sm:space-y-4">
            {items.map((item) => (
            <div
              key={item.id}
              className="flex w-full min-w-0 gap-3 rounded-2xl bg-white p-3 shadow-sm sm:gap-5 sm:p-5"
            >
              {/* Product Image */}
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Product Information */}
              <div className="flex min-w-0 flex-1 flex-col">
                {/* Product Header */}
                <div className="flex min-w-0 items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-blue-600 sm:text-sm">
                      {item.category}
                    </p>

                    <h2 className="mt-1 truncate text-sm font-semibold text-gray-900 sm:text-lg">
                      {item.name}
                    </h2>
                  </div>
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 rounded-lg p-1.5 text-red-500 transition hover:bg-red-50 sm:p-2"
                    aria-label={`Hapus ${item.name}`}
                  >
                    <Trash2 size={17} className="sm:hidden" />
                    <Trash2 size={20} className="hidden sm:block" />
                  </button>
                </div>

                {/* Quantity and Price */}
                <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-5">
                  {/* Quantity */}
                  <div className="flex shrink-0 items-center overflow-hidden rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                      className="p-1.5 text-gray-600 transition hover:bg-gray-100 sm:p-2"
                      aria-label={`Kurangi jumlah ${item.name}`}
                    >
                      <Minus size={15} className="sm:hidden" />
                      <Minus size={18} className="hidden sm:block" />
                    </button>

                    <span className="w-7 text-center text-xs font-semibold sm:w-10 sm:text-base">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                      className="p-1.5 text-gray-600 transition hover:bg-gray-100 sm:p-2"
                      aria-label={`Tambah jumlah ${item.name}`}
                    >
                      <Plus size={15} className="sm:hidden" />
                      <Plus size={18} className="hidden sm:block" />
                    </button>
                  </div>

                  {/* Item Total */}
                  <p className="whitespace-nowrap text-xs font-bold text-gray-900 sm:text-lg">
                    Rp{" "}
                    {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Clear Cart */}
          <button
            type="button"
            onClick={clearCart}
            className="px-1 py-2 text-xs font-medium text-red-500 transition hover:text-red-600 sm:text-sm"
          >
            Kosongkan Keranjang
          </button>
        </div>

        {/* Order Summary */}
        <aside className="h-fit w-full rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
            Ringkasan Pesanan
          </h2>

          <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
              <span>Subtotal</span>

              <span className="whitespace-nowrap">
                Rp {subtotal.toLocaleString("id-ID")}
              </span>

              </div>

            {/* Shipping */}
            <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
              <span>Pengiriman</span>

              <span className="font-medium text-green-600">
                Gratis
              </span>
            </div>

            {/* Total */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-base font-semibold text-gray-900 sm:text-lg">
                  Total
                </span>
                <span className="whitespace-nowrap text-lg font-bold text-blue-600 sm:text-xl">
                  Rp {subtotal.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            type="button"
            className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 sm:py-4"
          >
            Lanjut ke Checkout
          </button>

          {/* Continue Shopping */}
          <Link
            href="/products"
            className="mt-4 block py-1 text-center text-xs font-medium text-gray-500 transition hover:text-blue-600 sm:text-sm"
          >
            ← Lanjut Belanja
          </Link>
        </aside>
      </div>
    </section>
  );
}
