import { promises as fs } from 'fs';
import path from 'path';

interface ComparisonPage {
  slug: string;
  title: string;
  description: string;
  category: string;
  criteria: string[];
  targetAudience: string;
}

const comparisonPages: ComparisonPage[] = [
  {
    slug: 'best-online-brokers',
    title: 'Best Online Brokers 2024',
    description: 'Compare the top online brokers for trading stocks, forex, and other financial instruments. Find the best broker for your trading needs.',
    category: 'general',
    criteria: ['Low fees', 'User-friendly platform', 'Regulatory compliance', 'Customer support'],
    targetAudience: 'All traders'
  },
  {
    slug: 'best-stock-brokers',
    title: 'Best Stock Brokers 2024',
    description: 'Discover the best stock brokers with low commissions, advanced trading tools, and comprehensive research capabilities.',
    category: 'stocks',
    criteria: ['Commission-free trades', 'Research tools', 'Mobile app', 'Market data'],
    targetAudience: 'Stock traders'
  },
  {
    slug: 'best-forex-brokers',
    title: 'Best Forex Brokers 2024',
    description: 'Find the top forex brokers with tight spreads, high leverage, and reliable execution for currency trading.',
    category: 'forex',
    criteria: ['Tight spreads', 'High leverage', 'Currency pairs', 'Trading platforms'],
    targetAudience: 'Forex traders'
  },
  {
    slug: 'best-cfd-brokers',
    title: 'Best CFD Brokers 2024',
    description: 'Compare the leading CFD brokers offering diverse markets, competitive spreads, and advanced trading features.',
    category: 'cfd',
    criteria: ['Market variety', 'Leverage options', 'Risk management', 'Platform features'],
    targetAudience: 'CFD traders'
  },
  {
    slug: 'best-crypto-brokers',
    title: 'Best Crypto Brokers 2024',
    description: 'Explore the top cryptocurrency brokers with secure trading, wide coin selection, and competitive fees.',
    category: 'crypto',
    criteria: ['Security features', 'Coin variety', 'Trading fees', 'Wallet integration'],
    targetAudience: 'Crypto traders'
  },
  {
    slug: 'best-day-trading-brokers',
    title: 'Best Day Trading Brokers 2024',
    description: 'Find the best brokers for day trading with fast execution, low costs, and professional trading tools.',
    category: 'day-trading',
    criteria: ['Fast execution', 'Low costs', 'Advanced charts', 'Real-time data'],
    targetAudience: 'Day traders'
  },
  {
    slug: 'best-swing-trading-brokers',
    title: 'Best Swing Trading Brokers 2024',
    description: 'Discover brokers ideal for swing trading with comprehensive analysis tools and flexible account options.',
    category: 'swing-trading',
    criteria: ['Analysis tools', 'Flexible accounts', 'Research reports', 'Mobile trading'],
    targetAudience: 'Swing traders'
  },
  {
    slug: 'best-beginner-brokers',
    title: 'Best Brokers for Beginners 2024',
    description: 'Start your trading journey with beginner-friendly brokers offering education, low minimums, and easy-to-use platforms.',
    category: 'beginner',
    criteria: ['Educational resources', 'Low minimum deposit', 'User-friendly interface', 'Demo accounts'],
    targetAudience: 'Beginner traders'
  },
  {
    slug: 'best-options-trading-brokers',
    title: 'Best Options Trading Brokers 2024',
    description: 'Compare top brokers for options trading with advanced strategies, competitive pricing, and professional tools.',
    category: 'options',
    criteria: ['Options strategies', 'Competitive pricing', 'Analysis tools', 'Risk management'],
    targetAudience: 'Options traders'
  },
  {
    slug: 'best-etf-brokers',
    title: 'Best ETF Brokers 2024',
    description: 'Find the best brokers for ETF investing with commission-free trades, wide selection, and research tools.',
    category: 'etf',
    criteria: ['Commission-free ETFs', 'ETF selection', 'Research tools', 'Portfolio tools'],
    targetAudience: 'ETF investors'
  }
];

