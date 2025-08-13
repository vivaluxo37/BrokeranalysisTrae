import React, { useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { AlertTriangle, BarChart3, Calculator, DollarSign, Shield, Target, TrendingUp, Zap } from 'lucide-react';

const CFDTradingGuide2025: React.FC = () => {
  const [leverage, setLeverage] = useState(10);
  const [investment, setInvestment] = useState(1000);
  const [priceChange, setPriceChange] = useState(5);

  const cfdTypes = [
    {
      type: 'Stock CFDs',
      description: 'Trade shares without owning the underlying stock',
      leverage: '1:5 to 1:20',
      examples: ['Apple', 'Tesla', 'Amazon', 'Microsoft'],
      pros: ['No stamp duty', 'Short selling', 'Fractional shares'],
      cons: ['Overnight fees', 'No voting rights', 'No dividends']
    },
    {
      type: 'Index CFDs',
      description: 'Trade market indices like S&P 500, FTSE 100',
      leverage: '1:10 to 1:100',
      examples: ['S&P 500', 'NASDAQ', 'FTSE 100', 'DAX'],
      pros: ['Diversification', 'Lower costs', '24/5 trading'],
      cons: ['Complex pricing', 'Tracking errors', 'Rollover costs']
    },
    {
      type: 'Commodity CFDs',
      description: 'Trade gold, oil, agricultural products',
      leverage: '1:10 to 1:50',
      examples: ['Gold', 'Crude Oil', 'Silver', 'Natural Gas'],
      pros: ['Inflation hedge', 'Portfolio diversification', 'No storage costs'],
      cons: ['High volatility', 'Contango effects', 'Storage costs built-in']
    },
    {
      type: 'Forex CFDs',
      description: 'Currency pair trading with leverage',
      leverage: '1:30 to 1:500',
      examples: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'],
      pros: ['High liquidity', 'Tight spreads', '24/5 trading'],
      cons: ['Currency risk', 'Swap fees', 'High leverage risk']
    },
    {
      type: 'Crypto CFDs',
      description: 'Trade cryptocurrency without owning coins',
      leverage: '1:2 to 1:10',
      examples: ['Bitcoin', 'Ethereum', 'Litecoin', 'Ripple'],
      pros: ['No wallet needed', 'Short selling', 'Regulated trading'],
      cons: ['High volatility', 'Weekend gaps', 'Funding costs']
    }
  ];

  const riskFactors = [
    {
      icon: AlertTriangle,
      title: 'Leverage Risk',
      description: 'High leverage amplifies both profits and losses',
      severity: 'High',
      mitigation: 'Use appropriate position sizing and stop losses'
    },
    {
      icon: DollarSign,
      title: 'Overnight Financing',
      description: 'Holding positions overnight incurs financing costs',
      severity: 'Medium',
      mitigation: 'Consider holding periods and financing rates'
    },
    {
      icon: BarChart3,
      title: 'Market Volatility',
      description: 'Sudden price movements can trigger margin calls',
      severity: 'High',
      mitigation: 'Monitor positions closely and use risk management'
    },
    {
      icon: Zap,
      title: 'Slippage',
      description: 'Execution prices may differ from expected prices',
      severity: 'Medium',
      mitigation: 'Use limit orders and trade during liquid hours'
    }
  ];

  const calculateProfitLoss = () => {
    const totalExposure = investment * leverage;
    const profitLoss = (totalExposure * priceChange) / 100;
    const roi = (profitLoss / investment) * 100;
    return { profitLoss: profitLoss.toFixed(2), roi: roi.toFixed(2), exposure: totalExposure.toFixed(2) };
  };

  const result = calculateProfitLoss();

  return (
    <>
      <Helmet>
        <title>CFD Trading Guide 2025: Complete Beginner's Guide to Contract for Difference</title>
        <meta name="description" content="Master CFD trading in 2025. Learn what CFDs are, how they work, types of CFDs, risks, strategies, and how to choose the best CFD broker." />
        <meta name="keywords" content="CFD trading 2025, contract for difference, CFD guide, CFD brokers, leverage trading, CFD risks, CFD strategies" />
        <link rel="canonical" href="https://brokeranalysis.com/education/cfd-trading-guide-2025" />
        
        {/* Open Graph */}
        <meta property="og:title" content="CFD Trading Guide 2025: Complete Beginner's Guide" />
        <meta property="og:description" content="Master CFD trading in 2025. Learn what CFDs are, risks, and strategies." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://brokeranalysis.com/education/cfd-trading-guide-2025" />
        <meta property="og:image" content="https://brokeranalysis.com/images/cfd-trading-guide-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CFD Trading Guide 2025: Complete Beginner's Guide" />
        <meta name="twitter:description" content="Master CFD trading in 2025. Learn what CFDs are, risks, and strategies." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/cfd-trading-guide-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "CFD Trading Guide 2025: Complete Beginner's Guide to Contract for Difference",
            "description": "Master CFD trading in 2025. Learn what CFDs are, how they work, types of CFDs, risks, and strategies.",
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
              "@id": "https://brokeranalysis.com/education/cfd-trading-guide-2025"
            },
            "image": "https://brokeranalysis.com/images/cfd-trading-guide-2025.jpg"
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                CFD Trading Guide 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8">
                Master Contract for Difference trading with our comprehensive guide
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">Comprehensive Guide</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">2025 Updated</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">18 min read</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* What are CFDs */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What are CFDs (Contracts for Difference)?</h2>
            <p className="text-lg text-gray-700 mb-6">
              A Contract for Difference (CFD) is a financial derivative that allows you to trade on the price movements of underlying assets without actually owning them. When you trade CFDs, you're entering into a contract with your broker to exchange the difference in price of an asset from when you open the position to when you close it.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">How CFDs Work: Simple Example</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-semibold mb-2">Scenario: Apple Stock CFD</h4>
                  <ul className="text-gray-700 space-y-1">
                    <li>• Apple stock price: $150</li>
                    <li>• You buy 100 CFDs (equivalent to 100 shares)</li>
                    <li>• Stock rises to $160</li>
                    <li>• Profit: (160 - 150) × 100 = $1,000</li>
                  </ul>
                </div>
                <div className="bg-green-100 p-3 rounded">
                  <strong>Key Point:</strong> You profit from the price difference without owning the actual Apple shares.
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Advantages of CFDs</h4>
                <ul className="list-disc list-inside text-green-800 space-y-2">
                  <li>Leverage amplifies potential profits</li>
                  <li>Can profit from falling prices (short selling)</li>
                  <li>Access to global markets</li>
                  <li>No stamp duty on most CFDs</li>
                  <li>Fractional trading possible</li>
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-3">Disadvantages of CFDs</h4>
                <ul className="list-disc list-inside text-red-800 space-y-2">
                  <li>Leverage amplifies potential losses</li>
                  <li>Overnight financing costs</li>
                  <li>No ownership rights</li>
                  <li>Counterparty risk with broker</li>
                  <li>Complex pricing structure</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CFD Calculator */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">CFD Profit/Loss Calculator</h2>
            <p className="text-gray-700 mb-6">
              See how leverage affects your potential profits and losses:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($)</label>
                <input 
                  type="number" 
                  value={investment} 
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leverage (1:X)</label>
                <select 
                  value={leverage} 
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>1:1 (No Leverage)</option>
                  <option value={2}>1:2</option>
                  <option value={5}>1:5</option>
                  <option value={10}>1:10</option>
                  <option value={20}>1:20</option>
                  <option value={50}>1:50</option>
                  <option value={100}>1:100</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Change (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={priceChange} 
                  onChange={(e) => setPriceChange(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-100 p-4 rounded-lg text-center">
                <div className="text-sm text-accent-blue mb-1">Total Exposure</div>
                <div className="text-2xl font-bold text-blue-800">${result.exposure}</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                parseFloat(result.profitLoss) >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className={`text-sm mb-1 ${
                  parseFloat(result.profitLoss) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>Profit/Loss</div>
                <div className={`text-2xl font-bold ${
                  parseFloat(result.profitLoss) >= 0 ? 'text-green-800' : 'text-red-800'
                }`}>${result.profitLoss}</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                parseFloat(result.roi) >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className={`text-sm mb-1 ${
                  parseFloat(result.roi) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>ROI</div>
                <div className={`text-2xl font-bold ${
                  parseFloat(result.roi) >= 0 ? 'text-green-800' : 'text-red-800'
                }`}>{result.roi}%</div>
              </div>
            </div>
          </div>

          {/* Types of CFDs */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Types of CFDs Available in 2025</h2>
            <div className="space-y-6">
              {cfdTypes.map((cfd, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{cfd.type}</h3>
                      <p className="text-gray-700 mb-2">{cfd.description}</p>
                      <div className="text-sm text-accent-blue">Typical Leverage: {cfd.leverage}</div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Examples:</h4>
                      <div className="flex flex-wrap gap-2">
                        {cfd.examples.map((example, i) => (
                          <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Pros:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {cfd.pros.map((pro, i) => <li key={i}>• {pro}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-red-700 mb-2">Cons:</h4>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {cfd.cons.map((con, i) => <li key={i}>• {con}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Risk Factors in CFD Trading</h2>
            <div className="grid gap-6">
              {riskFactors.map((risk, index) => {
                const Icon = risk.icon;
                return (
                  <div key={index} className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg">
                    <div className="p-3 rounded-lg bg-red-100">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{risk.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          risk.severity === 'High' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {risk.severity} Risk
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{risk.description}</p>
                      <div className="bg-blue-50 p-3 rounded">
                        <strong className="text-blue-900">Mitigation: </strong>
                        <span className="text-blue-800">{risk.mitigation}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CFD Trading Strategies */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular CFD Trading Strategies</h2>
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Day Trading</h3>
                <p className="text-gray-700 mb-3">
                  Opening and closing positions within the same trading day to avoid overnight financing costs.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Best For:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Volatile markets</li>
                      <li>• High liquidity instruments</li>
                      <li>• Experienced traders</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Key Requirements:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Fast execution platform</li>
                      <li>• Real-time market data</li>
                      <li>• Strict risk management</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Swing Trading</h3>
                <p className="text-gray-700 mb-3">
                  Holding positions for several days to weeks to capture medium-term price movements.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Best For:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Trending markets</li>
                      <li>• Part-time traders</li>
                      <li>• Technical analysis fans</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Considerations:</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Overnight financing costs</li>
                      <li>• Weekend gap risk</li>
                      <li>• Longer-term analysis needed</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Hedging</h3>
                <p className="text-gray-700 mb-3">
                  Using CFDs to hedge existing investment portfolios against adverse price movements.
                </p>
                <div className="bg-yellow-50 p-4 rounded">
                  <strong className="text-yellow-900">Example: </strong>
                  <span className="text-yellow-800">
                    If you own Apple shares, you could short Apple CFDs to protect against a potential decline.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Choosing a CFD Broker */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">How to Choose a CFD Broker in 2025</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-accent-blue mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Regulation & Safety</h3>
                  <p className="text-gray-700">Ensure the broker is regulated by reputable authorities like FCA, CySEC, or ASIC. Check for investor compensation schemes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <DollarSign className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Trading Costs</h3>
                  <p className="text-gray-700">Compare spreads, commissions, and overnight financing rates. Consider the total cost of trading your preferred instruments.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <BarChart3 className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Quality</h3>
                  <p className="text-gray-700">Test the trading platform for speed, reliability, and features. Ensure it offers the tools you need for analysis and risk management.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Target className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Asset Coverage</h3>
                  <p className="text-gray-700">Verify the broker offers CFDs on the markets you want to trade. Check for any restrictions on your preferred instruments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2025 Market Developments */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">CFD Market Developments in 2025</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                <h3 className="font-semibold text-blue-900 mb-2">Enhanced Regulation</h3>
                <p className="text-blue-800">Stricter regulations have improved investor protection, with better disclosure of risks and costs.</p>
              </div>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <h3 className="font-semibold text-green-900 mb-2">Technology Improvements</h3>
                <p className="text-green-800">AI-powered risk management tools and faster execution speeds have enhanced the trading experience.</p>
              </div>
              
              <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded">
                <h3 className="font-semibold text-purple-900 mb-2">New Asset Classes</h3>
                <p className="text-purple-800">Expanded offerings include ESG instruments, renewable energy stocks, and emerging market indices.</p>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Important Risk Warning</h3>
                <p className="text-red-800 mb-3">
                  CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 
                  Between 74-89% of retail investor accounts lose money when trading CFDs.
                </p>
                <ul className="text-red-800 space-y-1">
                  <li>• You should consider whether you understand how CFDs work</li>
                  <li>• Whether you can afford to take the high risk of losing your money</li>
                  <li>• Never invest more than you can afford to lose</li>
                  <li>• Consider seeking independent financial advice</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-6">Key Takeaways</h2>
            <div className="space-y-4 text-lg">
              <p>• CFDs offer flexible access to global markets with leverage</p>
              <p>• Understand the risks before trading, especially leverage and overnight costs</p>
              <p>• Choose a well-regulated broker with competitive costs and good platform</p>
              <p>• Start with a demo account to practice before risking real money</p>
              <p>• Develop a solid risk management strategy and stick to it</p>
            </div>
            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <p className="text-center font-semibold">
                CFD trading can be profitable but requires education, practice, and disciplined risk management. 
                Always trade responsibly and within your means.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CFDTradingGuide2025;
