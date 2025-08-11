import fs from 'fs';
import path from 'path';

interface BrokerData {
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

// Extract broker names from the brokers directory
function getAllBrokerNames(): string[] {
  const brokersDir = path.join(process.cwd(), 'src', 'pages', 'brokers');
  const files = fs.readdirSync(brokersDir);
  
  return files
    .filter(file => file.endsWith('.tsx') && file !== 'index.tsx')
    .map(file => file.replace('.tsx', ''))
    .sort();
}

// Generate mock broker data for comparison pages
function generateBrokerData(brokerIds: string[]): BrokerData[] {
  const regulatorOptions = [
    ['SEC', 'FINRA', 'FCA'],
    ['ASIC', 'FCA', 'CySEC'],
    ['CySEC', 'FCA'],
    ['ASIC', 'CySEC'],
    ['FCA', 'PRA'],
    ['SEC', 'FINRA'],
    ['CFTC', 'NFA'],
    ['BaFin', 'CySEC'],
    ['CONSOB', 'CySEC'],
    ['CNMV', 'CySEC']
  ];

  const keyFeaturesOptions = [
    ['Low costs', 'Global markets', 'Professional tools'],
    ['Tight spreads', 'Fast execution', 'MT4/MT5'],
    ['Raw spreads', 'Multiple platforms', 'Good support'],
    ['Social trading', 'Copy trading', 'Wide asset range'],
    ['Commission-free stocks', 'Fractional shares', 'Mobile app'],
    ['Advanced charting', 'Research tools', 'Educational content'],
    ['Automated trading', 'API access', 'Institutional grade'],
    ['Multi-asset platform', 'Risk management', 'Portfolio tools'],
    ['Crypto trading', 'DeFi integration', 'Staking rewards'],
    ['Options trading', 'Futures', 'Complex strategies']
  ];

  const prosOptions = [
    ['Extremely low costs', 'Wide market access', 'Advanced platform'],
    ['Very tight spreads', 'Excellent execution', 'Good regulation'],
    ['Competitive spreads', 'Multiple platforms', 'Good customer service'],
    ['User-friendly interface', 'Social features', 'Wide asset selection'],
    ['Zero commissions', 'Easy to use', 'Great mobile app'],
    ['Comprehensive research', 'Educational resources', 'Professional tools'],
    ['Reliable platform', 'Good execution', 'Strong regulation'],
    ['Innovative features', 'Good pricing', 'Responsive support']
  ];

  const consOptions = [
    ['Complex for beginners', 'Inactivity fees'],
    ['Limited educational content', 'No US clients'],
    ['Limited research', 'Withdrawal fees'],
    ['Higher spreads on some assets', 'Limited regulation'],
    ['Limited advanced tools', 'No phone support'],
    ['Higher fees', 'Complex fee structure'],
    ['Limited asset selection', 'Higher minimum deposit'],
    ['Platform can be slow', 'Limited customer support']
  ];

  return brokerIds.map((brokerId, index) => {
    const name = brokerId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: brokerId,
      name,
      logo: `/images/brokers/${brokerId}-logo.png`,
      rating: Math.round((3.8 + Math.random() * 1.4) * 10) / 10, // 3.8-5.2 range
      reviewCount: Math.floor(200 + Math.random() * 1500),
      minDeposit: [0, 1, 10, 50, 100, 200, 250, 500, 1000][Math.floor(Math.random() * 9)],
      spreadsFrom: Math.round(Math.random() * 2 * 10) / 10, // 0.0-2.0
      maxLeverage: [30, 50, 100, 200, 400, 500][Math.floor(Math.random() * 6)],
      regulators: regulatorOptions[index % regulatorOptions.length],
      keyFeatures: keyFeaturesOptions[index % keyFeaturesOptions.length],
      website: `https://${brokerId.replace(/-/g, '')}.com`,
      pros: prosOptions[index % prosOptions.length],
      cons: consOptions[index % consOptions.length]
    };
  });
}

