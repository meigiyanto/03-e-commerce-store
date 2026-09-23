"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Package, Store, Menu, X, PanelLeftClose, PanelLeftOpen, } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Produk", href: "/admin/products", icon: Package },
  { label: "Lihat Toko", href: "/", icon: Store },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen((value) => !value)}
          className="rounded-lg p-2 hover:bg-gray-100"
          aria-label="Buka menu admin"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <h1 className="font-bold">Admin Panel</h1>
        <UserButton />
      </header>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Tutup menu"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 border-r bg-white transition-all duration-300",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-20" : "w-64",
        ].join(" ")}
      >
        <div
          className={[
            "flex h-16 items-center border-b",
            collapsed ? "justify-center px-2" : "justify-between px-5",
          ].join(" ")}
        >
          {!collapsed && (
            <div>
              <h1 className="text-lg font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-500">NexaShop</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 md:flex"
            aria-label={collapsed ? "Buka sidebar" : "Lipat sidebar"}
          >
            {collapsed ? (
              <PanelLeftOpen size={20} />
            ) : (
              <PanelLeftClose size={20} />
            )}
          </button>
        </div>

        <nav className="space-y-1 p-3">
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
                title={collapsed ? item.label : undefined}
                className={[
                  "flex items-center rounded-lg text-sm font-medium transition",
                  collapsed
                    ? "justify-center px-3 py-3"
                    : "gap-3 px-4 py-3",
                  isActive
                    ? "bg-black text-white"
                    : "text-gray-700 hover:bg-gray-100",
                ].join(" ")}
              >
                <Icon size={19} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t p-3">
          <div
            className={[
              "flex items-center",
              collapsed ? "justify-center" : "gap-3 px-1",
            ].join(" ")}
          >
            <UserButton />
            {!collapsed && (
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className={collapsed ? "md:pl-20" : "md:pl-64"}>
        <main className="min-h-screen p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
