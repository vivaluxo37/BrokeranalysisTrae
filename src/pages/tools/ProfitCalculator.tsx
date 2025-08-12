import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Calculator, BarChart3, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BaseToolPage } from '@/components/tools/BaseToolPage'

interface ProfitCalculation {
  grossProfit: number
  netProfit: number
  commission: number
  spread: number
  totalCosts: number
  profitPercentage: number
  pipMovement: number
  riskRewardRatio: number
}

const instruments = [
  { value: 'EURUSD', label: 'EUR/USD', type: 'forex', commission: 0, spread: 0.8 },
  { value: 'GBPUSD', label: 'GBP/USD', type: 'forex', commission: 0, spread: 1.2 },
  { value: 'USDJPY', label: 'USD/JPY', type: 'forex', commission: 0, spread: 0.9 },
  { value: 'XAUUSD', label: 'Gold/USD', type: 'commodity', commission: 0, spread: 3.5 },
  { value: 'BTCUSD', label: 'Bitcoin/USD', type: 'crypto', commission: 0.1, spread: 50 },
  { value: 'SPX500', label: 'S&P 500', type: 'index', commission: 0.02, spread: 0.4 },
  { value: 'AAPL', label: 'Apple Inc.', type: 'stock', commission: 1, spread: 0.01 },
  { value: 'TSLA', label: 'Tesla Inc.', type: 'stock', commission: 1, spread: 0.02 }
]

const tradeTypes = [
  { value: 'buy', label: 'Buy (Long)', icon: TrendingUp },
  { value: 'sell', label: 'Sell (Short)', icon: TrendingDown }
]

