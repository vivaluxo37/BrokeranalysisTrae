import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

interface PageTranslation {
  id: string;
  page_key: string;
  lang: string;
  translation_key: string;
  translation_value: string;
  created_at: string;
  updated_at: string;
}

interface TranslationObject {
  [key: string]: string;
}

/**
 * Custom hook to fetch page translations from Supabase using TanStack Query
 * @param pageKey - The page identifier (e.g., 'homepage', 'broker-detail')
 * @param lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns Query result with translations as key/value object for t() function
 */
export const usePageTranslations = (pageKey: string, lang: string) => {
  return useQuery({
    queryKey: ['pageTranslations', pageKey, lang],
    queryFn: async (): Promise<TranslationObject> => {
      const { data, error } = await supabase
        .from('pages_i18n')
        .select('translation_key, translation_value')
        .eq('page_key', pageKey)
        .eq('lang', lang);

      if (error) {
        throw new Error(`Failed to fetch translations: ${error.message}`);
      }

      // Transform array of translations into key/value object
      const translationObject: TranslationObject = {};
      
      if (data) {
        data.forEach((translation: Pick<PageTranslation, 'translation_key' | 'translation_value'>) => {
          translationObject[translation.translation_key] = translation.translation_value;
        });
      }

      return translationObject;
    },
    enabled: Boolean(pageKey && lang), // Only run query if both parameters are provided
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 3, // Retry failed requests up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

/**
 * Hook variant that returns a translation function similar to react-i18next's t()
 * @param pageKey - The page identifier
 * @param lang - The language code
 * @returns Object with translation function and query state
 */
export const usePageTranslationFunction = (pageKey: string, lang: string) => {
  const query = usePageTranslations(pageKey, lang);
  
  const t = (key: string, fallback?: string): string => {
    if (!query.data) {
      return fallback || key;
    }
    return query.data[key] || fallback || key;
  };

  return {
    t,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  };
};

/**
 * Hook to prefetch translations for multiple pages
 * Useful for preloading translations for better UX
 * @param pageKeys - Array of page identifiers to prefetch
 * @param lang - The language code
 */
export const usePrefetchPageTranslations = (pageKeys: string[], lang: string) => {
  const queryClient = useQueryClient();

  const prefetchTranslations = async () => {
    const prefetchPromises = pageKeys.map(pageKey => 
      queryClient.prefetchQuery({
        queryKey: ['pageTranslations', pageKey, lang],
        queryFn: async (): Promise<TranslationObject> => {
          const { data, error } = await supabase
            .from('pages_i18n')
            .select('translation_key, translation_value')
            .eq('page_key', pageKey)
            .eq('lang', lang);

          if (error) {
            throw new Error(`Failed to fetch translations: ${error.message}`);
          }

          const translationObject: TranslationObject = {};
          
          if (data) {
            data.forEach((translation: Pick<PageTranslation, 'translation_key' | 'translation_value'>) => {
              translationObject[translation.translation_key] = translation.translation_value;
            });
          }

          return translationObject;
        },
        staleTime: 5 * 60 * 1000,
      })
    );

    await Promise.all(prefetchPromises);
  };

  return { prefetchTranslations };
};

export default usePageTranslations;