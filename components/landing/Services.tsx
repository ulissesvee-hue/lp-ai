import type { ElementType } from "react";
import {
  Droplets,
  Hammer,
  Home,
  MessageCircle,
  Package,
  Paintbrush,
  ShieldCheck,
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
        <div className="reveal max-w-3xl">
          <p
            className="mb-3 text-sm font-black uppercase"
            style={{ color: client.primaryColor }}
          >
            Produtos
          </p>
          <h2 className="font-display text-3xl font-black text-slate-950 md:text-5xl">
            Produtos e marcas para cada etapa da sua obra.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  Atendimento especializado para encontrar o produto certo
                  para sua construção, reforma ou acabamento.
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
          <div className="mt-12 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-display text-2xl font-black text-slate-950">
              Marcas que você encontra aqui
            </h3>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
              {client.brandLogos.map((logo) => (
                <div
                  key={logo}
                  className="flex h-24 items-center justify-center rounded-md border border-slate-100 bg-slate-50 p-4"
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

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {["Melhores preços", "Marcas de qualidade", "Entrega rápida"].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg bg-white p-5 shadow-sm"
              >
                <ShieldCheck style={{ color: client.primaryColor }} size={24} />
                <span className="font-bold text-slate-700">{item}</span>
              </div>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
