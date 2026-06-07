import { MessageCircle } from "lucide-react";
import { About } from "@/components/landing/About";
import { CtaSection } from "@/components/landing/CtaSection";
import { Footer } from "@/components/landing/Footer";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Location } from "@/components/landing/Location";
import { Reviews } from "@/components/landing/Reviews";
import { Services } from "@/components/landing/Services";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl } from "@/lib/format";

export function LandingPage({ client }: { client: LandingClient }) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header client={client} />
      <Hero client={client} />
      <About client={client} />
      <Services client={client} />
      <Reviews client={client} />
      <Location client={client} />
      <CtaSection client={client} />
      <Footer client={client} />

      {client.whatsapp ? (
        <a
          href={buildWhatsAppUrl(client.whatsapp)}
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-5 right-5 z-[9999] inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition hover:scale-105 hover:bg-[#20bd5a]"
          title="WhatsApp"
        >
          <MessageCircle size={26} />
        </a>
      ) : null}
    </div>
  );
}
