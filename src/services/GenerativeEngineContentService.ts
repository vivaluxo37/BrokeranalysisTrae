/**
 * Generative Engine Content Service
 * Generates AI-answer-ready content blocks for brokers
 * Optimized for LLM consumption and machine quotability
 */

import { Broker } from '../types/broker';

export interface GenerativeEngineContent {
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
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  editorial: string;
  internal_links: Array<{
    anchor: string;
    target_slug: string;
  }>;
}

export class GenerativeEngineContentService {
  /**
   * Generate complete AI-answer-ready content for a broker
   */
  static generateContent(broker: any): GenerativeEngineContent {
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
    const regulationStatus = broker.isRegulated ? 
      `regulated by ${broker.regulators?.join(', ') || 'financial authorities'}` : 
      'unregulated';
    
    const platformInfo = broker.platforms?.includes('mt5') ? 'MetaTrader 5' :
      broker.platforms?.includes('mt4') ? 'MetaTrader 4' :
      broker.platforms?.[0] || 'proprietary platform';
    
    const sentence1 = `${broker.name} is a ${regulationStatus} broker offering ${broker.assetClasses?.join(', ') || 'forex and CFD'} trading on ${platformInfo} with a minimum deposit of $${broker.minDeposit || 0}.`;
    
    const sentence2 = `The broker has earned ${broker.rating || 0}/5 stars from ${broker.reviewCount || 0} reviews, with spreads starting from ${broker.spreadsFrom || 0} pips and maximum leverage up to ${broker.maxLeverage || '1:1'}.`;
    
    return `${sentence1} ${sentence2}`;
  }

  /**
   * Generate 5 Pros in plain language
   */
  private static generatePros(broker: any): string[] {
    const pros: string[] = [];
    
    // Regulation advantage
    if (broker.isRegulated && broker.regulators?.length > 0) {
      const regulators = broker.regulators.map((reg: string) => reg.toUpperCase()).join(', ');
      pros.push(`Regulated by ${regulators} providing client fund protection`);
    }
    
    // Platform advantages
    if (broker.platforms?.includes('mt5')) {
      pros.push('MetaTrader 5 platform with advanced charting and automated trading');
    } else if (broker.platforms?.includes('mt4')) {
      pros.push('MetaTrader 4 platform with expert advisors and custom indicators');
    }
    
    // Low costs
    if (broker.spreadsFrom && parseFloat(broker.spreadsFrom) < 1) {
      pros.push(`Competitive spreads starting from ${broker.spreadsFrom} pips`);
    }
    
    // Low minimum deposit
    if (broker.minDeposit && broker.minDeposit <= 100) {
      pros.push(`Low minimum deposit of $${broker.minDeposit} for new traders`);
    }
    
    // High leverage
    if (broker.maxLeverage && broker.maxLeverage.includes('500')) {
      pros.push('High leverage up to 1:500 for experienced traders');
    }
    
    // Asset variety
    if (broker.assetClasses && broker.assetClasses.length >= 3) {
      pros.push(`Diverse trading options including ${broker.assetClasses.join(', ')}`);
    }
    
    // Trust score
    if (broker.trustScore && broker.trustScore >= 8) {
      pros.push(`High trust score of ${broker.trustScore}/10 based on regulatory compliance`);
    }
    
    // Experience
    if (broker.yearEstablished && (new Date().getFullYear() - broker.yearEstablished) >= 10) {
      const years = new Date().getFullYear() - broker.yearEstablished;
      pros.push(`Established broker with ${years}+ years of market experience`);
    }
    
    // Fill remaining slots with generic pros if needed
    while (pros.length < 5) {
      const genericPros = [
        'User-friendly trading interface and mobile app',
        '24/5 customer support during market hours',
        'Educational resources and market analysis',
        'Multiple deposit and withdrawal methods',
        'Demo account available for practice trading'
      ];
      
      for (const genericPro of genericPros) {
        if (pros.length < 5 && !pros.includes(genericPro)) {
          pros.push(genericPro);
        }
      }
      break;
    }
    
    return pros.slice(0, 5);
  }

