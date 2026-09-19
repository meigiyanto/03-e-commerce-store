"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight,  Minus, Plus, ShoppingBag, Trash2, Truck, ShieldCheck, PackageCheck,} from "lucide-react";
import { useCartStore } from "@/stores/cart-store";

export default function CartPage() {
  const { items, removeItem, increaseQuantity, decreaseQuantity, clearCart, } = useCartStore();
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity,0);
  const totalItems = items.reduce((total, item) => total + item.quantity,0);

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString("id-ID")}`;
  };

  // Empty Cart
  if (items.length === 0) {
    return (
      <main className="min-h-[80vh] bg-gray-50">
        <div className="mx-auto flex min-h-[80vh] w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="w-full max-w-lg text-center">
            {/* Icon */}
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-50">
              <ShoppingBag
                size={44}
                strokeWidth={1.6}
                className="text-blue-600"
              />
            </div>

            {/* Heading */}
            <h1 className="mt-7 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Keranjang Anda Kosong
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              Belum ada produk yang ditambahkan ke keranjang.
              Yuk, temukan produk favorit Anda dan mulai berbelanja.
            </p>

            {/* CTA */}
            <Link
              href="/products"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              <ShoppingBag size={18} />
              Mulai Belanja
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-sm text-gray-500">
          <Link
            href="/products"
            className="transition hover:text-blue-600"
          >
            Produk
          </Link>

          <span>/</span>

          <span className="font-medium text-gray-900">
            Keranjang
          </span>
        </nav>

        {/* Page Header */}
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Keranjang Belanja
            </h1>

            <p className="mt-1.5 text-sm text-gray-500">
              {totalItems} item{" "}
              {totalItems === 1 ? "tersedia" : "tersedia"} di keranjang Anda
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            <ArrowLeft size={17} />
            Lanjut Belanja
          </Link>
        </div>

        {/* Main Grid */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
          {/* Left - Cart Items */}
          <div className="min-w-0">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Produk Anda
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Periksa produk dan jumlah sebelum checkout
                  </p>
                </div>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  {items.length} produk
                </span>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-6"
                  >
                    <div className="flex gap-3 sm:gap-5">
                      {/* Product Image */}
                      <Link
                        href={`/products/${item.id}`}
                        className="group h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-32 sm:w-32"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </Link>

                      {/* Product Content */}
                      <div className="flex min-w-0 flex-1 flex-col">
                        {/* Top */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.id}`}
                              className="text-xs font-medium text-blue-600 transition hover:text-blue-700 sm:text-sm"
                            >
                              {item.category}
                            </Link>

                            <Link
                              href={`/products/${item.id}`}
                              className="mt-1 block"
                            >
                              <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-gray-900 transition hover:text-blue-600 sm:text-base sm:leading-6">
                                {item.name}
                              </h3>
                            </Link>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                            aria-label={`Hapus ${item.name}`}
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>

                        {/* Bottom */}
                        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                          {/* Quantity */}
                          <div>
                            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Jumlah
                            </p>

                            <div className="flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(item.id)
                                }
                                className="flex h-full w-9 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                aria-label={`Kurangi jumlah ${item.name}`}
                              >
                                <Minus size={15} />
                              </button>

                              <span className="flex h-full min-w-9 items-center justify-center border-x border-gray-200 px-2 text-sm font-semibold text-gray-900">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(item.id)
                                }
                                className="flex h-full w-9 items-center justify-center text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                aria-label={`Tambah jumlah ${item.name}`}
                              >
                                <Plus size={15} />
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                              Total
                            </p>

                            <p className="mt-1 text-base font-bold text-gray-900 sm:text-lg">
                              {formatPrice(
                                item.price * item.quantity
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="mt-3 pl-[108px] sm:pl-[148px]">
                      <p className="text-xs text-gray-400">
                        {formatPrice(item.price)} / item
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear Cart */}
              <div className="border-t border-gray-100 px-4 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-2 text-xs font-medium text-red-500 transition hover:text-red-600 sm:text-sm"
                >
                  <Trash2 size={15} />
                  Kosongkan Keranjang
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50">
                  <Truck
                    size={18}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Gratis Pengiriman
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    Untuk semua pesanan
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                  <ShieldCheck
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Pembayaran Aman
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    Data Anda terlindungi
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50">
                  <PackageCheck
                    size={18}
                    className="text-purple-600"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900">
                    Produk Berkualitas
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-500">
                    Produk pilihan terbaik
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              {/* Header */}
              <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                <h2 className="text-lg font-bold text-gray-900">
                  Ringkasan Pesanan
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Detail pembayaran Anda
                </p>
              </div>

              {/* Summary */}
              <div className="px-5 py-5 sm:px-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Subtotal ({totalItems} item)
                    </span>

                    <span className="font-medium text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Pengiriman
                    </span>

                    <span className="font-semibold text-green-600">
                      Gratis
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-500">
                      Pajak
                    </span>

                    <span className="font-medium text-gray-900">
                      Termasuk
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="my-5 border-t border-dashed border-gray-200" />

                {/* Total */}
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Total Pembayaran
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Sudah termasuk pengiriman
                    </p>
                  </div>

                  <p className="text-xl font-bold text-blue-600">
                    {formatPrice(subtotal)}
                  </p>
                </div>

                {/* Checkout */}
                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
                >
                  Lanjut ke Checkout
                  <ArrowRight size={17} />
                </Link>

                {/* Continue Shopping */}
                <Link
                  href="/products"
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <ShoppingBag size={16} />
                  Lanjut Belanja
                </Link>
              </div>

              {/* Security Note */}
              <div className="border-t border-gray-100 bg-gray-50 px-5 py-4 sm:px-6">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={18}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>
                    <p className="text-xs font-semibold text-gray-800">
                      Belanja dengan aman
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
                      Informasi pembayaran Anda akan diproses
                      dengan aman.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

