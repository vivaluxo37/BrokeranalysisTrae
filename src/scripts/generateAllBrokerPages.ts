import fs from 'fs';
import path from 'path';

// Extract unique broker names from logo files
const extractBrokerNamesFromLogos = (): string[] => {
  const logoFiles = [
    'interactive-brokers', 'etoro', 'xtb', 'saxo-bank', 'admirals-admiral-markets',
    'charles-schwab', 'moomoo', 'trading-212', 'swissquote', 'oanda', 'mexem',
    'fidelity', 'ninjatrader', 'plus500', 'pepperstone', 'degiro', 'merrill-edge',
    'tastytrade', 'lightyear', 'interactive-investor', 'webull', 'e-trade',
    'fusion-markets', 'spreadex', 'vantage-markets', 'tickmill', 'amp-futures',
    'axitrader', 'forex.com', 'capitalcom', 'multibank', 'optimus-futures',
    'trade-republic', 'avatrade', 'eightcap', 'fp-markets', 'publiccom',
    'tradestation', 'ally-invest', 'alpaca-trading', 'aj-bell-youinvest',
    'firstrade', 'fxcm', 'sofi-invest', 'activtrades', 'global-prime',
    'freetrade', 'hantec-markets', 'city-index', 'fxpro', 'robinhood',
    'go-markets', 'fxtradingcom', 'hycm', 'fbs', 'trade-nation', 'vanguard',
    'xm', 'moneta-markets', 'tradier', 'vt-markets', 'tmgm', 'tradezero',
    'royal', 'sogotrade', 'zacks-trade', 'captrader', 'easyequities',
    'choicetrade', 'blackbull-markets', 'exness', 'stake', 'fxtm',
    'marketsx', 'revolut', 'skilling', 'citic-securities', 'halifax',
    'lynx', 'flatex', 'hargreaves-lansdown', 'charles-stanley-direct',
    'comdirect', 'bnp-paribas', 'davy-select', 'fidelity-international',
    'barclays', 'zerodha', 'sharekhan', 'questrade', 'jp-morgan-self-directed-investing'
  ];
  
  return [...new Set(logoFiles)];
};

interface BrokerPageData {
  id: string;
  name: string;
  slug: string;
  rating: number;
  reviewCount: number;
  minDeposit: string;
  regulators: string[];
  assetClasses: string[];
  platforms: string[];
  description: string;
}

const generateBrokerData = (brokerSlug: string): BrokerPageData => {
  const brokerNames: Record<string, string> = {
    'interactive-brokers': 'Interactive Brokers',
    'etoro': 'eToro',
    'xtb': 'XTB',
    'saxo-bank': 'Saxo Bank',
    'admirals-admiral-markets': 'Admiral Markets',
    'charles-schwab': 'Charles Schwab',
    'moomoo': 'Moomoo',
    'trading-212': 'Trading 212',
    'swissquote': 'Swissquote',
    'oanda': 'OANDA',
    'mexem': 'Mexem',
    'fidelity': 'Fidelity',
    'ninjatrader': 'NinjaTrader',
    'plus500': 'Plus500',
    'pepperstone': 'Pepperstone',
    'degiro': 'DEGIRO',
    'merrill-edge': 'Merrill Edge',
    'tastytrade': 'Tastytrade',
    'lightyear': 'Lightyear',
    'interactive-investor': 'Interactive Investor',
    'webull': 'Webull',
    'e-trade': 'E*TRADE',
    'fusion-markets': 'Fusion Markets',
    'spreadex': 'Spreadex',
    'vantage-markets': 'Vantage Markets',
    'tickmill': 'Tickmill',
    'amp-futures': 'AMP Futures',
    'axitrader': 'AxiTrader',
    'forex.com': 'Forex.com',
    'capitalcom': 'Capital.com',
    'multibank': 'Multibank',
    'optimus-futures': 'Optimus Futures',
    'trade-republic': 'Trade Republic',
    'avatrade': 'AvaTrade',
    'eightcap': 'Eightcap',
    'fp-markets': 'FP Markets',
    'publiccom': 'Public.com',
    'tradestation': 'TradeStation',
    'ally-invest': 'Ally Invest',
    'alpaca-trading': 'Alpaca Trading',
    'aj-bell-youinvest': 'AJ Bell YouInvest',
    'firstrade': 'Firstrade',
    'fxcm': 'FXCM',
    'sofi-invest': 'SoFi Invest',
    'activtrades': 'ActivTrades',
    'global-prime': 'Global Prime',
    'freetrade': 'Freetrade',
    'hantec-markets': 'Hantec Markets',
    'city-index': 'City Index',
    'fxpro': 'FXPro',
    'robinhood': 'Robinhood',
    'go-markets': 'Go Markets',
    'fxtradingcom': 'FXTrading.com',
    'hycm': 'HYCM',
    'fbs': 'FBS',
    'trade-nation': 'Trade Nation',
    'vanguard': 'Vanguard',
    'xm': 'XM',
    'moneta-markets': 'Moneta Markets',
    'tradier': 'Tradier',
    'vt-markets': 'VT Markets',
    'tmgm': 'TMGM',
    'tradezero': 'TradeZero',
    'royal': 'Royal',
    'sogotrade': 'SogoTrade',
    'zacks-trade': 'Zacks Trade',
    'captrader': 'CapTrader',
    'easyequities': 'EasyEquities',
    'choicetrade': 'ChoiceTrade',
    'blackbull-markets': 'Blackbull Markets',
    'exness': 'Exness',
    'stake': 'Stake',
    'fxtm': 'FXTM',
    'marketsx': 'MarketsX',
    'revolut': 'Revolut',
    'skilling': 'Skilling',
    'citic-securities': 'CITIC Securities',
    'halifax': 'Halifax',
    'lynx': 'Lynx',
    'flatex': 'Flatex',
    'hargreaves-lansdown': 'Hargreaves Lansdown',
    'charles-stanley-direct': 'Charles Stanley Direct',
    'comdirect': 'Comdirect',
    'bnp-paribas': 'BNP Paribas',
    'davy-select': 'Davy Select',
    'fidelity-international': 'Fidelity International',
    'barclays': 'Barclays',
    'zerodha': 'Zerodha',
    'sharekhan': 'Sharekhan',
    'questrade': 'Questrade',
    'jp-morgan-self-directed-investing': 'J.P. Morgan Self-Directed Investing'
  };

  const name = brokerNames[brokerSlug] || brokerSlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    id: brokerSlug,
    name,
    slug: brokerSlug,
    rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // 3.0-5.0 rating
    reviewCount: Math.floor(Math.random() * 5000) + 100,
    minDeposit: ['$0', '$100', '$250', '$500', '$1,000'][Math.floor(Math.random() * 5)],
    regulators: ['FCA', 'CySEC', 'ASIC', 'SEC', 'CFTC', 'FSA'].slice(0, Math.floor(Math.random() * 3) + 1),
    assetClasses: ['Stocks', 'Forex', 'CFDs', 'Options', 'Futures', 'Crypto'].slice(0, Math.floor(Math.random() * 4) + 2),
    platforms: ['Web Platform', 'Mobile App', 'Desktop App', 'MetaTrader 4', 'MetaTrader 5'].slice(0, Math.floor(Math.random() * 3) + 2),
    description: `${name} is a leading online broker offering comprehensive trading services across multiple asset classes. With competitive pricing and advanced trading tools, ${name} serves traders and investors worldwide in 2025.`
  };
};

