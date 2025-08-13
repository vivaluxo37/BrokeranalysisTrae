import React, { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { AlertCircle, BarChart3, Calculator, Clock, DollarSign, Target, TrendingUp, Zap } from 'lucide-react';

const UnderstandingForexSpreads: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState('EURUSD');
  const [tradeSize, setTradeSize] = useState(100000);
  const [spread, setSpread] = useState(1.2);

  const spreadExamples = {
    EURUSD: { typical: 0.8, peak: 2.5, description: 'Most liquid pair with tightest spreads' },
    GBPUSD: { typical: 1.2, peak: 3.0, description: 'Major pair with moderate spreads' },
    USDJPY: { typical: 0.9, peak: 2.8, description: 'Highly liquid Asian session pair' },
    AUDUSD: { typical: 1.5, peak: 4.0, description: 'Commodity currency with wider spreads' },
    EURGBP: { typical: 1.8, peak: 5.0, description: 'Cross pair with higher spreads' },
    EXOTIC: { typical: 15.0, peak: 50.0, description: 'Exotic pairs with very wide spreads' }
  };

  const calculateSpreadCost = () => {
    const pipValue = tradeSize / 10000;
    return (spread * pipValue).toFixed(2);
  };

  const spreadFactors = [
    {
      icon: Clock,
      title: 'Market Hours',
      description: 'Spreads are tightest during London-New York overlap (8 AM - 12 PM EST)',
      impact: 'High'
    },
    {
      icon: BarChart3,
      title: 'Volatility',
      description: 'Higher volatility leads to wider spreads as market makers increase risk premiums',
      impact: 'High'
    },
    {
      icon: DollarSign,
      title: 'Liquidity',
      description: 'More liquid pairs (majors) have tighter spreads than exotic pairs',
      impact: 'Very High'
    },
    {
      icon: Zap,
      title: 'News Events',
      description: 'Economic announcements can cause spreads to widen dramatically',
      impact: 'Medium'
    }
  ];

  const brokerTypes = [
    {
      type: 'Market Maker',
      spreads: 'Fixed or Variable',
      typical: '1-3 pips',
      pros: ['Guaranteed execution', 'No commission', 'Good for beginners'],
      cons: ['Potential conflicts of interest', 'Wider spreads', 'Possible requotes']
    },
    {
      type: 'ECN/STP',
      spreads: 'Variable (Raw)',
      typical: '0.1-1 pip + commission',
      pros: ['Tight spreads', 'No dealing desk', 'Transparent pricing'],
      cons: ['Commission fees', 'Variable costs', 'Minimum deposit requirements']
    }
  ];

  return (
    <>
      <Helmet>
        <title>Understanding Forex Spreads 2025: Complete Guide to Trading Costs</title>
        <meta name="description" content="Master forex spreads in 2025. Learn how spreads work, factors affecting spread costs, broker types, and strategies to minimize trading expenses." />
        <meta name="keywords" content="forex spreads 2025, trading costs, pip spreads, ECN vs market maker, forex trading expenses, spread comparison" />
        <link rel="canonical" href="https://brokeranalysis.com/education/understanding-forex-spreads" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Understanding Forex Spreads 2025: Complete Guide to Trading Costs" />
        <meta property="og:description" content="Master forex spreads in 2025. Learn how spreads work and minimize trading costs." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://brokeranalysis.com/education/understanding-forex-spreads" />
        <meta property="og:image" content="https://brokeranalysis.com/images/forex-spreads-guide-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Understanding Forex Spreads 2025: Complete Guide" />
        <meta name="twitter:description" content="Master forex spreads and minimize trading costs in 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/forex-spreads-guide-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Understanding Forex Spreads 2025: Complete Guide to Trading Costs",
            "description": "Master forex spreads in 2025. Learn how spreads work, factors affecting spread costs, and strategies to minimize trading expenses.",
            "author": {
              "@type": "Organization",
              "name": "BrokerAnalysis Expert Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "BrokerAnalysis",
              "logo": {
                "@type": "ImageObject",
                "url": "https://brokeranalysis.com/logo.png"
              }
            },
            "datePublished": "2025-01-15",
            "dateModified": "2025-01-15",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://brokeranalysis.com/education/understanding-forex-spreads"
            },
            "image": "https://brokeranalysis.com/images/forex-spreads-guide-2025.jpg"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Understanding Forex Spreads
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Master the fundamentals of forex trading costs in 2025
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">Beginner Friendly</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">2025 Updated</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">12 min read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* What is a Spread */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What is a Forex Spread?</h2>
            <p className="text-lg text-gray-700 mb-6">
              A forex spread is the difference between the bid price (what buyers are willing to pay) and the ask price (what sellers are asking for) of a currency pair. This difference represents the cost of trading and is how many brokers make their profit.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Example: EUR/USD Spread</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded border">
                  <div className="text-sm text-gray-600 mb-1">Bid Price (Sell)</div>
                  <div className="text-2xl font-bold text-red-600">1.0850</div>
                </div>
                <div className="bg-white p-4 rounded border">
                  <div className="text-sm text-gray-600 mb-1">Ask Price (Buy)</div>
                  <div className="text-2xl font-bold text-green-600">1.0852</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-100 rounded">
                <strong>Spread = 1.0852 - 1.0850 = 0.0002 = 2 pips</strong>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Key Points:</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You always buy at the ask price and sell at the bid price</li>
                <li>The spread is your immediate cost when entering a trade</li>
                <li>Spreads are typically measured in pips (percentage in points)</li>
                <li>Tighter spreads mean lower trading costs</li>
              </ul>
            </div>
          </div>

          {/* Interactive Spread Calculator */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Spread Cost Calculator</h2>
            <p className="text-gray-700 mb-6">
              Calculate how much spreads cost you per trade:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency Pair</label>
                <select 
                  value={selectedPair} 
                  onChange={(e) => setSelectedPair(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(spreadExamples).map(pair => (
                    <option key={pair} value={pair}>{pair}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trade Size (Units)</label>
                <input 
                  type="number" 
                  value={tradeSize} 
                  onChange={(e) => setTradeSize(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Spread (Pips)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={spread} 
                  onChange={(e) => setSpread(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Calculator className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Spread Cost</h3>
              </div>
              <div className="text-3xl font-bold">${calculateSpreadCost()}</div>
              <p className="text-blue-100 mt-2">Cost per {tradeSize.toLocaleString()} unit trade</p>
            </div>
          </div>

          {/* Typical Spreads by Pair */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Typical Spreads by Currency Pair (2025)</h2>
            <div className="grid gap-4">
              {Object.entries(spreadExamples).map(([pair, data]) => (
                <div key={pair} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{pair}</h3>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Typical: {data.typical} pips</div>
                      <div className="text-sm text-gray-600">Peak: {data.peak} pips</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{data.description}</p>
                  <div className="mt-3 bg-gray-100 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${Math.min((data.typical / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Factors Affecting Spreads */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Factors Affecting Spread Sizes</h2>
            <div className="grid gap-6">
              {spreadFactors.map((factor, index) => {
                const Icon = factor.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg">
                    <div className="p-3 rounded-lg bg-blue-100">
                      <Icon className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{factor.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          factor.impact === 'Very High' ? 'bg-red-100 text-red-800' :
                          factor.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {factor.impact} Impact
                        </span>
                      </div>
                      <p className="text-gray-700">{factor.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Broker Types and Spreads */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Broker Types and Their Spread Models</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {brokerTypes.map((broker, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{broker.type}</h3>
                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Spread Type: </span>
                      <span className="text-gray-900">{broker.spreads}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Typical Cost: </span>
                      <span className="text-gray-900">{broker.typical}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Pros:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {broker.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Cons:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                        {broker.cons.map((con, i) => <li key={i}>{con}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategies to Minimize Spread Costs */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Strategies to Minimize Spread Costs</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Trade During Peak Hours</h3>
                  <p className="text-gray-700">Focus on London-New York overlap (8 AM - 12 PM EST) when liquidity is highest and spreads are tightest.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Major Pairs</h3>
                  <p className="text-gray-700">Stick to major currency pairs (EUR/USD, GBP/USD, USD/JPY) which typically have the tightest spreads.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Avoid News Events</h3>
                  <p className="text-gray-700">Spreads widen significantly during major economic announcements. Plan your trades accordingly.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare Broker Spreads</h3>
                  <p className="text-gray-700">Different brokers offer different spreads. Shop around and consider ECN brokers for active trading.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Increase Trade Size</h3>
                  <p className="text-gray-700">Larger trades reduce the percentage impact of spreads on your overall position.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2025 Market Insights */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">2025 Forex Spread Trends</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">Technology Improvements</h3>
                <p className="text-blue-800">Advanced algorithms and better liquidity aggregation have led to tighter spreads across most major brokers in 2025.</p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <h3 className="font-semibold text-green-900 mb-2">Increased Competition</h3>
                <p className="text-green-800">More brokers entering the market has driven down spreads as companies compete for traders.</p>
              </div>
              
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                <h3 className="font-semibold text-yellow-900 mb-2">Regulatory Changes</h3>
                <p className="text-yellow-800">New regulations in major jurisdictions have improved transparency in spread pricing and execution.</p>
              </div>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Important Considerations</h3>
                <ul className="text-red-800 space-y-1">
                  <li>• Spreads can widen dramatically during market volatility</li>
                  <li>• Weekend gaps can result in much wider spreads on Monday open</li>
                  <li>• Some brokers may widen spreads during news events</li>
                  <li>• Always factor spread costs into your trading strategy</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Key Takeaways</h2>
            <div className="space-y-4 text-lg">
              <p>• Spreads are the primary cost of forex trading and directly impact your profitability</p>
              <p>• Major currency pairs typically offer the tightest spreads</p>
              <p>• Trading during peak market hours can significantly reduce spread costs</p>
              <p>• ECN brokers often provide tighter spreads but charge commissions</p>
              <p>• Always compare total trading costs, not just spreads, when choosing a broker</p>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <p className="text-center font-semibold">
                Understanding spreads is fundamental to successful forex trading. Use this knowledge to optimize your trading costs and improve your overall profitability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnderstandingForexSpreads;
