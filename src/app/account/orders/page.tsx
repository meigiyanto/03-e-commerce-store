import Link from "next/link";
import {
  ArrowLeft,
  Package,
  ShoppingBag,
} from "lucide-react";

export default function AccountOrdersPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Kembali ke Akun
        </Link>

        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <ShoppingBag size={21} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Pesanan Saya
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Riwayat pembelian dan status pesanan Anda.
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Package
                size={28}
                className="text-gray-400"
              />
            </div>

            <h2 className="mt-5 font-semibold text-gray-900">
              Belum ada pesanan
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Setelah Anda melakukan checkout, pesanan akan
              muncul di halaman ini.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Mulai Belanja
              <ShoppingBag size={17} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}