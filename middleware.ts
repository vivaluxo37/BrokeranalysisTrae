import { NextRequest, NextResponse } from 'next/server'
import { geolocation } from '@vercel/edge'

// Country code to language mapping
const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  // English-speaking countries
  'US': 'en',
  'GB': 'en',
  'CA': 'en',
  'AU': 'en',
  'NZ': 'en',
  'IE': 'en',
  'ZA': 'en',
  
  // Spanish-speaking countries
  'ES': 'es',
  'MX': 'es',
  'AR': 'es',
  'CO': 'es',
  'PE': 'es',
  'VE': 'es',
  'CL': 'es',
  'EC': 'es',
  'GT': 'es',
  'CU': 'es',
  'BO': 'es',
  'DO': 'es',
  'HN': 'es',
  'PY': 'es',
  'SV': 'es',
  'NI': 'es',
  'CR': 'es',
  'PA': 'es',
  'UY': 'es',
  'GQ': 'es',
  
  // French-speaking countries
  'FR': 'fr',
  'BE': 'fr',
  'CH': 'fr',
  'LU': 'fr',
  'MC': 'fr',
  'CA': 'fr', // Quebec
  'SN': 'fr',
  'CI': 'fr',
  'ML': 'fr',
  'BF': 'fr',
  'NE': 'fr',
  'TD': 'fr',
  'MG': 'fr',
  'CM': 'fr',
  'TG': 'fr',
  'BJ': 'fr',
  'BI': 'fr',
  'CF': 'fr',
  'CG': 'fr',
  'CD': 'fr',
  'DJ': 'fr',
  'GA': 'fr',
  'GN': 'fr',
  'HT': 'fr',
  'KM': 'fr',
  'RW': 'fr',
  'SC': 'fr',
  'VU': 'fr',
  
  // German-speaking countries
  'DE': 'de',
  'AT': 'de',
  'CH': 'de', // Switzerland (multilingual)
  'LI': 'de',
  'LU': 'de', // Luxembourg (multilingual)
}

// Supported languages in the app
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr', 'de']

// Cookie name for locale confirmation
const LOCALE_CONFIRMED_COOKIE = 'localeConfirmed'

/**
 * Vercel Middleware for GEO-based locale suggestion
 * 
 * This middleware:
 * 1. Reads geolocation data from Vercel's edge network
 * 2. Maps country codes to supported languages
 * 3. Sets a response header to suggest locale if not confirmed
 * 4. Does NOT redirect automatically (SEO-friendly)
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  
  try {
    // Get geolocation data from Vercel
    const geo = geolocation(request)
    const countryCode = geo.country
    
    // Check if user has already confirmed their locale preference
    const localeConfirmed = request.cookies.get(LOCALE_CONFIRMED_COOKIE)?.value
    
    // Check if URL already has a language prefix
    const pathname = request.nextUrl.pathname
    const hasLanguagePrefix = SUPPORTED_LANGUAGES.some(lang => 
      pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
    )
    
    // Only suggest locale if:
    // 1. User hasn't confirmed their locale preference
    // 2. URL doesn't have a language prefix
    // 3. We have a country code from geolocation
    if (!localeConfirmed && !hasLanguagePrefix && countryCode) {
      // Map country to language
      const suggestedLanguage = COUNTRY_TO_LANGUAGE[countryCode]
      
      // Only suggest if we support the language and it's not the default (en)
      if (suggestedLanguage && 
          SUPPORTED_LANGUAGES.includes(suggestedLanguage) && 
          suggestedLanguage !== 'en') {
        
        // Set response header for the SPA to read
        response.headers.set('x-suggest-locale', suggestedLanguage)
        response.headers.set('x-detected-country', countryCode)
        response.headers.set('x-country-flag', geo.flag || '')
      }
    }
    
    // Add CORS headers for the SPA to read custom headers
    response.headers.set('Access-Control-Expose-Headers', 'x-suggest-locale,x-detected-country,x-country-flag')
    
  } catch (error) {
    // Silently fail - don't break the app if geolocation fails
    console.warn('Geolocation middleware error:', error)
  }
  
  return response
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|assets).*)',
  ],
}