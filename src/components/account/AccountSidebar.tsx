"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, Home, MapPin, Menu, Package, Settings, ShoppingBag, Star, UserRound, X } from "lucide-react";
import SignOutButton from "@/components/auth/SignOutButton";

type AccountSidebarProps = {
  fullName: string;
  email: string;
  imageUrl?: string | null;
  role: string;
};

export default function AccountSidebar({ fullName, email, imageUrl, role }: AccountSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-700 text-sm font-bold text-white">
            N
          </div>

          <div>
            <p className="text-sm font-bold text-gray-900">
              Akun Saya
            </p>

            <p className="text-xs text-gray-500">
              NexaShop
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-xl border border-gray-200 p-2.5 text-gray-700 hover:bg-gray-50"
          aria-label="Buka menu akun"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={closeMobile}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-100
          bg-white shadow-xl transition-all duration-300
          lg:sticky lg:top-0 lg:z-30 lg:h-[calc(100dvh-0px)] lg:shadow-none
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${collapsed ? "lg:w-20" : "lg:w-64"}
          w-72
        `}
      >
        {/* Header */}
        <div
          className={`flex min-h-20 items-center border-b border-gray-100 ${
            collapsed
              ? "justify-center px-3"
              : "justify-between px-5"
          }`}
        >
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-3">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={fullName}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <UserRound size={19} />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {fullName}
                </p>

                <p className="truncate text-xs text-gray-500">
                  {email}
                </p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={fullName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <UserRound size={19} />
              )}
            </div>
          )}

          {/* Mobile close */}
          <button
            type="button"
            onClick={closeMobile}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Tutup menu akun"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            <AccountNavItem
              href="/account"
              icon={<Home size={18} />}
              label="Overview"
              collapsed={collapsed}
              onClick={closeMobile}
              active
            />

            <AccountNavItem
              href="/account/orders"
              icon={<ShoppingBag size={18} />}
              label="Pesanan"
              collapsed={collapsed}
              onClick={closeMobile}
            />

            <AccountNavItem
              href="/account/addresses"
              icon={<MapPin size={18} />}
              label="Alamat"
              collapsed={collapsed}
              onClick={closeMobile}
            />

            <AccountNavItem
              href="/account/reviews"
              icon={<Star size={18} />}
              label="Review"
              collapsed={collapsed}
              onClick={closeMobile}
            />

            <AccountNavItem
              href="/account/downloads"
              icon={<FileText size={18} />}
              label="Downloads"
              collapsed={collapsed}
              onClick={closeMobile}
            />

            <AccountNavItem
              href="/account/settings"
              icon={<Settings size={18} />}
              label="Pengaturan"
              collapsed={collapsed}
              onClick={closeMobile}
            />
          </div>

          {role === "admin" && (
            <>
              <div className="my-4 border-t border-gray-100" />

              <AccountNavItem
                href="/admin"
                icon={<Package size={18} />}
                label="Admin Dashboard"
                collapsed={collapsed}
                onClick={closeMobile}
              />
            </>
          )}

          <div className="my-4 border-t border-gray-100" />

          <div
            className={
              collapsed
                ? "[&>button]:justify-center [&>button]:px-2"
                : ""
            }
          >
            <SignOutButton />
          </div>
        </nav>

        {/* Desktop collapse button */}
        <div className="hidden border-t border-gray-100 p-3 lg:block">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className={`
              flex w-full items-center rounded-xl py-2.5 text-sm
              font-medium text-gray-500 transition hover:bg-gray-50
              hover:text-gray-900
              ${collapsed ? "justify-center" : "justify-between px-3"}
            `}
            aria-label={
              collapsed
                ? "Buka sidebar"
                : "Ciutkan sidebar"
            }
          >
            {!collapsed && (
              <span className="flex items-center gap-3">
                <ChevronLeft size={18} />
                Ciutkan Menu
              </span>
            )}

            {collapsed && <ChevronRight size={18} />}
          </button>
        </div>
      </aside>
    </>
  );
}

function AccountNavItem({ href, icon, label, collapsed, active = false, onClick }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`
        flex items-center rounded-xl py-3 text-sm font-medium
        transition
        ${
          collapsed
            ? "justify-center px-2"
            : "gap-3 px-3"
        }
        ${
          active
            ? "bg-purple-50 text-purple-700"
            : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }
      `}
    >
      {icon}

      {!collapsed && (
        <span className="truncate">
          {label}
        </span>
      )}
    </Link>
  );
}