import Link from "next/link";
import { ArrowRight, ChevronRight, Headphones, Laptop, Monitor, Package, Shirt, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Watch } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { products } from "@/data/products";

const categories = [
  {
    name: "Elektronik",
    icon: Smartphone,
  },
  {
    name: "Komputer",
    icon: Laptop,
  },
  {
    name: "Fashion",
    icon: Shirt,
  },
  {
    name: "Smart Watch",
    icon: Watch,
  },
  {
    name: "Aksesoris",
    icon: Sparkles,
  },
  {
    name: "Peralatan",
    icon: Package,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Top Promotion */}
      <div className="bg-gray-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-center text-xs sm:text-sm md:px-8">
          <p>
            🔥 Promo spesial minggu ini — Diskon hingga 50%
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-8 lg:grid-cols-[250px_1fr]">

          {/* Category Sidebar */}
          <aside className="hidden rounded-xl border border-gray-200 lg:block">
            <div className="border-b px-5 py-4">
              <h2 className="font-bold text-gray-900">
                SHOP BY CATEGORY
              </h2>
            </div>

            <div className="py-2">
              {categories.map((category) => {
                const Icon = category.icon;

                return (
                  <Link
                    key={category.name}
                    href="/products"
                    className="flex items-center justify-between px-5 py-3 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={18} />
                      {category.name}
                    </span>

                    <ChevronRight size={16} />
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Hero Banner */}
          <div className="grid gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
              <div className="grid min-h-[420px] items-center gap-8 px-6 py-12 sm:px-10 md:grid-cols-2 lg:px-14">

                <div className="relative z-10">
                  <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-blue-100">
                    NEW COLLECTION 2026
                  </span>

                  <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                    Belanja Lebih
                    <br />
                    Mudah di
                    <span className="text-blue-200">
                      {" "}NexaShop
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-relaxed text-blue-100 sm:text-base">
                    Temukan produk pilihan untuk kebutuhan sehari-hari
                    dengan harga terbaik dan pengalaman belanja yang
                    nyaman.
                  </p>

                  <Link
                    href="/products"
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-50"
                  >
                    Belanja Sekarang
                    <ArrowRight size={18} />
                  </Link>
                </div>

                {/* Hero Visual */}
                <div className="relative flex items-center justify-center">
                  <div className="flex h-72 w-72 items-center justify-center rounded-full bg-white/10 backdrop-blur md:h-80 md:w-80">
                    <ShoppingBag
                      size={140}
                      className="text-white/90"
                    />
                  </div>

                  <div className="absolute bottom-0 right-0 rounded-2xl bg-white p-4 shadow-xl">
                    <p className="text-xs text-gray-500">
                      Special Offer
                    </p>

                    <p className="mt-1 font-bold text-gray-900">
                      Diskon hingga 50%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Cards */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-orange-100 p-6">
                <p className="text-sm font-semibold text-orange-600">
                  FLASH DEAL
                </p>

                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  Produk Pilihan
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Harga spesial untuk waktu terbatas.
                </p>

                <Link
                  href="/products"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-orange-600"
                >
                  Belanja Sekarang
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="rounded-2xl bg-purple-100 p-6">
                <p className="text-sm font-semibold text-purple-600">
                  BEST SELLER
                </p>

                <h3 className="mt-2 text-2xl font-bold text-gray-900">
                  Produk Terpopuler
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Pilihan favorit pelanggan kami.
                </p>

                <Link
                  href="/products"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-600"
                >
                  Lihat Produk
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Browse Categories
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Kategori Populer
            </h2>
          </div>

          <Link
            href="/categories"
            className="hidden items-center gap-2 text-sm font-semibold text-blue-600 sm:flex"
          >
            Lihat Semua
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href="/products"
                className="group rounded-xl border border-gray-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  <Icon size={24} />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-gray-800">
                  {category.name}
                </h3>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="bg-gray-900 py-14">
        <div className="mx-auto max-w-7xl px-4 md:px-8">

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
                Limited Time Offer
              </p>

              <h2 className="mt-2 text-3xl font-bold text-white">
                ⚡ Flash Sale
              </h2>
            </div>

            <div className="flex gap-2">
              {["02", "14", "35", "20"].map((time, index) => (
                <div key={time} className="flex items-center gap-2">
                  <div className="rounded-lg bg-white px-3 py-2 text-lg font-bold text-gray-900">
                    {time}
                  </div>

                  {index < 3 && (
                    <span className="text-white">
                      :
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Featured Products
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Produk Pilihan
            </h2>

            <p className="mt-3 text-gray-500">
              Pilihan produk terbaik untuk kebutuhan Anda.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 font-semibold text-blue-600"
          >
            Lihat Semua Produk
            <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="px-4 pb-16 md:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-12 text-white md:px-12 md:py-16">

          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-blue-200">
                MEMBER BENEFIT
              </p>

              <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                Dapatkan Promo dan
                <br />
                Penawaran Terbaik
              </h2>

              <p className="mt-4 max-w-xl text-blue-100">
                Nikmati pengalaman belanja yang lebih mudah dan
                berbagai penawaran menarik dari NexaShop.
              </p>

              <Link
                href="/products"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700"
              >
                Mulai Belanja
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="hidden justify-center md:flex">
              <Monitor
                size={180}
                className="text-white/80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Store Benefits */}
      <section className="border-y bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 md:px-8">

          <Feature
            icon={<Truck size={28} />}
            title="Pengiriman Cepat"
            description="Pesanan dikirim dengan aman dan cepat."
          />

          <Feature
            icon={<ShieldCheck size={28} />}
            title="Pembayaran Aman"
            description="Transaksi aman dan terpercaya."
          />

          <Feature
            icon={<Headphones size={28} />}
            title="Customer Support"
            description="Kami siap membantu kebutuhan Anda."
          />

          <Feature
            icon={<Package size={28} />}
            title="Produk Berkualitas"
            description="Produk pilihan dengan kualitas terbaik."
          />
        </div>
      </section>

    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>

      <div>
        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div>
      <h3 className="font-semibold text-white">
        {title}
      </h3>

      <ul className="mt-4 space-y-3 text-sm">
        {links.map((link) => (
          <li key={link}>
            <Link
              href="#"
              className="transition hover:text-white"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}