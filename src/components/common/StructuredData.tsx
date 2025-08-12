// SEO Structured Data Components for better organization

export function WebsiteStructuredData() {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "BrokerAnalysis - Compare 500+ Regulated Brokers",
        "description": "Find the best forex, stock, crypto and CFD brokers. Compare fees, spreads, platforms and read verified reviews from 2.5M+ traders worldwide.",
        "url": "https://brokeranalysis.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://brokeranalysis.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": "BrokerAnalysis",
          "logo": {
            "@type": "ImageObject",
            "url": "https://brokeranalysis.com/favicon.svg"
          }
        }
      })}
    </script>
  )
}

export function OrganizationStructuredData() {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "BrokerAnalysis",
        "url": "https://brokeranalysis.com",
        "logo": "https://brokeranalysis.com/favicon.svg",
        "description": "Leading independent broker comparison platform with AI-powered analysis and 2.5M+ verified reviews",
        "foundingDate": "2009",
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+1-800-BROKERS",
          "contactType": "customer service",
          "availableLanguage": ["English", "Spanish", "French", "German"]
        },
        "sameAs": [
          "https://twitter.com/brokeranalysis",
          "https://facebook.com/brokeranalysis",
          "https://linkedin.com/company/brokeranalysis"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "2500000",
          "bestRating": "5",
          "worstRating": "1"
        }
      })}
    </script>
  )
}

export function FAQStructuredData() {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does BrokerAnalysis compare brokers?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "We use a comprehensive 10-point evaluation system analyzing trading costs, platform quality, execution speed, regulatory compliance, and customer satisfaction based on 2.5M+ verified reviews."
            }
          },
          {
            "@type": "Question", 
            "name": "Are all brokers regulated?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes, we only feature brokers licensed by top-tier authorities including FCA (UK), CySEC (Cyprus), ASIC (Australia), SEC (USA), and other recognized regulators."
            }
          },
          {
            "@type": "Question",
            "name": "How accurate is the broker matching?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our AI matching algorithm has 96% accuracy, analyzing trading style, experience, instruments, risk tolerance, and location to find perfect broker matches."
            }
          },
          {
            "@type": "Question",
            "name": "What asset classes can I trade?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Our brokers offer forex (180+ brokers), stocks (95+ brokers), cryptocurrency (67+ brokers), CFDs (120+ brokers), commodities, indices, and ETFs."
            }
          }
        ]
      })}
    </script>
  )
}
