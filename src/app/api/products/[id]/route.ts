import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return NextResponse.json(
        {
          message: "Produk tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(
      "GET /api/products/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Gagal mengambil produk.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const body = await request.json();

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          message: "Produk tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const {
      name,
      price,
      description,
      image,
      category,
      rating,
      stock,
    } = body;

    const data: {
      name?: string;
      price?: number;
      description?: string;
      image?: string;
      category?: string;
      rating?: number;
      stock?: number;
    } = {};

    if (name !== undefined) {
      const value = String(name).trim();

      if (!value) {
        return NextResponse.json(
          {
            message: "Nama produk wajib diisi.",
          },
          {
            status: 400,
          }
        );
      }

      data.name = value;
    }

    if (price !== undefined) {
      const value = Number(price);

      if (!Number.isFinite(value) || value < 0) {
        return NextResponse.json(
          {
            message: "Harga tidak valid.",
          },
          {
            status: 400,
          }
        );
      }

      data.price = value;
    }

    if (description !== undefined) {
      const value = String(description).trim();

      if (!value) {
        return NextResponse.json(
          {
            message: "Deskripsi wajib diisi.",
          },
          {
            status: 400,
          }
        );
      }

      data.description = value;
    }

    if (image !== undefined) {
      data.image = String(image).trim();
    }

    if (category !== undefined) {
      data.category = String(category).trim();
    }

    if (rating !== undefined) {
      const value = Number(rating);

      if (
        !Number.isFinite(value) ||
        value < 0 ||
        value > 5
      ) {
        return NextResponse.json(
          {
            message:
              "Rating harus berada di antara 0 dan 5.",
          },
          {
            status: 400,
          }
        );
      }

      data.rating = value;
    }

    if (stock !== undefined) {
      const value = Number(stock);

      if (
        !Number.isInteger(value) ||
        value < 0
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

      data.stock = value;
    }

    const product = await prisma.product.update({
      where: {
        id,
      },
      data,
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(
      "PATCH /api/products/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Gagal memperbarui produk.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          message: "Produk tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Produk berhasil dihapus.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/products/[id] error:",
      error
    );

    return NextResponse.json(
      {
        message: "Gagal menghapus produk.",
      },
      {
        status: 500,
      }
    );
  }
}