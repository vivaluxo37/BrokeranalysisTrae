import React, { useState, useEffect } from 'react'
import { PieChart, Calculator, TrendingUp, AlertTriangle, Shield, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BaseToolPage } from '@/components/tools/BaseToolPage'

interface MarginCalculation {
  requiredMargin: number
  freeMargin: number
  marginLevel: number
  leverageUsed: number
  positionValue: number
  marginPercentage: number
}

const instruments = [
  { value: 'EURUSD', label: 'EUR/USD', type: 'Major Forex', marginRate: 3.33 },
  { value: 'GBPUSD', label: 'GBP/USD', type: 'Major Forex', marginRate: 3.33 },
  { value: 'USDJPY', label: 'USD/JPY', type: 'Major Forex', marginRate: 3.33 },
  { value: 'USDCHF', label: 'USD/CHF', type: 'Major Forex', marginRate: 3.33 },
  { value: 'AUDUSD', label: 'AUD/USD', type: 'Major Forex', marginRate: 3.33 },
  { value: 'USDCAD', label: 'USD/CAD', type: 'Major Forex', marginRate: 3.33 },
  { value: 'NZDUSD', label: 'NZD/USD', type: 'Minor Forex', marginRate: 5.0 },
  { value: 'EURGBP', label: 'EUR/GBP', type: 'Cross Forex', marginRate: 5.0 },
  { value: 'EURJPY', label: 'EUR/JPY', type: 'Cross Forex', marginRate: 5.0 },
  { value: 'XAUUSD', label: 'Gold/USD', type: 'Precious Metal', marginRate: 2.0 },
  { value: 'XAGUSD', label: 'Silver/USD', type: 'Precious Metal', marginRate: 5.0 },
  { value: 'BTCUSD', label: 'Bitcoin/USD', type: 'Cryptocurrency', marginRate: 50.0 },
  { value: 'SPX500', label: 'S&P 500', type: 'Stock Index', marginRate: 1.0 },
  { value: 'NAS100', label: 'NASDAQ 100', type: 'Stock Index', marginRate: 1.0 },
  { value: 'USOIL', label: 'Crude Oil', type: 'Commodity', marginRate: 10.0 }
]

const leverageOptions = [
  { value: '30', label: '1:30' },
  { value: '50', label: '1:50' },
  { value: '100', label: '1:100' },
  { value: '200', label: '1:200' },
  { value: '400', label: '1:400' },
  { value: '500', label: '1:500' }
]

