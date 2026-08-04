"use client";

import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  badge: string;
  accent: string;
};

type CartItem = Product & {
  quantity: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Aurora Headphones",
    price: 2490000,
    category: "Audio",
    description: "Suara spatial yang jernih untuk fokus kerja dan hiburan.",
    badge: "Best Seller",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    id: 2,
    name: "Lumen Smart Watch",
    price: 1890000,
    category: "Wearables",
    description: "Pantau aktivitas harian dengan desain ramping dan tahan air.",
    badge: "New",
    accent: "from-violet-500 to-fuchsia-600",
  },
  {
    id: 3,
    name: "Halo Keyboard",
    price: 1190000,
    category: "Accessories",
    description: "Tombol mekanis yang responsif untuk coding dan gaming.",
    badge: "Editor Pick",
    accent: "from-amber-400 to-orange-500",
  },
  {
    id: 4,
    name: "Orbit Speaker",
    price: 899000,
    category: "Audio",
    description: "Output bass yang kuat dan baterai tahan lama untuk suasana santai.",
    badge: "Compact",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: 5,
    name: "Nimbus Backpack",
    price: 759000,
    category: "Lifestyle",
    description: "Tas premium dengan ruang luas untuk laptop dan kebutuhan travel.",
    badge: "Travel Ready",
    accent: "from-slate-600 to-slate-800",
  },
  {
    id: 6,
    name: "Pulse Charger",
    price: 329000,
    category: "Accessories",
    description: "Pengisian cepat dan aman untuk semua perangkat Anda.",
    badge: "Fast Charge",
    accent: "from-rose-500 to-pink-600",
  },
];

const categories = ["All", "Audio", "Wearables", "Accessories", "Lifestyle"];
const currency = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    const savedCart = window.localStorage.getItem("nova-cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        window.localStorage.removeItem("nova-cart");
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem("nova-cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  const filteredProducts = useMemo(() => {
    if (activeCategory === "All") return products;
    return products.filter((product) => product.category === activeCategory);
  }, [activeCategory]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cart.length > 0 ? 15000 : 0;
  const total = subtotal + shipping;

  const addToCart = (product: Product) => {
    setOrderComplete(false);
    setCart((current) => {
      const existingItem = current.find((item) => item.id === product.id);
      if (existingItem) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + change } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  };

  const removeFromCart = (id: number) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      setOrderComplete(true);
      setCart([]);
      setCustomer({ name: "", email: "", address: "" });
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.14),_transparent_38%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] text-slate-900">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-900">NOVA Commerce</p>
            <p className="text-sm text-slate-500">Gadget modern, kenyamanan maksimal</p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            <ShoppingBag className="h-4 w-4" />
            {cartCount} item di keranjang
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-200 sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Koleksi baru bulan ini
            </div>
            <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
              Belanja perangkat favorit dengan pengalaman checkout yang cepat.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-300">
              Temukan headset, smartwatch, dan aksesoris premium yang siap menunjang rutinitas harian Anda.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#products"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                Jelajahi produk <ArrowRight className="h-4 w-4" />
              </a>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-slate-200">
                <ShieldCheck className="h-4 w-4" />
                Garansi resmi 1 tahun
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">Kenapa memilih NOVA</p>
            <div className="mt-5 space-y-4">
              {[
                ["Cepat dan aman", "Pembayaran aman dan pengiriman terjamin."],
                ["Katalog terkurasi", "Produk terbaik dengan ulasan terpercaya."],
                ["Bantuan 24/7", "Tim support siap membantu kapan pun."],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="mt-1 text-sm text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeCategory === category
                      ? "bg-slate-900 text-white"
                      : "bg-white text-slate-700 shadow-sm shadow-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {filteredProducts.map((product) => (
                <article key={product.id} className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200">
                  <div className={`h-24 rounded-2xl bg-gradient-to-br ${product.accent}`} />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {product.badge}
                      </span>
                      <h2 className="mt-3 text-xl font-semibold text-slate-900">{product.name}</h2>
                    </div>
                    <p className="text-sm font-semibold text-cyan-600">{currency.format(product.price)}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{product.description}</p>
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                  >
                    Tambah ke keranjang <Plus className="h-4 w-4" />
                  </button>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-600">Ringkasan belanja</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Keranjang Anda</h2>
              </div>
              <div className="rounded-full bg-slate-100 p-2 text-slate-700">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
                Keranjang masih kosong. Tambahkan produk favorit Anda untuk memulai.
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{currency.format(item.price)}</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-slate-400 transition hover:text-rose-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
                        <button type="button" onClick={() => updateQuantity(item.id, -1)} className="rounded-full p-1.5 hover:bg-white">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button type="button" onClick={() => updateQuantity(item.id, 1)} className="rounded-full p-1.5 hover:bg-white">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-semibold text-slate-900">{currency.format(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">{currency.format(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya pengiriman</span>
                <span className="font-semibold text-slate-900">{currency.format(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold text-slate-900">
                <span>Total</span>
                <span>{currency.format(total)}</span>
              </div>
            </div>

            <form onSubmit={handleCheckout} className="mt-6 space-y-3">
              <input
                required
                value={customer.name}
                onChange={(event) => setCustomer((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-0"
                placeholder="Nama lengkap"
              />
              <input
                required
                type="email"
                value={customer.email}
                onChange={(event) => setCustomer((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-0"
                placeholder="Email"
              />
              <textarea
                required
                value={customer.address}
                onChange={(event) => setCustomer((current) => ({ ...current, address: event.target.value }))}
                className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none ring-0"
                placeholder="Alamat pengiriman"
              />
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isSubmitting ? "Memproses..." : "Checkout sekarang"}
              </button>
            </form>

            {orderComplete ? (
              <div className="mt-4 flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                Pesanan Anda sudah diterima. Konfirmasi akan dikirim ke email Anda.
              </div>
            ) : null}
          </aside>
        </section>
      </main>
    </div>
  );
}
