/**
 * Enhanced Structured Data Components for Generative Engine SEO
 * Includes Review, AggregateRating, and FAQPage JSON-LD schemas
 */

import React from 'react';
import { StructuredDataSchema, SEOContentBlock } from '../../services/GenerativeEngineService';

interface StructuredDataProps {
  schema: StructuredDataSchema;
}

function StructuredDataComponent({ schema }: StructuredDataProps) {
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

/**
 * Broker Review Structured Data
 */
export function BrokerReviewStructuredData({ broker }: { broker: any }) {
  const schema: StructuredDataSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    'itemReviewed': {
      '@type': 'FinancialService',
      'name': broker.name,
      'description': broker.description,
      'url': broker.website,
      'logo': broker.logo,
      'foundingDate': broker.yearEstablished?.toString(),
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': broker.headquarters
      },
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Trading Services',
        'itemListElement': broker.assetClasses?.map((asset: string) => ({
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Service',
            'name': `${asset.charAt(0).toUpperCase() + asset.slice(1)} Trading`,
            'description': `Professional ${asset} trading services`
          }
        })) || []
      },
      'makesOffer': {
        '@type': 'Offer',
        'name': 'Trading Account',
        'description': `Open a trading account with ${broker.name}`,
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'price': broker.minDeposit || 0,
          'priceCurrency': 'USD',
          'name': 'Minimum Deposit'
        }
      }
    },
    'reviewRating': {
      '@type': 'Rating',
      'ratingValue': broker.rating || 0,
      'bestRating': 5,
      'worstRating': 1
    },
    'author': {
      '@type': 'Organization',
      'name': 'BrokerAnalysis Editorial Team',
      'url': 'https://brokeranalysis.com/about',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://brokeranalysis.com/favicon.svg'
      },
      'sameAs': [
        'https://twitter.com/brokeranalysis',
        'https://linkedin.com/company/brokeranalysis'
      ]
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'BrokerAnalysis',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://brokeranalysis.com/favicon.svg'
      }
    },
    'datePublished': new Date().toISOString(),
    'dateModified': new Date().toISOString(),
    'reviewBody': `Comprehensive review of ${broker.name}, analyzing trading costs, platform features, regulatory compliance, and user experience. Based on detailed evaluation methodology and verified user feedback.`
  };

  return <StructuredDataComponent schema={schema} />;
}

/**
 * Aggregate Rating Structured Data
 */
export function AggregateRatingStructuredData({ broker }: { broker: any }) {
  const schema: StructuredDataSchema = {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    'itemReviewed': {
      '@type': 'FinancialService',
      'name': broker.name,
      'image': broker.logo,
      'url': broker.website,
      'description': broker.description,
      'provider': {
        '@type': 'Organization',
        'name': broker.name,
        'url': broker.website
      }
    },
    'ratingValue': broker.rating || 0,
    'reviewCount': broker.reviewCount || 0,
    'bestRating': 5,
    'worstRating': 1,
    'ratingExplanation': `Rating based on comprehensive analysis of trading costs, platform quality, regulatory compliance, and ${broker.reviewCount || 0} verified user reviews.`
  };

  return <StructuredDataComponent schema={schema} />;
}

/**
 * FAQ Page Structured Data
 */
export function FAQPageStructuredData({ faqs }: { faqs: SEOContentBlock['faqs'] }) {
  const schema: StructuredDataSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return <StructuredDataComponent schema={schema} />;
}

/**
 * Financial Service Structured Data (Enhanced)
 */
