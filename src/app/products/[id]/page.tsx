import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Heart, ShoppingCart } from "lucide-react";

import { findProduct, products } from "@/data/products";
import AddToCartButton from "@/components/add-to-cart-button";

type ProductDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;
  const product = findProduct(id);

  if (!product) {
    return {
      title: "Product not found",
    };
  }

  return {
    title: `${product.name} | Northstar Store`,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const product = findProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Back */}
        <Link
          href="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        {/* Product */}
        <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:grid-cols-2">

          {/* Image */}
          <div className="relative min-h-[420px] bg-slate-100 lg:min-h-[620px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Information */}
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">

            <div className="flex items-center justify-between gap-4">
              <span className="rounded-full bg-cyan-50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-700">
                {product.category}
              </span>

              <button
                type="button"
                aria-label={`Add ${product.name} to wishlist`}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:border-red-200 hover:text-red-500"
              >
                <Heart size={19} />
              </button>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {product.name}
            </h1>

            <p className="mt-6 text-3xl font-semibold text-slate-900">
              ${product.price.toFixed(2)}
            </p>

            <div className="mt-8 border-t border-slate-200 pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Description
              </h2>

              <p className="mt-3 text-base leading-7 text-slate-600">
                {product.description}
              </p>
            </div>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-8 grid gap-3 border-t border-slate-200 pt-8 text-sm text-slate-600 sm:grid-cols-3">
              <div>
                <p className="font-semibold text-slate-900">
                  Fast shipping
                </p>
                <p className="mt-1">Delivered to your door.</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Secure checkout
                </p>
                <p className="mt-1">Safe and simple ordering.</p>
              </div>

              <div>
                <p className="font-semibold text-slate-900">
                  Easy returns
                </p>
                <p className="mt-1">Shop with confidence.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
