import React from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
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
  japanSpecific: {
    fsa: boolean;
    jicpa: boolean;
    nisa: boolean;
    ideco: boolean;
  };
}

const topJapanBrokers: Broker[] = [
  {
    id: 'sbi-securities',
    name: 'SBI Securities',
    logo: '/images/brokers/sbi-securities.png',
    rating: 4.7,
    reviewCount: 12543,
    minDeposit: '¥0',
    spread: '¥99~',
    maxLeverage: '1:25',
    regulators: ['FSA', 'JSDA'],
    keyFeatures: ['NISA Support', 'Low Fees', 'IPO Access'],
    website: 'https://www.sbisec.co.jp',
    pros: ['Lowest fees in Japan', 'Excellent NISA support', 'Strong IPO allocation'],
    cons: ['Interface in Japanese only', 'Limited international stocks'],
    japanSpecific: {
      fsa: true,
      jicpa: true,
      nisa: true,
      ideco: true
    }
  },
  {
    id: 'rakuten-securities',
    name: 'Rakuten Securities',
    logo: '/images/brokers/rakuten-securities.png',
    rating: 4.6,
    reviewCount: 11234,
    minDeposit: '¥0',
    spread: '¥99~',
    maxLeverage: '1:25',
    regulators: ['FSA', 'JSDA'],
    keyFeatures: ['Rakuten Points', 'Mobile Trading', 'US Stocks'],
    website: 'https://www.rakuten-sec.co.jp',
    pros: ['Earn Rakuten points', 'Good mobile app', 'US stock access'],
    cons: ['Higher fees for some services', 'Complex point system'],
    japanSpecific: {
      fsa: true,
      jicpa: true,
      nisa: true,
      ideco: true
    }
  },
  {
    id: 'matsui-securities',
    name: 'Matsui Securities',
    logo: '/images/brokers/matsui-securities.png',
    rating: 4.5,
    reviewCount: 8765,
    minDeposit: '¥0',
    spread: '¥0 (up to ¥500k)',
    maxLeverage: '1:25',
    regulators: ['FSA', 'JSDA'],
    keyFeatures: ['Free Trading', 'Day Trading', 'Research Tools'],
    website: 'https://www.matsui.co.jp',
    pros: ['Free trading up to ¥500k', 'Good for day trading', 'Excellent research'],
    cons: ['Fees increase after ¥500k', 'Limited international markets'],
    japanSpecific: {
      fsa: true,
      jicpa: true,
      nisa: true,
      ideco: true
    }
  },
  {
    id: 'monex-securities',
    name: 'Monex Securities',
    logo: '/images/brokers/monex-securities.png',
    rating: 4.4,
    reviewCount: 7654,
    minDeposit: '¥0',
    spread: '¥99~',
    maxLeverage: '1:25',
    regulators: ['FSA', 'JSDA'],
    keyFeatures: ['Global Markets', 'Advanced Tools', 'Education'],
    website: 'https://www.monex.co.jp',
    pros: ['Strong international access', 'Professional tools', 'Good education'],
    cons: ['Higher fees', 'Complex platform'],
    japanSpecific: {
      fsa: true,
      jicpa: true,
      nisa: true,
      ideco: true
    }
  },
  {
    id: 'au-kabucom',
    name: 'au Kabucom Securities',
    logo: '/images/brokers/au-kabucom.png',
    rating: 4.3,
    reviewCount: 6543,
    minDeposit: '¥0',
    spread: '¥99~',
    maxLeverage: '1:25',
    regulators: ['FSA', 'JSDA'],
    keyFeatures: ['au Integration', 'Mobile Focus', 'Pont Rewards'],
    website: 'https://kabu.com',
    pros: ['au ecosystem integration', 'User-friendly mobile app', 'Pont rewards'],
    cons: ['Limited research', 'Fewer international options'],
    japanSpecific: {
      fsa: true,
      jicpa: true,
      nisa: true,
      ideco: true
    }
  }
];

const JapanPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Japanese Forex Brokers 2025 | FSA Regulated Platforms</title>
        <meta name="description" content="Compare the best FSA regulated brokers for Japanese traders in 2025. Find platforms with NISA and iDeCo support." />
        <meta name="keywords" content="Japan brokers 2025, FSA regulated brokers, Japanese trading platforms, NISA brokers, iDeCo investment, best brokers Japan" />
        <link rel="canonical" href="https://brokeranalysis.com/countries/japan" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Japanese Forex Brokers 2025 | FSA Regulated" />
        <meta property="og:description" content="Compare top FSA regulated brokers for Japanese traders. Find the best platforms with NISA support." />
        <meta property="og:url" content="https://brokeranalysis.com/countries/japan" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://brokeranalysis.com/images/japan-brokers-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Japanese Forex Brokers 2025" />
        <meta name="twitter:description" content="Compare top FSA regulated brokers for Japanese traders in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/japan-brokers-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Japanese Forex Brokers 2025",
            "description": "Comprehensive guide to the best FSA regulated brokers for Japanese traders in 2025",
            "url": "https://brokeranalysis.com/countries/japan",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top Japanese Brokers 2025",
              "itemListElement": topJapanBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - FSA regulated broker with ${broker.rating} star rating`,
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

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-white text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-red-800">
                Japanese Forex Brokers 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-red-700">
                Compare FSA regulated brokers with NISA and iDeCo support
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1 text-white">
                  <Shield className="w-4 h-4" />
                  FSA Regulated
                </span>
                <span className="bg-blue-500 px-3 py-1 rounded-full flex items-center gap-1 text-white">
                  <DollarSign className="w-4 h-4" />
                  NISA Support
                </span>
                <span className="bg-green-500 px-3 py-1 rounded-full flex items-center gap-1 text-white">
                  <TrendingUp className="w-4 h-4" />
                  iDeCo Compatible
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Overview */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Japanese Financial Regulations 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">FSA Oversight</h3>
                  <p className="text-gray-600">
                    The Financial Services Agency (FSA) regulates financial markets and ensures investor protection in Japan.
                  </p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">JSDA Membership</h3>
                  <p className="text-gray-600">
                    Japan Securities Dealers Association membership ensures compliance with industry standards and ethics.
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Investor Protection</h3>
                  <p className="text-gray-600">
                    Japan Investor Protection Fund protects customer assets up to ¥10 million per investor.
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
              <h2 className="text-3xl font-bold text-center mb-8">Top Japanese Brokers 2025</h2>
              <div className="space-y-6">
                {topJapanBrokers.map((broker, index) => (
                  <div key={broker.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-red-600">#{index + 1}</div>
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
                          <div className="text-sm text-gray-600">Commission</div>
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
                            <span key={regulator} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              {regulator}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {broker.japanSpecific.nisa && (
                            <span className="text-green-600 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> NISA
                            </span>
                          )}
                          {broker.japanSpecific.ideco && (
                            <span className="text-blue-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> iDeCo
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
              <h2 className="text-3xl font-bold text-center mb-8">Popular Payment Methods in Japan</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">Domestic wire</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Credit Cards</h3>
                  <p className="text-sm text-gray-600">JCB, Visa, Mastercard</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Convenience Store</h3>
                  <p className="text-sm text-gray-600">Konbini payment</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Digital Wallets</h3>
                  <p className="text-sm text-gray-600">PayPay, LINE Pay</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Considerations */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Japanese Tax Considerations for Traders</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    NISA (Nippon Individual Savings Account)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Tax-free investment account</li>
                    <li>• Annual limit: ¥1.2 million (2024+)</li>
                    <li>• Growth and dividend tax exemption</li>
                    <li>• Permanent tax-free holding</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Capital Gains Tax
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 20.315% flat rate (including surtax)</li>
                    <li>• Separate taxation system</li>
                    <li>• Loss carryforward up to 3 years</li>
                    <li>• Withholding tax on dividends</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    iDeCo (Individual Defined Contribution)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Tax-deductible contributions</li>
                    <li>• Tax-deferred growth</li>
                    <li>• Withdrawal at age 60+</li>
                    <li>• Annual limits vary by employment</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Forex Trading Tax
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 20.315% flat rate on profits</li>
                    <li>• Mark-to-market taxation</li>
                    <li>• Loss carryforward available</li>
                    <li>• Separate from stock taxation</li>
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
              <h2 className="text-3xl font-bold text-center mb-8">Japanese Trading Preferences 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Most Popular Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Japanese Stocks</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>US Stocks</span>
                      <span className="font-semibold">52%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Investment Trusts</span>
                      <span className="font-semibold">48%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>FX (Forex)</span>
                      <span className="font-semibold">35%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Account Types</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>NISA Account</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Regular Account</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>iDeCo Account</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>FX Account</span>
                      <span className="font-semibold">22%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Investment Approach</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Long-term Investing</span>
                      <span className="font-semibold">58%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Dollar-Cost Averaging</span>
                      <span className="font-semibold">42%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Swing Trading</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Day Trading</span>
                      <span className="font-semibold">18%</span>
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

export default JapanPage;