import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// Supported languages - Top 20 languages as requested
const SUPPORTED_LANGUAGES = [
  'en', 'es', 'pt', 'fr', 'de', 'it', 'ru', 
  'zh-Hans', 'zh-Hant', 'ja', 'ko', 'ar', 
  'hi', 'bn', 'ur', 'tr', 'vi', 'th', 'id', 'ms'
] as const;

type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export { SUPPORTED_LANGUAGES };
export type { SupportedLanguage };

// Language display configuration with flags and native names
export const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'es', name: 'Español', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'pt', name: 'Português', flag: '🇵🇹', nativeName: 'Português' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', nativeName: 'Italiano' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', nativeName: 'Русский' },
  { code: 'zh-Hans', name: 'Chinese (Simplified)', flag: '🇨🇳', nativeName: '简体中文' },
  { code: 'zh-Hant', name: 'Chinese (Traditional)', flag: '🇹🇼', nativeName: '繁體中文' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'th', name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu' }
] as const;

// RTL languages
export const RTL_LANGUAGES: SupportedLanguage[] = ['ar', 'ur'];

// Language detection options
const detectionOptions = {
  // Order of language detection (path first for URL prefix support)
  order: ['path', 'localStorage', 'navigator', 'htmlTag'],
  
  // Look for language in URL path
  lookupFromPathIndex: 0,
  
  // Cache user language
  caches: ['localStorage'],
  
  // Exclude certain domains from detection
  excludeCacheFor: ['cimode'],
  
  // Check all fallback languages
  checkWhitelist: true
};

// Helper functions
export const isRTL = (language: string): boolean => {
  return RTL_LANGUAGES.includes(language as SupportedLanguage);
};

export const getLanguageDirection = (language: string): 'ltr' | 'rtl' => {
  return isRTL(language) ? 'rtl' : 'ltr';
};

export const isValidLanguage = (language: string): language is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
};

export const getBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.split('-')[0];
  return isValidLanguage(browserLang) ? browserLang : 'en';
};

// Initialize i18next
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Language settings
    lng: 'en', // Default language
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    
    // Detection settings
    detection: detectionOptions,
    
    // Backend settings for loading translations
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}.missing.json'
    },
    
    // Namespace settings
    defaultNS: 'common',
    ns: ['common', 'brokers', 'auth', 'navigation', 'forms', 'errors'],
    
    // Interpolation settings
    interpolation: {
      escapeValue: false // React already escapes values
    },
    
    // React settings
    react: {
      useSuspense: false // Disable suspense for SSR compatibility
    },
    
    // Development settings
    debug: import.meta.env.MODE === 'development',
    
    // Key separator
    keySeparator: '.',
    nsSeparator: ':',
    
    // Pluralization
    pluralSeparator: '_',
    
    // Missing key handling
    saveMissing: import.meta.env.MODE === 'development',
    missingKeyHandler: (lng, ns, key) => {
      if (import.meta.env.MODE === 'development') {
        console.warn(`Missing translation key: ${ns}:${key} for language: ${lng}`);
      }
    },
    
    // Load settings
    load: 'languageOnly', // Load only language code (en) not region (en-US)
    
    // Clean code
    cleanCode: true,
    
    // Preload languages
    preload: ['en', 'es']
  });

export default i18n