// Comparison page configurations
const comparisonPages = [
  {
    filename: 'best-online-brokers.tsx',
    title: 'Best Online Brokers 2025',
    description: 'Compare the top online brokers for trading stocks, forex, and other financial instruments. Find the best broker for your trading needs in 2025.',
    keywords: 'best online brokers 2025, top brokers, broker comparison, trading platforms',
    target: 'All traders',
    criteria: ['Low fees', 'User-friendly platform', 'Regulatory compliance', 'Customer support']
  },
  {
    filename: 'best-forex-brokers.tsx',
    title: 'Best Forex Brokers 2025',
    description: 'Discover the top forex brokers for currency trading in 2025. Compare spreads, leverage, and trading platforms.',
    keywords: 'best forex brokers 2025, forex trading, currency trading, FX brokers',
    target: 'Forex traders',
    criteria: ['Tight spreads', 'High leverage', 'Fast execution', 'Currency pairs']
  },
  {
    filename: 'best-stock-brokers.tsx',
    title: 'Best Stock Brokers 2025',
    description: 'Find the best stock brokers for equity trading in 2025. Compare commissions, research tools, and trading platforms.',
    keywords: 'best stock brokers 2025, stock trading, equity brokers, share trading',
    target: 'Stock traders',
    criteria: ['Low commissions', 'Research tools', 'Market access', 'Order types']
  },
  {
    filename: 'best-cfd-brokers.tsx',
    title: 'Best CFD Brokers 2025',
    description: 'Compare the top CFD brokers for contract for difference trading in 2025. Find brokers with tight spreads and good regulation.',
    keywords: 'best CFD brokers 2025, CFD trading, contract for difference, leveraged trading',
    target: 'CFD traders',
    criteria: ['Tight spreads', 'Leverage options', 'Asset variety', 'Regulation']
  },
  {
    filename: 'best-crypto-brokers.tsx',
    title: 'Best Crypto Brokers 2025',
    description: 'Discover the best cryptocurrency brokers for digital asset trading in 2025. Compare fees, security, and available coins.',
    keywords: 'best crypto brokers 2025, cryptocurrency trading, bitcoin brokers, digital assets',
    target: 'Crypto traders',
    criteria: ['Security features', 'Crypto variety', 'Low fees', 'Wallet integration']
  },
  {
    filename: 'best-day-trading-brokers.tsx',
    title: 'Best Day Trading Brokers 2025',
    description: 'Find the best brokers for day trading in 2025. Compare execution speed, tools, and commission structures.',
    keywords: 'best day trading brokers 2025, day trading platforms, active trading, scalping',
    target: 'Day traders',
    criteria: ['Fast execution', 'Advanced tools', 'Low commissions', 'Real-time data']
  },
  {
    filename: 'best-swing-trading-brokers.tsx',
    title: 'Best Swing Trading Brokers 2025',
    description: 'Compare the top brokers for swing trading in 2025. Find platforms with excellent research and analysis tools.',
    keywords: 'best swing trading brokers 2025, swing trading platforms, medium-term trading',
    target: 'Swing traders',
    criteria: ['Research tools', 'Technical analysis', 'Reasonable fees', 'Market insights']
  },
  {
    filename: 'best-beginner-brokers.tsx',
    title: 'Best Brokers for Beginners 2025',
    description: 'Discover the best brokers for beginner traders in 2025. Compare educational resources, ease of use, and support.',
    keywords: 'best brokers for beginners 2025, beginner trading, new traders, easy platforms',
    target: 'Beginner traders',
    criteria: ['Educational resources', 'Easy to use', 'Demo accounts', 'Customer support']
  },
  {
    filename: 'best-options-trading-brokers.tsx',
    title: 'Best Options Trading Brokers 2025',
    description: 'Find the best brokers for options trading in 2025. Compare tools, commissions, and strategy support.',
    keywords: 'best options brokers 2025, options trading, derivatives trading, options strategies',
    target: 'Options traders',
    criteria: ['Options tools', 'Strategy support', 'Low commissions', 'Risk management']
  },
  {
    filename: 'best-etf-brokers.tsx',
    title: 'Best ETF Brokers 2025',
    description: 'Compare the best brokers for ETF trading in 2025. Find platforms with commission-free ETFs and research tools.',
    keywords: 'best ETF brokers 2025, ETF trading, exchange traded funds, passive investing',
    target: 'ETF investors',
    criteria: ['Commission-free ETFs', 'ETF selection', 'Research tools', 'Portfolio tools']
  }
];

