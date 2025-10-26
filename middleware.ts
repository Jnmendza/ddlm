import { NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

import { defaultLocale, locales } from "./src/i18n/locales";
import type { Locale } from "./src/i18n/locales";

function getLocale(request: NextRequest): Locale {
  const negotiatorHeaders: Record<string, string> = {};

  // Negotiator expects a plain object, not a Headers instance
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value;
  });

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return match(languages, locales, defaultLocale) as Locale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip next internal requests
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const url = request.nextUrl.clone();
    const pathnameWithoutLeadingSlash = pathname.replace(/^\//, "");
    url.pathname =
      `/${locale}` +
      (pathnameWithoutLeadingSlash ? `/${pathnameWithoutLeadingSlash}` : "");

    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale);
    return response;
  }

  const currentLocale =
    locales.find((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) ??
    defaultLocale;

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", currentLocale);
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
