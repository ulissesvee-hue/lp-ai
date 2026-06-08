export function getBaseDomain() {
  return process.env.BASE_DOMAIN || "aceleraobra.com.br";
}

export function getClientPublicUrl(slug: string) {
  return `https://${slug}.${getBaseDomain()}`;
}

export function getClientUrlForOrigin(slug: string, origin?: string) {
  if (!origin) return getClientPublicUrl(slug);

  try {
    const url = new URL(origin);
    const baseDomain = getBaseDomain();

    if (
      url.hostname === baseDomain ||
      url.hostname === `www.${baseDomain}` ||
      url.hostname.endsWith(`.${baseDomain}`)
    ) {
      return getClientPublicUrl(slug);
    }

    return `${url.origin}/site/${slug}`;
  } catch {
    return getClientPublicUrl(slug);
  }
}

export function getLocalPreviewUrl(slug: string) {
  return `/site/${slug}`;
}

export function buildWhatsAppUrl(whatsapp?: string | null, message?: string) {
  if (!whatsapp) return "#";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${whatsapp}${text}`;
}

export function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function formatShortAddress(input: {
  city: string;
  state: string;
  neighborhood?: string | null;
}) {
  return [input.neighborhood, input.city, input.state].filter(Boolean).join(" - ");
}

export function formatFullAddress(input: {
  address: string;
  complement?: string | null;
  neighborhood?: string | null;
  city: string;
  state: string;
  zipCode?: string | null;
}) {
  return [
    input.address,
    input.complement,
    input.neighborhood,
    `${input.city} - ${input.state}`,
    input.zipCode,
  ]
    .filter(Boolean)
    .join(", ");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