// Generate comparison page content
function generateComparisonPageContent(config: any, brokers: BrokerData[]): string {
  // Select top brokers for this comparison (limit to 15 for performance)
  const selectedBrokers = brokers.slice(0, 15);
  
  return `import React, { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
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

const topBrokers: Broker[] = ${JSON.stringify(selectedBrokers, null, 2)};

const ${config.filename.replace('.tsx', '').replace(/-/g, '')}Page: React.FC = () => {
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
        <title>${config.title} - Compare Top Brokers | BrokerAnalysis</title>
        <meta name="description" content="${config.description}" />
        <meta name="keywords" content="${config.keywords}" />
        <link rel="canonical" href={\`https://brokeranalysis.com/comparison/${config.filename.replace('.tsx', '')}\`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "${config.title}",
            "description": "${config.description}",
            "url": \`https://brokeranalysis.com/comparison/${config.filename.replace('.tsx', '')}\`,
            "mainEntity": {
              "@type": "ItemList",
              "name": "${config.title}",
              "description": "${config.description}",
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
                ${config.title}
              </h1>
              <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
                ${config.description}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Target: ${config.target}</span>
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
              We evaluate ${config.target.toLowerCase()} based on the following key criteria to ensure you get the best trading experience:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              ${config.criteria.map(criterion => `<li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />${criterion}</li>`).join('')}
            </ul>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Top ${config.title}</h2>
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
                          className="w-16 h-16 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/brokers/default-broker-logo.png';
                          }}
                        />
                      </div>
                    </div>

                    {/* Broker Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{broker.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex items-center">
                              {renderStars(broker.rating)}
                            </div>
                            <span className="text-sm text-gray-600">
                              {broker.rating} ({broker.reviewCount} reviews)
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {broker.regulators.map((regulator) => (
                              <span
                                key={regulator}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {regulator}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex flex-col sm:flex-row gap-4 text-sm">
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">\${broker.minDeposit}</div>
                            <div className="text-gray-500">Min Deposit</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{broker.spreadsFrom}%</div>
                            <div className="text-gray-500">Spreads From</div>
                          </div>
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{broker.maxLeverage}:1</div>
                            <div className="text-gray-500">Max Leverage</div>
                          </div>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                          {broker.keyFeatures.map((feature) => (
                            <span
                              key={feature}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Pros and Cons */}
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-700 mb-2">Pros</h4>
                          <ul className="space-y-1">
                            {broker.pros.map((pro, idx) => (
                              <li key={idx} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-red-700 mb-2">Cons</h4>
                          <ul className="space-y-1">
                            {broker.cons.map((con, idx) => (
                              <li key={idx} className="flex items-start">
                                <div className="w-4 h-4 border-2 border-red-500 rounded-full mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <a
                          href={\`/brokers/\${broker.id}\`}
                          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          Read Review
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                        <a
                          href={broker.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Visit Broker
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </div>
                    </div>
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
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Choose from our top-rated ${config.target.toLowerCase()} and start your trading journey today.
              </p>
              <a
                href="#top"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Compare Brokers
                <TrendingUp className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ${config.filename.replace('.tsx', '').replace(/-/g, '')}Page;`;
}

// Main function to update all comparison pages
async function updateAllComparisonPages() {
  try {
    console.log('Starting comparison pages update...');
    
    // Extract broker names from the brokers directory
    const brokersDir = path.join(process.cwd(), 'src', 'pages', 'brokers');
    console.log('Checking brokers directory:', brokersDir);
    
    const brokerFiles = fs.readdirSync(brokersDir).filter(file => file.endsWith('.tsx') && file !== 'index.tsx');
    console.log('Found broker files:', brokerFiles.length);
    
    const extractedBrokers = brokerFiles.map(file => {
      const brokerName = file.replace('.tsx', '').replace(/-/g, ' ');
      return {
        id: file.replace('.tsx', ''),
        name: brokerName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      };
    });
    
    console.log('Extracted brokers:', extractedBrokers.length);
   
    // Generate mock broker data for all brokers
     const allBrokers = generateBrokerData(extractedBrokers.map(b => b.id));
     console.log('Generated mock data for brokers:', allBrokers.length);

    // Update each comparison page
    for (const config of comparisonPages) {
      console.log(`Updating ${config.filename}...`);
      const content = generateComparisonPageContent(config, allBrokers);
      const filePath = path.join(process.cwd(), 'src', 'pages', 'comparison', config.filename);
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Updated ${config.filename}`);
    }

    console.log('✓ All comparison pages updated successfully!');
   } catch (error) {
     console.error('❌ Error updating comparison pages:', error);
   }
}

// Run the script
console.log('Script loaded, checking if running directly...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);

// Always run the script for now
updateAllComparisonPages();

export { updateAllComparisonPages };
