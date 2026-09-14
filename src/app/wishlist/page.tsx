"use client";

import Link from "next/link";
import {
    Heart,
    ShoppingBag,
    Trash2,
} from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";

export default function WishlistPage() {
    const items = useWishlistStore((state) => state.items);
    const removeItem = useWishlistStore((state) => state.removeItem);

    if (items.length === 0) {
        return (
            <section className="mx-auto flex min-h-[70vh] max-w-7xl flex-col items-center justify-center px-4 text-center">
                <div className="rounded-full bg-red-50 p-6 text-red-500">
                    <Heart size={48} />
                </div>

                <h1 className="mt-6 text-3xl font-bold text-gray-900">
                    Wishlist Anda Kosong
                </h1>
            
                <p className="mt-3 max-w-md text-gray-500">
                    Simpan produk favorit Anda di wishlist untuk
                    dilihat kembali nanti.
                </p>
            
                <Link
                    href="/products"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <ShoppingBag size={18} />
                  Lihat Produk
                </Link>
            </section>
        )
    }

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Produk Favorit
                </h1>
        
                <p className="mt-2 text-gray-500">
                  {items.length} produk dalam wishlist Anda
                </p>
            </div>        
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((item) => (
                    <div
                    key={item.id}
                    className="relative rounded-2xl bg-white p-4 shadow-sm"
                  >
                        <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="absolute right-6 top-6 z-10 rounded-full bg-white p-2 text-red-500 shadow-md transition hover:bg-red-50"
                            aria-label={`Hapus ${item.name} dari wishlist`}
                        >
                            <Trash2 size={18} />
                        </button>
            
                        <Link href={`/products/${item.id}`}>
                        <img
                        src={item.image}
                        alt={item.name}
                        className="h-52 w-full rounded-xl object-cover"
                      />        
                        
                        <div className="mt-4">
                            <p className="text-sm text-blue-600">
                          {item.category}
                        </p>        
                            <h2 className="mt-1 font-semibold text-gray-900">
                          {item.name}
                        </h2>        
                            {item.rating && (
                              <div className="mt-2 flex items-center gap-1">
                                <Heart
                                  size={16}
                                  className="fill-red-500 text-red-500"
                                />
                
                                <span className="text-sm text-gray-600">
                                  Rating {item.rating}
                                </span>
                              </div>
                            )}            
                            <p className="mt-3 text-lg font-bold text-blue-600">
                                Rp {item.price.toLocaleString("id-ID")}
                            </p>
                        </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    )
}