export function FinancialServiceStructuredData({ broker }: { broker: any }) {
  const schema: StructuredDataSchema = {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    'name': broker.name,
    'description': broker.description,
    'url': broker.website,
    'logo': broker.logo,
    'image': broker.logo,
    'foundingDate': broker.yearEstablished?.toString(),
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': broker.headquarters
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': broker.rating || 0,
      'reviewCount': broker.reviewCount || 0,
      'bestRating': 5,
      'worstRating': 1
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Trading Services',
      'itemListElement': broker.assetClasses?.map((asset: string) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': `${asset.charAt(0).toUpperCase() + asset.slice(1)} Trading`,
          'description': `Professional ${asset} trading services with competitive spreads and advanced platforms`
        },
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'price': broker.spreadsFrom || 0,
          'priceCurrency': 'USD',
          'name': 'Spreads From'
        }
      })) || []
    },
    'serviceType': 'Online Trading Platform',
    'areaServed': 'Worldwide',
    'audience': {
      '@type': 'Audience',
      'audienceType': 'Retail and Professional Traders'
    },
    'feesAndCommissionsSpecification': broker.costs ? {
      '@type': 'PriceSpecification',
      'description': `Spreads from ${broker.spreadsFrom || 0} pips, minimum deposit $${broker.minDeposit || 0}`,
      'price': broker.minDeposit || 0,
      'priceCurrency': 'USD'
    } : undefined,
    'termsOfService': `${broker.website}/terms`,
    'privacyPolicy': `${broker.website}/privacy`
  };

  return <StructuredDataComponent schema={schema} />;
}

/**
 * Breadcrumb Structured Data
 */
export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const schema: StructuredDataSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };

  return <StructuredDataComponent schema={schema} />;
}

/**
 * Article Structured Data for Blog Posts/Guides
 */
export function ArticleStructuredData({ 
  title, 
  description, 
  author, 
  datePublished, 
  dateModified,
  image,
  url
}: {
  title: string;
  description: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
}) {
  const schema: StructuredDataSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': title,
    'description': description,
    'image': image || 'https://brokeranalysis.com/favicon.svg',
    'url': url,
    'datePublished': datePublished,
    'dateModified': dateModified || datePublished,
    'author': {
      '@type': 'Organization',
      'name': author || 'BrokerAnalysis Editorial Team',
      'url': 'https://brokeranalysis.com/about'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'BrokerAnalysis',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://brokeranalysis.com/favicon.svg'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': url
    }
  };

  return <StructuredDataComponent schema={schema} />;
}

/**
 * How-To Structured Data for Trading Guides
 */
export function HowToStructuredData({ 
  name, 
  description, 
  steps 
}: {
  name: string;
  description: string;
  steps: Array<{ name: string; text: string; image?: string }>;
}) {
  const schema: StructuredDataSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': name,
    'description': description,
    'image': 'https://brokeranalysis.com/favicon.svg',
    'totalTime': 'PT10M',
    'estimatedCost': {
      '@type': 'MonetaryAmount',
      'currency': 'USD',
      'value': '0'
    },
    'supply': [
      {
        '@type': 'HowToSupply',
        'name': 'Computer or Mobile Device'
      },
      {
        '@type': 'HowToSupply',
        'name': 'Internet Connection'
      }
    ],
    'tool': [
      {
        '@type': 'HowToTool',
        'name': 'Web Browser or Trading App'
      }
    ],
    'step': steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.name,
      'text': step.text,
      'image': step.image || 'https://brokeranalysis.com/favicon.svg'
    }))
  };

  return <StructuredDataComponent schema={schema} />;
}

/**
 * Comparison Table Structured Data
 */
export function ComparisonStructuredData({ 
  brokers 
}: { 
  brokers: Array<any> 
}) {
  const schema: StructuredDataSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Broker Comparison',
    'description': 'Side-by-side comparison of regulated forex and CFD brokers',
    'numberOfItems': brokers.length,
    'itemListElement': brokers.map((broker, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'FinancialService',
        'name': broker.name,
        'description': broker.description,
        'url': broker.website,
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': broker.rating || 0,
          'reviewCount': broker.reviewCount || 0,
          'bestRating': 5
        }
      }
    }))
  };

  return <StructuredDataComponent schema={schema} />;
}