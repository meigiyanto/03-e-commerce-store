import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiError, readJson, zodErrorResponse } from "@/lib/api";
import { productSchema } from "@/schemas/product-schema";
import { serializeProduct } from "@/lib/products";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams;
    const search = q.get("search")?.trim();
    const category = q.get("category")?.trim();
    const ids = q.get("ids")?.split(",").map((x) => x.trim()).filter(Boolean);

    const products = await prisma.product.findMany({
      where: {
        ...(ids?.length ? { id: { in: ids } } : {}),
        ...(category && category !== "Semua" ? { category } : {}),
        ...(search ? { OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ] } : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products.map(serializeProduct));
  } catch (error) {
    console.error("GET /api/products", error);
    return apiError("Gagal mengambil data produk.");
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) return apiError(
    auth.status === 401 ? "Anda harus login." : "Anda tidak memiliki akses admin.",
    auth.status,
  );
  const parsed = productSchema.safeParse(await readJson(request));
  if (!parsed.success) return zodErrorResponse(parsed.error);

  try {
    const product = await prisma.product.create({ data: parsed.data });
    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    console.error("POST /api/products", error);
    return apiError("Gagal membuat produk.");
  }
}
