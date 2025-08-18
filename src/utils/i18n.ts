/**
 * Internationalization utility functions
 */

import { supportedLanguages } from '../i18n/config'
import type { SupportedLanguage } from '../i18n/config'
import type { LanguageDirection } from '../types/i18n'

/**
 * Format numbers according to locale
 */
export function formatNumber(
  number: number,
  locale: SupportedLanguage,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(number)
}

/**
 * Format currency according to locale
 */
export function formatCurrency(
  amount: number,
  locale: SupportedLanguage,
  currency = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount)
}

/**
 * Format dates according to locale
 */
export function formatDate(
  date: Date,
  locale: SupportedLanguage,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(locale, options).format(date)
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(
  date: Date,
  locale: SupportedLanguage,
  baseDate: Date = new Date()
): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const diffInSeconds = (date.getTime() - baseDate.getTime()) / 1000
  
  const intervals = [
    { unit: 'year' as const, seconds: 31536000 },
    { unit: 'month' as const, seconds: 2628000 },
    { unit: 'day' as const, seconds: 86400 },
    { unit: 'hour' as const, seconds: 3600 },
    { unit: 'minute' as const, seconds: 60 },
    { unit: 'second' as const, seconds: 1 }
  ]
  
  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds)
    if (count >= 1) {
      return rtf.format(diffInSeconds < 0 ? -count : count, interval.unit)
    }
  }
  
  return rtf.format(0, 'second')
}

/**
 * Get language direction (LTR/RTL)
 */
export function getLanguageDirection(language: SupportedLanguage): LanguageDirection {
  const rtlLanguages: SupportedLanguage[] = ['ar', 'ur']
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr'
}

/**
 * Check if language is RTL
 */
export function isRTL(language: SupportedLanguage): boolean {
  return getLanguageDirection(language) === 'rtl'
}

/**
 * Get language info by code
 */
export function getLanguageInfo(code: SupportedLanguage) {
  return supportedLanguages.find(lang => lang.code === code)
}

/**
 * Get browser's preferred language
 */
export function getBrowserLanguage(): SupportedLanguage | null {
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage
  return supportedLanguages.find(lang => lang.code === browserLang)?.code || null
}

/**
 * Validate if language code is supported
 */
export function isValidLanguage(code: string): code is SupportedLanguage {
  return supportedLanguages.some(lang => lang.code === code)
}

/**
 * Get hreflang attributes for SEO
 */
export function getHrefLangAttributes(currentPath: string) {
  return supportedLanguages.map(lang => ({
    hrefLang: lang.code,
    href: `/${lang.code}${currentPath}`
  }))
}

/**
 * Extract language from URL path
 */
export function getLanguageFromPath(pathname: string): SupportedLanguage | null {
  const segments = pathname.split('/')
  const potentialLang = segments[1] as SupportedLanguage
  return isValidLanguage(potentialLang) ? potentialLang : null
}

/**
 * Remove language prefix from path
 */
export function removeLanguageFromPath(pathname: string): string {
  const lang = getLanguageFromPath(pathname)
  if (lang) {
    return pathname.replace(`/${lang}`, '') || '/'
  }
  return pathname
}

/**
 * Add language prefix to path
 */
export function addLanguageToPath(pathname: string, language: SupportedLanguage): string {
  const cleanPath = removeLanguageFromPath(pathname)
  return `/${language}${cleanPath === '/' ? '' : cleanPath}`
}

/**
 * Get localized path for a given language
 */
export function getLocalizedPath(pathname: string, language: SupportedLanguage): string {
  const cleanPath = removeLanguageFromPath(pathname)
  return addLanguageToPath(cleanPath, language)
}

/**
 * Pluralization helper
 */
export function pluralize(
  count: number,
  singular: string,
  plural?: string,
  locale: SupportedLanguage = 'en'
): string {
  const pluralRules = new Intl.PluralRules(locale)
  const rule = pluralRules.select(count)
  
  if (rule === 'one') {
    return singular
  }
  
  return plural || `${singular}s`
}

/**
 * Sort array of items by localized string
 */
export function sortByLocalizedString<T>(
  items: T[],
  getStringFn: (item: T) => string,
  locale: SupportedLanguage,
  options?: Intl.CollatorOptions
): T[] {
  const collator = new Intl.Collator(locale, options)
  return [...items].sort((a, b) => collator.compare(getStringFn(a), getStringFn(b)))
}

/**
 * Get country flag emoji from language code
 */
export function getCountryFlag(language: SupportedLanguage): string {
  const flagMap: Record<SupportedLanguage, string> = {
    'en': '🇺🇸',
    'es': '🇪🇸',
    'pt': '🇵🇹',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'ru': '🇷🇺',
    'zh-Hans': '🇨🇳',
    'zh-Hant': '🇹🇼',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'ar': '🇸🇦',
    'hi': '🇮🇳',
    'bn': '🇧🇩',
    'ur': '🇵🇰',
    'tr': '🇹🇷',
    'vi': '🇻🇳',
    'th': '🇹🇭',
    'id': '🇮🇩',
    'ms': '🇲🇾'
  }
  
  return flagMap[language] || '🌐'
}

/**
 * Get reading direction class for CSS
 */
export function getDirectionClass(language: SupportedLanguage): string {
  return isRTL(language) ? 'rtl' : 'ltr'
}

/**
 * Get text alignment based on language direction
 */
export function getTextAlign(language: SupportedLanguage): 'left' | 'right' {
  return isRTL(language) ? 'right' : 'left'
}

/**
 * Get margin/padding direction helpers
 */
export function getStartEnd(language: SupportedLanguage) {
  const isRtl = isRTL(language)
  return {
    start: isRtl ? 'right' : 'left',
    end: isRtl ? 'left' : 'right',
    marginStart: isRtl ? 'marginRight' : 'marginLeft',
    marginEnd: isRtl ? 'marginLeft' : 'marginRight',
    paddingStart: isRtl ? 'paddingRight' : 'paddingLeft',
    paddingEnd: isRtl ? 'paddingLeft' : 'paddingRight'
  }
}

/**
 * Escape translation interpolation values
 */
export function escapeInterpolation(value: string): string {
  return value.replace(/{{/g, '\\{{').replace(/}}/g, '\\}}')
}

/**
 * Create a translation key path
 */
export function createTranslationKey(...parts: string[]): string {
  return parts.filter(Boolean).join('.')
}

/**
 * Check if translation key exists (for development)
 */
export function hasTranslationKey(key: string, translations: Record<string, any>): boolean {
  const keys = key.split('.')
  let current = translations
  
  for (const k of keys) {
    if (typeof current !== 'object' || current === null || !(k in current)) {
      return false
    }
    current = current[k]
  }
  
  return typeof current === 'string'
}

/**
 * Get nested translation value
 */
export function getNestedTranslation(key: string, translations: Record<string, any>): string | null {
  const keys = key.split('.')
  let current = translations
  
  for (const k of keys) {
    if (typeof current !== 'object' || current === null || !(k in current)) {
      return null
    }
    current = current[k]
  }
  
  return typeof current === 'string' ? current : null
}