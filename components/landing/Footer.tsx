import Image from "next/image";
import { Camera, MessageCircle, Share2 } from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl, formatShortAddress, getInitials } from "@/lib/format";

function instagramUrl(value: string) {
  if (value.startsWith("http")) return value;
  return `https://instagram.com/${value.replace("@", "")}`;
}

export function Footer({ client }: { client: LandingClient }) {
  return (
    <footer
      className="px-5 py-10 text-white"
      style={{ backgroundColor: client.secondaryColor }}
    >
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white text-sm font-black text-slate-950">
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
            <div>
              <p className="font-display text-xl font-black">
                {client.storeName}
              </p>
              <p className="text-sm text-white/70">
                {formatShortAddress(client)}
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/60">
            Desenvolvido por LP AI · AceleraObra
          </p>
          <p className="mt-2 text-sm text-white/60">
            © {new Date().getFullYear()} {client.storeName}. Todos os direitos
            reservados.
          </p>
        </div>

        <div className="flex flex-wrap items-start gap-3 md:justify-end">
          {client.whatsapp ? (
            <a
              href={buildWhatsAppUrl(client.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20"
              title="WhatsApp"
            >
              <MessageCircle size={18} />
            </a>
          ) : null}
          {client.instagram ? (
            <a
              href={instagramUrl(client.instagram)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20"
              title="Instagram"
            >
              <Camera size={18} />
            </a>
          ) : null}
          {client.facebook ? (
            <a
              href={client.facebook}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white/10 text-white transition hover:bg-white/20"
              title="Facebook"
            >
              <Share2 size={18} />
            </a>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