export function MarginCalculator() {
  const [accountBalance, setAccountBalance] = useState<string>('10000')
  const [selectedInstrument, setSelectedInstrument] = useState<string>('EURUSD')
  const [positionSize, setPositionSize] = useState<string>('100000')
  const [currentPrice, setCurrentPrice] = useState<string>('1.1000')
  const [leverage, setLeverage] = useState<string>('100')
  const [customMarginRate, setCustomMarginRate] = useState<string>('')
  const [calculation, setCalculation] = useState<MarginCalculation | null>(null)

  const calculateMargin = () => {
    const balance = parseFloat(accountBalance)
    const position = parseFloat(positionSize)
    const price = parseFloat(currentPrice)
    const lev = parseFloat(leverage)

    if (!balance || !position || !price || !lev) return

    const instrument = instruments.find(i => i.value === selectedInstrument)
    if (!instrument) return

    const marginRate = parseFloat(customMarginRate) || instrument.marginRate
    
    // Calculate position value
    const positionValue = position * price

    // Calculate required margin
    const requiredMargin = positionValue / lev

    // Alternative calculation using margin rate
    const requiredMarginByRate = (positionValue * marginRate) / 100

    // Use the higher of the two calculations for safety
    const finalRequiredMargin = Math.max(requiredMargin, requiredMarginByRate)

    // Calculate free margin
    const freeMargin = balance - finalRequiredMargin

    // Calculate margin level
    const marginLevel = (balance / finalRequiredMargin) * 100

    // Calculate leverage actually used
    const leverageUsed = positionValue / balance

    // Calculate margin percentage
    const marginPercentage = (finalRequiredMargin / balance) * 100

    setCalculation({
      requiredMargin: Math.round(finalRequiredMargin * 100) / 100,
      freeMargin: Math.round(freeMargin * 100) / 100,
      marginLevel: Math.round(marginLevel * 100) / 100,
      leverageUsed: Math.round(leverageUsed * 100) / 100,
      positionValue: Math.round(positionValue * 100) / 100,
      marginPercentage: Math.round(marginPercentage * 100) / 100
    })
  }

  useEffect(() => {
    calculateMargin()
  }, [accountBalance, selectedInstrument, positionSize, currentPrice, leverage, customMarginRate])

  const handleSave = () => {
    if (calculation) {
      const data = {
        accountBalance,
        selectedInstrument,
        positionSize,
        currentPrice,
        leverage,
        customMarginRate,
        calculation,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('margin-calculation', JSON.stringify(data))
      console.log('Margin calculation saved')
    }
  }

  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('balance', accountBalance)
    url.searchParams.set('instrument', selectedInstrument)
    url.searchParams.set('size', positionSize)
    url.searchParams.set('price', currentPrice)
    url.searchParams.set('leverage', leverage)
    
    navigator.clipboard.writeText(url.toString())
    console.log('Calculation link copied to clipboard')
  }

  const handleExport = () => {
    if (!calculation) return

    const instrument = instruments.find(i => i.value === selectedInstrument)
    
    const data = {
      'Account Balance': `$${accountBalance}`,
      'Instrument': selectedInstrument,
      'Position Size': positionSize,
      'Current Price': currentPrice,
      'Leverage': `1:${leverage}`,
      'Position Value': `$${calculation.positionValue.toFixed(2)}`,
      'Required Margin': `$${calculation.requiredMargin.toFixed(2)}`,
      'Free Margin': `$${calculation.freeMargin.toFixed(2)}`,
      'Margin Level': `${calculation.marginLevel.toFixed(2)}%`,
      'Leverage Used': `1:${calculation.leverageUsed.toFixed(2)}`,
      'Margin Percentage': `${calculation.marginPercentage.toFixed(2)}%`
    }

    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `margin-calculation-${selectedInstrument}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedInstrumentInfo = instruments.find(i => i.value === selectedInstrument)

  const getMarginLevelColor = (level: number) => {
    if (level >= 200) return 'text-accent-blue'
    if (level >= 100) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getMarginLevelStatus = (level: number) => {
    if (level >= 200) return 'Safe'
    if (level >= 100) return 'Caution'
    return 'Danger'
  }

  return (
    <BaseToolPage
      title="Margin Calculator"
      description="Calculate required margin for your trading positions across different instruments. Understand leverage usage and margin requirements to manage your trading risk effectively."
      category="Risk Management"
      difficulty="intermediate"
      features={['All instruments', 'Leverage options', 'Broker comparison', 'Real-time rates', 'Margin level analysis']}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      seoTitle="Margin Calculator | Calculate Trading Margin Requirements"
      seoDescription="Free margin calculator for forex, stocks, commodities, and crypto trading. Calculate required margin, free margin, and margin levels."
      seoKeywords="margin calculator, trading margin calculator, forex margin calculator, leverage calculator, margin requirements"
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
                  <div>Default Margin Rate: {selectedInstrumentInfo.marginRate}%</div>
                  <div>Type: {selectedInstrumentInfo.type}</div>
                </div>
              )}
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
          </div>

          <div className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Leverage
              </label>
              <Select value={leverage} onValueChange={setLeverage}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {leverageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Custom Margin Rate (%) - Optional
              </label>
              <Input
                type="number"
                value={customMarginRate}
                onChange={(e) => setCustomMarginRate(e.target.value)}
                placeholder={`Default: ${selectedInstrumentInfo?.marginRate || 0}%`}
                step="0.1"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-sm font-medium text-accent-blue mb-2">Quick Position Sizes</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPositionSize('10000')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  0.1 Lot
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPositionSize('50000')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  0.5 Lot
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPositionSize('100000')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  1.0 Lot
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {calculation && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Margin Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-accent-blue flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Required Margin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    ${calculation.requiredMargin.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">To Open Position</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-accent-blue flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Free Margin
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.freeMargin >= 0 ? 'text-accent-blue' : 'text-red-400'
                  }`}>
                    ${calculation.freeMargin.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Available for Trading</div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${
                calculation.marginLevel >= 200 
                  ? 'from-green-600/10 to-green-800/10 border-green-500/20'
                  : calculation.marginLevel >= 100
                  ? 'from-yellow-600/10 to-yellow-800/10 border-yellow-500/20'
                  : 'from-red-600/10 to-red-800/10 border-red-500/20'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-lg flex items-center gap-2 ${getMarginLevelColor(calculation.marginLevel)}`}>
                    <Shield className="w-5 h-5" />
                    Margin Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${getMarginLevelColor(calculation.marginLevel)}`}>
                    {calculation.marginLevel.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-400">{getMarginLevelStatus(calculation.marginLevel)}</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-accent-blue flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Position Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    ${calculation.positionValue.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Exposure</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/10 to-orange-800/10 border-orange-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Leverage Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    1:{calculation.leverageUsed.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Actual Leverage</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-600/10 to-indigo-800/10 border-indigo-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-400">Margin %</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {calculation.marginPercentage.toFixed(2)}%
                  </div>
                  <div className="text-sm text-gray-400">Of Account Balance</div>
                </CardContent>
              </Card>
            </div>

            {/* Margin Level Warning */}
            {calculation.marginLevel < 200 && (
              <Card className="bg-gradient-to-br from-orange-600/10 to-red-600/10 border-orange-500/20">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-400 mt-0.5" />
                    <div>
                      <h4 className="text-lg font-semibold text-orange-400 mb-2">Margin Level Warning</h4>
                      <div className="space-y-2 text-gray-300 text-sm">
                        {calculation.marginLevel < 100 && (
                          <p className="text-red-400 font-medium">
                            ⚠️ Margin Call Risk: Your margin level is below 100%. Consider reducing position size or adding funds.
                          </p>
                        )}
                        {calculation.marginLevel >= 100 && calculation.marginLevel < 200 && (
                          <p className="text-yellow-400 font-medium">
                            ⚠️ Low Margin Level: Your margin level is below 200%. Monitor your positions closely.
                          </p>
                        )}
                        <ul className="space-y-1 mt-2">
                          <li>• Margin Level above 200% is considered safe</li>
                          <li>• Below 100% may trigger margin calls</li>
                          <li>• Below 50% may result in automatic position closure</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leverage Comparison */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Leverage Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['30', '100', '200'].map((lev) => {
                    const requiredMargin = calculation.positionValue / parseFloat(lev)
                    const freeMargin = parseFloat(accountBalance) - requiredMargin
                    const marginLevel = (parseFloat(accountBalance) / requiredMargin) * 100
                    
                    return (
                      <div key={lev} className="p-3 bg-gray-800/50 rounded">
                        <div className="text-sm text-gray-400 mb-1">1:{lev} Leverage</div>
                        <div className="text-lg font-medium text-white mb-1">
                          ${requiredMargin.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-400">Required Margin</div>
                        <div className={`text-sm font-medium mt-1 ${getMarginLevelColor(marginLevel)}`}>
                          {marginLevel.toFixed(0)}% Level
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
