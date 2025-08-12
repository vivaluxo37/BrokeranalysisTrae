import React, { useState, useEffect } from 'react'
import { Calculator, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BaseToolPage } from '@/components/tools/BaseToolPage'

interface PositionCalculation {
  positionSize: number
  lotSize: number
  riskAmount: number
  pipValue: number
  stopLossPips: number
  potentialProfit: number
  riskRewardRatio: number
}

const currencyPairs = [
  { value: 'EURUSD', label: 'EUR/USD', pipValue: 10 },
  { value: 'GBPUSD', label: 'GBP/USD', pipValue: 10 },
  { value: 'USDJPY', label: 'USD/JPY', pipValue: 9.09 },
  { value: 'USDCHF', label: 'USD/CHF', pipValue: 10.87 },
  { value: 'AUDUSD', label: 'AUD/USD', pipValue: 10 },
  { value: 'USDCAD', label: 'USD/CAD', pipValue: 7.46 },
  { value: 'NZDUSD', label: 'NZD/USD', pipValue: 10 },
  { value: 'EURGBP', label: 'EUR/GBP', pipValue: 12.5 },
  { value: 'EURJPY', label: 'EUR/JPY', pipValue: 9.09 },
  { value: 'GBPJPY', label: 'GBP/JPY', pipValue: 9.09 }
]

