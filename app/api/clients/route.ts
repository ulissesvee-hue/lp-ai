import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { clientInputSchema } from "@/lib/validations";
import { createDemoClient, isDemoMode, listDemoClients } from "@/lib/demo-store";

function unauthorized() {
  return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
}

function validationError(error: unknown) {
  return NextResponse.json(
    { message: "Revise os campos do formulário.", error },
    { status: 422 },
  );
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();

  let clients;

  try {
    clients = await prisma.client.findMany({
      where: query
        ? {
            OR: [
              { storeName: { contains: query, mode: "insensitive" } },
              { slug: { contains: query, mode: "insensitive" } },
              { city: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      include: { reviews: { orderBy: { reviewDate: "desc" } } },
    });
  } catch {
    if (!isDemoMode()) throw new Error("Não foi possível conectar ao banco.");
    clients = await listDemoClients(query);
  }

  return NextResponse.json({ clients });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = clientInputSchema.safeParse(body);

  if (!parsed.success) {
    return validationError(parsed.error.flatten());
  }

  const data = parsed.data;

  try {
    const existing = await prisma.client.findUnique({ where: { slug: data.slug } });

    if (existing) {
      return NextResponse.json(
        { message: "Este slug já está em uso." },
        { status: 409 },
      );
    }

    const client = await prisma.client.create({
      data: {
        slug: data.slug,
        isActive: data.isActive,
        storeName: data.storeName,
        ownerName: data.ownerName || data.storeName,
        logoUrl: data.logoUrl,
        bio: data.bio,
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: null,
        address: data.address,
        complement: null,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        openingHours: data.openingHours,
        googleBusinessUrl: data.googleBusinessUrl,
        googlePlaceId: null,
        googleRating: data.googleRating,
        googleReviewCount: data.googleReviewCount,
        instagram: data.instagram,
        facebook: data.facebook,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        services: data.services,
        brandLogos: data.brandLogos,
        ga4MeasurementId: null,
        metaPixelId: data.metaPixelId,
        googleAdsPixelId: data.googleAdsPixelId,
        webhookUrl: data.webhookUrl,
        reviews: {
          create: data.reviews.map((review) => ({
            authorName: review.authorName,
            rating: review.rating,
            comment: review.comment,
            reviewDate: review.reviewDate ? new Date(review.reviewDate) : new Date(),
          })),
        },
      },
      include: { reviews: { orderBy: { reviewDate: "desc" } } },
    });

    return NextResponse.json({ client }, { status: 201 });
  } catch (error) {
    if (!isDemoMode()) {
      throw error;
    }

    try {
      const client = await createDemoClient(data);
      return NextResponse.json({ client }, { status: 201 });
    } catch (demoError) {
      const message =
        demoError instanceof Error
          ? demoError.message
          : "Não foi possível salvar em modo demo.";
      return NextResponse.json({ message }, { status: 409 });
    }
  }
}
