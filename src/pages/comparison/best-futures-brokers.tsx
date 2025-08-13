import React, { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { ArrowRight, Award, CheckCircle, ExternalLink, Filter, Star, TrendingUp } from 'lucide-react';

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

const topBrokers: Broker[] = [
  {
    "id": "amp-futures",
    "name": "Amp Futures",
    "logo": "/images/brokers/amp-futures-logo.png",
    "rating": 4.8,
    "reviewCount": 886,
    "minDeposit": 500,
    "spreadsFrom": 0.7,
    "maxLeverage": 200,
    "regulators": [
      "CFTC",
      "NFA"
    ],
    "keyFeatures": [
      "Low commissions",
      "Advanced platforms",
      "Professional tools"
    ],
    "website": "https://ampfutures.com",
    "pros": [
      "Very low commissions",
      "Multiple platforms",
      "Excellent execution"
    ],
    "cons": [
      "Higher minimum deposit",
      "Complex for beginners"
    ]
  },
  {
    "id": "ninjatrader",
    "name": "NinjaTrader",
    "logo": "/images/brokers/ninjatrader-logo.png",
    "rating": 4.7,
    "reviewCount": 1245,
    "minDeposit": 400,
    "spreadsFrom": 0.5,
    "maxLeverage": 100,
    "regulators": [
      "CFTC",
      "NFA"
    ],
    "keyFeatures": [
      "Advanced charting",
      "Automated trading",
      "Market analysis"
    ],
    "website": "https://ninjatrader.com",
    "pros": [
      "Powerful platform",
      "Great for automation",
      "Comprehensive tools"
    ],
    "cons": [
      "Steep learning curve",
      "Platform fees"
    ]
  },
  {
    "id": "optimus-futures",
    "name": "Optimus Futures",
    "logo": "/images/brokers/optimus-futures-logo.png",
    "rating": 4.6,
    "reviewCount": 567,
    "minDeposit": 300,
    "spreadsFrom": 0.8,
    "maxLeverage": 150,
    "regulators": [
      "CFTC",
      "NFA"
    ],
    "keyFeatures": [
      "Low margins",
      "Multiple platforms",
      "Educational resources"
    ],
    "website": "https://optimusfutures.com",
    "pros": [
      "Competitive rates",
      "Good education",
      "Multiple platforms"
    ],
    "cons": [
      "Limited international access",
      "Inactivity fees"
    ]
  },
  {
    "id": "tradestation",
    "name": "TradeStation",
    "logo": "/images/brokers/tradestation-logo.png",
    "rating": 4.5,
    "reviewCount": 892,
    "minDeposit": 500,
    "spreadsFrom": 1.0,
    "maxLeverage": 100,
    "regulators": [
      "SEC",
      "FINRA",
      "CFTC"
    ],
    "keyFeatures": [
      "Advanced analytics",
      "Strategy testing",
      "Professional tools"
    ],
    "website": "https://tradestation.com",
    "pros": [
      "Excellent platform",
      "Great for analysis",
      "Strategy development"
    ],
    "cons": [
      "Complex interface",
      "Higher costs"
    ]
  },
  {
    "id": "interactive-brokers",
    "name": "Interactive Brokers",
    "logo": "/images/brokers/interactive-brokers-logo.png",
    "rating": 4.4,
    "reviewCount": 2156,
    "minDeposit": 0,
    "spreadsFrom": 0.85,
    "maxLeverage": 50,
    "regulators": [
      "SEC",
      "FINRA",
      "CFTC"
    ],
    "keyFeatures": [
      "Global markets",
      "Low costs",
      "Professional tools"
    ],
    "website": "https://interactivebrokers.com",
    "pros": [
      "Very low costs",
      "Global access",
      "Advanced features"
    ],
    "cons": [
      "Complex platform",
      "Steep learning curve"
    ]
  }
];

const BestFuturesBrokers2025: React.FC = () => {
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({
    minDeposit: '',
    regulation: '',
    platform: ''
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredBrokers = topBrokers.filter(broker => {
    if (filterCriteria.minDeposit && broker.minDeposit > parseInt(filterCriteria.minDeposit)) {
      return false;
    }
    if (filterCriteria.regulation && !broker.regulators.some(reg => 
      reg.toLowerCase().includes(filterCriteria.regulation.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Helmet>
        <title>Best Futures Brokers 2025 - Top Rated Futures Trading Platforms</title>
        <meta name="description" content="Compare the best futures brokers for 2025. Find top-rated futures trading platforms with low commissions, advanced tools, and reliable execution for commodity and financial futures trading." />
        <meta name="keywords" content="best futures brokers 2025, futures trading platforms, commodity brokers, financial futures, futures commissions, NinjaTrader, AMP Futures, TradeStation" />
        <link rel="canonical" href="https://brokeranalysis.com/comparison/best-futures-brokers" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Best Futures Brokers 2025 - Top Rated Trading Platforms" />
        <meta property="og:description" content="Compare the best futures brokers for 2025. Find top-rated platforms with low commissions and advanced tools." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://brokeranalysis.com/comparison/best-futures-brokers" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Futures Brokers 2025 - Top Rated Trading Platforms" />
        <meta name="twitter:description" content="Compare the best futures brokers for 2025. Find top-rated platforms with low commissions and advanced tools." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
              "@type": "FinancialProduct",
              "name": "Best Futures Brokers 2025"
            },
            "author": {
              "@type": "Organization",
              "name": "BrokerAnalysis"
            },
            "datePublished": "2025-01-01",
            "description": "Comprehensive comparison of the best futures brokers for 2025"
          })}
        </script>
      </Helmet>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Best Futures Brokers 2025
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Compare top-rated futures trading platforms with low commissions and advanced tools
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
                <span>CFTC Regulated</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <TrendingUp className="w-5 h-5" />
                <span>Low Commissions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Award className="w-5 h-5" />
                <span>Advanced Platforms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-accent-blue" />
            <h2 className="text-lg font-semibold">Filter Brokers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Minimum Deposit
              </label>
              <select
                value={filterCriteria.minDeposit}
                onChange={(e) => setFilterCriteria({...filterCriteria, minDeposit: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Any Amount</option>
                <option value="100">Under $100</option>
                <option value="500">Under $500</option>
                <option value="1000">Under $1,000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regulation
              </label>
              <select
                value={filterCriteria.regulation}
                onChange={(e) => setFilterCriteria({...filterCriteria, regulation: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Regulators</option>
                <option value="CFTC">CFTC</option>
                <option value="NFA">NFA</option>
                <option value="SEC">SEC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Type
              </label>
              <select
                value={filterCriteria.platform}
                onChange={(e) => setFilterCriteria({...filterCriteria, platform: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Platforms</option>
                <option value="advanced">Advanced</option>
                <option value="beginner">Beginner-Friendly</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brokers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBrokers.map((broker, index) => (
            <div key={broker.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {index === 0 && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 font-semibold">
                  🏆 #1 RECOMMENDED
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <img 
                    src={broker.logo} 
                    alt={`${broker.name} logo`}
                    className="h-12 w-auto object-contain"
                  />
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {renderStars(broker.rating)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {broker.reviewCount} reviews
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2">{broker.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Min Deposit:</span>
                    <div className="font-semibold">${broker.minDeposit}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Commissions From:</span>
                    <div className="font-semibold">${broker.spreadsFrom}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Leverage:</span>
                    <div className="font-semibold">{broker.maxLeverage}:1</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Regulation:</span>
                    <div className="font-semibold">{broker.regulators[0]}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {broker.keyFeatures.map((feature, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBroker(broker)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <a
                    href={broker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium text-center flex items-center justify-center gap-1"
                  >
                    Visit Site
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b">
              <h2 className="text-2xl font-bold">Detailed Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Deposit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Regulation</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topBrokers.map((broker) => (
                    <tr key={broker.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img className="h-8 w-8 rounded-full mr-3" src={broker.logo} alt={broker.name} />
                          <div className="text-sm font-medium text-gray-900">{broker.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {renderStars(broker.rating)}
                          <span className="ml-2 text-sm text-gray-600">({broker.reviewCount})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${broker.minDeposit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        From ${broker.spreadsFrom}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {broker.regulators[0]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={broker.website} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:text-blue-900">
                          Visit Site
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Details Modal */}
      {selectedBroker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">{selectedBroker.name}</h3>
                <button
                  onClick={() => setSelectedBroker(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Pros:</h4>
                  <ul className="space-y-1">
                    {selectedBroker.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-accent-blue" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600 mb-2">Cons:</h4>
                  <ul className="space-y-1">
                    {selectedBroker.cons.map((con, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <span className="w-4 h-4 text-accent-blue">✕</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex gap-4">
                <a
                  href={selectedBroker.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200 text-center font-medium"
                >
                  Visit {selectedBroker.name}
                </a>
                <button
                  onClick={() => setSelectedBroker(null)}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BestFuturesBrokers2025;
