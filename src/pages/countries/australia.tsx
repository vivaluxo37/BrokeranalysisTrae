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
  australiaSpecific: {
    asicRegulated: boolean;
    afslLicense: string;
    investorProtection: boolean;
    cfdRestrictions: boolean;
  };
}

const topAustraliaBrokers: Broker[] = [
  {
    id: 'commsec',
    name: 'CommSec',
    logo: '/images/brokers/commsec.png',
    rating: 4.6,
    reviewCount: 2847,
    minDeposit: 'A$500',
    spread: '0.08%',
    maxLeverage: '1:1',
    regulators: ['ASIC'],
    keyFeatures: ['ASX Trading', 'Research Tools', 'Mobile App'],
    website: 'https://www.commsec.com.au',
    pros: ['Strong research', 'ASX market leader', 'Comprehensive platform'],
    cons: ['Higher brokerage fees', 'Limited international markets'],
    australiaSpecific: {
      asicRegulated: true,
      afslLicense: '238814',
      investorProtection: true,
      cfdRestrictions: false
    }
  },
  {
    id: 'ig-australia',
    name: 'IG Australia',
    logo: '/images/brokers/ig.png',
    rating: 4.5,
    reviewCount: 1923,
    minDeposit: 'A$200',
    spread: '0.6 pips',
    maxLeverage: '1:30',
    regulators: ['ASIC'],
    keyFeatures: ['CFDs', 'Forex', 'Share Trading'],
    website: 'https://www.ig.com/au',
    pros: ['Comprehensive platform', 'Strong regulation', 'Good research'],
    cons: ['Higher spreads', 'Complex for beginners'],
    australiaSpecific: {
      asicRegulated: true,
      afslLicense: '515106',
      investorProtection: true,
      cfdRestrictions: true
    }
  },
  {
    id: 'selfwealth',
    name: 'SelfWealth',
    logo: '/images/brokers/selfwealth.png',
    rating: 4.4,
    reviewCount: 1654,
    minDeposit: 'A$0',
    spread: 'A$9.50 flat',
    maxLeverage: '1:1',
    regulators: ['ASIC'],
    keyFeatures: ['Flat Fee Trading', 'Social Trading', 'Portfolio Tracking'],
    website: 'https://www.selfwealth.com.au',
    pros: ['Flat fee structure', 'Social features', 'Good mobile app'],
    cons: ['Limited research', 'ASX only'],
    australiaSpecific: {
      asicRegulated: true,
      afslLicense: '421789',
      investorProtection: true,
      cfdRestrictions: false
    }
  },
  {
    id: 'cmc-markets-au',
    name: 'CMC Markets Australia',
    logo: '/images/brokers/cmc-markets.png',
    rating: 4.3,
    reviewCount: 1432,
    minDeposit: 'A$0',
    spread: '0.7 pips',
    maxLeverage: '1:30',
    regulators: ['ASIC'],
    keyFeatures: ['CFDs', 'Spread Betting', 'Share Trading'],
    website: 'https://www.cmcmarkets.com/en-au',
    pros: ['No minimum deposit', 'Good platform', 'Multiple asset classes'],
    cons: ['Higher spreads on some assets', 'Inactivity fees'],
    australiaSpecific: {
      asicRegulated: true,
      afslLicense: '238054',
      investorProtection: true,
      cfdRestrictions: true
    }
  },
  {
    id: 'stake',
    name: 'Stake',
    logo: '/images/brokers/stake.png',
    rating: 4.2,
    reviewCount: 2156,
    minDeposit: 'A$0',
    spread: 'US$0 - US$3',
    maxLeverage: '1:1',
    regulators: ['ASIC'],
    keyFeatures: ['US Stocks', 'Fractional Shares', 'Commission-Free'],
    website: 'https://hellostake.com',
    pros: ['Free US stock trading', 'Fractional shares', 'Modern app'],
    cons: ['Limited to US markets', 'FX conversion fees'],
    australiaSpecific: {
      asicRegulated: true,
      afslLicense: '527648',
      investorProtection: true,
      cfdRestrictions: false
    }
  }
];

const AustraliaPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Best Australian Brokers 2025 | ASIC Regulated Trading Platforms</title>
        <meta name="description" content="Compare the best ASIC regulated brokers for Australian traders in 2025. Find platforms with investor protection and competitive fees." />
        <meta name="keywords" content="Australian brokers 2025, ASIC regulated brokers, ASX trading, Australian trading platforms, best brokers Australia, AFSL license" />
        <link rel="canonical" href="https://brokeranalysis.com/countries/australia" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Best Australian Brokers 2025 | ASIC Regulated Platforms" />
        <meta property="og:description" content="Compare top ASIC regulated brokers for Australian traders. Find the best platforms with investor protection." />
        <meta property="og:url" content="https://brokeranalysis.com/countries/australia" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://brokeranalysis.com/images/australia-brokers-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Australian Brokers 2025" />
        <meta name="twitter:description" content="Compare top ASIC regulated brokers for Australian traders in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/australia-brokers-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Best Australian Brokers 2025",
            "description": "Comprehensive guide to the best ASIC regulated brokers for Australian traders in 2025",
            "url": "https://brokeranalysis.com/countries/australia",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top Australian Brokers 2025",
              "itemListElement": topAustraliaBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - ASIC regulated broker with ${broker.rating} star rating`,
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

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-yellow-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Best Australian Brokers 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                Compare ASIC regulated brokers with investor protection and competitive fees
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-green-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  ASIC Regulated
                </span>
                <span className="bg-green-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Investor Protection
                </span>
                <span className="bg-green-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  ASX Trading
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Overview */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Australian Trading Regulations 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">ASIC Oversight</h3>
                  <p className="text-gray-600">
                    The Australian Securities and Investments Commission (ASIC) regulates all financial services, ensuring market integrity and consumer protection.
                  </p>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <DollarSign className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AFSL Requirements</h3>
                  <p className="text-gray-600">
                    All brokers must hold an Australian Financial Services License (AFSL) to operate legally in Australia.
                  </p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <AlertTriangle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">CFD Restrictions</h3>
                  <p className="text-gray-600">
                    ASIC has implemented product intervention orders for CFDs, including leverage limits and negative balance protection.
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
              <h2 className="text-3xl font-bold text-center mb-8">Top Australian Brokers 2025</h2>
              <div className="space-y-6">
                {topAustraliaBrokers.map((broker, index) => (
                  <div key={broker.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-green-600">#{index + 1}</div>
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
                          <div className="text-sm text-gray-600">Fees</div>
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
                        <div className="text-xs text-gray-600">
                          AFSL: {broker.australiaSpecific.afslLicense}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {broker.australiaSpecific.investorProtection && (
                            <span className="text-green-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> Protected
                            </span>
                          )}
                          {broker.australiaSpecific.cfdRestrictions && (
                            <span className="text-orange-600 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> CFD Rules
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
              <h2 className="text-3xl font-bold text-center mb-8">Popular Payment Methods in Australia</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">BPAY, Direct Debit</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Credit/Debit Cards</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">POLi Payments</h3>
                  <p className="text-sm text-gray-600">Instant bank transfers</p>
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
              <h2 className="text-3xl font-bold text-center mb-8">Australian Tax Considerations for Traders</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Capital Gains Tax
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 50% CGT discount for assets held &#62; 12 months</li>
                    <li>• Full CGT rate for short-term trading</li>
                    <li>• Tax-free threshold: A$18,200 (2023-24)</li>
                    <li>• Marginal tax rates apply to gains</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Trading vs Investing
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Frequent trading may be considered business income</li>
                    <li>• Business income taxed at marginal rates</li>
                    <li>• No CGT discount for business income</li>
                    <li>• Seek professional tax advice</li>
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
              <h2 className="text-3xl font-bold text-center mb-8">Australian Trading Preferences 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Most Popular Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>ASX Stocks</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>ETFs</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>US Stocks</span>
                      <span className="font-semibold">52%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>CFDs</span>
                      <span className="font-semibold">28%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Trading Frequency</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Long-term (&#62;1 year)</span>
                      <span className="font-semibold">58%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Medium-term (3-12m)</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Short-term (&#60;3m)</span>
                      <span className="font-semibold">12%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Day Trading</span>
                      <span className="font-semibold">5%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Platform Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Mobile Apps</span>
                      <span className="font-semibold">72%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Web Platforms</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Desktop Software</span>
                      <span className="font-semibold">18%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>API Trading</span>
                      <span className="font-semibold">3%</span>
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

export default AustraliaPage;