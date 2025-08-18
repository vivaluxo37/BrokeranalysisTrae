import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { BrokerAnalysisNavigation } from '../components/broker-analysis/BrokerAnalysisNavigation';
import { BrokerAnalysisHero } from '../components/broker-analysis/BrokerAnalysisHero';
import { BrokerSearchSection } from '../components/broker-analysis/BrokerSearchSection';
import { TopRatedBrokers } from '../components/broker-analysis/TopRatedBrokers';
import { RecommendationWizard } from '../components/broker-analysis/RecommendationWizard';
import { MethodologySection } from '../components/broker-analysis/MethodologySection';
import { PopularComparisons } from '../components/broker-analysis/PopularComparisons';
import { LatestReviews } from '../components/broker-analysis/LatestReviews';
import { BrokerAnalysisFooter } from '../components/broker-analysis/BrokerAnalysisFooter';

// Mock data for the homepage
const mockTopBrokers = [
  {
    id: 'interactive-brokers',
    name: 'Interactive Brokers',
    slug: 'interactive-brokers',
    logo: 'https://images.unsplash.com/photo-1601888221673-626d26f726cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBsb2dvJTIwY29tcGFueSUyMGxvZ28lMjBwcm9mZXNzaW9uYWx8ZW58MHwyfHxibHVlfDE3NTU1MDM3Mzh8MA&ixlib=rb-4.1.0&q=85',
    rating: 4.8,
    trustScore: 95,
    minDeposit: 0,
    spreads: { eurusd: 0.2, gbpusd: 0.3, usdjpy: 0.2 },
    instruments: 150,
    regulators: ['sec', 'finra', 'fca'],
    keyFeatures: ['Global markets access', 'Professional tools', 'Low fees'],
    pros: ['Lowest trading costs', 'Advanced platform'],
    cons: ['Complex for beginners'],
    isPromoted: true
  },
  {
    id: 'td-ameritrade',
    name: 'TD Ameritrade',
    slug: 'td-ameritrade',
    logo: 'https://images.unsplash.com/photo-1633544325196-bcf8bf81ead0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBsb2dvJTIwY29tcGFueSUyMGxvZ28lMjBwcm9mZXNzaW9uYWx8ZW58MHwyfHxibHVlfDE3NTU1MDM3Mzh8MA&ixlib=rb-4.1.0&q=85',
    rating: 4.6,
    trustScore: 92,
    minDeposit: 0,
    spreads: { eurusd: 0.5, gbpusd: 0.6, usdjpy: 0.5 },
    instruments: 120,
    regulators: ['sec', 'finra'],
    keyFeatures: ['thinkorswim platform', 'Education resources', 'Research tools'],
    pros: ['Excellent education', 'Great platform'],
    cons: ['Higher fees for forex'],
    isPromoted: false
  },
  {
    id: 'etoro',
    name: 'eToro',
    slug: 'etoro',
    logo: 'https://images.unsplash.com/photo-1587953614947-36da9c480bb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxmaW5hbmNpYWwlMjBsb2dvJTIwY29tcGFueSUyMGxvZ28lMjBwcm9mZXNzaW9uYWx8ZW58MHwyfHxibHVlfDE3NTU1MDM3Mzh8MA&ixlib=rb-4.1.0&q=85',
    rating: 4.4,
    trustScore: 88,
    minDeposit: 200,
    spreads: { eurusd: 1.0, gbpusd: 1.5, usdjpy: 1.0 },
    instruments: 80,
    regulators: ['fca', 'cysec', 'asic'],
    keyFeatures: ['Social trading', 'Copy trading', 'Crypto support'],
    pros: ['User-friendly', 'Social features'],
    cons: ['Higher spreads'],
    isPromoted: false
  },
  {
    id: 'plus500',
    name: 'Plus500',
    slug: 'plus500',
    logo: 'https://images.unsplash.com/photo-1601888221673-626d26f726cd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBsb2dvJTIwY29tcGFueSUyMGxvZ28lMjBwcm9mZXNzaW9uYWx8ZW58MHwyfHxibHVlfDE3NTU1MDM3Mzh8MA&ixlib=rb-4.1.0&q=85',
    rating: 4.2,
    trustScore: 85,
    minDeposit: 100,
    spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 0.9 },
    instruments: 90,
    regulators: ['fca', 'cysec', 'asic'],
    keyFeatures: ['Simple platform', 'CFD trading', 'Mobile app'],
    pros: ['Easy to use', 'Good mobile app'],
    cons: ['Limited research tools'],
    isPromoted: false
  }
];

