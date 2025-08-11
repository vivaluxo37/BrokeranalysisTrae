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
  franceSpecific: {
    amf: boolean;
    fgdr: boolean;
    mifidII: boolean;
    pea: boolean;
  };
}

const topFranceBrokers: Broker[] = [
  {
    id: 'boursorama',
    name: 'Boursorama Banque',
    logo: '/images/brokers/boursorama.png',
    rating: 4.5,
    reviewCount: 9876,
    minDeposit: '€0',
    spread: '€1.99',
    maxLeverage: '1:5',
    regulators: ['AMF', 'ACPR'],
    keyFeatures: ['PEA Account', 'Free ETFs', 'Full Banking'],
    website: 'https://www.boursorama.com',
    pros: ['Very low fees', 'PEA available', 'Good mobile app'],
    cons: ['Limited research', 'French interface only'],
    franceSpecific: {
      amf: true,
      fgdr: true,
      mifidII: true,
      pea: true
    }
  },
  {
    id: 'degiro-france',
    name: 'DEGIRO France',
    logo: '/images/brokers/degiro.png',
    rating: 4.4,
    reviewCount: 7543,
    minDeposit: '€0',
    spread: '€2.00 + 0.03%',
    maxLeverage: '1:5',
    regulators: ['AMF', 'AFM'],
    keyFeatures: ['Low Costs', 'European Stocks', 'Professional Tools'],
    website: 'https://www.degiro.fr',
    pros: ['Very competitive fees', 'Wide market access', 'Professional platform'],
    cons: ['No PEA', 'Complex fee structure'],
    franceSpecific: {
      amf: true,
      fgdr: true,
      mifidII: true,
      pea: false
    }
  },
  {
    id: 'bforbank',
    name: 'BforBank',
    logo: '/images/brokers/bforbank.png',
    rating: 4.3,
    reviewCount: 5432,
    minDeposit: '€0',
    spread: '€3.00',
    maxLeverage: '1:5',
    regulators: ['AMF', 'ACPR'],
    keyFeatures: ['PEA-PME', 'Assurance Vie', 'Research Tools'],
    website: 'https://www.bforbank.com',
    pros: ['PEA and PEA-PME', 'Good research', 'Insurance products'],
    cons: ['Higher fees', 'Limited international markets'],
    franceSpecific: {
      amf: true,
      fgdr: true,
      mifidII: true,
      pea: true
    }
  },
  {
    id: 'fortuneo',
    name: 'Fortuneo',
    logo: '/images/brokers/fortuneo.png',
    rating: 4.2,
    reviewCount: 6789,
    minDeposit: '€0',
    spread: '€2.95',
    maxLeverage: '1:5',
    regulators: ['AMF', 'ACPR'],
    keyFeatures: ['PEA Account', 'SRD Trading', 'Banking Services'],
    website: 'https://www.fortuneo.fr',
    pros: ['PEA available', 'SRD trading', 'Good customer service'],
    cons: ['Average fees', 'Limited research tools'],
    franceSpecific: {
      amf: true,
      fgdr: true,
      mifidII: true,
      pea: true
    }
  },
  {
    id: 'saxo-france',
    name: 'Saxo Bank France',
    logo: '/images/brokers/saxo-bank.png',
    rating: 4.1,
    reviewCount: 4321,
    minDeposit: '€10,000',
    spread: '€5.00 + 0.05%',
    maxLeverage: '1:30',
    regulators: ['AMF', 'DFSA'],
    keyFeatures: ['Professional Platform', 'Global Markets', 'Research'],
    website: 'https://www.saxobank.fr',
    pros: ['Professional tools', 'Global market access', 'Excellent research'],
    cons: ['High minimum deposit', 'Complex platform'],
    franceSpecific: {
      amf: true,
      fgdr: false,
      mifidII: true,
      pea: false
    }
  }
];

const FrancePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>French Trading Brokers 2025 | AMF Regulated Platforms</title>
        <meta name="description" content="Compare the best AMF regulated brokers for French traders in 2025. Find platforms with PEA accounts and FGDR protection." />
        <meta name="keywords" content="French brokers 2025, AMF regulated brokers, courtiers français, PEA compte, French trading platforms, best brokers France" />
        <link rel="canonical" href="https://brokeranalysis.com/countries/france" />
        
        {/* Open Graph */}
        <meta property="og:title" content="French Trading Brokers 2025 | AMF Regulated" />
        <meta property="og:description" content="Compare top AMF regulated brokers for French traders. Find the best platforms with PEA accounts." />
        <meta property="og:url" content="https://brokeranalysis.com/countries/france" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://brokeranalysis.com/images/france-brokers-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="French Trading Brokers 2025" />
        <meta name="twitter:description" content="Compare top AMF regulated brokers for French traders in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/france-brokers-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "French Trading Brokers 2025",
            "description": "Comprehensive guide to the best AMF regulated brokers for French traders in 2025",
            "url": "https://brokeranalysis.com/countries/france",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top French Brokers 2025",
              "itemListElement": topFranceBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - AMF regulated broker with ${broker.rating} star rating`,
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-800 to-red-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                French Trading Brokers 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100">
                Compare AMF regulated brokers with PEA accounts and FGDR protection
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-blue-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  AMF Regulated
                </span>
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  FGDR Protected
                </span>
                <span className="bg-white text-blue-800 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  PEA Available
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Overview */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">French Financial Regulations 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AMF Oversight</h3>
                  <p className="text-gray-600">
                    The Autorité des Marchés Financiers (AMF) regulates financial markets and investment services in France.
                  </p>
                </div>
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <DollarSign className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">FGDR Protection</h3>
                  <p className="text-gray-600">
                    Fonds de Garantie des Dépôts et de Résolution protects deposits up to €100,000 per customer.
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">PEA Accounts</h3>
                  <p className="text-gray-600">
                    Plan d'Épargne en Actions offers tax advantages for long-term equity investments.
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
              <h2 className="text-3xl font-bold text-center mb-8">Top French Brokers 2025</h2>
              <div className="space-y-6">
                {topFranceBrokers.map((broker, index) => (
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
                            <span key={regulator} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {regulator}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {broker.franceSpecific.pea && (
                            <span className="text-green-600 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> PEA
                            </span>
                          )}
                          {broker.franceSpecific.fgdr && (
                            <span className="text-red-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> FGDR
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
              <h2 className="text-3xl font-bold text-center mb-8">Popular Payment Methods in France</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Virement SEPA</h3>
                  <p className="text-sm text-gray-600">Bank transfer</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Carte Bancaire</h3>
                  <p className="text-sm text-gray-600">Debit/Credit cards</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Prélèvement</h3>
                  <p className="text-sm text-gray-600">Direct debit</p>
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
              <h2 className="text-3xl font-bold text-center mb-8">French Tax Considerations for Traders</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    PEA (Plan d'Épargne en Actions)
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Tax-free after 5 years</li>
                    <li>• Annual limit: €150,000</li>
                    <li>• EU stocks and ETFs only</li>
                    <li>• Withdrawal restrictions before 5 years</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-600" />
                    Compte-Titres Ordinaire
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 30% flat tax (PFU) on gains</li>
                    <li>• Alternative: progressive income tax + 17.2% social charges</li>
                    <li>• No investment limits</li>
                    <li>• Global market access</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Assurance Vie
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Tax advantages after 8 years</li>
                    <li>• Annual allowance: €4,600 (single), €9,200 (couple)</li>
                    <li>• Succession planning benefits</li>
                    <li>• Limited investment options</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    PEA-PME
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Small and medium enterprises focus</li>
                    <li>• Annual limit: €225,000</li>
                    <li>• Tax-free after 5 years</li>
                    <li>• Can be combined with regular PEA</li>
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
              <h2 className="text-3xl font-bold text-center mb-8">French Trading Preferences 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Most Popular Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>French Stocks</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>ETFs</span>
                      <span className="font-semibold">62%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>European Stocks</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Assurance Vie</span>
                      <span className="font-semibold">58%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Account Types</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>PEA</span>
                      <span className="font-semibold">52%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Compte-Titres</span>
                      <span className="font-semibold">38%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Assurance Vie</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>PEA-PME</span>
                      <span className="font-semibold">15%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Investment Approach</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Long-term</span>
                      <span className="font-semibold">65%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Medium-term</span>
                      <span className="font-semibold">25%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Day Trading</span>
                      <span className="font-semibold">8%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Robo-Advisor</span>
                      <span className="font-semibold">22%</span>
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

export default FrancePage;