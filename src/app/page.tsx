import ProductCard from "@/components/product-card";
import { categories, products } from "@/data/products";

export default function Home() {
  const featuredProducts = products.slice(0, 6);

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">
              Northstar Store
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Modern essentials, carefully selected for everyday life.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Temukan produk pilihan untuk audio, home, wearables, travel,
              photography, dan kebutuhan modern lainnya.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#products"
                className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Shop now
              </a>

              <a
                href="#categories"
                className="rounded-full border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-900"
              >
                Explore categories
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 p-3 shadow-2xl">
            <img
              src={products[0].image}
              alt={products[0].name}
              className="h-[360px] w-full rounded-[1.5rem] object-cover sm:h-[430px]"
            />

            <div className="absolute bottom-7 left-7 right-7 rounded-2xl bg-white/95 p-5 text-slate-900 backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-600">
                Featured
              </p>

              <div className="mt-1 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {products[0].name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-600">
                    {products[0].description}
                  </p>
                </div>

                <span className="whitespace-nowrap text-lg font-semibold">
                  ${products[0].price}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="mx-auto max-w-7xl px-6 py-10 lg:px-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
              Browse
            </p>

            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              Shop by category
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories
              .filter((category) => category !== "All")
              .map((category) => (
                <a
                  key={category}
                  href={`/products?category=${encodeURIComponent(category)}`}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  {category}
                </a>
              ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="bg-slate-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-600">
                Curated for you
              </p>

              <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                Featured products
              </h2>

              <p className="mt-2 text-slate-600">
                Produk pilihan dengan desain dan fungsi yang seimbang.
              </p>
            </div>

            <a
              href="/products"
              className="hidden rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 sm:block"
            >
              View all
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-[2rem] bg-cyan-50 px-6 py-12 text-center sm:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            Northstar promise
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-slate-900">
            Simple shopping. Thoughtful products. Better everyday essentials.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Mulai dari produk favorit Anda dan gunakan wishlist serta cart
            untuk menyusun belanja dengan lebih mudah.
          </p>

          <a
            href="/products"
            className="mt-7 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Start shopping
          </a>
        </div>
      </section>
    </main>
  );
}
