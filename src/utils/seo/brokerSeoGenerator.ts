import type { Broker } from '@/types/brokerTypes'

interface BrokerSEOData {
  title: string
  description: string
  keywords: string
  canonical: string
  ogImage: string
}

/**
 * Generates dynamic SEO data for broker profile pages
 * Follows programmatic SEO best practices for scalability
 */
export function generateBrokerSEO(
  broker: Broker | undefined,
  templateVariant: 'standard' | 'detailed' | 'comparison' = 'standard'
): BrokerSEOData {
  if (!broker) {
    return {
      title: 'Broker Not Found | BrokerAnalysis',
      description: 'The broker you are looking for could not be found. Browse our comprehensive list of regulated brokers.',
      keywords: 'broker not found, trading brokers, forex brokers, broker comparison',
      canonical: 'https://www.brokeranalysis.com/brokers/',
      ogImage: 'https://www.brokeranalysis.com/og-image-default.jpg'
    }
  }

  const brokerName = broker.name || 'Unknown Broker'
  const brokerSlug = generateBrokerSlug(brokerName)
  const rating = broker.rating || 0
  const reviewCount = broker.reviewCount || 0
  const minDeposit = broker.minDeposit || 0
  const spreadsFrom = broker.spreadsFrom
  const assetClasses = broker.assetClasses || []
  const regulation = broker.regulation || []
  const yearEstablished = broker.yearEstablished
  const headquarters = broker.headquarters

  // Generate dynamic title based on template variant
  const title = generateDynamicTitle(brokerName, templateVariant, {
    rating,
    reviewCount,
    regulation,
    assetClasses
  })

  // Generate comprehensive description
  const description = generateDynamicDescription(brokerName, {
    rating,
    reviewCount,
    minDeposit,
    spreadsFrom,
    assetClasses,
    regulation,
    yearEstablished,
    headquarters
  })

  // Generate targeted keywords
  const keywords = generateDynamicKeywords(brokerName, {
    assetClasses,
    regulation,
    headquarters
  })

  // Generate canonical URL
  const canonical = `https://www.brokeranalysis.com/brokers/${brokerSlug}`

  // Generate OG image URL (could be dynamic based on broker)
  const ogImage = broker.logo 
    ? `https://www.brokeranalysis.com/api/og/broker?name=${encodeURIComponent(brokerName)}&logo=${encodeURIComponent(broker.logo)}&rating=${rating}`
    : `https://www.brokeranalysis.com/og-image-broker-default.jpg`

  return {
    title,
    description,
    keywords,
    canonical,
    ogImage
  }
}

/**
 * Generates dynamic titles optimized for search engines
 */
function generateDynamicTitle(
  brokerName: string,
  variant: string,
  data: {
    rating: number
    reviewCount: number
    regulation: string[]
    assetClasses: string[]
  }
): string {
  const { rating, reviewCount, regulation, assetClasses } = data
  const currentYear = new Date().getFullYear()
  
  // Base title components
  const ratingText = rating > 0 ? ` ${rating.toFixed(1)}★` : ''
  const reviewText = reviewCount > 0 ? ` (${reviewCount} Reviews)` : ''
  const regulatedText = regulation.length > 0 ? ' Regulated' : ''
  const assetText = assetClasses.length > 0 ? ` ${assetClasses[0]}` : ''
  
  switch (variant) {
    case 'detailed':
      return `${brokerName} Review ${currentYear}${ratingText}${reviewText} | Detailed Analysis | BrokerAnalysis`
    case 'comparison':
      return `${brokerName} vs Competitors${ratingText} | ${currentYear} Broker Comparison | BrokerAnalysis`
    default:
      return `${brokerName} Review${ratingText}${reviewText} |${regulatedText}${assetText} Broker ${currentYear} | BrokerAnalysis`
  }
}

/**
 * Generates comprehensive meta descriptions
 */