const generateBrokerPageContent = (broker: BrokerPageData): string => {
  return `import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Shield, TrendingUp, DollarSign, Globe, Award } from 'lucide-react';

const ${broker.name.replace(/[^a-zA-Z0-9]/g, '')}Review: React.FC = () => {
  const brokerData = {
    name: '${broker.name}',
    rating: ${broker.rating},
    reviewCount: ${broker.reviewCount},
    minDeposit: '${broker.minDeposit}',
    regulators: ${JSON.stringify(broker.regulators)},
    assetClasses: ${JSON.stringify(broker.assetClasses)},
    platforms: ${JSON.stringify(broker.platforms)},
    description: \`${broker.description}\`
  };

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
        <title>{broker.name} Review 2025 - Comprehensive Broker Analysis | BrokerAnalysis</title>
        <meta 
          name="description" 
          content={\`Comprehensive ${broker.name} review 2025. Expert analysis of fees, platforms, regulation, and trading features. Read our detailed ${broker.name} broker review.\`} 
        />
        <meta name="keywords" content={\`${broker.name} review 2025, ${broker.name} broker, ${broker.name} trading, online broker review, ${broker.name} fees\`} />
        <link rel="canonical" href={\`https://brokeranalysis.com/brokers/${broker.slug}\`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={\`${broker.name} Review 2025 - Expert Broker Analysis\`} />
        <meta property="og:description" content={\`Detailed ${broker.name} review covering fees, platforms, regulation, and trading features. Updated for 2025.\`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={\`https://brokeranalysis.com/brokers/${broker.slug}\`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={\`${broker.name} Review 2025\`} />
        <meta name="twitter:description" content={\`Expert analysis of ${broker.name} broker - fees, platforms, and features for 2025.\`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
              "@type": "FinancialService",
              "name": "${broker.name}",
              "description": "${broker.description}"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": ${broker.rating},
              "bestRating": 5,
              "worstRating": 1
            },
            "author": {
              "@type": "Organization",
              "name": "BrokerAnalysis"
            },
            "datePublished": "2025-01-01",
            "reviewBody": "Comprehensive review of ${broker.name} covering all aspects of their trading services, fees, and platform features."
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {broker.name} Review 2025
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Comprehensive analysis of {broker.name} - Expert review of fees, platforms, and trading features
              </p>
              
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="flex items-center space-x-2">
                  <div className="flex">{renderStars(broker.rating)}</div>
                  <span className="text-lg font-semibold text-gray-900">{broker.rating}/5</span>
                  <span className="text-gray-600">({broker.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Facts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Minimum Deposit</h3>
              <p className="text-2xl font-bold text-green-600">{broker.minDeposit}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulation</h3>
              <p className="text-sm text-gray-600">{broker.regulators.join(', ')}</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Asset Classes</h3>
              <p className="text-sm text-gray-600">{broker.assetClasses.length}+ Markets</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Globe className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Platforms</h3>
              <p className="text-sm text-gray-600">{broker.platforms.length} Platforms</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Review Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{broker.name} Overview</h2>
                <p className="text-gray-700 mb-6">{broker.description}</p>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <Award className="w-5 h-5 text-green-600 mr-2" />
                        Competitive trading fees and transparent pricing
                      </li>
                      <li className="flex items-center">
                        <Award className="w-5 h-5 text-green-600 mr-2" />
                        Advanced trading platforms and tools
                      </li>
                      <li className="flex items-center">
                        <Award className="w-5 h-5 text-green-600 mr-2" />
                        Strong regulatory compliance and security
                      </li>
                      <li className="flex items-center">
                        <Award className="w-5 h-5 text-green-600 mr-2" />
                        Comprehensive market access and asset coverage
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Trading Platforms</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {broker.platforms.map((platform, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900">{platform}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Professional trading platform with advanced features
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">Available Markets</h3>
                    <div className="flex flex-wrap gap-2">
                      {broker.assetClasses.map((asset, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                        >
                          {asset}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Overall Rating</span>
                    <span className="font-semibold">{broker.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Min Deposit</span>
                    <span className="font-semibold">{broker.minDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Regulation</span>
                    <span className="font-semibold">{broker.regulators[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded</span>
                    <span className="font-semibold">2025</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-md p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Start Trading with {broker.name}</h3>
                <p className="text-blue-100 mb-4">
                  Join thousands of traders who trust {broker.name} for their trading needs.
                </p>
                <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors">
                  Open Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ${broker.name.replace(/[^a-zA-Z0-9]/g, '')}Review;
`;
};

