import { requireAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const authorization = await requireAdmin();

  if (!authorization.ok) {
    if (authorization.status === 401) {
      redirect("/sign-in");
    }

    redirect("/");
  }

  return <AdminDashboard />;
}

/*
"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  Boxes,
  DollarSign,
  Star,
  Plus,
  AlertTriangle,
} from "lucide-react";

import { useProductStore } from "@/stores/product-store";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboardPage() {
  const {
    products,
    loading,
    error,
    fetchProducts,
  } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const statistics = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (total, product) => total + Number(product.stock || 0),
      0
    );

    const inventoryValue = products.reduce(
      (total, product) =>
        total +
        Number(product.price || 0) *
          Number(product.stock || 0),
      0
    );

    const averageRating =
      totalProducts > 0
        ? products.reduce(
            (total, product) =>
              total + Number(product.rating || 0),
            0
          ) / totalProducts
        : 0;

    return {
      totalProducts,
      totalStock,
      inventoryValue,
      averageRating,
    };
  }, [products]);

  const lowStockProducts = products
    .filter((product) => Number(product.stock || 0) <= 5)
    .sort(
      (a, b) =>
        Number(a.stock || 0) -
        Number(b.stock || 0)
    )
    .slice(0, 5);

  const recentProducts = [...products]
    .reverse()
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500">
          Memuat dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header *\/}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Kelola toko dan produk kamu dari sini.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus size={18} />
          Tambah Produk
        </Link>
      </div>

      {/* Error *\/}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics *\/}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Produk"
          value={statistics.totalProducts}
          icon={<Package size={21} />}
        />

        <StatCard
          title="Total Stok"
          value={statistics.totalStock}
          icon={<Boxes size={21} />}
        />

        <StatCard
          title="Nilai Inventori"
          value={formatRupiah(
            statistics.inventoryValue
          )}
          icon={<DollarSign size={21} />}
        />

        <StatCard
          title="Rating Rata-rata"
          value={statistics.averageRating.toFixed(1)}
          icon={<Star size={21} />}
        />
      </div>

      {/* Content *\/}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Products *\/}
        <section className="rounded-xl border bg-white">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">
                Produk Terbaru
              </h2>
              <p className="text-sm text-gray-500">
                Produk yang tersedia di toko
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-sm font-medium hover:underline"
            >
              Lihat semua
            </Link>
          </div>

          <div className="divide-y">
            {recentProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Belum ada produk.
              </div>
            ) : (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package
                          size={20}
                          className="text-gray-400"
                        />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatRupiah(
                        Number(product.price)
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      Stok: {product.stock}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Low Stock *\/}
        <section className="rounded-xl border bg-white">
          <div className="flex items-center gap-3 border-b p-5">
            <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
              <AlertTriangle size={20} />
            </div>

            <div>
              <h2 className="font-semibold">
                Stok Rendah
              </h2>
              <p className="text-sm text-gray-500">
                Produk dengan stok 5 atau kurang
              </p>
            </div>
          </div>

          <div className="divide-y">
            {lowStockProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Tidak ada produk dengan stok rendah.
              </div>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {product.category}
                    </p>
                  </div>

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                    {product.stock} tersisa
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-gray-100 p-2.5 text-gray-700">
          {icon}
        </div>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}
*/