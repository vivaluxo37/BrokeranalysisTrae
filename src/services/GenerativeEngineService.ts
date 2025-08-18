/**
 * Generative Engine SEO Service
 * Creates AI-answer-ready content blocks for better LLM visibility
 */

import { Broker } from '../types/broker';

export interface SEOContentBlock {
  tldr: string;
  pros: string[];
  cons: string[];
  facts: {
    min_deposit: string;
    platform: string;
    fees_summary: string;
    base_currency: string;
    support_hours: string;
  };
  faqs: {
    question: string;
    answer: string;
  }[];
  editorial: string;
  internal_links: {
    anchor: string;
    target_slug: string;
  }[];
}

export interface StructuredDataSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export class GenerativeEngineService {
  /**
   * Generate AI-answer-ready content blocks for a broker
   */
  static generateBrokerSEOContent(broker: any): SEOContentBlock {
    return {
      tldr: this.generateTLDR(broker),
      pros: this.generatePros(broker),
      cons: this.generateCons(broker),
      facts: this.generateKeyFacts(broker),
      faqs: this.generateFAQs(broker),
      editorial: this.generateEditorial(broker),
      internal_links: this.generateInternalLinks(broker)
    };
  }

  /**
   * Generate TL;DR (2 sentences)
   */
  private static generateTLDR(broker: any): string {
    const regulationText = broker.isRegulated ? 
      `regulated by ${broker.regulators?.join(', ').toUpperCase() || 'top-tier authorities'}` : 
      'unregulated';
    
    const ratingText = broker.rating ? `${broker.rating}/5 stars` : 'unrated';
    
    return `${broker.name} is a ${regulationText} broker offering ${broker.assetClasses?.join(', ') || 'multiple asset classes'} trading with ${ratingText} from ${broker.reviewCount || 0} reviews. Minimum deposit starts at $${broker.minDeposit || 'N/A'} with spreads from ${broker.spreadsFrom || 0} pips on ${broker.platforms?.join(', ') || 'multiple platforms'}.`;
  }

  /**
   * Generate 5 Pros in plain language
   */
  private static generatePros(broker: any): string[] {
    const pros: string[] = [];
    
    // Regulation advantage
    if (broker.isRegulated) {
      pros.push(`Regulated by ${broker.regulators?.join(', ').toUpperCase() || 'recognized authorities'} for client protection`);
    }
    
    // Competitive spreads
    if (broker.spreadsFrom !== undefined && broker.spreadsFrom <= 1) {
      pros.push(`Competitive spreads starting from ${broker.spreadsFrom} pips`);
    }
    
    // Low minimum deposit
    if (broker.minDeposit && broker.minDeposit <= 100) {
      pros.push(`Low minimum deposit of only $${broker.minDeposit}`);
    }
    
    // High leverage
    if (broker.maxLeverage && broker.maxLeverage >= 100) {
      pros.push(`High leverage up to 1:${broker.maxLeverage} for experienced traders`);
    }
    
    // Platform variety
    if (broker.platforms && broker.platforms.length > 1) {
      pros.push(`Multiple trading platforms including ${broker.platforms.join(', ').toUpperCase()}`);
    }
    
    // Negative balance protection
    if (broker.details?.negativeBalanceProtection) {
      pros.push('Negative balance protection prevents account going below zero');
    }
    
    // Educational resources
    if (broker.features?.education?.webinars) {
      pros.push('Comprehensive educational resources and market analysis');
    }
    
    // Fast execution
    if (broker.details?.slippage === 'Minimal') {
      pros.push('Fast order execution with minimal slippage');
    }
    
    // Return top 5
    return pros.slice(0, 5);
  }

  /**
   * Generate 5 Cons in plain language
   */
  private static generateCons(broker: any): string[] {
    const cons: string[] = [];
    
    // High minimum deposit
    if (broker.minDeposit && broker.minDeposit > 1000) {
      cons.push(`High minimum deposit requirement of $${broker.minDeposit}`);
    }
    
    // Limited regulation
    if (!broker.isRegulated) {
      cons.push('Not regulated by major financial authorities');
    }
    
    // Wide spreads
    if (broker.spreadsFrom && broker.spreadsFrom > 2) {
      cons.push(`Spreads start from ${broker.spreadsFrom} pips, higher than competitors`);
    }
    
    // Limited platforms
    if (broker.platforms && broker.platforms.length === 1) {
      cons.push(`Limited to ${broker.platforms[0].toUpperCase()} platform only`);
    }
    
    // Inactivity fees
    if (broker.costs?.fees?.inactivity && broker.costs.fees.inactivity > 0) {
      cons.push(`Charges $${broker.costs.fees.inactivity} inactivity fee`);
    }
    
    // Limited asset classes
    if (broker.assetClasses && broker.assetClasses.length <= 2) {
      cons.push('Limited asset classes compared to full-service brokers');
    }
    
    // No trading signals
    if (broker.features?.research?.tradingSignals === false) {
      cons.push('No trading signals or copy trading features');
    }
    
    // Withdrawal fees
    if (broker.costs?.fees?.withdrawal && broker.costs.fees.withdrawal > 0) {
      cons.push(`Withdrawal fees of $${broker.costs.fees.withdrawal} apply`);
    }
    
    // Add generic cons if not enough specific ones
    if (cons.length < 3) {
      cons.push('Limited customer support hours in some regions');
      cons.push('Platform may require learning curve for beginners');
      cons.push('Some advanced features require higher account tiers');
    }
    
    return cons.slice(0, 5);
  }

