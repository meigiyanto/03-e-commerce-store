"use client";

import ProductCard from "@/components/product/ProductCard";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";

type RecentlyViewedProps = {
  excludeId?: string;
};

export default function RecentlyViewed({
  excludeId,
}: RecentlyViewedProps) {
  const items = useRecentlyViewedStore(
    (state) => state.items
  );

  const clear = useRecentlyViewedStore(
    (state) => state.clear
  );

  const filteredItems = excludeId
    ? items.filter(
        (item) => item.id !== excludeId
      )
    : items;

  if (filteredItems.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-2 md:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Riwayat
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
            Terakhir Dilihat
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Produk yang baru saja Anda lihat.
          </p>
        </div>

        <button
          type="button"
          onClick={clear}
          className="shrink-0 text-sm font-semibold text-gray-500 transition hover:text-red-500"
        >
          Hapus riwayat
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredItems.map((item) => (
          <ProductCard
            key={item.id}
            product={item}
          />
        ))}
      </div>
    </section>
  );
}