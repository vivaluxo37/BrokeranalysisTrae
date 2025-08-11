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
  ukSpecific: {
    fcaRegulated: boolean;
    fscsProtection: boolean;
    isaSuitability: boolean;
    spreadBettingAvailable: boolean;
  };
}

const topUKBrokers: Broker[] = [
  {
    id: 'hargreaves-lansdown',
    name: 'Hargreaves Lansdown',
    logo: '/images/brokers/hargreaves-lansdown.png',
    rating: 4.7,
    reviewCount: 2156,
    minDeposit: '£0',
    spread: '0.2 pips',
    maxLeverage: '1:30',
    regulators: ['FCA'],
    keyFeatures: ['ISA Accounts', 'Research Tools', 'Fund Supermarket'],
    website: 'https://www.hl.co.uk',
    pros: ['Excellent research', 'Wide fund selection', 'Strong reputation'],
    cons: ['Higher fees', 'Limited international markets'],
    ukSpecific: {
      fcaRegulated: true,
      fscsProtection: true,
      isaSuitability: true,
      spreadBettingAvailable: false
    }
  },
  {
    id: 'interactive-investor',
    name: 'Interactive Investor',
    logo: '/images/brokers/interactive-investor.png',
    rating: 4.6,
    reviewCount: 1834,
    minDeposit: '£0',
    spread: '0.2 pips',
    maxLeverage: '1:30',
    regulators: ['FCA'],
    keyFeatures: ['Fixed Monthly Fee', 'ISA &#38; SIPP', 'Regular Investing'],
    website: 'https://www.ii.co.uk',
    pros: ['Flat fee structure', 'Good for regular investors', 'ISA and SIPP options'],
    cons: ['Monthly fee regardless of activity', 'Limited research'],
    ukSpecific: {
      fcaRegulated: true,
      fscsProtection: true,
      isaSuitability: true,
      spreadBettingAvailable: false
    }
  },
  {
    id: 'trading-212',
    name: 'Trading 212',
    logo: '/images/brokers/trading-212.png',
    rating: 4.5,
    reviewCount: 3247,
    minDeposit: '£1',
    spread: '0.1 pips',
    maxLeverage: '1:30',
    regulators: ['FCA'],
    keyFeatures: ['Commission-Free', 'Fractional Shares', 'AutoInvest'],
    website: 'https://www.trading212.com',
    pros: ['Zero commission trading', 'User-friendly app', 'Fractional shares'],
    cons: ['Limited research tools', 'No phone support'],
    ukSpecific: {
      fcaRegulated: true,
      fscsProtection: true,
      isaSuitability: true,
      spreadBettingAvailable: false
    }
  },
  {
    id: 'ig',
    name: 'IG Group',
    logo: '/images/brokers/ig.png',
    rating: 4.4,
    reviewCount: 2891,
    minDeposit: '£0',
    spread: '0.6 pips',
    maxLeverage: '1:30',
    regulators: ['FCA'],
    keyFeatures: ['Spread Betting', 'CFDs', 'Share Dealing'],
    website: 'https://www.ig.com',
    pros: ['Comprehensive platform', 'Spread betting available', 'Strong research'],
    cons: ['Higher spreads on some assets', 'Complex for beginners'],
    ukSpecific: {
      fcaRegulated: true,
      fscsProtection: true,
      isaSuitability: true,
      spreadBettingAvailable: true
    }
  },
  {
    id: 'freetrade',
    name: 'Freetrade',
    logo: '/images/brokers/freetrade.png',
    rating: 4.3,
    reviewCount: 1567,
    minDeposit: '£2',
    spread: '0.45%',
    maxLeverage: '1:1',
    regulators: ['FCA'],
    keyFeatures: ['Commission-Free UK', 'ISA Available', 'Mobile-First'],
    website: 'https://freetrade.io',
    pros: ['Free UK stock trades', 'Simple mobile app', 'ISA accounts'],
    cons: ['Limited international stocks', 'Basic research tools'],
    ukSpecific: {
      fcaRegulated: true,
      fscsProtection: true,
      isaSuitability: true,
      spreadBettingAvailable: false
    }
  }
];

const UnitedKingdomPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Best UK Brokers 2025 | FCA Regulated Trading Platforms Review</title>
        <meta name="description" content="Compare the best FCA regulated brokers for UK traders in 2025. Find platforms with FSCS protection, ISA accounts, and spread betting options." />
        <meta name="keywords" content="UK brokers 2025, FCA regulated brokers, British trading platforms, FSCS protection, ISA trading, spread betting UK, best UK brokers" />
        <link rel="canonical" href="https://brokeranalysis.com/countries/united-kingdom" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Best UK Brokers 2025 | FCA Regulated Trading Platforms" />
        <meta property="og:description" content="Compare top FCA regulated brokers for UK traders. Find the best platforms with FSCS protection and ISA account options." />
        <meta property="og:url" content="https://brokeranalysis.com/countries/united-kingdom" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://brokeranalysis.com/images/uk-brokers-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best UK Brokers 2025" />
        <meta name="twitter:description" content="Compare top FCA regulated brokers for UK traders in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/uk-brokers-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Best UK Brokers 2025",
            "description": "Comprehensive guide to the best FCA regulated brokers for UK traders in 2025",
            "url": "https://brokeranalysis.com/countries/united-kingdom",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Top UK Brokers 2025",
              "itemListElement": topUKBrokers.map((broker, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "FinancialService",
                  "name": broker.name,
                  "description": `${broker.name} - FCA regulated broker with ${broker.rating} star rating`,
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

      <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-100">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-red-600 to-blue-700 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Best UK Brokers 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-red-100">
                Compare FCA regulated brokers with FSCS protection and ISA account options
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  FCA Regulated
                </span>
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  FSCS Protected
                </span>
                <span className="bg-red-500 px-3 py-1 rounded-full flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  ISA Accounts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Overview */}
        <div className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">UK Trading Regulations 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <Shield className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">FCA Oversight</h3>
                  <p className="text-gray-600">
                    The Financial Conduct Authority (FCA) regulates all UK brokers, ensuring consumer protection and market integrity.
                  </p>
                </div>
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <DollarSign className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">FSCS Protection</h3>
                  <p className="text-gray-600">
                    Financial Services Compensation Scheme (FSCS) protects eligible deposits up to £85,000 per person, per firm.
                  </p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">ISA Benefits</h3>
                  <p className="text-gray-600">
                    Stocks &#38; Shares ISAs allow tax-free investing up to £20,000 per year, with no capital gains or dividend tax.
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
              <h2 className="text-3xl font-bold text-center mb-8">Top UK Brokers 2025</h2>
              <div className="space-y-6">
                {topUKBrokers.map((broker, index) => (
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
                          {broker.ukSpecific.fscsProtection && (
                            <span className="text-green-600 flex items-center gap-1">
                              <Shield className="w-3 h-3" /> FSCS
                            </span>
                          )}
                          {broker.ukSpecific.isaSuitability && (
                            <span className="text-blue-600 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" /> ISA
                            </span>
                          )}
                          {broker.ukSpecific.spreadBettingAvailable && (
                            <span className="text-purple-600 flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Spread Betting
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
              <h2 className="text-3xl font-bold text-center mb-8">Popular Payment Methods in the UK</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-sm text-gray-600">Faster Payments, BACS</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Debit Cards</h3>
                  <p className="text-sm text-gray-600">Visa, Mastercard debit</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Direct Debit</h3>
                  <p className="text-sm text-gray-600">Regular investing</p>
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
              <h2 className="text-3xl font-bold text-center mb-8">UK Tax Considerations for Traders</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    Capital Gains Tax
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Annual CGT allowance: £6,000 (2023/24)</li>
                    <li>• Basic rate: 10% on gains above allowance</li>
                    <li>• Higher rate: 20% on gains above allowance</li>
                    <li>• ISA investments are CGT-free</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Spread Betting
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Generally tax-free for most traders</li>
                    <li>• No stamp duty on UK shares</li>
                    <li>• Cannot be held in ISA accounts</li>
                    <li>• Professional traders may face income tax</li>
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
              <h2 className="text-3xl font-bold text-center mb-8">UK Trading Preferences 2025</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Most Popular Assets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>UK Stocks</span>
                      <span className="font-semibold">72%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Funds &#38; ETFs</span>
                      <span className="font-semibold">68%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>US Stocks</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Spread Betting</span>
                      <span className="font-semibold">32%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Account Types</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Stocks &#38; Shares ISA</span>
                      <span className="font-semibold">58%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>General Investment</span>
                      <span className="font-semibold">42%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>SIPP</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Junior ISA</span>
                      <span className="font-semibold">15%</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-4">Investment Approach</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Long-term Investing</span>
                      <span className="font-semibold">64%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Regular Investing</span>
                      <span className="font-semibold">48%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Active Trading</span>
                      <span className="font-semibold">22%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span>Day Trading</span>
                      <span className="font-semibold">8%</span>
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

export default UnitedKingdomPage;