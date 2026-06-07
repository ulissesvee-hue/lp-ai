"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, MessageCircle, X } from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl, getInitials } from "@/lib/format";

const links = [
  { href: "#sobre", label: "Sobre" },
  { href: "#produtos", label: "Produtos" },
  { href: "#avaliacoes", label: "Avaliações" },
  { href: "#contato", label: "Contato" },
];

export function Header({ client }: { client: LandingClient }) {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappUrl = buildWhatsAppUrl(
    client.whatsapp,
    `Olá, gostaria de falar com ${client.storeName}.`,
  );

  return (
    <header
      className="sticky top-0 z-40 text-white shadow-lg"
      style={{ backgroundColor: client.secondaryColor }}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <a href="#" className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white text-sm font-black text-slate-900">
            {client.logoUrl ? (
              <Image
                src={client.logoUrl}
                alt={client.storeName}
                width={48}
                height={48}
                className="h-full w-full object-contain p-1"
              />
            ) : (
              getInitials(client.storeName)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-black">
              {client.storeName}
            </p>
            <p className="text-xs text-white/70">
              {client.city} / {client.state}
            </p>
          </div>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-bold text-white/80 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {client.whatsapp ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 text-sm font-black text-white transition hover:bg-[#20bd5a]"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10 lg:hidden"
          title="Menu"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-white/10 px-5 py-4 lg:hidden">
          <nav className="grid gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-bold text-white/90"
              >
                {link.label}
              </a>
            ))}
            {client.whatsapp ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 text-sm font-black text-white"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
