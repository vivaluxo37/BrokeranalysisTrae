import React from 'react'
import type { Broker } from '@/types/brokerTypes'

interface GenerativeSEOProps {
  broker: Broker
  variant?: 'standard' | 'detailed' | 'comparison'
}

/**
 * Generative SEO component that creates AI-friendly content structure
 * Includes FAQ sections, key takeaways, and semantic headings for LLM parsing
 */
export function GenerativeSEO({ broker, variant = 'standard' }: GenerativeSEOProps) {
  const brokerName = broker.name || 'Unknown Broker'
  const rating = broker.rating || 0
  const minDeposit = broker.minDeposit || 0
  const regulation = broker.regulation || []
  const assetClasses = broker.assetClasses || []
  const platforms = broker.platforms || []
  const spreadsFrom = broker.spreadsFrom || 0
  const maxLeverage = broker.maxLeverage || 0
  const yearEstablished = broker.yearEstablished || broker.details?.foundedYear
  const headquarters = broker.headquarters || broker.details?.headquarters
  const website = broker.website || broker.details?.website

  return (
    <div className="generative-seo-content">
      {/* Key Takeaways Section */}
      <section className="key-takeaways mb-8">
        <h2 className="text-2xl font-bold mb-4">Key Takeaways: {brokerName} Review</h2>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span><strong>Overall Rating:</strong> {rating > 0 ? `${rating.toFixed(1)}/5.0` : 'Not rated'} based on comprehensive analysis</span>
            </li>
            {regulation.length > 0 && (
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Regulation:</strong> Licensed by {regulation.join(', ')}</span>
              </li>
            )}
            {minDeposit > 0 && (
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Minimum Deposit:</strong> ${minDeposit.toLocaleString()}</span>
              </li>
            )}
            {assetClasses.length > 0 && (
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Trading Instruments:</strong> {assetClasses.join(', ')}</span>
              </li>
            )}
            {platforms.length > 0 && (
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Trading Platforms:</strong> {platforms.join(', ')}</span>
              </li>
            )}
            {spreadsFrom > 0 && (
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span><strong>Spreads From:</strong> {spreadsFrom} pips</span>
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Quick Summary Box */}
      <section className="quick-summary mb-8">
        <h2 className="text-2xl font-bold mb-4">{brokerName} Quick Summary</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Pros</h3>
            <ul className="text-green-700 space-y-1">
              {generatePros(broker).map((pro, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Cons</h3>
            <ul className="text-red-700 space-y-1">
              {generateCons(broker).map((con, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">✗</span>
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section mb-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions About {brokerName}</h2>
        <div className="space-y-4">
          {generateFAQs(broker).map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{faq.question}</h3>
              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Snippet */}
      {variant === 'comparison' && (
        <section className="comparison-snippet mb-8">
          <h2 className="text-2xl font-bold mb-4">How {brokerName} Compares</h2>
          <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{rating > 0 ? rating.toFixed(1) : 'N/A'}</div>
                <div className="text-sm text-gray-600">Overall Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {minDeposit > 0 ? `$${minDeposit.toLocaleString()}` : 'N/A'}
                </div>
                <div className="text-sm text-gray-600">Min Deposit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {regulation.length > 0 ? regulation.length : '0'}
                </div>
                <div className="text-sm text-gray-600">Regulators</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Bottom Line Summary */}
      <section className="bottom-line mb-8">
        <h2 className="text-2xl font-bold mb-4">The Bottom Line on {brokerName}</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            {generateBottomLineSummary(broker)}
          </p>
          {website && (
            <div className="mt-4">
              <a 
                href={website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Visit {brokerName} Website
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="internal-links mb-8">
        <h2 className="text-2xl font-bold mb-4">Related Broker Reviews</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generateRelatedLinks(broker).map((link, index) => (
            <a 
              key={index}
              href={link.url}
              className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-blue-600 mb-1">{link.title}</h3>
              <p className="text-sm text-gray-600">{link.description}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

/**
 * Generates pros based on broker data
 */
function generatePros(broker: Broker): string[] {
  const pros: string[] = []
  
  if (broker.regulation && broker.regulation.length > 0) {
    pros.push(`Regulated by ${broker.regulation.join(', ')}`)
  }
  
  if (broker.rating && broker.rating >= 4.0) {
    pros.push(`High user rating (${broker.rating.toFixed(1)}/5.0)`)
  }
  
  if (broker.assetClasses && broker.assetClasses.length >= 3) {
    pros.push(`Wide range of trading instruments (${broker.assetClasses.length} asset classes)`)
  }
  
  if (broker.platforms && broker.platforms.length > 1) {
    pros.push(`Multiple trading platforms available`)
  }
  
  if (broker.minDeposit && broker.minDeposit <= 100) {
    pros.push(`Low minimum deposit ($${broker.minDeposit})`)
  }
  
  if (broker.spreadsFrom && broker.spreadsFrom <= 1) {
    pros.push(`Competitive spreads from ${broker.spreadsFrom} pips`)
  }
  
  // Default pros if none generated
  if (pros.length === 0) {
    pros.push('Established trading platform', 'Customer support available', 'Online trading platform')
  }
  
  return pros.slice(0, 4) // Limit to 4 pros
}

/**
 * Generates cons based on broker data
 */
function generateCons(broker: Broker): string[] {
  const cons: string[] = []
  
  if (broker.minDeposit && broker.minDeposit > 1000) {
    cons.push(`High minimum deposit ($${broker.minDeposit.toLocaleString()})`)
  }
  
  if (broker.rating && broker.rating < 3.0) {
    cons.push(`Below average user rating (${broker.rating.toFixed(1)}/5.0)`)
  }
  
  if (!broker.regulation || broker.regulation.length === 0) {
    cons.push('Regulatory information not clearly specified')
  }
  
  if (broker.spreadsFrom && broker.spreadsFrom > 2) {
    cons.push(`Higher spreads starting from ${broker.spreadsFrom} pips`)
  }
  
  if (!broker.website && !broker.details?.website) {
    cons.push('Website information not available')
  }
  
  // Default cons if none generated
  if (cons.length === 0) {
    cons.push('Limited educational resources', 'No demo account mentioned', 'Customer support hours not specified')
  }
  
  return cons.slice(0, 4) // Limit to 4 cons
}

/**
 * Generates FAQ questions and answers
 */
function generateFAQs(broker: Broker): Array<{ question: string; answer: string }> {
  const brokerName = broker.name || 'this broker'
  const faqs = []
  
  // Is it regulated?
  faqs.push({
    question: `Is ${brokerName} regulated?`,
    answer: broker.regulation && broker.regulation.length > 0
      ? `Yes, ${brokerName} is regulated by ${broker.regulation.join(', ')}, which provides oversight and protection for traders.`
      : `Please contact ${brokerName} directly or check their website for current regulatory information and licensing details.`
  })
  
  // Minimum deposit
  faqs.push({
    question: `What is the minimum deposit for ${brokerName}?`,
    answer: broker.minDeposit && broker.minDeposit > 0
      ? `The minimum deposit required to open an account with ${brokerName} is $${broker.minDeposit.toLocaleString()}.`
      : `Please contact ${brokerName} or visit their website for current minimum deposit requirements.`
  })
  
  // Trading instruments
  faqs.push({
    question: `What can I trade with ${brokerName}?`,
    answer: broker.assetClasses && broker.assetClasses.length > 0
      ? `${brokerName} offers trading in ${broker.assetClasses.join(', ')}, providing diverse investment opportunities.`
      : `Please check ${brokerName}'s website for a complete list of available trading instruments and markets.`
  })
  
  // Trading platforms
  faqs.push({
    question: `What trading platforms does ${brokerName} offer?`,
    answer: broker.platforms && broker.platforms.length > 0
      ? `${brokerName} provides ${broker.platforms.join(', ')} trading platforms to suit different trading preferences and experience levels.`
      : `Please contact ${brokerName} for information about their available trading platforms and software options.`
  })
  
  // Account opening
  faqs.push({
    question: `How do I open an account with ${brokerName}?`,
    answer: broker.website || broker.details?.website
      ? `You can open an account with ${brokerName} by visiting their official website and following their account registration process. Make sure to have your identification documents ready.`
      : `Please contact ${brokerName} directly for information about their account opening process and required documentation.`
  })
  
  return faqs
}

/**
 * Generates bottom line summary
 */
function generateBottomLineSummary(broker: Broker): string {
  const brokerName = broker.name || 'this broker'
  const rating = broker.rating || 0
  const regulation = broker.regulation || []
  const minDeposit = broker.minDeposit || 0
  
  let summary = `${brokerName} `
  
  if (rating >= 4.0) {
    summary += 'is a highly-rated broker '
  } else if (rating >= 3.0) {
    summary += 'is a decent broker '
  } else {
    summary += 'is a broker '
  }
  
  if (regulation.length > 0) {
    summary += `with proper regulatory oversight from ${regulation.join(', ')}. `
  } else {
    summary += 'that requires further verification of regulatory status. '
  }
  
  if (minDeposit > 0) {
    if (minDeposit <= 100) {
      summary += `With a low minimum deposit of $${minDeposit.toLocaleString()}, it's accessible to most traders. `
    } else if (minDeposit <= 500) {
      summary += `With a moderate minimum deposit of $${minDeposit.toLocaleString()}, it targets serious traders. `
    } else {
      summary += `With a higher minimum deposit of $${minDeposit.toLocaleString()}, it's geared toward experienced traders. `
    }
  }
  
  summary += 'Always conduct your own research and consider your risk tolerance before choosing any broker.'
  
  return summary
}

/**
 * Generates related internal links
 */
function generateRelatedLinks(broker: Broker): Array<{ title: string; description: string; url: string }> {
  const links = [
    {
      title: 'Best Online Brokers 2024',
      description: 'Compare top-rated brokers and find the best platform for your trading needs.',
      url: '/best-brokers'
    },
    {
      title: 'Broker Comparison Tool',
      description: 'Side-by-side comparison of features, fees, and ratings.',
      url: '/compare'
    },
    {
      title: 'Trading Platform Reviews',
      description: 'In-depth reviews of popular trading platforms and software.',
      url: '/platforms'
    },
    {
      title: 'Forex Broker Guide',
      description: 'Complete guide to choosing the right forex broker.',
      url: '/forex-brokers'
    },
    {
      title: 'CFD Broker Reviews',
      description: 'Reviews and comparisons of CFD trading platforms.',
      url: '/cfd-brokers'
    },
    {
      title: 'Crypto Broker Guide',
      description: 'Find the best cryptocurrency trading platforms.',
      url: '/crypto-brokers'
    }
  ]
  
  return links.slice(0, 6)
}

export default GenerativeSEO