  /**
   * Generate 5 Cons in plain language
   */
  private static generateCons(broker: any): string[] {
    const cons: string[] = [];
    
    // Regulation concerns
    if (!broker.isRegulated) {
      cons.push('Not regulated by major financial authorities like FCA or CySEC');
    }
    
    // High minimum deposit
    if (broker.minDeposit && broker.minDeposit > 1000) {
      cons.push(`High minimum deposit of $${broker.minDeposit} may deter beginners`);
    }
    
    // Wide spreads
    if (broker.spreadsFrom && parseFloat(broker.spreadsFrom) > 2) {
      cons.push(`Spreads starting from ${broker.spreadsFrom} pips are above market average`);
    }
    
    // Limited platforms
    if (broker.platforms && broker.platforms.length === 1 && !broker.platforms.includes('mt4') && !broker.platforms.includes('mt5')) {
      cons.push('Limited to proprietary platform without MetaTrader options');
    }
    
    // Low leverage
    if (broker.maxLeverage && (broker.maxLeverage.includes('30') || broker.maxLeverage.includes('50'))) {
      cons.push('Lower leverage limits may restrict advanced trading strategies');
    }
    
    // Limited assets
    if (broker.assetClasses && broker.assetClasses.length < 3) {
      cons.push('Limited asset classes compared to full-service brokers');
    }
    
    // Low trust score
    if (broker.trustScore && broker.trustScore < 6) {
      cons.push(`Lower trust score of ${broker.trustScore}/10 raises reliability concerns`);
    }
    
    // New broker
    if (broker.yearEstablished && (new Date().getFullYear() - broker.yearEstablished) < 5) {
      cons.push('Relatively new broker with limited track record');
    }
    
    // Fill remaining slots with generic cons if needed
    while (cons.length < 5) {
      const genericCons = [
        'No guaranteed stop-loss protection during high volatility',
        'Withdrawal fees may apply depending on payment method',
        'Limited educational content for beginner traders',
        'Customer support not available 24/7 on weekends',
        'Some advanced features require higher account tiers'
      ];
      
      for (const genericCon of genericCons) {
        if (cons.length < 5 && !cons.includes(genericCon)) {
          cons.push(genericCon);
        }
      }
      break;
    }
    
    return cons.slice(0, 5);
  }

  /**
   * Generate Key Facts table
   */
  private static generateKeyFacts(broker: any): GenerativeEngineContent['facts'] {
    // Extract fee information
    const feesSummary = this.generateFeesSummary(broker);
    
    // Determine base currency
    const baseCurrency = broker.details?.baseCurrency || 
      (broker.headquarters?.includes('UK') ? 'GBP' : 
       broker.headquarters?.includes('US') ? 'USD' : 
       broker.headquarters?.includes('EU') ? 'EUR' : 'USD');
    
    // Generate support hours
    const supportHours = broker.details?.supportHours || '24/5 (Mon-Fri)';
    
    return {
      min_deposit: `$${broker.minDeposit || 0}`,
      platform: broker.platforms?.includes('mt5') ? 'MetaTrader 5' :
        broker.platforms?.includes('mt4') ? 'MetaTrader 4' :
        broker.platforms?.[0] || 'Proprietary',
      fees_summary: feesSummary,
      base_currency: baseCurrency,
      support_hours: supportHours
    };
  }

  /**
   * Generate fees summary
   */
  private static generateFeesSummary(broker: any): string {
    const fees: string[] = [];
    
    if (broker.spreadsFrom) {
      fees.push(`Spreads from ${broker.spreadsFrom} pips`);
    }
    
    if (broker.costs?.commissions) {
      fees.push(`Commission: ${broker.costs.commissions}`);
    } else {
      fees.push('No commission');
    }
    
    if (broker.costs?.fees?.withdrawal) {
      fees.push(`Withdrawal: ${broker.costs.fees.withdrawal}`);
    }
    
    return fees.length > 0 ? fees.join(', ') : 'Variable fees apply';
  }

  /**
   * Generate 6 FAQs with concise answers
   */
  private static generateFAQs(broker: any): Array<{ question: string; answer: string }> {
    const brokerName = broker.name;
    const regulationText = broker.isRegulated ? 
      `Yes, regulated by ${broker.regulators?.join(', ') || 'financial authorities'}.` :
      'No, this broker is not regulated by major financial authorities.';
    
    return [
      {
        question: `Is ${brokerName} regulated?`,
        answer: regulationText
      },
      {
        question: `What is the minimum deposit for ${brokerName}?`,
        answer: `The minimum deposit is $${broker.minDeposit || 0}.`
      },
      {
        question: `What trading platforms does ${brokerName} offer?`,
        answer: `${brokerName} offers ${broker.platforms?.join(', ') || 'proprietary platform'} for trading.`
      },
      {
        question: `What are ${brokerName}'s spreads?`,
        answer: `Spreads start from ${broker.spreadsFrom || 'variable'} pips depending on the account type and market conditions.`
      },
      {
        question: `What leverage does ${brokerName} provide?`,
        answer: `Maximum leverage is ${broker.maxLeverage || '1:1'}, subject to regulatory restrictions in your jurisdiction.`
      },
      {
        question: `What assets can I trade with ${brokerName}?`,
        answer: `You can trade ${broker.assetClasses?.join(', ') || 'forex and CFDs'} with this broker.`
      }
    ];
  }

