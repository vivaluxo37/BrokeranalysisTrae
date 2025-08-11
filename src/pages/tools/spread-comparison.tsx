import React, { useEffect, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { AlertCircle, BarChart3, Clock, Download, RefreshCw, TrendingUp } from 'lucide-react';

interface SpreadData {
  broker: string;
  logo: string;
  eurusd: number;
  gbpusd: number;
  usdjpy: number;
  usdchf: number;
  audusd: number;
  usdcad: number;
  nzdusd: number;
  eurjpy: number;
  eurgbp: number;
  gbpjpy: number;
  lastUpdated: Date;
  website: string;
}

interface InstrumentSpread {
  symbol: string;
  name: string;
  category: 'major' | 'minor' | 'exotic' | 'commodity' | 'index';
}

const instruments: InstrumentSpread[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'major' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'major' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'major' },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'major' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'major' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'major' },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', category: 'minor' },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', category: 'minor' },
  { symbol: 'EURGBP', name: 'Euro / British Pound', category: 'minor' },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', category: 'minor' }
];

const SpreadComparisonTool: React.FC = () => {
  const [spreadData, setSpreadData] = useState<SpreadData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('eurusd');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Mock spread data - in a real application, this would come from live APIs
  const generateMockSpreadData = (): SpreadData[] => {
    return [
      {
        broker: 'Interactive Brokers',
        logo: '/images/brokers/interactive-brokers.png',
        eurusd: 0.2,
        gbpusd: 0.3,
        usdjpy: 0.2,
        usdchf: 0.3,
        audusd: 0.3,
        usdcad: 0.3,
        nzdusd: 0.4,
        eurjpy: 0.4,
        eurgbp: 0.3,
        gbpjpy: 0.5,
        lastUpdated: new Date(),
        website: 'https://www.interactivebrokers.com'
      },
      {
        broker: 'IG',
        logo: '/images/brokers/ig.png',
        eurusd: 0.6,
        gbpusd: 0.9,
        usdjpy: 0.7,
        usdchf: 1.2,
        audusd: 0.8,
        usdcad: 1.0,
        nzdusd: 1.5,
        eurjpy: 1.1,
        eurgbp: 0.9,
        gbpjpy: 1.8,
        lastUpdated: new Date(),
        website: 'https://www.ig.com'
      },
      {
        broker: 'XTB',
        logo: '/images/brokers/xtb.png',
        eurusd: 0.8,
        gbpusd: 1.2,
        usdjpy: 0.9,
        usdchf: 1.5,
        audusd: 1.0,
        usdcad: 1.3,
        nzdusd: 1.8,
        eurjpy: 1.4,
        eurgbp: 1.1,
        gbpjpy: 2.1,
        lastUpdated: new Date(),
        website: 'https://www.xtb.com'
      },
      {
        broker: 'eToro',
        logo: '/images/brokers/etoro.png',
        eurusd: 1.0,
        gbpusd: 1.5,
        usdjpy: 1.0,
        usdchf: 1.8,
        audusd: 1.2,
        usdcad: 1.5,
        nzdusd: 2.0,
        eurjpy: 1.6,
        eurgbp: 1.3,
        gbpjpy: 2.5,
        lastUpdated: new Date(),
        website: 'https://www.etoro.com'
      },
      {
        broker: 'Saxo Bank',
        logo: '/images/brokers/saxo-bank.png',
        eurusd: 0.4,
        gbpusd: 0.6,
        usdjpy: 0.4,
        usdchf: 0.7,
        audusd: 0.5,
        usdcad: 0.6,
        nzdusd: 0.8,
        eurjpy: 0.7,
        eurgbp: 0.5,
        gbpjpy: 1.0,
        lastUpdated: new Date(),
        website: 'https://www.saxobank.com'
      },
      {
        broker: 'OANDA',
        logo: '/images/brokers/oanda.png',
        eurusd: 1.2,
        gbpusd: 1.4,
        usdjpy: 1.1,
        usdchf: 1.6,
        audusd: 1.3,
        usdcad: 1.4,
        nzdusd: 1.9,
        eurjpy: 1.5,
        eurgbp: 1.2,
        gbpjpy: 2.2,
        lastUpdated: new Date(),
        website: 'https://www.oanda.com'
      }
    ];
  };

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newData = generateMockSpreadData();
    setSpreadData(newData);
    setLastRefresh(new Date());
    setIsLoading(false);
  };

  const getFilteredInstruments = () => {
    if (selectedCategory === 'all') return instruments;
    return instruments.filter(inst => inst.category === selectedCategory);
  };

  const getBestSpread = (symbol: string) => {
    const symbolKey = symbol.toLowerCase() as keyof SpreadData;
    return Math.min(...spreadData.map(broker => broker[symbolKey] as number));
  };

  const getSpreadRanking = (broker: SpreadData, symbol: string) => {
    const symbolKey = symbol.toLowerCase() as keyof SpreadData;
    const brokerSpread = broker[symbolKey] as number;
    const allSpreads = spreadData.map(b => b[symbolKey] as number).sort((a, b) => a - b);
    return allSpreads.indexOf(brokerSpread) + 1;
  };

  const calculateAverageSpread = (broker: SpreadData) => {
    const spreads = [broker.eurusd, broker.gbpusd, broker.usdjpy, broker.usdchf, broker.audusd, broker.usdcad];
    return spreads.reduce((sum, spread) => sum + spread, 0) / spreads.length;
  };

  const exportData = () => {
    const csvContent = [
      ['Broker', ...getFilteredInstruments().map(inst => inst.symbol)],
      ...spreadData.map(broker => [
        broker.broker,
        ...getFilteredInstruments().map(inst => {
          const symbolKey = inst.symbol.toLowerCase() as keyof SpreadData;
          return (broker[symbolKey] as number).toFixed(1);
        })
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spread-comparison-2025.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getSortedBrokers = () => {
    return [...spreadData].sort((a, b) => {
      if (sortBy === 'average') {
        return calculateAverageSpread(a) - calculateAverageSpread(b);
      }
      const symbolKey = sortBy as keyof SpreadData;
      return (a[symbolKey] as number) - (b[symbolKey] as number);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Spread Comparison Tool 2025 | Compare Real-Time Forex Spreads</title>
        <meta name="description" content="Compare real-time forex spreads across major brokers in 2025. Find the tightest spreads for EUR/USD, GBP/USD, USD/JPY and other major currency pairs." />
        <meta name="keywords" content="forex spread comparison 2025, real-time spreads, currency pair spreads, forex broker spreads, tight spreads" />
        <link rel="canonical" href="https://brokeranalysis.com/tools/spread-comparison" />
        <meta property="og:title" content="Spread Comparison Tool 2025 | Real-Time Forex Spreads" />
        <meta property="og:description" content="Compare real-time forex spreads across major brokers. Find the best spreads for your trading strategy." />
        <meta property="og:url" content="https://brokeranalysis.com/tools/spread-comparison" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spread Comparison Tool 2025" />
        <meta name="twitter:description" content="Compare real-time forex spreads and find the tightest spreads for major currency pairs." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Spread Comparison Tool 2025",
            "description": "Compare real-time forex spreads across major brokers in 2025",
            "url": "https://brokeranalysis.com/tools/spread-comparison",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Spread Comparison Tool 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Compare real-time forex spreads across major brokers. Find the tightest spreads for your preferred currency pairs and optimize your trading costs.
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Pairs</option>
                    <option value="major">Major Pairs</option>
                    <option value="minor">Minor Pairs</option>
                    <option value="exotic">Exotic Pairs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="average">Average Spread</option>
                    <option value="eurusd">EUR/USD</option>
                    <option value="gbpusd">GBP/USD</option>
                    <option value="usdjpy">USD/JPY</option>
                    <option value="usdchf">USD/CHF</option>
                    <option value="audusd">AUD/USD</option>
                    <option value="usdcad">USD/CAD</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Last updated: {lastRefresh.toLocaleTimeString()}
                </div>
                <button
                  onClick={refreshData}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  onClick={exportData}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Spread Comparison Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Broker
                    </th>
                    {getFilteredInstruments().map(instrument => (
                      <th key={instrument.symbol} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div>
                          <div>{instrument.symbol}</div>
                          <div className="text-xs text-gray-400 normal-case">{instrument.name}</div>
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getSortedBrokers().map((broker, index) => (
                    <tr key={broker.broker} className={index === 0 ? 'bg-green-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {index === 0 && (
                            <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mr-2">
                              Best
                            </div>
                          )}
                          <img src={broker.logo} alt={broker.broker} className="w-8 h-8 object-contain mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{broker.broker}</div>
                          </div>
                        </div>
                      </td>
                      {getFilteredInstruments().map(instrument => {
                        const symbolKey = instrument.symbol.toLowerCase() as keyof SpreadData;
                        const spread = broker[symbolKey] as number;
                        const bestSpread = getBestSpread(instrument.symbol);
                        const isBest = spread === bestSpread;
                        const ranking = getSpreadRanking(broker, instrument.symbol);
                        
                        return (
                          <td key={instrument.symbol} className="px-6 py-4 whitespace-nowrap text-center">
                            <div className={`text-sm font-medium ${
                              isBest ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {spread.toFixed(1)} pips
                            </div>
                            <div className="text-xs text-gray-500">
                              #{ranking}
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {calculateAverageSpread(broker).toFixed(1)} pips
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex space-x-2 justify-center">
                          <a
                            href={broker.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Visit
                          </a>
                          <a
                            href={`/brokers/${broker.broker.toLowerCase().replace(/\s+/g, '-')}`}
                            className="border border-blue-600 text-blue-600 px-3 py-1 rounded text-xs hover:bg-blue-50 transition-colors"
                          >
                            Review
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Best Spreads Summary */}
          {/* Best Spreads Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {getFilteredInstruments().slice(0, 6).map(instrument => {
              const bestSpread = getBestSpread(instrument.symbol);
              const bestBroker = spreadData.find(broker => {
                const symbolKey = instrument.symbol.toLowerCase() as keyof SpreadData;
                return (broker[symbolKey] as number) === bestSpread;
              });
              
              return (
                <div key={instrument.symbol} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{instrument.symbol}</h3>
                  <p className="text-sm text-gray-600 mb-3">{instrument.name}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{bestSpread.toFixed(1)} pips</div>
                      <div className="text-sm text-gray-500">Best spread</div>
                    </div>
                    {bestBroker && (
                      <div className="text-right">
                        <img src={bestBroker.logo} alt={bestBroker.broker} className="w-8 h-8 object-contain mx-auto mb-1" />
                        <div className="text-xs text-gray-600">{bestBroker.broker}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Forex Cross Rates widget */}
          <div className="mt-8" style={{ height: '400px', width: '100%' }}>
            <ForexCrossRates />
          </div>

          {/* Information Panel */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Understanding Forex Spreads in 2025
            </h3>
            <div className="text-blue-800 space-y-2 text-sm">
              <p><strong>Spread:</strong> The difference between the bid (sell) and ask (buy) price of a currency pair, measured in pips.</p>
              <p><strong>Tight Spreads:</strong> Lower spreads mean lower trading costs, especially important for scalpers and high-frequency traders.</p>
              <p><strong>Variable vs Fixed:</strong> Most brokers offer variable spreads that change based on market conditions and liquidity.</p>
              <p><strong>Market Hours:</strong> Spreads are typically tightest during major market overlaps (London-New York) and widest during low liquidity periods.</p>
              <p className="mt-3 font-medium">💡 Tip: Consider both spreads and commission structures when comparing total trading costs. Some brokers offer tight spreads but charge commissions, while others have wider spreads with no commission.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadComparisonTool;