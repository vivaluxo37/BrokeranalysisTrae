import React, { useState, useEffect } from 'react'
import { X, Globe } from 'lucide-react'
import { useI18n } from '../hooks/useI18n'

interface LocaleSuggestionBannerProps {
  className?: string
}

/**
 * LocaleSuggestionBanner Component
 * 
 * Displays a non-intrusive banner suggesting language change based on
 * geolocation detected by Vercel middleware. Only shows when:
 * 1. Middleware sets x-suggest-locale header
 * 2. User hasn't dismissed the banner
 * 3. Suggested language is different from current language
 */
export const LocaleSuggestionBanner: React.FC<LocaleSuggestionBannerProps> = ({ 
  className = '' 
}) => {
  const { language, changeLanguage, t } = useI18n()
  const [isVisible, setIsVisible] = useState(false)
  const [suggestedLocale, setSuggestedLocale] = useState<string | null>(null)
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null)
  const [countryFlag, setCountryFlag] = useState<string>('')
  const [isChanging, setIsChanging] = useState(false)

  // Language display names
  const languageNames: Record<string, { name: string; nativeName: string }> = {
    'en': { name: 'English', nativeName: 'English' },
    'es': { name: 'Spanish', nativeName: 'Español' },
    'fr': { name: 'French', nativeName: 'Français' },
    'de': { name: 'German', nativeName: 'Deutsch' }
  }

  // Country flag emojis as fallback
  const countryFlags: Record<string, string> = {
    'DE': '🇩🇪', 'AT': '🇦🇹', 'CH': '🇨🇭',
    'ES': '🇪🇸', 'MX': '🇲🇽', 'AR': '🇦🇷',
    'FR': '🇫🇷', 'BE': '🇧🇪', 'CA': '🇨🇦'
  }

  useEffect(() => {
    // Check if user has already dismissed the banner for this session
    const dismissed = sessionStorage.getItem('localeSuggestionDismissed')
    if (dismissed) return

    // Skip locale detection in development environment to avoid network errors
    if (import.meta.env.DEV) {
      console.debug('Locale suggestion disabled in development mode')
      return
    }

    // Try to read headers from a fetch request to get middleware data
    const checkForSuggestion = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      try {
        const response = await fetch(window.location.href, {
          method: 'HEAD',
          cache: 'no-cache',
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        const suggestedLang = response.headers.get('x-suggest-locale')
        const country = response.headers.get('x-detected-country')
        const flag = response.headers.get('x-country-flag')
        
        if (suggestedLang && suggestedLang !== language) {
          setSuggestedLocale(suggestedLang)
          setDetectedCountry(country)
          setCountryFlag(flag || countryFlags[country || ''] || '🌍')
          setIsVisible(true)
        }
      } catch (error) {
        clearTimeout(timeoutId)
        // Silently fail - banner just won't show
        // Don't log aborted requests as errors in development
        if (error.name !== 'AbortError') {
          console.debug('Could not check locale suggestion:', error)
        }
      }

      return () => {
        clearTimeout(timeoutId)
        controller.abort()
      }
    }

    const cleanup = checkForSuggestion()
    
    // Cleanup function for component unmount
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup()
      }
    }
  }, [language])

  const handleAcceptSuggestion = async () => {
    if (!suggestedLocale) return
    
    setIsChanging(true)
    
    try {
      await changeLanguage(suggestedLocale)
      
      // Set cookie to confirm locale preference
      document.cookie = `localeConfirmed=true; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
      
      setIsVisible(false)
      sessionStorage.setItem('localeSuggestionDismissed', 'true')
    } catch (error) {
      console.error('Failed to change language:', error)
    } finally {
      setIsChanging(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem('localeSuggestionDismissed', 'true')
    
    // Set cookie to confirm current locale preference
    document.cookie = `localeConfirmed=true; path=/; max-age=${60 * 60 * 24 * 365}` // 1 year
  }

  if (!isVisible || !suggestedLocale) {
    return null
  }

  const suggestedLanguage = languageNames[suggestedLocale]
  if (!suggestedLanguage) return null

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50 
      bg-gradient-to-r from-blue-50 to-indigo-50 
      border-b border-blue-200 
      shadow-sm
      ${className}
    `}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Globe className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700">
                {t('localeSuggestion.detected', 'We think you\'re in')}
              </span>
              <span className="text-lg" role="img" aria-label={`Country: ${detectedCountry}`}>
                {countryFlag}
              </span>
              <span className="text-gray-700">—</span>
              <button
                onClick={handleAcceptSuggestion}
                disabled={isChanging}
                className="
                  text-blue-600 hover:text-blue-800 
                  font-medium underline 
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200
                "
              >
                {isChanging ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    {t('localeSuggestion.switching', 'Switching...')}
                  </span>
                ) : (
                  t('localeSuggestion.switchTo', `switch to ${suggestedLanguage.nativeName}?`, {
                    language: suggestedLanguage.nativeName
                  })
                )}
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="
              p-1 rounded-full 
              text-gray-400 hover:text-gray-600 
              hover:bg-white/50 
              transition-colors duration-200
              flex-shrink-0
            "
            aria-label={t('localeSuggestion.dismiss', 'Dismiss suggestion')}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocaleSuggestionBanner