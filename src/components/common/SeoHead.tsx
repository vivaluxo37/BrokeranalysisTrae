import { useEffect } from 'react'

interface SeoHeadProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  keywords?: string
}

export function SeoHead({
  title = "BrokerAnalysis | AI-Powered Broker Comparison & Reviews",
  description = "Compare 500+ regulated brokers with our AI-driven 10-point evaluation, 2.5M+ verified user reviews, real-time data and personalized broker matching.",
  canonical = "https://www.brokeranalysis.com/",
  ogImage = "https://www.brokeranalysis.com/og-image-home.jpg",
  ogType = "website",
  keywords = "broker comparison, forex brokers, trading platforms, broker reviews, AI broker matching, regulated brokers, trading analysis"
}: SeoHeadProps) {
  
  useEffect(() => {
    // Update document title
    document.title = title
  }, [title])

  useEffect(() => {
    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)!
      
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    // Standard meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    updateMetaTag('author', 'BrokerAnalysis Team')
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0')

    // Open Graph meta tags
    updateMetaTag('og:title', title, true)
    updateMetaTag('og:description', description, true)
    updateMetaTag('og:image', ogImage, true)
    updateMetaTag('og:url', canonical, true)
    updateMetaTag('og:type', ogType, true)
    updateMetaTag('og:site_name', 'BrokerAnalysis', true)
    updateMetaTag('og:locale', 'en_US', true)

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:site', '@brokeranalysis')
    updateMetaTag('twitter:creator', '@brokeranalysis')
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', ogImage)

    // Additional SEO meta tags
    updateMetaTag('theme-color', '#10B981')
    updateMetaTag('msapplication-TileColor', '#10B981')
    updateMetaTag('application-name', 'BrokerAnalysis')
    updateMetaTag('apple-mobile-web-app-title', 'BrokerAnalysis')
    updateMetaTag('mobile-web-app-capable', 'yes')
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent')
  }, [description, ogImage, ogType, keywords, title, canonical])

  useEffect(() => {
    // Update canonical link
    let canonical_link = document.querySelector('link[rel="canonical"]')!
    if (!canonical_link) {
      canonical_link = document.createElement('link')
      canonical_link.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical_link)
    }
    canonical_link.setAttribute('href', canonical)
  }, [canonical])

  return null
}

// Pre-defined SEO configurations for different pages
export const seoConfigs = {
  home: {
    title: "BrokerAnalysis | AI-Powered Broker Comparison & Reviews",
    description: "Compare 500+ regulated brokers with our AI-driven 10-point evaluation, 2.5M+ verified user reviews, real-time data and personalized broker matching.",
    keywords: "broker comparison, forex brokers, trading platforms, broker reviews, AI broker matching, regulated brokers, trading analysis"
  },
  bestBrokers: {
    title: "Best Brokers 2025 | Top Rated Trading Platforms Compared",
    description: "Discover the best trading brokers of 2025. Compare fees, features, and ratings of 500+ regulated brokers with our comprehensive analysis.",
    keywords: "best brokers 2025, top trading platforms, broker rankings, forex brokers, stock brokers, crypto brokers"
  },
  brokerReviews: {
    title: "Broker Reviews | 2.5M+ Verified Trader Reviews & Ratings",
    description: "Read honest broker reviews from 2.5M+ verified traders. Get real insights on trading platforms, fees, customer service, and execution quality.",
    keywords: "broker reviews, trader reviews, broker ratings, trading platform reviews, forex broker reviews"
  },
  tools: {
    title: "Free Trading Tools & Calculators | Risk Management Tools",
    description: "Access free trading calculators, risk management tools, and analysis utilities. Calculate position sizes, pip values, and optimize your trading strategy.",
    keywords: "trading calculators, position size calculator, pip calculator, risk management tools, trading tools"
  },
  about: {
    title: "About BrokerAnalysis | Leading Broker Comparison Platform",
    description: "Learn about BrokerAnalysis - the trusted broker comparison platform serving 2.5M+ traders with AI-powered analysis and expert reviews since 2009.",
    keywords: "about brokeranalysis, broker comparison platform, trading platform analysis, financial technology"
  }
}
