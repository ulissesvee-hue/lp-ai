import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PreviewFrame } from "@/components/admin/PreviewFrame";
import { getDemoClientById, isDemoMode } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PreviewPage({
  params,
}: {
  params: { id: string };
}) {
  let client;

  try {
    client = await prisma.client.findUnique({
      where: { id: params.id },
      select: { slug: true, storeName: true },
    });
  } catch {
    if (!isDemoMode()) throw new Error("Não foi possível conectar ao banco.");
    client = await getDemoClientById(params.id);
  }

  if (!client) notFound();

  return (
    <div className="grid gap-6">
      <div>
        <Link
          href="/admin/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#FF6B00]"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <h1 className="font-display text-3xl font-black text-slate-950">
          Prévia
        </h1>
        <p className="mt-2 text-sm text-slate-500">{client.storeName}</p>
      </div>

      <PreviewFrame slug={client.slug} />
    </div>
  );
}
