import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, CheckCircle, TrendingUp, Award, Filter, ArrowRight, ExternalLink, DollarSign } from 'lucide-react';

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
    "id": "interactive-brokers",
    "name": "Interactive Brokers",
    "logo": "/images/brokers/interactive-brokers-logo.png",
    "rating": 4.8,
    "reviewCount": 2156,
    "minDeposit": 0,
    "spreadsFrom": 0.1,
    "maxLeverage": 50,
    "regulators": [
      "SEC",
      "FINRA",
      "FCA"
    ],
    "keyFeatures": [
      "$0 commissions on stocks",
      "Low margin rates",
      "Global markets"
    ],
    "website": "https://interactivebrokers.com",
    "pros": [
      "Extremely low costs",
      "No minimum deposit",
      "Global market access"
    ],
    "cons": [
      "Complex platform",
      "Steep learning curve"
    ]
  },
  {
    "id": "robinhood",
    "name": "Robinhood",
    "logo": "/images/brokers/robinhood-logo.png",
    "rating": 4.2,
    "reviewCount": 3456,
    "minDeposit": 0,
    "spreadsFrom": 0,
    "maxLeverage": 2,
    "regulators": [
      "SEC",
      "FINRA"
    ],
    "keyFeatures": [
      "$0 stock trades",
      "$0 options trades",
      "Fractional shares"
    ],
    "website": "https://robinhood.com",
    "pros": [
      "Zero commissions",
      "User-friendly app",
      "No account minimums"
    ],
    "cons": [
      "Limited research tools",
      "No phone support"
    ]
  },
  {
    "id": "charles-schwab",
    "name": "Charles Schwab",
    "logo": "/images/brokers/charles-schwab-logo.png",
    "rating": 4.6,
    "reviewCount": 1892,
    "minDeposit": 0,
    "spreadsFrom": 0,
    "maxLeverage": 4,
    "regulators": [
      "SEC",
      "FINRA"
    ],
    "keyFeatures": [
      "$0 stock trades",
      "No account fees",
      "Excellent research"
    ],
    "website": "https://schwab.com",
    "pros": [
      "No commissions",
      "Great customer service",
      "Comprehensive research"
    ],
    "cons": [
      "Limited international markets",
      "Options fees apply"
    ]
  },
  {
    "id": "fidelity",
    "name": "Fidelity",
    "logo": "/images/brokers/fidelity-logo.png",
    "rating": 4.5,
    "reviewCount": 2134,
    "minDeposit": 0,
    "spreadsFrom": 0,
    "maxLeverage": 4,
    "regulators": [
      "SEC",
      "FINRA"
    ],
    "keyFeatures": [
      "$0 stock trades",
      "$0 mutual funds",
      "Fractional shares"
    ],
    "website": "https://fidelity.com",
    "pros": [
      "Zero commissions",
      "Excellent mutual funds",
      "Great mobile app"
    ],
    "cons": [
      "Limited international access",
      "Complex fee structure for some products"
    ]
  },
  {
    "id": "webull",
    "name": "Webull",
    "logo": "/images/brokers/webull-logo.png",
    "rating": 4.1,
    "reviewCount": 1567,
    "minDeposit": 0,
    "spreadsFrom": 0,
    "maxLeverage": 4,
    "regulators": [
      "SEC",
      "FINRA"
    ],
    "keyFeatures": [
      "$0 commissions",
      "Advanced charting",
      "Extended hours trading"
    ],
    "website": "https://webull.com",
    "pros": [
      "Zero commissions",
      "Advanced tools",
      "Extended trading hours"
    ],
    "cons": [
      "Limited customer support",
      "No mutual funds"
    ]
  },
  {
    "id": "e-trade",
    "name": "E*TRADE",
    "logo": "/images/brokers/e-trade-logo.png",
    "rating": 4.3,
    "reviewCount": 1789,
    "minDeposit": 0,
    "spreadsFrom": 0,
    "maxLeverage": 4,
    "regulators": [
      "SEC",
      "FINRA"
    ],
    "keyFeatures": [
      "$0 stock trades",
      "Professional platform",
      "Options trading"
    ],
    "website": "https://etrade.com",
    "pros": [
      "Zero stock commissions",
      "Professional tools",
      "Good research"
    ],
    "cons": [
      "Options fees",
      "Account maintenance fees for small accounts"
    ]
  }
];