function generateComparisonPageContent(page: ComparisonPage): string {
  const criteriaList = page.criteria.map(criterion => 
    `<li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />${criterion}</li>`
  ).join('');

  return `import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, CheckCircle, TrendingUp, Award, Filter, ArrowRight, ExternalLink } from 'lucide-react';

interface Broker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  minDeposit: number;
  spreadsFrom: number;
  maxLeverage: number;
  regulators: string[];
  keyFeatures: string[];
  website: string;
  pros: string[];
  cons: string[];
}

// Mock data - in real implementation, this would come from your broker database
const topBrokers: Broker[] = [
  {
    id: 'interactive-brokers',
    name: 'Interactive Brokers',
    logo: '/images/brokers/interactive-brokers-logo.png',
    rating: 4.5,
    reviewCount: 1250,
    minDeposit: 0,
    spreadsFrom: 0.1,
    maxLeverage: 100,
    regulators: ['SEC', 'FINRA', 'FCA'],
    keyFeatures: ['Low costs', 'Global markets', 'Professional tools'],
    website: 'https://www.interactivebrokers.com',
    pros: ['Extremely low costs', 'Wide market access', 'Advanced platform'],
    cons: ['Complex for beginners', 'Inactivity fees']
  },
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    logo: '/images/brokers/pepperstone-logo.png',
    rating: 4.3,
    reviewCount: 890,
    minDeposit: 200,
    spreadsFrom: 0.0,
    maxLeverage: 500,
    regulators: ['ASIC', 'FCA', 'CySEC'],
    keyFeatures: ['Tight spreads', 'Fast execution', 'MT4/MT5'],
    website: 'https://pepperstone.com',
    pros: ['Very tight spreads', 'Excellent execution', 'Good regulation'],
    cons: ['Limited educational content', 'No US clients']
  },
  {
    id: 'fp-markets',
    name: 'FP Markets',
    logo: '/images/brokers/fp-markets-logo.png',
    rating: 4.2,
    reviewCount: 675,
    minDeposit: 100,
    spreadsFrom: 0.0,
    maxLeverage: 500,
    regulators: ['ASIC', 'CySEC'],
    keyFeatures: ['Raw spreads', 'Multiple platforms', 'Good support'],
    website: 'https://www.fpmarkets.com',
    pros: ['Competitive spreads', 'Multiple platforms', 'Good customer service'],
    cons: ['Limited research', 'Withdrawal fees']
  }
];

const ${page.slug.replace(/-/g, '')}Page: React.FC = () => {
  const [sortBy, setSortBy] = useState<'rating' | 'minDeposit' | 'spreads'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={\`w-4 h-4 \${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`}
      />
    ));
  };

  const sortedBrokers = [...topBrokers].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'minDeposit':
        return a.minDeposit - b.minDeposit;
      case 'spreads':
        return a.spreadsFrom - b.spreadsFrom;
      default:
        return 0;
    }
  });

  return (
    <>
      <Helmet>
        <title>${page.title} - Compare Top Brokers | BrokerAnalysis</title>
        <meta name="description" content="${page.description}" />
        <meta name="keywords" content="${page.category} brokers, best ${page.category} brokers, ${page.targetAudience.toLowerCase()}, broker comparison" />
        <link rel="canonical" href={\`https://brokeranalysis.com/comparison/${page.slug}\`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "${page.title}",
            "description": "${page.description}",
            "url": \`https://brokeranalysis.com/comparison/${page.slug}\`,
            "mainEntity": {
              "@type": "ItemList",
              "name": "${page.title}",
              "description": "${page.description}",
              "numberOfItems": topBrokers.length,
              "itemListElement": topBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": \`\${broker.name} - Rating: \${broker.rating}/5\`,
                  "url": \`https://brokeranalysis.com/brokers/\${broker.id}\`
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                ${page.title}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
                ${page.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Target: ${page.targetAudience}</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">{topBrokers.length} Brokers Compared</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Criteria */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Selection Criteria</h2>
            <p className="text-gray-600 mb-4">
              We evaluate ${page.category} brokers based on the following key criteria to ensure you get the best trading experience:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              ${criteriaList}
            </ul>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Top ${page.title}</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="minDeposit">Sort by Min Deposit</option>
                  <option value="spreads">Sort by Spreads</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Broker Comparison Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="space-y-6">
            {sortedBrokers.map((broker, index) => (
              <div key={broker.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                    {/* Rank and Logo */}
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <img 
                          src={broker.logo} 
                          alt={\`\${broker.name} logo\`} 
                          className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                        />
                      </div>
                    </div>

                    {/* Broker Info */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{broker.name}</h3>
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center">
                              {renderStars(broker.rating)}
                              <span className="ml-2 font-semibold">{broker.rating}/5</span>
                              <span className="ml-2 text-gray-500">({broker.reviewCount} reviews)</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {broker.regulators.map(reg => (
                              <span key={reg} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                {reg}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <a 
                            href={broker.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Visit Broker
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">\${broker.minDeposit}</div>
                      <div className="text-sm text-gray-500">Min Deposit</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{broker.spreadsFrom} pips</div>
                      <div className="text-sm text-gray-500">Spreads From</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">1:{broker.maxLeverage}</div>
                      <div className="text-sm text-gray-500">Max Leverage</div>
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Pros</h4>
                      <ul className="space-y-1">
                        {broker.pros.map((pro, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Cons</h4>
                      <ul className="space-y-1">
                        {broker.cons.map((con, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <div className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0" style={{fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'}}>×</div>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                    <a 
                      href={\`/brokers/\${broker.id}\`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Read Full Review
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                    <a 
                      href={broker.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Open Account
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Choose from our top-rated ${page.category} brokers and start your trading journey today.
              </p>
              <a 
                href="/brokers" 
                className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Brokers
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ${page.slug.replace(/-/g, '')}Page;`;
}

export async function generateAllComparisonPages(): Promise<void> {
  try {
    console.log(`Generating ${comparisonPages.length} comparison pages...`);

    // Ensure the comparison directory exists
    const comparisonDir = path.join(process.cwd(), 'src', 'pages', 'comparison');
    await fs.mkdir(comparisonDir, { recursive: true });

    // Generate a page for each comparison type
    for (const page of comparisonPages) {
      try {
        const pageContent = generateComparisonPageContent(page);
        const fileName = `${page.slug}.tsx`;
        const filePath = path.join(comparisonDir, fileName);
        
        await fs.writeFile(filePath, pageContent, 'utf-8');
        console.log(`✓ Generated ${page.title} (${fileName})`);
      } catch (error) {
        console.error(`✗ Failed to generate ${page.title}:`, error);
      }
    }

    console.log(`\n🎉 Successfully generated ${comparisonPages.length} comparison pages!`);
  } catch (error) {
    console.error('❌ Error generating comparison pages:', error);
    throw error;
  }
}

// Run the script
generateAllComparisonPages().catch(console.error);