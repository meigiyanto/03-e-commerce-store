"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
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

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const searchParams = useSearchParams();
  const reviewOrderId = searchParams.get("orderId") ?? undefined;
  const [quantity, setQuantity] = useState(1);
  const initialTab = searchParams.get("review") === "1" ? "reviews" : "description";
  const [activeTab, setActiveTab] = useState(initialTab);
  const products = useProductStore((state) => state.products);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const isLoading = useProductStore((state) => state.isLoading);
  const error = useProductStore((state) => state.error);
  const addRecentlyViewed = useRecentlyViewedStore((state) => state.addItem);
  const addItem = useCartStore((state) => state.addItem);
  const toggleItem = useWishlistStore((state) => state.toggleItem);
  const wishlistItems = useWishlistStore((state) => state.ids);

  useEffect(() => {
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  const product = products.find((item) => item.id === id);
  
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
    }
  }, [product, addRecentlyViewed]);
  
	const isFavorite = wishlistItems.includes(id);
  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  }, [products, product]);

  if (isLoading && products.length === 0) {
    return (
      <main className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">
          Memuat produk...
        </h1>
      </main>
    );
  }

  if (error && products.length === 0) {
    return (
      <main className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">
          Gagal memuat produk
        </h1>

        <p className="mt-2 text-red-500">
          {error}
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="container mx-auto py-10">
        <h1 className="text-2xl font-bold">
          Produk Tidak Ditemukan
        </h1>

        <p className="text-muted-foreground">
          Produk yang Anda cari tidak ditemukan.
        </p>

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
      setQuantity((current) => current + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((current) => current > 1 ? current - 1 : 1);
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }

    router.push("/cart");
  };

  const handleWishlist = () => {
    toggleItem(product.id);
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* BREADCRUMB */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-4 text-sm md:px-8">

          <Link
            href="/"
            className="shrink-0 text-gray-500 transition hover:text-blue-600"
          >
            Beranda
          </Link>

          <ChevronRight
            size={16}
            className="shrink-0 text-gray-400"
          />

          <Link
            href="/products"
            className="shrink-0 text-gray-500 transition hover:text-blue-600"
          >
            Produk
          </Link>

          <ChevronRight
            size={16}
            className="shrink-0 text-gray-400"
          />

          <Link
            href="/products"
            className="shrink-0 text-gray-500 transition hover:text-blue-600"
          >
            {product.category}
          </Link>

          <ChevronRight
            size={16}
            className="shrink-0 text-gray-400"
          />

          <span className="truncate font-medium text-gray-900">
            {product.name}
          </span>

        </div>
      </div>

      {/* PRODUCT DETAIL */}
      <section className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="grid gap-8 lg:grid-cols-2">

          {/* GALLERY */}
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <div className="aspect-square bg-gray-50 p-6">
                <Image
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>

              <button
                type="button"
                onClick={handleWishlist}
                className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-105 ${
                  isFavorite
                    ? "text-red-500"
                    : "text-gray-600"
                }`}
                aria-label="Tambah ke wishlist"
              >
                <Heart
                  size={21}
                  className={ isFavorite ? "fill-red-500" : "" }
                />
              </button>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="flex h-20 w-20 items-center justify-center rounded-xl border-2 border-blue-600 bg-white p-2"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </button>
            </div>
          </div>

          {/* INFORMATION */}
          <div>

            <Link
              href="/products"
              className="text-sm font-semibold uppercase tracking-wider text-blue-600"
            >
              {product.category}
            </Link>

            <h1 className="mt-3 text-2xl font-bold leading-tight text-gray-900 sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* RATING */}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">

                <div className="flex items-center">
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <Star
                        key={index}
                        size={18}
                        className={
                          index <
                          Math.round(product.rating ?? 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    )
                  )}
                </div>

                <span className="ml-2 text-sm font-semibold text-gray-900">
                  {product.rating ?? 0}
                </span>

              </div>

              <span className="h-5 w-px bg-gray-200" />

              <p className="text-sm text-gray-500">
                Ulasan belum tersedia
              </p>

              <span className="h-5 w-px bg-gray-200" />

              <p className="text-sm text-gray-500">
                Terjual 100+
              </p>
            </div>

            {/* PRICE */}
            <div className="mt-6 rounded-xl bg-blue-50 p-5">

              <p className="text-sm text-gray-500">
                Harga
              </p>

              <p className="mt-2 text-3xl font-bold text-blue-600">
                {formatPrice(product.price)}
              </p>

              <p className="mt-2 text-xs text-green-600">
                ✓ Harga terbaik untuk produk pilihan
              </p>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-6">
              <p className="leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>

            {/* STOCK */}
            <div className="mt-6">
              <span className="font-medium">
                Stock:
              </span>{" "}
              {product.stock}
            </div>

            <div className="my-6 border-t" />

            {/* QUANTITY */}
            <div className="flex flex-wrap items-center gap-5">

              <p className="text-sm font-semibold text-gray-900">
                Jumlah
              </p>

              <div className="flex items-center overflow-hidden rounded-lg border border-gray-200">

                <button
                  type="button"
                  onClick={decreaseQuantity}
                  className="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-gray-100"
                  aria-label="Kurangi jumlah"
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
                  className="flex h-11 w-11 items-center justify-center text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Tambah jumlah"
                >
                  <Plus size={18} />
                </button>

              </div>

              <p className="text-sm text-gray-500">
                Stok tersedia
              </p>

            </div>

            {/* ACTION */}
            <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">

              <button
                type="button"
                onClick={handleAddToCart}
                className="flex items-center justify-center gap-2 rounded-xl border-2 border-blue-600 bg-blue-50 px-5 py-3.5 font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                <ShoppingCart size={20} />
                Masukkan Keranjang
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700"
              >
                Beli Sekarang
              </button>

              <button
                type="button"
                className="flex h-12 items-center justify-center rounded-xl border border-gray-200 px-4 text-gray-600 transition hover:bg-gray-50"
                aria-label="Bagikan produk"
              >
                <Share2 size={20} />
              </button>

            </div>

          </div>
        </div>
      </section>

      {/* TABS */}
      <section className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-10">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="flex overflow-x-auto border-b">

            <TabButton
              label="Deskripsi Produk"
              isActive={activeTab === "description"}
              onClick={() => setActiveTab("description")}
            />

            <TabButton
              label="Spesifikasi"
              isActive={activeTab === "specification"}
              onClick={() => setActiveTab("specification")}
            />

            <TabButton
              label="Ulasan"
              isActive={activeTab === "reviews"}
              onClick={() => setActiveTab("reviews")}
            />

          </div>

          <div className="p-6 md:p-8">
            {activeTab === "description" && (
              <div className="max-w-4xl">

                <h2 className="text-xl font-bold text-gray-900">
                  Tentang Produk
                </h2>

                <p className="mt-4 leading-relaxed text-gray-600">
                  {product.description}
                </p>

                <p className="mt-4 leading-relaxed text-gray-600">
                  Produk ini merupakan pilihan yang tepat untuk
                  kebutuhan sehari-hari. Kami memastikan setiap
                  produk yang tersedia di NexaShop dipilih dengan
                  memperhatikan kualitas dan kepuasan pelanggan.
                </p>

                <div className="mt-6 space-y-3">

                  {[
                    "Produk berkualitas",
                    "Dikemas dengan aman",
                    "Pengiriman terpercaya",
                    "Customer support siap membantu",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >

                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Check size={13} />
                      </div>

                      {feature}

                    </div>
                  ))}

                </div>
              </div>
            )}

            {activeTab === "specification" && (
              <div>

                <h2 className="text-xl font-bold text-gray-900">
                  Spesifikasi Produk
                </h2>

                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200">

                  <SpecificationRow
                    label="Nama Produk"
                    value={product.name}
                  />

                  <SpecificationRow
                    label="Kategori"
                    value={product.category}
                  />

                  <SpecificationRow
                    label="Harga"
                    value={formatPrice(product.price)}
                  />

                  <SpecificationRow
                    label="Kondisi"
                    value="Baru"
                  />

                  <SpecificationRow
                    label="Garansi"
                    value="Garansi toko"
                  />

                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <ReviewSection
                productId={product.id}
                initialOrderId={reviewOrderId}
              />
            )}

          </div>
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 md:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                You May Also Like
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900 md:text-3xl">
                Produk Terkait
              </h2>

            </div>

            <Link
              href="/products"
              className="hidden text-sm font-semibold text-blue-600 hover:text-blue-700 sm:block"
            >
              Lihat Semua Produk →
            </Link>

          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
              />
            ))}

          </div>
        </section>
      )}
      
      {/* RECENTLY VIEWED */}
      <RecentlyViewed excludeId={product.id} />

    </main>
  );
}

function TabButton({ label, isActive, onClick }: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 border-b-2 px-5 py-4 text-sm font-semibold transition ${
        isActive
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-900"
      }`}
    >
      {label}
    </button>
  );
}

function SpecificationRow({ label, value }: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid grid-cols-1 border-b border-gray-200 last:border-b-0 sm:grid-cols-3">

      <div className="bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-700">
        {label}
      </div>

      <div className="px-5 py-4 text-sm text-gray-600 sm:col-span-2">
        {value}
      </div>

    </div>
  );
}

