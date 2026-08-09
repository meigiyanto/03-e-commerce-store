"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useStore } from "@/context/store-context";

type AddToCartButtonProps = {
  product: Product;
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useStore();

  return (
    <button
      type="button"
      onClick={() => addToCart(product)}
      className="inline-flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-cyan-600 active:scale-[0.98]"
    >
      <ShoppingCart size={18} />
      Add to cart
    </button>
  );
}
