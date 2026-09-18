import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  ShoppingBag,
} from "lucide-react";

import prisma from "@/lib/prisma";

const formatPrice = (price: number) =>
  `Rp ${price.toLocaleString("id-ID")}`;

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

function getStatus(status: string) {
  switch (status) {
    case "PROCESSING":
      return {
        label: "Diproses",
        className: "bg-blue-100 text-blue-700",
      };

    case "SHIPPED":
      return {
        label: "Dikirim",
        className: "bg-purple-100 text-purple-700",
      };

    case "DELIVERED":
      return {
        label: "Selesai",
        className: "bg-green-100 text-green-700",
      };

    case "CANCELLED":
      return {
        label: "Dibatalkan",
        className: "bg-red-100 text-red-700",
      };

    default:
      return {
        label: status,
        className: "bg-gray-100 text-gray-700",
      };
  }
}

export default async function AccountOrdersPage() {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-[70vh] bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Silakan login terlebih dahulu
          </h1>

          <Link
            href="/account/sign-in?redirect_url=/account/orders"
            className="mt-6 inline-flex rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Kembali ke Akun
        </Link>

        <div className="mt-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Pesanan Saya
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Riwayat pembelian dan status pesanan Anda.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-50 text-purple-600">
              <ShoppingBag size={28} />
            </div>

            <h2 className="mt-5 font-semibold text-gray-900">
              Belum ada pesanan
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Pesanan yang Anda buat akan muncul di sini.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-800"
            >
              Mulai Belanja
              <ShoppingBag size={17} />
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {orders.map((order) => {
              const status = getStatus(order.orderStatus);

              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-purple-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                        <Package size={21} />
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                          Nomor Pesanan
                        </p>

                        <h2 className="mt-1 font-bold text-gray-900">
                          {order.orderNumber}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mt-5 border-t border-gray-100 pt-4">
                    <p className="text-sm text-gray-500">
                      {order.items.length} produk
                    </p>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Total
                      </span>

                      <span className="font-bold text-purple-700">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-1 text-sm font-semibold text-purple-700">
                    Lihat Detail
                    <ArrowRight size={16} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}