import { supabase } from '../lib/supabase';
import { QueryClient } from '@tanstack/react-query';

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

interface BulkTranslationInput {
  page_key: string;
  lang: string;
  translations: Record<string, string>;
}

interface TranslationStats {
  total_pages: number;
  total_languages: number;
  total_translations: number;
  pages_by_language: Record<string, number>;
  languages_by_page: Record<string, number>;
}

/**
 * Service class for managing page translations in Supabase
 * Provides CRUD operations, bulk operations, and cache management
 */
export class PageTranslationService {
  private queryClient: QueryClient | null = null;

  constructor(queryClient?: QueryClient) {
    this.queryClient = queryClient || null;
  }

  /**
   * Set the query client for cache management
   */
  setQueryClient(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  /**
   * Fetch translations for a specific page and language
   */
  async getPageTranslations(pageKey: string, lang: string): Promise<TranslationObject> {
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
      data.forEach((translation) => {
        translationObject[translation.translation_key] = translation.translation_value;
      });
    }

    return translationObject;
  }

  /**
   * Fetch all translations for a specific page across all languages
   */
  async getPageTranslationsAllLanguages(pageKey: string): Promise<Record<string, TranslationObject>> {
    const { data, error } = await supabase
      .from('pages_i18n')
      .select('lang, translation_key, translation_value')
      .eq('page_key', pageKey);

    if (error) {
      throw new Error(`Failed to fetch translations: ${error.message}`);
    }

    const translationsByLanguage: Record<string, TranslationObject> = {};
    
    if (data) {
      data.forEach((translation) => {
        if (!translationsByLanguage[translation.lang]) {
          translationsByLanguage[translation.lang] = {};
        }
        translationsByLanguage[translation.lang][translation.translation_key] = translation.translation_value;
      });
    }

    return translationsByLanguage;
  }

  /**
   * Add or update a single translation
   */
  async upsertTranslation(
    pageKey: string,
    lang: string,
    translationKey: string,
    translationValue: string
  ): Promise<void> {
    const { error } = await supabase
      .from('pages_i18n')
      .upsert({
        page_key: pageKey,
        lang: lang,
        translation_key: translationKey,
        translation_value: translationValue,
      }, {
        onConflict: 'page_key,lang,translation_key'
      });

    if (error) {
      throw new Error(`Failed to upsert translation: ${error.message}`);
    }

    // Invalidate cache for this page and language
    this.invalidateCache(pageKey, lang);
  }

  /**
   * Bulk insert/update translations for a page and language
   */
  async bulkUpsertTranslations(input: BulkTranslationInput): Promise<void> {
    const translationsArray = Object.entries(input.translations).map(([key, value]) => ({
      page_key: input.page_key,
      lang: input.lang,
      translation_key: key,
      translation_value: value,
    }));

    const { error } = await supabase
      .from('pages_i18n')
      .upsert(translationsArray, {
        onConflict: 'page_key,lang,translation_key'
      });

    if (error) {
      throw new Error(`Failed to bulk upsert translations: ${error.message}`);
    }

    // Invalidate cache for this page and language
    this.invalidateCache(input.page_key, input.lang);
  }

  /**
   * Delete a specific translation
   */
  async deleteTranslation(
    pageKey: string,
    lang: string,
    translationKey: string
  ): Promise<void> {
    const { error } = await supabase
      .from('pages_i18n')
      .delete()
      .eq('page_key', pageKey)
      .eq('lang', lang)
      .eq('translation_key', translationKey);

    if (error) {
      throw new Error(`Failed to delete translation: ${error.message}`);
    }

    // Invalidate cache for this page and language
    this.invalidateCache(pageKey, lang);
  }

  /**
   * Delete all translations for a specific page and language
   */
  async deletePageTranslations(pageKey: string, lang: string): Promise<void> {
    const { error } = await supabase
      .from('pages_i18n')
      .delete()
      .eq('page_key', pageKey)
      .eq('lang', lang);

    if (error) {
      throw new Error(`Failed to delete page translations: ${error.message}`);
    }

    // Invalidate cache for this page and language
    this.invalidateCache(pageKey, lang);
  }

  /**
   * Delete all translations for a specific page across all languages
   */
  async deletePageAllLanguages(pageKey: string): Promise<void> {
    const { error } = await supabase
      .from('pages_i18n')
      .delete()
      .eq('page_key', pageKey);

    if (error) {
      throw new Error(`Failed to delete page translations: ${error.message}`);
    }

    // Invalidate all cache entries for this page
    this.invalidatePageCache(pageKey);
  }

