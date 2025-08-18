import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { languageService, type LanguageInfo } from '../services/LanguageService'
import type { SupportedLanguage } from '../i18n/config'

/**
 * Hook for managing available languages from Supabase
 */
export function useAvailableLanguages(forceRefresh = false) {
  return useQuery({
    queryKey: ['available-languages'],
    queryFn: () => languageService.getAvailableLanguages(forceRefresh),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    retryDelay: 1000,
  })
}

/**
 * Hook for language switching with enhanced functionality
 */
export function useLanguageSwitcher() {
  const { i18n } = useTranslation()
  const queryClient = useQueryClient()
  const [isChanging, setIsChanging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: availableLanguages = [], isLoading } = useAvailableLanguages()

  // Get current language info
  const currentLanguage = availableLanguages.find(
    lang => lang.code === i18n.language
  ) || availableLanguages[0]

  /**
   * Change language with comprehensive updates
   */
  const changeLanguage = useCallback(async (languageCode: string) => {
    if (isChanging) return false

    setIsChanging(true)
    setError(null)

    try {
      // Validate language is supported
      const isSupported = await languageService.isLanguageSupported(languageCode)
      if (!isSupported) {
        throw new Error(`Language '${languageCode}' is not supported`)
      }

      // Change i18n language
      await i18n.changeLanguage(languageCode)

      // Update document attributes
      const direction = languageService.getLanguageDirection(languageCode)
      document.documentElement.dir = direction
      document.documentElement.lang = languageCode

      // Store preference
      localStorage.setItem('preferred-language', languageCode)

      // Update URL with language prefix (optional)
      const currentPath = window.location.pathname
      const pathWithoutLang = currentPath.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, '') || '/'
      const newPath = `/${languageCode}${pathWithoutLang}`

      // Use history API to update URL without page reload
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', newPath)
      }

      // Invalidate language-dependent queries
      await queryClient.invalidateQueries({ queryKey: ['broker-localized'] })
      await queryClient.invalidateQueries({ queryKey: ['page-translations'] })

      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change language'
      setError(errorMessage)
      console.error('Language change failed:', error)
      return false
    } finally {
      setIsChanging(false)
    }
  }, [i18n, isChanging, queryClient])

  /**
   * Reset to default language
   */
  const resetToDefault = useCallback(() => {
    return changeLanguage('en')
  }, [changeLanguage])

  /**
   * Get language by code
   */
  const getLanguageByCode = useCallback((code: string): LanguageInfo | undefined => {
    return availableLanguages.find(lang => lang.code === code)
  }, [availableLanguages])

  /**
   * Check if language is RTL
   */
  const isRTL = useCallback((code?: string): boolean => {
    const langCode = code || i18n.language
    return languageService.isRTL(langCode)
  }, [i18n.language])

  /**
   * Get language direction
   */
  const getDirection = useCallback((code?: string): 'ltr' | 'rtl' => {
    const langCode = code || i18n.language
    return languageService.getLanguageDirection(langCode)
  }, [i18n.language])

  return {
    // State
    availableLanguages,
    currentLanguage,
    isLoading,
    isChanging,
    error,
    
    // Actions
    changeLanguage,
    resetToDefault,
    
    // Utilities
    getLanguageByCode,
    isRTL,
    getDirection,
    
    // Current language properties
    currentCode: i18n.language,
    currentDirection: getDirection(),
    isCurrentRTL: isRTL()
  }
}

/**
 * Hook for language validation
 */
export function useLanguageValidation() {
  const { data: availableLanguages = [] } = useAvailableLanguages()

  const isValidLanguage = useCallback((code: string): boolean => {
    return availableLanguages.some(lang => lang.code === code && lang.enabled)
  }, [availableLanguages])

  const getSupportedCodes = useCallback((): string[] => {
    return availableLanguages
      .filter(lang => lang.enabled)
      .map(lang => lang.code)
  }, [availableLanguages])

  const validateAndGetFallback = useCallback((code: string): string => {
    if (isValidLanguage(code)) {
      return code
    }
    
    // Try to find a similar language (e.g., 'en-US' -> 'en')
    const baseCode = code.split('-')[0]
    if (isValidLanguage(baseCode)) {
      return baseCode
    }
    
    // Fallback to English or first available language
    return isValidLanguage('en') ? 'en' : (availableLanguages[0]?.code || 'en')
  }, [availableLanguages, isValidLanguage])

  return {
    isValidLanguage,
    getSupportedCodes,
    validateAndGetFallback,
    availableLanguages
  }
}

/**
 * Hook for language administration (adding/updating languages)
 */
export function useLanguageAdmin() {
  const queryClient = useQueryClient()

  const addLanguageMutation = useMutation({
    mutationFn: ({ code, label, enabled = true }: { code: string; label: string; enabled?: boolean }) =>
      languageService.addLanguage(code, label, enabled),
    onSuccess: () => {
      // Invalidate and refetch languages
      queryClient.invalidateQueries({ queryKey: ['available-languages'] })
      languageService.clearCache()
    },
    onError: (error) => {
      console.error('Failed to add language:', error)
    }
  })

  const updateLanguageStatusMutation = useMutation({
    mutationFn: ({ code, enabled }: { code: string; enabled: boolean }) =>
      languageService.updateLanguageStatus(code, enabled),
    onSuccess: () => {
      // Invalidate and refetch languages
      queryClient.invalidateQueries({ queryKey: ['available-languages'] })
      languageService.clearCache()
    },
    onError: (error) => {
      console.error('Failed to update language status:', error)
    }
  })

  const refreshLanguages = useCallback(() => {
    languageService.clearCache()
    queryClient.invalidateQueries({ queryKey: ['available-languages'] })
  }, [queryClient])

  return {
    addLanguage: addLanguageMutation.mutate,
    updateLanguageStatus: updateLanguageStatusMutation.mutate,
    refreshLanguages,
    isAddingLanguage: addLanguageMutation.isPending,
    isUpdatingStatus: updateLanguageStatusMutation.isPending,
    addError: addLanguageMutation.error,
    updateError: updateLanguageStatusMutation.error
  }
}

/**
 * Hook for URL-based language detection and management
 */
export function useURLLanguage() {
  const { changeLanguage } = useLanguageSwitcher()
  const { validateAndGetFallback } = useLanguageValidation()

  /**
   * Extract language from URL path
   */
  const getLanguageFromURL = useCallback((): string | null => {
    const path = window.location.pathname
    const match = path.match(/^\/([a-z]{2}(-[A-Z]{2})?)\//)
    return match ? match[1] : null
  }, [])

  /**
   * Initialize language from URL
   */
  const initializeFromURL = useCallback(async () => {
    const urlLang = getLanguageFromURL()
    if (urlLang) {
      const validLang = validateAndGetFallback(urlLang)
      if (validLang !== urlLang) {
        // Redirect to valid language URL
        const newPath = window.location.pathname.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, `/${validLang}`)
        window.history.replaceState(null, '', newPath)
      }
      await changeLanguage(validLang)
    }
  }, [getLanguageFromURL, validateAndGetFallback, changeLanguage])

  return {
    getLanguageFromURL,
    initializeFromURL
  }
}

/**
 * Combined hook for complete language management
 */
export function useLanguageManager() {
  const switcher = useLanguageSwitcher()
  const validation = useLanguageValidation()
  const urlManager = useURLLanguage()
  const admin = useLanguageAdmin()

  return {
    ...switcher,
    ...validation,
    ...urlManager,
    ...admin
  }
}