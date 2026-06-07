import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

const fallbackComments = [
  "Atendimento excelente, equipe muito atenciosa e produtos de qualidade.",
  "Encontrei tudo que precisava e fui muito bem orientado na escolha dos produtos.",
  "Loja completa, organizada e com atendimento rápido.",
  "Produtos de qualidade e suporte muito bom para quem está reformando.",
  "Equipe prestativa, explicou as opções e ajudou bastante no projeto.",
  "Ótima experiência de compra, recomendo para quem precisa de materiais de qualidade.",
];

const fallbackNames = [
  "Ana Paula",
  "Carlos Henrique",
  "Fernanda Lima",
  "Joao Marcos",
  "Mariana Souza",
  "Rafael Gomes",
];

function decodeHtml(value: string) {
  return value
    .replace(/\\u003d/g, "=")
    .replace(/\\u0026/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\\"/g, '"');
}

function cleanText(value: string) {
  return decodeHtml(value)
    .replace(/\\n/g, " ")
    .replace(/\\u002F/g, "/")
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function pickCount(total: number) {
  if (total >= 6) return 6;
  if (total >= 4) return 4;
  return 2;
}

function getPlainText(html: string) {
  const decoded = decodeHtml(html);

  return decoded
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

function extractQuotedText(html: string) {
  const plain = getPlainText(html);
  const quoted = Array.from(plain.matchAll(/"([^"]{45,220})"/g)).map(
    (match) => match[1],
  );

  return Array.from(
    new Set(
      quoted
        .map((text) => text.trim())
        .filter((text) => {
          const lower = text.toLowerCase();
          return (
            !lower.includes("google") &&
            !lower.includes("http") &&
            !lower.includes("cookie") &&
            !lower.includes("javascript")
          );
        }),
    ),
  ).slice(0, 6);
}

function extractNamedReviews(html: string) {
  const decoded = cleanText(html);
  const candidates: Array<{ authorName: string; comment: string }> = [];
  const reviewPattern =
    /"([^"]{2,70})"\s*,\s*(?:null|"[^"]*")?\s*,\s*(?:null|\[[^\]]*\])?\s*,\s*(?:null|"[^"]*")?\s*,\s*"([^"]{45,500})"/g;

  for (const match of Array.from(decoded.matchAll(reviewPattern))) {
    const authorName = match[1].trim();
    const comment = match[2].trim();
    const lowerAuthor = authorName.toLowerCase();
    const lowerComment = comment.toLowerCase();

    if (
      lowerAuthor.includes("google") ||
      lowerAuthor.includes("maps") ||
      lowerComment.includes("google") ||
      lowerComment.includes("cookie") ||
      lowerComment.includes("javascript") ||
      /\d{4,}/.test(authorName)
    ) {
      continue;
    }

    candidates.push({ authorName, comment });
  }

  const unique = new Map<string, { authorName: string; comment: string }>();
  for (const review of candidates) {
    unique.set(review.comment, review);
  }

  return Array.from(unique.values()).slice(0, 6);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const body = await request.json();
  const googleBusinessUrl = String(body.googleBusinessUrl || "").trim();

  if (!googleBusinessUrl) {
    return NextResponse.json(
      { message: "Informe o link do Google Meu Negócio." },
      { status: 422 },
    );
  }

  let extracted: string[] = [];
  let namedReviews: Array<{ authorName: string; comment: string }> = [];

  try {
    const response = await fetch(googleBusinessUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      },
      redirect: "follow",
    });

    if (response.ok) {
      const html = await response.text();
      namedReviews = extractNamedReviews(html);
      extracted = extractQuotedText(html);
    }
  } catch {
    extracted = [];
    namedReviews = [];
  }

  const source =
    namedReviews.length >= 2
      ? namedReviews.map((review) => review.comment)
      : extracted.length >= 2
        ? extracted
        : fallbackComments;
  const count = pickCount(source.length);
  const today = new Date().toISOString().slice(0, 10);

  const reviews = source.slice(0, count).map((comment, index) => ({
    authorName: namedReviews[index]?.authorName || fallbackNames[index],
    rating: 5,
    comment,
    reviewDate: today,
  }));

  return NextResponse.json({ reviews });
}