const mockComparisons = [
  {
    title: 'Interactive Brokers vs TD Ameritrade',
    slug: 'interactive-brokers-vs-td-ameritrade',
    description: 'Compare two of the most popular US brokers for stocks and options trading'
  },
  {
    title: 'Best Forex Brokers 2024',
    slug: 'best-forex-brokers-2024',
    description: 'Our top picks for forex trading with the lowest spreads and best platforms'
  },
  {
    title: 'eToro vs Plus500',
    slug: 'etoro-vs-plus500',
    description: 'Social trading vs traditional CFD broker - which is better for you?'
  },
  {
    title: 'Best Crypto Brokers',
    slug: 'best-crypto-brokers',
    description: 'Trade Bitcoin, Ethereum and altcoins with these top-rated crypto brokers'
  }
];

const mockReviews = [
  {
    id: '1',
    title: 'Interactive Brokers Review 2024: Still the Best for Professional Traders?',
    excerpt: 'Our comprehensive review of Interactive Brokers covers fees, platforms, pros and cons. Is it still the top choice for active traders in 2024?',
    image: 'https://images.unsplash.com/photo-1587401511935-a7f87afadf2f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx0cmFkaW5nJTIwZGFzaGJvYXJkJTIwZmluYW5jaWFsJTIwY2hhcnRzJTIwZ3JhcGhzJTIwY29tcHV0ZXIlMjBzY3JlZW58ZW58MHwwfHxibHVlfDE3NTU1MDM3Mzh8MA&ixlib=rb-4.1.0&q=85',
    publishedAt: '2024-01-15',
    readTime: 8,
    slug: 'interactive-brokers-review-2024',
    author: 'Sarah Johnson'
  },
  {
    id: '2',
    title: 'TD Ameritrade vs Charles Schwab: Which is Better After the Merger?',
    excerpt: 'Following the merger, how do TD Ameritrade and Charles Schwab compare? We analyze the changes and what they mean for traders.',
    image: 'https://images.unsplash.com/photo-1586448681913-2fc1b29c5cca?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHx0cmFkaW5nJTIwZGFzaGJvYXJkJTIwZmluYW5jaWFsJTIwY2hhcnRzJTIwZ3JhcGhzJTIwY29tcHV0ZXIlMjBzY3JlZW58ZW58MHwwfHxibHVlfDE3NTU1MDM3Mzh8MA&ixlib=rb-4.1.0&q=85',
    publishedAt: '2024-01-12',
    readTime: 6,
    slug: 'td-ameritrade-vs-charles-schwab-merger',
    author: 'Michael Chen'
  },
  {
    id: '3',
    title: 'Best Forex Brokers for Beginners in 2024',
    excerpt: 'New to forex trading? Our guide covers the best brokers for beginners, including educational resources and user-friendly platforms.',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHx0cmFkaW5nJTIwZGFzaGJvYXJkJTIwZmluYW5jaWFsJTIwY2hhcnRzJTIwZ3JhcGhzJTIwY29tcHV0ZXIlMjBzY3JlZW58ZW58MHwwfHxibHVlfDE3NTU1MDM3Mzh8MA&ixlib=rb-4.1.0&q=85',
    publishedAt: '2024-01-10',
    readTime: 5,
    slug: 'best-forex-brokers-beginners-2024',
    author: 'Emma Rodriguez'
  }
];

