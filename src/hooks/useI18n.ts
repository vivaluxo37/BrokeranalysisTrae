import { useTranslation } from 'react-i18next'
import { useCallback } from 'react'
import { 
  supportedLanguages, 
  getLanguageDirection, 
  isRTL, 
  isValidLanguage, 
  getBrowserLanguage,
  type SupportedLanguage 
} from '../i18n/config'

/**
 * Custom hook for internationalization functionality
 * Provides enhanced i18n features beyond basic react-i18next
 */
export function useI18n() {
  const { t, i18n } = useTranslation()

  const currentLanguage = supportedLanguages.find(lang => lang.code === i18n.language) || supportedLanguages[0]
  const isRightToLeft = isRTL(i18n.language as SupportedLanguage)
  const direction = getLanguageDirection(i18n.language as SupportedLanguage)

  /**
   * Change language with proper document updates
   */
  const changeLanguage = useCallback(async (languageCode: SupportedLanguage) => {
    if (!isValidLanguage(languageCode)) {
      console.warn(`Invalid language code: ${languageCode}`)
      return false
    }

    try {
      await i18n.changeLanguage(languageCode)
      
      // Update document attributes
      document.documentElement.dir = getLanguageDirection(languageCode)
      document.documentElement.lang = languageCode
      
      // Store preference
      localStorage.setItem('preferred-language', languageCode)
      
      return true
    } catch (error) {
      console.error('Failed to change language:', error)
      return false
    }
  }, [i18n])

  /**
   * Get localized broker content from Supabase
   * This will be used with the broker_i18n table
   */
  const getBrokerLocalizedContent = useCallback((brokerId: string, field: string) => {
    // This will be implemented when we integrate with Supabase broker_i18n table
    // For now, return a placeholder
    return `${field}_${i18n.language}_${brokerId}`
  }, [i18n.language])

  /**
   * Format numbers according to current locale
   */
  const formatNumber = useCallback((number: number, options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(i18n.language, options).format(number)
  }, [i18n.language])

  /**
   * Format currency according to current locale
   */
  const formatCurrency = useCallback((amount: number, currency = 'USD') => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency
    }).format(amount)
  }, [i18n.language])

  /**
   * Format dates according to current locale
   */
  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(i18n.language, options).format(date)
  }, [i18n.language])

  /**
   * Get available languages for language switcher
   */
  const getAvailableLanguages = useCallback(() => {
    return supportedLanguages
  }, [])

  /**
   * Detect and set browser language if supported
   */
  const detectAndSetBrowserLanguage = useCallback(async () => {
    const browserLang = getBrowserLanguage()
    if (browserLang && isValidLanguage(browserLang)) {
      return await changeLanguage(browserLang)
    }
    return false
  }, [changeLanguage])

  /**
   * Get hreflang attributes for SEO
   */
  const getHrefLangAttributes = useCallback((currentPath: string) => {
    return supportedLanguages.map(lang => ({
      hrefLang: lang.code,
      href: `/${lang.code}${currentPath}`
    }))
  }, [])

  return {
    // Basic i18n
    t,
    i18n,
    
    // Language info
    currentLanguage,
    isRightToLeft,
    direction,
    
    // Language management
    changeLanguage,
    getAvailableLanguages,
    detectAndSetBrowserLanguage,
    
    // Localization utilities
    formatNumber,
    formatCurrency,
    formatDate,
    
    // Broker content (for future Supabase integration)
    getBrokerLocalizedContent,
    
    // SEO utilities
    getHrefLangAttributes,
    
    // Utility functions
    isValidLanguage,
    isRTL: (lang: SupportedLanguage) => isRTL(lang),
    getLanguageDirection: (lang: SupportedLanguage) => getLanguageDirection(lang)
  }
}

export default useI18n