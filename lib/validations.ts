import { z } from "zod";

export const BLOCKED_SLUGS = [
  "www",
  "admin",
  "api",
  "app",
  "mail",
  "smtp",
  "dev",
  "staging",
  "test",
  "suporte",
  "contato",
];

const nullableString = z.preprocess((value) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}, z.string().nullable());

const nullableEmail = z.preprocess((value) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}, z.string().email("Informe um e-mail válido.").nullable());

const nullableUrl = z.preprocess((value) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}, z.string().url("Informe uma URL válida.").nullable());

const nullableLogoUrl = z.preprocess((value) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}, z.string().refine((value) => {
  return value.startsWith("/") || z.string().url().safeParse(value).success;
}, "Informe uma URL válida.").nullable());

const nullableGoogleRating = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}, z.number().min(0).max(5).nullable());

const nullableCount = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return null;
  return Number(value);
}, z.number().int().min(0).nullable());

const nullableMetaPixelId = z.preprocess((value) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}, z.string().regex(/^\d{5,30}$/, "Informe apenas o ID numérico do Pixel da Meta.").nullable());

const nullableGoogleAdsPixelId = z.preprocess((value) => {
  if (typeof value !== "string") return value ?? null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}, z.string().regex(/^AW-\d{5,30}(\/[A-Za-z0-9_-]+)?$/, "Use o formato AW-000000000 ou AW-000000000/label.").nullable());

export function normalizeWhatsApp(value?: string | null) {
  const digits = value?.replace(/\D/g, "") || "";
  if (!digits) return null;
  return digits.startsWith("55") ? digits : `55${digits}`;
}

const nullableWhatsApp = z.preprocess((value) => {
  if (typeof value !== "string") return value ?? null;
  return normalizeWhatsApp(value);
}, z.string().regex(/^55\d{10,11}$/, "Informe DDD e número do WhatsApp.").nullable());

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Use pelo menos 3 caracteres.")
  .max(50, "Use no máximo 50 caracteres.")
  .regex(/^[a-z0-9-]+$/, "Use apenas letras minúsculas, números e hífen.")
  .refine((value) => !BLOCKED_SLUGS.includes(value), {
    message: "Este slug é reservado.",
  });

export const reviewInputSchema = z.object({
  id: z.string().optional(),
  authorName: z.string().trim().min(2, "Informe o nome."),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().min(5, "Informe o comentário."),
  reviewDate: z.string().optional().nullable(),
});

export const clientInputSchema = z.object({
  slug: slugSchema,
  isActive: z.boolean().default(true),
  storeName: z.string().trim().min(2, "Informe o nome da loja."),
  ownerName: nullableString,
  logoUrl: nullableLogoUrl,
  bio: z.string().trim().min(50, "Escreva pelo menos 50 caracteres."),
  phone: nullableString,
  whatsapp: nullableWhatsApp,
  email: nullableEmail,
  address: z.string().trim().min(3, "Informe rua e número."),
  complement: nullableString,
  neighborhood: nullableString,
  city: z.string().trim().min(2, "Informe a cidade."),
  state: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2}$/, "Informe a UF."),
  zipCode: nullableString,
  openingHours: nullableString,
  googleBusinessUrl: nullableUrl,
  googlePlaceId: nullableString,
  googleRating: nullableGoogleRating,
  googleReviewCount: nullableCount,
  instagram: nullableString,
  facebook: nullableString,
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Informe uma cor hexadecimal."),
  secondaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Informe uma cor hexadecimal."),
  services: z
    .array(z.string().trim().min(1))
    .default([])
    .transform((items) => Array.from(new Set(items.map((item) => item.trim())))),
  brandLogos: z
    .array(nullableLogoUrl)
    .default([])
    .transform((items) => items.filter((item): item is string => Boolean(item))),
  ga4MeasurementId: nullableString,
  metaPixelId: nullableMetaPixelId,
  googleAdsPixelId: nullableGoogleAdsPixelId,
  webhookUrl: nullableUrl,
  reviews: z.array(reviewInputSchema).default([]),
});

export type ClientInput = z.infer<typeof clientInputSchema>;

export const clientFormDefaults: ClientInput = {
  slug: "",
  isActive: true,
  storeName: "",
  ownerName: null,
  logoUrl: null,
  bio: "",
  phone: null,
  whatsapp: null,
  email: null,
  address: "",
  complement: null,
  neighborhood: null,
  city: "",
  state: "",
  zipCode: null,
  openingHours: null,
  googleBusinessUrl: null,
  googlePlaceId: null,
  googleRating: null,
  googleReviewCount: null,
  instagram: null,
  facebook: null,
  primaryColor: "#FF6B00",
  secondaryColor: "#1A1A2E",
  services: [],
  brandLogos: [],
  ga4MeasurementId: null,
  metaPixelId: null,
  googleAdsPixelId: null,
  webhookUrl: null,
  reviews: [],
};

export const productSuggestions = [
  "Tintas",
  "Massa Corrida",
  "Textura",
  "Impermeabilizante",
  "Argamassa",
  "Cimento",
  "Drywall",
  "Ferragens",
  "Solventes",
  "Elétrica",
];

export const brazilianStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];
