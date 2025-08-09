import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, BookOpen, Filter } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  definition: string;
  category: string;
  relatedTerms?: string[];
}

const TradingGlossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const glossaryTerms: GlossaryTerm[] = [
    {
      term: 'Ask Price',
      definition: 'The lowest price at which a seller is willing to sell a security. Also known as the offer price.',
      category: 'Basic Trading',
      relatedTerms: ['Bid Price', 'Spread', 'Market Maker']
    },
    {
      term: 'Bid Price',
      definition: 'The highest price that a buyer is willing to pay for a security at a given time.',
      category: 'Basic Trading',
      relatedTerms: ['Ask Price', 'Spread', 'Market Maker']
    },
    {
      term: 'Spread',
      definition: 'The difference between the bid and ask prices of a security. Lower spreads generally indicate better liquidity.',
      category: 'Basic Trading',
      relatedTerms: ['Bid Price', 'Ask Price', 'Liquidity']
    },
    {
      term: 'Leverage',
      definition: 'The use of borrowed capital to increase potential returns. In forex, leverage allows traders to control larger positions with smaller amounts of capital.',
      category: 'Forex',
      relatedTerms: ['Margin', 'Margin Call', 'Risk Management']
    },
    {
      term: 'Margin',
      definition: 'The amount of money required to open a leveraged position. It acts as a good faith deposit for the trade.',
      category: 'Forex',
      relatedTerms: ['Leverage', 'Margin Call', 'Free Margin']
    },
    {
      term: 'Pip',
      definition: 'The smallest price move in a currency pair. For most major pairs, a pip is 0.0001 (fourth decimal place).',
      category: 'Forex',
      relatedTerms: ['Pipette', 'Currency Pair', 'Point']
    },
    {
      term: 'CFD',
      definition: 'Contract for Difference - a derivative that allows traders to speculate on price movements without owning the underlying asset.',
      category: 'CFDs',
      relatedTerms: ['Derivative', 'Underlying Asset', 'Leverage']
    },
    {
      term: 'Long Position',
      definition: 'Buying a security with the expectation that its price will rise. Going long means you own the asset.',
      category: 'Basic Trading',
      relatedTerms: ['Short Position', 'Bull Market', 'Buy Order']
    },
    {
      term: 'Short Position',
      definition: 'Selling a security you don\'t own with the expectation that its price will fall, allowing you to buy it back at a lower price.',
      category: 'Basic Trading',
      relatedTerms: ['Long Position', 'Bear Market', 'Sell Order']
    },
    {
      term: 'Stop Loss',
      definition: 'An order to close a position when it reaches a certain loss level, designed to limit potential losses.',
      category: 'Risk Management',
      relatedTerms: ['Take Profit', 'Risk Management', 'Order Types']
    },
    {
      term: 'Take Profit',
      definition: 'An order to close a position when it reaches a certain profit level, designed to secure gains.',
      category: 'Risk Management',
      relatedTerms: ['Stop Loss', 'Limit Order', 'Profit Target']
    },
    {
      term: 'Slippage',
      definition: 'The difference between the expected price of a trade and the actual price at which it is executed.',
      category: 'Execution',
      relatedTerms: ['Market Order', 'Liquidity', 'Volatility']
    },
    {
      term: 'Liquidity',
      definition: 'The ease with which an asset can be bought or sold without affecting its price. High liquidity means tight spreads.',
      category: 'Market Structure',
      relatedTerms: ['Spread', 'Volume', 'Market Depth']
    },
    {
      term: 'Volatility',
      definition: 'A measure of price fluctuations in a security over time. Higher volatility means larger price swings.',
      category: 'Market Analysis',
      relatedTerms: ['Standard Deviation', 'VIX', 'Risk']
    },
    {
      term: 'Bull Market',
      definition: 'A market condition characterized by rising prices and investor optimism.',
      category: 'Market Conditions',
      relatedTerms: ['Bear Market', 'Trend', 'Market Sentiment']
    },
    {
      term: 'Bear Market',
      definition: 'A market condition characterized by falling prices and investor pessimism, typically a decline of 20% or more.',
      category: 'Market Conditions',
      relatedTerms: ['Bull Market', 'Correction', 'Market Sentiment']
    },
    {
      term: 'Support Level',
      definition: 'A price level where a security tends to find buying interest and bounce higher.',
      category: 'Technical Analysis',
      relatedTerms: ['Resistance Level', 'Trend Line', 'Chart Patterns']
    },
    {
      term: 'Resistance Level',
      definition: 'A price level where a security tends to find selling pressure and move lower.',
      category: 'Technical Analysis',
      relatedTerms: ['Support Level', 'Breakout', 'Chart Patterns']
    },
    {
      term: 'Moving Average',
      definition: 'A trend-following indicator that smooths price data by creating a constantly updated average price.',
      category: 'Technical Analysis',
      relatedTerms: ['SMA', 'EMA', 'Trend Following']
    },
    {
      term: 'RSI',
      definition: 'Relative Strength Index - a momentum oscillator that measures the speed and change of price movements, ranging from 0 to 100.',
      category: 'Technical Analysis',
      relatedTerms: ['Oscillator', 'Overbought', 'Oversold']
    },
    {
      term: 'MACD',
      definition: 'Moving Average Convergence Divergence - a trend-following momentum indicator that shows relationships between two moving averages.',
      category: 'Technical Analysis',
      relatedTerms: ['Moving Average', 'Signal Line', 'Histogram']
    },
    {
      term: 'Candlestick',
      definition: 'A type of price chart that displays the high, low, open, and closing prices of a security for a specific period.',
      category: 'Technical Analysis',
      relatedTerms: ['OHLC', 'Doji', 'Hammer']
    },
    {
      term: 'Market Order',
      definition: 'An order to buy or sell a security immediately at the best available current price.',
      category: 'Order Types',
      relatedTerms: ['Limit Order', 'Stop Order', 'Execution']
    },
    {
      term: 'Limit Order',
      definition: 'An order to buy or sell a security at a specific price or better.',
      category: 'Order Types',
      relatedTerms: ['Market Order', 'Fill or Kill', 'Good Till Cancelled']
    },
    {
      term: 'ECN',
      definition: 'Electronic Communication Network - a computerized system that matches buy and sell orders directly between market participants.',
      category: 'Broker Types',
      relatedTerms: ['STP', 'Market Maker', 'DMA']
    },
    {
      term: 'STP',
      definition: 'Straight Through Processing - a broker model that routes client orders directly to liquidity providers without dealing desk intervention.',
      category: 'Broker Types',
      relatedTerms: ['ECN', 'NDD', 'Liquidity Provider']
    },
    {
      term: 'Market Maker',
      definition: 'A broker or dealer that provides liquidity by being ready to buy or sell securities at quoted prices.',
      category: 'Broker Types',
      relatedTerms: ['Dealing Desk', 'Spread', 'Liquidity']
    },
    {
      term: 'Regulation',
      definition: 'Rules and oversight by financial authorities to ensure fair trading practices and protect investors.',
      category: 'Regulatory',
      relatedTerms: ['FCA', 'CySEC', 'ASIC', 'Compliance']
    },
    {
      term: 'Segregated Accounts',
      definition: 'Client funds held separately from the broker\'s operational funds, providing protection in case of broker insolvency.',
      category: 'Regulatory',
      relatedTerms: ['Client Protection', 'FSCS', 'Regulation']
    },
    {
      term: 'Swap',
      definition: 'The interest rate differential between two currencies in a forex position, charged or credited for holding positions overnight.',
      category: 'Forex',
      relatedTerms: ['Rollover', 'Carry Trade', 'Interest Rate']
    },
    {
      term: 'Scalping',
      definition: 'A trading strategy that involves making many small profits from minor price changes over short time periods.',
      category: 'Trading Strategies',
      relatedTerms: ['Day Trading', 'High Frequency', 'Quick Profits']
    },
    {
      term: 'Swing Trading',
      definition: 'A trading strategy that attempts to capture gains over a period of days to weeks by identifying price swings.',
      category: 'Trading Strategies',
      relatedTerms: ['Position Trading', 'Technical Analysis', 'Trend Following']
    },
    {
      term: 'Day Trading',
      definition: 'A trading strategy where positions are opened and closed within the same trading day.',
      category: 'Trading Strategies',
      relatedTerms: ['Scalping', 'Intraday', 'No Overnight Risk']
    },
    {
      term: 'Hedging',
      definition: 'A risk management strategy used to offset potential losses by taking an opposite position in a related asset.',
      category: 'Risk Management',
      relatedTerms: ['Risk Management', 'Correlation', 'Portfolio Protection']
    },
    {
      term: 'Drawdown',
      definition: 'The peak-to-trough decline in account value, expressed as a percentage of the peak value.',
      category: 'Risk Management',
      relatedTerms: ['Maximum Drawdown', 'Risk Assessment', 'Performance Metrics']
    },
    {
      term: 'Sharpe Ratio',
      definition: 'A measure of risk-adjusted return, calculated by dividing excess return by standard deviation.',
      category: 'Performance Metrics',
      relatedTerms: ['Risk-Adjusted Return', 'Standard Deviation', 'Benchmark']
    },
    {
      term: 'Alpha',
      definition: 'A measure of performance that indicates how much a trading strategy outperforms a benchmark index.',
      category: 'Performance Metrics',
      relatedTerms: ['Beta', 'Benchmark', 'Outperformance']
    },
    {
      term: 'Beta',
      definition: 'A measure of systematic risk that indicates how much a security moves relative to the overall market.',
      category: 'Performance Metrics',
      relatedTerms: ['Alpha', 'Systematic Risk', 'Market Correlation']
    },
    {
      term: 'VPS',
      definition: 'Virtual Private Server - a remote server used by traders to run trading platforms and automated strategies 24/7.',
      category: 'Technology',
      relatedTerms: ['Automated Trading', 'Expert Advisor', 'Latency']
    },
    {
      term: 'API',
      definition: 'Application Programming Interface - allows third-party applications to connect to trading platforms for automated trading.',
      category: 'Technology',
      relatedTerms: ['Automated Trading', 'Integration', 'Programming']
    },
    {
      term: 'Latency',
      definition: 'The time delay between placing an order and its execution. Lower latency is crucial for high-frequency trading.',
      category: 'Technology',
      relatedTerms: ['Execution Speed', 'HFT', 'Server Location']
    }
  ];

  const categories = ['All', ...Array.from(new Set(glossaryTerms.map(term => term.category)))];

  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchTerm, selectedCategory]);

  return (
    <>
      <Helmet>
        <title>Trading Glossary 2025 | Complete Trading Terms Dictionary</title>
        <meta name="description" content="Comprehensive trading glossary for 2025. Learn definitions of forex, CFD, and trading terms. Essential dictionary for traders and investors." />
        <meta name="keywords" content="trading glossary 2025, forex terms, CFD definitions, trading dictionary, financial terms, broker terminology, trading education" />
        <link rel="canonical" href="https://brokeranalysis.com/education/trading-glossary" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Trading Glossary 2025 | Complete Trading Terms Dictionary" />
        <meta property="og:description" content="Comprehensive trading glossary for 2025. Learn definitions of forex, CFD, and trading terms." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://brokeranalysis.com/education/trading-glossary" />
        <meta property="og:image" content="https://brokeranalysis.com/images/trading-glossary-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trading Glossary 2025 | Complete Trading Terms Dictionary" />
        <meta name="twitter:description" content="Comprehensive trading glossary for 2025. Learn definitions of forex, CFD, and trading terms." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/trading-glossary-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            "name": "Trading Glossary 2025",
            "description": "Comprehensive dictionary of trading, forex, and financial terms for 2025",
            "url": "https://brokeranalysis.com/education/trading-glossary",
            "inDefinedTermSet": glossaryTerms.map(term => ({
              "@type": "DefinedTerm",
              "name": term.term,
              "description": term.definition,
              "inDefinedTermSet": {
                "@type": "DefinedTermSet",
                "name": term.category
              }
            }))
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <BookOpen className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Trading Glossary 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Your comprehensive dictionary of trading terms, forex terminology, and broker-related concepts for 2025.
              </p>
              <div className="text-lg">
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  {glossaryTerms.length} Terms Defined
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search terms or definitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredTerms.length} of {glossaryTerms.length} terms
            </div>
          </div>
        </div>

        {/* Glossary Terms */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid gap-6">
            {filteredTerms.map((term, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{term.term}</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {term.category}
                      </span>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-4">
                      {term.definition}
                    </p>
                    {term.relatedTerms && term.relatedTerms.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Related Terms:</h4>
                        <div className="flex flex-wrap gap-2">
                          {term.relatedTerms.map((relatedTerm, relatedIndex) => (
                            <button
                              key={relatedIndex}
                              onClick={() => setSearchTerm(relatedTerm)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                            >
                              {relatedTerm}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTerms.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No terms found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Categories Overview */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Browse by Category
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.filter(cat => cat !== 'All').map((category, index) => {
                const termCount = glossaryTerms.filter(term => term.category === category).length;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(category)}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
                  >
                    <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                    <p className="text-gray-600 text-sm">{termCount} terms</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TradingGlossary;