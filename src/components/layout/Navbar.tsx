"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useProductStore } from "@/stores/product-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { Product } from "@/types/product";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const products = useProductStore((state) => state.products);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const cartItemCount = cartItems.reduce((total, item) => total + (item.quantity ?? 0), 0);
  const wishlistItemCount = wishlistItems.length;

  const autocompleteProducts = useMemo<Product[]>(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return products
      .filter((product) => {
        const name = product.name?.toLowerCase() ?? "";
        const category = product.category?.toLowerCase() ?? "";
        const description = product.description?.toLowerCase() ?? "";

        return name.includes(query) || category.includes(query) || description.includes(query);
      })
      .slice(0, 6);
  }, [products, searchQuery]);

  const submitSearch = (queryValue = searchQuery) => {
    const query = queryValue.trim();
    if (!query) {
      router.push("/products");
      setIsSearchOpen(false);
      return;
    }
    router.push(`/products?search=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitSearch();
  };

  const handleAutocompleteClick = (productId: string) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    router.push(`/products/${productId}`);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsSearchOpen(false);
      return;
    }

    if (event.key === "Enter" && autocompleteProducts.length > 0 && autocompleteProducts[0]?.id) {
      event.preventDefault();
      handleAutocompleteClick(autocompleteProducts[0].id);
    }
  };

  const isActiveLink = (href: string): boolean => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // ... sisa JSX render disesuaikan dengan tipe di atas
  return (
    // Render JSX Navbar...
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* isi komponen header */}
    </header>
  );
}