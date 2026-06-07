"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("E-mail ou senha inválidos.");
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

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
            className="h-12 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
          />
        </span>
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Senha
        <span className="relative">
          <LockKeyhole
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 outline-none transition focus:border-[#FF6B00] focus:ring-4 focus:ring-orange-100"
          />
        </span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="h-12 rounded-md bg-[#FF6B00] font-bold text-white transition hover:bg-[#df5f03] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isLoading ? "Entrando..." : "Entrar no painel"}
      </button>
    </form>
  );
}
