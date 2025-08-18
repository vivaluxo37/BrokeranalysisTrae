/**
 * Comprehensive SEO Meta Tags Component
 * Handles AI visibility hygiene: titles, descriptions, canonical, OG, Twitter cards
 */

import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';

export interface SEOMetaData {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  alternateLanguages?: Array<{ hreflang: string; href: string }>;
  noindex?: boolean;
  nofollow?: boolean;
}

interface SEOMetaTagsProps {
  meta: SEOMetaData;
  siteName?: string;
  twitterSite?: string;
}

export function SEOMetaTags({ 
  meta, 
  siteName = 'BrokerAnalysis',
  twitterSite = '@brokeranalysis'
}: SEOMetaTagsProps) {
  const {
    title,
    description,
    canonical,
    keywords,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    author,
    publishedTime,
    modifiedTime,
    locale = 'en_US',
    alternateLanguages = [],
    noindex = false,
    nofollow = false
  } = meta;

  // Generate robots meta content
  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow'
  ].join(', ');

  // Clean and optimize title (max 60 characters for better display)
  const cleanTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  
  // Clean and optimize description (max 160 characters)
  const cleanDescription = description.length > 160 ? `${description.substring(0, 157)}...` : description;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{cleanTitle}</title>
      <meta name="description" content={cleanDescription} />
      <meta name="robots" content={robotsContent} />
      
      {/* Keywords */}
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Author */}
      {author && <meta name="author" content={author} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content={locale.split('_')[0]} />
      
      {/* Alternate Language Links */}
      {alternateLanguages.map((alt, index) => (
        <link 
          key={index}
          rel="alternate" 
          hrefLang={alt.hreflang} 
          href={alt.href} 
        />
      ))}
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={cleanTitle} />
      <meta property="og:description" content={cleanDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Open Graph Image */}
      {ogImage && (
        <>
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:type" content="image/png" />
          <meta property="og:image:alt" content={cleanTitle} />
        </>
      )}
      
      {/* Article specific Open Graph */}
      {ogType === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          <meta property="article:section" content="Finance" />
          <meta property="article:tag" content="Broker Review" />
          <meta property="article:tag" content="Trading" />
          <meta property="article:tag" content="Forex" />
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={cleanTitle} />
      <meta name="twitter:description" content={cleanDescription} />
      
      {/* Twitter Image */}
      {ogImage && (
        <>
          <meta name="twitter:image" content={ogImage} />
          <meta name="twitter:image:alt" content={cleanTitle} />
        </>
      )}
      
      {/* Additional Meta Tags for AI Crawlers */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Structured Data Hints */}
      <meta name="application-name" content={siteName} />
      <meta name="msapplication-TileColor" content="#2563eb" />
      
      {/* Security Headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
    </Helmet>
  );
}

/**
 * Generate SEO-optimized meta data for broker pages
 */
export function generateBrokerSEOMeta(broker: any, locale: string = 'en'): SEOMetaData {
  const brokerName = broker.name;
  const rating = broker.rating || 0;
  const reviewCount = broker.reviewCount || 0;
  const year = new Date().getFullYear();
  
  // Generate entity-rich title
  const title = `${brokerName} Review ${year}: ${rating}/5 Stars - Complete Analysis | BrokerAnalysis`;
  
  // Generate comprehensive description with entities
  const regulationText = broker.isRegulated ? 
    `regulated by ${broker.regulators?.join(', ').toUpperCase()}` : 
    'unregulated';
  
  const platformText = broker.platforms?.includes('mt4') || broker.platforms?.includes('mt5') ?
    `MetaTrader ${broker.platforms.includes('mt5') ? '5' : '4'}` :
    broker.platforms?.join(', ').toUpperCase() || 'multiple platforms';
  
  const description = `${brokerName} review: ${regulationText} broker offering ${broker.assetClasses?.join(', ') || 'forex, CFDs'} trading on ${platformText}. ${rating}/5 stars from ${reviewCount} reviews. Min deposit $${broker.minDeposit || 0}, spreads from ${broker.spreadsFrom || 0} pips.`;
  
  // Generate keywords with entities
  const keywords = [
    `${brokerName} review`,
    `${brokerName} broker`,
    'forex broker',
    'CFD trading',
    'MetaTrader',
    broker.regulators?.join(', ') || 'regulated broker',
    'online trading',
    'broker comparison'
  ].join(', ');
  
  // Generate canonical URL
  const slug = brokerName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const canonical = `https://brokeranalysis.com/${locale}/brokers/${slug}`;
  
  // Generate OG image URL
  const ogImage = `https://brokeranalysis.com/api/og/broker/${slug}?rating=${rating}&reviews=${reviewCount}`;
  
  // Generate alternate languages
  const alternateLanguages = [
    { hreflang: 'en', href: `https://brokeranalysis.com/en/brokers/${slug}` },
    { hreflang: 'es', href: `https://brokeranalysis.com/es/brokers/${slug}` },
    { hreflang: 'fr', href: `https://brokeranalysis.com/fr/brokers/${slug}` },
    { hreflang: 'de', href: `https://brokeranalysis.com/de/brokers/${slug}` },
    { hreflang: 'x-default', href: `https://brokeranalysis.com/brokers/${slug}` }
  ];
  
  return {
    title,
    description,
    canonical,
    keywords,
    ogImage,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    author: 'BrokerAnalysis Editorial Team',
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`,
    alternateLanguages
  };
}

/**
 * Generate SEO meta for comparison pages
 */
export function generateComparisonSEOMeta(broker1: any, broker2: any, locale: string = 'en'): SEOMetaData {
  const year = new Date().getFullYear();
  const title = `${broker1.name} vs ${broker2.name} ${year}: Complete Comparison | BrokerAnalysis`;
  
  const description = `Compare ${broker1.name} vs ${broker2.name}: fees, platforms, regulation, and features. Expert analysis with ${broker1.rating}/5 vs ${broker2.rating}/5 ratings. Find the best broker for your trading needs.`;
  
  const keywords = [
    `${broker1.name} vs ${broker2.name}`,
    'broker comparison',
    'forex broker comparison',
    'trading platform comparison',
    `${broker1.name} review`,
    `${broker2.name} review`
  ].join(', ');
  
  const slug1 = broker1.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const slug2 = broker2.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const canonical = `https://brokeranalysis.com/${locale}/compare/${slug1}-vs-${slug2}`;
  
  const ogImage = `https://brokeranalysis.com/api/og/comparison/${slug1}-vs-${slug2}`;
  
  return {
    title,
    description,
    canonical,
    keywords,
    ogImage,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    author: 'BrokerAnalysis Editorial Team',
    publishedTime: new Date().toISOString(),
    modifiedTime: new Date().toISOString(),
    locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`
  };
}

/**
 * Generate SEO meta for category pages
 */
export function generateCategorySEOMeta(
  category: string, 
  brokerCount: number, 
  locale: string = 'en'
): SEOMetaData {
  const year = new Date().getFullYear();
  const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);
  
  const title = `Best ${categoryTitle} Brokers ${year}: Top ${brokerCount} Regulated Platforms | BrokerAnalysis`;
  
  const description = `Find the best ${category} brokers in ${year}. Compare ${brokerCount}+ regulated platforms with expert reviews, competitive spreads, and verified user ratings. Start trading today.`;
  
  const keywords = [
    `best ${category} brokers`,
    `${category} trading`,
    'regulated brokers',
    'broker comparison',
    'trading platforms',
    `${category} broker review`
  ].join(', ');
  
  const canonical = `https://brokeranalysis.com/${locale}/brokers/${category}`;
  const ogImage = `https://brokeranalysis.com/api/og/category/${category}?count=${brokerCount}`;
  
  return {
    title,
    description,
    canonical,
    keywords,
    ogImage,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    locale: locale === 'en' ? 'en_US' : `${locale}_${locale.toUpperCase()}`
  };
}