/**
 * TypeScript types for internationalization (i18n) system
 */

import type { SupportedLanguage } from '../i18n/config'

/**
 * Language information structure
 */
export interface LanguageInfo {
  code: SupportedLanguage
  name: string
  nativeName: string
  flag: string
  rtl?: boolean
}

/**
 * Translation namespace structure
 */
export interface TranslationNamespaces {
  common: CommonTranslations
  broker?: BrokerTranslations
  auth?: AuthTranslations
  search?: SearchTranslations
  forms?: FormTranslations
  errors?: ErrorTranslations
}

/**
 * Common translations structure
 */
export interface CommonTranslations {
  nav: {
    home: string
    brokers: string
    compare: string
    education: string
    news: string
    about: string
    contact: string
    login: string
    register: string
    profile: string
    logout: string
  }
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    edit: string
    delete: string
    confirm: string
    back: string
    next: string
    previous: string
    submit: string
    reset: string
    clear: string
    close: string
    open: string
    view: string
    download: string
    upload: string
    search: string
    filter: string
    sort: string
    refresh: string
  }
  language: {
    title: string
    selectLanguage: string
    moreLanguages: string
    currentLanguage: string
  }
  footer: {
    copyright: string
    privacyPolicy: string
    termsOfService: string
    disclaimer: string
    contact: string
    followUs: string
  }
}

/**
 * Broker-specific translations
 */
export interface BrokerTranslations {
  title: string
  name: string
  rating: string
  reviews: string
  spread: string
  commission: string
  leverage: string
  regulation: string
  platforms: string
  instruments: string
  minDeposit: string
  accountTypes: string
  customerSupport: string
  pros: string
  cons: string
  overview: string
  features: string
  fees: string
  safety: string
}

/**
 * Authentication translations
 */
export interface AuthTranslations {
  login: string
  register: string
  logout: string
  email: string
  password: string
  confirmPassword: string
  forgotPassword: string
  resetPassword: string
  createAccount: string
  alreadyHaveAccount: string
  dontHaveAccount: string
  loginSuccess: string
  registerSuccess: string
  loginError: string
  registerError: string
}

/**
 * Search translations
 */
export interface SearchTranslations {
  placeholder: string
  results: string
  noResults: string
  filters: string
  clearFilters: string
  sortBy: string
  relevance: string
  rating: string
  name: string
  popularity: string
}

/**
 * Form translations
 */
export interface FormTranslations {
  required: string
  invalidEmail: string
  passwordTooShort: string
  passwordsDoNotMatch: string
  pleaseWait: string
  submitting: string
  submitted: string
  validationError: string
}

/**
 * Error translations
 */
export interface ErrorTranslations {
  general: string
  network: string
  notFound: string
  unauthorized: string
  forbidden: string
  serverError: string
  timeout: string
  retry: string
}

/**
 * Localized broker content from Supabase
 */
export interface BrokerLocalizedContent {
  id: string
  broker_id: string
  language_code: SupportedLanguage
  name?: string
  description?: string
  pros?: string[]
  cons?: string[]
  features?: Record<string, string>
  created_at: string
  updated_at: string
}

/**
 * Language detection options
 */
export interface LanguageDetectionOptions {
  order: string[]
  lookupQuerystring?: string
  lookupCookie?: string
  lookupLocalStorage?: string
  lookupSessionStorage?: string
  lookupFromPathIndex?: number
  lookupFromSubdomainIndex?: number
  caches?: string[]
  excludeCacheFor?: string[]
}

/**
 * i18n configuration options
 */
export interface I18nConfig {
  supportedLanguages: LanguageInfo[]
  defaultLanguage: SupportedLanguage
  fallbackLanguage: SupportedLanguage
  detection: LanguageDetectionOptions
  backend: {
    loadPath: string
    addPath?: string
    allowMultiLoading?: boolean
  }
  interpolation: {
    escapeValue: boolean
  }
  debug?: boolean
}

/**
 * Hreflang attribute for SEO
 */
export interface HrefLangAttribute {
  hrefLang: string
  href: string
}

/**
 * Language switching context
 */
export interface LanguageSwitchContext {
  from: SupportedLanguage
  to: SupportedLanguage
  timestamp: Date
  source: 'user' | 'auto' | 'browser'
}

/**
 * i18n analytics data
 */
export interface I18nAnalytics {
  languageUsage: Record<SupportedLanguage, number>
  switchEvents: LanguageSwitchContext[]
  missingTranslations: Array<{
    key: string
    language: SupportedLanguage
    namespace: string
    timestamp: Date
  }>
  loadTimes: Record<SupportedLanguage, number>
}

/**
 * Translation key paths (for type safety)
 */
export type TranslationKey = 
  | `nav.${keyof CommonTranslations['nav']}`
  | `common.${keyof CommonTranslations['common']}`
  | `language.${keyof CommonTranslations['language']}`
  | `footer.${keyof CommonTranslations['footer']}`
  | `broker.${keyof BrokerTranslations}`
  | `auth.${keyof AuthTranslations}`
  | `search.${keyof SearchTranslations}`
  | `forms.${keyof FormTranslations}`
  | `errors.${keyof ErrorTranslations}`

/**
 * Translation function type
 */
export type TranslationFunction = (key: TranslationKey, defaultValue?: string, options?: any) => string

/**
 * Language direction type
 */
export type LanguageDirection = 'ltr' | 'rtl'

/**
 * Export all types
 */
// Removed redundant re-export of SupportedLanguage to prevent module loading conflicts