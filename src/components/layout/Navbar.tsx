"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Heart, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useProductStore } from "@/stores/product-store";
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
  {
    id: "electronics",
    label: "Elektronik",
    href: "/products?category=Elektronik",
  },
  {
    id: "computer-laptop",
    label: "Komputer & Laptop",
    href: "/products?category=Komputer%20%26%20Laptop",
  },
  {
    id: "smartphone",
    label: "Smartphone",
    href: "/products?category=Smartphone",
  },
  {
    id: "fashion",
    label: "Fashion",
    href: "/products?category=Fashion",
  },
  {
    id: "home-kitchen",
    label: "Rumah & Dapur",
    href: "/products?category=Rumah%20%26%20Dapur",
  },
  {
    id: "sports",
    label: "Olahraga",
    href: "/products?category=Olahraga",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDepartmentOpen, setIsDepartmentOpen ] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const products = useProductStore((state) => state.products);
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /*
   * ========================================
   * CART / WISHLIST COUNT
   * ========================================
   */
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity,0);
  const wishlistItemCount = wishlistItems.length;

  /*
   * ========================================
   * SEARCH AUTOCOMPLETE
   * ========================================
   */
  const autocompleteProducts = useMemo(() => {
    const query = searchQuery
      .trim()
      .toLowerCase();

    if (!query) {
      return [];
    }

    return products
      .filter((product) => {
        const name = product.name?.toLowerCase() ?? "";
        const category = product.category?.toLowerCase() ?? "";
        const description = product.description?.toLowerCase() ?? "";

        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        );
      })
      .slice(0, 6);
  }, [products, searchQuery]);

  /*
   * ========================================
   * SEARCH SUBMIT
   * ========================================
   */
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

  /*
   * ========================================
   * AUTOCOMPLETE ITEM
   * ========================================
   */
  const handleAutocompleteClick = (productId: string) => {
    setSearchQuery("");
    setIsSearchOpen(false);

    router.push(`/products/${productId}`);
  };

  /*
   * ========================================
   * KEYBOARD SEARCH
   * ========================================
   */
  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsSearchOpen(false);
      return;
    }

    if (
      event.key === "Enter" &&
      autocompleteProducts.length > 0
    ) {
      event.preventDefault();

      handleAutocompleteClick(
        autocompleteProducts[0].id
      );
    }
  };

  /*
   * ========================================
   * CLICK OUTSIDE AUTOCOMPLETE
   * ========================================
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedDesktop = desktopSearchRef.current?.contains(target);
      const clickedMobile = mobileSearchRef.current?.contains(target);

      if (
        !clickedDesktop &&
        !clickedMobile
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * ========================================
   * ACTIVE NAVIGATION
   * ========================================
   */
  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* ========================================
          TOP BAR
      ======================================== */}
      <div className="hidden border-b border-gray-100 bg-gray-50 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-8">
          <p className="text-xs text-gray-500">
            Selamat datang di NexaShop — Belanja
            mudah dan aman.
          </p>

          <div className="flex items-center gap-5">
            <Link
              href="/about"
              className="text-xs text-gray-500 transition hover:text-blue-600"
            >
              Bantuan
            </Link>

            <Link
              href="/about"
              className="text-xs text-gray-500 transition hover:text-blue-600"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================
          MAIN HEADER
      ======================================== */}
      <div className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 md:px-8">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 lg:hidden"
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
            className="shrink-0"
            onClick={() =>
              setIsMobileMenuOpen(false)
            }
          >
            <span className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Nexa
              <span className="text-blue-600">
                Shop
              </span>
            </span>
          </Link>

          {/* ========================================
              DESKTOP SEARCH
          ======================================== */}
          <div
            ref={desktopSearchRef}
            className="relative hidden flex-1 md:block"
          >
            <form
              onSubmit={handleSearch}
            >
              <div className="relative mx-auto max-w-2xl">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="search"
                  value={searchQuery}
                  onFocus={() =>
                    setIsSearchOpen(true)
                  }
                  onChange={(event) => {
                    setSearchQuery(
                      event.target.value
                    );
                    setIsSearchOpen(true);
                  }}
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Cari produk yang Anda butuhkan..."
                  autoComplete="off"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-28 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                  aria-label="Cari produk"
                  aria-autocomplete="list"
                />

                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Cari
                </button>

                {/* ========================================
                    DESKTOP AUTOCOMPLETE
                ======================================== */}

                {isSearchOpen &&
                  searchQuery.trim() &&
                  autocompleteProducts.length >
                    0 && (
                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[60] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                      <div className="border-b border-gray-100 px-4 py-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                          Produk ditemukan
                        </p>
                      </div>

                      <div className="max-h-[420px] overflow-y-auto py-2">
                        {autocompleteProducts.map(
                          (product) => (
                            <button
                              key={product.id}
                              type="button"
                              onMouseDown={(
                                event
                              ) =>
                                event.preventDefault()
                              }
                              onClick={() =>
                                handleAutocompleteClick(
                                  product.id
                                )
                              }
                              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-blue-50"
                            >
                              {/* Product Image */}
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {product.image ? (
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center">
                                    <Search
                                      size={18}
                                      className="text-gray-400"
                                    />
                                  </div>
                                )}
                              </div>

                              {/* Product Info */}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-800">
                                  {product.name}
                                </p>

                                <p className="mt-1 truncate text-xs text-gray-500">
                                  {
                                    product.category
                                  }
                                </p>

                                <p className="mt-1 text-sm font-bold text-blue-600">
                                  Rp{" "}
                                  {product.price.toLocaleString(
                                    "id-ID"
                                  )}
                                </p>
                              </div>

                              <ChevronRight
                                size={18}
                                className="shrink-0 text-gray-400"
                              />
                            </button>
                          )
                        )}
                      </div>

                      {/* See all results */}
                      <button
                        type="button"
                        onMouseDown={(
                          event
                        ) =>
                          event.preventDefault()
                        }
                        onClick={() =>
                          submitSearch()
                        }
                        className="flex w-full items-center justify-center border-t border-gray-100 px-4 py-3 text-sm font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Lihat semua hasil untuk &quot;{searchQuery.trim()}&quot;
                      </button>
                    </div>
                  )}
              </div>
            </form>
          </div>

          {/* ========================================
              DESKTOP / MOBILE ACTIONS
          ======================================== */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            {/* Mobile Search */}
            <button
              type="button"
              onClick={() => {
                setIsSearchOpen(
                  !isSearchOpen
                );
                setIsMobileMenuOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 md:hidden"
              aria-label="Cari produk"
            >
              {isSearchOpen ? (
                <X size={21} />
              ) : (
                <Search size={21} />
              )}
            </button>

            {/* Account Desktop */}
            <Link
              href="/account"
              className="hidden items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50 lg:flex"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User size={18} />
              </div>

              <div className="hidden xl:block">
                <p className="text-xs text-gray-400">
                  Halo,
                </p>

                <p className="text-sm font-semibold text-gray-800">
                  Akun Saya
                </p>
              </div>
            </Link>

            {/* Account Mobile */}
            <Link
              href="/account"
              className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 lg:hidden"
              aria-label="Akun"
            >
              <User size={21} />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-red-50 hover:text-red-500"
              aria-label="Wishlist"
            >
              <Heart size={21} />
              {isMounted && wishlistItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {wishlistItemCount > 99
                    ? "99+"
                    : wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Keranjang"
            >
              <ShoppingCart size={21} />

              {isMounted && cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                  {cartItemCount > 99
                    ? "99+"
                    : cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ========================================
            MOBILE SEARCH
        ======================================== */}
        {isSearchOpen && (
          <div
            ref={mobileSearchRef}
            className="relative border-t border-gray-100 px-4 py-3 md:hidden"
          >
            <form
              onSubmit={handleSearch}
              className="relative"
            >
              <Search
                size={19}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={searchQuery}
                onFocus={() =>
                  setIsSearchOpen(true)
                }
                onChange={(event) => {
                  setSearchQuery(
                    event.target.value
                  );
                  setIsSearchOpen(true);
                }}
                onKeyDown={
                  handleSearchKeyDown
                }
                placeholder="Cari produk..."
                autoComplete="off"
                autoFocus
                className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
                aria-label="Cari produk"
              />

              {/* Mobile Autocomplete */}
              {searchQuery.trim() &&
                autocompleteProducts.length >
                  0 && (
                  <div className="absolute left-4 right-4 top-[calc(100%+4px)] z-[60] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                    <div className="max-h-[360px] overflow-y-auto py-2">
                      {autocompleteProducts.map(
                        (product) => (
                          <button
                            key={product.id}
                            type="button"
                            onMouseDown={(event) =>
                              event.preventDefault()
                            }
                            onClick={() =>
                              handleAutocompleteClick(product.id)
                            }
                            className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-blue-50"
                          >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              {product.image ? (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Search
                                    size={16}
                                    className="text-gray-400"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {product.name}
                              </p>

                              <p className="text-xs text-gray-500">
                                {
                                  product.category
                                }
                              </p>

                              <p className="text-sm font-bold text-blue-600">
                                Rp{" "}
                                {product.price.toLocaleString(
                                  "id-ID"
                                )}
                              </p>
                            </div>

                            <ChevronRight
                              size={16}
                              className="shrink-0 text-gray-400"
                            />
                          </button>
                        )
                      )}

                      <button
                        type="button"
                        onMouseDown={(
                          event
                        ) =>
                          event.preventDefault()
                        }
                        onClick={() =>
                          submitSearch()
                        }
                        className="w-full border-t border-gray-100 px-4 py-3 text-sm font-semibold text-blue-600"
                      >
                        Lihat semua hasil
                      </button>
                    </div>
                  </div>
                )}
            </form>
          </div>
        )}
      </div>

      {/* ========================================
          CATEGORY NAVIGATION
      ======================================== */}
      <div className="hidden border-b border-gray-100 bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-7 px-8">
          {/* Department Dropdown */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsDepartmentOpen(
                  !isDepartmentOpen
                )
              }
              className="flex items-center gap-2 border-x border-gray-100 px-5 py-4 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
            >
              <Menu size={18} />

              Semua Kategori

              <ChevronDown
                size={16}
                className={`transition ${
                  isDepartmentOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {isDepartmentOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-72 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl">
                {departments.map(
                  (department) => (
                    <Link
                      key={department.id}
                      href={department.href}
                      onClick={() =>
                        setIsDepartmentOpen(
                          false
                        )
                      }
                      className="flex items-center justify-between px-5 py-3 text-sm text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      {department.label}

                      <ChevronRight size={16} />
                    </Link>
                  )
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}

          <nav className="flex items-center gap-6">
            {navigationLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={`py-4 text-sm font-medium transition ${
                  isActiveLink(link.href)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Promotion */}

          <Link
            href="/promo"
            className="ml-auto py-4 text-sm font-semibold text-red-500 transition hover:text-red-600"
          >
            🔥 Promo Spesial Hari Ini
          </Link>
        </div>
      </div>

      {/* ========================================
          MOBILE MENU
      ======================================== */}
      {isMobileMenuOpen && (
        <div className="border-b border-gray-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5">
            {/* Main Navigation */}
            <nav className="flex flex-col">
              {navigationLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() =>
                    setIsMobileMenuOpen(false)
                  }
                  className={`border-b py-4 text-sm font-medium transition ${
                    isActiveLink(link.href)
                      ? "text-blue-600"
                      : "text-gray-800 hover:text-blue-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Categories */}
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                Kategori
              </p>

              <div className="grid grid-cols-2 gap-2">
                {departments.map(
                  (department) => (
                    <Link
                      key={department.id}
                      href={department.href}
                      onClick={() =>
                        setIsMobileMenuOpen(
                          false
                        )
                      }
                      className="rounded-lg bg-gray-50 px-3 py-3 text-xs font-medium text-gray-700 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      {department.label}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Mobile Promotion */}
            <Link
              href="/promo"
              onClick={() =>
                setIsMobileMenuOpen(false)
              }
              className="mt-6 flex items-center justify-center rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-100"
            >
              🔥 Promo Spesial Hari Ini
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}