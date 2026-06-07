import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const baseDomain = process.env.BASE_DOMAIN || "aceleraobra.com.br";

  const isMainDomain = hostname === baseDomain || hostname === `www.${baseDomain}`;
  const isAdminDomain = hostname.startsWith("admin.");
  const isLocalhost =
    hostname.includes("localhost") || hostname.includes("127.0.0.1");

  if (isMainDomain || isAdminDomain) {
    return NextResponse.next();
  }

  if (isLocalhost) {
    const slug = request.nextUrl.searchParams.get("slug");
    if (slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/site/${slug}`;
      url.searchParams.delete("slug");
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  const slug = hostname.replace(`.${baseDomain}`, "");
  if (slug && slug !== hostname) {
    const url = request.nextUrl.clone();
    url.pathname = `/site/${slug}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
