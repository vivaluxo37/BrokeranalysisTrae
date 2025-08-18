import { supabase } from '../lib/supabase'
import type { Locale } from '../types/supabase'
import type { SupportedLanguage } from '../i18n/config'

/**
 * Extended language information with display data
 */
export interface LanguageInfo {
  code: string
  label: string
  enabled: boolean
  flag?: string
  nativeName?: string
  direction?: 'ltr' | 'rtl'
}

/**
 * Language configuration with display information (Top 20 languages)
 */
const LANGUAGE_CONFIG: Record<string, { flag: string; nativeName: string; direction: 'ltr' | 'rtl' }> = {
  'en': { flag: '🇺🇸', nativeName: 'English', direction: 'ltr' },
  'es': { flag: '🇪🇸', nativeName: 'Español', direction: 'ltr' },
  'pt': { flag: '🇵🇹', nativeName: 'Português', direction: 'ltr' },
  'fr': { flag: '🇫🇷', nativeName: 'Français', direction: 'ltr' },
  'de': { flag: '🇩🇪', nativeName: 'Deutsch', direction: 'ltr' },
  'it': { flag: '🇮🇹', nativeName: 'Italiano', direction: 'ltr' },
  'ru': { flag: '🇷🇺', nativeName: 'Русский', direction: 'ltr' },
  'zh-Hans': { flag: '🇨🇳', nativeName: '简体中文', direction: 'ltr' },
  'zh-Hant': { flag: '🇹🇼', nativeName: '繁體中文', direction: 'ltr' },
  'ja': { flag: '🇯🇵', nativeName: '日本語', direction: 'ltr' },
  'ko': { flag: '🇰🇷', nativeName: '한국어', direction: 'ltr' },
  'ar': { flag: '🇸🇦', nativeName: 'العربية', direction: 'rtl' },
  'hi': { flag: '🇮🇳', nativeName: 'हिन्दी', direction: 'ltr' },
  'bn': { flag: '🇧🇩', nativeName: 'বাংলা', direction: 'ltr' },
  'ur': { flag: '🇵🇰', nativeName: 'اردو', direction: 'rtl' },
  'tr': { flag: '🇹🇷', nativeName: 'Türkçe', direction: 'ltr' },
  'vi': { flag: '🇻🇳', nativeName: 'Tiếng Việt', direction: 'ltr' },
  'th': { flag: '🇹🇭', nativeName: 'ไทย', direction: 'ltr' },
  'id': { flag: '🇮🇩', nativeName: 'Bahasa Indonesia', direction: 'ltr' },
  'ms': { flag: '🇲🇾', nativeName: 'Bahasa Melayu', direction: 'ltr' }
}

/**
 * Language Service for managing languages with Supabase integration
 */
export class LanguageService {
  private static instance: LanguageService
  private cachedLanguages: LanguageInfo[] | null = null
  private cacheTimestamp: number = 0
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  private constructor() {}

  static getInstance(): LanguageService {
    if (!LanguageService.instance) {
      LanguageService.instance = new LanguageService()
    }
    return LanguageService.instance
  }