  /**
   * Get list of all available pages
   */
  async getAvailablePages(): Promise<string[]> {
    const { data, error } = await supabase
      .from('pages_i18n')
      .select('page_key')
      .order('page_key');

    if (error) {
      throw new Error(`Failed to fetch available pages: ${error.message}`);
    }

    const uniquePages = [...new Set(data?.map(item => item.page_key) || [])];
    return uniquePages;
  }

  /**
   * Get list of all available languages
   */
  async getAvailableLanguages(): Promise<string[]> {
    const { data, error } = await supabase
      .from('pages_i18n')
      .select('lang')
      .order('lang');

    if (error) {
      throw new Error(`Failed to fetch available languages: ${error.message}`);
    }

    const uniqueLanguages = [...new Set(data?.map(item => item.lang) || [])];
    return uniqueLanguages;
  }

  /**
   * Get translation statistics
   */
  async getTranslationStats(): Promise<TranslationStats> {
    const { data, error } = await supabase
      .from('pages_i18n')
      .select('page_key, lang');

    if (error) {
      throw new Error(`Failed to fetch translation stats: ${error.message}`);
    }

    const pages = new Set<string>();
    const languages = new Set<string>();
    const pagesByLanguage: Record<string, Set<string>> = {};
    const languagesByPage: Record<string, Set<string>> = {};

    data?.forEach(item => {
      pages.add(item.page_key);
      languages.add(item.lang);

      if (!pagesByLanguage[item.lang]) {
        pagesByLanguage[item.lang] = new Set();
      }
      pagesByLanguage[item.lang].add(item.page_key);

      if (!languagesByPage[item.page_key]) {
        languagesByPage[item.page_key] = new Set();
      }
      languagesByPage[item.page_key].add(item.lang);
    });

    return {
      total_pages: pages.size,
      total_languages: languages.size,
      total_translations: data?.length || 0,
      pages_by_language: Object.fromEntries(
        Object.entries(pagesByLanguage).map(([lang, pageSet]) => [lang, pageSet.size])
      ),
      languages_by_page: Object.fromEntries(
        Object.entries(languagesByPage).map(([page, langSet]) => [page, langSet.size])
      ),
    };
  }

  /**
   * Search translations by content
   */
  async searchTranslations(
    searchTerm: string,
    pageKey?: string,
    lang?: string
  ): Promise<PageTranslation[]> {
    let query = supabase
      .from('pages_i18n')
      .select('*')
      .or(`translation_key.ilike.%${searchTerm}%,translation_value.ilike.%${searchTerm}%`);

    if (pageKey) {
      query = query.eq('page_key', pageKey);
    }

    if (lang) {
      query = query.eq('lang', lang);
    }

    const { data, error } = await query.order('page_key').order('lang').order('translation_key');

    if (error) {
      throw new Error(`Failed to search translations: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Invalidate cache for specific page and language
   */
  private invalidateCache(pageKey: string, lang: string): void {
    if (this.queryClient) {
      this.queryClient.invalidateQueries({
        queryKey: ['pageTranslations', pageKey, lang]
      });
    }
  }

  /**
   * Invalidate cache for all languages of a specific page
   */
  private invalidatePageCache(pageKey: string): void {
    if (this.queryClient) {
      this.queryClient.invalidateQueries({
        queryKey: ['pageTranslations', pageKey]
      });
    }
  }

  /**
   * Clear all translation caches
   */
  clearAllCache(): void {
    if (this.queryClient) {
      this.queryClient.invalidateQueries({
        queryKey: ['pageTranslations']
      });
    }
  }

  /**
   * Prefetch translations for multiple pages and languages
   */
  async prefetchTranslations(
    pageKeys: string[],
    languages: string[]
  ): Promise<void> {
    if (!this.queryClient) {
      throw new Error('Query client not set. Call setQueryClient() first.');
    }

    const prefetchPromises: Promise<void>[] = [];

    pageKeys.forEach(pageKey => {
      languages.forEach(lang => {
        const promise = this.queryClient!.prefetchQuery({
          queryKey: ['pageTranslations', pageKey, lang],
          queryFn: () => this.getPageTranslations(pageKey, lang),
          staleTime: 5 * 60 * 1000, // 5 minutes
        });
        prefetchPromises.push(promise);
      });
    });

    await Promise.all(prefetchPromises);
  }
}

// Export singleton instance
export const pageTranslationService = new PageTranslationService();

export default PageTranslationService;