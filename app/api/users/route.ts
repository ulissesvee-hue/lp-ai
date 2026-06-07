import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { createDemoUser, listDemoUsers } from "@/lib/demo-users";
import { isDemoMode } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";

const DEFAULT_USER_PASSWORD = "acelera123";

const userInputSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
});

function unauthorized() {
  return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
}

function publicUser(user: { id: string; email: string; name: string; createdAt: Date | string }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt:
      user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
  };
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users: users.map(publicUser) });
  } catch {
    if (!isDemoMode()) {
      throw new Error("Não foi possível conectar ao banco.");
    }

    const users = await listDemoUsers();
    return NextResponse.json({ users: users.map(publicUser) });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = userInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Revise o e-mail informado.", error: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const email = parsed.data.email;
  const name = email.split("@")[0] || email;
  const password = await bcrypt.hash(DEFAULT_USER_PASSWORD, 12);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return NextResponse.json({ user: publicUser(user) }, { status: 201 });
  } catch {
    if (!isDemoMode()) {
      return NextResponse.json(
        { message: "Este e-mail já está cadastrado." },
        { status: 409 },
      );
    }

    try {
      const user = await createDemoUser({ email, name, password });
      return NextResponse.json({ user: publicUser(user) }, { status: 201 });
    } catch (demoError) {
      const message =
        demoError instanceof Error
          ? demoError.message
          : "Não foi possível cadastrar o usuário.";
      return NextResponse.json({ message }, { status: 409 });
    }
  }
}
