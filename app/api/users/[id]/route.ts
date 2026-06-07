import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteDemoUser } from "@/lib/demo-users";
import { isDemoMode } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";

function unauthorized() {
  return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
}

function notFound() {
  return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  if (session.user?.id === params.id) {
    return NextResponse.json(
      { message: "Você não pode remover o usuário que está usando agora." },
      { status: 422 },
    );
  }

  try {
    const user = await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ user: { id: user.id } });
  } catch {
    if (isDemoMode()) {
      const deleted = await deleteDemoUser(params.id);
      if (deleted) return NextResponse.json({ user: deleted });
    }

    return notFound();
  }
}
