"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingCart,
} from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { products } from "@/data/products";
import { useCartStore } from "@/stores/cart-store";

export default function ProductDetailPage() {
    const params = useParams()
    const [quantity, setQuantity] = useState(1)
    const addItem = useCartStore((state) => state.addItem);
    const productId = Number(params.id)
    const product = products.find((product) => product.id === productId)

    if (!product) {
        return (
        <main className="min-h-screen bg-gray-50">
        <Navbar />
        
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-32 text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Produk Tidak Ditemukan
              </h1>
        
              <p className="mt-3 text-gray-500">
                Produk yang Anda cari tidak tersedia.
              </p>
        
              <Link
                href="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <ArrowLeft size={18} />
                Kembali ke Produk
              </Link>
            </div>
          </main>
        )
    }
    
    const increaseQuantity = () => {
        setQuantity((previousQuantity) => previousQuantity + 1)
    }
    
    const decreaseQuantity = () => {
        setQuantity((previousQuantity) => previousQuantity > 1 ? previousQuantity - 1 : 1)
    }

    return (
        <main className="min-h-screen bg-gray-50">
        <Navbar />
        
          <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
            
            {/* Back Button */}
            <Link
              href="/products"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
            >
              <ArrowLeft size={18} />
              Kembali ke Produk
            </Link>
        
            {/* Product Detail */}
            <div className="grid gap-10 lg:grid-cols-2">
              
              {/* Product Image */}
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
                <div className="aspect-square">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
        
              {/* Product Information */}
              <div className="flex flex-col justify-center">
                
                {/* Category */}
                <span className="w-fit rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-600">
                  {product.category}
                </span>
        
                {/* Product Name */}
                <h1 className="mt-5 text-4xl font-bold text-gray-900">
                  {product.name}
                </h1>
        
                {/* Price */}
                <p className="mt-4 text-3xl font-bold text-blue-600">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
        
                <div className="my-6 h-px bg-gray-200" />
        
                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Deskripsi Produk
                  </h2>
        
                  <p className="mt-3 leading-relaxed text-gray-600">
                    {product.description}
                  </p>
                </div>
        
                {/* Quantity */}
                <div className="mt-8">
                  <p className="mb-3 font-semibold text-gray-900">
                    Jumlah
                  </p>
        
                  <div className="flex w-fit items-center rounded-xl border border-gray-200 bg-white">
                    
                    <button
                      onClick={decreaseQuantity}
                      className="p-3 text-gray-600 transition hover:bg-gray-100"
                      aria-label="Kurangi jumlah"
                    >
                      <Minus size={18} />
                    </button>
        
                    <span className="w-12 text-center font-semibold">
                      {quantity}
                    </span>
        
                    <button
                      onClick={increaseQuantity}
                      className="p-3 text-gray-600 transition hover:bg-gray-100"
                      aria-label="Tambah jumlah"
                    >
                      <Plus size={18} />
                    </button>
        
                  </div>
                </div>
        
                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={() => addItem(product, quantity)}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
                >
                  <ShoppingCart size={20} />
                  Tambah ke Keranjang
                </button>
        
              </div>
            </div>
          </section>
        </main>
    )
}