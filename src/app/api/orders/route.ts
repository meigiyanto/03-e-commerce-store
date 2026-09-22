import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { calculateCouponDiscount, calculateShipping, calculateTax, findCoupon, } from "@/lib/coupons";

type OrderRequestItem = {
  productId: string;
  quantity: number;
};

type ShippingPayload = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
};

export async function POST( request: Request ) {
  try {
    const body = await request.json();
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda harus login untuk melakukan checkout.",
        },
        { status: 401 }
      );
    }

    const items = body.items as OrderRequestItem[];
    const shipping = body.shipping as ShippingPayload;
    const couponCode = body.couponCode ? String(body.couponCode) : "";
    const paymentMethod = String( body.paymentMethod ?? "bank_transfer" );
    const allowedPaymentMethods = [ "bank_transfer", "e_wallet", "cod" ];
    
    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Metode pembayaran tidak valid.",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Keranjang kosong",
        },
        { status: 400 }
      );
    }

    if (!shipping) {
      return NextResponse.json(
        {
          success: false,
          message: "Data pengiriman wajib diisi",
        },
        { status: 400 }
      );
    }

    if (
      !shipping.name ||
      !shipping.email ||
      !shipping.phone ||
      !shipping.address ||
      !shipping.city ||
      !shipping.province ||
      !shipping.postalCode
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Semua data pengiriman wajib diisi",
        },
        { status: 400 }
      );
    }

    const productIds = items.map((item) => item.productId );

    const products = await prisma.product.findMany({
        where: {
          id: {
            in: productIds,
          },
        },
      });

    if ( products.length !== new Set(productIds).size ) {
      return NextResponse.json(
        {
          success: false,
          message: "Beberapa produk tidak ditemukan",
        },
        { status: 400 }
      );
    }

    const validatedItems = items.map((item) => {
        const product = products.find((product) => product.id === item.productId );

        if (!product) {
          throw new Error(`Produk ${item.productId} tidak ditemukan`);
        }

        const quantity = Math.floor(Number(item.quantity));

        if ( !Number.isFinite(quantity) || quantity < 1 ) {
          throw new Error(`Jumlah ${product.name} tidak valid`);
        }

        if (quantity > product.stock) {
          throw new Error(`Stok ${product.name} tidak mencukupi`);
        }

        return { product, quantity, subtotal: product.price * quantity};
      });

    const subtotal = validatedItems.reduce((total, item) =>total + item.subtotal, 0);
    let shippingCost = calculateShipping(subtotal);
    let discount = 0;
    let shippingDiscount = 0;

    if (couponCode) {
      const coupon = findCoupon(couponCode);

      if (!coupon) {
        return NextResponse.json(
          {
            success: false,
            message: "Kode kupon tidak valid",
          },
          { status: 400 }
        );
      }

      const couponResult = calculateCouponDiscount(coupon, subtotal, shippingCost);

      if (!couponResult.valid) {
        return NextResponse.json(
          {
            success: false,
            message: couponResult.message,
          },
          { status: 400 }
        );
      }

      discount = couponResult.discount;
      shippingDiscount = couponResult.shippingDiscount;
    }

    shippingCost = Math.max(0, shippingCost - shippingDiscount);
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = calculateTax(taxableAmount);
    const total = Math.max(0, taxableAmount + shippingCost + tax);
    const orderNumber = `NX-${Date.now().toString().slice(-8)}-${Math.floor(Math.random() * 900 + 100)}`;

    const order = await prisma.$transaction(
        async (tx) => {
          for (const item of validatedItems) {
            const result =
              await tx.product.updateMany({
                where: {
                  id: item.product.id,
                  stock: {
                    gte: item.quantity,
                  },
                },
                data: {
                  stock: {
                    decrement:
                      item.quantity,
                  },
                },
              });

            if (result.count !== 1) {
              throw new Error(
                `Stok ${item.product.name} berubah. Silakan coba lagi.`
              );
            }
          }

          return tx.order.create({
            data: {
              orderNumber,
              userId,
              customerName: shipping.name,
              customerEmail: shipping.email,
              customerPhone: shipping.phone,
              address: shipping.address,
              city: shipping.city,
              province: shipping.province,
              postalCode: shipping.postalCode,
              subtotal,
              shippingCost,
              discount,
              tax,
              total,
              couponCode: couponCode || null,
              paymentMethod,
              paymentStatus: "PAID",
              orderStatus: "PROCESSING",
              items: {
                create:
                  validatedItems.map(
                    (item) => ({
                      productId: item.product.id,
                      productName: item.product.name,
                      price: item.product.price,
                      quantity: item.quantity,
                      subtotal: item.subtotal,
                    })
                  ),
              },
            },
            include: { items: true },
          });
        }
      );

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          subtotal: order.subtotal,
          shippingCost: order.shippingCost,
          discount: order.discount,
          tax: order.tax,
          total: order.total,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          orderStatus: order.orderStatus,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_ORDER_ERROR", error);
    const message = error instanceof Error ? error.message : "Gagal membuat pesanan";

    return NextResponse.json(
      {
        success: false, message,
      },
      { status: 400 }
    );
  }
}