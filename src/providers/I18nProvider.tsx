import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n/config'
import { supportedLanguages } from '../i18n/config'
import type { SupportedLanguage } from '../i18n/config'
import type { I18nAnalytics, LanguageSwitchContext } from '../types/i18n'

/**
 * Extended i18n context interface
 */
interface I18nContextType {
  analytics: I18nAnalytics
  addLanguageSwitch: (context: LanguageSwitchContext) => void
  addMissingTranslation: (key: string, language: SupportedLanguage, namespace: string) => void
  getLanguageUsage: () => Record<SupportedLanguage, number>
  clearAnalytics: () => void
}

/**
 * I18n context
 */
const I18nContext = createContext<I18nContextType | undefined>(undefined)

/**
 * Hook to use i18n context
 */
export function useI18nContext() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18nContext must be used within I18nProvider')
  }
  return context
}

/**
 * Props for I18nProvider
 */
interface I18nProviderProps {
  children: ReactNode
  enableAnalytics?: boolean
  onLanguageChange?: (from: SupportedLanguage, to: SupportedLanguage) => void
}

/**
 * Enhanced I18n Provider with analytics and additional features
 */
export function I18nProvider({ 
  children, 
  enableAnalytics = true,
  onLanguageChange 
}: I18nProviderProps) {
  const [analytics, setAnalytics] = useState<I18nAnalytics>({
    languageUsage: {} as Record<SupportedLanguage, number>,
    switchEvents: [],
    missingTranslations: [],
    loadTimes: {} as Record<SupportedLanguage, number>
  })

  /**
   * Initialize analytics data
   */
  useEffect(() => {
    if (!enableAnalytics) return

    // Initialize language usage counters
    const initialUsage = {} as Record<SupportedLanguage, number>
    supportedLanguages.forEach(lang => {
      initialUsage[lang.code] = 0
    })
    
    setAnalytics(prev => ({
      ...prev,
      languageUsage: initialUsage
    }))
  }, [enableAnalytics])

  /**
   * Track language changes
   */
  useEffect(() => {
    if (!enableAnalytics) return

    let previousLanguage = i18n.language as SupportedLanguage

    const handleLanguageChange = (lng: string) => {
      const newLanguage = lng as SupportedLanguage
      
      // Update usage counter
      setAnalytics(prev => ({
        ...prev,
        languageUsage: {
          ...prev.languageUsage,
          [newLanguage]: (prev.languageUsage[newLanguage] || 0) + 1
        }
      }))

      // Record switch event
      const switchContext: LanguageSwitchContext = {
        from: previousLanguage,
        to: newLanguage,
        timestamp: new Date(),
        source: 'user' // This could be enhanced to detect auto vs user changes
      }

      addLanguageSwitch(switchContext)
      
      // Call external callback
      if (onLanguageChange) {
        onLanguageChange(previousLanguage, newLanguage)
      }

      previousLanguage = newLanguage
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [enableAnalytics, onLanguageChange])

  /**
   * Track missing translations
   */
  useEffect(() => {
    if (!enableAnalytics) return

    const handleMissingKey = (lng: string[], namespace: string, key: string) => {
      lng.forEach(language => {
        addMissingTranslation(key, language as SupportedLanguage, namespace)
      })
    }

    i18n.on('missingKey', handleMissingKey)

    return () => {
      i18n.off('missingKey', handleMissingKey)
    }
  }, [enableAnalytics])

  /**
   * Set document attributes based on current language
   */
  useEffect(() => {
    const updateDocumentAttributes = () => {
      const currentLang = supportedLanguages.find(lang => lang.code === i18n.language)
      if (currentLang) {
        document.documentElement.lang = currentLang.code
        document.documentElement.dir = currentLang.rtl ? 'rtl' : 'ltr'
        
        // Add language class to body for CSS targeting
        document.body.className = document.body.className.replace(/\blang-\w+\b/g, '')
        document.body.classList.add(`lang-${currentLang.code}`)
      }
    }

    // Set initial attributes
    updateDocumentAttributes()

    // Update on language change
    i18n.on('languageChanged', updateDocumentAttributes)

    return () => {
      i18n.off('languageChanged', updateDocumentAttributes)
    }
  }, [])

  /**
   * Add language switch event to analytics
   */
  const addLanguageSwitch = (context: LanguageSwitchContext) => {
    if (!enableAnalytics) return
    
    setAnalytics(prev => ({
      ...prev,
      switchEvents: [...prev.switchEvents, context]
    }))
  }

  /**
   * Add missing translation to analytics
   */
  const addMissingTranslation = (key: string, language: SupportedLanguage, namespace: string) => {
    if (!enableAnalytics) return

    setAnalytics(prev => {
      // Avoid duplicates
      const exists = prev.missingTranslations.some(
        item => item.key === key && item.language === language && item.namespace === namespace
      )
      
      if (exists) return prev

      return {
        ...prev,
        missingTranslations: [
          ...prev.missingTranslations,
          {
            key,
            language,
            namespace,
            timestamp: new Date()
          }
        ]
      }
    })
  }

  /**
   * Get language usage statistics
   */
  const getLanguageUsage = () => {
    return analytics.languageUsage
  }

  /**
   * Clear analytics data
   */
  const clearAnalytics = () => {
    setAnalytics({
      languageUsage: {} as Record<SupportedLanguage, number>,
      switchEvents: [],
      missingTranslations: [],
      loadTimes: {} as Record<SupportedLanguage, number>
    })
  }

  const contextValue: I18nContextType = {
    analytics,
    addLanguageSwitch,
    addMissingTranslation,
    getLanguageUsage,
    clearAnalytics
  }

  return (
    <I18nContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18n}>
        {children}
      </I18nextProvider>
    </I18nContext.Provider>
  )
}

export default I18nProvider