  /**
   * Generate Key Facts table
   */
  private static generateKeyFacts(broker: any): SEOContentBlock['facts'] {
    return {
      min_deposit: broker.minDeposit ? `$${broker.minDeposit}` : 'Not specified',
      platform: broker.platforms?.join(', ').toUpperCase() || 'Multiple platforms',
      fees_summary: this.generateFeesSummary(broker),
      base_currency: broker.costs?.spreads?.currency || 'USD',
      support_hours: broker.details?.tradingHours || '24/5'
    };
  }

  /**
   * Generate fees summary
   */
  private static generateFeesSummary(broker: any): string {
    const parts: string[] = [];
    
    if (broker.spreadsFrom !== undefined) {
      parts.push(`Spreads from ${broker.spreadsFrom} pips`);
    }
    
    if (broker.costs?.commissions?.forex === 0) {
      parts.push('No forex commissions');
    } else if (broker.costs?.commissions?.forex) {
      parts.push(`$${broker.costs.commissions.forex} forex commission`);
    }
    
    if (broker.costs?.fees?.deposit === 0) {
      parts.push('Free deposits');
    }
    
    return parts.join(', ') || 'Variable fees apply';
  }

  /**
   * Generate 6 FAQs with concise answers
   */
  private static generateFAQs(broker: any): SEOContentBlock['faqs'] {
    const brokerName = broker.name;
    
    return [
      {
        question: `Is ${brokerName} regulated?`,
        answer: broker.isRegulated ? 
          `Yes, ${brokerName} is regulated by ${broker.regulators?.join(', ').toUpperCase() || 'recognized authorities'}.` :
          `${brokerName} operates without major regulatory oversight.`
      },
      {
        question: `What is the minimum deposit for ${brokerName}?`,
        answer: `The minimum deposit at ${brokerName} is $${broker.minDeposit || 'not specified'}.`
      },
      {
        question: `What trading platforms does ${brokerName} offer?`,
        answer: `${brokerName} provides ${broker.platforms?.join(', ').toUpperCase() || 'multiple trading platforms'} for desktop and mobile trading.`
      },
      {
        question: `What are ${brokerName}'s spreads?`,
        answer: `${brokerName} offers spreads starting from ${broker.spreadsFrom || 'variable'} pips on major currency pairs.`
      },
      {
        question: `Does ${brokerName} offer negative balance protection?`,
        answer: broker.details?.negativeBalanceProtection ? 
          `Yes, ${brokerName} provides negative balance protection for retail clients.` :
          `${brokerName} does not offer negative balance protection.`
      },
      {
        question: `What asset classes can I trade with ${brokerName}?`,
        answer: `${brokerName} offers trading in ${broker.assetClasses?.join(', ') || 'multiple asset classes'} including forex, CFDs, and more.`
      }
    ];
  }

  /**
   * Generate editorial summary (120-160 words)
   */
  private static generateEditorial(broker: any): string {
    const brokerName = broker.name;
    const established = broker.yearEstablished ? `established in ${broker.yearEstablished}` : 'established broker';
    const regulation = broker.isRegulated ? 
      `regulated by ${broker.regulators?.join(', ').toUpperCase()}` : 
      'operating without major regulation';
    
    return `${brokerName} is an ${established} ${regulation}, headquartered in ${broker.headquarters || 'multiple locations'}. The broker specializes in ${broker.assetClasses?.join(', ') || 'multi-asset'} trading through ${broker.platforms?.join(', ').toUpperCase() || 'professional platforms'} with spreads starting from ${broker.spreadsFrom || 'competitive'} pips. With a minimum deposit of $${broker.minDeposit || 'flexible amounts'}, ${brokerName} caters to ${broker.minDeposit && broker.minDeposit <= 100 ? 'beginner and experienced' : 'experienced'} traders. The broker maintains a ${broker.rating || 'competitive'}/5 rating based on ${broker.reviewCount || 'numerous'} client reviews. Key features include ${broker.maxLeverage ? `leverage up to 1:${broker.maxLeverage}` : 'flexible leverage'}, ${broker.details?.negativeBalanceProtection ? 'negative balance protection' : 'standard risk management'}, and ${broker.features?.education?.webinars ? 'comprehensive educational resources' : 'basic trading support'}. ${brokerName} operates under ${broker.details?.businessModel || 'professional'} execution model with ${broker.details?.clientFunds || 'segregated'} client fund protection.`;
  }

