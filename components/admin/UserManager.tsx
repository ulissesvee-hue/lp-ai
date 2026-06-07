"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Mail, Plus, Trash2, UserRound } from "lucide-react";
import { formatDate } from "@/lib/format";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export function UserManager({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSaving(true);

    const response = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const payload = await response.json();
    setIsSaving(false);

    if (!response.ok) {
      setError(payload.message || "Não foi possível cadastrar o usuário.");
      return;
    }

    setUsers([payload.user, ...users]);
    setEmail("");
    setMessage("Usuário cadastrado. Senha padrão: acelera123");
  }

  async function removeUser(user: AdminUser) {
    const confirmed = window.confirm(`Remover o usuário ${user.email}?`);
    if (!confirmed) return;

    setMessage("");
    setError("");
    setRemovingId(user.id);

    const response = await fetch(`/api/users/${user.id}`, {
      method: "DELETE",
    });
    const payload = await response.json();
    setRemovingId(null);

    if (!response.ok) {
      setError(payload.message || "Não foi possível remover o usuário.");
      return;
    }

    setUsers(users.filter((item) => item.id !== user.id));
    setMessage("Usuário removido.");
  }

  return (
    <div className="grid gap-5">
      <form
        onSubmit={submit}
        className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-orange-50 text-[#FF6B00]">
            <UserRound size={20} />
          </div>
          <div>
            <h2 className="font-display text-lg font-black text-slate-950">
              Novo usuário
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Cadastre apenas o e-mail. A senha será acelera123.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_180px]">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            E-mail
            <span className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="usuario@email.com"
                className="h-11 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
              />
            </span>
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#FF6B00] px-5 text-sm font-bold text-white transition hover:bg-[#df5f03] disabled:opacity-60"
          >
            <Plus size={17} />
            {isSaving ? "Salvando..." : "Adicionar"}
          </button>
        </div>

        {message ? (
          <p className="mt-4 rounded-md bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
            {error}
          </p>
        ) : null}
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full border-collapse text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-4">E-mail</th>
              <th className="px-5 py-4">Nome</th>
              <th className="px-5 py-4">Criado em</th>
              <th className="px-5 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length ? (
              users.map((user) => (
                <tr key={user.id} className="transition hover:bg-slate-50">
                  <td className="px-5 py-4 font-bold text-slate-950">
                    {user.email}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {user.name}
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        title="Remover usuário"
                        disabled={removingId === user.id}
                        onClick={() => removeUser(user)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">
                  Nenhum usuário cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
