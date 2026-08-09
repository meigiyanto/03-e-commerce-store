"use client";

import Link from "next/link";
import {
  ArrowRight,
  Package,
  ShoppingBag,
  Heart,
  DollarSign,
} from "lucide-react";

import { products } from "@/data/products";
import { useStore } from "@/context/store-context";

export default function AdminPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    wishlist,
  } = useStore();

  const totalProducts = products.length;
  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;

  const stats = [
    {
      label: "Total products",
      value: totalProducts,
      icon: Package,
      href: "/products",
    },
    {
      label: "Cart items",
      value: cartCount,
      icon: ShoppingBag,
      href: "/cart",
    },
    {
      label: "Wishlist",
      value: wishlist.length,
      icon: Heart,
      href: "/products",
    },
    {
      label: "Cart value",
      value: `$${cartSubtotal.toFixed(2)}`,
      icon: DollarSign,
      href: "/cart",
    },
  ];

  return (
    <main className="min-h-[calc(100vh-160px)] bg-slate-50 px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Administration
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
                Admin dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Kelola dan pantau toko Northstar dari satu tempat.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
            >
              View storefront
            </Link>
          </div>
        </div>

        {/* Stats */}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                    <Icon size={20} />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
                  />
                </div>

                <p className="mt-6 text-sm text-slate-500">
                  {stat.label}
                </p>

                <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                  {stat.value}
                </p>
              </Link>
            );
          })}
        </section>

        {/* Content */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Products */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">
                  Products
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Produk yang tersedia di storefront.
                </p>
              </div>

              <Link
                href="/products"
                className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
              >
                View all
              </Link>
            </div>

            <div className="mt-6 divide-y divide-slate-200">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-2xl bg-slate-100 object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-slate-900 hover:text-cyan-700"
                    >
                      {product.name}
                    </Link>

                    <p className="mt-1 text-sm text-slate-500">
                      {product.category}
                    </p>
                  </div>

                  <p className="font-semibold text-slate-900">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Store overview */}
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-950">
              Store overview
            </h2>

            <div className="mt-6 space-y-5">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Product categories
                </p>

                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {totalCategories}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Items currently in cart
                </p>

                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  {cartCount}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Current cart value
                </p>

                <p className="mt-1 text-2xl font-semibold text-slate-950">
                  ${cartSubtotal.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
              <p className="text-sm font-semibold text-slate-900">
                Admin MVP
              </p>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Dashboard ini saat ini menggunakan data lokal aplikasi.
                Authentication dan database admin akan kita tambahkan pada
                tahap berikutnya.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
