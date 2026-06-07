"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Copy,
  Edit,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { formatDate, getClientPublicUrl } from "@/lib/format";

export type ClientRow = {
  id: string;
  slug: string;
  storeName: string;
  isActive: boolean;
  createdAt: string;
};

export function ClientTable({ clients }: { clients: ClientRow[] }) {
  const router = useRouter();

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(getClientPublicUrl(slug));
  }

  async function toggleActive(id: string, isActive: boolean) {
    const confirmed = window.confirm(
      isActive
        ? "Desativar esta landing page?"
        : "Ativar esta landing page novamente?",
    );
    if (!confirmed) return;

    await fetch(`/api/clients/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  async function deleteClient(id: string) {
    const confirmed = window.confirm(
      "Excluir esta landing page definitivamente? Esta ação não pode ser desfeita.",
    );
    if (!confirmed) return;

    await fetch(`/api/clients/${id}?hardDelete=true`, { method: "DELETE" });
    router.refresh();
  }

  if (!clients.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <MoreHorizontal className="mx-auto mb-3 text-slate-400" size={32} />
        <h2 className="font-display text-lg font-black text-slate-950">
          Nenhum cliente encontrado
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Crie o primeiro cliente para publicar uma landing page.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4">Nome da loja</th>
              <th className="px-5 py-4">URL</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Data</th>
              <th className="px-5 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {clients.map((client) => (
              <tr key={client.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4">
                  <p className="font-bold text-slate-950">{client.storeName}</p>
                  <p className="text-sm text-slate-500">/{client.slug}</p>
                </td>
                <td className="px-5 py-4">
                  <a
                    href={getClientPublicUrl(client.slug)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#FF6B00] hover:underline"
                  >
                    {client.slug}.aceleraobra.com.br
                    <ExternalLink size={14} />
                  </a>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      client.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {client.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {formatDate(client.createdAt)}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      title="Copiar link"
                      onClick={() => copyLink(client.slug)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      <Copy size={16} />
                    </button>
                    <Link
                      href={`/admin/dashboard/clients/${client.id}/preview`}
                      title="Prévia"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      <Eye size={16} />
                    </Link>
                    <Link
                      href={`/admin/dashboard/clients/${client.id}`}
                      title="Editar"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      type="button"
                      title={client.isActive ? "Desativar" : "Ativar"}
                      onClick={() => toggleActive(client.id, client.isActive)}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition ${
                        client.isActive
                          ? "hover:border-red-500 hover:text-red-600"
                          : "hover:border-emerald-500 hover:text-emerald-600"
                      }`}
                    >
                      {client.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                    </button>
                    <button
                      type="button"
                      title="Excluir LP"
                      onClick={() => deleteClient(client.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
