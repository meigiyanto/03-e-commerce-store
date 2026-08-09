"use client";

import Link from "next/link";
import { useStore } from "@/context/store-context";

const SHIPPING = 10;

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();

  const shipping = cart.length > 0 ? SHIPPING : 0;
  const total = cartSubtotal + shipping;

  return (
    <main className="min-h-[calc(100vh-160px)] bg-slate-50 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Shopping bag
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
                Your cart
              </h1>

              <p className="mt-2 text-slate-600">
                {cartCount} {cartCount === 1 ? "item" : "items"} in your cart.
              </p>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-sm font-semibold text-slate-500 transition hover:text-red-600"
              >
                Clear cart
              </button>
            )}
          </div>
        </div>

        {/* Empty cart */}
        {cart.length === 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🛒
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-slate-900">
              Your cart is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-600">
              Belum ada produk di cart. Jelajahi koleksi kami dan tambahkan
              produk yang Anda sukai.
            </p>

            <Link
              href="/products"
              className="mt-7 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Continue shopping
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">

            {/* Cart items */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="divide-y divide-slate-200">
                {cart.map((item) => {
                  const itemTotal = item.price * item.quantity;

                  return (
                    <article
                      key={item.id}
                      className="flex gap-4 p-5 sm:p-6"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-28 w-28 shrink-0 rounded-2xl bg-slate-100 object-cover sm:h-36 sm:w-36"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600">
                              {item.category}
                            </p>

                            <h2 className="mt-1 text-lg font-semibold text-slate-900">
                              {item.name}
                            </h2>

                            <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                              {item.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name}`}
                            className="text-slate-400 transition hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

                          {/* Quantity */}
                          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              className="h-9 w-9 text-lg text-slate-600 transition hover:text-slate-950"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              −
                            </button>

                            <span className="w-8 text-center text-sm font-semibold text-slate-900">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                              className="h-9 w-9 text-lg text-slate-600 transition hover:text-slate-950"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              +
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg font-semibold text-slate-900">
                              ${itemTotal.toFixed(2)}
                            </p>

                            {item.quantity > 1 && (
                              <p className="text-xs text-slate-500">
                                ${item.price.toFixed(2)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Order summary */}
            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Order summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4 text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-slate-900">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <div className="flex justify-between gap-4">
                    <span className="font-semibold text-slate-900">
                      Total
                    </span>

                    <span className="text-xl font-semibold text-slate-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-7 flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Proceed to checkout
              </Link>

              <Link
                href="/products"
                className="mt-3 flex w-full items-center justify-center rounded-full border border-slate-200 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
              >
                Continue shopping
              </Link>

              <p className="mt-5 text-center text-xs leading-5 text-slate-500">
                Shipping is currently a fixed ${SHIPPING.toFixed(2)} per order.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
