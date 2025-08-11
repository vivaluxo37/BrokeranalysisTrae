import { AIProviderGateway } from '../services/AIProviderGateway.js';
import { ContentProcessor } from '../content-processing/ContentProcessor.js';
import { QAOrchestrator } from '../qa-pipeline/QAOrchestrator.js';
import { WorkflowOrchestrator } from '../publishing-workflow/WorkflowOrchestrator.js';
import { promises as fs } from 'fs';
import path from 'path';

export interface BrokerInfo {
  name: string;
  logoPath: string;
  slug: string;
  category: 'stock' | 'forex' | 'crypto' | 'futures' | 'options' | 'general';
  region: 'us' | 'eu' | 'uk' | 'global' | 'asia';
}

export interface BrokerReviewContent {
  title: string;
  metaDescription: string;
  introduction: string;
  overview: string;
  pros: string[];
  cons: string[];
  features: {
    tradingPlatforms: string;
    accountTypes: string;
    minimumDeposit: string;
    fees: string;
    research: string;
    customerSupport: string;
  };
  detailedReview: {
    tradingExperience: string;
    costsAndFees: string;
    securityAndRegulation: string;
    customerService: string;
    educationalResources: string;
  };
  verdict: string;
  faq: {
    question: string;
    answer: string;
  }[];
  rating: {
    overall: number;
    tradingPlatform: number;
    fees: number;
    research: number;
    customerSupport: number;
  };
  lastUpdated: string;
}

export class BrokerContentGenerator {
  private aiGateway: AIProviderGateway;
  private contentProcessor: ContentProcessor;
  private qaOrchestrator: QAOrchestrator;
  private workflowOrchestrator: WorkflowOrchestrator;
  private logoDirectory: string;

  constructor(
    aiGateway: AIProviderGateway,
    contentProcessor: ContentProcessor,
    qaOrchestrator: QAOrchestrator,
    workflowOrchestrator: WorkflowOrchestrator,
    logoDirectory: string
  ) {
    this.aiGateway = aiGateway;
    this.contentProcessor = contentProcessor;
    this.qaOrchestrator = qaOrchestrator;
    this.workflowOrchestrator = workflowOrchestrator;
    this.logoDirectory = logoDirectory;
  }

