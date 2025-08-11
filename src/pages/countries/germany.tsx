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
  germanySpecific: {
    bafin: boolean;
    einlagensicherung: boolean;
    mifidII: boolean;
    esma: boolean;
  };
}

const topGermanyBrokers: Broker[] = [
  {
    id: 'trade-republic',
    name: 'Trade Republic',
    logo: '/images/brokers/trade-republic.png',
    rating: 4.6,
    reviewCount: 8247,
    minDeposit: '€1',
    spread: '€1.00',
    maxLeverage: '1:1',
    regulators: ['BaFin', 'Bundesbank'],
    keyFeatures: ['Commission-Free ETFs', 'Mobile Trading', 'Savings Plans'],
    website: 'https://traderepublic.com',
    pros: ['Very low fees', 'Great mobile app', 'ETF savings plans'],
    cons: ['Limited research', 'Mobile-only platform'],
    germanySpecific: {
      bafin: true,
      einlagensicherung: true,
      mifidII: true,
      esma: true
    }
  },
  {
    id: 'scalable-capital',
    name: 'Scalable Capital',
    logo: '/images/brokers/scalable-capital.png',
    rating: 4.5,
    reviewCount: 6543,
    minDeposit: '€0',
    spread: '€0.99',
    maxLeverage: '1:1',
    regulators: ['BaFin', 'Bundesbank'],
    keyFeatures: ['Robo-Advisor', 'ETF Trading', 'Prime Broker'],
    website: 'https://de.scalable.capital',
    pros: ['Automated investing', 'Low fees', 'Good ETF selection'],
    cons: ['Limited stock selection', 'No derivatives'],
    germanySpecific: {
      bafin: true,
      einlagensicherung: true,
      mifidII: true,
      esma: true
    }
  },
  {
    id: 'comdirect',
    name: 'comdirect',
    logo: '/images/brokers/comdirect.png',
    rating: 4.4,
    reviewCount: 12456,
    minDeposit: '€0',
    spread: '€4.90 + 0.25%',
    maxLeverage: '1:5',
    regulators: ['BaFin', 'Bundesbank'],
    keyFeatures: ['Full Service Bank', 'Research Tools', 'Derivatives'],
    website: 'https://www.comdirect.de',
    pros: ['Comprehensive platform', 'Good research', 'Full banking'],
    cons: ['Higher fees', 'Complex interface'],
    germanySpecific: {
      bafin: true,
      einlagensicherung: true,
      mifidII: true,
      esma: true
    }
  },
  {
    id: 'consorsbank',
    name: 'Consorsbank',
    logo: '/images/brokers/consorsbank.png',
    rating: 4.3,
    reviewCount: 9876,
    minDeposit: '€0',
    spread: '€4.95 + 0.25%',
    maxLeverage: '1:5',
    regulators: ['BaFin', 'Bundesbank'],
    keyFeatures: ['Active Trading', 'Research', 'Savings Plans'],
    website: 'https://www.consorsbank.de',
    pros: ['Professional tools', 'Good customer service', 'Wide product range'],
    cons: ['Higher fees for small trades', 'Complex fee structure'],
    germanySpecific: {
      bafin: true,
      einlagensicherung: true,
      mifidII: true,
      esma: true
    }
  },
  {
    id: 'ing-diba',
    name: 'ING',
    logo: '/images/brokers/ing.png',
    rating: 4.2,
    reviewCount: 15234,
    minDeposit: '€0',
    spread: '€4.90 + 0.25%',
    maxLeverage: '1:1',
    regulators: ['BaFin', 'Bundesbank'],
    keyFeatures: ['Direct Bank', 'ETF Savings', 'Simple Platform'],
    website: 'https://www.ing.de',
    pros: ['Simple interface', 'Good for beginners', 'Free ETF savings'],
    cons: ['Limited trading tools', 'No derivatives'],
    germanySpecific: {
      bafin: true,
      einlagensicherung: true,
      mifidII: true,
      esma: true
    }
  }
];

const GermanyPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>German Broker Comparison 2025 | BaFin Regulated Platforms</title>
        <meta name="description" content="Compare the best BaFin regulated brokers for German traders in 2025. Find platforms with Einlagensicherung protection and MiFID II compliance." />
        <meta name="keywords" content="German brokers 2025, BaFin regulated brokers, deutsche broker, ETF sparpläne, German trading platforms, best brokers Germany" />
        <link rel="canonical" href="https://brokeranalysis.com/countries/germany" />
        
        {/* Open Graph */}
        <meta property="og:title" content="German Broker Comparison 2025 | BaFin Regulated" />
        <meta property="og:description" content="Compare top BaFin regulated brokers for German traders. Find the best platforms with deposit protection." />
        <meta property="og:url" content="https://brokeranalysis.com/countries/germany" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://brokeranalysis.com/images/germany-brokers-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="German Broker Comparison 2025" />
        <meta name="twitter:description" content="Compare top BaFin regulated brokers for German traders in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/germany-brokers-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "German Broker Comparison 2025",
            "description": "Comprehensive guide to the best BaFin regulated brokers for German traders in 2025",
            "url": "https://brokeranalysis.com/countries/germany",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top German Brokers 2025",
              "itemListElement": topGermanyBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - BaFin regulated broker with ${broker.rating} star rating`,
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

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-gray-800 to-red-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                German Broker Comparison 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100">
                Compare BaFin regulated brokers with Einlagensicherung protection and MiFID II compliance
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  BaFin Regulated
                </span>
                <span className="bg-yellow-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Einlagensicherung
                </span>
                <span className="bg-gray-600 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  MiFID II Compliant
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Overview */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">German Financial Regulations 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">BaFin Oversight</h3>
                  <p className="text-gray-600">
                    The Federal Financial Supervisory Authority (BaFin) regulates all financial services in Germany.
                  </p>
                </div>
                <div className="text-center p-6 bg-yellow-50 rounded-lg">
                  <DollarSign className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Einlagensicherung</h3>
                  <p className="text-gray-600">
                    German deposit protection scheme protects deposits up to €100,000 per customer per bank.
                  </p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">MiFID II</h3>
                  <p className="text-gray-600">
                    Markets in Financial Instruments Directive provides enhanced investor protection and transparency.
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
              <h2 className="text-3xl font-bold text-center mb-8">Top German Brokers 2025</h2>
              <div className="space-y-6">
                {topGermanyBrokers.map((broker, index) => (
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
                          {broker.germanySpecific.mifidII && (
                            <span className="text-blue-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> MiFID II
                            </span>
                          )}
                          {broker.germanySpecific.einlagensicherung && (
                            <span className="text-green-600 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> Protected
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
              <h2 className="text-3xl font-bold text-center mb-8">Popular Payment Methods in Germany</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">SEPA Transfer</h3>
                  <p className="text-sm text-gray-600">Bank transfer</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Lastschrift</h3>
                  <p className="text-sm text-gray-600">Direct debit</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Credit Cards</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">PayPal</h3>
                  <p className="text-sm text-gray-600">Digital wallet</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Considerations */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">German Tax Considerations for Traders</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Abgeltungsteuer (Capital Gains Tax)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Flat rate: 25% + solidarity surcharge</li>
                    <li>• Automatic withholding by broker</li>
                    <li>• Annual allowance: €1,000 (single), €2,000 (married)</li>
                    <li>• Applies to dividends and capital gains</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Freistellungsauftrag
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Tax exemption order</li>
                    <li>• Up to €1,000 tax-free gains per year</li>
                    <li>• Must be set up with broker</li>
                    <li>• Can be split between multiple brokers</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Verlustverrechnung
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Loss offsetting within same asset class</li>
                    <li>• Stocks vs. derivatives separate</li>
                    <li>• Losses carried forward automatically</li>
                    <li>• Annual tax certificate provided</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Vorabpauschale
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Advance lump sum on ETFs</li>
                    <li>• Based on base interest rate</li>
                    <li>• Minimal impact in low interest environment</li>
                    <li>• Automatically calculated by broker</li>
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
              <h2 className="text-3xl font-bold text-center mb-8">German Trading Preferences 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Most Popular Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>ETFs</span>
                      <span className="font-semibold">78%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>German Stocks</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>US Stocks</span>
                      <span className="font-semibold">52%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Bonds</span>
                      <span className="font-semibold">38%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Trading Frequency</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Monthly</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Quarterly</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Weekly</span>
                      <span className="font-semibold">18%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Daily</span>
                      <span className="font-semibold">9%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Platform Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Mobile App</span>
                      <span className="font-semibold">72%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Web Platform</span>
                      <span className="font-semibold">58%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Desktop Software</span>
                      <span className="font-semibold">24%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Robo-Advisor</span>
                      <span className="font-semibold">31%</span>
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

export default GermanyPage;