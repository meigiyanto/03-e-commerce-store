"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight } from "lucide-react";

import { Product } from "@/types/product";

type ProductSearchAutocompleteProps = {
  value: string;
  products: Product[];
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductSearchAutocomplete({
  value,
  products,
  open,
  onClose,
  onSubmit,
}: ProductSearchAutocompleteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return [];
    }

    return products
      .filter((product) => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        const description = product.description.toLowerCase();

        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        );
      })
      .slice(0, 6);
  }, [products, value]);

  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [open, onClose]);

  if (!open || !value.trim()) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute left-0 right-0 top-full z-[100] mt-2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl"
    >
      {suggestions.length > 0 ? (
        <>
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Produk yang ditemukan
            </p>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {suggestions.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-3 border-b border-gray-50 px-4 py-3 transition hover:bg-blue-50"
              >
                {/* IMAGE */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>

                {/* INFO */}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-gray-900">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-blue-600">
                    {product.category}
                  </p>

                  <p className="mt-1 text-sm font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <ArrowRight
                  size={17}
                  className="shrink-0 text-gray-400"
                />
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={onSubmit}
            className="flex w-full items-center justify-center gap-2 bg-gray-50 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            <Search size={16} />

            Lihat semua hasil untuk &quot;{value}&quot;
          </button>
        </>
      ) : (
        <div className="px-5 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Search
              size={20}
              className="text-gray-400"
            />
          </div>

          <p className="mt-3 text-sm font-semibold text-gray-900">
            Produk tidak ditemukan
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Coba gunakan kata kunci lain.
          </p>

          <button
            type="button"
            onClick={onSubmit}
            className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Cari &quot;{value}&quot;
          </button>
        </div>
      )}
    </div>
  );
}