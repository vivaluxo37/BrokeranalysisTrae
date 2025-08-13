import React, { useEffect, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { BarChart3, Calculator, DollarSign, Download, Info, TrendingUp } from 'lucide-react';

interface BrokerFeeStructure {
  name: string;
  logo: string;
  forexSpread: number; // in pips
  forexCommission: number; // per lot
  stockCommission: number; // per trade or percentage
  stockCommissionType: 'fixed' | 'percentage';
  cryptoFee: number; // percentage
  inactivityFee: number; // monthly
  withdrawalFee: number;
  minDeposit: number;
  website: string;
}

interface CalculationInputs {
  tradingStyle: 'day' | 'swing' | 'position';
  assetType: 'forex' | 'stocks' | 'crypto';
  tradesPerMonth: number;
  averageTradeSize: number;
  holdingPeriod: number; // days
  accountBalance: number;
}

interface FeeCalculation {
  broker: BrokerFeeStructure;
  monthlyFees: {
    trading: number;
    spread: number;
    inactivity: number;
    withdrawal: number;
    total: number;
  };
  yearlyFees: {
    trading: number;
    spread: number;
    inactivity: number;
    withdrawal: number;
    total: number;
  };
  costPerTrade: number;
  costAsPercentage: number;
}

const brokerFeeData: BrokerFeeStructure[] = [
  {
    name: 'Interactive Brokers',
    logo: '/images/brokers/interactive-brokers.png',
    forexSpread: 0.2,
    forexCommission: 2.5,
    stockCommission: 0.005,
    stockCommissionType: 'percentage',
    cryptoFee: 0.12,
    inactivityFee: 20,
    withdrawalFee: 0,
    minDeposit: 0,
    website: 'https://www.interactivebrokers.com'
  },
  {
    name: 'IG',
    logo: '/images/brokers/ig.png',
    forexSpread: 0.6,
    forexCommission: 0,
    stockCommission: 8,
    stockCommissionType: 'fixed',
    cryptoFee: 0.75,
    inactivityFee: 12,
    withdrawalFee: 0,
    minDeposit: 250,
    website: 'https://www.ig.com'
  },
  {
    name: 'XTB',
    logo: '/images/brokers/xtb.png',
    forexSpread: 0.8,
    forexCommission: 0,
    stockCommission: 0,
    stockCommissionType: 'fixed',
    cryptoFee: 1.2,
    inactivityFee: 10,
    withdrawalFee: 0,
    minDeposit: 100,
    website: 'https://www.xtb.com'
  },
  {
    name: 'eToro',
    logo: '/images/brokers/etoro.png',
    forexSpread: 1.0,
    forexCommission: 0,
    stockCommission: 0,
    stockCommissionType: 'fixed',
    cryptoFee: 1.0,
    inactivityFee: 10,
    withdrawalFee: 5,
    minDeposit: 200,
    website: 'https://www.etoro.com'
  },
  {
    name: 'Saxo Bank',
    logo: '/images/brokers/saxo-bank.png',
    forexSpread: 0.4,
    forexCommission: 3,
    stockCommission: 0.08,
    stockCommissionType: 'percentage',
    cryptoFee: 0.75,
    inactivityFee: 100,
    withdrawalFee: 0,
    minDeposit: 2000,
    website: 'https://www.saxobank.com'
  }
];

const BrokerageFeeCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<CalculationInputs>({
    tradingStyle: 'day',
    assetType: 'forex',
    tradesPerMonth: 20,
    averageTradeSize: 10000,
    holdingPeriod: 1,
    accountBalance: 10000
  });

  const [calculations, setCalculations] = useState<FeeCalculation[]>([]);
  const [sortBy, setSortBy] = useState<'total' | 'trading' | 'spread'>('total');

  useEffect(() => {
    calculateFees();
  }, [inputs]);

  const calculateFees = () => {
    const results: FeeCalculation[] = brokerFeeData.map(broker => {
      let monthlyTradingFees = 0;
      let monthlySpreadFees = 0;

      // Calculate trading fees based on asset type
      switch (inputs.assetType) {
        case 'forex':
          // Spread costs
          monthlySpreadFees = (inputs.tradesPerMonth * inputs.averageTradeSize * broker.forexSpread * 0.0001) / 100;
          // Commission costs
          monthlyTradingFees = inputs.tradesPerMonth * broker.forexCommission;
          break;

        case 'stocks':
          if (broker.stockCommissionType === 'fixed') {
            monthlyTradingFees = inputs.tradesPerMonth * broker.stockCommission;
          } else {
            monthlyTradingFees = inputs.tradesPerMonth * inputs.averageTradeSize * (broker.stockCommission / 100);
          }
          break;

        case 'crypto':
          monthlyTradingFees = inputs.tradesPerMonth * inputs.averageTradeSize * (broker.cryptoFee / 100);
          break;
      }

      // Inactivity fees (only if account balance is below threshold and low activity)
      const monthlyInactivityFee = inputs.tradesPerMonth < 1 ? broker.inactivityFee : 0;

      // Withdrawal fees (assuming 1 withdrawal per month for active traders)
      const monthlyWithdrawalFee = inputs.tradesPerMonth > 5 ? broker.withdrawalFee : 0;

      const monthlyTotal = monthlyTradingFees + monthlySpreadFees + monthlyInactivityFee + monthlyWithdrawalFee;
      const yearlyTotal = monthlyTotal * 12;
      const costPerTrade = monthlyTotal / inputs.tradesPerMonth;
      const costAsPercentage = (monthlyTotal / inputs.accountBalance) * 100;

      return {
        broker,
        monthlyFees: {
          trading: monthlyTradingFees,
          spread: monthlySpreadFees,
          inactivity: monthlyInactivityFee,
          withdrawal: monthlyWithdrawalFee,
          total: monthlyTotal
        },
        yearlyFees: {
          trading: monthlyTradingFees * 12,
          spread: monthlySpreadFees * 12,
          inactivity: monthlyInactivityFee * 12,
          withdrawal: monthlyWithdrawalFee * 12,
          total: yearlyTotal
        },
        costPerTrade,
        costAsPercentage
      };
    });

    // Sort results
    const sortedResults = results.sort((a, b) => {
      switch (sortBy) {
        case 'trading':
          return a.monthlyFees.trading - b.monthlyFees.trading;
        case 'spread':
          return a.monthlyFees.spread - b.monthlyFees.spread;
        default:
          return a.monthlyFees.total - b.monthlyFees.total;
      }
    });

    setCalculations(sortedResults);
  };

  const handleInputChange = (field: keyof CalculationInputs, value: string | number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const exportResults = () => {
    const csvContent = [
      ['Broker', 'Monthly Trading Fees', 'Monthly Spread Costs', 'Monthly Total', 'Yearly Total', 'Cost Per Trade', 'Cost as % of Account'],
      ...calculations.map(calc => [
        calc.broker.name,
        calc.monthlyFees.trading.toFixed(2),
        calc.monthlyFees.spread.toFixed(2),
        calc.monthlyFees.total.toFixed(2),
        calc.yearlyFees.total.toFixed(2),
        calc.costPerTrade.toFixed(2),
        `${calc.costAsPercentage.toFixed(3)  }%`
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'broker-fee-comparison-2025.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Brokerage Fee Calculator 2025 | Compare Trading Costs Across Brokers</title>
        <meta name="description" content="Calculate and compare trading fees across top brokers in 2025. Analyze commission costs, spreads, and hidden fees to find the most cost-effective broker for your trading style." />
        <meta name="keywords" content="brokerage fee calculator 2025, trading cost comparison, broker commission calculator, forex spread calculator, stock trading fees" />
        <link rel="canonical" href="https://brokeranalysis.com/tools/brokerage-fee-calculator" />
        <meta property="og:title" content="Brokerage Fee Calculator 2025 | Compare Trading Costs" />
        <meta property="og:description" content="Calculate and compare trading fees across top brokers. Find the most cost-effective broker for your trading style." />
        <meta property="og:url" content="https://brokeranalysis.com/tools/brokerage-fee-calculator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Brokerage Fee Calculator 2025" />
        <meta name="twitter:description" content="Compare trading costs across brokers and find the best deal for your trading strategy." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Brokerage Fee Calculator 2025",
            "description": "Calculate and compare trading fees across top brokers in 2025",
            "url": "https://brokeranalysis.com/tools/brokerage-fee-calculator",
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
              Brokerage Fee Calculator 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate and compare trading costs across top brokers. Find the most cost-effective broker for your trading style and save money on fees.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-accent-blue" />
                  Trading Parameters
                </h2>

                <div className="space-y-6">
                  {/* Trading Style */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trading Style
                    </label>
                    <select
                      value={inputs.tradingStyle}
                      onChange={(e) => handleInputChange('tradingStyle', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="day">Day Trading</option>
                      <option value="swing">Swing Trading</option>
                      <option value="position">Position Trading</option>
                    </select>
                  </div>

                  {/* Asset Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Asset Type
                    </label>
                    <select
                      value={inputs.assetType}
                      onChange={(e) => handleInputChange('assetType', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="forex">Forex</option>
                      <option value="stocks">Stocks</option>
                      <option value="crypto">Cryptocurrency</option>
                    </select>
                  </div>

                  {/* Trades Per Month */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trades Per Month: {inputs.tradesPerMonth}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="200"
                      value={inputs.tradesPerMonth}
                      onChange={(e) => handleInputChange('tradesPerMonth', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1</span>
                      <span>200</span>
                    </div>
                  </div>

                  {/* Average Trade Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Trade Size ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.averageTradeSize}
                      onChange={(e) => handleInputChange('averageTradeSize', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>

                  {/* Account Balance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Balance ($)
                    </label>
                    <input
                      type="number"
                      value={inputs.accountBalance}
                      onChange={(e) => handleInputChange('accountBalance', parseFloat(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={exportResults}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </button>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-6 h-6 mr-2 text-accent-blue" />
                    Fee Comparison Results
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSortBy('total')}
                      className={`px-3 py-1 rounded text-sm ${
                        sortBy === 'total' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Total Cost
                    </button>
                    <button
                      onClick={() => setSortBy('trading')}
                      className={`px-3 py-1 rounded text-sm ${
                        sortBy === 'trading' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Trading Fees
                    </button>
                    <button
                      onClick={() => setSortBy('spread')}
                      className={`px-3 py-1 rounded text-sm ${
                        sortBy === 'spread' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      Spread Costs
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {calculations.map((calc, index) => (
                    <div key={calc.broker.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {index === 0 && (
                            <div className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                              Best Value
                            </div>
                          )}
                          <img src={calc.broker.logo} alt={calc.broker.name} className="w-8 h-8 object-contain" />
                          <h3 className="text-lg font-semibold text-gray-900">{calc.broker.name}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-accent-blue">
                            ${calc.monthlyFees.total.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">per month</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-xs text-gray-500">Trading Fees</div>
                          <div className="font-semibold">${calc.monthlyFees.trading.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Spread Costs</div>
                          <div className="font-semibold">${calc.monthlyFees.spread.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Cost Per Trade</div>
                          <div className="font-semibold">${calc.costPerTrade.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Yearly Total</div>
                          <div className="font-semibold">${calc.yearlyFees.total.toFixed(2)}</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">{calc.costAsPercentage.toFixed(3)}%</span> of account balance
                        </div>
                        <div className="flex space-x-2">
                          <a
                            href={calc.broker.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Visit {calc.broker.name}
                          </a>
                          <a
                            href={`/brokers/${calc.broker.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="border border-blue-600 text-accent-blue px-4 py-2 rounded text-sm hover:bg-blue-50 transition-colors"
                          >
                            Read Review
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Live Market Data Widget */}
                <div className="mt-8">
                  {inputs.assetType === 'forex' && <ForexHeatmap />}
                  {inputs.assetType === 'stocks' && <StockHeatmap />}
                  {inputs.assetType === 'crypto' && <CryptoHeatmap />}
                </div>
              </div>

              {/* Fee Breakdown Info */}
              <div className="bg-blue-50 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Understanding Trading Costs in 2025
                </h3>
                <div className="text-blue-800 space-y-2 text-sm">
                  <p><strong>Trading Fees:</strong> Commission charges per trade or transaction</p>
                  <p><strong>Spread Costs:</strong> The difference between bid and ask prices</p>
                  <p><strong>Inactivity Fees:</strong> Monthly charges for inactive accounts</p>
                  <p><strong>Withdrawal Fees:</strong> Costs for withdrawing funds from your account</p>
                  <p className="mt-3 font-medium">💡 Tip: Consider your trading frequency and style when choosing a broker. High-frequency traders should prioritize low per-trade costs, while occasional traders should focus on low or no inactivity fees.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrokerageFeeCalculator;
