"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import ProductRating from "@/components/product/ProductRating";
import { Product } from "@/types/product";
import { useCartStore } from "@/stores/cart-store";
import { Heart } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlist-store";

type ProductCardProps = {
    product: Product;
}

export default function ProductCard({ product } : ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const handleAddToCart = () => { addItem(product) }
    const toggleItem = useWishlistStore((state) => state.toggleItem);
    const isFavorite = useWishlistStore((state) => state.items.some((item) => item.id === product.id));
    const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        event.stopPropagation();
        toggleItem(product);
    };

    
    return (
        <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <Link href={`/products/${product.id}`}>
                <div className="relative h-64 overflow-hidden bg-gray-100">
                    {/* Wishlist Button */}
                    <button
                         type="button"
                         onClick={handleFavorite}
                         className="absolute right-6 top-6 z-10 rounded-full bg-white p-2 shadow-md transition hover:scale-110"
                         aria-label="Tambah ke wishlist"
                       >
                        <Heart
                            size={20}
                            className={ isFavorite ? "fill-red-500 text-red-500" : "text-gray-500" }
                        />
                    </button>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                   />
                </div>
            </Link>            
            
            <div className="p-4">
                <p className="mb-2 text-sm text-blue-600">
                    {product.category}
                </p>
            
                <Link href={`/products/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 transition hover:text-blue-600">
                        {product.name}
                    </h3>
                </Link>

                <ProductRating
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                />
            
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-900">
                        Rp {product.price.toLocaleString("id-ID")}
                    </p>
            
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                        aria-label={`Tambah ${product.name} ke keranjang`}
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}