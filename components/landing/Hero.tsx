import Image from "next/image";
import { MessageCircle, Star, Store, Truck } from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl, getInitials } from "@/lib/format";

export function Hero({ client }: { client: LandingClient }) {
  const whatsappUrl = buildWhatsAppUrl(
    client.whatsapp,
    `Olá, quero fazer um orçamento com ${client.storeName}.`,
  );
  const services = client.services.slice(0, 5);

  return (
    <section
      className="relative overflow-hidden text-white"
      style={{ backgroundColor: client.primaryColor }}
    >
      <div className="absolute inset-x-0 bottom-0 h-24 bg-black/10" />
      <div className="mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1fr_440px]">
        <div className="reveal">
          <p className="mb-4 inline-flex rounded-md bg-white/15 px-3 py-2 text-sm font-black uppercase">
            Sua obra começa aqui
          </p>
          <h1 className="font-display max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            Materiais de construção e tinta em {client.city}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/90">
            {client.bio.slice(0, 150)}
            {client.bio.length > 150 ? "..." : ""}
          </p>

          {client.googleRating ? (
            <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-black text-slate-950">
              <Star size={17} className="fill-amber-400 text-amber-400" />
              {client.googleRating.toFixed(1)}
              {client.googleReviewCount ? (
                <span className="text-slate-500">
                  ({client.googleReviewCount} avaliações)
                </span>
              ) : null}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {client.whatsapp ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 font-black text-white transition hover:bg-[#20bd5a]"
              >
                <MessageCircle size={19} />
                Fale pelo WhatsApp
              </a>
            ) : null}
            {client.googleBusinessUrl ? (
              <a
                href={client.googleBusinessUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-6 font-black text-slate-950 transition hover:bg-slate-100"
              >
                <Star size={18} />
                Ver no Google
              </a>
            ) : null}
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

          <div className="grid gap-3 py-5">
            {(services.length
              ? services
              : [
                  "Tintas e acessórios",
                  "Materiais de construção",
                  "Ferramentas",
                  "Louças e metais",
                  "Acabamentos",
                ]
            ).map((service) => (
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

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-slate-950 p-4 text-white">
              <Truck className="mb-2" size={22} />
              <p className="text-sm font-black">Entrega regional</p>
            </div>
            <div className="rounded-md bg-slate-100 p-4 text-slate-950">
              <Star className="mb-2 text-amber-500" size={22} />
              <p className="text-sm font-black">Atendimento local</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
