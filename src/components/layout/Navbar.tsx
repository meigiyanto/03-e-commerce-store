"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Headphones,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

const navigationLinks = [
  {
    id: "home",
    label: "Beranda",
    href: "/",
  },
  {
    id: "products",
    label: "Produk",
    href: "/products",
  },
  {
    id: "categories",
    label: "Kategori",
    href: "/categories",
  },
  {
    id: "promo",
    label: "Promo",
    href: "/promo",
  },
  {
    id: "about",
    label: "Tentang Kami",
    href: "/about",
  },
];



const departments = [
  "Elektronik",
  "Komputer & Laptop",
  "Smartphone",
  "Fashion",
  "Rumah & Dapur",
  "Olahraga",
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [isDepartmentOpen, setIsDepartmentOpen] =
    useState(false);

  const items = useCartStore(
    (state) => state.items
  );

  const wishlistItems = useWishlistStore(
    (state) => state.items
  );

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ================= TOP BAR ================= */}
      <div className="hidden border-b bg-gray-900 text-gray-300 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs md:px-8">
          <p>
            Selamat datang di NexaShop — Belanja mudah,
            aman, dan terpercaya.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/products"
              className="transition hover:text-white"
            >
              Promo Hari Ini
            </Link>

            <Link
              href="/contact"
              className="flex items-center gap-2 transition hover:text-white"
            >
              <Headphones size={14} />
              Bantuan
            </Link>

            <Link
              href="/profile"
              className="transition hover:text-white"
            >
              Akun Saya
            </Link>
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8 lg:gap-8">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() =>
              setIsMobileMenuOpen(
                !isMobileMenuOpen
              )
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 lg:hidden"
            aria-label="Buka menu"
          >
            {isMobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 text-2xl font-bold tracking-tight text-blue-600 sm:text-3xl"
          >
            Nexa
            <span className="text-gray-900">
              Shop
            </span>
          </Link>

          {/* Search Desktop */}
          <div className="hidden flex-1 lg:block">
            <form className="flex h-12 overflow-hidden rounded-lg border-2 border-blue-600 bg-white">
              <div className="hidden items-center border-r px-4 text-sm text-gray-500 xl:flex">
                <span>Semua Kategori</span>

                <ChevronDown
                  size={16}
                  className="ml-2"
                />
              </div>

              <input
                type="search"
                placeholder="Cari produk yang Anda butuhkan..."
                className="min-w-0 flex-1 px-4 text-sm text-gray-700 outline-none"
                aria-label="Cari produk"
              />

              <button
                type="submit"
                className="flex w-14 items-center justify-center bg-blue-600 text-white transition hover:bg-blue-700"
                aria-label="Cari"
              >
                <Search size={21} />
              </button>
            </form>
          </div>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Account */}
            <Link
              href="/profile"
              className="hidden items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-50 sm:flex"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                <User size={20} />
              </div>

              <div className="hidden xl:block">
                <p className="text-xs text-gray-500">
                  Selamat datang
                </p>

                <p className="text-sm font-semibold text-gray-900">
                  Akun Saya
                </p>
              </div>
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
              aria-label="Wishlist"
            >
              <Heart size={22} />

              {wishlistItems.length > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100"
              aria-label="Keranjang"
            >
              <ShoppingCart size={23} />

              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="border-t px-4 py-3 lg:hidden">
          <form className="flex h-11 overflow-hidden rounded-lg border border-gray-300 bg-white">
            <input
              type="search"
              placeholder="Cari produk..."
              className="min-w-0 flex-1 px-4 text-sm outline-none"
              aria-label="Cari produk"
            />

            <button
              type="submit"
              className="flex w-12 items-center justify-center bg-blue-600 text-white"
              aria-label="Cari"
            >
              <Search size={20} />
            </button>
          </form>
        </div>
      </div>

      {/* ================= CATEGORY NAVIGATION ================= */}
      <div className="hidden border-b bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center px-4 md:px-8">
          {/* Shop by Department */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsDepartmentOpen(
                  !isDepartmentOpen
                )
              }
              className="flex h-14 min-w-60 items-center gap-3 bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Menu size={20} />

              <span>
                SHOP BY DEPARTMENT
              </span>

              <ChevronDown
                size={17}
                className={`ml-auto transition ${
                  isDepartmentOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* Department Dropdown */}
            {isDepartmentOpen && (
              <div className="absolute left-0 top-full z-50 w-72 border border-gray-200 bg-white py-2 shadow-xl">
                {departments.map(
                  (department) => (
                    <Link
                      key={department}
                      href="/products"
                      onClick={() =>
                        setIsDepartmentOpen(
                          false
                        )
                      }
                      className="flex items-center justify-between px-5 py-3 text-sm text-gray-700 transition hover:bg-gray-50 hover:text-blue-600"
                    >
                      {department}

                      <ChevronDown
                        size={16}
                        className="-rotate-90"
                      />
                    </Link>
                  )
                )}

                <div className="mt-2 border-t pt-2">
                  <Link
                    href="/categories"
                    onClick={() =>
                      setIsDepartmentOpen(
                        false
                      )
                    }
                    className="block px-5 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Lihat Semua Kategori
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="ml-6 flex h-14 items-center gap-7">
            {navigationLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Promo */}
          <Link
            href="/products"
            className="ml-auto text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            🔥 Penawaran Spesial
          </Link>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isMobileMenuOpen && (
        <div className="border-b bg-white lg:hidden">
          <div className="max-h-[calc(100vh-150px)] overflow-y-auto px-4 py-5">
            {/* Mobile Account */}
            <Link
              href="/profile"
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
              className="mb-5 flex items-center gap-3 rounded-xl bg-gray-50 p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <User size={21} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Selamat datang
                </p>

                <p className="font-semibold text-gray-900">
                  Masuk ke Akun
                </p>
              </div>
            </Link>

            {/* Main Navigation */}
            <nav className="flex flex-col">
              {navigationLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className="border-b py-4 text-sm font-medium text-gray-800"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Departments */}
            <div className="mt-6">
              <h3 className="mb-3 text-xs font-bold tracking-wider text-gray-400">
                SHOP BY DEPARTMENT
              </h3>

              <div className="grid grid-cols-2 gap-2">
                {departments.map(
                  (department) => (
                    <Link
                      key={department}
                      href="/products"
                      onClick={() =>
                        setIsMobileMenuOpen(
                          false
                        )
                      }
                      className="rounded-lg bg-gray-50 px-3 py-3 text-xs font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      {department}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Mobile Promo */}
            <Link
              href="/products"
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
              className="mt-6 block rounded-lg bg-orange-50 px-4 py-4 text-sm font-semibold text-orange-600"
            >
              🔥 Lihat Penawaran Spesial
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
