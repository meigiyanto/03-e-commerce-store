import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, Headphones } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
        
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
            <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:px-8 md:py-28">
              
              <div className="flex flex-col justify-center">
                <span className="mb-4 w-fit rounded-full bg-white/20 px-4 py-2 text-sm">
                  Belanja Lebih Mudah
                </span>
        
                <h1 className="text-4xl font-bold leading-tight md:text-6xl">
                  Temukan Produk
                  <br />
                  Favoritmu di
                  <span className="text-blue-200"> NexaShop</span>
                </h1>
        
                <p className="mt-6 max-w-lg text-blue-100 md:text-lg">
                  Temukan berbagai produk berkualitas dengan harga terbaik.
                  Belanja mudah, aman, dan nyaman dalam satu tempat.
                </p>
        
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/products"
                    className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Belanja Sekarang
                    <ArrowRight size={18} />
                  </Link>
        
                  <Link
                    href="/about"
                    className="rounded-xl border border-white/40 px-6 py-3 font-semibold transition hover:bg-white/10"
                  >
                    Pelajari Lebih Lanjut
                  </Link>
                </div>
              </div>
        
              {/* Hero Image Area */}
              <div className="flex items-center justify-center">
                <div className="flex h-80 w-full max-w-md items-center justify-center rounded-3xl bg-white/10 text-center backdrop-blur-sm">
                  <div>
                    <p className="text-6xl">🛍️</p>
        
                    <p className="mt-4 text-xl font-semibold">
                      Belanja Modern
                    </p>
        
                    <p className="mt-2 text-sm text-blue-100">
                      Produk terbaik untuk kebutuhanmu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        
            {/* Features */}
            <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
            <div className="grid gap-6 md:grid-cols-3">
              
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 w-fit rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Truck size={24} />
                </div>
        
                <h3 className="text-lg font-semibold">
                  Pengiriman Cepat
                </h3>
        
                <p className="mt-2 text-sm text-gray-500">
                  Produk dikirim dengan cepat dan aman ke alamat Anda.
                </p>
              </div>
        
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 w-fit rounded-xl bg-blue-100 p-3 text-blue-600">
                  <ShieldCheck size={24} />
                </div>
        
                <h3 className="text-lg font-semibold">
                  Pembayaran Aman
                </h3>
        
                <p className="mt-2 text-sm text-gray-500">
                  Sistem pembayaran aman dan terpercaya.
                </p>
              </div>
        
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="mb-4 w-fit rounded-xl bg-blue-100 p-3 text-blue-600">
                  <Headphones size={24} />
                </div>
        
                <h3 className="text-lg font-semibold">
                  Customer Support
                </h3>
        
                <p className="mt-2 text-sm text-gray-500">
                  Kami siap membantu Anda setiap saat.
                </p>
              </div>
            </div>
          </section>
        
            {/* Products */}
            <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
            
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  PRODUK PILIHAN
                </p>
        
                <h2 className="mt-2 text-3xl font-bold">
                  Produk Terpopuler
                </h2>
        
                <p className="mt-3 text-gray-500">
                  Pilihan produk terbaik untuk Anda.
                </p>
              </div>
        
              <Link
                href="/products"
                className="hidden items-center gap-2 font-medium text-blue-600 hover:text-blue-700 md:flex"
              >
                Lihat Semua
                <ArrowRight size={18} />
              </Link>
            </div>
        
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
        
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 font-medium text-blue-600"
              >
                Lihat Semua Produk
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        
            {/* CTA Section */}
            <section className="px-4 py-20 md:px-8">
            <div className="mx-auto max-w-7xl rounded-3xl bg-gray-900 px-6 py-16 text-center text-white md:px-16">
              
              <h2 className="text-3xl font-bold md:text-4xl">
                Siap Mulai Berbelanja?
              </h2>
        
              <p className="mx-auto mt-4 max-w-xl text-gray-300">
                Temukan berbagai produk berkualitas dengan pengalaman belanja
                yang mudah dan nyaman.
              </p>
        
              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-100"
              >
                Mulai Belanja
                <ArrowRight size={18} />
              </Link>
            </div>
          </section>
        
            {/* Footer */}
            <footer className="border-t bg-white">
            <div className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-gray-500 md:px-8">
              © 2026 NexaShop. Dibuat untuk portfolio.
            </div>
          </footer>
        </main>
    )
}