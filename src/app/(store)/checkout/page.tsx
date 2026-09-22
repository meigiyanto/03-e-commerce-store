"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, CreditCard, MapPin, Package, ShieldCheck, Tag, Truck, Wallet } from "lucide-react";
import { FormEvent, useMemo,useState } from "react";
import { PaymentMethod, useCheckoutStore } from "@/stores/checkout-store";
import { calculateShipping, calculateTax } from "@/lib/coupons";
import { useCartStore } from "@/stores/cart-store";

const formatPrice = (price: number) => `Rp ${price.toLocaleString("id-ID")}`;
const paymentOptions: {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  {
    value: "bank_transfer",
    label: "Transfer Bank",
    description: "Simulasi transfer bank",
    icon: CreditCard,
  },
  {
    value: "e_wallet",
    label: "E-Wallet",
    description: "Simulasi pembayaran digital",
    icon: Wallet,
  },
  {
    value: "cod",
    label: "COD",
    description: "Bayar saat barang diterima",
    icon: Truck,
  },
];

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const { step, setStep, couponCode, couponDiscount, shippingDiscount, couponMessage, setCoupon, clearCoupon, shipping, setShipping, paymentMethod, setPaymentMethod, setLastOrder } = useCheckoutStore();
  const [ couponInput, setCouponInput ] = useState(couponCode);
  const [ couponLoading, setCouponLoading ] = useState(false);
  const [ couponError, setCouponError ] = useState("");
  const [ paymentLoading, setPaymentLoading ] = useState(false);
  const [ paymentError, setPaymentError ] = useState("");
  const subtotal = useMemo(() => items.reduce((total, item) => total + item.price * item.quantity, 0), [items]);
  const baseShipping = calculateShipping(subtotal);
  const shippingCost = Math.max(0, baseShipping - shippingDiscount);
  const taxableAmount = Math.max(0, subtotal - couponDiscount);
  const tax = calculateTax(taxableAmount);
  const total = Math.max(0, taxableAmount + shippingCost + tax);

  async function applyCoupon(event: FormEvent) {
    event.preventDefault();

    if (!couponInput.trim()) {
      setCouponError("Masukkan kode kupon.");
      return;
    }

    setCouponLoading(true);
    setCouponError("");

    try {
      const response = await fetch(
        "/api/coupons",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: couponInput,
            subtotal,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error( data.message ?? "Kupon tidak valid" );
      }

      setCoupon(
        data.coupon.code,
        data.discount,
        data.shippingDiscount,
        data.message
      );
    } catch (error) {
      setCouponError(error instanceof Error ? error.message : "Gagal menerapkan kupon");
    } finally {
      setCouponLoading(false);
    }
  }

  function removeCoupon() {
    clearCoupon();
    setCouponInput("");
    setCouponError("");
  }

  function submitShipping(event: FormEvent) {
    event.preventDefault();

    if (
      !shipping.name ||
      !shipping.email ||
      !shipping.phone ||
      !shipping.address ||
      !shipping.city ||
      !shipping.province ||
      !shipping.postalCode
    ) {
      return;
    }

    setStep(3);
  }

  async function submitPayment() {
    setPaymentLoading(true);
    setPaymentError("");

    try {
      const response = await fetch(
        "/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            })),
            shipping,
            couponCode: couponCode || undefined,
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "Gagal membuat pesanan");
      }

      console.log("ORDER CREATED");
      console.log("LAST ORDER", data.order);

      setLastOrder({
        id: data.order.id,
        orderNumber: data.order.orderNumber,
        total: data.order.total,
        paymentMethod: data.order.paymentMethod,
        createdAt: data.order.createdAt,
      });
      // router.push("/checkout/success");
      // setTimeout(() => {
      //   clearCart();
      // }, 100);
      window.location.href = "/checkout/success";
    } catch (error) {
      setPaymentError( error instanceof Error ? error.message : "Pembayaran gagal" );
    } finally {
      setPaymentLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-gray-50">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">
              <Package
                size={38}
                className="text-blue-600"
              />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              Keranjang Kosong
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Tambahkan produk sebelum melanjutkan checkout.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Kembali ke Produk
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600"
          >
            <ArrowLeft size={16} />
            Kembali ke Keranjang
          </Link>

          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Lengkapi data untuk menyelesaikan pesanan Anda.
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8 grid grid-cols-3 gap-2">
          {[
            {
              number: 1,
              label: "Pesanan",
            },
            {
              number: 2,
              label: "Pengiriman",
            },
            {
              number: 3,
              label: "Pembayaran",
            },
          ].map((item) => {
            const active = step === item.number;
            const completed = step > item.number;

            return (
              <div
                key={item.number}
                className="flex items-center gap-2"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    active || completed ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {completed ? (
                    <Check size={17} />
                  ) : (
                    item.number
                  )}
                </div>

                <span
                  className={`hidden text-sm font-medium sm:block ${
                    active ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section>
            {step === 1 && (
              <div className="space-y-5">
                {/* Cart */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
                    <h2 className="font-bold text-gray-900">
                      Produk Pesanan
                    </h2>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-4 p-5"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-xl object-cover"
                          />

                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-blue-600">
                              {item.category}
                            </p>

                            <h3 className="mt-1 font-semibold text-gray-900">
                              {item.name}
                            </h3>

                            <div className="mt-2 flex justify-between gap-3 text-sm">
                              <span className="text-gray-500">
                                {item.quantity} ×{" "}
                                {formatPrice( item.price )}
                              </span>

                              <span className="font-semibold text-gray-900">
                                {formatPrice( item.price * item.quantity )}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Coupon */}
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      <Tag
                        size={19}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        Kode Kupon
                      </h2>

                      <p className="text-xs text-gray-500">
                        Masukkan kode promo Anda.
                      </p>
                    </div>
                  </div>

                  {couponCode ? (
                    <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
                      <div>
                        <p className="text-sm font-bold text-green-700">
                          {couponCode}
                        </p>

                        <p className="mt-1 text-xs text-green-600">
                          {couponMessage}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={ removeCoupon }
                        className="text-xs font-semibold text-red-500 hover:text-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={ applyCoupon }
                      className="mt-5"
                    >
                      <div className="flex gap-2">
                        <input
                          value={ couponInput }
                          onChange={(event) => setCouponInput(event.target.value) }
                          placeholder="Contoh: HEMAT10"
                          className="h-11 min-w-0 flex-1 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                          type="submit"
                          disabled={ couponLoading }
                          className="rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                        >
                          {couponLoading ? "..." : "Pakai"}
                        </button>
                      </div>

                      {couponError && (
                        <p className="mt-2 text-xs font-medium text-red-500">
                          {couponError}
                        </p>
                      )}
                    </form>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Lanjut ke Pengiriman
                  <ArrowRight size={17} />
                </button>
              </div>
            )}

            {step === 2 && (
              <form
                onSubmit={ submitShipping }
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                    <MapPin
                      size={19}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Alamat Pengiriman
                    </h2>

                    <p className="text-xs text-gray-500">
                      Masukkan alamat tujuan pesanan.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Nama Lengkap"
                    value={shipping.name}
                    onChange={(value) =>
                      setShipping({
                        ...shipping,
                        name: value,
                      })
                    }
                    placeholder="Nama penerima"
                    required
                  />

                  <Field
                    label="Email"
                    type="email"
                    value={shipping.email}
                    onChange={(value) =>
                      setShipping({
                        ...shipping,
                        email: value,
                      })
                    }
                    placeholder="nama@email.com"
                    required
                  />

                  <Field
                    label="Nomor Telepon"
                    value={shipping.phone}
                    onChange={(value) =>
                      setShipping({
                        ...shipping,
                        phone: value,
                      })
                    }
                    placeholder="08xxxxxxxxxx"
                    required
                  />

                  <Field
                    label="Kode Pos"
                    value={
                      shipping.postalCode
                    }
                    onChange={(value) =>
                      setShipping({
                        ...shipping,
                        postalCode:
                          value,
                      })
                    }
                    placeholder="50100"
                    required
                  />

                  <Field
                    label="Provinsi"
                    value={
                      shipping.province
                    }
                    onChange={(value) =>
                      setShipping({
                        ...shipping,
                        province:
                          value,
                      })
                    }
                    placeholder="Jawa Tengah"
                    required
                  />

                  <Field
                    label="Kota"
                    value={shipping.city}
                    onChange={(value) =>
                      setShipping({
                        ...shipping,
                        city: value,
                      })
                    }
                    placeholder="Semarang"
                    required
                  />

                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Alamat Lengkap
                    </label>

                    <textarea
                      required
                      value={
                        shipping.address
                      }
                      onChange={(event) =>
                        setShipping({
                          ...shipping,
                          address:
                            event.target
                              .value,
                        })
                      }
                      rows={4}
                      placeholder="Nama jalan, nomor rumah, kecamatan, patokan..."
                      className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft size={16} />
                    Kembali
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Lanjut Pembayaran
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                      <CreditCard
                        size={19}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-gray-900">
                        Metode Pembayaran
                      </h2>

                      <p className="text-xs text-gray-500">
                        Pembayaran masih dalam mode simulasi.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    {paymentOptions.map(
                      (option) => {
                        const Icon =
                          option.icon;

                        const selected =
                          paymentMethod ===
                          option.value;

                        return (
                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() =>
                              setPaymentMethod(
                                option.value
                              )
                            }
                            className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                              selected
                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                : "border-gray-200 hover:border-blue-200"
                            }`}
                          >
                            <div
                              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                                selected
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              <Icon
                                size={20}
                              />
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">
                                {
                                  option.label
                                }
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {
                                  option.description
                                }
                              </p>
                            </div>

                            <div
                              className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                selected
                                  ? "border-blue-600"
                                  : "border-gray-300"
                              }`}
                            >
                              {selected && (
                                <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                              )}
                            </div>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                  <p className="text-sm font-semibold text-yellow-800">
                    Mode Demo
                  </p>

                  <p className="mt-1 text-xs leading-5 text-yellow-700">
                    Tidak ada transaksi uang nyata.
                    Setelah tombol pembayaran ditekan,
                    order akan dianggap berhasil.
                  </p>
                </div>

                {paymentError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                    {paymentError}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <ArrowLeft size={16} />
                    Kembali
                  </button>

                  <button
                    type="button"
                    disabled={ paymentLoading }
                    onClick={ submitPayment }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {paymentLoading ? "Memproses..." : "Bayar Sekarang"}

                    {!paymentLoading && (
                      <Check size={17} />
                    )}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Summary */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-5 py-5">
                <h2 className="font-bold text-gray-900">
                  Ringkasan
                </h2>
              </div>

              <div className="space-y-4 px-5 py-5">
                <SummaryRow
                  label={`Subtotal (${items.reduce((sum, item) => sum + item.quantity, 0)} item)`}
                  value={formatPrice(subtotal)}
                />

                <SummaryRow
                  label="Pengiriman"
                  value={ shippingCost === 0 ? "Gratis" : formatPrice(shippingCost) }
                  valueClassName={ shippingCost === 0 ? "text-green-600" : undefined }
                />

                {couponDiscount > 0 && (
                  <SummaryRow
                    label="Diskon"
                    value={`-${formatPrice(couponDiscount)}`}
                    valueClassName="text-green-600"
                  />
                )}

                <SummaryRow
                  label="Pajak"
                  value={formatPrice(tax)}
                />

                <div className="border-t border-dashed border-gray-200 pt-4">
                  <SummaryRow
                    label="Total"
                    value={formatPrice(total)}
                    strong
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 p-5">
                <div className="flex gap-3">
                  <ShieldCheck
                    size={19}
                    className="shrink-0 text-green-600"
                  />

                  <p className="text-xs leading-5 text-gray-500">
                    Data pesanan Anda akan diproses secara aman.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required = false, }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)
        }
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function SummaryRow({ label, value, strong = false, valueClassName = "", }: {
  label: string;
  value: string;
  strong?: boolean;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={ strong ? "font-semibold text-gray-900" : "text-sm text-gray-500" }
      >
        {label}
      </span>

      <span
        className={`${strong ? "text-xl font-bold" : "text-sm font-semibold"} ${valueClassName || "text-gray-900"}`}
      >
        {value}
      </span>
    </div>
  );
}