export function BrokerComparisonHomePage() {
  const handleSearch = (query: string, filters: any) => {
    console.log('Search:', query, filters);
    // Handle search functionality
  };

  return (
    <div className="min-h-screen bg-professional-black">
      {/* SEO Meta Tags */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>BrokerAnalysis - Independent Broker Reviews & Comparisons for Forex, Stocks, Crypto & CFDs</title>
        <meta name="title" content="BrokerAnalysis - Independent Broker Reviews & Comparisons for Forex, Stocks, Crypto & CFDs" />
        <meta name="description" content="Compare 100+ brokers with our independent reviews. Find the best broker for forex, stocks, crypto & CFDs. Expert analysis, real user reviews, and comprehensive comparisons." />
        <meta name="keywords" content="broker comparison, forex brokers, stock brokers, crypto brokers, CFD brokers, trading platform reviews, broker reviews, best brokers 2024" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="author" content="BrokerAnalysis" />
        <link rel="canonical" href="https://brokeranalysis.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brokeranalysis.com/" />
        <meta property="og:title" content="BrokerAnalysis - Independent Broker Reviews & Comparisons" />
        <meta property="og:description" content="Compare 100+ brokers with our independent reviews. Find the best broker for forex, stocks, crypto & CFDs." />
        <meta property="og:image" content="https://brokeranalysis.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="BrokerAnalysis" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://brokeranalysis.com/" />
        <meta property="twitter:title" content="BrokerAnalysis - Independent Broker Reviews & Comparisons" />
        <meta property="twitter:description" content="Compare 100+ brokers with our independent reviews. Find the best broker for forex, stocks, crypto & CFDs." />
        <meta property="twitter:image" content="https://brokeranalysis.com/twitter-image.jpg" />
        <meta property="twitter:creator" content="@BrokerAnalysis" />
        <meta property="twitter:site" content="@BrokerAnalysis" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="application-name" content="BrokerAnalysis" />
        <meta name="apple-mobile-web-app-title" content="BrokerAnalysis" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* Hreflang for Multilingual SEO */}
        <link rel="alternate" hrefLang="en" href="https://brokeranalysis.com/" />
        <link rel="alternate" hrefLang="es" href="https://brokeranalysis.com/es/" />
        <link rel="alternate" hrefLang="fr" href="https://brokeranalysis.com/fr/" />
        <link rel="alternate" hrefLang="de" href="https://brokeranalysis.com/de/" />
        <link rel="alternate" hrefLang="x-default" href="https://brokeranalysis.com/" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.brokeranalysis.com" />
        
        {/* Structured Data - Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": "https://brokeranalysis.com/#organization",
                "name": "BrokerAnalysis",
                "url": "https://brokeranalysis.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://brokeranalysis.com/logo.png",
                  "width": 200,
                  "height": 60
                },
                "description": "Independent broker reviews and comparisons for forex, stocks, crypto, and CFDs. Expert analysis of 100+ brokers worldwide.",
                "foundingDate": "2024",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+1-800-BROKER",
                  "contactType": "customer service",
                  "availableLanguage": ["English", "Spanish", "French", "German"]
                },
                "sameAs": [
                  "https://twitter.com/BrokerAnalysis",
                  "https://linkedin.com/company/brokeranalysis",
                  "https://facebook.com/BrokerAnalysis"
                ]
              },
              {
                "@type": "WebSite",
                "@id": "https://brokeranalysis.com/#website",
                "url": "https://brokeranalysis.com",
                "name": "BrokerAnalysis - Broker Reviews & Comparisons",
                "description": "Compare 100+ brokers with our independent reviews. Find the best broker for forex, stocks, crypto & CFDs.",
                "publisher": {
                  "@id": "https://brokeranalysis.com/#organization"
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://brokeranalysis.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "WebPage",
                "@id": "https://brokeranalysis.com/#webpage",
                "url": "https://brokeranalysis.com",
                "name": "BrokerAnalysis - Independent Broker Reviews & Comparisons",
                "isPartOf": {
                  "@id": "https://brokeranalysis.com/#website"
                },
                "about": {
                  "@id": "https://brokeranalysis.com/#organization"
                },
                "description": "Compare 100+ brokers with our independent reviews. Find the best broker for forex, stocks, crypto & CFDs.",
                "breadcrumb": {
                  "@id": "https://brokeranalysis.com/#breadcrumb"
                }
              },
              {
                "@type": "BreadcrumbList",
                "@id": "https://brokeranalysis.com/#breadcrumb",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://brokeranalysis.com"
                  }
                ]
              },
              {
                "@type": "FinancialService",
                "@id": "https://brokeranalysis.com/#service",
                "name": "Broker Analysis & Comparison Service",
                "description": "Independent analysis and comparison of online brokers for forex, stocks, crypto, and CFDs trading.",
                "provider": {
                  "@id": "https://brokeranalysis.com/#organization"
                },
                "serviceType": "Financial Analysis",
                "areaServed": "Worldwide",
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Broker Analysis Services",
                  "itemListElement": [
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Broker Reviews",
                        "description": "Comprehensive reviews of online brokers"
                      }
                    },
                    {
                      "@type": "Offer",
                      "itemOffered": {
                        "@type": "Service",
                        "name": "Broker Comparisons",
                        "description": "Side-by-side broker comparisons"
                      }
                    }
                  ]
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
      {/* Navigation */}
      <BrokerAnalysisNavigation />

      {/* Hero Section */}
      <BrokerAnalysisHero />

      {/* Broker Search Section */}
      <BrokerSearchSection onSearch={handleSearch} />

      {/* Top Rated Brokers */}
      <TopRatedBrokers brokers={mockTopBrokers} />

      {/* Recommendation Wizard */}
      <RecommendationWizard />

      {/* Methodology Section */}
      <MethodologySection />

      {/* Popular Comparisons & Tools */}
      <PopularComparisons comparisons={mockComparisons} />

      {/* Latest Reviews & Analysis */}
      <LatestReviews reviews={mockReviews} />

      {/* Footer */}
      <BrokerAnalysisFooter />
    </div>
  );
}