  /**
   * Generate 3 internal link suggestions for topic clustering
   */
  private static generateInternalLinks(broker: any): SEOContentBlock['internal_links'] {
    const brokerName = broker.name;
    const links: SEOContentBlock['internal_links'] = [];
    
    // Regulation-based clustering
    if (broker.regulators && broker.regulators.length > 0) {
      const regulator = broker.regulators[0].toUpperCase();
      links.push({
        anchor: `Best ${regulator}-regulated brokers`,
        target_slug: `/brokers/regulated/${regulator.toLowerCase()}`
      });
    }
    
    // Platform-based clustering
    if (broker.platforms && broker.platforms.length > 0) {
      const platform = broker.platforms[0].toUpperCase();
      links.push({
        anchor: `Top ${platform} brokers`,
        target_slug: `/brokers/platform/${platform.toLowerCase()}`
      });
    }
    
    // Asset class clustering
    if (broker.assetClasses && broker.assetClasses.length > 0) {
      const assetClass = broker.assetClasses[0];
      links.push({
        anchor: `Best ${assetClass} brokers`,
        target_slug: `/brokers/${assetClass}`
      });
    }
    
    // Add comparison link if we have enough data
    if (links.length < 3) {
      links.push({
        anchor: `${brokerName} vs competitors`,
        target_slug: `/compare/${broker.id}`
      });
    }
    
    return links.slice(0, 3);
  }

  /**
   * Generate Review structured data
   */
  static generateReviewStructuredData(broker: any): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      'itemReviewed': {
        '@type': 'FinancialService',
        'name': broker.name,
        'description': broker.description,
        'url': broker.website,
        'logo': broker.logo,
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': broker.headquarters
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
        'name': 'BrokerAnalysis',
        'url': 'https://brokeranalysis.com'
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
      'dateModified': new Date().toISOString()
    };
  }

  /**
   * Generate AggregateRating structured data
   */
  static generateAggregateRatingStructuredData(broker: any): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'AggregateRating',
      'itemReviewed': {
        '@type': 'FinancialService',
        'name': broker.name
      },
      'ratingValue': broker.rating || 0,
      'reviewCount': broker.reviewCount || 0,
      'bestRating': 5,
      'worstRating': 1
    };
  }

  /**
   * Generate FAQPage structured data
   */
  static generateFAQStructuredData(faqs: SEOContentBlock['faqs']): StructuredDataSchema {
    return {
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
  }

  /**
   * Generate entity-rich content with explicit mentions
   */
  static generateEntityRichContent(broker: any): string {
    const entities: string[] = [];
    
    // Add regulatory entities
    if (broker.regulators) {
      broker.regulators.forEach((reg: string) => {
        switch (reg.toLowerCase()) {
          case 'fca':
            entities.push('Financial Conduct Authority (FCA)');
            break;
          case 'cysec':
            entities.push('Cyprus Securities and Exchange Commission (CySEC)');
            break;
          case 'asic':
            entities.push('Australian Securities and Investments Commission (ASIC)');
            break;
          default:
            entities.push(reg.toUpperCase());
        }
      });
    }
    
    // Add platform entities
    if (broker.platforms) {
      broker.platforms.forEach((platform: string) => {
        switch (platform.toLowerCase()) {
          case 'mt4':
            entities.push('MetaTrader 4 (MT4)');
            break;
          case 'mt5':
            entities.push('MetaTrader 5 (MT5)');
            break;
          default:
            entities.push(platform);
        }
      });
    }
    
    // Add asset class entities
    if (broker.assetClasses) {
      broker.assetClasses.forEach((asset: string) => {
        switch (asset.toLowerCase()) {
          case 'cfd':
            entities.push('Contracts for Difference (CFDs)');
            break;
          case 'forex':
            entities.push('Foreign Exchange (Forex)');
            break;
          default:
            entities.push(asset);
        }
      });
    }
    
    return entities.join(', ');
  }
}