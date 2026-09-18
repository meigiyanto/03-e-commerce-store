import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login." },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: [
        { isDefault: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("GET /api/addresses:", error);

    return NextResponse.json(
      { message: "Gagal mengambil alamat." },
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

    const {
      label,
      name,
      phone,
      address,
      city,
      province,
      postalCode,
      isDefault,
    } = body;

    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !province ||
      !postalCode
    ) {
      return NextResponse.json(
        {
          message:
            "Nama, telepon, alamat, kota, provinsi, dan kode pos wajib diisi.",
        },
        { status: 400 }
      );
    }

    const existingCount = await prisma.address.count({
      where: { userId },
    });

    const shouldBeDefault =
      Boolean(isDefault) || existingCount === 0;

    const created = await prisma.$transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          label: String(label || "Rumah").trim(),
          name: String(name).trim(),
          phone: String(phone).trim(),
          address: String(address).trim(),
          city: String(city).trim(),
          province: String(province).trim(),
          postalCode: String(postalCode).trim(),
          isDefault: shouldBeDefault,
        },
      });
    });

    return NextResponse.json(
      {
        success: true,
        address: created,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/addresses:", error);

    return NextResponse.json(
      { message: "Gagal menyimpan alamat." },
      { status: 500 }
    );
  }
}