import React, { useState, useEffect } from 'react'
import { RefreshCw, Calculator, TrendingUp, TrendingDown, Clock, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BaseToolPage } from '@/components/tools/BaseToolPage'

interface SwapCalculation {
  dailySwap: number
  weeklySwap: number
  monthlySwap: number
  yearlySwap: number
  swapRate: number
  positionValue: number
}

interface SwapRates {
  long: number
  short: number
}

const instruments = [
  { 
    value: 'EURUSD', 
    label: 'EUR/USD', 
    type: 'Major Forex',
    swapRates: { long: -0.85, short: 0.45 }
  },
  { 
    value: 'GBPUSD', 
    label: 'GBP/USD', 
    type: 'Major Forex',
    swapRates: { long: -1.20, short: 0.65 }
  },
  { 
    value: 'USDJPY', 
    label: 'USD/JPY', 
    type: 'Major Forex',
    swapRates: { long: 2.15, short: -2.85 }
  },
  { 
    value: 'USDCHF', 
    label: 'USD/CHF', 
    type: 'Major Forex',
    swapRates: { long: 1.85, short: -2.45 }
  },
  { 
    value: 'AUDUSD', 
    label: 'AUD/USD', 
    type: 'Major Forex',
    swapRates: { long: -0.95, short: 0.55 }
  },
  { 
    value: 'USDCAD', 
    label: 'USD/CAD', 
    type: 'Major Forex',
    swapRates: { long: 1.25, short: -1.75 }
  },
  { 
    value: 'NZDUSD', 
    label: 'NZD/USD', 
    type: 'Minor Forex',
    swapRates: { long: -1.15, short: 0.75 }
  },
  { 
    value: 'EURGBP', 
    label: 'EUR/GBP', 
    type: 'Cross Forex',
    swapRates: { long: -0.65, short: 0.25 }
  },
  { 
    value: 'EURJPY', 
    label: 'EUR/JPY', 
    type: 'Cross Forex',
    swapRates: { long: 1.95, short: -2.65 }
  },
  { 
    value: 'GBPJPY', 
    label: 'GBP/JPY', 
    type: 'Cross Forex',
    swapRates: { long: 2.35, short: -3.15 }
  },
  { 
    value: 'XAUUSD', 
    label: 'Gold/USD', 
    type: 'Precious Metal',
    swapRates: { long: -8.50, short: 2.25 }
  },
  { 
    value: 'XAGUSD', 
    label: 'Silver/USD', 
    type: 'Precious Metal',
    swapRates: { long: -4.25, short: 1.15 }
  },
  { 
    value: 'USOIL', 
    label: 'Crude Oil', 
    type: 'Commodity',
    swapRates: { long: -2.85, short: -1.45 }
  }
]

const tradeTypes = [
  { value: 'long', label: 'Long (Buy)', icon: TrendingUp },
  { value: 'short', label: 'Short (Sell)', icon: TrendingDown }
]

const brokers = [
  { value: 'broker1', label: 'IC Markets', multiplier: 1.0 },
  { value: 'broker2', label: 'Pepperstone', multiplier: 1.1 },
  { value: 'broker3', label: 'XM', multiplier: 1.2 },
  { value: 'broker4', label: 'FXCM', multiplier: 1.15 },
  { value: 'broker5', label: 'IG', multiplier: 0.95 },
  { value: 'custom', label: 'Custom Rates', multiplier: 1.0 }
]

