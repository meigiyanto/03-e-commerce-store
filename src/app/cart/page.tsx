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

    if(items.length === 0) {
        return (
            <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
                <div className="rounded-full bg-blue-100 p-6 text-blue-600">
                    <ShoppingBag size={48} />
                </div>
            
                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                  Keranjang Anda Kosong
                </h1>
            
                <p className="mt-3 max-w-md text-gray-500">
                  Anda belum menambahkan produk ke keranjang.
                </p>
            
                <Link
                  href="/products"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <ArrowLeft size={18} />
                  Mulai Belanja
                </Link>
            </section>
        )
    }
    
    return (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Keranjang Belanja
                </h1>
            
                <p className="mt-2 text-gray-500">
                    {totalItems} produk di keranjang Anda
                </p>
            </div>
        
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
                >
                  {/* Product Image */}
                  <div className="h-32 w-full overflow-hidden rounded-xl bg-gray-100 sm:w-32">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
        
                  {/* Product Information */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-blue-600">
                          {item.category}
                        </p>
        
                        <h2 className="mt-1 text-lg font-semibold text-gray-900">
                          {item.name}
                        </h2>
                      </div>
        
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                        aria-label={`Hapus ${item.name}`}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
        
                    <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                      {/* Quantity */}
                      <div className="flex items-center rounded-xl border border-gray-200">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-2 text-gray-600 transition hover:bg-gray-100"
                          aria-label={`Kurangi jumlah ${item.name}`}
                        >
                          <Minus size={18} />
                        </button>
        
                        <span className="w-10 text-center font-semibold">
                          {item.quantity}
                        </span>
        
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="p-2 text-gray-600 transition hover:bg-gray-100"
                          aria-label={`Tambah jumlah ${item.name}`}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
        
                      {/* Item Total */}
                      <p className="text-lg font-bold text-gray-900">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-medium text-red-500 transition hover:text-red-600"
              >
                Kosongkan Keranjang
              </button>
            </div>
        
            {/* Order Summary */}
            <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Ringkasan Pesanan
              </h2>
        
              <div className="mt-6 space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>
                    Rp {subtotal.toLocaleString("id-ID")}
                  </span>
                </div>
        
                <div className="flex justify-between text-gray-600">
                  <span>Pengiriman</span>
                  <span className="text-green-600">Gratis</span>
                </div>
        
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">
                      Total
                    </span>
        
                    <span className="text-xl font-bold text-blue-600">
                      Rp {subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>
        
              <button
                type="button"
                className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
              >
                Lanjut ke Checkout
              </button>
        
              <Link
                href="/products"
                className="mt-4 block text-center text-sm font-medium text-gray-500 transition hover:text-blue-600"
              >
                ← Lanjut Belanja
              </Link>
            </aside>
          </div>
        </section>

    )
}
