import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product"; import { useCartStore } from "@/stores/cart-store";

type ProductCardProps = { product: Product; };

type Product = {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;
}

export default function ProductCard({ product }:{ product: Product }) {
    const addItem = useCartStore((state) => state.addItem);
    const handleAddToCart = () => { addItem(product); };

    return (
        {/* Product Image */}
        <Link href={/products/${product.id}}>    
        
        {/* Product Content */}
        <div className="p-4">
            <p className="mb-2 text-sm text-blue-600">
              {product.category}
            </p>
    
            <Link href={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 transition hover:text-blue-600">{product.name}</h3>
            </Link>
        
            <div className="mt-4 flex items-center justify-between">
            <p className="text-lg font-bold text-gray-900">
                Rp {product.price.toLocaleString("id-ID")}
            </p>

                <button
                    onClick={handleAddToCart}
                    className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                    aria-label={`Tambah ${product.name} ke keranjang`}
                >
                    <ShoppingCart size={18} />
                </button>
            </div>
        </div>
    )
}