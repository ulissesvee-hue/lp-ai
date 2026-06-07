import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { LandingPage } from "@/components/landing/LandingPage";
import { getClientPublicUrl } from "@/lib/format";
import { getLandingClient } from "@/lib/landing";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const client = await getLandingClient(params.slug);

  if (!client) {
    return { title: "Página não encontrada" };
  }

  const description = `${client.bio.slice(0, 155)}${
    client.bio.length > 155 ? "..." : ""
  }`;

  return {
    title: `${client.storeName} | Materiais de construção em ${client.city} - ${client.state}`,
    description,
    openGraph: {
      title: client.storeName,
      description,
      images: client.logoUrl ? [{ url: client.logoUrl }] : [],
      locale: "pt_BR",
      type: "website",
    },
  };
}

export default async function SitePage({
  params,
}: {
  params: { slug: string };
}) {
  const client = await getLandingClient(params.slug);

  if (!client) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HardwareStore",
    name: client.storeName,
    description: client.bio,
    image: client.logoUrl,
    telephone: client.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: client.address,
      addressLocality: client.city,
      addressRegion: client.state,
      postalCode: client.zipCode,
      addressCountry: "BR",
    },
    openingHours: client.openingHours,
    url: getClientPublicUrl(client.slug),
    ...(client.googleRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: client.googleRating,
        reviewCount: client.googleReviewCount,
      },
    }),
  };
  const googleAdsBaseId = client.googleAdsPixelId?.split("/")[0] || null;

  return (
    <>
      {client.metaPixelId ? (
        <Script id={`meta-pixel-${client.slug}`} strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', ${JSON.stringify(client.metaPixelId)});
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}

      {googleAdsBaseId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsBaseId}`}
            strategy="afterInteractive"
          />
          <Script id={`google-ads-${client.slug}`} strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', ${JSON.stringify(googleAdsBaseId)});
            `}
          </Script>
        </>
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingPage client={client} />
    </>
  );
}
