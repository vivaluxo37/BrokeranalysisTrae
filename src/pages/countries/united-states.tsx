import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, CreditCard, DollarSign, Shield, Star, TrendingUp } from 'lucide-react';

interface Broker {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  minDeposit: string;
  spread: string;
  maxLeverage: string;
  regulators: string[];
  keyFeatures: string[];
  website: string;
  pros: string[];
  cons: string[];
  usSpecific: {
    secRegistered: boolean;
    sipcProtection: boolean;
    taxReporting: boolean;
    popularStates: string[];
  };
}

const topUSBrokers: Broker[] = [
  {
    id: 'interactive-brokers',
    name: 'Interactive Brokers',
    logo: '/images/brokers/interactive-brokers.png',
    rating: 4.8,
    reviewCount: 2847,
    minDeposit: '$0',
    spread: '0.1 pips',
    maxLeverage: '1:50',
    regulators: ['SEC', 'FINRA', 'CFTC'],
    keyFeatures: ['Low Costs', 'Global Markets', 'Advanced Platform'],
    website: 'https://www.interactivebrokers.com',
    pros: ['Extremely low fees', 'Access to global markets', 'Professional trading tools'],
    cons: ['Complex for beginners', 'Inactivity fees for small accounts'],
    usSpecific: {
      secRegistered: true,
      sipcProtection: true,
      taxReporting: true,
      popularStates: ['NY', 'CA', 'TX', 'FL']
    }
  },
  {
    id: 'charles-schwab',
    name: 'Charles Schwab',
    logo: '/images/brokers/charles-schwab.png',
    rating: 4.7,
    reviewCount: 1923,
    minDeposit: '$0',
    spread: '0.2 pips',
    maxLeverage: '1:50',
    regulators: ['SEC', 'FINRA'],
    keyFeatures: ['No Commission Stocks', 'Research Tools', 'Branch Network'],
    website: 'https://www.schwab.com',
    pros: ['Commission-free stock trades', 'Excellent research', 'Physical branches'],
    cons: ['Limited international markets', 'Higher forex spreads'],
    usSpecific: {
      secRegistered: true,
      sipcProtection: true,
      taxReporting: true,
      popularStates: ['CA', 'TX', 'NY', 'IL']
    }
  },
  {
    id: 'fidelity',
    name: 'Fidelity',
    logo: '/images/brokers/fidelity.png',
    rating: 4.6,
    reviewCount: 1756,
    minDeposit: '$0',
    spread: '0.2 pips',
    maxLeverage: '1:50',
    regulators: ['SEC', 'FINRA'],
    keyFeatures: ['Zero Fees', 'Mutual Funds', 'Retirement Planning'],
    website: 'https://www.fidelity.com',
    pros: ['No account minimums', 'Excellent mutual fund selection', 'Strong research'],
    cons: ['Limited international trading', 'Complex platform for beginners'],
    usSpecific: {
      secRegistered: true,
      sipcProtection: true,
      taxReporting: true,
      popularStates: ['MA', 'NY', 'CA', 'TX']
    }
  },
  {
    id: 'e-trade',
    name: 'E*TRADE',
    logo: '/images/brokers/e-trade.png',
    rating: 4.5,
    reviewCount: 1432,
    minDeposit: '$0',
    spread: '0.3 pips',
    maxLeverage: '1:50',
    regulators: ['SEC', 'FINRA'],
    keyFeatures: ['User-Friendly', 'Mobile Trading', 'Options Trading'],
    website: 'https://www.etrade.com',
    pros: ['Intuitive platform', 'Good mobile app', 'Strong options trading'],
    cons: ['Higher fees for some services', 'Limited research depth'],
    usSpecific: {
      secRegistered: true,
      sipcProtection: true,
      taxReporting: true,
      popularStates: ['CA', 'NY', 'TX', 'FL']
    }
  },
  {
    id: 'robinhood',
    name: 'Robinhood',
    logo: '/images/brokers/robinhood.png',
    rating: 4.2,
    reviewCount: 3241,
    minDeposit: '$0',
    spread: '0.4 pips',
    maxLeverage: '1:2',
    regulators: ['SEC', 'FINRA'],
    keyFeatures: ['Commission-Free', 'Mobile-First', 'Crypto Trading'],
    website: 'https://www.robinhood.com',
    pros: ['Zero commissions', 'Simple mobile interface', 'Fractional shares'],
    cons: ['Limited research tools', 'Customer service issues', 'Basic platform'],
    usSpecific: {
      secRegistered: true,
      sipcProtection: true,
      taxReporting: true,
      popularStates: ['CA', 'NY', 'TX', 'FL']
    }
  }
];

const UnitedStatesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Best Brokers for US Traders 2025 | USA Trading Platforms Review</title>
        <meta name="description" content="Discover the best brokers for US traders in 2025. Compare SEC-regulated platforms, SIPC protection, tax reporting, and trading features for American investors." />
        <meta name="keywords" content="US brokers 2025, American trading platforms, SEC regulated brokers, SIPC protection, US stock trading, forex brokers USA, best US brokers" />
        <link rel="canonical" href="https://brokeranalysis.com/countries/united-states" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Best Brokers for US Traders 2025 | USA Trading Platforms" />
        <meta property="og:description" content="Compare top SEC-regulated brokers for US traders. Find the best trading platforms with SIPC protection and comprehensive tax reporting." />
        <meta property="og:url" content="https://brokeranalysis.com/countries/united-states" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://brokeranalysis.com/images/us-brokers-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Brokers for US Traders 2025" />
        <meta name="twitter:description" content="Compare top SEC-regulated brokers for US traders in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/us-brokers-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Best Brokers for US Traders 2025",
            "description": "Comprehensive guide to the best SEC-regulated brokers for US traders in 2025",
            "url": "https://brokeranalysis.com/countries/united-states",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top US Brokers 2025",
              "itemListElement": topUSBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - SEC regulated broker with ${broker.rating} star rating`,
                  "url": broker.website,
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": broker.rating,
                    "reviewCount": broker.reviewCount
                  }
                }
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Best Brokers for US Traders 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Compare SEC-regulated brokers with SIPC protection and comprehensive tax reporting
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-blue-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  SEC Regulated
                </span>
                <span className="bg-blue-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  SIPC Protected
                </span>
                <span className="bg-blue-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Tax Reporting
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Overview */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">US Trading Regulations 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">SEC Oversight</h3>
                  <p className="text-gray-600">
                    All US brokers must be registered with the Securities and Exchange Commission (SEC) and comply with strict financial regulations.
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">SIPC Protection</h3>
                  <p className="text-gray-600">
                    Securities Investor Protection Corporation (SIPC) protects customer accounts up to $500,000 including $250,000 in cash.
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Tax Compliance</h3>
                  <p className="text-gray-600">
                    US brokers provide comprehensive tax reporting including 1099 forms and detailed transaction records for IRS compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Brokers */}
        <div className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Top US Brokers 2025</h2>
              <div className="space-y-6">
                {topUSBrokers.map((broker, index) => (
                  <div key={broker.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-blue-600">#{index + 1}</div>
                        <img src={broker.logo} alt={broker.name} className="w-16 h-16 object-contain" />
                        <div>
                          <h3 className="text-xl font-bold">{broker.name}</h3>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(broker.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">({broker.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 grid md:grid-cols-3 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">Min Deposit</div>
                          <div className="font-semibold">{broker.minDeposit}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Spread</div>
                          <div className="font-semibold">{broker.spread}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Max Leverage</div>
                          <div className="font-semibold">{broker.maxLeverage}</div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap gap-1">
                          {broker.regulators.map((regulator) => (
                            <span key={regulator} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {regulator}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {broker.usSpecific.sipcProtection && (
                            <span className="text-green-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> SIPC
                            </span>
                          )}
                          {broker.usSpecific.taxReporting && (
                            <span className="text-blue-600 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> Tax Reports
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-2">Pros</h4>
                          <ul className="text-sm space-y-1">
                            {broker.pros.map((pro, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-600 mb-2">Cons</h4>
                          <ul className="text-sm space-y-1">
                            {broker.cons.map((con, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">✗</span>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Popular Payment Methods in the US</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">ACH transfers, wire transfers</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Debit Cards</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard debit</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Check Deposits</h3>
                  <p className="text-sm text-gray-600">Mobile check deposit</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Digital Wallets</h3>
                  <p className="text-sm text-gray-600">PayPal, Apple Pay</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Considerations */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">US Tax Considerations for Traders</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Capital Gains Tax
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Short-term gains (&#60;1 year): Taxed as ordinary income</li>
                    <li>• Long-term gains (&#62;1 year): 0%, 15%, or 20% depending on income</li>
                    <li>• Tax-loss harvesting opportunities</li>
                    <li>• Wash sale rule considerations</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Trader Tax Status
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Mark-to-market election (Section 475)</li>
                    <li>• Business expense deductions</li>
                    <li>• Quarterly estimated tax payments</li>
                    <li>• Professional tax advice recommended</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trading Preferences */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">US Trading Preferences 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Most Popular Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>US Stocks</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>ETFs</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Options</span>
                      <span className="font-semibold">42%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Crypto</span>
                      <span className="font-semibold">38%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Trading Styles</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Buy &#38; Hold</span>
                      <span className="font-semibold">52%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Swing Trading</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Day Trading</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Scalping</span>
                      <span className="font-semibold">5%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Platform Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Mobile Apps</span>
                      <span className="font-semibold">71%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Web Platforms</span>
                      <span className="font-semibold">58%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Desktop Software</span>
                      <span className="font-semibold">34%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>API Trading</span>
                      <span className="font-semibold">12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnitedStatesPage;