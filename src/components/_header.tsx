"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="border-b border-slate-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-slate-950"
        >
          Northstar
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link
            href="/"
            className="transition hover:text-cyan-600"
          >
            Home
          </Link>

          <Link
            href="/products"
            className="transition hover:text-cyan-600"
          >
            Products
          </Link>

          <Link
            href="/cart"
            className="transition hover:text-cyan-600"
          >
            Cart
          </Link>

          {/* Admin hanya untuk ADMIN */}
          {isAdmin && (
            <Link
              href="/admin"
              className="transition hover:text-cyan-600"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-slate-100" />
          ) : !isLoggedIn ? (
            <Link
              href="/login"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              Login
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}