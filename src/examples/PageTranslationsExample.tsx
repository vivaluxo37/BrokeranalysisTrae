import React from 'react';
import { usePageTranslations, usePageTranslationFunction } from '../hooks/usePageTranslations';

/**
 * Example component demonstrating how to use the usePageTranslations hook
 * This shows both the raw data approach and the t() function approach
 */
export const PageTranslationsExample: React.FC = () => {
  // Example 1: Using the raw hook that returns key/value object
  const {
    data: translations,
    isLoading,
    isError,
    error
  } = usePageTranslations('homepage', 'en');

  // Example 2: Using the hook variant that provides a t() function
  const {
    t,
    isLoading: isLoadingT,
    isError: isErrorT
  } = usePageTranslationFunction('homepage', 'en');

  if (isLoading || isLoadingT) {
    return <div>Loading translations...</div>;
  }

  if (isError || isErrorT) {
    return <div>Error loading translations: {error?.message}</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Page Translations Example</h1>
      
      {/* Example 1: Using raw translations object */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Method 1: Raw Translations Object</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Title:</strong> {translations?.title || 'Title not found'}</p>
          <p><strong>Description:</strong> {translations?.description || 'Description not found'}</p>
          <p><strong>Welcome Message:</strong> {translations?.welcome_message || 'Welcome message not found'}</p>
        </div>
      </div>

      {/* Example 2: Using t() function */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Method 2: Using t() Function</h2>
        <div className="bg-blue-100 p-4 rounded">
          <p><strong>Title:</strong> {t('title', 'Default Title')}</p>
          <p><strong>Description:</strong> {t('description', 'Default Description')}</p>
          <p><strong>Welcome Message:</strong> {t('welcome_message', 'Default Welcome')}</p>
          <p><strong>Non-existent Key:</strong> {t('non_existent_key', 'This is a fallback value')}</p>
        </div>
      </div>

      {/* Show all available translations */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Available Translations</h2>
        <div className="bg-green-100 p-4 rounded">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(translations, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

/**
 * Example of how to use the hook in different scenarios
 */
export const MultiLanguageExample: React.FC = () => {
  const [currentLang, setCurrentLang] = React.useState<string>('en');
  
  const { t, isLoading, isError } = usePageTranslationFunction('homepage', currentLang);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' }
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading translations</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Multi-Language Example</h1>
      
      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Language:</label>
        <select 
          value={currentLang} 
          onChange={(e) => setCurrentLang(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Translated Content */}
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">{t('title', 'Default Title')}</h2>
        <p className="mb-2">{t('description', 'Default Description')}</p>
        <p className="text-sm text-gray-600">
          Current Language: <strong>{currentLang}</strong>
        </p>
      </div>
    </div>
  );
};

export default PageTranslationsExample;