"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useStore } from "@/context/store-context";

const SHIPPING = 10;

type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

export default function CheckoutPage() {
  const { cart, cartCount, cartSubtotal, clearCart } = useStore();

  const [submitted, setSubmitted] = useState(false);

  const [customer, setCustomer] = useState<Customer>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const shipping = cart.length > 0 ? SHIPPING : 0;
  const total = cartSubtotal + shipping;

  function updateField(field: keyof Customer, value: string) {
    setCustomer((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitted(true);
    clearCart();
  }

  if (submitted) {
    return (
      <main className="min-h-[calc(100vh-160px)] bg-slate-50 px-6 py-16 lg:px-8">
        <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-2xl text-cyan-700">
            ✓
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Order received
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Thank you, {customer.name}!
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-slate-600">
            Pesanan Anda berhasil dibuat. Untuk saat ini checkout masih
            merupakan simulasi dan belum memproses pembayaran nyata.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/products"
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Continue shopping
            </Link>

            <Link
              href="/"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-[calc(100vh-160px)] bg-slate-50 px-6 py-16 lg:px-8">
        <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-slate-600">
            Tambahkan produk ke cart sebelum melanjutkan ke checkout.
          </p>

          <Link
            href="/products"
            className="mt-7 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Browse products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-160px)] bg-slate-50 px-6 py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Secure checkout
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
            Checkout
          </h1>

          <p className="mt-2 text-slate-600">
            Lengkapi informasi pengiriman untuk menyelesaikan pesanan.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">

          {/* Customer form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Customer information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Data ini digunakan untuk detail pesanan dan pengiriman.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* Name */}
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Full name
                </span>

                <input
                  required
                  value={customer.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="John Doe"
                />
              </label>

              {/* Email */}
              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Email
                </span>

                <input
                  required
                  type="email"
                  value={customer.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="you@example.com"
                />
              </label>

              {/* Phone */}
              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Phone
                </span>

                <input
                  required
                  type="tel"
                  value={customer.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="08123456789"
                />
              </label>

              {/* Address */}
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Shipping address
                </span>

                <textarea
                  required
                  rows={4}
                  value={customer.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Street, building, apartment, etc."
                />
              </label>

              {/* City */}
              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  City
                </span>

                <input
                  required
                  value={customer.city}
                  onChange={(event) =>
                    updateField("city", event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="Bandung"
                />
              </label>

              {/* Postal code */}
              <label>
                <span className="mb-2 block text-sm font-medium text-slate-700">
                  Postal code
                </span>

                <input
                  required
                  inputMode="numeric"
                  value={customer.postalCode}
                  onChange={(event) =>
                    updateField("postalCode", event.target.value)
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
                  placeholder="40111"
                />
              </label>
            </div>

            {/* Payment */}
            <div className="mt-8 border-t border-slate-200 pt-6">
              <h2 className="text-xl font-semibold text-slate-900">
                Payment
              </h2>

              <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  Demo payment
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Pembayaran nyata belum diaktifkan. Tombol di bawah hanya
                  mensimulasikan pembuatan order.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="mt-8 w-full rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Place order · ${total.toFixed(2)}
            </button>
          </form>

          {/* Order summary */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Order summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>

            <div className="mt-6 divide-y divide-slate-200">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-xl bg-slate-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Qty {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-slate-200 pt-6 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>

                <span className="font-medium text-slate-900">
                  ${cartSubtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>

                <span className="font-medium text-slate-900">
                  ${shipping.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Link
              href="/cart"
              className="mt-6 block text-center text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              ← Back to cart
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
