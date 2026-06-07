"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Check, Send } from "lucide-react";

type LeadFormProps = {
  slug: string;
  storeName: string;
  primaryColor: string;
  metaPixelId?: string | null;
  googleAdsPixelId?: string | null;
};

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function LeadForm({
  slug,
  storeName,
  primaryColor,
  metaPixelId,
  googleAdsPixelId,
}: LeadFormProps) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("sending");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        name,
        whatsapp,
        message,
        pageUrl: window.location.href,
      }),
    });
    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message || "Não foi possível enviar seus dados.");
      setStatus("idle");
      return;
    }

    if (metaPixelId && window.fbq) {
      window.fbq("track", "Lead");
    }

    if (googleAdsPixelId && window.gtag) {
      window.gtag("event", "conversion", {
        send_to: googleAdsPixelId,
      });
    }

    setStatus("sent");
    setName("");
    setWhatsapp("");
    setMessage("");
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 grid w-full max-w-xl gap-3 rounded-lg bg-white p-4 text-left text-slate-950 shadow-xl"
    >
      <div>
        <p className="font-display text-xl font-black">Receba atendimento</p>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Envie seus dados para a equipe da {storeName}.
        </p>
      </div>

      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Nome
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          minLength={2}
          className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-700">
        WhatsApp
        <input
          value={whatsapp}
          onChange={(event) => setWhatsapp(event.target.value)}
          required
          placeholder="(61) 99999-9999"
          className="h-11 rounded-md border border-slate-200 px-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </label>

      <label className="grid gap-2 text-sm font-bold text-slate-700">
        O que você precisa?
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          maxLength={500}
          className="rounded-md border border-slate-200 px-3 py-3 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </label>

      {error ? (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-bold text-red-700">
          {error}
        </p>
      ) : null}

      {status === "sent" ? (
        <p className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
          <Check size={16} />
          Dados enviados com sucesso.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 font-black text-white transition disabled:opacity-60"
        style={{ backgroundColor: primaryColor }}
      >
        <Send size={18} />
        {status === "sending" ? "Enviando..." : "Enviar para atendimento"}
      </button>
    </form>
  );
}