  /**
   * Fetch available languages from Supabase locales table
   */
  async getAvailableLanguages(forceRefresh = false): Promise<LanguageInfo[]> {
    // Check cache first
    if (!forceRefresh && this.cachedLanguages && 
        (Date.now() - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.cachedLanguages
    }

    try {
      const { data: locales, error } = await supabase
        .from('locales')
        .select('code, label, enabled')
        .eq('enabled', true)
        .order('code')

      if (error) {
        console.warn('Supabase not available, using fallback languages:', error.message)
        return this.getFallbackLanguages()
      }

      if (!locales || locales.length === 0) {
        console.warn('No enabled locales found in database, using fallback')
        return this.getFallbackLanguages()
      }

      // Transform Supabase locales to LanguageInfo with display data
      const languages: LanguageInfo[] = locales.map(locale => {
        const displayInfo = LANGUAGE_CONFIG[locale.code] || {
          flag: '🌐',
          nativeName: locale.label,
          direction: 'ltr' as const
        }

        return {
          code: locale.code,
          label: locale.label,
          enabled: locale.enabled,
          flag: displayInfo.flag,
          nativeName: displayInfo.nativeName,
          direction: displayInfo.direction
        }
      })

      // Cache the results
      this.cachedLanguages = languages
      this.cacheTimestamp = Date.now()

      return languages
    } catch (error) {
      console.warn('Error connecting to Supabase, using fallback languages:', error)
      return this.getFallbackLanguages()
    }
  }

  /**
   * Get fallback languages when Supabase is unavailable
   * Returns all 20 languages from LANGUAGE_CONFIG
   */
  private getFallbackLanguages(): LanguageInfo[] {
    // Convert LANGUAGE_CONFIG to LanguageInfo array with all 20 languages
    return Object.entries(LANGUAGE_CONFIG).map(([code, config]) => ({
      code,
      label: config.nativeName, // Use native name as label for fallback
      enabled: true, // All languages enabled in fallback mode
      flag: config.flag,
      nativeName: config.nativeName,
      direction: config.direction
    }))
  }

  /**
   * Check if a language code is supported
   */
  async isLanguageSupported(languageCode: string): Promise<boolean> {
    const languages = await this.getAvailableLanguages()
    return languages.some(lang => lang.code === languageCode && lang.enabled)
  }

  /**
   * Get language information by code
   */
  async getLanguageInfo(languageCode: string): Promise<LanguageInfo | null> {
    const languages = await this.getAvailableLanguages()
    return languages.find(lang => lang.code === languageCode) || null
  }

  /**
   * Get supported language codes only
   */
  async getSupportedLanguageCodes(): Promise<string[]> {
    const languages = await this.getAvailableLanguages()
    return languages.filter(lang => lang.enabled).map(lang => lang.code)
  }

  /**
   * Clear language cache
   */
  clearCache(): void {
    this.cachedLanguages = null
    this.cacheTimestamp = 0
  }

  /**
   * Add a new language to Supabase (admin function)
   */
  async addLanguage(code: string, label: string, enabled = true): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('locales')
        .insert({ code, label, enabled })

      if (error) {
        console.error('Failed to add language:', error)
        return false
      }

      // Clear cache to force refresh
      this.clearCache()
      return true
    } catch (error) {
      console.error('Error adding language:', error)
      return false
    }
  }

  /**
   * Update language status (admin function)
   */
  async updateLanguageStatus(code: string, enabled: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('locales')
        .update({ enabled })
        .eq('code', code)

      if (error) {
        console.error('Failed to update language status:', error)
        return false
      }

      // Clear cache to force refresh
      this.clearCache()
      return true
    } catch (error) {
      console.error('Error updating language status:', error)
      return false
    }
  }

  /**
   * Get language direction (LTR/RTL)
   */
  getLanguageDirection(languageCode: string): 'ltr' | 'rtl' {
    const displayInfo = LANGUAGE_CONFIG[languageCode]
    return displayInfo?.direction || 'ltr'
  }

  /**
   * Check if language is RTL
   */
  isRTL(languageCode: string): boolean {
    return this.getLanguageDirection(languageCode) === 'rtl'
  }
}

// Export singleton instance
export const languageService = LanguageService.getInstance()

// Export helper functions for backward compatibility
export const getAvailableLanguages = () => languageService.getAvailableLanguages()
export const isLanguageSupported = (code: string) => languageService.isLanguageSupported(code)
export const getLanguageInfo = (code: string) => languageService.getLanguageInfo(code)
export const getSupportedLanguageCodes = () => languageService.getSupportedLanguageCodes()
export const getLanguageDirection = (code: string) => languageService.getLanguageDirection(code)
export const isRTL = (code: string) => languageService.isRTL(code)