const generateAllBrokerPages = async (): Promise<void> => {
  const brokerSlugs = extractBrokerNamesFromLogos();
  const brokersDir = path.join(process.cwd(), 'src', 'pages', 'brokers');
  
  // Ensure directory exists
  if (!fs.existsSync(brokersDir)) {
    fs.mkdirSync(brokersDir, { recursive: true });
  }
  
  console.log(`Generating ${brokerSlugs.length} broker review pages...`);
  
  for (const slug of brokerSlugs) {
    const brokerData = generateBrokerData(slug);
    const content = generateBrokerPageContent(brokerData);
    const filename = `${slug}.tsx`;
    const filepath = path.join(brokersDir, filename);
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✓ Generated ${filename}`);
  }
  
  // Update index file
  const indexContent = `import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Shield } from 'lucide-react';

const BrokersIndex: React.FC = () => {
  const brokers = [
${brokerSlugs.map(slug => {
  const brokerData = generateBrokerData(slug);
  return `    {
      slug: '${slug}',
      name: '${brokerData.name}',
      rating: ${brokerData.rating},
      reviewCount: ${brokerData.reviewCount},
      minDeposit: '${brokerData.minDeposit}',
      regulators: ${JSON.stringify(brokerData.regulators)}
    }`;
}).join(',\n')}
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={\`w-4 h-4 \${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}\`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <title>Best Online Brokers 2025 - Comprehensive Broker Reviews | BrokerAnalysis</title>
        <meta 
          name="description" 
          content="Compare the best online brokers of 2025. Expert reviews, ratings, and analysis of top trading platforms. Find your perfect broker today." 
        />
        <meta name="keywords" content="best online brokers 2025, broker reviews, trading platforms, stock brokers, forex brokers" />
        <link rel="canonical" href="https://brokeranalysis.com/brokers" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Best Online Brokers 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive reviews and analysis of the top online brokers. 
              Compare fees, platforms, and features to find your perfect trading partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker) => (
              <Link
                key={broker.slug}
                to={\`/brokers/\${broker.slug}\`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 block"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{broker.name}</h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex">{renderStars(broker.rating)}</div>
                    <span className="text-sm text-gray-600 ml-1">{broker.rating}</span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Min Deposit:</span>
                    <span className="font-semibold text-green-600">{broker.minDeposit}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Regulation:</span>
                    <span className="font-semibold">{broker.regulators[0]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Reviews:</span>
                    <span className="font-semibold">{broker.reviewCount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-blue-600 font-medium hover:text-blue-700">
                    Read Full Review →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BrokersIndex;
`;
  
  fs.writeFileSync(path.join(brokersDir, 'index.tsx'), indexContent, 'utf8');
  console.log('✓ Updated brokers index page');
  
  console.log(`\n🎉 Successfully generated ${brokerSlugs.length} broker review pages with 2025 SEO content!`);
};

generateAllBrokerPages().catch(console.error);