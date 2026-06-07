import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { clientInputSchema } from "@/lib/validations";
import {
  deactivateDemoClient,
  deleteDemoClient,
  getDemoClientById,
  isDemoMode,
  updateDemoClient,
} from "@/lib/demo-store";

function unauthorized() {
  return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
}

function notFound() {
  return NextResponse.json({ message: "Cliente não encontrado." }, { status: 404 });
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  let client;

  try {
    client = await prisma.client.findUnique({
      where: { id: params.id },
      include: { reviews: { orderBy: { reviewDate: "desc" } } },
    });
  } catch {
    if (!isDemoMode()) throw new Error("Não foi possível conectar ao banco.");
    client = await getDemoClientById(params.id);
  }

  if (!client) return notFound();

  return NextResponse.json({ client });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const body = await request.json();
  const parsed = clientInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Revise os campos do formulário.", error: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;
  try {
    const duplicate = await prisma.client.findFirst({
      where: {
        slug: data.slug,
        NOT: { id: params.id },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        { message: "Este slug já está em uso." },
        { status: 409 },
      );
    }

    const client = await prisma.client.update({
      where: { id: params.id },
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
          deleteMany: {},
          create: data.reviews.map((review) => ({
            authorName: review.authorName,
            rating: review.rating,
            comment: review.comment,
            reviewDate: review.reviewDate
              ? new Date(review.reviewDate)
              : new Date(),
          })),
        },
      },
      include: { reviews: { orderBy: { reviewDate: "desc" } } },
    });

    return NextResponse.json({ client });
  } catch {
    if (!isDemoMode()) return notFound();

    try {
      const client = await updateDemoClient(params.id, data);
      if (!client) return notFound();
      return NextResponse.json({ client });
    } catch (demoError) {
      const message =
        demoError instanceof Error
          ? demoError.message
          : "Não foi possível salvar em modo demo.";
      return NextResponse.json({ message }, { status: 409 });
    }
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getAdminSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(request.url);
  const hardDelete = searchParams.get("hardDelete") === "true";

  try {
    if (hardDelete) {
      const client = await prisma.client.delete({
        where: { id: params.id },
      });

      return NextResponse.json({ client });
    }

    const client = await prisma.client.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ client });
  } catch {
    if (isDemoMode()) {
      if (hardDelete) {
        const deleted = await deleteDemoClient(params.id);
        if (deleted) return NextResponse.json({ client: deleted });
      }

      const client = await deactivateDemoClient(params.id);
      if (client) return NextResponse.json({ client });
    }
    return notFound();
  }
}
