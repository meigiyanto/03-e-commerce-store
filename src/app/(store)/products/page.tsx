"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Grid2X2, Heart, List, Search, ShoppingCart, SlidersHorizontal, Star, X, } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/types/product";
import { useProductStore } from "@/stores/product-store";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [inStockOnly, setInStockOnly] = useState(false);
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);
  
  const categories = [
    "Semua",
    ...Array.from(new Set(products.map((product) => product.category))),
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const query = search
        .trim()
        .toLowerCase();
  
      const matchesSearch =
        query === "" ||
        product.name
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query) ||
        product.description
          .toLowerCase()
          .includes(query);
  
      const matchesCategory =
        selectedCategory === "Semua" ||
        product.category === selectedCategory;
  
      const minimumPrice =
        minPrice === ""
          ? true
          : product.price >= Number(minPrice);
  
      const maximumPrice =
        maxPrice === ""
          ? true
          : product.price <= Number(maxPrice);
  
      const matchesRating =
        product.rating >= Number(minRating);
  
      const matchesStock =
        !inStockOnly || product.stock > 0;
  
      return (
        matchesSearch &&
        matchesCategory &&
        minimumPrice &&
        maximumPrice &&
        matchesRating &&
        matchesStock
      );
    });
  
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
    sortBy,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
  ]);

  const resetFilters = () => {
    setSearch("");
    setSelectedCategory("Semua");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("0");
    setInStockOnly(false);
    setSortBy("default");
  };

  const hasActiveFilters =
    search !== "" ||
    selectedCategory !== "Semua" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    minRating !== "0" ||
    inStockOnly;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* ================= BREADCRUMB ================= */}
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
      {/* ================= PAGE HEADER ================= */}
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
      {/* ================= SEARCH ================= */}
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
      {/* ================= PRODUCTS ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="flex gap-8">
          {/* ================= SIDEBAR ================= */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={
                setSelectedCategory
              }
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              resetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </aside>
          {/* ================= PRODUCT CONTENT ================= */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true) }
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 lg:hidden"
                >
                  <SlidersHorizontal size={18} />
                  Filter
                </button>

                <p className="text-sm text-gray-500">
                  Menampilkan{" "}
                  <span className="font-bold text-gray-900">
                    {filteredProducts.length}
                  </span>{" "}
                  produk
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* View Toggle */}
                <div className="hidden items-center rounded-lg border border-gray-200 p-1 sm:flex">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-md p-2 transition ${
                      viewMode === "grid"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                    aria-label="Grid view"
                    aria-pressed={viewMode === "grid"}
                  >
                    <Grid2X2 size={17} />
                  </button>
                
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`rounded-md p-2 transition ${
                      viewMode === "list"
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                    aria-label="List view"
                    aria-pressed={viewMode === "list"}
                  >
                    <List size={17} />
                  </button>
                </div>

                {/* Sorting */}
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value) }
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
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
                  <option value="name">
                    Nama A-Z
                  </option>
                  <option value="rating">
                    Rating Tertinggi
                  </option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">
                  Filter aktif:
                </span>

                {selectedCategory !== "Semua" && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("Semua")}
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    {selectedCategory}
                    <X size={14} />
                  </button>
                )}

                {search && (
                  <button
                    type="button"
                    onClick={() =>setSearch("")}
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    "{search}"
                    <X size={14} />
                  </button>
                )}

                {(minPrice || maxPrice) && (
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                  >
                    {minPrice
                      ? formatPrice(Number(minPrice))
                      : "Rp 0"}{" "}
                    -
                    {" "}
                    {maxPrice
                      ? formatPrice(Number(maxPrice))
                      : "∞"}

                    <X size={14} />
                  </button>
                )}

                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-2 text-xs font-semibold text-red-500 hover:text-red-600"
                >
                  Reset Semua
                </button>
              </div>
            )}

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>
              )
            ) : (
              <EmptyState resetFilters={resetFilters} />
            )}
          </div>
        </div>
      </section>
      {/* ================= MOBILE FILTER ================= */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5">

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
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Tutup filter"
              >
                <X size={22} />
              </button>
            </div>

            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={
                setSelectedCategory
              }
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMinPrice={setMinPrice}
              setMaxPrice={setMaxPrice}
              resetFilters={resetFilters}
              hasActiveFilters={hasActiveFilters}
            />

            <button
              type="button"
              onClick={() =>
                setIsMobileFilterOpen(false)
              }
              className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ================= FILTER SIDEBAR ================= */

type FilterSidebarProps = {
  categories: string[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  minPrice: string;
  maxPrice: string;
  setMinPrice: (price: string) => void;
  setMaxPrice: (price: string) => void;
  minRating: string;
  setMinRating: (rating: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
};

function FilterSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  minRating,
  setMinRating,
  inStockOnly,
  setInStockOnly,
  resetFilters,
  hasActiveFilters,
}: FilterSidebarProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white">

      {/* Filter Header */}
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            size={18}
            className="text-blue-600"
          />

          <h2 className="font-bold text-gray-900">
            Filter Produk
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-semibold text-red-500 hover:text-red-600"
          >
            Reset
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b p-5">
        <h3 className="mb-4 text-sm font-bold text-gray-900">
          Kategori
        </h3>

        <div className="space-y-1">
          {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() =>setSelectedCategory(category)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  selectedCategory ===
                  category
                    ? "bg-blue-50 font-semibold text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {category}
                {selectedCategory ===
                  category && (
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
        </div>
      </div>

      {/* Price */}
      <div className="p-5">
        <h3 className="mb-4 text-sm font-bold text-gray-900">
          Rentang Harga
        </h3>

        <div className="space-y-3">
          <input
            type="number"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
            placeholder="Harga minimum"
            min="0"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(event) =>setMaxPrice(event.target.value)}
            placeholder="Harga maksimum"
            min="0"
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="border-t p-5">
        <h3 className="mb-4 text-sm font-bold text-gray-900">
          Rating Minimum
        </h3>
      
        <div className="space-y-2">
          {[
            { value: "0", label: "Semua Rating" },
            { value: "4", label: "⭐ 4 ke atas" },
            { value: "3", label: "⭐ 3 ke atas" },
            { value: "2", label: "⭐ 2 ke atas" },
          ].map((rating) => (
            <button
              key={rating.value}
              type="button"
              onClick={() =>
                setMinRating(rating.value)
              }
              className={`flex w-full items-center rounded-lg px-3 py-2.5 text-left text-sm transition ${
                minRating === rating.value
                  ? "bg-blue-50 font-semibold text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {rating.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stock */}
      <div className="border-t p-5">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) =>
              setInStockOnly(
                event.target.checked
              )
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
      
          <span className="text-sm font-medium text-gray-700">
            Hanya tampilkan produk tersedia
          </span>
        </label>
      </div>
    </div>
  );
}

