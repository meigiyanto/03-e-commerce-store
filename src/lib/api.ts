import { NextResponse } from "next/server";
import type { ZodError } from "zod";

export function apiError(message: string, status = 500) {
  return NextResponse.json({ message }, { status });
}

export function zodErrorResponse(error: ZodError) {
  return NextResponse.json(
    {
      message: "Data yang dikirim tidak valid.",
      issues: error.issues,
    },
    { status: 400 },
  );
}

export async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
