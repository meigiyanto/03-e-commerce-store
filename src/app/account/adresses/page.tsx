import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Plus,
} from "lucide-react";

export default function AccountAddressesPage() {
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

        <div className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-gray-100 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <MapPin size={21} />
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Alamat Saya
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  Kelola alamat pengiriman Anda.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500"
            >
              <Plus size={17} />
              Tambah Alamat
            </button>
          </div>

          <div className="px-6 py-14 text-center">
            <MapPin
              size={32}
              className="mx-auto text-gray-300"
            />

            <h2 className="mt-4 font-semibold text-gray-900">
              Belum ada alamat
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Fitur pengelolaan alamat akan diaktifkan
              pada Phase 3.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}