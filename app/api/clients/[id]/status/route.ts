import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { isDemoMode, setDemoClientActive } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  isActive: z.boolean(),
});

function unauthorized() {
  return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
}

function notFound() {
  return NextResponse.json({ message: "Cliente não encontrado." }, { status: 404 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = statusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Status inválido.", error: parsed.error.flatten() },
      { status: 422 },
    );
  }

  try {
    const client = await prisma.client.update({
      where: { id: params.id },
      data: { isActive: parsed.data.isActive },
    });

    return NextResponse.json({ client });
  } catch {
    if (isDemoMode()) {
      const client = await setDemoClientActive(params.id, parsed.data.isActive);
      if (client) return NextResponse.json({ client });
    }

    return notFound();
  }
}