type ProductListItemProps = {
  product: Product;
};

function ProductListItem({ product, }: ProductListItemProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const isFavorite = useWishlistStore((state) =>state.items.some((item) => item.id === product.id));

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row">

        {/* Product Image */}
        <Link
          href={`/products/${product.id}`}
          className="flex h-56 shrink-0 items-center justify-center bg-gray-50 p-5 sm:h-auto sm:w-56"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Product Information */}
        <div className="flex min-w-0 flex-1 flex-col p-5">

          <div className="flex items-start justify-between gap-4">
            <div>
              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-wider text-blue-600"
              >
                {product.category}
              </Link>

              <Link
                href={`/products/${product.id}`}
                className="mt-2 block text-lg font-bold text-gray-900 transition hover:text-blue-600"
              >
                {product.name}
              </Link>
            </div>

            {/* Wishlist */}
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
              aria-label="Tambah ke wishlist"
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

          {/* Rating */}
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

          {/* Description */}
          <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-gray-500">
            {product.description}
          </p>

          {/* Bottom */}
          <div className="mt-5 flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Produk berkualitas
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  addItem(product)
                }
                className="flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                <ShoppingCart size={18} />
                Keranjang
              </button>

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

/* ================= EMPTY STATE ================= */
function EmptyState({resetFilters}: {resetFilters: () => void}) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">

      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
        <Search size={30} />
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">
        Produk Tidak Ditemukan
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-500">
        Kami belum menemukan produk yang sesuai dengan
        pencarian atau filter Anda.
      </p>

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

