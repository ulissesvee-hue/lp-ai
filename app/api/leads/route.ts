import { NextResponse } from "next/server";
import { z } from "zod";
import { getDemoClientBySlug, isDemoMode } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";
import { normalizeWhatsApp, slugSchema } from "@/lib/validations";

const leadInputSchema = z.object({
  slug: slugSchema,
  name: z.string().trim().min(2, "Informe seu nome."),
  whatsapp: z.preprocess((value) => {
    if (typeof value !== "string") return "";
    return normalizeWhatsApp(value) || "";
  }, z.string().regex(/^55\d{10,11}$/, "Informe um WhatsApp válido.")),
  message: z.string().trim().max(500).optional().nullable(),
  pageUrl: z.string().url().optional().nullable(),
});

async function getWebhookClient(slug: string) {
  try {
    return await prisma.client.findUnique({
      where: { slug },
      select: {
        slug: true,
        storeName: true,
        isActive: true,
        webhookUrl: true,
      },
    });
  } catch {
    if (!isDemoMode()) {
      throw new Error("Não foi possível conectar ao banco.");
    }

    const client = await getDemoClientBySlug(slug);
    if (!client) return null;

    return {
      slug: client.slug,
      storeName: client.storeName,
      isActive: client.isActive,
      webhookUrl: client.webhookUrl,
    };
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = leadInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Revise os dados do formulário.", error: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const client = await getWebhookClient(data.slug);

  if (!client || !client.isActive) {
    return NextResponse.json(
      { message: "Página não encontrada." },
      { status: 404 },
    );
  }

  if (!client.webhookUrl) {
    return NextResponse.json(
      { message: "Webhook do CRM não configurado." },
      { status: 422 },
    );
  }

  const payload = {
    event: "lead.created",
    createdAt: new Date().toISOString(),
    source: "LP AI",
    pageUrl: data.pageUrl,
    client: {
      slug: client.slug,
      storeName: client.storeName,
    },
    lead: {
      name: data.name,
      whatsapp: data.whatsapp,
      message: data.message || null,
    },
  };

  try {
    const response = await fetch(client.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "O CRM não confirmou o recebimento do lead." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { message: "Não foi possível enviar o lead para o CRM." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