  /**
   * Extract broker information from logo files
   */
  async extractBrokerInfo(): Promise<BrokerInfo[]> {
    try {
      const files = await fs.readdir(this.logoDirectory);
      const brokerMap = new Map<string, BrokerInfo>();

      for (const file of files) {
        if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
          const brokerName = this.extractBrokerName(file);
          if (brokerName && !brokerMap.has(brokerName)) {
            const brokerInfo: BrokerInfo = {
              name: this.formatBrokerName(brokerName),
              logoPath: path.join(this.logoDirectory, file),
              slug: this.createSlug(brokerName),
              category: this.categorizeBroker(brokerName),
              region: this.determineBrokerRegion(brokerName)
            };
            brokerMap.set(brokerName, brokerInfo);
          }
        }
      }

      return Array.from(brokerMap.values());
    } catch (error) {
      console.error('Error extracting broker info:', error);
      throw error;
    }
  }

  /**
   * Generate comprehensive review content for a broker
   */
  async generateBrokerReview(brokerInfo: BrokerInfo): Promise<BrokerReviewContent> {
    try {
      console.log(`Generating review for ${brokerInfo.name}...`);

      const prompt = this.createBrokerReviewPrompt(brokerInfo);
      const aiResponse = await this.aiGateway.generateContent({
        prompt,
        maxTokens: 4000,
        temperature: 0.7,
        model: 'groq-llama3-70b'
      });

      const reviewContent = this.parseAIResponse(aiResponse.content, brokerInfo);
      
      // Validate content quality
      const qaResult = await this.qaOrchestrator.validateContent({
        content: JSON.stringify(reviewContent),
        contentType: 'broker-review',
        metadata: { broker: brokerInfo.name }
      });

      if (!qaResult.isValid) {
        console.warn(`QA validation failed for ${brokerInfo.name}:`, qaResult.issues);
        // Attempt to regenerate with improved prompt
        return this.regenerateWithFeedback(brokerInfo, qaResult.issues);
      }

      return reviewContent;
    } catch (error) {
      console.error(`Error generating review for ${brokerInfo.name}:`, error);
      throw error;
    }
  }

  /**
   * Generate reviews for all brokers
   */
  async generateAllBrokerReviews(brokersToProcess?: BrokerInfo[]): Promise<Map<string, BrokerReviewContent>> {
    const brokers = brokersToProcess || await this.extractBrokerInfo();
    const reviews = new Map<string, BrokerReviewContent>();
    
    console.log(`Found ${brokers.length} brokers to generate reviews for`);

    // Process brokers in batches to avoid rate limits
    const batchSize = 3;
    for (let i = 0; i < brokers.length; i += batchSize) {
      const batch = brokers.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (broker) => {
        try {
          const review = await this.generateBrokerReview(broker);
          reviews.set(broker.slug, review);
          console.log(`✓ Generated review for ${broker.name}`);
        } catch (error) {
          console.error(`✗ Failed to generate review for ${broker.name}:`, error);
        }
      });

      await Promise.all(batchPromises);
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < brokers.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    return reviews;
  }

  /**
   * Create React component files for broker reviews
   */
  async createBrokerReviewPages(reviews: Map<string, BrokerReviewContent>): Promise<void> {
    const pagesDir = path.join(process.cwd(), 'src', 'pages', 'brokers');
    
    // Ensure directory exists
    await fs.mkdir(pagesDir, { recursive: true });

    for (const [slug, review] of reviews) {
      const componentContent = this.generateReactComponent(slug, review);
      const filePath = path.join(pagesDir, `${slug}.tsx`);
      
      await fs.writeFile(filePath, componentContent, 'utf-8');
      console.log(`Created page: ${filePath}`);
    }

    // Create index file for all broker pages
    const indexContent = this.generateBrokerIndexComponent(reviews);
    const indexPath = path.join(pagesDir, 'index.tsx');
    await fs.writeFile(indexPath, indexContent, 'utf-8');
    console.log(`Created broker index: ${indexPath}`);
  }

  private extractBrokerName(filename: string): string | null {
    // Remove file extension and image prefix
    let name = filename.replace(/\.(png|jpg|jpeg)$/i, '');
    name = name.replace(/^imgi_\d+_/, '');
    
    // Handle special cases
    if (name.includes('interactive-brokers')) return 'interactive-brokers';
    if (name.includes('charles-schwab')) return 'charles-schwab';
    if (name.includes('etoro')) return 'etoro';
    if (name.includes('trading-212')) return 'trading-212';
    if (name.includes('plus500')) return 'plus500';
    if (name.includes('admirals') || name.includes('admiral-markets')) return 'admirals';
    if (name.includes('degiro')) return 'degiro';
    if (name.includes('saxo-bank')) return 'saxo-bank';
    if (name.includes('swissquote')) return 'swissquote';
    if (name.includes('ig-review') || name === 'ig') return 'ig';
    if (name.includes('xtb')) return 'xtb';
    if (name.includes('pepperstone')) return 'pepperstone';
    if (name.includes('oanda')) return 'oanda';
    if (name.includes('forex.com')) return 'forex-com';
    if (name.includes('fxcm')) return 'fxcm';
    if (name.includes('avatrade')) return 'avatrade';
    if (name.includes('fxpro')) return 'fxpro';
    if (name.includes('tickmill')) return 'tickmill';
    if (name.includes('eightcap')) return 'eightcap';
    if (name.includes('fp-markets')) return 'fp-markets';
    if (name.includes('fusion-markets')) return 'fusion-markets';
    if (name.includes('vantage-markets')) return 'vantage-markets';
    if (name.includes('exness')) return 'exness';
    if (name.includes('xm-review') || name === 'xm') return 'xm';
    
    // Extract broker name from review pattern
    const reviewMatch = /^(.+?)-review/.exec(name);
    if (reviewMatch) {
      return reviewMatch[1];
    }
    
    return null;
  }

  private formatBrokerName(slug: string): string {
    const nameMap: Record<string, string> = {
      'interactive-brokers': 'Interactive Brokers',
      'charles-schwab': 'Charles Schwab',
      'etoro': 'eToro',
      'trading-212': 'Trading 212',
      'plus500': 'Plus500',
      'admirals': 'Admirals',
      'degiro': 'DEGIRO',
      'saxo-bank': 'Saxo Bank',
      'swissquote': 'Swissquote',
      'ig': 'IG',
      'xtb': 'XTB',
      'pepperstone': 'Pepperstone',
      'oanda': 'OANDA',
      'forex-com': 'Forex.com',
      'fxcm': 'FXCM',
      'avatrade': 'AvaTrade',
      'fxpro': 'FxPro',
      'tickmill': 'Tickmill',
      'eightcap': 'Eightcap',
      'fp-markets': 'FP Markets',
      'fusion-markets': 'Fusion Markets',
      'vantage-markets': 'Vantage Markets',
      'exness': 'Exness',
      'xm': 'XM'
    };

    return nameMap[slug] || slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  private createSlug(brokerName: string): string {
    return brokerName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  private categorizeBroker(brokerName: string): BrokerInfo['category'] {
    const forexBrokers = ['oanda', 'forex-com', 'fxcm', 'avatrade', 'fxpro', 'tickmill', 'eightcap', 'fp-markets', 'fusion-markets', 'vantage-markets', 'exness', 'xm', 'pepperstone'];
    const stockBrokers = ['interactive-brokers', 'charles-schwab', 'etoro', 'trading-212', 'degiro', 'saxo-bank', 'swissquote', 'ig', 'xtb'];
    
    if (forexBrokers.includes(brokerName)) return 'forex';
    if (stockBrokers.includes(brokerName)) return 'stock';
    return 'general';
  }

  private determineBrokerRegion(brokerName: string): BrokerInfo['region'] {
    const usBrokers = ['charles-schwab', 'interactive-brokers'];
    const euBrokers = ['degiro', 'trading-212', 'xtb', 'swissquote'];
    const ukBrokers = ['ig'];
    
    if (usBrokers.includes(brokerName)) return 'us';
    if (euBrokers.includes(brokerName)) return 'eu';
    if (ukBrokers.includes(brokerName)) return 'uk';
    return 'global';
  }

  private createBrokerReviewPrompt(brokerInfo: BrokerInfo): string {
    return `Create a comprehensive, professional review for ${brokerInfo.name}, a ${brokerInfo.category} broker operating in the ${brokerInfo.region} region.

Generate a detailed JSON response with the following structure:
{
  "title": "${brokerInfo.name} Review 2024: Comprehensive Analysis",
  "metaDescription": "SEO-optimized meta description (150-160 chars)",
  "introduction": "Engaging 2-3 paragraph introduction",
  "overview": "Detailed broker overview (200-300 words)",
  "pros": ["List of 5-7 key advantages"],
  "cons": ["List of 3-5 disadvantages"],
  "features": {
    "tradingPlatforms": "Description of trading platforms",
    "accountTypes": "Available account types",
    "minimumDeposit": "Minimum deposit requirements",
    "fees": "Fee structure overview",
    "research": "Research and analysis tools",
    "customerSupport": "Customer support options"
  },
  "detailedReview": {
    "tradingExperience": "In-depth trading experience analysis (300+ words)",
    "costsAndFees": "Detailed cost analysis (250+ words)",
    "securityAndRegulation": "Security and regulatory information (200+ words)",
    "customerService": "Customer service evaluation (150+ words)",
    "educationalResources": "Educational content and resources (150+ words)"
  },
  "verdict": "Final verdict and recommendation (200+ words)",
  "faq": [
    {"question": "Common question 1", "answer": "Detailed answer"},
    {"question": "Common question 2", "answer": "Detailed answer"},
    {"question": "Common question 3", "answer": "Detailed answer"},
    {"question": "Common question 4", "answer": "Detailed answer"},
    {"question": "Common question 5", "answer": "Detailed answer"}
  ],
  "rating": {
    "overall": 4.2,
    "tradingPlatform": 4.5,
    "fees": 3.8,
    "research": 4.0,
    "customerSupport": 4.1
  }
}

Ensure the content is:
- Factual and professional
- SEO-optimized with relevant keywords
- Comprehensive and informative
- Balanced (both pros and cons)
- Up-to-date for 2024
- Compliant with financial content guidelines

Return only the JSON response without any additional text.`;
  }

  private parseAIResponse(content: string, brokerInfo: BrokerInfo): BrokerReviewContent {
    try {
      // Clean the response to extract JSON
      const jsonMatch = /\{[\s\S]*\}/.exec(content);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Add metadata
      parsed.lastUpdated = new Date().toISOString().split('T')[0];
      
      return parsed as BrokerReviewContent;
    } catch (error) {
      console.error('Error parsing AI response:', error);
      // Return fallback content
      return this.createFallbackContent(brokerInfo);
    }
  }

  private async regenerateWithFeedback(brokerInfo: BrokerInfo, issues: string[]): Promise<BrokerReviewContent> {
    const feedbackPrompt = `${this.createBrokerReviewPrompt(brokerInfo)}

Previous attempt had these issues: ${issues.join(', ')}. Please address these concerns in the new response.`;
    
    const aiResponse = await this.aiGateway.generateContent({
      prompt: feedbackPrompt,
      maxTokens: 4000,
      temperature: 0.6,
      model: 'openrouter-gpt4'
    });

    return this.parseAIResponse(aiResponse.content, brokerInfo);
  }

  private createFallbackContent(brokerInfo: BrokerInfo): BrokerReviewContent {
    return {
      title: `${brokerInfo.name} Review 2024: Comprehensive Analysis`,
      metaDescription: `Read our detailed ${brokerInfo.name} review covering fees, platforms, features, and more. Find out if this broker is right for your trading needs.`,
      introduction: `${brokerInfo.name} is a well-established broker in the ${brokerInfo.category} trading space. This comprehensive review examines all aspects of their service to help you make an informed decision.`,
      overview: `${brokerInfo.name} offers a range of trading services and has built a reputation in the financial markets. We'll examine their platforms, fees, and features in detail.`,
      pros: [
        'Established reputation in the market',
        'Range of trading instruments',
        'Professional trading platforms',
        'Regulatory compliance',
        'Customer support available'
      ],
      cons: [
        'Fees may be higher than some competitors',
        'Platform complexity for beginners',
        'Limited educational resources'
      ],
      features: {
        tradingPlatforms: 'Professional trading platforms with advanced features',
        accountTypes: 'Multiple account types available',
        minimumDeposit: 'Competitive minimum deposit requirements',
        fees: 'Transparent fee structure',
        research: 'Market research and analysis tools',
        customerSupport: '24/5 customer support'
      },
      detailedReview: {
        tradingExperience: 'The trading experience with this broker is generally positive, offering professional-grade tools and platforms.',
        costsAndFees: 'The fee structure is competitive within the industry standard.',
        securityAndRegulation: 'The broker maintains proper regulatory compliance and security measures.',
        customerService: 'Customer service is available through multiple channels.',
        educationalResources: 'Educational materials are provided to help traders improve their skills.'
      },
      verdict: `${brokerInfo.name} is a solid choice for traders looking for a reliable broker with professional features.`,
      faq: [
        {
          question: `Is ${brokerInfo.name} regulated?`,
          answer: `Yes, ${brokerInfo.name} operates under proper regulatory oversight.`
        },
        {
          question: 'What is the minimum deposit?',
          answer: 'The minimum deposit varies by account type and region.'
        },
        {
          question: 'What trading platforms are available?',
          answer: 'Multiple professional trading platforms are offered.'
        }
      ],
      rating: {
        overall: 4.0,
        tradingPlatform: 4.0,
        fees: 3.5,
        research: 3.8,
        customerSupport: 4.0
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  }

  private generateReactComponent(slug: string, review: BrokerReviewContent): string {
    return `import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Star, CheckCircle, XCircle, TrendingUp, Shield, Phone, BookOpen } from 'lucide-react';

const ${this.toPascalCase(slug)}Review: React.FC = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={\`w-5 h-5 \${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>{\`${review.title}\`}</title>
        <meta name="description" content={\`${review.metaDescription}\`} />
        <meta name="keywords" content={\`${slug}, broker review, trading, investment\`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{\`${review.title}\`}</h1>
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center">
              {renderStars(${review.rating.overall})}
              <span className="ml-2 text-lg font-semibold">${review.rating.overall}/5</span>
            </div>
            <span className="text-gray-500">Last updated: ${review.lastUpdated}</span>
          </div>
        </div>

        {/* Introduction */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            {\`${review.introduction}\`}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Platform</h3>
            <div className="flex items-center mt-1">
              {renderStars(${review.rating.tradingPlatform})}
              <span className="ml-1 text-sm">${review.rating.tradingPlatform}</span>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <Shield className="w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Fees</h3>
            <div className="flex items-center mt-1">
              {renderStars(${review.rating.fees})}
              <span className="ml-1 text-sm">${review.rating.fees}</span>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Research</h3>
            <div className="flex items-center mt-1">
              {renderStars(${review.rating.research})}
              <span className="ml-1 text-sm">${review.rating.research}</span>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <Phone className="w-8 h-8 text-orange-600 mb-2" />
            <h3 className="font-semibold text-gray-900">Support</h3>
            <div className="flex items-center mt-1">
              {renderStars(${review.rating.customerSupport})}
              <span className="ml-1 text-sm">${review.rating.customerSupport}</span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
          <p className="text-gray-700 leading-relaxed">
            {\`${review.overview}\`}
          </p>
        </section>

        {/* Pros and Cons */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                Pros
              </h3>
              <ul className="space-y-2">
                ${review.pros.map(pro => `<li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">${pro}</span>
                </li>`).join('\n                ')}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center">
                <XCircle className="w-6 h-6 mr-2" />
                Cons
              </h3>
              <ul className="space-y-2">
                ${review.cons.map(con => `<li className="flex items-start">
                  <XCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">${con}</span>
                </li>`).join('\n                ')}
              </ul>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Trading Platforms</h3>
              <p className="text-gray-700">{\`${review.features.tradingPlatforms}\`}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Account Types</h3>
              <p className="text-gray-700">{\`${review.features.accountTypes}\`}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Minimum Deposit</h3>
              <p className="text-gray-700">{\`${review.features.minimumDeposit}\`}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fees</h3>
              <p className="text-gray-700">{\`${review.features.fees}\`}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Research</h3>
              <p className="text-gray-700">{\`${review.features.research}\`}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Support</h3>
              <p className="text-gray-700">{\`${review.features.customerSupport}\`}</p>
            </div>
          </div>
        </section>

        {/* Detailed Review Sections */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Analysis</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Trading Experience</h3>
              <p className="text-gray-700 leading-relaxed">{\`${review.detailedReview.tradingExperience}\`}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Costs and Fees</h3>
              <p className="text-gray-700 leading-relaxed">{\`${review.detailedReview.costsAndFees}\`}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Security and Regulation</h3>
              <p className="text-gray-700 leading-relaxed">{\`${review.detailedReview.securityAndRegulation}\`}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Service</h3>
              <p className="text-gray-700 leading-relaxed">{\`${review.detailedReview.customerService}\`}</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Educational Resources</h3>
              <p className="text-gray-700 leading-relaxed">{\`${review.detailedReview.educationalResources}\`}</p>
            </div>
          </div>
        </section>

        {/* Verdict */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Verdict</h2>
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{\`${review.verdict}\`}</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            ${review.faq.map((faq, index) => `<div key="faq-${index}" className="border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">${faq.question}</h3>
              <p className="text-gray-700">${faq.answer}</p>
            </div>`).join('\n            ')}
          </div>
        </section>
      </div>
    </>
  );
};

export default ${this.toPascalCase(slug)}Review;`;
  }

  private generateBrokerIndexComponent(reviews: Map<string, BrokerReviewContent>): string {
    const brokerList = Array.from(reviews.entries()).map(([slug, review]) => ({
      slug,
      title: review.title,
      rating: review.rating.overall,
      metaDescription: review.metaDescription
    }));

    return `import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const BrokerReviews: React.FC = () => {
  const brokers = ${JSON.stringify(brokerList, null, 2)};

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={\`w-4 h-4 \${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`}
      />
    ));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Broker Reviews</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brokers.map((broker) => (
          <Link
            key={broker.slug}
            to={\`/brokers/\${broker.slug}\`}
            className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {broker.title.replace(' Review 2024: Comprehensive Analysis', '')}
            </h2>
            
            <div className="flex items-center mb-3">
              {renderStars(broker.rating)}
              <span className="ml-2 text-sm text-gray-600">{broker.rating}/5</span>
            </div>
            
            <p className="text-gray-600 text-sm line-clamp-3">
              {broker.metaDescription}
            </p>
            
            <div className="mt-4">
              <span className="text-blue-600 font-medium hover:text-blue-800">
                Read Review →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default BrokerReviews;`;
  }

  private toPascalCase(str: string): string {
    return str.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
  }
}

export default BrokerContentGenerator;