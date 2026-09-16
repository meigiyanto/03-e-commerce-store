"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Package,
  Store,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Produk",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Lihat Toko",
    href: "/",
    icon: Store,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <h1 className="font-bold">Admin Panel</h1>

        <UserButton />
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r bg-white transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b px-6">
          <div>
            <h1 className="text-lg font-bold">Admin Panel</h1>
            <p className="text-xs text-gray-500">E-Commerce Store</p>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t p-4">
          <div className="flex items-center gap-3">
            <UserButton />
            <div className="min-w-0">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="md:pl-64">
        <main className="min-h-screen p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}