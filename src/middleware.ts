import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18nConfig } from './i18n/config'

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname

  // Check if the pathname already has a locale
  const pathnameHasLocale = i18nConfig.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Get the preferred locale from cookie or headers
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  
  // Redirect if there is no locale
  let locale = cookieLocale || i18nConfig.defaultLocale
  
  // Validate the locale
  if (!i18nConfig.locales.includes(locale as any)) {
    locale = i18nConfig.defaultLocale
  }

  return NextResponse.redirect(
    new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
  )
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)']
}
