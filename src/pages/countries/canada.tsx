import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Shield, DollarSign, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';

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
  canadaSpecific: {
    iiroc: boolean;
    cipf: boolean;
    provincialRegulation: string[];
    tfsa: boolean;
    rrsp: boolean;
  };
}

const topCanadaBrokers: Broker[] = [
  {
    id: 'questrade',
    name: 'Questrade',
    logo: '/images/brokers/questrade.png',
    rating: 4.5,
    reviewCount: 3247,
    minDeposit: 'C$1,000',
    spread: 'C$4.95-C$9.95',
    maxLeverage: '1:2',
    regulators: ['IIROC', 'CIPF'],
    keyFeatures: ['Self-Directed Trading', 'Low Fees', 'Research Tools'],
    website: 'https://www.questrade.com',
    pros: ['Low commission fees', 'Good platform', 'TFSA/RRSP support'],
    cons: ['Limited research', 'No physical branches'],
    canadaSpecific: {
      iiroc: true,
      cipf: true,
      provincialRegulation: ['Ontario', 'All Provinces'],
      tfsa: true,
      rrsp: true
    }
  },
  {
    id: 'interactive-brokers-canada',
    name: 'Interactive Brokers Canada',
    logo: '/images/brokers/interactive-brokers.png',
    rating: 4.4,
    reviewCount: 2156,
    minDeposit: 'C$0',
    spread: 'C$1.00',
    maxLeverage: '1:4',
    regulators: ['IIROC', 'CIPF'],
    keyFeatures: ['Global Markets', 'Advanced Tools', 'Low Costs'],
    website: 'https://www.interactivebrokers.ca',
    pros: ['Global market access', 'Professional tools', 'Low fees'],
    cons: ['Complex platform', 'Minimum activity fees'],
    canadaSpecific: {
      iiroc: true,
      cipf: true,
      provincialRegulation: ['All Provinces'],
      tfsa: true,
      rrsp: true
    }
  },
  {
    id: 'td-direct-investing',
    name: 'TD Direct Investing',
    logo: '/images/brokers/td-bank.png',
    rating: 4.3,
    reviewCount: 4521,
    minDeposit: 'C$0',
    spread: 'C$9.99',
    maxLeverage: '1:2',
    regulators: ['IIROC', 'CIPF'],
    keyFeatures: ['Branch Support', 'Research', 'Mobile Trading'],
    website: 'https://www.td.com/ca/en/investing',
    pros: ['Strong research', 'Branch network', 'Reliable platform'],
    cons: ['Higher fees', 'Limited international markets'],
    canadaSpecific: {
      iiroc: true,
      cipf: true,
      provincialRegulation: ['All Provinces'],
      tfsa: true,
      rrsp: true
    }
  },
  {
    id: 'wealthsimple-trade',
    name: 'Wealthsimple Trade',
    logo: '/images/brokers/wealthsimple.png',
    rating: 4.2,
    reviewCount: 5643,
    minDeposit: 'C$0',
    spread: 'C$0',
    maxLeverage: '1:1',
    regulators: ['IIROC', 'CIPF'],
    keyFeatures: ['Commission-Free', 'Mobile-First', 'Fractional Shares'],
    website: 'https://www.wealthsimple.com/trade',
    pros: ['Zero commissions', 'User-friendly app', 'Fractional shares'],
    cons: ['Limited research', 'Canadian stocks only'],
    canadaSpecific: {
      iiroc: true,
      cipf: true,
      provincialRegulation: ['All Provinces'],
      tfsa: true,
      rrsp: true
    }
  },
  {
    id: 'rbc-direct-investing',
    name: 'RBC Direct Investing',
    logo: '/images/brokers/rbc.png',
    rating: 4.1,
    reviewCount: 3892,
    minDeposit: 'C$0',
    spread: 'C$9.95',
    maxLeverage: '1:2',
    regulators: ['IIROC', 'CIPF'],
    keyFeatures: ['Full Service', 'Research', 'Advisory Services'],
    website: 'https://www.rbcdirectinvesting.com',
    pros: ['Comprehensive research', 'Advisory support', 'Strong platform'],
    cons: ['Higher fees', 'Complex fee structure'],
    canadaSpecific: {
      iiroc: true,
      cipf: true,
      provincialRegulation: ['All Provinces'],
      tfsa: true,
      rrsp: true
    }
  }
];

const CanadaPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Best Canadian Trading Platforms 2025 | IIROC Regulated Brokers</title>
        <meta name="description" content="Compare the best IIROC regulated brokers for Canadian traders in 2025. Find platforms with CIPF protection and TFSA/RRSP support." />
        <meta name="keywords" content="Canadian brokers 2025, IIROC regulated brokers, TFSA trading, RRSP investing, Canadian trading platforms, best brokers Canada" />
        <link rel="canonical" href="https://brokeranalysis.com/countries/canada" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Best Canadian Trading Platforms 2025 | IIROC Regulated" />
        <meta property="og:description" content="Compare top IIROC regulated brokers for Canadian traders. Find the best platforms with CIPF protection." />
        <meta property="og:url" content="https://brokeranalysis.com/countries/canada" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://brokeranalysis.com/images/canada-brokers-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Canadian Trading Platforms 2025" />
        <meta name="twitter:description" content="Compare top IIROC regulated brokers for Canadian traders in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/canada-brokers-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Best Canadian Trading Platforms 2025",
            "description": "Comprehensive guide to the best IIROC regulated brokers for Canadian traders in 2025",
            "url": "https://brokeranalysis.com/countries/canada",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top Canadian Brokers 2025",
              "itemListElement": topCanadaBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - IIROC regulated broker with ${broker.rating} star rating`,
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
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Best Canadian Trading Platforms 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-red-100">
                Compare IIROC regulated brokers with CIPF protection and tax-advantaged accounts
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  IIROC Regulated
                </span>
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  CIPF Protected
                </span>
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  TFSA/RRSP Support
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Overview */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Canadian Trading Regulations 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">IIROC Oversight</h3>
                  <p className="text-gray-600">
                    The Investment Industry Regulatory Organization of Canada (IIROC) regulates investment dealers and trading activity.
                  </p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <DollarSign className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">CIPF Protection</h3>
                  <p className="text-gray-600">
                    The Canadian Investor Protection Fund (CIPF) protects eligible customers up to C$1 million per account.
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Provincial Regulation</h3>
                  <p className="text-gray-600">
                    Provincial securities commissions provide additional oversight and investor protection measures.
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
              <h2 className="text-3xl font-bold text-center mb-8">Top Canadian Brokers 2025</h2>
              <div className="space-y-6">
                {topCanadaBrokers.map((broker, index) => (
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
                          {broker.canadaSpecific.tfsa && (
                            <span className="text-green-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> TFSA
                            </span>
                          )}
                          {broker.canadaSpecific.rrsp && (
                            <span className="text-blue-600 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> RRSP
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
              <h2 className="text-3xl font-bold text-center mb-8">Popular Payment Methods in Canada</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">EFT, Wire Transfer</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Interac e-Transfer</h3>
                  <p className="text-sm text-gray-600">Instant transfers</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Credit/Debit Cards</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Cheque</h3>
                  <p className="text-sm text-gray-600">Traditional method</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Considerations */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Canadian Tax Considerations for Traders</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Tax-Free Savings Account (TFSA)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Contribution room: C$6,500 (2023)</li>
                    <li>• Tax-free growth and withdrawals</li>
                    <li>• No withholding tax on Canadian dividends</li>
                    <li>• Ideal for long-term investing</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Registered Retirement Savings Plan (RRSP)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Tax deduction on contributions</li>
                    <li>• Tax-deferred growth</li>
                    <li>• Contribution limit: 18% of income</li>
                    <li>• Taxed on withdrawal</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Capital Gains Tax
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 50% of capital gains are taxable</li>
                    <li>• Taxed at marginal tax rate</li>
                    <li>• No capital gains in TFSA/RRSP</li>
                    <li>• Day trading may be business income</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Dividend Tax Credit
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Enhanced dividend tax credit</li>
                    <li>• Preferential treatment for Canadian dividends</li>
                    <li>• Gross-up and tax credit system</li>
                    <li>• Lower effective tax rate</li>
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
              <h2 className="text-3xl font-bold text-center mb-8">Canadian Trading Preferences 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Most Popular Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Canadian Stocks</span>
                      <span className="font-semibold">82%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>ETFs</span>
                      <span className="font-semibold">71%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>US Stocks</span>
                      <span className="font-semibold">48%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Bonds</span>
                      <span className="font-semibold">35%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Account Types</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>TFSA</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>RRSP</span>
                      <span className="font-semibold">54%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Non-Registered</span>
                      <span className="font-semibold">42%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>RESP</span>
                      <span className="font-semibold">18%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Investment Approach</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Buy &#38; Hold</span>
                      <span className="font-semibold">64%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Index Investing</span>
                      <span className="font-semibold">38%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Active Trading</span>
                      <span className="font-semibold">22%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Dividend Investing</span>
                      <span className="font-semibold">45%</span>
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

export default CanadaPage;