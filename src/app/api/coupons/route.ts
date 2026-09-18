import { NextResponse } from "next/server";

import {
  calculateCouponDiscount,
  calculateShipping,
  findCoupon,
} from "@/lib/coupons";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const code = String(body.code ?? "");
    const subtotal = Number(body.subtotal ?? 0);

    if (!code) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode kupon wajib diisi",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(subtotal) ||
      subtotal <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Subtotal tidak valid",
        },
        { status: 400 }
      );
    }

    const coupon = findCoupon(code);

    if (!coupon) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode kupon tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const shippingCost =
      calculateShipping(subtotal);

    const result =
      calculateCouponDiscount(
        coupon,
        subtotal,
        shippingCost
      );

    if (!result.valid) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
      },
      discount: result.discount,
      shippingDiscount: result.shippingDiscount,
      message: result.message,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memvalidasi kupon",
      },
      { status: 500 }
    );
  }
}