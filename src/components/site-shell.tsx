"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import { useStore } from "@/context/store-context";
import { SignInButton, SignUpButton, UserButton, Show, } from "@clerk/nextjs";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  // const { data: session } = useSession();
  const pathname = usePathname();
  const { cartCount, wishlist } = useStore();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.15),_transparent_40%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-lg font-semibold">Northstar</p>
              <p className="text-sm text-slate-500">Modern Essentials</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navigation.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            >
              Browse
            </Link>

            <Link href="/cart" className="relative rounded-full bg-slate-900 p-2 text-white">
              <ShoppingBag size={18} />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-semibold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            <div className="hidden rounded-full bg-slate-100 p-2 text-slate-600 sm:flex">
              <Heart size={18} />
              <span className="ml-2 text-sm">{wishlist.length}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>

      <footer className="border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 Northstar Store. Semua kebutuhan modern ada di sini.</p>
          <div className="flex gap-4">
            <Link href="/products" className="hover:text-slate-900">
              Produk
            </Link>
            <Link href="/checkout" className="hover:text-slate-900">
              Checkout
            </Link>
            
            {/* {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="hover:text-slate-900"
              >
                Admin
              </Link>
            )} */}
            
            {/* {!session?.user && (
              <Link href="/login">
                Login
              </Link>
            )} */}

            <Show when="signed-out">
              <SignInButton/>
              <SignUpButton>
                {/* <button className="bg-purple-700 text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"> */}
                  Sign Up
                {/* </button> */}
              </SignUpButton>
            </Show>
            
            <Show when="signed-in">
              <UserButton/>
            </Show>

          </div>
        </div>
      </footer>
    </div>
  );
}

