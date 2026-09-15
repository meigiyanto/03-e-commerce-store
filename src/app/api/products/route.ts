import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category, } : {}),
        ...(search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        message: "Gagal mengambil data produk.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, price, description, image, category, rating, stock, } = body;

    if (
      !name ||
      price === undefined ||
      !description ||
      !image ||
      !category ||
      stock === undefined
    ) {
      return NextResponse.json(
        {
          message: "Data produk belum lengkap.",
        },
        {
          status: 400,
        }
      );
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);
    const numericRating = rating === undefined ? 0 : Number(rating);

    if (
      !Number.isFinite(numericPrice) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          message: "Harga tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isInteger(numericStock) ||
      numericStock < 0
    ) {
      return NextResponse.json(
        {
          message: "Stock tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(numericRating) ||
      numericRating < 0 ||
      numericRating > 5
    ) {
      return NextResponse.json(
        {
          message: "Rating harus berada di antara 0 dan 5.",
        },
        {
          status: 400,
        }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: String(name).trim(),
        price: numericPrice,
        description: String(description).trim(),
        image: String(image).trim(),
        category: String(category).trim(),
        rating: numericRating,
        stock: numericStock,
      },
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error("POST /api/products error:", error);

    return NextResponse.json(
      {
        message: "Gagal membuat produk.",
      },
      {
        status: 500,
      }
    );
  }
}