import React, { useEffect, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { AlertTriangle, BarChart3, Calculator, DollarSign, Download, Info, TrendingUp } from 'lucide-react';

interface LeverageCalculation {
  accountBalance: number;
  leverage: number;
  positionSize: number;
  marginRequired: number;
  marginPercentage: number;
  buyingPower: number;
  profitLoss: {
    pips: number;
    amount: number;
    percentage: number;
  }[];
  marginCall: {
    level: number;
    priceMove: number;
  };
  liquidation: {
    level: number;
    priceMove: number;
  };
}

interface RiskScenario {
  name: string;
  description: string;
  pipMove: number;
  color: string;
}

const riskScenarios: RiskScenario[] = [
  { name: 'Conservative', description: '10 pip move', pipMove: 10, color: 'green' },
  { name: 'Moderate', description: '25 pip move', pipMove: 25, color: 'yellow' },
  { name: 'Aggressive', description: '50 pip move', pipMove: 50, color: 'orange' },
  { name: 'High Risk', description: '100 pip move', pipMove: 100, color: 'red' }
];

const leverageOptions = [1, 5, 10, 20, 30, 50, 100, 200, 400, 500];

const LeverageCalculator: React.FC = () => {
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [leverage, setLeverage] = useState<number>(100);
  const [positionSize, setPositionSize] = useState<number>(100000);
  const [instrumentType, setInstrumentType] = useState<string>('forex');
  const [pipValue, setPipValue] = useState<number>(10);
  const [calculation, setCalculation] = useState<LeverageCalculation | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<string>('moderate');

  useEffect(() => {
    calculateLeverage();
  }, [accountBalance, leverage, positionSize, pipValue]);

  const calculateLeverage = () => {
    if (accountBalance <= 0 || leverage <= 0 || positionSize <= 0) {
      setCalculation(null);
      return;
    }

    const marginRequired = positionSize / leverage;
    const marginPercentage = (marginRequired / accountBalance) * 100;
    const buyingPower = accountBalance * leverage;

    // Calculate profit/loss scenarios
    const profitLoss = riskScenarios.map(scenario => {
      const amount = scenario.pipMove * pipValue;
      const percentage = (amount / accountBalance) * 100;
      return {
        pips: scenario.pipMove,
        amount,
        percentage
      };
    });

    // Calculate margin call level (typically 50% of margin)
    const marginCallLevel = marginRequired * 0.5;
    const marginCallPriceMove = (accountBalance - marginCallLevel) / pipValue;

    // Calculate liquidation level (typically 20% of margin)
    const liquidationLevel = marginRequired * 0.2;
    const liquidationPriceMove = (accountBalance - liquidationLevel) / pipValue;

    setCalculation({
      accountBalance,
      leverage,
      positionSize,
      marginRequired,
      marginPercentage,
      buyingPower,
      profitLoss,
      marginCall: {
        level: marginCallLevel,
        priceMove: marginCallPriceMove
      },
      liquidation: {
        level: liquidationLevel,
        priceMove: liquidationPriceMove
      }
    });
  };

  const getRiskLevel = (marginPercentage: number): { level: string; color: string; description: string } => {
    if (marginPercentage < 2) {
      return { level: 'Very Low', color: 'green', description: 'Conservative position size' };
    } else if (marginPercentage < 5) {
      return { level: 'Low', color: 'blue', description: 'Moderate position size' };
    } else if (marginPercentage < 10) {
      return { level: 'Medium', color: 'yellow', description: 'Elevated risk level' };
    } else if (marginPercentage < 20) {
      return { level: 'High', color: 'orange', description: 'High risk - monitor closely' };
    } else {
      return { level: 'Very High', color: 'red', description: 'Extreme risk - consider reducing position' };
    }
  };

  const exportCalculation = () => {
    if (!calculation) return;

    const csvContent = [
      ['Leverage Calculator Results - 2025'],
      [''],
      ['Input Parameters'],
      ['Account Balance', `$${calculation.accountBalance.toLocaleString()}`],
      ['Leverage', `${calculation.leverage}:1`],
      ['Position Size', `$${calculation.positionSize.toLocaleString()}`],
      ['Pip Value', `$${pipValue}`],
      [''],
      ['Calculation Results'],
      ['Margin Required', `$${calculation.marginRequired.toLocaleString()}`],
      ['Margin Percentage', `${calculation.marginPercentage.toFixed(2)}%`],
      ['Buying Power', `$${calculation.buyingPower.toLocaleString()}`],
      [''],
      ['Risk Scenarios'],
      ['Scenario', 'Pip Move', 'P&L Amount', 'P&L Percentage'],
      ...riskScenarios.map((scenario, index) => [
        scenario.name,
        `${scenario.pipMove} pips`,
        `$${calculation.profitLoss[index].amount.toFixed(2)}`,
        `${calculation.profitLoss[index].percentage.toFixed(2)}%`
      ])
    ].map(row => Array.isArray(row) ? row.join(',') : row).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leverage-calculation-2025.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const riskAssessment = calculation ? getRiskLevel(calculation.marginPercentage) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Leverage Calculator 2025 | Calculate Margin Requirements &amp; Risk</title>
        <meta name="description" content="Calculate leverage effects, margin requirements, and trading risks in 2025. Understand how leverage impacts your trading positions and manage risk effectively." />
        <meta name="keywords" content="leverage calculator 2025, margin calculator, forex leverage, trading risk calculator, position size calculator" />
        <link rel="canonical" href="https://brokeranalysis.com/tools/leverage-calculator" />
        <meta property="og:title" content="Leverage Calculator 2025 | Margin &amp; Risk Calculator" />
        <meta property="og:description" content="Calculate leverage effects and margin requirements. Understand trading risks and optimize your position sizes." />
        <meta property="og:url" content="https://brokeranalysis.com/tools/leverage-calculator" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Leverage Calculator 2025" />
        <meta name="twitter:description" content="Calculate leverage effects, margin requirements, and manage trading risks effectively." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Leverage Calculator 2025",
            "description": "Calculate leverage effects, margin requirements, and trading risks in 2025",
            "url": "https://brokeranalysis.com/tools/leverage-calculator",
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
              Leverage Calculator 2025
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate leverage effects, margin requirements, and understand the risks associated with leveraged trading. Make informed decisions about your position sizes.
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
                  {/* Account Balance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Balance ($)
                    </label>
                    <input
                      type="number"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(parseFloat(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10000"
                    />
                  </div>

                  {/* Leverage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leverage Ratio
                    </label>
                    <select
                      value={leverage}
                      onChange={(e) => setLeverage(parseInt(e.target.value))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {leverageOptions.map(option => (
                        <option key={option} value={option}>{option}:1</option>
                      ))}
                    </select>
                  </div>

                  {/* Position Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position Size ($)
                    </label>
                    <input
                      type="number"
                      value={positionSize}
                      onChange={(e) => setPositionSize(parseFloat(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100000"
                    />
                  </div>

                  {/* Instrument Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrument Type
                    </label>
                    <select
                      value={instrumentType}
                      onChange={(e) => {
                        setInstrumentType(e.target.value);
                        // Set default pip values based on instrument
                        if (e.target.value === 'forex') setPipValue(10);
                        else if (e.target.value === 'indices') setPipValue(1);
                        else if (e.target.value === 'commodities') setPipValue(10);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="forex">Forex</option>
                      <option value="indices">Indices</option>
                      <option value="commodities">Commodities</option>
                      <option value="crypto">Cryptocurrency</option>
                    </select>
                  </div>

                  {/* Pip Value */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pip Value ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={pipValue}
                      onChange={(e) => setPipValue(parseFloat(e.target.value) || 0)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="10"
                    />
                  </div>

                  {/* Export Button */}
                  <button
                    onClick={exportCalculation}
                    disabled={!calculation}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Results
                  </button>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {calculation && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <BarChart3 className="w-6 h-6 mr-2 text-accent-blue" />
                      Leverage Analysis
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent-blue">
                          ${calculation.marginRequired.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Margin Required</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {calculation.marginPercentage.toFixed(2)}% of account
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          ${calculation.buyingPower.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Buying Power</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {leverage}:1 leverage
                        </div>
                      </div>
                      <div className="text-center">
                        <div className={`text-3xl font-bold text-${riskAssessment?.color}-600`}>
                          {riskAssessment?.level}
                        </div>
                        <div className="text-sm text-gray-600">Risk Level</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {riskAssessment?.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Risk Scenarios */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-accent-blue" />
                      Profit &amp; Loss Scenarios
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {riskScenarios.map((scenario, index) => {
                        const pnl = calculation.profitLoss[index];
                        return (
                          <div key={scenario.name} className={`border-2 border-${scenario.color}-200 rounded-lg p-4 bg-${scenario.color}-50`}>
                            <div className="text-center">
                              <div className={`text-lg font-bold text-${scenario.color}-700`}>
                                {scenario.name}
                              </div>
                              <div className="text-sm text-gray-600 mb-2">
                                {scenario.description}
                              </div>
                              <div className={`text-xl font-bold text-${scenario.color}-600`}>
                                ±${pnl.amount.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-600">
                                ±{pnl.percentage.toFixed(2)}%
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Risk Management */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                      Risk Management Levels
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                        <h4 className="font-semibold text-orange-800 mb-2">Margin Call Level</h4>
                        <div className="text-2xl font-bold text-orange-600">
                          ${calculation.marginCall.level.toFixed(2)}
                        </div>
                        <div className="text-sm text-orange-700">
                          Account equity threshold
                        </div>
                        <div className="text-xs text-orange-600 mt-1">
                          ~{Math.abs(calculation.marginCall.priceMove).toFixed(0)} pip adverse move
                        </div>
                      </div>

                      <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                        <h4 className="font-semibold text-red-800 mb-2">Liquidation Level</h4>
                        <div className="text-2xl font-bold text-red-600">
                          ${calculation.liquidation.level.toFixed(2)}
                        </div>
                        <div className="text-sm text-red-700">
                          Position closure threshold
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          ~{Math.abs(calculation.liquidation.priceMove).toFixed(0)} pip adverse move
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leverage Comparison */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Leverage Comparison</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Leverage</th>
                            <th className="text-right py-2">Margin Required</th>
                            <th className="text-right py-2">Margin %</th>
                            <th className="text-right py-2">Risk Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[10, 50, 100, 200, 400].map(lev => {
                            const margin = positionSize / lev;
                            const marginPct = (margin / accountBalance) * 100;
                            const risk = getRiskLevel(marginPct);
                            return (
                              <tr key={lev} className={`border-b ${lev === leverage ? 'bg-blue-50 font-semibold' : ''}`}>
                                <td className="py-2">{lev}:1</td>
                                <td className="text-right py-2">${margin.toLocaleString()}</td>
                                <td className="text-right py-2">{marginPct.toFixed(2)}%</td>
                                <td className={`text-right py-2 text-${risk.color}-600`}>{risk.level}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {!calculation && (
                <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                  <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Enter Your Trading Parameters</h3>
                  <p className="text-gray-500">Fill in the form on the left to calculate leverage effects and risk metrics.</p>
                </div>
              )}

              <div className="mt-8">
                <AdvancedChart symbol={symbol} />
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="bg-blue-50 rounded-lg p-6 mt-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Understanding Leverage in 2025
            </h3>
            <div className="text-blue-800 space-y-2 text-sm">
              <p><strong>Leverage:</strong> Allows you to control larger positions with smaller capital, amplifying both profits and losses.</p>
              <p><strong>Margin:</strong> The amount of money required to open a leveraged position, calculated as Position Size ÷ Leverage.</p>
              <p><strong>Margin Call:</strong> When account equity falls below required margin levels, brokers may request additional funds.</p>
              <p><strong>Liquidation:</strong> Automatic closure of positions when account equity falls too low to maintain positions.</p>
              <p className="mt-3 font-medium">⚠️ Warning: High leverage increases risk significantly. Never risk more than you can afford to lose, and always use proper risk management techniques including stop losses and position sizing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeverageCalculator;
