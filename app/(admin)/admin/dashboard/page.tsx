import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { ClientTable, type ClientRow } from "@/components/admin/ClientTable";
import { countDemoClients, isDemoMode, listDemoClients } from "@/lib/demo-store";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.trim() || "";
  const where = query
    ? {
        OR: [
          { storeName: { contains: query, mode: "insensitive" as const } },
          { slug: { contains: query, mode: "insensitive" as const } },
          { city: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  let isDemoFallback = false;
  let clients: Array<{
    id: string;
    slug: string;
    storeName: string;
    isActive: boolean;
    createdAt: Date | string;
  }> = [];
  let total = 0;

  try {
    [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.client.count(),
    ]);
  } catch {
    if (!isDemoMode()) {
      throw new Error("Não foi possível conectar ao banco de dados.");
    }
    isDemoFallback = true;
    [clients, total] = await Promise.all([
      listDemoClients(query),
      countDemoClients(),
    ]);
  }

  const rows: ClientRow[] = clients.map((client) => ({
    id: client.id,
    slug: client.slug,
    storeName: client.storeName,
    isActive: client.isActive,
    createdAt:
      client.createdAt instanceof Date
        ? client.createdAt.toISOString()
        : client.createdAt,
  }));

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase text-[#FF6B00]">
            Painel administrativo
          </p>
          <h1 className="font-display mt-2 text-3xl font-black text-slate-950">
            Clientes
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {total} cliente{total === 1 ? "" : "s"} cadastrado
            {total === 1 ? "" : "s"}.
          </p>
        </div>

        <Link
          href="/admin/dashboard/clients/new"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#FF6B00] px-5 text-sm font-bold text-white transition hover:bg-[#df5f03]"
        >
          <Plus size={18} />
          Novo cliente
        </Link>
      </div>

      <form className="relative max-w-xl">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          name="q"
          defaultValue={query}
          placeholder="Buscar por nome, slug ou cidade"
          className="h-12 w-full rounded-md border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
        />
      </form>

      {isDemoFallback ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">
          Modo demo ativo: você já pode navegar no painel, mas o cadastro de
          clientes precisa do Supabase/PostgreSQL configurado no `.env.local`.
        </div>
      ) : null}

      <ClientTable clients={rows} />
    </div>
  );
}