export function SwapCalculator() {
  const [selectedInstrument, setSelectedInstrument] = useState<string>('EURUSD')
  const [tradeType, setTradeType] = useState<string>('long')
  const [positionSize, setPositionSize] = useState<string>('100000')
  const [currentPrice, setCurrentPrice] = useState<string>('1.1000')
  const [selectedBroker, setSelectedBroker] = useState<string>('broker1')
  const [customLongRate, setCustomLongRate] = useState<string>('')
  const [customShortRate, setCustomShortRate] = useState<string>('')
  const [holdingDays, setHoldingDays] = useState<string>('7')
  const [calculation, setCalculation] = useState<SwapCalculation | null>(null)

  const calculateSwap = () => {
    const instrument = instruments.find(i => i.value === selectedInstrument)
    const broker = brokers.find(b => b.value === selectedBroker)
    
    if (!instrument || !broker) return

    const position = parseFloat(positionSize)
    const price = parseFloat(currentPrice)
    const days = parseFloat(holdingDays)

    if (!position || !price || !days) return

    let swapRate: number

    if (selectedBroker === 'custom') {
      const longRate = parseFloat(customLongRate) || 0
      const shortRate = parseFloat(customShortRate) || 0
      swapRate = tradeType === 'long' ? longRate : shortRate
    } else {
      const baseRate = tradeType === 'long' ? instrument.swapRates.long : instrument.swapRates.short
      swapRate = baseRate * broker.multiplier
    }

    // Calculate position value
    const positionValue = position * price

    // Calculate daily swap (simplified calculation)
    const dailySwap = (positionValue * swapRate) / 100 / 365

    // Calculate for different periods
    const weeklySwap = dailySwap * 7
    const monthlySwap = dailySwap * 30
    const yearlySwap = dailySwap * 365

    setCalculation({
      dailySwap: Math.round(dailySwap * 100) / 100,
      weeklySwap: Math.round(weeklySwap * 100) / 100,
      monthlySwap: Math.round(monthlySwap * 100) / 100,
      yearlySwap: Math.round(yearlySwap * 100) / 100,
      swapRate: Math.round(swapRate * 100) / 100,
      positionValue: Math.round(positionValue * 100) / 100
    })
  }

  useEffect(() => {
    calculateSwap()
  }, [selectedInstrument, tradeType, positionSize, currentPrice, selectedBroker, customLongRate, customShortRate, holdingDays])

  const handleSave = () => {
    if (calculation) {
      const data = {
        selectedInstrument,
        tradeType,
        positionSize,
        currentPrice,
        selectedBroker,
        customLongRate,
        customShortRate,
        holdingDays,
        calculation,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('swap-calculation', JSON.stringify(data))
      console.log('Swap calculation saved')
    }
  }

  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('instrument', selectedInstrument)
    url.searchParams.set('type', tradeType)
    url.searchParams.set('size', positionSize)
    url.searchParams.set('price', currentPrice)
    url.searchParams.set('broker', selectedBroker)
    url.searchParams.set('days', holdingDays)
    
    navigator.clipboard.writeText(url.toString())
    console.log('Calculation link copied to clipboard')
  }

  const handleExport = () => {
    if (!calculation) return

    const data = {
      'Instrument': selectedInstrument,
      'Trade Type': tradeType.toUpperCase(),
      'Position Size': positionSize,
      'Current Price': currentPrice,
      'Broker': brokers.find(b => b.value === selectedBroker)?.label || selectedBroker,
      'Swap Rate': `${calculation.swapRate}%`,
      'Position Value': `$${calculation.positionValue.toFixed(2)}`,
      'Daily Swap': `$${calculation.dailySwap.toFixed(2)}`,
      'Weekly Swap': `$${calculation.weeklySwap.toFixed(2)}`,
      'Monthly Swap': `$${calculation.monthlySwap.toFixed(2)}`,
      'Yearly Swap': `$${calculation.yearlySwap.toFixed(2)}`
    }

    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `swap-calculation-${selectedInstrument}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedInstrumentInfo = instruments.find(i => i.value === selectedInstrument)
  const selectedBrokerInfo = brokers.find(b => b.value === selectedBroker)

  return (
    <BaseToolPage
      title="Swap Calculator"
      description="Calculate overnight financing costs for holding positions across different brokers. Compare swap rates and understand the cost of carry for your trading strategy."
      category="Cost Analysis"
      difficulty="intermediate"
      features={['Broker comparison', 'Multiple instruments', 'Historical data', 'Cost projections', 'Custom rates']}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      seoTitle="Swap Calculator | Calculate Overnight Financing Costs"
      seoDescription="Free swap calculator to calculate overnight financing costs for forex, commodities, and CFD trading. Compare swap rates across brokers."
      seoKeywords="swap calculator, overnight financing, rollover costs, forex swap rates, trading costs calculator"
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
                  <div>Long Swap: {selectedInstrumentInfo.swapRates.long}%</div>
                  <div>Short Swap: {selectedInstrumentInfo.swapRates.short}%</div>
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
                Position Size (Units)
              </label>
              <Input
                type="number"
                value={positionSize}
                onChange={(e) => setPositionSize(e.target.value)}
                placeholder="100000"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Price
              </label>
              <Input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(e.target.value)}
                placeholder="1.1000"
                step="0.0001"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Broker
              </label>
              <Select value={selectedBroker} onValueChange={setSelectedBroker}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {brokers.map((broker) => (
                    <SelectItem key={broker.value} value={broker.value}>
                      {broker.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedBrokerInfo && selectedBroker !== 'custom' && (
                <div className="mt-2 p-2 bg-gray-800/50 rounded text-sm text-gray-400">
                  Rate Multiplier: {selectedBrokerInfo.multiplier}x
                </div>
              )}
            </div>

            {selectedBroker === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Long Swap Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={customLongRate}
                    onChange={(e) => setCustomLongRate(e.target.value)}
                    placeholder="-0.85"
                    step="0.01"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Short Swap Rate (%)
                  </label>
                  <Input
                    type="number"
                    value={customShortRate}
                    onChange={(e) => setCustomShortRate(e.target.value)}
                    placeholder="0.45"
                    step="0.01"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Holding Period (Days)
              </label>
              <Input
                type="number"
                value={holdingDays}
                onChange={(e) => setHoldingDays(e.target.value)}
                placeholder="7"
                min="1"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-400 mb-2">Quick Periods</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHoldingDays('1')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  1 Day
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHoldingDays('7')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  1 Week
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHoldingDays('30')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  1 Month
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {calculation && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Swap Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Daily Swap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.dailySwap >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.dailySwap >= 0 ? '+' : ''}${calculation.dailySwap.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Per Day</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Weekly Swap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.weeklySwap >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.weeklySwap >= 0 ? '+' : ''}${calculation.weeklySwap.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Per Week</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-400 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Monthly Swap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.monthlySwap >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.monthlySwap >= 0 ? '+' : ''}${calculation.monthlySwap.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Per Month</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/10 to-orange-800/10 border-orange-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Yearly Swap
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.yearlySwap >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.yearlySwap >= 0 ? '+' : ''}${calculation.yearlySwap.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Per Year</div>
                </CardContent>
              </Card>
            </div>

            {/* Holding Period Calculation */}
            <Card className="bg-gradient-to-br from-indigo-600/10 to-indigo-800/10 border-indigo-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-400">
                  Swap Cost for {holdingDays} Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${
                  (calculation.dailySwap * parseFloat(holdingDays)) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(calculation.dailySwap * parseFloat(holdingDays)) >= 0 ? '+' : ''}$
                  {(calculation.dailySwap * parseFloat(holdingDays)).toFixed(2)}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Total swap cost for holding the position for {holdingDays} days
                </div>
              </CardContent>
            </Card>

            {/* Broker Comparison */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Broker Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {brokers.filter(b => b.value !== 'custom').slice(0, 3).map((broker) => {
                    const baseRate = tradeType === 'long' 
                      ? selectedInstrumentInfo?.swapRates.long || 0
                      : selectedInstrumentInfo?.swapRates.short || 0
                    const adjustedRate = baseRate * broker.multiplier
                    const dailySwap = (calculation.positionValue * adjustedRate) / 100 / 365
                    
                    return (
                      <div key={broker.value} className="p-3 bg-gray-800/50 rounded">
                        <div className="text-sm text-gray-400 mb-1">{broker.label}</div>
                        <div className="text-lg font-medium text-white mb-1">
                          {adjustedRate.toFixed(2)}%
                        </div>
                        <div className={`text-sm font-medium ${
                          dailySwap >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {dailySwap >= 0 ? '+' : ''}${dailySwap.toFixed(2)}/day
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Swap Information */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Understanding Swap Rates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <p>Swap rates are charged for holding positions overnight (after 5 PM EST)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <p>Wednesday swaps are typically charged 3x to account for weekends</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <p>Positive swaps earn you money, negative swaps cost you money</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    4
                  </div>
                  <p>Swap rates vary between brokers and can change based on market conditions</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </BaseToolPage>
  )
}
