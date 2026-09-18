import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const mine = searchParams.get("mine");

    const { userId } = await auth();

    if (mine === "1") {
      if (!userId) {
        return NextResponse.json(
          { message: "Anda harus login." },
          { status: 401 }
        );
      }

      const reviews = await prisma.review.findMany({
        where: {
          userId,
        },
        include: {
          product: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({
        success: true,
        reviews,
      });
    }

    if (productId && searchParams.get("eligible") === "1") {
      if (!userId) {
        return NextResponse.json(
          {
            message: "Anda harus login.",
            orders: [],
            reviewed: false,
          },
          { status: 401 }
        );
      }
    
      const orders = await prisma.order.findMany({
        where: {
          userId,
          orderStatus: "DELIVERED",
          items: {
            some: {
              productId,
            },
          },
        },
        select: {
          id: true,
          orderNumber: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    
      const existingReview = await prisma.review.findFirst({
        where: {
          userId,
          productId,
        },
        select: {
          id: true,
        },
      });
    
      return NextResponse.json({
        success: true,
        orders,
        reviewed: Boolean(existingReview),
      });
    }

    if (!productId) {
      return NextResponse.json(
        { message: "productId wajib diisi." },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error("GET /api/reviews:", error);

    return NextResponse.json(
      { message: "Gagal mengambil review." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const productId = String(body.productId || "");
    const orderId = String(body.orderId || "");
    const rating = Number(body.rating);
    const comment = String(body.comment || "").trim();

    if (!productId || !orderId) {
      return NextResponse.json(
        { message: "Produk dan pesanan wajib dipilih." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        { message: "Rating harus antara 1 sampai 5." },
        { status: 400 }
      );
    }

    if (comment.length < 3) {
      return NextResponse.json(
        { message: "Review minimal 3 karakter." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { message: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (order.orderStatus !== "DELIVERED") {
      return NextResponse.json(
        {
          message:
            "Produk hanya dapat direview setelah pesanan selesai.",
        },
        { status: 400 }
      );
    }

    const purchased = order.items.some(
      (item) => item.productId === productId
    );

    if (!purchased) {
      return NextResponse.json(
        {
          message:
            "Anda hanya dapat mereview produk yang Anda beli.",
        },
        { status: 403 }
      );
    }

    const existing = await prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          message:
            "Anda sudah memberikan review untuk produk ini.",
        },
        { status: 409 }
      );
    }

    const review = await prisma.$transaction(
      async (tx) => {
        const created = await tx.review.create({
          data: {
            userId,
            productId,
            orderId,
            rating,
            comment,
          },
        });

        const aggregate = await tx.review.aggregate({
          where: {
            productId,
          },
          _avg: {
            rating: true,
          },
        });

        await tx.product.update({
          where: {
            id: productId,
          },
          data: {
            rating: aggregate._avg.rating ?? 0,
          },
        });

        return created;
      }
    );

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/reviews:", error);

    return NextResponse.json(
      { message: "Gagal membuat review." },
      { status: 500 }
    );
  }
}