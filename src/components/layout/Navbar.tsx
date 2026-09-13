"use client";

import Link from "next/link";
import { ShoppingCart, Search, Menu, User } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b bg-white">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600"
            >
              NexaShop
            </Link>
        
            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-8 md:flex">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Beranda
              </Link>
        
              <Link
                href="/products"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Produk
              </Link>
        
              <Link
                href="/categories"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Kategori
              </Link>
        
              <Link
                href="/about"
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Tentang
              </Link>
            </nav>
        
            {/* Right Menu */}
            <div className="flex items-center gap-4">
      <button
        className="hidden rounded-lg p-2 hover:bg-gray-100 md:block"
        aria-label="Cari"
      >
        <Search size={20} />
      </button>

      <Link
        href="/profile"
        className="hidden rounded-lg p-2 hover:bg-gray-100 md:block"
      >
        <User size={20} />
      </Link>

      <Link
        href="/cart"
        className="relative rounded-lg p-2 hover:bg-gray-100"
      >
        <ShoppingCart size={20} />

        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
          0
        </span>
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        <Menu size={22} />
      </button>
    </div>
          </div>
            {/* Mobile Menu */}
            {isOpen && (
                <div className="border-t bg-white px-4 py-4 md:hidden">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Beranda
                </Link>
        
                <Link
                  href="/products"
                  className="text-sm font-medium text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Produk
                </Link>
        
                <Link
                  href="/categories"
                  className="text-sm font-medium text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Kategori
                </Link>
        
                <Link
                  href="/about"
                  className="text-sm font-medium text-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  Tentang
                </Link>
              </nav>
            </div>
            )}
        </header>
    )
}
