"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { Package, Boxes, DollarSign, Star, Plus, AlertTriangle, } from "lucide-react";
import { useProductStore } from "@/stores/product-store";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboard() {
  const { products, loading, error, fetchProducts, } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const statistics = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (total, product) =>
        total + Number(product.stock || 0),
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

  const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= 5).slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        Memuat dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Kelola toko dan produk kamu.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white"
        >
          <Plus size={18} />
          Tambah Produk
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

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

      <section className="rounded-xl border bg-white">
        <div className="border-b p-5">
          <h2 className="font-semibold">
            Stok Rendah
          </h2>

          <p className="text-sm text-gray-500">
            Produk dengan stok 5 atau kurang.
          </p>
        </div>

        <div className="divide-y">
          {lowStockProducts.length === 0 ? (
            <p className="p-6 text-sm text-gray-500">
              Tidak ada produk dengan stok rendah.
            </p>
          ) : (
            lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4"
              >
                <span className="text-sm font-medium">
                  {product.name}
                </span>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs text-orange-700">
                  {product.stock} tersisa
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon, }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-white p-5">
      <div className="rounded-lg bg-gray-100 p-2.5 w-fit">
        {icon}
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