import { MessageCircle } from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl } from "@/lib/format";
import { LeadForm } from "@/components/landing/LeadForm";

export function CtaSection({ client }: { client: LandingClient }) {
  return (
    <section
      className="px-5 py-20 text-white"
      style={{ backgroundColor: client.primaryColor }}
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <h2 className="font-display text-3xl font-black md:text-5xl">
          Pronto para transformar sua obra?
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-white/90">
          Fale com a equipe da {client.storeName} e encontre os produtos certos
          para construir, reformar ou finalizar seu projeto.
        </p>
        {client.hasWebhook ? (
          <LeadForm
            slug={client.slug}
            storeName={client.storeName}
            primaryColor={client.primaryColor}
            metaPixelId={client.metaPixelId}
            googleAdsPixelId={client.googleAdsPixelId}
          />
        ) : client.whatsapp ? (
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
