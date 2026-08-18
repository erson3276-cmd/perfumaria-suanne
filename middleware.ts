import { NextRequest, NextResponse } from "next/server";

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(key);

  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.mercadopago.com https://connect.facebook.net https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.mercadopago.com https://graph.facebook.com https://www.google-analytics.com; frame-src https://sdk.mercadopago.com;",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIp(req);

  if (pathname.startsWith("/api/")) {
    let limit = 30;
    let windowMs = 60_000;

    if (pathname.startsWith("/api/payment") || pathname.startsWith("/api/pix")) {
      limit = 10;
    }
    if (pathname.startsWith("/api/checkout")) {
      limit = 10;
    }
    if (pathname.startsWith("/api/webhook")) {
      limit = 60;
    }

    if (isRateLimited(`api:${ip}:${pathname}`, limit, windowMs)) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente em instantes." },
        { status: 429 }
      );
    }

    if (req.method === "POST" && pathname.startsWith("/api/webhook")) {
      const origin = req.headers.get("origin");
      if (origin && origin !== req.nextUrl.origin) {
        return NextResponse.json({ error: "Origem inválida." }, { status: 403 });
      }
    }
  }

  if (pathname === "/api/webhook" && req.method === "GET") {
    return NextResponse.json({ error: "Not allowed." }, { status: 405 });
  }

  const res = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    res.headers.set(key, value);
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
