import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiError, readJson, zodErrorResponse } from "@/lib/api";
import { productUpdateSchema } from "@/schemas/product-schema";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function authorizationError(status: 401 | 403) {
  return apiError( status === 401 ? "Anda harus login." : "Anda tidak memiliki akses admin.", status,);
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const authorization = await requireAdmin();

  if (!authorization.ok) {
    return authorizationError(authorization.status);
  }

  const { id } = await context.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return apiError("Produk tidak ditemukan.", 404);
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id]", error);
    return apiError("Gagal mengambil produk.");
  }
}

export async function PATCH(request: NextRequest, context: RouteContext ) {
  const authorization = await requireAdmin();

  if (!authorization.ok) {
    return authorizationError(authorization.status);
  }

  const { id } = await context.params;
  const body = await readJson(request);
  const parsed = productUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return zodErrorResponse(parsed.error);
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error("PATCH /api/products/[id]", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return apiError("Produk tidak ditemukan.", 404);
    }

    return apiError("Gagal memperbarui produk.");
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const authorization = await requireAdmin();

  if (!authorization.ok) {
    return authorizationError(authorization.status);
  }

  const { id } = await context.params;

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Produk berhasil dihapus.",
    });
  } catch (error: unknown) {
    console.error("DELETE /api/products/[id]", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      return apiError("Produk tidak ditemukan.", 404);
    }

    return apiError("Gagal menghapus produk.");
  }
}
