import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  Package,
  Truck,
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

const steps = [
  {
    status: "PROCESSING",
    title: "Pesanan Diproses",
    description: "Pesanan sedang dipersiapkan.",
    icon: Clock,
  },
  {
    status: "SHIPPED",
    title: "Pesanan Dikirim",
    description: "Pesanan sedang dalam perjalanan.",
    icon: Truck,
  },
  {
    status: "DELIVERED",
    title: "Pesanan Diterima",
    description: "Pesanan telah sampai.",
    icon: Check,
  },
];

function statusIndex(status: string) {
  if (status === "SHIPPED") return 1;
  if (status === "DELIVERED") return 2;
  return 0;
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    return (
      <main className="min-h-[70vh] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">
          Silakan login terlebih dahulu
        </h1>

        <Link
          href="/account/sign-in"
          className="mt-5 inline-flex rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white"
        >
          Login
        </Link>
      </main>
    );
  }

  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const currentStep = statusIndex(order.orderStatus);

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-purple-700"
        >
          <ArrowLeft size={16} />
          Kembali ke Pesanan
        </Link>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-500">
              Nomor Pesanan
            </p>

            <h1 className="text-2xl font-bold text-gray-900">
              {order.orderNumber}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            {order.orderStatus === "PROCESSING"
              ? "Diproses"
              : order.orderStatus === "SHIPPED"
                ? "Dikirim"
                : order.orderStatus === "DELIVERED"
                  ? "Selesai"
                  : order.orderStatus}
          </span>
        </div>

        {/* Tracking */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Truck size={21} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                Tracking Pesanan
              </h2>

              <p className="text-sm text-gray-500">
                Status perjalanan pesanan Anda.
              </p>
            </div>
          </div>

          <div className="mt-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const completed = index <= currentStep;

              return (
                <div
                  key={step.status}
                  className="relative flex gap-4 pb-8 last:pb-0"
                >
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 h-full w-0.5 ${
                        index < currentStep
                          ? "bg-purple-600"
                          : "bg-gray-200"
                      }`}
                    />
                  )}

                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      completed
                        ? "bg-purple-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <h3
                      className={`font-semibold ${
                        completed
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Products */}
        <section className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="font-bold text-gray-900">
              Produk Pesanan
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 px-6 py-5"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.productName}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>

                <p className="shrink-0 font-semibold text-gray-900">
                  {formatPrice(item.subtotal)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Address + Summary */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin
                size={20}
                className="text-purple-600"
              />

              <h2 className="font-bold text-gray-900">
                Alamat Pengiriman
              </h2>
            </div>

            <div className="mt-4 text-sm leading-6 text-gray-600">
              <p className="font-semibold text-gray-900">
                {order.customerName}
              </p>

              <p>{order.customerPhone}</p>

              <p className="mt-2">
                {order.address}
                <br />
                {order.city}, {order.province}{" "}
                {order.postalCode}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Package
                size={20}
                className="text-purple-600"
              />

              <h2 className="font-bold text-gray-900">
                Ringkasan Pembayaran
              </h2>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <SummaryRow
                label="Subtotal"
                value={formatPrice(order.subtotal)}
              />

              <SummaryRow
                label="Pengiriman"
                value={formatPrice(order.shippingCost)}
              />

              <SummaryRow
                label="Diskon"
                value={`- ${formatPrice(order.discount)}`}
              />

              <SummaryRow
                label="Pajak"
                value={formatPrice(order.tax)}
              />

              <div className="border-t pt-4">
                <SummaryRow
                  label="Total"
                  value={formatPrice(order.total)}
                  bold
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          bold
            ? "font-bold text-gray-900"
            : "text-gray-500"
        }
      >
        {label}
      </span>

      <span
        className={
          bold
            ? "font-bold text-purple-700"
            : "font-medium text-gray-900"
        }
      >
        {value}
      </span>
    </div>
  );
}