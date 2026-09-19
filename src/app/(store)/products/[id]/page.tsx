"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRecentlyViewedStore } from "@/stores/recently-viewed-store";
import { useCartStore } from "@/stores/cart-store";
import { useProductStore } from "@/stores/product-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Check, ChevronRight, Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import RecentlyViewed from "@/components/product/RecentlyViewed";
import ReviewSection from "@/components/product/ReviewSection";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

function ProductDetailContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const reviewOrderId = searchParams.get("orderId") ?? undefined;
  const initialTab = searchParams.get("review") === "1" ? "reviews" : "description";

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(initialTab);

  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);

  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addItem);
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const wishlistItems = useWishlistStore((state) => state.items);

  console.log(wishlistItems);

  useEffect(() => {
    if (products.length === 0 && !isLoading && !error) {
      fetchProducts();
    }
  }, [products.length, isLoading, error, fetchProducts]);

  const product = useMemo(() => products.find((item) => item.id === id), [products, id]);

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);

  const isFavorite = wishlistItems.includes(id);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((item) => item.category === product.category && item.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  if (isLoading && products.length === 0) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold">Memuat produk...</h1>
      </main>
    );
  }

  if (error && products.length === 0) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-red-600">Gagal memuat produk</h1>
        <p className="mt-2 text-gray-600">{error}</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold">Produk Tidak Ditemukan</h1>
        <p className="text-gray-500">Produk yang Anda cari tidak tersedia.</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Kembali ke Produk
        </Link>
      </main>
    );
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = () => {
    // Direkomendasikan mengupdate store agar addItem mendukung penambahan jumlah sekaligus: addItem(product, quantity)
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* BREADCRUMB */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-4 text-sm md:px-8">
          <Link href="/" className="shrink-0 text-gray-500 hover:text-blue-600">
            Beranda
          </Link>
          <ChevronRight size={16} className="shrink-0 text-gray-400" />
          <Link href="/products" className="shrink-0 text-gray-500 hover:text-blue-600">
            Produk
          </Link>
          <ChevronRight size={16} className="shrink-0 text-gray-400" />
          <Link href="/products" className="shrink-0 text-gray-500 hover:text-blue-600">
            {product.category}
          </Link>
          <ChevronRight size={16} className="shrink-0 text-gray-400" />
          <span className="truncate font-medium text-gray-900">{product.name}</span>
        </div>
      </div>

      {/* DETAIL PRODUK */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* GALERI */}
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="aspect-square bg-gray-50 p-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={500}
                  height={500}
                  priority
                  className="h-full w-full object-contain"
                />
              </div>
              <button
                type="button"
                onClick={() => toggleItem(product.id)}
                className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105 ${
                  isFavorite ? "text-red-500" : "text-gray-600"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={21} className={isFavorite ? "fill-red-500" : ""} />
              </button>
            </div>
          </div>

          {/* INFORMASI */}
          <div>
            <Link href="/products" className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              {product.category}
            </Link>
            <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* HARGA */}
            <div className="mt-6 rounded-xl bg-blue-50 p-5">
              <p className="text-sm text-gray-500">Harga</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{formatPrice(product.price)}</p>
            </div>

            {/* JUMLAH */}
            <div className="mt-6 flex flex-wrap items-center gap-5">
              <p className="text-sm font-semibold text-gray-900">Jumlah</p>
              <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-100"
                >
                  <Minus size={18} />
                </button>
                <span className="flex h-11 min-w-12 items-center justify-center border-x border-gray-200 px-3 text-sm font-semibold text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increaseQuantity}
                  disabled={quantity >= product.stock}
                  className="flex h-11 w-11 items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* AKSI */}
            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-blue-50 px-5 py-3.5 font-semibold text-blue-600 hover:bg-blue-100"
              >
                <ShoppingCart size={20} />
                Masukkan Keranjang
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700"
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TABS & REVIEWS */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex overflow-x-auto border-b">
            <TabButton label="Deskripsi Produk" isActive={activeTab === "description"} onClick={() => setActiveTab("description")} />
            <TabButton label="Ulasan" isActive={activeTab === "reviews"} onClick={() => setActiveTab("reviews")} />
          </div>
          <div className="p-6 md:p-8">
            {activeTab === "description" && <p className="text-gray-600">{product.description}</p>}
            {activeTab === "reviews" && <ReviewSection productId={product.id} initialOrderId={reviewOrderId} />}
          </div>
        </div>
      </section>

      {/* RECENTLY VIEWED */}
      <RecentlyViewed excludeId={product.id} />
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10 px-4">Memuat halaman...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}

function TabButton({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border-b-2 px-5 py-4 text-sm font-semibold transition ${
        isActive ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
}