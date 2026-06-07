import Image from "next/image";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { buildWhatsAppUrl, formatFullAddress, getInitials } from "@/lib/format";

export function About({ client }: { client: LandingClient }) {
  const address = formatFullAddress(client);

  return (
    <section id="sobre" className="bg-white px-5 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[380px_1fr]">
        <div className="reveal flex min-h-80 items-center justify-center rounded-lg bg-slate-100 p-8">
          {client.logoUrl ? (
            <Image
              src={client.logoUrl}
              alt={client.storeName}
              width={260}
              height={260}
              className="max-h-64 w-auto object-contain"
            />
          ) : (
            <div
              className="flex h-44 w-44 items-center justify-center rounded-lg text-5xl font-black text-white"
              style={{ backgroundColor: client.secondaryColor }}
            >
              {getInitials(client.storeName)}
            </div>
          )}
        </div>

        <div className="reveal">
          <p
            className="mb-3 text-sm font-black uppercase"
            style={{ color: client.primaryColor }}
          >
            Sobre nós
          </p>
          <h2 className="font-display text-3xl font-black text-slate-950 md:text-5xl">
            {client.storeName}
          </h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            {client.bio}
          </p>

          <div className="mt-8 grid gap-3 md:grid-cols-2">
            <Info icon={MapPin} text={address} />
            {client.openingHours ? (
              <Info icon={Clock} text={client.openingHours} />
            ) : null}
            {client.phone ? <Info icon={Phone} text={client.phone} /> : null}
          </div>

          {client.whatsapp ? (
            <a
              href={buildWhatsAppUrl(client.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 font-black text-white transition hover:bg-[#20bd5a]"
            >
              <MessageCircle size={19} />
              Fale conosco
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Info({
  icon: Icon,
  text,
}: {
  icon: React.ElementType;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
      <Icon size={19} className="mt-0.5 shrink-0 text-slate-500" />
      <p className="text-sm font-semibold leading-6 text-slate-700">{text}</p>
    </div>
  );
}
