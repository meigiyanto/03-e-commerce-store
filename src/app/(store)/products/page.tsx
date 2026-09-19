"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Grid2X2, Heart, List, Search, ShoppingCart, SlidersHorizontal, Star, X } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import FilterSidebar from "@/components/product/FilterSidebar";
import { Product } from "@/types/product";
import { useProductStore } from "@/stores/product-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

/* =========================================================
   FORMAT PRICE
========================================================= */

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

/* =========================================================
   PRODUCTS PAGE
========================================================= */

export default function ProductsPage() {
  /* =======================================================
     UI STATE
  ======================================================= */

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  /* =======================================================
     FILTER STATE
  ======================================================= */

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [inStockOnly, setInStockOnly] = useState(false);

  /* =======================================================
     PRODUCT STORE
  ======================================================= */

  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  /* =======================================================
     FETCH PRODUCTS
  ======================================================= */

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      )
    );

    return ["Semua", ...uniqueCategories];
  }, [products]);

  /* =======================================================
     FILTER + SEARCH + SORT
  ======================================================= */

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      /* ---------------------------------------------------
         SEARCH
      --------------------------------------------------- */

      const query = search.trim().toLowerCase();
      const productName = product.name?.toLowerCase() ?? "";
      const productCategory = product.category?.toLowerCase() ?? "";
      const productDescription = product.description?.toLowerCase() ?? "";

      const matchesSearch =
        query === "" ||
        productName.includes(query) ||
        productCategory.includes(query) ||
        productDescription.includes(query);

      /* ---------------------------------------------------
         CATEGORY
      --------------------------------------------------- */

      const matchesCategory =
        selectedCategory === "Semua" ||
        product.category === selectedCategory;

      /* ---------------------------------------------------
         MIN PRICE
      --------------------------------------------------- */

      const minimumPrice =
        minPrice === ""
          ? true
          : product.price >= Number(minPrice);

      /* ---------------------------------------------------
         MAX PRICE
      --------------------------------------------------- */

      const maximumPrice =
        maxPrice === ""
          ? true
          : product.price <= Number(maxPrice);

      /* ---------------------------------------------------
         RATING
      --------------------------------------------------- */

      const matchesRating = (product.rating ?? 0) >= Number(minRating);

      /* ---------------------------------------------------
         STOCK
      --------------------------------------------------- */

      const matchesStock = !inStockOnly || product.stock > 0;

      return (
        matchesSearch &&
        matchesCategory &&
        minimumPrice &&
        maximumPrice &&
        matchesRating &&
        matchesStock
      );
    });

    /* =====================================================
       SORT
    ===================================================== */

    switch (sortBy) {
      case "price-low":
        result = [...result].sort(
          (a, b) => a.price - b.price
        );
        break;

      case "price-high":
        result = [...result].sort(
          (a, b) => b.price - a.price
        );
        break;

      case "name-asc":
        result = [...result].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "name-desc":
        result = [...result].sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      case "rating":
        result = [...result].sort(
          (a, b) =>
            (b.rating ?? 0) -
            (a.rating ?? 0)
        );
        break;

      case "stock":
        result = [...result].sort(
          (a, b) => b.stock - a.stock
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    search,
    selectedCategory,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("Semua");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("0");
    setInStockOnly(false);
    setSortBy("default");
  };

  /* =======================================================
     ACTIVE FILTER CHECK
  ======================================================= */

  const hasActiveFilters =
    search.trim() !== "" ||
    selectedCategory !== "Semua" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating !== "0" ||
    inStockOnly;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ===================================================
          BREADCRUMB
      =================================================== */}

      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-sm md:px-8">
          <Link
            href="/"
            className="text-gray-500 transition hover:text-blue-600"
          >
            Beranda
          </Link>

          <ChevronRight
            size={16}
            className="text-gray-400"
          />

          <span className="font-medium text-gray-900">
            Produk
          </span>
        </div>
      </div>

      {/* ===================================================
          PAGE HEADER
      =================================================== */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Marketplace
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Jelajahi Produk Kami
          </h1>

          <p className="mt-4 max-w-2xl leading-relaxed text-gray-500">
            Temukan berbagai produk pilihan untuk
            kebutuhan sehari-hari dengan harga terbaik.
          </p>
        </div>
      </section>

      {/* ===================================================
          SEARCH
      =================================================== */}

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8">
          <div className="relative">
            <Search
              size={21}
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Cari produk, kategori, atau kebutuhan Anda..."
              className="h-14 w-full rounded-xl border border-gray-200 bg-gray-50 pl-14 pr-5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>
      </section>

      {/* ===================================================
          PRODUCTS
      =================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="flex gap-8">
          {/* =================================================
              DESKTOP FILTER SIDEBAR
          ================================================= */}

          <aside className="hidden w-64 shrink-0 lg:block">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              inStockOnly={inStockOnly}
              onInStockOnlyChange={setInStockOnly}
              onReset={resetFilters}
            />
          </aside>

          {/* =================================================
              PRODUCT CONTENT
          ================================================= */}

          <div className="min-w-0 flex-1">
            {/* ===============================================
                TOOLBAR
            =============================================== */}

            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              {/* LEFT TOOLBAR */}
              <div className="flex items-center gap-3">
                {/* MOBILE FILTER BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    setIsMobileFilterOpen(true)
                  }
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 lg:hidden"
                >
                  <SlidersHorizontal size={18} />

                  Filter
                </button>

                {/* PRODUCT COUNT */}

                <p className="text-sm text-gray-500">
                  Menampilkan{" "}
                  <span className="font-bold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  produk
                </p>
              </div>

              {/* RIGHT TOOLBAR */}

              <div className="flex items-center gap-3">
                {/* VIEW TOGGLE */}

                <div className="hidden items-center rounded-lg border border-gray-200 p-1 sm:flex">
                  {/* GRID */}

                  <button
                    type="button"
                    onClick={() =>
                      setViewMode("grid")
                    }
                    className={`rounded-md p-2 transition ${
                      viewMode === "grid"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                    aria-label="Grid view"
                    aria-pressed={
                      viewMode === "grid"
                    }
                  >
                    <Grid2X2 size={17} />
                  </button>

                  {/* LIST */}

                  <button
                    type="button"
                    onClick={() =>
                      setViewMode("list")
                    }
                    className={`rounded-md p-2 transition ${
                      viewMode === "list"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                    aria-label="List view"
                    aria-pressed={
                      viewMode === "list"
                    }
                  >
                    <List size={17} />
                  </button>
                </div>

                {/* SORTING */}

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(event.target.value)
                  }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
                  aria-label="Urutkan produk"
                >
                  <option value="default">
                    Urutkan Produk
                  </option>

                  <option value="price-low">
                    Harga Terendah
                  </option>

                  <option value="price-high">
                    Harga Tertinggi
                  </option>

                  <option value="name-asc">
                    Nama A-Z
                  </option>

                  <option value="name-desc">
                    Nama Z-A
                  </option>

                  <option value="rating">
                    Rating Tertinggi
                  </option>

                  <option value="stock">
                    Stok Terbanyak
                  </option>
                </select>
              </div>
            </div>

            {/* ===============================================
                ACTIVE FILTERS
            =============================================== */}

            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">
                  Filter aktif:
                </span>

                {/* CATEGORY CHIP */}

                {selectedCategory !== "Semua" && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCategory("Semua")
                    }
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    {selectedCategory}

                    <X size={14} />
                  </button>
                )}

                {/* SEARCH CHIP */}

                {search.trim() !== "" && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    "{search}"

                    <X size={14} />
                  </button>
                )}

                {/* PRICE CHIP */}

                {(minPrice !== "" ||
                  maxPrice !== "") && (
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    {minPrice
                      ? formatPrice(
                          Number(minPrice)
                        )
                      : "Rp 0"}

                    {" - "}

                    {maxPrice
                      ? formatPrice(
                          Number(maxPrice)
                        )
                      : "∞"}

                    <X size={14} />
                  </button>
                )}

                {/* RATING CHIP */}

                {minRating !== "0" && (
                  <button
                    type="button"
                    onClick={() =>
                      setMinRating("0")
                    }
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    ⭐ {minRating}+

                    <X size={14} />
                  </button>
                )}

                {/* STOCK CHIP */}

                {inStockOnly && (
                  <button
                    type="button"
                    onClick={() =>
                      setInStockOnly(false)
                    }
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    Stok tersedia

                    <X size={14} />
                  </button>
                )}

                {/* RESET */}

                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-2 text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Reset Semua
                </button>
              </div>
            )}

            {/* ===============================================
                PRODUCT LIST
            =============================================== */}

            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map(
                    (product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    )
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map(
                    (product) => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                      />
                    )
                  )}
                </div>
              )
            ) : (
              <EmptyState
                resetFilters={resetFilters}
              />
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          MOBILE FILTER
      =================================================== */}

      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">
            {/* MOBILE FILTER HEADER */}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900">
                  Filter Produk
                </p>

                <p className="text-sm text-gray-500">
                  Sesuaikan pencarian Anda
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIsMobileFilterOpen(false)
                }
                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                aria-label="Tutup filter"
              >
                <X size={22} />
              </button>
            </div>

            {/* FILTER */}

            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              inStockOnly={inStockOnly}
              onInStockOnlyChange={setInStockOnly}
              onReset={resetFilters}
            />

            {/* APPLY */}

            <button
              type="button"
              onClick={() =>
                setIsMobileFilterOpen(false)
              }
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   PRODUCT LIST ITEM
========================================================= */

