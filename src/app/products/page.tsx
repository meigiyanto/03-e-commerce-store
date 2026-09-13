"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";

export default function ProductsPage() {
    const [search, setSearch] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("Semua")
    
    // Mengambil daftar kategori unik
    const categories = [ "Semua", ...Array.from(new Set(products.map((product) => product.category)))]

    // Filter produk berdasarkan pencarian dan kategori
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = selectedCategory === "Semua" || product.category === selectedCategory;
            return matchesSearch && matchesCategory
        })
    }, [search, selectedCategory])
    
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Header */}
            <section className="border-b bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
                  <p className="text-sm font-semibold text-blue-600">
                    KATALOG PRODUK
                  </p>
            
                  <h1 className="mt-2 text-3xl font-bold text-gray-900 md:text-4xl">
                    Temukan Produk Favoritmu
                  </h1>
            
                  <p className="mt-3 max-w-2xl text-gray-500">
                    Jelajahi berbagai produk pilihan dengan kualitas terbaik
                    untuk kebutuhan Anda.
                  </p>
                </div>
              </section>
            
            {/* Products Section */}
            <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
            
            {/* Search and Filter */}
            <div className="mb-8 rounded-2xl bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-5">
                
                {/* Search */}
                <div className="relative">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
        
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
        
                {/* Categories */}
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-gray-500" />
        
                    <p className="text-sm font-semibold text-gray-700">
                      Filter Kategori
                    </p>
                  </div>
        
                  <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          selectedCategory === category
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        
            {/* Result Info */}
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                Menampilkan{" "}
                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{" "}
                produk
              </p>
            </div>
        
            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white py-20 text-center shadow-sm">
                <p className="text-xl font-semibold text-gray-800">
                  Produk tidak ditemukan
                </p>
        
                <p className="mt-2 text-gray-500">
                  Coba gunakan kata kunci atau kategori lain.
                </p>
        
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("Semua");
                  }}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </section>
        </main>
    )
}