import React, { ComponentType } from 'react';
import { usePageTranslationFunction } from '../../hooks/usePageTranslations';
import { useI18n } from '../../providers/I18nProvider';

interface WithPageTranslationsProps {
  pageKey: string;
  fallbackNamespace?: string;
}

interface InjectedTranslationProps {
  t: (key: string, fallback?: string) => string;
  isTranslationsLoading: boolean;
  translationsError: Error | null;
  refetchTranslations: () => void;
}

/**
 * Higher-Order Component that injects page-specific translations from Supabase
 * into any component, providing a seamless integration with the existing i18n system
 * 
 * @param WrappedComponent - The component to wrap with translation functionality
 * @param pageKey - The page key to fetch translations for
 * @param fallbackNamespace - Optional fallback namespace for react-i18next
 */
export function withPageTranslations<P extends object>(
  WrappedComponent: ComponentType<P & InjectedTranslationProps>,
  pageKey: string,
  fallbackNamespace?: string
) {
  const WithPageTranslationsComponent = (props: P) => {
    const { language, t: i18nT } = useI18n();
    
    const {
      t: pageT,
      isLoading: isTranslationsLoading,
      error: translationsError,
      refetch: refetchTranslations
    } = usePageTranslationFunction(pageKey, language);

    // Enhanced translation function that falls back to react-i18next
    const enhancedT = (key: string, fallback?: string): string => {
      // First try page-specific translations from Supabase
      const pageTranslation = pageT(key);
      if (pageTranslation !== key) {
        return pageTranslation;
      }

      // Fall back to react-i18next with optional namespace
      if (fallbackNamespace) {
        const i18nTranslation = i18nT(`${fallbackNamespace}:${key}`, { defaultValue: '' });
        if (i18nTranslation) {
          return i18nTranslation;
        }
      }

      // Try without namespace
      const generalTranslation = i18nT(key, { defaultValue: '' });
      if (generalTranslation) {
        return generalTranslation;
      }

      // Return fallback or key
      return fallback || key;
    };

    const injectedProps: InjectedTranslationProps = {
      t: enhancedT,
      isTranslationsLoading,
      translationsError,
      refetchTranslations
    };

    return <WrappedComponent {...props} {...injectedProps} />;
  };

  WithPageTranslationsComponent.displayName = `withPageTranslations(${WrappedComponent.displayName || WrappedComponent.name})`;

  return WithPageTranslationsComponent;
}

/**
 * Hook version of the HOC for functional components that prefer hooks
 * 
 * @param pageKey - The page key to fetch translations for
 * @param fallbackNamespace - Optional fallback namespace for react-i18next
 */
export function useEnhancedTranslations(
  pageKey: string,
  fallbackNamespace?: string
) {
  const { language, t: i18nT } = useI18n();
  
  const {
    t: pageT,
    isLoading: isTranslationsLoading,
    error: translationsError,
    refetch: refetchTranslations
  } = usePageTranslationFunction(pageKey, language);

  // Enhanced translation function that falls back to react-i18next
  const t = (key: string, fallback?: string): string => {
    // First try page-specific translations from Supabase
    const pageTranslation = pageT(key);
    if (pageTranslation !== key) {
      return pageTranslation;
    }

    // Fall back to react-i18next with optional namespace
    if (fallbackNamespace) {
      const i18nTranslation = i18nT(`${fallbackNamespace}:${key}`, { defaultValue: '' });
      if (i18nTranslation) {
        return i18nTranslation;
      }
    }

    // Try without namespace
    const generalTranslation = i18nT(key, { defaultValue: '' });
    if (generalTranslation) {
      return generalTranslation;
    }

    // Return fallback or key
    return fallback || key;
  };

  return {
    t,
    isTranslationsLoading,
    translationsError,
    refetchTranslations
  };
}

/**
 * Component that provides page translations to its children via render prop pattern
 */
interface PageTranslationProviderProps {
  pageKey: string;
  fallbackNamespace?: string;
  children: (props: InjectedTranslationProps) => React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: (error: Error) => React.ReactNode;
}

export const PageTranslationProvider: React.FC<PageTranslationProviderProps> = ({
  pageKey,
  fallbackNamespace,
  children,
  loadingComponent,
  errorComponent
}) => {
  const translationProps = useEnhancedTranslations(pageKey, fallbackNamespace);

  if (translationProps.isTranslationsLoading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  if (translationProps.translationsError && errorComponent) {
    return <>{errorComponent(translationProps.translationsError)}</>;
  }

  return <>{children(translationProps)}</>;
};

/**
 * Utility function to create a page-specific translation hook
 * 
 * @param pageKey - The page key to create the hook for
 * @param fallbackNamespace - Optional fallback namespace
 */
export function createPageTranslationHook(
  pageKey: string,
  fallbackNamespace?: string
) {
  return function usePageSpecificTranslations() {
    return useEnhancedTranslations(pageKey, fallbackNamespace);
  };
}

/**
 * Example usage:
 * 
 * // Using HOC
 * const MyPageWithTranslations = withPageTranslations(MyPage, 'homepage', 'common');
 * 
 * // Using hook
 * function MyPage() {
 *   const { t, isTranslationsLoading } = useEnhancedTranslations('homepage', 'common');
 *   return <div>{t('welcome_message', 'Welcome!')}</div>;
 * }
 * 
 * // Using render prop
 * <PageTranslationProvider pageKey="homepage" fallbackNamespace="common">
 *   {({ t, isTranslationsLoading }) => (
 *     <div>{t('welcome_message', 'Welcome!')}</div>
 *   )}
 * </PageTranslationProvider>
 * 
 * // Creating page-specific hook
 * const useHomepageTranslations = createPageTranslationHook('homepage', 'common');
 * function HomePage() {
 *   const { t } = useHomepageTranslations();
 *   return <div>{t('hero_title')}</div>;
 * }
 */

export default withPageTranslations;