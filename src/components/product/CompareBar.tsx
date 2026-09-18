"use client";

import Link from "next/link";
import {
  ArrowRight,
  Scale,
  X,
} from "lucide-react";

import {
  useComparisonStore,
} from "@/stores/comparison-store";

export default function CompareBar() {
  const items = useComparisonStore((state) => state.items);
  const removeItem = useComparisonStore((state) => state.removeItem);
  const clear = useComparisonStore((state) => state.clear);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-[90] w-[calc(100%-2rem)] max-w-4xl -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Scale size={18} />
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">
              Bandingkan Produk
            </p>

            <p className="text-xs text-gray-500">
              {items.length}/4 produk
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex min-w-[150px] items-center gap-2 rounded-xl bg-gray-50 px-2 py-2"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-10 w-10 shrink-0 rounded-lg object-cover"
              />

              <p className="min-w-0 flex-1 truncate text-xs font-semibold text-gray-700">
                {item.name}
              </p>

              <button
                type="button"
                onClick={() =>
                  removeItem(item.id)
                }
                className="rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-red-500"
                aria-label={
                  "Hapus " +
                  item.name +
                  " dari perbandingan"
                }
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={clear}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 hover:text-red-500"
          >
            Hapus
          </button>

          <Link
            href="/compare"
            aria-disabled={items.length < 2}
            onClick={(event) => {
              if (items.length < 2) {
                event.preventDefault();
              }
            }}
            className={
              items.length >= 2
                ? "flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                : "flex cursor-not-allowed items-center gap-2 rounded-lg bg-gray-300 px-4 py-2.5 text-sm font-semibold text-white"
            }
          >
            Bandingkan
            <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}