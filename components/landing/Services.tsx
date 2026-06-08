import type { ElementType } from "react";
import {
  BadgePercent,
  Droplets,
  Hammer,
  Home,
  MessageCircle,
  Package,
  Paintbrush,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl } from "@/lib/format";

const fallbackServices = [
  "Tintas e acessórios",
  "Materiais para construção",
  "Ferramentas",
  "Louças e metais",
  "Elétrica",
  "Acabamentos",
];

function getIcon(service: string): ElementType {
  const normalized = service.toLowerCase();
  if (normalized.includes("tinta") || normalized.includes("textura")) {
    return Paintbrush;
  }
  if (normalized.includes("eletric") || normalized.includes("cabo")) {
    return Zap;
  }
  if (normalized.includes("hidraul") || normalized.includes("impermeab")) {
    return Droplets;
  }
  if (normalized.includes("ferrament") || normalized.includes("ferragen")) {
    return Wrench;
  }
  if (normalized.includes("cimento") || normalized.includes("argamassa")) {
    return Package;
  }
  if (normalized.includes("drywall") || normalized.includes("obra")) {
    return Hammer;
  }
  return Home;
}

export function Services({ client }: { client: LandingClient }) {
  const services = client.services.length ? client.services : fallbackServices;

  return (
    <section id="produtos" className="bg-[#F8FAFC] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="reveal grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
          <div>
            <p
              className="mb-3 text-sm font-black uppercase"
              style={{ color: client.primaryColor }}
            >
              Produtos
            </p>
            <h2 className="font-display text-3xl font-black text-slate-950 md:text-5xl">
              Tudo para sua construção, reforma e acabamento.
            </h2>
          </div>
          <p className="text-base font-semibold leading-7 text-slate-600">
            Conte com variedade, orientação no atendimento e produtos para
            diferentes etapas da obra, do básico ao acabamento.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { icon: BadgePercent, title: "Melhores preços" },
            { icon: Truck, title: "Entrega rápida" },
            { icon: Sparkles, title: "Marcas de qualidade" },
            { icon: ShieldCheck, title: "Atendimento especializado" },
          ].map((item) => (
            <div
              key={item.title}
              className="reveal rounded-lg bg-white p-5 shadow-sm"
            >
              <item.icon
                className="mb-4"
                size={28}
                style={{ color: client.primaryColor }}
              />
              <p className="font-display text-lg font-black text-slate-950">
                {item.title}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <p
            className="mb-3 text-sm font-black uppercase"
            style={{ color: client.primaryColor }}
          >
            Linha de produtos
          </p>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getIcon(service);
            return (
              <div
                key={service}
                className="reveal rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-md text-white"
                  style={{ backgroundColor: client.primaryColor }}
                >
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-xl font-black text-slate-950">
                  {service}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Opções para comprar com praticidade e orientação para
                  escolher o melhor produto para sua necessidade.
                </p>
              </div>
            );
          })}
        </div>

        {client.whatsapp ? (
          <div className="mt-10 flex justify-center">
            <a
              href={buildWhatsAppUrl(
                client.whatsapp,
                `Olá, gostaria de solicitar um orçamento com ${client.storeName}.`,
              )}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 font-black text-white transition hover:bg-[#20bd5a]"
            >
              <MessageCircle size={19} />
              Solicitar orçamento no WhatsApp
            </a>
          </div>
        ) : null}

        {client.brandLogos.length ? (
          <div className="mt-14 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p
                  className="text-sm font-black uppercase"
                  style={{ color: client.primaryColor }}
                >
                  Melhores marcas
                </p>
                <h3 className="font-display mt-2 text-2xl font-black text-slate-950 md:text-4xl">
                  Marcas que você encontra aqui
                </h3>
              </div>
              <p className="max-w-lg text-sm font-semibold leading-6 text-slate-500">
                Trabalhamos com marcas reconhecidas para entregar qualidade,
                durabilidade e confiança em cada compra.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {client.brandLogos.map((logo) => (
                <div
                  key={logo}
                  className="flex h-28 items-center justify-center rounded-md border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-1 hover:shadow-sm"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt="Logo de marca vendida"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