export function PositionCalculator() {
  const [accountBalance, setAccountBalance] = useState<string>('10000')
  const [riskPercentage, setRiskPercentage] = useState<string>('2')
  const [entryPrice, setEntryPrice] = useState<string>('1.1000')
  const [stopLossPrice, setStopLossPrice] = useState<string>('1.0950')
  const [takeProfitPrice, setTakeProfitPrice] = useState<string>('1.1100')
  const [selectedPair, setSelectedPair] = useState<string>('EURUSD')
  const [calculation, setCalculation] = useState<PositionCalculation | null>(null)

  const calculatePosition = () => {
    const balance = parseFloat(accountBalance)
    const risk = parseFloat(riskPercentage)
    const entry = parseFloat(entryPrice)
    const stopLoss = parseFloat(stopLossPrice)
    const takeProfit = parseFloat(takeProfitPrice)
    
    if (!balance || !risk || !entry || !stopLoss) return

    const pair = currencyPairs.find(p => p.value === selectedPair)
    if (!pair) return

    const riskAmount = (balance * risk) / 100
    const stopLossPips = Math.abs(entry - stopLoss) * 10000
    const takeProfitPips = Math.abs(takeProfit - entry) * 10000
    const pipValue = pair.pipValue
    
    const positionSize = riskAmount / (stopLossPips * pipValue)
    const lotSize = positionSize / 100000
    const potentialProfit = takeProfitPips * pipValue * positionSize
    const riskRewardRatio = takeProfitPips / stopLossPips

    setCalculation({
      positionSize: Math.round(positionSize),
      lotSize: Math.round(lotSize * 100) / 100,
      riskAmount,
      pipValue,
      stopLossPips: Math.round(stopLossPips),
      potentialProfit: Math.round(potentialProfit * 100) / 100,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100
    })
  }

  useEffect(() => {
    calculatePosition()
  }, [accountBalance, riskPercentage, entryPrice, stopLossPrice, takeProfitPrice, selectedPair])

  const handleSave = () => {
    if (calculation) {
      const data = {
        accountBalance,
        riskPercentage,
        entryPrice,
        stopLossPrice,
        takeProfitPrice,
        selectedPair,
        calculation,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('position-calculation', JSON.stringify(data))
      console.log('Position calculation saved')
    }
  }

  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('balance', accountBalance)
    url.searchParams.set('risk', riskPercentage)
    url.searchParams.set('entry', entryPrice)
    url.searchParams.set('stop', stopLossPrice)
    url.searchParams.set('target', takeProfitPrice)
    url.searchParams.set('pair', selectedPair)
    
    navigator.clipboard.writeText(url.toString())
    console.log('Calculation link copied to clipboard')
  }

  const handleExport = () => {
    if (!calculation) return

    const data = {
      'Account Balance': `$${accountBalance}`,
      'Risk Percentage': `${riskPercentage}%`,
      'Currency Pair': selectedPair,
      'Entry Price': entryPrice,
      'Stop Loss Price': stopLossPrice,
      'Take Profit Price': takeProfitPrice,
      'Position Size': calculation.positionSize.toLocaleString(),
      'Lot Size': calculation.lotSize,
      'Risk Amount': `$${calculation.riskAmount.toFixed(2)}`,
      'Stop Loss Pips': calculation.stopLossPips,
      'Potential Profit': `$${calculation.potentialProfit.toFixed(2)}`,
      'Risk/Reward Ratio': `1:${calculation.riskRewardRatio}`
    }

    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `position-calculation-${selectedPair}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <BaseToolPage
      title="Position Size Calculator"
      description="Calculate optimal position sizes based on your risk management rules and account balance. Determine the right lot size to risk only what you can afford to lose."
      category="Risk Management"
      difficulty="intermediate"
      features={['Risk percentage', 'Stop loss levels', 'Multiple currencies', 'Lot size calculation', 'Risk-reward analysis']}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      seoTitle="Position Size Calculator | Risk Management Tool for Forex Trading"
      seoDescription="Calculate optimal position sizes for forex trading based on your account balance and risk tolerance. Free position size calculator with risk management features."
      seoKeywords="position size calculator, forex position calculator, risk management, lot size calculator, trading calculator"
    >
      <div className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Balance ($)
              </label>
              <Input
                type="number"
                value={accountBalance}
                onChange={(e) => setAccountBalance(e.target.value)}
                placeholder="10000"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Risk Percentage (%)
              </label>
              <Input
                type="number"
                value={riskPercentage}
                onChange={(e) => setRiskPercentage(e.target.value)}
                placeholder="2"
                min="0.1"
                max="10"
                step="0.1"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Currency Pair
              </label>
              <Select value={selectedPair} onValueChange={setSelectedPair}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {currencyPairs.map((pair) => (
                    <SelectItem key={pair.value} value={pair.value}>
                      {pair.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Stop Loss Price
              </label>
              <Input
                type="number"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(e.target.value)}
                placeholder="1.0950"
                step="0.0001"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Take Profit Price (Optional)
              </label>
              <Input
                type="number"
                value={takeProfitPrice}
                onChange={(e) => setTakeProfitPrice(e.target.value)}
                placeholder="1.1100"
                step="0.0001"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {calculation && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Position Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {calculation.positionSize.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Units</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Lot Size
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {calculation.lotSize}
                  </div>
                  <div className="text-sm text-gray-400">Standard Lots</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-600/10 to-red-800/10 border-red-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-red-400 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Risk Amount
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    ${calculation.riskAmount.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Maximum Loss</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-400">Stop Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {calculation.stopLossPips}
                  </div>
                  <div className="text-sm text-gray-400">Pips</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-600/10 to-yellow-800/10 border-yellow-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-yellow-400">Potential Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    ${calculation.potentialProfit.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">If TP Hit</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-600/10 to-indigo-800/10 border-indigo-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-400">Risk/Reward</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    1:{calculation.riskRewardRatio}
                  </div>
                  <div className="text-sm text-gray-400">Ratio</div>
                </CardContent>
              </Card>
            </div>

            {/* Risk Warning */}
            <Card className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border-orange-500/20">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5" />
                  <div>
                    <h4 className="text-lg font-semibold text-orange-400 mb-2">Risk Management Tips</h4>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li>• Never risk more than 1-3% of your account on a single trade</li>
                      <li>• Always use stop losses to limit potential losses</li>
                      <li>• Consider the risk-reward ratio before entering trades</li>
                      <li>• Adjust position size based on market volatility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </BaseToolPage>
  )
}
