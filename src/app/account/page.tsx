import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  Home,
  MapPin,
  Package,
  Settings,
  ShoppingBag,
  Star,
  UserRound,
} from "lucide-react";

import SignOutButton from "@/components/auth/SignOutButton";

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-700 text-2xl font-bold text-white">
            N
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-purple-700">
            NexaShop Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
            Selamat Datang di NexaShop
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-gray-500">
            Masuk ke akun Anda untuk melihat pesanan, mengatur profil,
            alamat pengiriman, dan pengaturan akun.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/account/sign-in?redirect_url=/account"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-800"
            >
              Masuk ke Akun
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Lanjut Belanja
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.username ||
    "NexaShop User";

  const email =
    user.emailAddresses[0]?.emailAddress ?? "Email belum tersedia";

  const role =
    typeof user.publicMetadata?.role === "string"
      ? user.publicMetadata.role
      : "user";

  const memberSince = new Date(user.createdAt).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gray-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full border-b border-gray-100 bg-white lg:min-h-[calc(100dvh-4rem)] lg:w-64 lg:border-b-0 lg:border-r">
          <div className="p-4 sm:p-6 lg:sticky lg:top-20">
            <div className="mb-6 flex items-center gap-3">
              {user.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={fullName}
                  className="h-11 w-11 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                  <UserRound size={21} />
                </div>
              )}

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-gray-900">
                  {fullName}
                </p>

                <p className="truncate text-xs text-gray-500">{email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              <AccountNavItem
                href="/account"
                icon={<Home size={17} />}
                label="Overview"
                active
              />

              <AccountNavItem
                href="/account/orders"
                icon={<ShoppingBag size={17} />}
                label="Pesanan"
              />

              <AccountNavItem
                href="/account/addresses"
                icon={<MapPin size={17} />}
                label="Alamat"
              />

              <AccountNavItem
                href="/account/reviews"
                icon={<Star size={17} />}
                label="Review"
              />

              <AccountNavItem
                href="/account/downloads"
                icon={<FileText size={17} />}
                label="Downloads"
              />

              <AccountNavItem
                href="/account/settings"
                icon={<Settings size={17} />}
                label="Pengaturan"
              />

              {role === "admin" && (
                <>
                  <div className="my-3 border-t border-gray-100" />

                  <AccountNavItem
                    href="/admin"
                    icon={<Package size={17} />}
                    label="Admin Dashboard"
                  />
                </>
              )}

              <div className="my-3 border-t border-gray-100" />

              <SignOutButton />
            </nav>
          </div>
        </aside>

        {/* Main */}
        <section className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            {/* Welcome */}
            <section className="relative overflow-hidden rounded-2xl border border-purple-100 bg-purple-50 p-6 sm:p-8">
              <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-200/50 blur-3xl" />

              <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
                {user.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={fullName}
                    className="h-20 w-20 shrink-0 rounded-full border-4 border-white object-cover shadow-sm"
                  />
                ) : (
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-purple-100 text-purple-700 shadow-sm">
                    <UserRound size={36} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="text-sm font-semibold text-purple-700">
                    NexaShop Account
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Welcome back, {user.firstName || fullName}!
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                    Kelola profil, pesanan, alamat, dan pengaturan akun Anda
                    dari halaman ini.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-purple-700 shadow-sm">
                      {role === "admin" ? "Administrator" : "Customer"}
                    </span>

                    <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-500 shadow-sm">
                      Member sejak {memberSince}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Profile */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-semibold text-gray-900">
                  Informasi Profil
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Informasi dasar akun NexaShop Anda.
                </p>
              </div>

              <div className="grid md:grid-cols-[220px_1fr]">
                <div className="flex flex-col items-center justify-center border-b p-6 text-center md:border-b-0 md:border-r">
                  {user.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={fullName}
                      className="h-28 w-28 rounded-full border-4 border-purple-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                      <UserRound size={48} />
                    </div>
                  )}

                  <h3 className="mt-4 font-semibold text-gray-900">
                    {fullName}
                  </h3>

                  <p className="mt-1 max-w-full truncate text-sm text-gray-500">
                    {email}
                  </p>

                  <Link
                    href="/account/settings"
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Settings size={16} />
                    Edit Profil
                  </Link>
                </div>

                <div className="divide-y divide-gray-100">
                  <ProfileRow
                    icon={<UserRound size={19} />}
                    label="Nama Lengkap"
                    value={fullName}
                  />

                  <ProfileRow
                    icon={<FileText size={19} />}
                    label="Email"
                    value={email}
                  />

                  <ProfileRow
                    icon={<CalendarDays size={19} />}
                    label="Member Sejak"
                    value={memberSince}
                  />

                  <ProfileRow
                    icon={<Settings size={19} />}
                    label="Role"
                    value={role === "admin" ? "Administrator" : "Customer"}
                  />
                </div>
              </div>
            </section>

            {/* Menu */}
            <section>
              <h2 className="mb-4 text-lg font-bold text-gray-900">
                Menu Akun
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <QuickActionCard
                  href="/account/orders"
                  icon={<ShoppingBag size={22} />}
                  title="Pesanan Saya"
                  description="Lihat pesanan dan status pembelian Anda."
                />

                <QuickActionCard
                  href="/account/addresses"
                  icon={<MapPin size={22} />}
                  title="Alamat"
                  description="Kelola alamat pengiriman Anda."
                />

                <QuickActionCard
                  href="/account/reviews"
                  icon={<Star size={22} />}
                  title="Review"
                  description="Kelola review produk yang pernah dibeli."
                />

                <QuickActionCard
                  href="/account/settings"
                  icon={<Settings size={22} />}
                  title="Pengaturan"
                  description="Ubah informasi dan pengaturan akun."
                />

                <QuickActionCard
                  href="/products"
                  icon={<ShoppingBag size={22} />}
                  title="Belanja Lagi"
                  description="Temukan produk menarik di NexaShop."
                />

                {role === "admin" && (
                  <QuickActionCard
                    href="/admin"
                    icon={<Package size={22} />}
                    title="Admin Dashboard"
                    description="Kelola produk dan operasional toko."
                  />
                )}
              </div>
            </section>

            {/* Orders */}
            <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Pesanan Terbaru
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Lihat seluruh riwayat pembelian Anda.
                  </p>
                </div>

                <Link
                  href="/account/orders"
                  className="hidden items-center gap-1 text-sm font-medium text-purple-700 hover:underline sm:flex"
                >
                  Lihat Semua
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-700">
                  <ShoppingBag size={24} />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                  Belum ada tampilan pesanan terbaru
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Detail riwayat pesanan dapat dilihat melalui halaman Pesanan
                  Saya.
                </p>

                <Link
                  href="/account/orders"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-800"
                >
                  Lihat Pesanan
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function AccountNavItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
        active
          ? "bg-purple-50 text-purple-700"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function ProfileRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>

        <p className="mt-1 truncate text-sm font-semibold text-gray-900">
          {value}
        </p>
      </div>
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700 transition group-hover:bg-purple-700 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{description}</p>

      <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-purple-700">
        Buka
        <ArrowRight
          size={15}
          className="transition-transform group-hover:translate-x-1"
        />
      </div>
    </Link>
  );
}