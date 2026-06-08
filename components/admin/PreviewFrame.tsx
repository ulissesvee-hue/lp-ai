"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";
import { getClientUrlForOrigin } from "@/lib/format";

const viewports = {
  desktop: {
    label: "Desktop",
    icon: Monitor,
    width: "100%",
  },
  tablet: {
    label: "Tablet",
    icon: Tablet,
    width: "768px",
  },
  mobile: {
    label: "Mobile",
    icon: Smartphone,
    width: "390px",
  },
};

type ViewportKey = keyof typeof viewports;

export function PreviewFrame({ slug }: { slug: string }) {
  const [viewport, setViewport] = useState<ViewportKey>("desktop");
  const [origin, setOrigin] = useState("");
  const publicUrl = useMemo(
    () => (origin ? getClientUrlForOrigin(slug, origin) : `/site/${slug}`),
    [origin, slug],
  );
  const frameUrl = `/site/${slug}`;
  const active = viewports[viewport];

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl);
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1">
          {Object.entries(viewports).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => setViewport(key as ViewportKey)}
              className={`inline-flex h-10 items-center gap-2 rounded px-3 text-sm font-bold transition ${
                viewport === key
                  ? "bg-white text-[#FF6B00] shadow-sm"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
          >
            <ExternalLink size={16} />
            Abrir em nova aba
          </a>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#FF6B00] px-4 text-sm font-bold text-white transition hover:bg-[#df5f03]"
          >
            <Copy size={16} />
            Copiar link
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-slate-200 p-4">
        <iframe
          title="Prévia da landing page"
          src={frameUrl}
          className="mx-auto h-[760px] rounded-md border border-slate-300 bg-white shadow-sm"
          style={{ width: active.width, maxWidth: "100%" }}
        />
      </div>
    </div>
  );
}
