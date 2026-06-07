"use client";

import { useRef, useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";

type DetectedColors = {
  primaryColor: string;
  secondaryColor: string;
};

export function LogoUpload({
  value,
  onChange,
  onColorsDetected,
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  onColorsDetected?: (colors: DetectedColors) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  function rgbToHex(r: number, g: number, b: number) {
    return `#${[r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")}`;
  }

  function luminance([r, g, b]: number[]) {
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function saturation([r, g, b]: number[]) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return max === 0 ? 0 : (max - min) / max;
  }

  async function detectLogoColors(file: File) {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Não foi possível ler a logo."));
    });

    const canvas = document.createElement("canvas");
    const size = 96;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    context.drawImage(image, 0, 0, size, size);
    URL.revokeObjectURL(imageUrl);

    const { data } = context.getImageData(0, 0, size, size);
    const buckets = new Map<string, { rgb: number[]; count: number }>();

    for (let index = 0; index < data.length; index += 16) {
      const alpha = data[index + 3];
      if (alpha < 180) continue;

      const rgb = [data[index], data[index + 1], data[index + 2]];
      const light = luminance(rgb);
      if (light > 242 || light < 18) continue;

      const quantized = rgb.map((value) => Math.round(value / 32) * 32);
      const key = quantized.join("-");
      const current = buckets.get(key);
      buckets.set(key, {
        rgb: quantized,
        count: (current?.count || 0) + 1,
      });
    }

    const colors = Array.from(buckets.values()).sort((a, b) => {
      const scoreA = a.count * (0.65 + saturation(a.rgb));
      const scoreB = b.count * (0.65 + saturation(b.rgb));
      return scoreB - scoreA;
    });

    if (!colors.length) return;

    const primary = colors[0].rgb;
    const secondary =
      colors.find((color) => {
        const contrast = Math.abs(luminance(color.rgb) - luminance(primary));
        return contrast > 55;
      })?.rgb ||
      colors.find((color) => luminance(color.rgb) < luminance(primary))?.rgb ||
      [26, 26, 46];

    onColorsDetected?.({
      primaryColor: rgbToHex(primary[0], primary[1], primary[2]),
      secondaryColor: rgbToHex(secondary[0], secondary[1], secondary[2]),
    });
  }

  async function handleFile(file?: File) {
    if (!file) return;
    setError("");
    setIsUploading(true);
    await detectLogoColors(file).catch(() => undefined);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const payload = await response.json();
    setIsUploading(false);

    if (!response.ok) {
      setError(payload.message || "Não foi possível enviar o logo.");
      return;
    }

    onChange(payload.url);
  }

  return (
    <div className="grid gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Logo da loja"
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <ImagePlus className="text-slate-400" size={30} />
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-60"
          >
            <UploadCloud size={16} />
            {isUploading ? "Enviando..." : "Enviar logo"}
          </button>
          {value ? (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-red-500 hover:text-red-600"
            >
              <X size={16} />
              Remover
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-xs text-slate-500">JPG, PNG ou WebP, máximo 2 MB.</p>
      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
    </div>
  );
}
