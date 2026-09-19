import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiError, readJson, zodErrorResponse } from "@/lib/api";
import { productSchema } from "@/schemas/product-schema";
import { serializeProduct } from "@/lib/products";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams,
      search = q.get("search")?.trim(),
      category = q.get("category")?.trim(),
      ids = q
        .get("ids")
        ?.split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    const rows = await prisma.product.findMany({
      where: {
        ...(ids?.length ? { id: { in: ids } } : {}),
        ...(category && category !== "Semua" ? { category } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rows.map(serializeProduct));
  } catch (e) {
    console.error(e);
    return apiError("Gagal mengambil data produk.");
  }
}

export async function POST(req: NextRequest) {
  const a = await requireAdmin();
  if (!a.ok)
    return apiError(
      a.status === 401
        ? "Anda harus login."
        : "Anda tidak memiliki akses admin.",
      a.status
    );

  const p = productSchema.safeParse(await readJson(req));
  if (!p.success) return zodErrorResponse(p.error);

  try {
    return NextResponse.json(
      serializeProduct(await prisma.product.create({ data: p.data })),
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return apiError("Gagal membuat produk.");
  }
}