export function ProfitCalculator() {
  const [selectedInstrument, setSelectedInstrument] = useState<string>('EURUSD')
  const [tradeType, setTradeType] = useState<string>('buy')
  const [positionSize, setPositionSize] = useState<string>('100000')
  const [entryPrice, setEntryPrice] = useState<string>('1.1000')
  const [exitPrice, setExitPrice] = useState<string>('1.1050')
  const [customCommission, setCustomCommission] = useState<string>('')
  const [customSpread, setCustomSpread] = useState<string>('')
  const [calculation, setCalculation] = useState<ProfitCalculation | null>(null)

  const calculateProfit = () => {
    const instrument = instruments.find(i => i.value === selectedInstrument)
    if (!instrument) return

    const position = parseFloat(positionSize)
    const entry = parseFloat(entryPrice)
    const exit = parseFloat(exitPrice)

    if (!position || !entry || !exit) return

    const commission = parseFloat(customCommission) || instrument.commission
    const spread = parseFloat(customSpread) || instrument.spread

    let grossProfit: number
    let pipMovement: number

    if (instrument.type === 'forex') {
      // Forex calculation
      const pipDifference = tradeType === 'buy' ? (exit - entry) : (entry - exit)
      pipMovement = Math.abs(pipDifference * 10000)
      
      if (selectedInstrument.includes('JPY')) {
        pipMovement = Math.abs(pipDifference * 100)
      }

      grossProfit = (pipDifference * position)
    } else if (instrument.type === 'stock') {
      // Stock calculation
      const priceDifference = tradeType === 'buy' ? (exit - entry) : (entry - exit)
      grossProfit = priceDifference * position
      pipMovement = Math.abs(priceDifference)
    } else {
      // Other instruments (commodities, indices, crypto)
      const priceDifference = tradeType === 'buy' ? (exit - entry) : (entry - exit)
      grossProfit = priceDifference * position
      pipMovement = Math.abs(priceDifference)
    }

    // Calculate costs
    const commissionCost = commission * position
    const spreadCost = spread * position / 10000 // Simplified spread cost
    const totalCosts = commissionCost + spreadCost

    const netProfit = grossProfit - totalCosts
    const profitPercentage = (netProfit / (entry * position)) * 100

    // Risk-reward ratio (simplified)
    const riskAmount = Math.abs(entry - exit) * position * 0.02 // Assume 2% risk
    const riskRewardRatio = netProfit > 0 ? Math.abs(netProfit / riskAmount) : 0

    setCalculation({
      grossProfit: Math.round(grossProfit * 100) / 100,
      netProfit: Math.round(netProfit * 100) / 100,
      commission: Math.round(commissionCost * 100) / 100,
      spread: Math.round(spreadCost * 100) / 100,
      totalCosts: Math.round(totalCosts * 100) / 100,
      profitPercentage: Math.round(profitPercentage * 100) / 100,
      pipMovement: Math.round(pipMovement * 100) / 100,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100
    })
  }

  useEffect(() => {
    calculateProfit()
  }, [selectedInstrument, tradeType, positionSize, entryPrice, exitPrice, customCommission, customSpread])

  const handleSave = () => {
    if (calculation) {
      const data = {
        selectedInstrument,
        tradeType,
        positionSize,
        entryPrice,
        exitPrice,
        customCommission,
        customSpread,
        calculation,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('profit-calculation', JSON.stringify(data))
      console.log('Profit calculation saved')
    }
  }

  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('instrument', selectedInstrument)
    url.searchParams.set('type', tradeType)
    url.searchParams.set('size', positionSize)
    url.searchParams.set('entry', entryPrice)
    url.searchParams.set('exit', exitPrice)
    
    navigator.clipboard.writeText(url.toString())
    console.log('Calculation link copied to clipboard')
  }

  const handleExport = () => {
    if (!calculation) return

    const instrument = instruments.find(i => i.value === selectedInstrument)
    
    const data = {
      'Instrument': selectedInstrument,
      'Trade Type': tradeType.toUpperCase(),
      'Position Size': positionSize,
      'Entry Price': entryPrice,
      'Exit Price': exitPrice,
      'Gross Profit': `$${calculation.grossProfit.toFixed(2)}`,
      'Commission': `$${calculation.commission.toFixed(2)}`,
      'Spread Cost': `$${calculation.spread.toFixed(2)}`,
      'Total Costs': `$${calculation.totalCosts.toFixed(2)}`,
      'Net Profit': `$${calculation.netProfit.toFixed(2)}`,
      'Profit Percentage': `${calculation.profitPercentage.toFixed(2)}%`,
      'Price Movement': calculation.pipMovement,
      'Risk/Reward Ratio': `1:${calculation.riskRewardRatio}`
    }

    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `profit-calculation-${selectedInstrument}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedInstrumentInfo = instruments.find(i => i.value === selectedInstrument)

  return (
    <BaseToolPage
      title="Profit Calculator"
      description="Calculate potential profits and losses for your trading positions. Analyze the impact of commissions, spreads, and position sizes on your trading results."
      category="Risk Management"
      difficulty="beginner"
      features={['Multiple instruments', 'Entry/exit prices', 'Commission included', 'Risk-reward ratios', 'Percentage returns']}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      seoTitle="Profit Calculator | Calculate Trading Profits and Losses"
      seoDescription="Free trading profit calculator for forex, stocks, commodities, and crypto. Calculate net profits including commissions and spreads."
      seoKeywords="profit calculator, trading profit calculator, forex profit calculator, stock profit calculator, trading calculator"
    >
      <div className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Instrument
              </label>
              <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {instruments.map((instrument) => (
                    <SelectItem key={instrument.value} value={instrument.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{instrument.label}</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {instrument.type}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedInstrumentInfo && (
                <div className="mt-2 p-2 bg-gray-800/50 rounded text-sm text-gray-400">
                  <div>Default Commission: ${selectedInstrumentInfo.commission}</div>
                  <div>Default Spread: {selectedInstrumentInfo.spread}</div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trade Type
              </label>
              <Select value={tradeType} onValueChange={setTradeType}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {tradeTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Position Size
              </label>
              <Input
                type="number"
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                placeholder="100000"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <div className="mt-1 text-xs text-gray-400">
                {selectedInstrumentInfo?.type === 'forex' ? 'Units' : 
                 selectedInstrumentInfo?.type === 'stock' ? 'Shares' : 'Units'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Entry Price
              </label>
              <Input
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder="1.1000"
                step="0.0001"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Exit Price
              </label>
              <Input
                type="number"
                value={exitPrice}
                onChange={(e) => setExitPrice(e.target.value)}
                placeholder="1.1050"
                step="0.0001"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Commission (Optional)
              </label>
              <Input
                type="number"
                value={customCommission}
                onChange={(e) => setCustomCommission(e.target.value)}
                placeholder={`Default: ${selectedInstrumentInfo?.commission || 0}`}
                step="0.01"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Spread (Optional)
              </label>
              <Input
                type="number"
                value={customSpread}
                onChange={(e) => setCustomSpread(e.target.value)}
                placeholder={`Default: ${selectedInstrumentInfo?.spread || 0}`}
                step="0.1"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-400 mb-2">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const entry = parseFloat(entryPrice)
                    if (entry) {
                      setExitPrice((entry * 1.005).toFixed(4)) // 0.5% profit
                    }
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  +0.5% Target
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const entry = parseFloat(entryPrice)
                    if (entry) {
                      setExitPrice((entry * 0.995).toFixed(4)) // 0.5% loss
                    }
                  }}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  -0.5% Stop
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {calculation && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Gross Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.grossProfit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.grossProfit >= 0 ? '+' : ''}${calculation.grossProfit.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Before Costs</div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${
                calculation.netProfit >= 0 
                  ? 'from-green-600/10 to-green-800/10 border-green-500/20' 
                  : 'from-red-600/10 to-red-800/10 border-red-500/20'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-lg flex items-center gap-2 ${
                    calculation.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <DollarSign className="w-5 h-5" />
                    Net Profit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.netProfit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.netProfit >= 0 ? '+' : ''}${calculation.netProfit.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">After Costs</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/10 to-orange-800/10 border-orange-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Total Costs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    ${calculation.totalCosts.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Commission + Spread</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-400 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Return %
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.profitPercentage >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.profitPercentage >= 0 ? '+' : ''}{calculation.profitPercentage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-400">Of Investment</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Commission</span>
                    <span className="text-white font-medium">${calculation.commission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Spread Cost</span>
                    <span className="text-white font-medium">${calculation.spread.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                    <span className="text-gray-300">Price Movement</span>
                    <span className="text-white font-medium">
                      {calculation.pipMovement.toFixed(selectedInstrumentInfo?.type === 'forex' ? 1 : 4)}
                      {selectedInstrumentInfo?.type === 'forex' ? ' pips' : ' points'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Analysis */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Scenario Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[-2, -1, 0, 1, 2].map((percentage) => {
                    const entry = parseFloat(entryPrice)
                    const newExit = entry * (1 + percentage / 100)
                    const priceDiff = tradeType === 'buy' ? (newExit - entry) : (entry - newExit)
                    const grossProfit = priceDiff * parseFloat(positionSize)
                    const netProfit = grossProfit - calculation.totalCosts
                    
                    return (
                      <div key={percentage} className="p-3 bg-gray-800/50 rounded">
                        <div className="text-sm text-gray-400 mb-1">
                          {percentage > 0 ? '+' : ''}{percentage}% Move
                        </div>
                        <div className="text-lg font-medium text-white mb-1">
                          ${newExit.toFixed(4)}
                        </div>
                        <div className={`text-sm font-medium ${
                          netProfit >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {netProfit >= 0 ? '+' : ''}${netProfit.toFixed(2)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </BaseToolPage>
  )
}
