import Image from "next/image";
import {
  BadgeCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  PackageCheck,
  PhoneCall,
  Star,
  Store,
  Truck,
} from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl, getInitials } from "@/lib/format";
import { LeadForm } from "@/components/landing/LeadForm";

export function Hero({ client }: { client: LandingClient }) {
  const whatsappUrl = buildWhatsAppUrl(
    client.whatsapp,
    `Olá, quero fazer um orçamento com ${client.storeName}.`,
  );
  const services = client.services.slice(0, 5);
  const heroServices = services.length
    ? services
    : [
        "Tintas e acessórios",
        "Materiais de construção",
        "Ferramentas",
        "Louças e metais",
        "Acabamentos",
      ];

  return (
    <section
      className="relative overflow-hidden bg-slate-950 text-white"
    >
      <div
        className="absolute inset-y-0 left-0 w-full opacity-25"
        style={{
          background: `linear-gradient(135deg, ${client.primaryColor}, transparent 55%), radial-gradient(circle at 82% 18%, ${client.secondaryColor}, transparent 32%)`,
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/35 to-transparent" />

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-5 py-14 lg:grid-cols-[1fr_430px] lg:py-20">
        <div className="reveal">
          <p className="mb-4 inline-flex items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-sm font-black uppercase tracking-normal text-white">
            <MapPin size={16} />
            {client.city} / {client.state}
          </p>
          <h1 className="font-display max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            {client.storeName}
          </h1>
          <p className="mt-4 max-w-3xl text-2xl font-black leading-tight text-white md:text-4xl">
            Produtos para construir, reformar e finalizar sua obra.
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">
            Atendimento local, variedade de produtos e suporte para escolher o
            material certo para cada etapa do seu projeto.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {client.whatsapp ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-md bg-[#25D366] px-7 py-4 font-black text-white shadow-lg transition hover:bg-[#20bd5a]"
              >
                <MessageCircle size={19} />
                Fale conosco
              </a>
            ) : null}
            {client.googleBusinessUrl ? (
              <a
                href={client.googleBusinessUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-13 items-center justify-center gap-2 rounded-md bg-white px-7 py-4 font-black text-slate-950 transition hover:bg-slate-100"
              >
                <Star size={18} />
                Ver no Google
              </a>
            ) : null}
          </div>

          <div className="mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { icon: BadgeCheck, text: "Melhores marcas" },
              { icon: Truck, text: "Entrega regional" },
              { icon: PackageCheck, text: "Produtos para obra" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-md border border-white/10 bg-white/10 px-4 py-3"
              >
                <item.icon size={20} style={{ color: client.primaryColor }} />
                <span className="text-sm font-black">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal rounded-lg bg-white p-5 text-slate-950 shadow-2xl">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-xl font-black">
              {client.logoUrl ? (
                <Image
                  src={client.logoUrl}
                  alt={client.storeName}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                getInitials(client.storeName)
              )}
            </div>
            <div>
              <p className="font-display text-2xl font-black">
                {client.storeName}
              </p>
              <p className="text-sm font-semibold text-slate-500">
                {client.city} / {client.state}
              </p>
            </div>
          </div>

          {client.hasWebhook ? (
            <LeadForm
              slug={client.slug}
              storeName={client.storeName}
              primaryColor={client.primaryColor}
              metaPixelId={client.metaPixelId}
              googleAdsPixelId={client.googleAdsPixelId}
              compact
            />
          ) : (
            <>
          {client.googleRating ? (
            <div className="my-5 flex items-center justify-between rounded-md bg-amber-50 px-4 py-3">
              <div>
                <p className="text-xs font-black uppercase text-amber-700">
                  Avaliação no Google
                </p>
                <p className="font-display text-2xl font-black text-slate-950">
                  {client.googleRating.toFixed(1)}
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={18}
                    className={
                      index < Math.round(client.googleRating || 0)
                        ? "fill-amber-400"
                        : "text-amber-200"
                    }
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="grid gap-3 py-1">
            {heroServices.map((service) => (
              <div
                key={service}
                className="flex items-center gap-3 rounded-md bg-slate-50 px-4 py-3"
              >
                <Store size={18} style={{ color: client.primaryColor }} />
                <span className="text-sm font-bold text-slate-700">
                  {service}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-md bg-slate-950 p-4 text-white">
              <Truck className="mb-2" size={22} />
              <p className="text-sm font-black">Entrega rápida</p>
            </div>
            <div className="rounded-md bg-slate-100 p-4 text-slate-950">
              <Star className="mb-2 text-amber-500" size={22} />
              <p className="text-sm font-black">Ótimo atendimento</p>
            </div>
          </div>

              {client.whatsapp ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 font-black text-white transition hover:bg-[#20bd5a]"
                >
                  <PhoneCall size={18} />
                  Falar agora
                </a>
              ) : null}
            </>
          )}
        </div>
      </div>

      <div className="relative border-y border-white/10 bg-white/5 px-5 py-8">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[300px_1fr] md:items-center">
          <div>
            <p className="text-sm font-black uppercase text-white/60">
              Sua obra começa aqui
            </p>
            <h2 className="font-display mt-2 text-2xl font-black text-white md:text-4xl">
              Sua melhor escolha
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Melhores preços",
              "Entrega na região",
              "Todo tipo de obra",
              "Marcas do mercado",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-md bg-white px-4 py-4 text-slate-950 shadow-sm"
              >
                <CheckCircle2 size={20} style={{ color: client.primaryColor }} />
                <span className="text-sm font-black">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
