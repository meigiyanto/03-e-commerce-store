"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Package,
  ShoppingBag,
} from "lucide-react";

import { useCheckoutStore } from "@/stores/checkout-store";

const formatPrice = (price: number) =>
  `Rp ${price.toLocaleString("id-ID")}`;

export default function CheckoutSuccessPage() {
  const { lastOrder } =
    useCheckoutStore();

  if (!lastOrder) {
    return (
      <main className="min-h-[70vh] bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <Package
                size={38}
                className="text-gray-500"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Pesanan Tidak Ditemukan
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Tidak ada informasi pesanan terakhir
              pada sesi ini.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Kembali Belanja
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="px-6 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
                <Check size={28} />
              </div>
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-green-600">
              Pesanan Berhasil
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Terima Kasih!
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
              Pesanan Anda berhasil dibuat dan sedang
              diproses oleh toko.
            </p>
          </div>

          <div className="border-y border-gray-100 bg-gray-50 px-6 py-6 sm:px-10">
            <div className="grid gap-5 sm:grid-cols-2">
              <Info
                label="Nomor Pesanan"
                value={
                  lastOrder.orderNumber
                }
              />

              <Info
                label="Total Pembayaran"
                value={formatPrice(
                  lastOrder.total
                )}
              />

              <Info
                label="Metode Pembayaran"
                value={formatPaymentMethod(
                  lastOrder.paymentMethod
                )}
              />

              <Info
                label="Status Pembayaran"
                value="Berhasil"
              />
            </div>
          </div>

          <div className="px-6 py-7 sm:px-10">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                <ClipboardCheck
                  size={21}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900">
                  Pesanan sedang diproses
                </h2>

                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Simpan nomor pesanan Anda untuk
                  referensi. Pada Phase 3 kita dapat
                  menghubungkannya dengan halaman
                  riwayat pesanan dan tracking.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <ShoppingBag size={17} />
                Lanjut Belanja
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Kembali ke Beranda
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function formatPaymentMethod(
  method: string
) {
  switch (method) {
    case "bank_transfer":
      return "Transfer Bank";

    case "e_wallet":
      return "E-Wallet";

    case "cod":
      return "COD";

    default:
      return method;
  }
}