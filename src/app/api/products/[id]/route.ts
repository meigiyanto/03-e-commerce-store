import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiError, readJson, zodErrorResponse } from "@/lib/api";
import { productUpdateSchema } from "@/schemas/product-schema";
import { serializeProduct } from "@/lib/products";

type Context = { params: Promise<{ id: string }> };

function authError(status: 401 | 403) {
  return apiError(
    status === 401 ? "Anda harus login." : "Anda tidak memiliki akses admin.",
    status,
  );
}

export async function GET(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const product = await prisma.product.findUnique({ where: { id } });
    return product
      ? NextResponse.json(serializeProduct(product))
      : apiError("Produk tidak ditemukan.", 404);
  } catch (error) {
    console.error("GET /api/products/[id]", error);
    return apiError("Gagal mengambil produk.");
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const auth = await requireAdmin();
  if (!auth.ok) return authError(auth.status);
  const { id } = await context.params;
  const parsed = productUpdateSchema.safeParse(await readJson(request));
  if (!parsed.success) return zodErrorResponse(parsed.error);

  try {
    const product = await prisma.product.update({ where: { id }, data: parsed.data });
    return NextResponse.json(serializeProduct(product));
  } catch (error) {
    console.error("PATCH /api/products/[id]", error);
    return apiError("Gagal memperbarui produk.");
  }
}

export async function DELETE(_request: NextRequest, context: Context) {
  const auth = await requireAdmin();
  if (!auth.ok) return authError(auth.status);
  const { id } = await context.params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ message: "Produk berhasil dihapus." });
  } catch (error) {
    console.error("DELETE /api/products/[id]", error);
    return apiError("Gagal menghapus produk.");
  }
}
