import {
  Camera,
  Clock,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Share2,
} from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl, formatFullAddress } from "@/lib/format";

function mapsSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;
}

function instagramUrl(value: string) {
  if (value.startsWith("http")) return value;
  return `https://instagram.com/${value.replace("@", "")}`;
}

export function Location({ client }: { client: LandingClient }) {
  const address = formatFullAddress(client);
  const mapsUrl = client.googleBusinessUrl || mapsSearchUrl(address);
  const embedUrl = null;

  return (
    <section id="contato" className="bg-[#F8FAFC] px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[420px_1fr]">
        <div className="reveal rounded-lg bg-white p-6 shadow-sm">
          <p
            className="mb-3 text-sm font-black uppercase"
            style={{ color: client.primaryColor }}
          >
            Venha conhecer
          </p>
          <h2 className="font-display text-3xl font-black text-slate-950">
            Nossa loja
          </h2>

          <div className="mt-6 grid gap-4">
            <Info icon={MapPin} label="Endereço" text={address} />
            {client.openingHours ? (
              <Info icon={Clock} label="Horários" text={client.openingHours} />
            ) : null}
            {client.phone ? (
              <Info icon={Phone} label="Telefone" text={client.phone} />
            ) : null}
            {client.whatsapp ? (
              <Info icon={MessageCircle} label="WhatsApp" text={client.whatsapp} />
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800"
            >
              <Navigation size={17} />
              Como chegar
            </a>
            {client.whatsapp ? (
              <a
                href={buildWhatsAppUrl(client.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#25D366] px-5 text-sm font-black text-white transition hover:bg-[#20bd5a]"
              >
                <MessageCircle size={17} />
                WhatsApp
              </a>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {client.instagram ? (
              <a
                href={instagramUrl(client.instagram)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                <Camera size={16} />
                Instagram
              </a>
            ) : null}
            {client.facebook ? (
              <a
                href={client.facebook}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
              >
                <Share2 size={16} />
                Facebook
              </a>
            ) : null}
          </div>
        </div>

        <div className="reveal min-h-[420px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          {embedUrl ? (
            <iframe
              title={`Mapa de ${client.storeName}`}
              src={embedUrl}
              className="h-full min-h-[420px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center p-8 text-center">
              <MapPin
                size={44}
                className="mb-4"
                style={{ color: client.primaryColor }}
              />
              <h3 className="font-display text-2xl font-black text-slate-950">
                {address}
              </h3>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-black text-white transition hover:bg-slate-800"
              >
                <Navigation size={17} />
                Abrir no Google Maps
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  label,
  text,
}: {
  icon: React.ElementType;
  label: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <Icon size={19} className="mt-1 shrink-0 text-slate-500" />
      <div>
        <p className="text-xs font-black uppercase text-slate-400">{label}</p>
        <p className="text-sm font-semibold leading-6 text-slate-700">{text}</p>
      </div>
    </div>
  );
}
