import type { Client, Review } from "@prisma/client";
import { clientFormDefaults, type ClientInput } from "@/lib/validations";

type ClientWithReviews = (Client & { reviews: Review[] }) | {
  slug: string;
  isActive: boolean;
  storeName: string;
  ownerName: string | null;
  logoUrl: string | null;
  bio: string;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string;
  complement: string | null;
  neighborhood: string | null;
  city: string;
  state: string;
  zipCode: string | null;
  openingHours: string | null;
  googleBusinessUrl: string | null;
  googlePlaceId: string | null;
  googleRating: number | null;
  googleReviewCount: number | null;
  instagram: string | null;
  facebook: string | null;
  primaryColor: string;
  secondaryColor: string;
  services: unknown;
  brandLogos?: unknown;
  ga4MeasurementId: string | null;
  metaPixelId?: string | null;
  googleAdsPixelId?: string | null;
  webhookUrl?: string | null;
  reviews: Array<{
    id: string;
    authorName: string;
    rating: number;
    comment: string;
    reviewDate: Date | string;
  }>;
};

function parseServices(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

function toDateInput(value: Date | string) {
  return value instanceof Date
    ? value.toISOString().slice(0, 10)
    : new Date(value).toISOString().slice(0, 10);
}

export function serializeClientForForm(client: ClientWithReviews): ClientInput {
  return {
    ...clientFormDefaults,
    slug: client.slug,
    isActive: client.isActive,
    storeName: client.storeName,
    ownerName: client.ownerName || client.storeName,
    logoUrl: client.logoUrl,
    bio: client.bio,
    phone: client.phone,
    whatsapp: client.whatsapp,
    email: client.email,
    address: client.address,
    complement: client.complement,
    neighborhood: client.neighborhood,
    city: client.city,
    state: client.state,
    zipCode: client.zipCode,
    openingHours: client.openingHours,
    googleBusinessUrl: client.googleBusinessUrl,
    googlePlaceId: client.googlePlaceId,
    googleRating: client.googleRating,
    googleReviewCount: client.googleReviewCount,
    instagram: client.instagram,
    facebook: client.facebook,
    primaryColor: client.primaryColor,
    secondaryColor: client.secondaryColor,
    services: parseServices(client.services),
    brandLogos: parseServices(client.brandLogos),
    ga4MeasurementId: client.ga4MeasurementId,
    metaPixelId: client.metaPixelId || null,
    googleAdsPixelId: client.googleAdsPixelId || null,
    webhookUrl: client.webhookUrl || null,
    reviews: client.reviews.map((review) => ({
      id: review.id,
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      reviewDate: toDateInput(review.reviewDate),
    })),
  };
}