const BestLowCostBrokers2025: React.FC = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Helmet>
        <title>Best Low Cost Brokers 2025 - Zero Commission Trading Platforms</title>
        <meta name="description" content="Find the best low cost brokers for 2025. Compare zero commission trading platforms with no account minimums, low fees, and excellent value for money." />
        <meta name="keywords" content="best low cost brokers 2025, zero commission trading, cheap brokers, no fee trading, discount brokers, Interactive Brokers, Robinhood, Charles Schwab" />
        <link rel="canonical" href="https://brokeranalysis.com/comparison/best-low-cost-brokers" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Best Low Cost Brokers 2025 - Zero Commission Trading" />
        <meta property="og:description" content="Find the best low cost brokers for 2025. Compare zero commission platforms with no account minimums." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://brokeranalysis.com/comparison/best-low-cost-brokers" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Low Cost Brokers 2025 - Zero Commission Trading" />
        <meta name="twitter:description" content="Find the best low cost brokers for 2025. Compare zero commission platforms with no account minimums." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Review",
            "itemReviewed": {
              "@type": "FinancialProduct",
              "name": "Best Low Cost Brokers 2025"
            },
            "author": {
              "@type": "Organization",
              "name": "BrokerAnalysis"
            },
            "datePublished": "2025-01-01",
            "description": "Comprehensive comparison of the best low cost brokers for 2025"
          })}
        </script>
      </Helmet>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Best Low Cost Brokers 2025
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Zero commission trading platforms with no account minimums and low fees
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <DollarSign className="w-5 h-5" />
                <span>$0 Commissions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-5 h-5" />
                <span>No Minimums</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Award className="w-5 h-5" />
                <span>Best Value</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-green-600" />
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
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Any Amount</option>
                <option value="0">$0 Only</option>
                <option value="100">Under $100</option>
                <option value="500">Under $500</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regulation
              </label>
              <select
                value={filterCriteria.regulation}
                onChange={(e) => setFilterCriteria({...filterCriteria, regulation: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Regulators</option>
                <option value="SEC">SEC</option>
                <option value="FINRA">FINRA</option>
                <option value="FCA">FCA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>
              <select
                value={filterCriteria.platform}
                onChange={(e) => setFilterCriteria({...filterCriteria, platform: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="beginner">Beginner-Friendly</option>
                <option value="advanced">Advanced</option>
                <option value="mobile">Mobile-First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cost Savings Banner */}
        <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💰 Save Thousands in Trading Fees</h2>
            <p className="text-gray-600 mb-4">
              The average trader saves $1,200+ per year by switching to a zero-commission broker. 
              Compare our top picks below to find the best value for your trading style.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">$0</div>
                <div className="text-sm text-gray-600">Stock Commissions</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">$0</div>
                <div className="text-sm text-gray-600">Account Minimums</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">$0</div>
                <div className="text-sm text-gray-600">Account Fees</div>
              </div>
            </div>
          </div>
        </div>

        {/* Brokers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBrokers.map((broker, index) => (
            <div key={broker.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              {index === 0 && (
                <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white text-center py-2 font-semibold">
                  🏆 LOWEST COST
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
                    <div className="font-semibold text-green-600">
                      {broker.minDeposit === 0 ? 'FREE' : `$${broker.minDeposit}`}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Stock Commissions:</span>
                    <div className="font-semibold text-green-600">
                      {broker.spreadsFrom === 0 ? 'FREE' : `$${broker.spreadsFrom}`}
                    </div>
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
                      <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedBroker(broker)}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                  >
                    View Details
                  </button>
                  <a
                    href={broker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium text-center flex items-center justify-center gap-1"
                  >
                    Start Trading
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
              <h2 className="text-2xl font-bold">Cost Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broker</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Deposit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Commissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Account Fees</th>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">
                          {broker.minDeposit === 0 ? 'FREE' : `$${broker.minDeposit}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-green-600">
                          {broker.spreadsFrom === 0 ? 'FREE' : `$${broker.spreadsFrom}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          None
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a href={broker.website} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-900">
                          Open Account
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
                        <CheckCircle className="w-4 h-4 text-green-500" />
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
                        <span className="w-4 h-4 text-red-500">✕</span>
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
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors duration-200 text-center font-medium"
                >
                  Start Trading with {selectedBroker.name}
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

export default BestLowCostBrokers2025;