"use client";

import { useEffect, useState } from "react";
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
import { formatDate, getClientUrlForOrigin } from "@/lib/format";

export type ClientRow = {
  id: string;
  slug: string;
  storeName: string;
  isActive: boolean;
  createdAt: string;
};

function ClientTableRow({
  client,
  origin,
  onCopy,
  onToggleActive,
  onDelete,
}: {
  client: ClientRow;
  origin: string;
  onCopy: (slug: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const publicUrl = origin
    ? getClientUrlForOrigin(client.slug, origin)
    : `/site/${client.slug}`;

  return (
    <tr className="transition hover:bg-slate-50">
      <td className="px-5 py-4">
        <p className="font-bold text-slate-950">{client.storeName}</p>
        <p className="text-sm text-slate-500">/{client.slug}</p>
      </td>
      <td className="px-5 py-4">
        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex max-w-[360px] items-center gap-2 truncate text-sm font-semibold text-[#FF6B00] hover:underline"
        >
          <span className="truncate">{publicUrl}</span>
          <ExternalLink size={14} className="shrink-0" />
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
            onClick={() => onCopy(client.slug)}
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
            onClick={() => onToggleActive(client.id, client.isActive)}
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
            onClick={() => onDelete(client.id)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function ClientTable({ clients }: { clients: ClientRow[] }) {
  const router = useRouter();
  const [origin, setOrigin] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function copyLink(slug: string) {
    const url = getClientUrlForOrigin(slug, origin || window.location.origin);
    await navigator.clipboard.writeText(url);
    setMessage("Link copiado.");
  }

  async function toggleActive(id: string, isActive: boolean) {
    const confirmed = window.confirm(
      isActive
        ? "Desativar esta landing page?"
        : "Ativar esta landing page novamente?",
    );
    if (!confirmed) return;

    const response = await fetch(`/api/clients/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });

    if (!response.ok) {
      setMessage("Não foi possível alterar o status desta landing page.");
      return;
    }

    setMessage(isActive ? "Landing page desativada." : "Landing page ativada.");
    router.refresh();
  }

  async function deleteClient(id: string) {
    const confirmed = window.confirm(
      "Excluir esta landing page definitivamente? Esta ação não pode ser desfeita.",
    );
    if (!confirmed) return;

    const response = await fetch(`/api/clients/${id}?hardDelete=true`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setMessage("Não foi possível excluir esta landing page.");
      return;
    }

    setMessage("Landing page excluída.");
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
    <div className="grid gap-3">
      {message ? (
        <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm">
          {message}
        </div>
      ) : null}

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
              <ClientTableRow
                key={client.id}
                client={client}
                origin={origin}
                onCopy={copyLink}
                onToggleActive={toggleActive}
                onDelete={deleteClient}
              />
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
