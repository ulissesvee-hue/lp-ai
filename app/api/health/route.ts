import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`select 1`;

    return NextResponse.json({
      status: "ok",
      database: "ok",
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      {
        status: "error",
        database: "unavailable",
        message,
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
