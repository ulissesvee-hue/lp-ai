import { prisma } from "@/lib/prisma";
import { getDemoClientBySlug, isDemoMode } from "@/lib/demo-store";

export type LandingClient = {
  id: string;
  slug: string;
  isActive: boolean;
  storeName: string;
  ownerName: string;
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
  services: string[];
  brandLogos: string[];
  ga4MeasurementId: string | null;
  metaPixelId: string | null;
  googleAdsPixelId: string | null;
  hasWebhook: boolean;
  reviews: {
    id: string;
    authorName: string;
    rating: number;
    comment: string;
    reviewDate: string;
  }[];
};

function parseServices(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}

export async function getLandingClient(slug: string) {
  let client;

  try {
    client = await prisma.client.findUnique({
      where: { slug },
      include: { reviews: { orderBy: { reviewDate: "desc" } } },
    });
  } catch {
    if (!isDemoMode()) {
      throw new Error("Não foi possível conectar ao banco.");
    }
    client = await getDemoClientBySlug(slug);
  }

  if (!client || !client.isActive) {
    return null;
  }

  return {
    id: client.id,
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
    hasWebhook: Boolean(client.webhookUrl),
    reviews: client.reviews.map((review) => ({
      id: review.id,
      authorName: review.authorName,
      rating: review.rating,
      comment: review.comment,
      reviewDate:
        review.reviewDate instanceof Date
          ? review.reviewDate.toISOString()
          : review.reviewDate,
    })),
  } satisfies LandingClient;
}
