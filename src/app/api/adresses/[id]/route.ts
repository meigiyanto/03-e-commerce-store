import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";

type Context = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Context
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Alamat tidak ditemukan." },
        { status: 404 }
      );
    }

    const isDefault = Boolean(body.isDefault);

    const updated = await prisma.$transaction(async (tx) => {
      if (isDefault) {
        await tx.address.updateMany({
          where: {
            userId,
            id: {
              not: id,
            },
          },
          data: {
            isDefault: false,
          },
        });
      }

      return tx.address.update({
        where: { id },
        data: {
          ...(body.label !== undefined && {
            label: String(body.label).trim(),
          }),
          ...(body.name !== undefined && {
            name: String(body.name).trim(),
          }),
          ...(body.phone !== undefined && {
            phone: String(body.phone).trim(),
          }),
          ...(body.address !== undefined && {
            address: String(body.address).trim(),
          }),
          ...(body.city !== undefined && {
            city: String(body.city).trim(),
          }),
          ...(body.province !== undefined && {
            province: String(body.province).trim(),
          }),
          ...(body.postalCode !== undefined && {
            postalCode: String(body.postalCode).trim(),
          }),
          ...(body.isDefault !== undefined && {
            isDefault,
          }),
        },
      });
    });

    return NextResponse.json({
      success: true,
      address: updated,
    });
  } catch (error) {
    console.error("PATCH /api/addresses/[id]:", error);

    return NextResponse.json(
      { message: "Gagal memperbarui alamat." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: Context
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: "Anda harus login." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.address.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json(
        { message: "Alamat tidak ditemukan." },
        { status: 404 }
      );
    }

    await prisma.address.delete({
      where: { id },
    });

    if (existing.isDefault) {
      const nextAddress = await prisma.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (nextAddress) {
        await prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE /api/addresses/[id]:", error);

    return NextResponse.json(
      { message: "Gagal menghapus alamat." },
      { status: 500 }
    );
  }
}