type ProductListItemProps = {
  product: Product;
};

function ProductListItem({
  product,
}: ProductListItemProps) {
  const addItem = useCartStore(
    (state) => state.addItem
  );

  const toggleItem = useWishlistStore(
    (state) => state.toggleItem
  );

  const isFavorite = useWishlistStore(
    (state) =>
      state.items.some(
        (item) => item.id === product.id
      )
  );

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {/* =================================================
            PRODUCT IMAGE
        ================================================= */}

        <Link
          href={`/products/${product.id}`}
          className="flex h-56 shrink-0 items-center justify-center bg-gray-50 p-5 sm:h-auto sm:w-56"
        >
          <Image
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </Link>

        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}

        <div className="flex min-w-0 flex-1 flex-col p-5">
          {/* HEADER */}

          <div className="flex items-start justify-between gap-4">
            <div>
              {/* CATEGORY */}

              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-wider text-blue-600"
              >
                {product.category}
              </Link>

              {/* NAME */}

              <Link
                href={`/products/${product.id}`}
                className="mt-2 block text-lg font-bold text-gray-900 transition hover:text-blue-600"
              >
                {product.name}
              </Link>
            </div>

            {/* WISHLIST */}

            <button
              type="button"
              onClick={() =>
                toggleItem(product)
              }
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition ${
                isFavorite
                  ? "border-red-100 bg-red-50 text-red-500"
                  : "border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500"
              }`}
              aria-label={
                isFavorite
                  ? "Hapus dari wishlist"
                  : "Tambah ke wishlist"
              }
            >
              <Heart
                size={19}
                className={
                  isFavorite
                    ? "fill-red-500"
                    : ""
                }
              />
            </button>
          </div>

          {/* =================================================
              RATING
          ================================================= */}

          <div className="mt-3 flex items-center gap-2">
            <div className="flex">
              {Array.from({
                length: 5,
              }).map((_, index) => (
                <Star
                  key={`${product.id}-star-${index}`}
                  size={15}
                  className={
                    index <
                    Math.round(
                      product.rating ?? 0
                    )
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>

            <span className="text-xs font-semibold text-gray-700">
              {product.rating ?? 0}
            </span>

            <span className="text-xs text-gray-400">
              ({product.reviewCount ?? 0} ulasan)
            </span>
          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {product.description}
          </p>

          {/* =================================================
              BOTTOM
          ================================================= */}

          <div className="mt-5 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            {/* PRICE */}

            <div>
              <p className="text-xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {product.stock > 0
                  ? `${product.stock} stok tersedia`
                  : "Stok habis"}
              </p>
            </div>

            {/* ACTIONS */}

            <div className="flex gap-3">
              {/* CART */}

              <button
                type="button"
                onClick={() =>
                  addItem(product)
                }
                disabled={product.stock <= 0}
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
              >
                <ShoppingCart size={18} />

                {product.stock > 0
                  ? "Keranjang"
                  : "Stok Habis"}
              </button>

              {/* DETAIL */}

              <Link
                href={`/products/${product.id}`}
                className="flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Detail

                <ChevronRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  resetFilters,
}: {
  resetFilters: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
      {/* ICON */}

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Search size={30} />
      </div>

      {/* TITLE */}

      <h2 className="mt-5 text-xl font-bold text-gray-900">
        Produk Tidak Ditemukan
      </h2>

      {/* DESCRIPTION */}

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
        Kami belum menemukan produk yang sesuai
        dengan pencarian atau filter Anda.
      </p>

      {/* RESET */}

      <button
        type="button"
        onClick={resetFilters}
        className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Reset Filter
      </button>
    </div>
  );
}