  /**
   * Generate Editorial summary (120-160 words, neutral)
   */
  private static generateEditorial(broker: any): string {
    const brokerName = broker.name;
    const established = broker.yearEstablished ? `established in ${broker.yearEstablished}` : 'a trading platform';
    const regulation = broker.isRegulated ? 
      `regulated by ${broker.regulators?.join(' and ') || 'financial authorities'}` :
      'operating without major regulatory oversight';
    
    const platforms = broker.platforms?.includes('mt5') ? 'MetaTrader 5' :
      broker.platforms?.includes('mt4') ? 'MetaTrader 4' :
      'proprietary trading platform';
    
    const assets = broker.assetClasses?.join(', ') || 'forex and CFD instruments';
    const rating = broker.rating ? `${broker.rating}/5 stars` : 'user ratings';
    const reviews = broker.reviewCount || 0;
    
    const costStructure = broker.spreadsFrom ? 
      `with spreads starting from ${broker.spreadsFrom} pips` :
      'with competitive pricing';
    
    const leverage = broker.maxLeverage ? 
      `offering leverage up to ${broker.maxLeverage}` :
      'providing standard leverage options';
    
    const minDeposit = broker.minDeposit ? 
      `The minimum deposit requirement is $${broker.minDeposit}` :
      'Deposit requirements vary by account type';
    
    const trustScore = broker.trustScore ? 
      `The broker maintains a trust score of ${broker.trustScore}/10` :
      'Trust metrics are based on regulatory compliance and user feedback';
    
    return `${brokerName} is ${established}, ${regulation}. The broker provides access to ${assets} through ${platforms}, ${costStructure} and ${leverage}. Based on ${reviews} user reviews, the platform has earned ${rating}. ${minDeposit}, making it accessible to various trader profiles. ${trustScore}. Traders should consider their individual needs, risk tolerance, and regulatory preferences when evaluating this broker against alternatives in the market.`;
  }

  /**
   * Generate 3 internal link suggestions for topic clustering
   */
  private static generateInternalLinks(broker: any): Array<{ anchor: string; target_slug: string }> {
    const links: Array<{ anchor: string; target_slug: string }> = [];
    
    // Regulation-based link
    if (broker.isRegulated && broker.regulators?.includes('FCA')) {
      links.push({
        anchor: 'Best FCA-regulated brokers',
        target_slug: '/brokers/fca-regulated'
      });
    } else if (broker.isRegulated && broker.regulators?.includes('CySEC')) {
      links.push({
        anchor: 'Top CySEC-licensed brokers',
        target_slug: '/brokers/cysec-regulated'
      });
    } else {
      links.push({
        anchor: 'Regulated vs unregulated brokers',
        target_slug: '/guides/regulated-brokers'
      });
    }
    
    // Platform-based link
    if (broker.platforms?.includes('mt5')) {
      links.push({
        anchor: 'Best MetaTrader 5 brokers',
        target_slug: '/brokers/metatrader-5'
      });
    } else if (broker.platforms?.includes('mt4')) {
      links.push({
        anchor: 'Top MetaTrader 4 brokers',
        target_slug: '/brokers/metatrader-4'
      });
    } else {
      links.push({
        anchor: 'Trading platform comparison',
        target_slug: '/guides/trading-platforms'
      });
    }
    
    // Asset class or comparison link
    if (broker.assetClasses?.includes('forex')) {
      links.push({
        anchor: 'Best forex brokers 2024',
        target_slug: '/brokers/forex'
      });
    } else if (broker.assetClasses?.includes('stocks')) {
      links.push({
        anchor: 'Top stock trading brokers',
        target_slug: '/brokers/stocks'
      });
    } else {
      // Generate comparison link with a popular broker
      const popularBrokers = ['IG', 'Plus500', 'eToro', 'XM', 'FXCM'];
      const comparisonBroker = popularBrokers.find(b => b !== broker.name) || 'IG';
      const slug1 = broker.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const slug2 = comparisonBroker.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      links.push({
        anchor: `${broker.name} vs ${comparisonBroker}`,
        target_slug: `/compare/${slug1}-vs-${slug2}`
      });
    }
    
    return links;
  }

  /**
   * Generate content for specific broker by ID
   */
  static async generateContentForBroker(brokerId: string): Promise<GenerativeEngineContent | null> {
    try {
      // This would typically fetch from your broker service
      // For now, we'll return a placeholder
      const broker = await this.fetchBrokerData(brokerId);
      if (!broker) return null;
      
      return this.generateContent(broker);
    } catch (error) {
      console.error('Error generating content for broker:', error);
      return null;
    }
  }

  /**
   * Placeholder for broker data fetching
   */
  private static async fetchBrokerData(brokerId: string): Promise<any> {
    // This would integrate with your existing broker service
    // Return null for now as this is a placeholder
    return null;
  }

  /**
   * Validate generated content meets requirements
   */
  static validateContent(content: GenerativeEngineContent): boolean {
    // Check TL;DR is approximately 2 sentences
    const sentences = content.tldr.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length < 2 || sentences.length > 3) return false;
    
    // Check pros and cons have exactly 5 items each
    if (content.pros.length !== 5 || content.cons.length !== 5) return false;
    
    // Check FAQs have exactly 6 items
    if (content.faqs.length !== 6) return false;
    
    // Check editorial is between 120-160 words
    const wordCount = content.editorial.split(/\s+/).length;
    if (wordCount < 120 || wordCount > 160) return false;
    
    // Check internal links have exactly 3 items
    if (content.internal_links.length !== 3) return false;
    
    return true;
  }
}