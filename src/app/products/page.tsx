"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ProductCard from "@/components/product-card";
import { categories } from "@/data/products";
import { useStore } from "@/context/store-context";

const PRODUCTS_PER_PAGE = 6;

export default function ProductsPage() {
  const { products } = useStore();

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") {
      return products;
    }

    return products.filter(
      (product) =>
        product.category === activeCategory
    );
  }, [products, activeCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / PRODUCTS_PER_PAGE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    PRODUCTS_PER_PAGE;

  const paginatedProducts =
    filteredProducts.slice(
      startIndex,
      startIndex + PRODUCTS_PER_PAGE
    );

  function handleCategoryChange(
    category: string
  ) {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  function goToPage(page: number) {
    setCurrentPage(
      Math.min(
        Math.max(page, 1),
        totalPages
      )
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
            Store
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950">
            All products
          </h1>

          <p className="mt-2 text-slate-600">
            Temukan produk terbaik untuk kebutuhan
            sehari-hari.
          </p>
        </div>

        {/* Categories */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const active =
              activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() =>
                  handleCategoryChange(category)
                }
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  active
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Product count */}
        <div className="mt-8">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-900">
              {filteredProducts.length === 0
                ? 0
                : startIndex + 1}
              –
              {Math.min(
                startIndex + PRODUCTS_PER_PAGE,
                filteredProducts.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>
        </div>

        {/* Products */}
        {paginatedProducts.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-semibold text-slate-900">
              No products found
            </h2>

            <p className="mt-2 text-slate-500">
              Belum ada produk.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Product pagination"
            className="mt-10 flex items-center justify-center gap-2"
          >
            <button
              type="button"
              onClick={() =>
                goToPage(
                  safeCurrentPage - 1
                )
              }
              disabled={safeCurrentPage === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                className={`flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold ${
                  page === safeCurrentPage
                    ? "bg-slate-900 text-white"
                    : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() =>
                goToPage(
                  safeCurrentPage + 1
                )
              }
              disabled={
                safeCurrentPage === totalPages
              }
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
      </div>
    </main>
  );
}