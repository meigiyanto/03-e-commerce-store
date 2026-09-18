export type CouponType = "percentage" | "fixed" | "free_shipping";

export type Coupon = {
  code: string;
  name: string;
  description: string;
  type: CouponType;
  value: number;
  minimumPurchase: number;
  maximumDiscount?: number;
};

export const COUPONS: Coupon[] = [
  {
    code: "HEMAT10",
    name: "Hemat 10%",
    description: "Diskon 10% untuk belanja minimal Rp100.000",
    type: "percentage",
    value: 10,
    minimumPurchase: 100_000,
    maximumDiscount: 50_000,
  },
  {
    code: "WELCOME20",
    name: "Welcome 20%",
    description: "Diskon 20% untuk belanja minimal Rp200.000",
    type: "percentage",
    value: 20,
    minimumPurchase: 200_000,
    maximumDiscount: 75_000,
  },
  {
    code: "GRATISONGKIR",
    name: "Gratis Ongkir",
    description: "Bebas biaya pengiriman",
    type: "free_shipping",
    value: 100,
    minimumPurchase: 150_000,
  },
];

export function findCoupon(code: string) {
  const normalizedCode = code.trim().toUpperCase();

  return COUPONS.find(
    (coupon) => coupon.code === normalizedCode
  );
}

export function calculateCouponDiscount(
  coupon: Coupon,
  subtotal: number,
  shippingCost: number
) {
  if (subtotal < coupon.minimumPurchase) {
    return {
      valid: false,
      discount: 0,
      shippingDiscount: 0,
      message: `Minimum belanja Rp ${coupon.minimumPurchase.toLocaleString(
        "id-ID"
      )}`,
    };
  }

  if (coupon.type === "percentage") {
    let discount = subtotal * (coupon.value / 100);

    if (coupon.maximumDiscount) {
      discount = Math.min(
        discount,
        coupon.maximumDiscount
      );
    }

    return {
      valid: true,
      discount,
      shippingDiscount: 0,
      message: `Diskon ${coupon.value}% berhasil digunakan`,
    };
  }

  if (coupon.type === "fixed") {
    return {
      valid: true,
      discount: Math.min(coupon.value, subtotal),
      shippingDiscount: 0,
      message: "Kupon berhasil digunakan",
    };
  }

  if (coupon.type === "free_shipping") {
    return {
      valid: true,
      discount: 0,
      shippingDiscount: shippingCost,
      message: "Gratis ongkir berhasil digunakan",
    };
  }

  return {
    valid: false,
    discount: 0,
    shippingDiscount: 0,
    message: "Kupon tidak valid",
  };
}

export function calculateShipping(subtotal: number) {
  if (subtotal >= 300_000) {
    return 0;
  }

  return 15_000;
}

export function calculateTax(subtotal: number) {
  return subtotal * 0.11;
}