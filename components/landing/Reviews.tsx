import { Star } from "lucide-react";
import type { LandingClient } from "@/lib/landing";
import { formatDate } from "@/lib/format";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-1 text-amber-400">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          size={17}
          className={index < rating ? "fill-amber-400" : "text-slate-300"}
        />
      ))}
    </span>
  );
}

export function Reviews({ client }: { client: LandingClient }) {
  return (
    <section id="avaliacoes" className="bg-white px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          <div className="reveal">
            <p
              className="mb-3 text-sm font-black uppercase"
              style={{ color: client.primaryColor }}
            >
              Motivos para escolher
            </p>
            <h2 className="font-display text-3xl font-black text-slate-950 md:text-5xl">
              {client.storeName}
            </h2>

            {client.googleRating ? (
              <div className="mt-8 rounded-lg bg-slate-950 p-6 text-white">
                <p className="font-display text-5xl font-black">
                  {client.googleRating.toFixed(1)}
                </p>
                <div className="mt-3">
                  <Stars rating={Math.round(client.googleRating)} />
                </div>
                {client.googleReviewCount ? (
                  <p className="mt-3 text-sm text-white/70">
                    {client.googleReviewCount} avaliações no Google
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {client.reviews.length ? (
              client.reviews.map((review) => (
                <article
                  key={review.id}
                  className="reveal rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display font-black text-slate-950">
                        {review.authorName}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-slate-400">
                        {formatDate(review.reviewDate)}
                      </p>
                    </div>
                    <Stars rating={review.rating} />
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {review.comment}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-slate-500 md:col-span-2">
                <p className="font-bold text-slate-700">
                  Avaliações em breve.
                </p>
                <p className="mt-2 text-sm">
                  Esta loja ainda não possui avaliações manuais cadastradas.
                </p>
              </div>
            )}
          </div>
        </div>

        {client.googleBusinessUrl ? (
          <div className="mt-10 flex justify-center">
            <a
              href={client.googleBusinessUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-md border border-slate-200 px-5 text-sm font-black text-slate-700 transition hover:border-[#FF6B00] hover:text-[#FF6B00]"
            >
              Ver todas no Google
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