function generateDynamicDescription(
  brokerName: string,
  data: {
    rating: number
    reviewCount: number
    minDeposit: number
    spreadsFrom: number | null
    assetClasses: string[]
    regulation: string[]
    yearEstablished: number | null
    headquarters: string | null
  }
): string {
  const {
    rating,
    reviewCount,
    minDeposit,
    spreadsFrom,
    assetClasses,
    regulation,
    yearEstablished,
    headquarters
  } = data

  let description = `${brokerName} review: `
  
  // Add rating and reviews
  if (rating > 0) {
    description += `${rating.toFixed(1)}/5 rating`
    if (reviewCount > 0) {
      description += ` from ${reviewCount} verified reviews. `
    } else {
      description += '. '
    }
  }
  
  // Add key trading details
  const tradingDetails = []
  if (minDeposit > 0) {
    tradingDetails.push(`$${minDeposit.toLocaleString()} min deposit`)
  }
  if (spreadsFrom !== null) {
    tradingDetails.push(`spreads from ${spreadsFrom} pips`)
  }
  if (assetClasses.length > 0) {
    tradingDetails.push(`${assetClasses.slice(0, 3).join(', ')} trading`)
  }
  
  if (tradingDetails.length > 0) {
    description += `${tradingDetails.join(', ')}. `
  }
  
  // Add regulation info
  if (regulation.length > 0) {
    description += `Regulated by ${regulation.slice(0, 2).join(', ')}. `
  }
  
  // Add establishment info
  if (yearEstablished) {
    description += `Established ${yearEstablished}. `
  }
  
  // Add location
  if (headquarters) {
    description += `Based in ${headquarters}. `
  }
  
  description += 'Compare fees, features & start trading today.'
  
  // Ensure description is within optimal length (150-160 characters)
  if (description.length > 160) {
    description = description.substring(0, 157) + '...'
  }
  
  return description
}

/**
 * Generates targeted keywords for SEO
 */
function generateDynamicKeywords(
  brokerName: string,
  data: {
    assetClasses: string[]
    regulation: string[]
    headquarters: string | null
  }
): string {
  const { assetClasses, regulation, headquarters } = data
  
  const keywords = [
    // Primary broker keywords
    `${brokerName.toLowerCase()} review`,
    `${brokerName.toLowerCase()} broker`,
    `${brokerName.toLowerCase()} trading`,
    
    // Asset class keywords
    ...assetClasses.map(asset => `${asset.toLowerCase()} broker`),
    ...assetClasses.map(asset => `${brokerName.toLowerCase()} ${asset.toLowerCase()}`),
    
    // Regulation keywords
    ...regulation.map(reg => `${reg.toLowerCase()} regulated broker`),
    
    // Location keywords
    ...(headquarters ? [`${headquarters.toLowerCase()} broker`, `broker in ${headquarters.toLowerCase()}`] : []),
    
    // General trading keywords
    'online trading platform',
    'forex broker review',
    'trading account',
    'broker comparison',
    'regulated broker',
    'trading fees',
    'broker ratings'
  ]
  
  // Remove duplicates and join
  return [...new Set(keywords)].slice(0, 20).join(', ')
}

/**
 * Generates URL-friendly slug from broker name
 */
function generateBrokerSlug(brokerName: string): string {
  return brokerName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Generates country-specific SEO data for geo-targeting
 */
export function generateCountrySpecificSEO(
  broker: Broker,
  countryCode: string,
  countryName: string
): BrokerSEOData {
  const brokerName = broker.name || 'Unknown Broker'
  const brokerSlug = generateBrokerSlug(brokerName)
  const rating = broker.rating || 0
  
  return {
    title: `${brokerName} Review ${countryName} ${new Date().getFullYear()} | Best Broker for ${countryName} Traders`,
    description: `${brokerName} review for ${countryName} traders. ${rating > 0 ? `${rating.toFixed(1)}/5 rating. ` : ''}Compare fees, regulation, and features for ${countryName} residents. Start trading today.`,
    keywords: `${brokerName.toLowerCase()} ${countryName.toLowerCase()}, best broker ${countryName.toLowerCase()}, ${countryName.toLowerCase()} trading, forex broker ${countryName.toLowerCase()}`,
    canonical: `https://www.brokeranalysis.com/brokers/${brokerSlug}/${countryCode.toLowerCase()}`,
    ogImage: `https://www.brokeranalysis.com/api/og/broker-country?name=${encodeURIComponent(brokerName)}&country=${encodeURIComponent(countryName)}`
  }
}

/**
 * Generates comparison-specific SEO data
 */
export function generateComparisonSEO(
  brokers: Broker[],
  comparisonType: string = 'general'
): BrokerSEOData {
  const brokerNames = brokers.map(b => b.name).slice(0, 3)
  const title = `${brokerNames.join(' vs ')} Comparison ${new Date().getFullYear()} | BrokerAnalysis`
  
  return {
    title,
    description: `Compare ${brokerNames.join(', ')} side-by-side. Detailed analysis of fees, features, regulation, and user reviews. Find the best broker for your trading needs.`,
    keywords: `${brokerNames.map(name => name.toLowerCase()).join(' vs ')}, broker comparison, best trading platform, forex broker comparison`,
    canonical: `https://www.brokeranalysis.com/compare/${brokerNames.map(name => generateBrokerSlug(name)).join('-vs-')}`,
    ogImage: `https://www.brokeranalysis.com/api/og/comparison?brokers=${encodeURIComponent(brokerNames.join(','))}`
  }
}