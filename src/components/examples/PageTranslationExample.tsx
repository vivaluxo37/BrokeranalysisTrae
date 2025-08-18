import React from 'react';
import { usePageTranslations, usePageTranslationFunction } from '../../hooks/usePageTranslations';
import { useI18n } from '../../providers/I18nProvider';

/**
 * Example component demonstrating how to use the usePageTranslations hook
 * with Supabase-backed translations
 */
export const PageTranslationExample: React.FC = () => {
  const { language } = useI18n();
  
  // Method 1: Get raw translation object
  const {
    data: translations,
    isLoading,
    isError,
    error
  } = usePageTranslations('homepage', language);

  // Method 2: Get translation function similar to react-i18next
  const { t, isLoading: tIsLoading } = usePageTranslationFunction('homepage', language);

  if (isLoading || tIsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading translations...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Translation Error</h3>
        <p className="text-red-600 mt-1">
          {error instanceof Error ? error.message : 'Failed to load translations'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Supabase Translation System Demo
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Method 1: Raw translation object */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Method 1: Raw Translation Object
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Available Translations:</h3>
              {translations && Object.keys(translations).length > 0 ? (
                <ul className="space-y-2">
                  {Object.entries(translations).map(([key, value]) => (
                    <li key={key} className="text-sm">
                      <span className="font-mono text-blue-600">{key}:</span>
                      <span className="ml-2 text-gray-800">{value}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  No translations found for page 'homepage' in language '{language}'
                </p>
              )}
            </div>
          </div>

          {/* Method 2: Translation function */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Method 2: Translation Function
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">t('welcome_message'):</span>
                <p className="text-gray-800">{t('welcome_message', 'Welcome to BrokerAnalysis')}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">t('hero_title'):</span>
                <p className="text-gray-800">{t('hero_title', 'Find Your Perfect Broker')}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">t('hero_subtitle'):</span>
                <p className="text-gray-800">{t('hero_subtitle', 'Compare brokers and make informed decisions')}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">t('cta_button'):</span>
                <p className="text-gray-800">{t('cta_button', 'Get Started')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            Usage Examples
          </h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800">Basic Usage:</h4>
              <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`const { data: translations, isLoading } = usePageTranslations('homepage', 'en');

// Use translations object directly
const title = translations?.hero_title || 'Default Title';`}
              </pre>
            </div>
            <div>
              <h4 className="font-medium text-blue-800">With Translation Function:</h4>
              <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
{`const { t, isLoading } = usePageTranslationFunction('homepage', 'en');

// Use like react-i18next
const title = t('hero_title', 'Default Title');`}
              </pre>
            </div>
          </div>
        </div>

        {/* Current State Info */}
        <div className="mt-6 bg-gray-100 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Current State:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Language:</span> {language}
            </div>
            <div>
              <span className="font-medium">Page Key:</span> homepage
            </div>
            <div>
              <span className="font-medium">Translations Loaded:</span> {translations ? Object.keys(translations).length : 0}
            </div>
            <div>
              <span className="font-medium">Loading:</span> {isLoading ? 'Yes' : 'No'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageTranslationExample;