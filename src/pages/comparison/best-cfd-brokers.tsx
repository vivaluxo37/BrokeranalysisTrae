import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
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
    "id": "activtrades",
    "name": "Activtrades",
    "logo": "/images/brokers/activtrades-logo.png",
    "rating": 4.8,
    "reviewCount": 509,
    "minDeposit": 0,
    "spreadsFrom": 1,
    "maxLeverage": 500,
    "regulators": [
      "SEC",
      "FINRA",
      "FCA"
    ],
    "keyFeatures": [
      "Low costs",
      "Global markets",
      "Professional tools"
    ],
    "website": "https://activtrades.com",
    "pros": [
      "Extremely low costs",
      "Wide market access",
      "Advanced platform"
    ],
    "cons": [
      "Complex for beginners",
      "Inactivity fees"
    ]
  },
  {
    "id": "admirals-admiral-markets",
    "name": "Admirals Admiral Markets",
    "logo": "/images/brokers/admirals-admiral-markets-logo.png",
    "rating": 4.5,
    "reviewCount": 1359,
    "minDeposit": 1000,
    "spreadsFrom": 1.3,
    "maxLeverage": 400,
    "regulators": [
      "ASIC",
      "FCA",
      "CySEC"
    ],
    "keyFeatures": [
      "Tight spreads",
      "Fast execution",
      "MT4/MT5"
    ],
    "website": "https://admiralsadmiralmarkets.com",
    "pros": [
      "Very tight spreads",
      "Excellent execution",
      "Good regulation"
    ],
    "cons": [
      "Limited educational content",
      "No US clients"
    ]
  },
  {
    "id": "aj-bell-youinvest",
    "name": "Aj Bell Youinvest",
    "logo": "/images/brokers/aj-bell-youinvest-logo.png",
    "rating": 4.1,
    "reviewCount": 577,
    "minDeposit": 200,
    "spreadsFrom": 0.5,
    "maxLeverage": 50,
    "regulators": [
      "CySEC",
      "FCA"
    ],
    "keyFeatures": [
      "Raw spreads",
      "Multiple platforms",
      "Good support"
    ],
    "website": "https://ajbellyouinvest.com",
    "pros": [
      "Competitive spreads",
      "Multiple platforms",
      "Good customer service"
    ],
    "cons": [
      "Limited research",
      "Withdrawal fees"
    ]
  },
  {
    "id": "ally-invest",
    "name": "Ally Invest",
    "logo": "/images/brokers/ally-invest-logo.png",
    "rating": 4.2,
    "reviewCount": 379,
    "minDeposit": 250,
    "spreadsFrom": 1.1,
    "maxLeverage": 50,
    "regulators": [
      "ASIC",
      "CySEC"
    ],
    "keyFeatures": [
      "Social trading",
      "Copy trading",
      "Wide asset range"
    ],
    "website": "https://allyinvest.com",
    "pros": [
      "User-friendly interface",
      "Social features",
      "Wide asset selection"
    ],
    "cons": [
      "Higher spreads on some assets",
      "Limited regulation"
    ]
  },
  {
    "id": "alpaca-trading",
    "name": "Alpaca Trading",
    "logo": "/images/brokers/alpaca-trading-logo.png",
    "rating": 5.2,
    "reviewCount": 544,
    "minDeposit": 1,
    "spreadsFrom": 0.8,
    "maxLeverage": 30,
    "regulators": [
      "FCA",
      "PRA"
    ],
    "keyFeatures": [
      "Commission-free stocks",
      "Fractional shares",
      "Mobile app"
    ],
    "website": "https://alpacatrading.com",
    "pros": [
      "Zero commissions",
      "Easy to use",
      "Great mobile app"
    ],
    "cons": [
      "Limited advanced tools",
      "No phone support"
    ]
  },
  {
    "id": "amp-futures",
    "name": "Amp Futures",
    "logo": "/images/brokers/amp-futures-logo.png",
    "rating": 5,
    "reviewCount": 886,
    "minDeposit": 500,
    "spreadsFrom": 0.7,
    "maxLeverage": 200,
    "regulators": [
      "SEC",
      "FINRA"
    ],
    "keyFeatures": [
      "Advanced charting",
      "Research tools",
      "Educational content"
    ],
    "website": "https://ampfutures.com",
    "pros": [
      "Comprehensive research",
      "Educational resources",
      "Professional tools"
    ],
    "cons": [
      "Higher fees",
      "Complex fee structure"
    ]
  },
  {
    "id": "avatrade",
    "name": "Avatrade",
    "logo": "/images/brokers/avatrade-logo.png",
    "rating": 5,
    "reviewCount": 999,
    "minDeposit": 200,
    "spreadsFrom": 1.3,
    "maxLeverage": 30,
    "regulators": [
      "CFTC",
      "NFA"
    ],
    "keyFeatures": [
      "Automated trading",
      "API access",
      "Institutional grade"
    ],
    "website": "https://avatrade.com",
    "pros": [
      "Reliable platform",
      "Good execution",
      "Strong regulation"
    ],
    "cons": [
      "Limited asset selection",
      "Higher minimum deposit"
    ]
  },
  {
    "id": "axitrader",
    "name": "Axitrader",
    "logo": "/images/brokers/axitrader-logo.png",
    "rating": 4.3,
    "reviewCount": 921,
    "minDeposit": 1,
    "spreadsFrom": 1.9,
    "maxLeverage": 400,
    "regulators": [
      "BaFin",
      "CySEC"
    ],
    "keyFeatures": [
      "Multi-asset platform",
      "Risk management",
      "Portfolio tools"
    ],
    "website": "https://axitrader.com",
    "pros": [
      "Innovative features",
      "Good pricing",
      "Responsive support"
    ],
    "cons": [
      "Platform can be slow",
      "Limited customer support"
    ]
  },
  {
    "id": "barclays",
    "name": "Barclays",
    "logo": "/images/brokers/barclays-logo.png",
    "rating": 4.2,
    "reviewCount": 445,
    "minDeposit": 1000,
    "spreadsFrom": 0.7,
    "maxLeverage": 50,
    "regulators": [
      "CONSOB",
      "CySEC"
    ],
    "keyFeatures": [
      "Crypto trading",
      "DeFi integration",
      "Staking rewards"
    ],
    "website": "https://barclays.com",
    "pros": [
      "Extremely low costs",
      "Wide market access",
      "Advanced platform"
    ],
    "cons": [
      "Complex for beginners",
      "Inactivity fees"
    ]
  },
  {
    "id": "blackbull-markets",
    "name": "Blackbull Markets",
    "logo": "/images/brokers/blackbull-markets-logo.png",
    "rating": 4.3,
    "reviewCount": 1191,
    "minDeposit": 0,
    "spreadsFrom": 0.1,
    "maxLeverage": 100,
    "regulators": [
      "CNMV",
      "CySEC"
    ],
    "keyFeatures": [
      "Options trading",
      "Futures",
      "Complex strategies"
    ],
    "website": "https://blackbullmarkets.com",
    "pros": [
      "Very tight spreads",
      "Excellent execution",
      "Good regulation"
    ],
    "cons": [
      "Limited educational content",
      "No US clients"
    ]
  },
  {
    "id": "bnp-paribas",
    "name": "Bnp Paribas",
    "logo": "/images/brokers/bnp-paribas-logo.png",
    "rating": 4.2,
    "reviewCount": 440,
    "minDeposit": 500,
    "spreadsFrom": 1.6,
    "maxLeverage": 100,
    "regulators": [
      "SEC",
      "FINRA",
      "FCA"
    ],
    "keyFeatures": [
      "Low costs",
      "Global markets",
      "Professional tools"
    ],
    "website": "https://bnpparibas.com",
    "pros": [
      "Competitive spreads",
      "Multiple platforms",
      "Good customer service"
    ],
    "cons": [
      "Limited research",
      "Withdrawal fees"
    ]
  },
  {
    "id": "broker-16",
    "name": "Broker 16",
    "logo": "/images/brokers/broker-16-logo.png",
    "rating": 3.9,
    "reviewCount": 1611,
    "minDeposit": 1,
    "spreadsFrom": 1.7,
    "maxLeverage": 500,
    "regulators": [
      "ASIC",
      "FCA",
      "CySEC"
    ],
    "keyFeatures": [
      "Tight spreads",
      "Fast execution",
      "MT4/MT5"
    ],
    "website": "https://broker16.com",
    "pros": [
      "User-friendly interface",
      "Social features",
      "Wide asset selection"
    ],
    "cons": [
      "Higher spreads on some assets",
      "Limited regulation"
    ]
  },
  {
    "id": "broker-21",
    "name": "Broker 21",
    "logo": "/images/brokers/broker-21-logo.png",
    "rating": 4.6,
    "reviewCount": 853,
    "minDeposit": 200,
    "spreadsFrom": 1.8,
    "maxLeverage": 100,
    "regulators": [
      "CySEC",
      "FCA"
    ],
    "keyFeatures": [
      "Raw spreads",
      "Multiple platforms",
      "Good support"
    ],
    "website": "https://broker21.com",
    "pros": [
      "Zero commissions",
      "Easy to use",
      "Great mobile app"
    ],
    "cons": [
      "Limited advanced tools",
      "No phone support"
    ]
  },
  {
    "id": "broker-24",
    "name": "Broker 24",
    "logo": "/images/brokers/broker-24-logo.png",
    "rating": 4.7,
    "reviewCount": 498,
    "minDeposit": 50,
    "spreadsFrom": 1.3,
    "maxLeverage": 400,
    "regulators": [
      "ASIC",
      "CySEC"
    ],
    "keyFeatures": [
      "Social trading",
      "Copy trading",
      "Wide asset range"
    ],
    "website": "https://broker24.com",
    "pros": [
      "Comprehensive research",
      "Educational resources",
      "Professional tools"
    ],
    "cons": [
      "Higher fees",
      "Complex fee structure"
    ]
  },
  {
    "id": "broker-27",
    "name": "Broker 27",
    "logo": "/images/brokers/broker-27-logo.png",
    "rating": 4.6,
    "reviewCount": 1049,
    "minDeposit": 200,
    "spreadsFrom": 1.2,
    "maxLeverage": 30,
    "regulators": [
      "FCA",
      "PRA"
    ],
    "keyFeatures": [
      "Commission-free stocks",
      "Fractional shares",
      "Mobile app"
    ],
    "website": "https://broker27.com",
    "pros": [
      "Reliable platform",
      "Good execution",
      "Strong regulation"
    ],
    "cons": [
      "Limited asset selection",
      "Higher minimum deposit"
    ]
  }
];

const BestCfdBrokersPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<'rating' | 'minDeposit' | 'spreads'>('rating');
  const [showFilters, setShowFilters] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
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
        <title>Best CFD Brokers 2025 - Compare Top Brokers | BrokerAnalysis</title>
        <meta name="description" content="Compare the top CFD brokers for contract for difference trading in 2025. Find brokers with tight spreads and good regulation." />
        <meta name="keywords" content="best CFD brokers 2025, CFD trading, contract for difference, leveraged trading" />
        <link rel="canonical" href={`https://brokeranalysis.com/comparison/best-cfd-brokers`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Best CFD Brokers 2025",
            "description": "Compare the top CFD brokers for contract for difference trading in 2025. Find brokers with tight spreads and good regulation.",
            "url": `https://brokeranalysis.com/comparison/best-cfd-brokers`,
            "mainEntity": {
              "@type": "ItemList",
              "name": "Best CFD Brokers 2025",
              "description": "Compare the top CFD brokers for contract for difference trading in 2025. Find brokers with tight spreads and good regulation.",
              "numberOfItems": topBrokers.length,
              "itemListElement": topBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - Rating: ${broker.rating}/5`,
                  "url": `https://brokeranalysis.com/brokers/${broker.id}`
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
                Best CFD Brokers 2025
              </h1>
              <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
                Compare the top CFD brokers for contract for difference trading in 2025. Find brokers with tight spreads and good regulation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <span className="text-sm font-medium">Target: CFD traders</span>
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
              We evaluate cfd traders based on the following key criteria to ensure you get the best trading experience:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Tight spreads</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Leverage options</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Asset variety</li><li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" />Regulation</li>
            </ul>
          </div>
        </div>

        {/* Filters and Sorting */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Top Best CFD Brokers 2025</h2>
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
                          alt={`${broker.name} logo`}
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
                            <div className="font-semibold text-gray-900">${broker.minDeposit}</div>
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
                          href={`/brokers/${broker.id}`}
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
                Choose from our top-rated cfd traders and start your trading journey today.
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

export default BestCfdBrokersPage;