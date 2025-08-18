import React from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../../i18n/config'
import type { SupportedLanguage } from '../../i18n/config'
import { getHrefLangAttributes, removeLanguageFromPath, addLanguageToPath } from '../../utils/i18n'

/**
 * Props for I18nSEO component
 */
interface I18nSEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonicalUrl?: string
  noindex?: boolean
  nofollow?: boolean
  ogImage?: string
  ogType?: string
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  structuredData?: Record<string, any>
}

/**
 * I18n SEO component that handles hreflang, meta tags, and structured data
 */
export function I18nSEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  noindex = false,
  nofollow = false,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData
}: I18nSEOProps) {
  const { i18n } = useTranslation()
  const location = useLocation()
  
  const currentLanguage = i18n.language as SupportedLanguage
  const currentLanguageInfo = supportedLanguages.find(lang => lang.code === currentLanguage)
  const isRTL = currentLanguageInfo?.rtl || false
  
  // Get clean path without language prefix
  const cleanPath = removeLanguageFromPath(location.pathname)
  
  // Generate hreflang attributes
  const hrefLangAttributes = getHrefLangAttributes(cleanPath)
  
  // Generate canonical URL
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://brokeranalysis.com'
  const defaultCanonical = canonicalUrl || `${baseUrl}${addLanguageToPath(cleanPath, currentLanguage)}`
  
  // Generate alternate URLs for each language
  const alternateUrls = supportedLanguages.map(lang => ({
    hrefLang: lang.code,
    href: `${baseUrl}${addLanguageToPath(cleanPath, lang.code)}`
  }))
  
  // Add x-default for English
  alternateUrls.push({
    hrefLang: 'x-default',
    href: `${baseUrl}${cleanPath}`
  })
  
  // Robots meta content
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ')
  
  // Generate structured data with language context
  const enhancedStructuredData = structuredData ? {
    ...structuredData,
    '@context': 'https://schema.org',
    inLanguage: currentLanguage,
    ...(structuredData['@type'] === 'WebPage' && {
      url: defaultCanonical,
      mainEntity: {
        ...structuredData.mainEntity,
        inLanguage: currentLanguage
      }
    })
  } : null
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <html lang={currentLanguage} dir={isRTL ? 'rtl' : 'ltr'} />
      
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Robots */}
      <meta name="robots" content={robotsContent} />
      
      {/* Language and locale */}
      <meta name="language" content={currentLanguage} />
      <meta property="og:locale" content={currentLanguage.replace('-', '_')} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={defaultCanonical} />
      
      {/* Hreflang attributes */}
      {alternateUrls.map(({ hrefLang, href }) => (
        <link
          key={hrefLang}
          rel="alternate"
          hrefLang={hrefLang}
          href={href}
        />
      ))}
      
      {/* Open Graph */}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={defaultCanonical} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Structured Data */}
      {enhancedStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(enhancedStructuredData)}
        </script>
      )}
      
      {/* Additional language-specific meta tags */}
      {isRTL && <meta name="direction" content="rtl" />}
      
      {/* Preload alternate language resources */}
      {supportedLanguages
        .filter(lang => lang.code !== currentLanguage)
        .slice(0, 3) // Limit to top 3 alternate languages
        .map(lang => (
          <link
            key={`preload-${lang.code}`}
            rel="preload"
            href={`/locales/${lang.code}/common.json`}
            as="fetch"
            crossOrigin="anonymous"
          />
        ))
      }
    </Helmet>
  )
}

/**
 * Hook to generate SEO data for broker pages
 */
export function useBrokerSEO(broker: {
  name: string
  description?: string
  rating?: number
  reviewCount?: number
  minDeposit?: number
  spread?: number
  leverage?: number
  regulation?: string[]
  logo?: string
}) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language as SupportedLanguage
  
  const title = t('broker.title', { name: broker.name, defaultValue: `${broker.name} Review & Analysis` })
  const description = broker.description || t('broker.defaultDescription', {
    name: broker.name,
    rating: broker.rating,
    defaultValue: `Comprehensive review of ${broker.name}. Rating: ${broker.rating}/5 based on ${broker.reviewCount} reviews.`
  })
  
  const keywords = [
    broker.name,
    t('broker.review'),
    t('broker.analysis'),
    t('broker.rating'),
    'forex broker',
    'trading platform',
    ...(broker.regulation || [])
  ]
  
  const structuredData = {
    '@type': 'FinancialProduct',
    name: broker.name,
    description,
    provider: {
      '@type': 'Organization',
      name: broker.name,
      ...(broker.logo && { logo: broker.logo })
    },
    ...(broker.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: broker.rating,
        reviewCount: broker.reviewCount || 0,
        bestRating: 5,
        worstRating: 1
      }
    }),
    offers: {
      '@type': 'Offer',
      ...(broker.minDeposit && { price: broker.minDeposit }),
      priceCurrency: 'USD'
    }
  }
  
  return {
    title,
    description,
    keywords,
    structuredData,
    ogImage: broker.logo
  }
}

/**
 * Hook to generate SEO data for comparison pages
 */
export function useComparisonSEO(brokers: Array<{ name: string; rating?: number }>) {
  const { t } = useTranslation()
  
  const brokerNames = brokers.map(b => b.name).join(' vs ')
  const title = t('compare.title', { brokers: brokerNames, defaultValue: `Compare ${brokerNames}` })
  const description = t('compare.description', {
    brokers: brokerNames,
    count: brokers.length,
    defaultValue: `Detailed comparison of ${brokerNames}. Compare features, fees, and ratings.`
  })
  
  const keywords = [
    ...brokers.map(b => b.name),
    t('compare.keyword'),
    'broker comparison',
    'forex broker comparison',
    'trading platform comparison'
  ]
  
  const structuredData = {
    '@type': 'ComparisonTable',
    name: title,
    description,
    about: brokers.map(broker => ({
      '@type': 'FinancialProduct',
      name: broker.name,
      ...(broker.rating && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: broker.rating,
          bestRating: 5,
          worstRating: 1
        }
      })
    }))
  }
  
  return {
    title,
    description,
    keywords,
    structuredData
  }
}

export default I18nSEO