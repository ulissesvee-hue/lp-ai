import { MessageCircle } from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl } from "@/lib/format";

export function CtaSection({ client }: { client: LandingClient }) {
  return (
    <section
      className="relative overflow-hidden bg-slate-950 px-5 py-20 text-white"
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `linear-gradient(135deg, ${client.primaryColor}, transparent 55%)`,
        }}
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <p className="mb-3 text-sm font-black uppercase text-white/70">
          Atendimento rápido
        </p>
        <h2 className="font-display text-3xl font-black md:text-5xl">
          Preencha e fale agora com a {client.storeName}.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/90">
          Estamos prontos para ajudar você a escolher os produtos certos para
          sua construção, reforma ou acabamento.
        </p>
        {client.whatsapp ? (
          <a
            href={buildWhatsAppUrl(client.whatsapp)}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex h-14 items-center justify-center gap-2 rounded-md bg-white px-7 font-black text-slate-950 transition hover:bg-slate-100"
          >
            <MessageCircle size={20} />
            Falar com a gente no WhatsApp
          </a>
        ) : null}
      </div>
    </section>
  );
}
