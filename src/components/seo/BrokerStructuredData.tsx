import { useEffect } from 'react'
import type { Broker } from '@/types/brokerTypes'

interface BrokerStructuredDataProps {
  broker: Broker
}

/**
 * Generates and injects JSON-LD structured data for broker profiles
 * Supports multiple schema types for comprehensive SEO coverage
 */
export function BrokerStructuredData({ broker }: BrokerStructuredDataProps) {
  useEffect(() => {
    if (!broker) return

    // Generate multiple structured data schemas
    const schemas = [
      generateFinancialServiceSchema(broker),
      generateOrganizationSchema(broker),
      generateReviewSchema(broker),
      generateBreadcrumbSchema(broker),
      generateFAQSchema(broker)
    ].filter(Boolean)

    // Create script element with JSON-LD
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schemas)
    script.id = 'broker-structured-data'

    // Remove existing structured data if present
    const existingScript = document.getElementById('broker-structured-data')
    if (existingScript) {
      document.head.removeChild(existingScript)
    }

    // Add new structured data
    document.head.appendChild(script)

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.getElementById('broker-structured-data')
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove)
      }
    }
  }, [broker])

  return null
}

/**
 * Generates FinancialService schema for the broker
 */
function generateFinancialServiceSchema(broker: Broker) {
  const brokerName = broker.name || 'Unknown Broker'
  const website = broker.website || broker.details?.website
  const description = broker.description || broker.details?.description
  const logo = broker.logo
  const headquarters = broker.headquarters || broker.details?.headquarters
  const yearEstablished = broker.yearEstablished || broker.details?.foundedYear
  const regulation = broker.regulation || []
  const assetClasses = broker.assetClasses || []
  const platforms = broker.platforms || []
  const rating = broker.rating || 0
  const reviewCount = broker.reviewCount || 0

  return {
    '@context': 'https://schema.org',
    '@type': 'FinancialService',
    '@id': `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}#financialservice`,
    name: brokerName,
    description: description || `${brokerName} is a financial services provider offering trading services across multiple asset classes.`,
    url: website,
    logo: logo ? {
      '@type': 'ImageObject',
      url: logo,
      width: 200,
      height: 200
    } : undefined,
    address: headquarters ? {
      '@type': 'PostalAddress',
      addressLocality: headquarters
    } : undefined,
    foundingDate: yearEstablished ? `${yearEstablished}-01-01` : undefined,
    serviceType: assetClasses.length > 0 ? assetClasses.join(', ') : 'Financial Trading Services',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${brokerName} Trading Services`,
      itemListElement: assetClasses.map((asset, index) => ({
        '@type': 'Offer',
        '@id': `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}#offer-${index}`,
        name: `${asset} Trading`,
        description: `Trade ${asset} with ${brokerName}`,
        category: asset
      }))
    },
    aggregateRating: rating > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      bestRating: '5',
      worstRating: '1',
      ratingCount: reviewCount || 1
    } : undefined,
    sameAs: website ? [website] : undefined
  }
}

/**
 * Generates Organization schema for the broker
 */
function generateOrganizationSchema(broker: Broker) {
  const brokerName = broker.name || 'Unknown Broker'
  const website = broker.website || broker.details?.website
  const logo = broker.logo
  const headquarters = broker.headquarters || broker.details?.headquarters
  const yearEstablished = broker.yearEstablished || broker.details?.foundedYear
  const email = broker.email || broker.details?.email
  const phone = broker.phone || broker.details?.phone

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}#organization`,
    name: brokerName,
    url: website,
    logo: logo ? {
      '@type': 'ImageObject',
      url: logo,
      width: 200,
      height: 200
    } : undefined,
    foundingDate: yearEstablished ? `${yearEstablished}-01-01` : undefined,
    address: headquarters ? {
      '@type': 'PostalAddress',
      addressLocality: headquarters
    } : undefined,
    contactPoint: (email || phone) ? {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: email,
      telephone: phone,
      areaServed: 'Worldwide',
      availableLanguage: 'English'
    } : undefined,
    sameAs: website ? [website] : undefined
  }
}

/**
 * Generates Review schema for broker ratings
 */
function generateReviewSchema(broker: Broker) {
  const brokerName = broker.name || 'Unknown Broker'
  const rating = broker.rating || 0
  const reviewCount = broker.reviewCount || 0

  if (rating === 0 || reviewCount === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}#review`,
    itemReviewed: {
      '@type': 'FinancialService',
      name: brokerName,
      '@id': `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}#financialservice`
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating.toFixed(1),
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'BrokerAnalysis',
      url: 'https://www.brokeranalysis.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'BrokerAnalysis',
      url: 'https://www.brokeranalysis.com'
    },
    datePublished: new Date().toISOString().split('T')[0],
    reviewBody: `Comprehensive review of ${brokerName} based on ${reviewCount} user reviews and expert analysis.`
  }
}

/**
 * Generates Breadcrumb schema for navigation
 */
function generateBreadcrumbSchema(broker: Broker) {
  const brokerName = broker.name || 'Unknown Broker'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.brokeranalysis.com/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Brokers',
        item: 'https://www.brokeranalysis.com/brokers/'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${brokerName} Review`,
        item: `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}`
      }
    ]
  }
}

/**
 * Generates FAQ schema for common broker questions
 */
function generateFAQSchema(broker: Broker) {
  const brokerName = broker.name || 'Unknown Broker'
  const minDeposit = broker.minDeposit || 0
  const regulation = broker.regulation || []
  const assetClasses = broker.assetClasses || []
  const platforms = broker.platforms || []
  const website = broker.website || broker.details?.website

  const faqs = [
    {
      question: `Is ${brokerName} regulated?`,
      answer: regulation.length > 0 
        ? `Yes, ${brokerName} is regulated by ${regulation.join(', ')}.`
        : `Please contact ${brokerName} directly for information about their regulatory status.`
    },
    {
      question: `What is the minimum deposit for ${brokerName}?`,
      answer: minDeposit > 0 
        ? `The minimum deposit for ${brokerName} is $${minDeposit.toLocaleString()}.`
        : `Please contact ${brokerName} for information about minimum deposit requirements.`
    },
    {
      question: `What can I trade with ${brokerName}?`,
      answer: assetClasses.length > 0
        ? `${brokerName} offers trading in ${assetClasses.join(', ')}.`
        : `Please visit ${brokerName}'s website for information about available trading instruments.`
    },
    {
      question: `What trading platforms does ${brokerName} offer?`,
      answer: platforms.length > 0
        ? `${brokerName} offers ${platforms.join(', ')} trading platforms.`
        : `Please contact ${brokerName} for information about their trading platforms.`
    },
    {
      question: `How do I open an account with ${brokerName}?`,
      answer: website
        ? `You can open an account with ${brokerName} by visiting their website at ${website} and following their account opening process.`
        : `Please contact ${brokerName} directly for information about opening an account.`
    }
  ]

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}#faq`,
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      '@id': `https://www.brokeranalysis.com/brokers/${generateSlug(brokerName)}#faq-${index}`,
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

/**
 * Generates URL-friendly slug from broker name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export default BrokerStructuredData