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
  singaporeSpecific: {
    mas: boolean;
    sdic: boolean;
    cmp: boolean;
    cpf: boolean;
  };
}

const topSingaporeBrokers: Broker[] = [
  {
    id: 'dbs-vickers',
    name: 'DBS Vickers',
    logo: '/images/brokers/dbs-vickers.png',
    rating: 4.6,
    reviewCount: 8765,
    minDeposit: 'S$1,000',
    spread: 'S$25 min',
    maxLeverage: '1:5',
    regulators: ['MAS', 'SGX'],
    keyFeatures: ['Local Bank', 'SGX Access', 'Research'],
    website: 'https://www.dbsvickers.com',
    pros: ['Strong local presence', 'Comprehensive research', 'SGX specialist'],
    cons: ['Higher fees', 'Limited global markets'],
    singaporeSpecific: {
      mas: true,
      sdic: true,
      cmp: true,
      cpf: true
    }
  },
  {
    id: 'ocbc-securities',
    name: 'OCBC Securities',
    logo: '/images/brokers/ocbc-securities.png',
    rating: 4.5,
    reviewCount: 7543,
    minDeposit: 'S$1,000',
    spread: 'S$25 min',
    maxLeverage: '1:5',
    regulators: ['MAS', 'SGX'],
    keyFeatures: ['Banking Integration', 'Mobile Trading', 'IPO Access'],
    website: 'https://www.ocbcsecurities.com',
    pros: ['Bank integration', 'Good mobile app', 'IPO participation'],
    cons: ['Average fees', 'Limited research'],
    singaporeSpecific: {
      mas: true,
      sdic: true,
      cmp: true,
      cpf: true
    }
  },
  {
    id: 'interactive-brokers-sg',
    name: 'Interactive Brokers Singapore',
    logo: '/images/brokers/interactive-brokers.png',
    rating: 4.4,
    reviewCount: 6789,
    minDeposit: 'S$0',
    spread: 'S$2.50 min',
    maxLeverage: '1:30',
    regulators: ['MAS', 'SEC'],
    keyFeatures: ['Global Markets', 'Low Costs', 'Professional Tools'],
    website: 'https://www.interactivebrokers.com.sg',
    pros: ['Very low fees', 'Global market access', 'Professional platform'],
    cons: ['Complex interface', 'No CPF investment'],
    singaporeSpecific: {
      mas: true,
      sdic: false,
      cmp: true,
      cpf: false
    }
  },
  {
    id: 'tiger-brokers',
    name: 'Tiger Brokers Singapore',
    logo: '/images/brokers/tiger-brokers.png',
    rating: 4.3,
    reviewCount: 5432,
    minDeposit: 'S$0',
    spread: 'S$1.99 min',
    maxLeverage: '1:10',
    regulators: ['MAS', 'SFC'],
    keyFeatures: ['Commission-Free ETFs', 'Fractional Shares', 'Mobile First'],
    website: 'https://www.tigerbrokers.com.sg',
    pros: ['Low fees', 'Fractional shares', 'Good mobile experience'],
    cons: ['Limited research', 'Newer platform'],
    singaporeSpecific: {
      mas: true,
      sdic: false,
      cmp: true,
      cpf: false
    }
  },
  {
    id: 'saxo-singapore',
    name: 'Saxo Markets Singapore',
    logo: '/images/brokers/saxo-bank.png',
    rating: 4.2,
    reviewCount: 4321,
    minDeposit: 'S$10,000',
    spread: 'S$5 + 0.08%',
    maxLeverage: '1:30',
    regulators: ['MAS', 'DFSA'],
    keyFeatures: ['Professional Platform', 'Global Markets', 'Research'],
    website: 'https://www.home.saxo/sg',
    pros: ['Professional tools', 'Excellent research', 'Global access'],
    cons: ['High minimum deposit', 'Complex platform'],
    singaporeSpecific: {
      mas: true,
      sdic: false,
      cmp: true,
      cpf: false
    }
  }
];

const SingaporePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Singapore Broker Reviews 2025 | MAS Regulated Platforms</title>
        <meta name="description" content="Compare the best MAS regulated brokers for Singapore traders in 2025. Find platforms with SGX access and SDIC protection." />
        <meta name="keywords" content="Singapore brokers 2025, MAS regulated brokers, SGX trading, Singapore trading platforms, best brokers Singapore, CPF investment" />
        <link rel="canonical" href="https://brokeranalysis.com/countries/singapore" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Singapore Broker Reviews 2025 | MAS Regulated" />
        <meta property="og:description" content="Compare top MAS regulated brokers for Singapore traders. Find the best platforms with SGX access." />
        <meta property="og:url" content="https://brokeranalysis.com/countries/singapore" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://brokeranalysis.com/images/singapore-brokers-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Singapore Broker Reviews 2025" />
        <meta name="twitter:description" content="Compare top MAS regulated brokers for Singapore traders in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/singapore-brokers-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Singapore Broker Reviews 2025",
            "description": "Comprehensive guide to the best MAS regulated brokers for Singapore traders in 2025",
            "url": "https://brokeranalysis.com/countries/singapore",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top Singapore Brokers 2025",
              "itemListElement": topSingaporeBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - MAS regulated broker with ${broker.rating} star rating`,
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
                Singapore Broker Reviews 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-red-700">
                Compare MAS regulated brokers with SGX access and SDIC protection
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1 text-white">
                  <Shield className="w-4 h-4" />
                  MAS Regulated
                </span>
                <span className="bg-accent-blue px-3 py-1 rounded-full flex items-center gap-1 text-white">
                  <DollarSign className="w-4 h-4" />
                  SDIC Protected
                </span>
                <span className="bg-accent-blue px-3 py-1 rounded-full flex items-center gap-1 text-white">
                  <TrendingUp className="w-4 h-4" />
                  SGX Access
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Overview */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Singapore Financial Regulations 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">MAS Oversight</h3>
                  <p className="text-gray-600">
                    The Monetary Authority of Singapore (MAS) regulates financial services and maintains monetary stability.
                  </p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <DollarSign className="w-12 h-12 text-accent-blue mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">SDIC Protection</h3>
                  <p className="text-gray-600">
                    Singapore Deposit Insurance Corporation protects deposits up to S$100,000 per depositor per bank.
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">SGX Trading</h3>
                  <p className="text-gray-600">
                    Singapore Exchange provides access to local and regional markets with strict listing requirements.
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
              <h2 className="text-3xl font-bold text-center mb-8">Top Singapore Brokers 2025</h2>
              <div className="space-y-6">
                {topSingaporeBrokers.map((broker, index) => (
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
                          {broker.singaporeSpecific.cpf && (
                            <span className="text-green-600 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> CPF
                            </span>
                          )}
                          {broker.singaporeSpecific.sdic && (
                            <span className="text-accent-blue flex items-center gap-1">
                              <Shield className="w-3 h-3" /> SDIC
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
                                <span className="text-accent-blue mt-1">✓</span>
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
                                <span className="text-accent-blue mt-1">✗</span>
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
              <h2 className="text-3xl font-bold text-center mb-8">Popular Payment Methods in Singapore</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-accent-blue mx-auto mb-2" />
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">FAST/MEPS</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Credit/Debit Cards</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">PayNow</h3>
                  <p className="text-sm text-gray-600">Instant transfer</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Digital Wallets</h3>
                  <p className="text-sm text-gray-600">GrabPay, PayLah!</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tax Considerations */}
        <div className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Singapore Tax Considerations for Traders</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Capital Gains Tax
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• No capital gains tax for investors</li>
                    <li>• Trading profits may be taxable as income</li>
                    <li>• Frequency and intention matter</li>
                    <li>• Professional traders taxed differently</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-accent-blue" />
                    Dividend Tax
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Singapore dividends: tax-exempt</li>
                    <li>• Foreign dividends: may be taxable</li>
                    <li>• Withholding tax varies by country</li>
                    <li>• Tax treaties may reduce rates</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    CPF Investment Scheme
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Use CPF Ordinary Account funds</li>
                    <li>• Approved instruments only</li>
                    <li>• 2.5% minimum interest guarantee</li>
                    <li>• Investment limits apply</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    SRS (Supplementary Retirement Scheme)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Tax deduction on contributions</li>
                    <li>• Investment growth tax-deferred</li>
                    <li>• Withdrawal restrictions apply</li>
                    <li>• 50% of withdrawals taxable at retirement</li>
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
              <h2 className="text-3xl font-bold text-center mb-8">Singapore Trading Preferences 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Most Popular Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>SGX Stocks</span>
                      <span className="font-semibold">72%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>REITs</span>
                      <span className="font-semibold">58%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>US Stocks</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>ETFs</span>
                      <span className="font-semibold">42%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Trading Frequency</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Monthly</span>
                      <span className="font-semibold">35%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Weekly</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Quarterly</span>
                      <span className="font-semibold">22%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Daily</span>
                      <span className="font-semibold">15%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Platform Preferences</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Mobile App</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Web Platform</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Desktop Software</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Robo-Advisor</span>
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

export default SingaporePage;
