import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Package,
  ShoppingBag,
} from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import prisma from "@/lib/prisma";

type SuccessPageProps = {
  searchParams: Promise<{
    orderId?: string;
  }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPaymentMethod(method: string) {
  switch (method) {
    case "bank_transfer":
      return "Transfer Bank";

    case "e_wallet":
      return "E-Wallet";

    case "cod":
      return "Cash on Delivery (COD)";

    default:
      return method;
  }
}

function formatPaymentStatus(status: string) {
  switch (status) {
    case "PAID":
      return "Sudah Dibayar";

    case "PENDING":
      return "Menunggu Pembayaran";

    case "FAILED":
      return "Pembayaran Gagal";

    case "CANCELLED":
      return "Dibatalkan";

    default:
      return status;
  }
}

function formatOrderStatus(status: string) {
  switch (status) {
    case "PROCESSING":
      return "Sedang Diproses";

    case "SHIPPED":
      return "Sedang Dikirim";

    case "DELIVERED":
      return "Telah Diterima";

    case "CANCELLED":
      return "Dibatalkan";

    case "PENDING":
      return "Menunggu";

    default:
      return status;
  }
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
      <p className="text-md font-medium">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

export default async function CheckoutSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { userId } = await auth();

  // User harus login untuk melihat detail pesanan
  if (!userId) {
    redirect("/account/sign-in");
  }

  const { orderId } = await searchParams;

  // Jika orderId tidak ada di URL
  if (!orderId) {
    return (
      <main className="min-h-[70vh] px-4 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border bg-background p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <ClipboardCheck className="h-8 w-8 text-red-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              Pesanan Tidak Ditemukan
            </h1>

            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Nomor pesanan tidak tersedia atau URL tidak valid.
            </p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
              >
                <ShoppingBag className="h-4 w-4" />
                Belanja Produk
              </Link>

              <Link
                href="/account"
                className="inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-3 text-sm font-medium transition hover:bg-muted"
              >
                Akun Saya
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Cari order berdasarkan:
  // 1. ID order dari URL
  // 2. userId dari Clerk
  //
  // Dengan cara ini user tidak bisa melihat order milik user lain
  // hanya dengan mengganti orderId di URL.
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: {
      items: true,
    },
  });

  // Order tidak ditemukan atau bukan milik user tersebut
  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-[70vh] bg-muted/30 px-4 py-10">
      <div className="mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Check className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight">
            Pembayaran Berhasil!
          </h1>

          <p className="mt-2 text-muted-foreground">
            Terima kasih. Pesanan kamu telah berhasil dibuat.
          </p>
        </div>

        {/* Order Number */}
        <div className="mt-8 rounded-2xl border bg-background p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Nomor Pesanan
              </p>

              <p className="mt-1 text-xl font-bold">
                {order.orderNumber}
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Order Information */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Payment */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Informasi Pembayaran
            </h2>

            <div className="mt-5 space-y-4">
              <Info
                label="Metode Pembayaran"
                value={formatPaymentMethod(order.paymentMethod)}
              />

              <Info
                label="Status Pembayaran"
                value={formatPaymentStatus(order.paymentStatus)}
              />

              <Info
                label="Status Pesanan"
                value={formatOrderStatus(order.orderStatus)}
              />

              <Info
                label="Total Pembayaran"
                value={formatCurrency(Number(order.total))}
              />
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <h2 className="text-lg font-bold">
              Informasi Pengiriman
            </h2>

            <div className="mt-5 space-y-4">
              <Info
                label="Nama"
                value={order.customerName}
              />

              <Info
                label="Email"
                value={order.customerEmail}
              />

              <Info
                label="Telepon"
                value={order.customerPhone}
              />

              <div>
                <p className="text-md font-semibold">
                  Alamat
                </p>

                <p className="mt-1 font-medium">
                  {order.address}
                  <br />
                  {order.city}, {order.province}
                  <br />
                  {order.postalCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6 rounded-2xl border bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold">
            Detail Pesanan
          </h2>

          <div className="mt-5 divide-y">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">
                    {item.productName}
                  </p>

                  <p className="mt-1 text-md text-muted-foreground">
                    {formatCurrency(Number(item.price))} ×{" "}
                    {item.quantity}
                  </p>
                </div>

                <p className="font-semibold">
                  {formatCurrency(Number(item.subtotal))}
                </p>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-5 border-t pt-5">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal
                </span>

                <span>
                  {formatCurrency(Number(order.subtotal))}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Ongkos Kirim
                </span>

                <span>
                  {formatCurrency(Number(order.shippingCost))}
                </span>
              </div>

              {Number(order.discount) > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Diskon
                  </span>

                  <span className="text-green-600">
                    -{formatCurrency(Number(order.discount))}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Pajak
                </span>

                <span>
                  {formatCurrency(Number(order.tax))}
                </span>
              </div>

              <div className="flex justify-between border-t pt-4 text-base font-bold">
                <span>Total</span>

                <span>
                  {formatCurrency(Number(order.total))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/80"
          >
            <ShoppingBag className="h-4 w-4" />
            Lanjut Belanja
          </Link>

          <Link
            href="/account/orders"
            className="inline-flex items-center justify-center gap-2 rounded-lg border bg-background px-6 py-3 text-sm font-medium transition hover:bg-muted"
          >
            Lihat Pesanan Saya
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}