"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import {
  ArrowRight,
  Boxes,
  DollarSign,
  Package,
  Star,
  TriangleAlert,
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
  const products = useProductStore(
    (state) => state.products,
  );

  const fetchProducts = useProductStore(
    (state) => state.fetchProducts,
  );

  const isLoading = useProductStore(
    (state) => state.isLoading,
  );

  const error = useProductStore(
    (state) => state.error,
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const statistics = useMemo(() => {
    const totalProducts = products.length;

    const totalStock = products.reduce(
      (total, product) => total + product.stock,
      0,
    );

    const inventoryValue = products.reduce(
      (total, product) =>
        total + product.price * product.stock,
      0,
    );

    const averageRating =
      totalProducts > 0
        ? products.reduce(
            (total, product) =>
              total + product.rating,
            0,
          ) / totalProducts
        : 0;

    const lowStockProducts = products.filter(
      (product) => product.stock <= 5,
    );

    return {
      totalProducts,
      totalStock,
      inventoryValue,
      averageRating,
      lowStockProducts,
    };
  }, [products]);

  const recentProducts = products.slice(0, 5);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-muted-foreground">
          Pantau dan kelola toko Anda dari satu tempat.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <TriangleAlert className="size-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Produk"
          value={isLoading && products.length === 0 ? "..." : statistics.totalProducts}
          description="Produk dalam katalog"
          icon={Package}
        />

        <StatCard
          title="Total Stok"
          value={isLoading && products.length === 0 ? "..." : statistics.totalStock}
          description="Unit produk tersedia"
          icon={Boxes}
        />

        <StatCard
          title="Nilai Inventori"
          value={
            isLoading && products.length === 0
              ? "..."
              : formatRupiah(statistics.inventoryValue)
          }
          description="Harga × stok"
          icon={DollarSign}
        />

        <StatCard
          title="Rating Rata-rata"
          value={
            isLoading && products.length === 0
              ? "..."
              : statistics.averageRating.toFixed(1)
          }
          description="Dari seluruh produk"
          icon={Star}
        />
      </div>

      {/* Content */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent products */}
        <section className="rounded-xl border bg-background lg:col-span-2">
          <div className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-semibold">
                Produk Terbaru
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Produk yang baru ditambahkan ke toko.
              </p>
            </div>

            <Link
              href="/admin/products"
              className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Semua produk
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="divide-y">
            {isLoading && products.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                Memuat produk...
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="mx-auto size-10 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  Belum ada produk
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Tambahkan produk pertama Anda.
                </p>

                <Link
                  href="/admin/products/new"
                  className="mt-4 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                >
                  Tambah Produk
                </Link>
              </div>
            ) : (
              recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-4"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-12 rounded-lg border object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.category}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-medium">
                      {formatRupiah(product.price)}
                    </p>

                    <p
                      className={`mt-1 text-xs ${
                        product.stock <= 5
                          ? "text-red-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      Stok: {product.stock}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Low stock */}
        <section className="rounded-xl border bg-background">
          <div className="border-b p-5">
            <div className="flex items-center gap-2">
              <TriangleAlert className="size-5 text-orange-500" />

              <h2 className="font-semibold">
                Stok Rendah
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Produk dengan stok 5 unit atau kurang.
            </p>
          </div>

          <div className="divide-y">
            {statistics.lowStockProducts.length === 0 ? (
              <div className="p-8 text-center">
                <Boxes className="mx-auto size-9 text-muted-foreground" />

                <p className="mt-3 text-sm font-medium">
                  Semua stok aman
                </p>
              </div>
            ) : (
              statistics.lowStockProducts
                .slice(0, 5)
                .map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-4"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-10 rounded-md border object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {product.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {product.category}
                      </p>
                    </div>

                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600">
                      {product.stock}
                    </span>
                  </div>
                ))
            )}
          </div>
        </section>
      </div>

      {/* Quick action */}
      <section className="mt-6 rounded-xl border bg-background p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold">
              Kelola katalog
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Tambahkan, edit, atau hapus produk dari toko.
            </p>
          </div>

          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Package className="size-4" />
            Kelola Produk
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <div className="rounded-xl border bg-background p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight">
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}