import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['th', 'en'];
const defaultLocale = 'th';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip if public files or internal Next.js/API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return;
  }

  // 2. Check if pathname already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // 3. Redirect if no locale matches
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\.).*)'],
};
