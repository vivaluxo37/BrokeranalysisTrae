import React, { useState, useEffect } from 'react'
import { Calculator, DollarSign, TrendingUp, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BaseToolPage } from '@/components/tools/BaseToolPage'

interface PipCalculation {
  pipValue: number
  totalValue: number
  profitLoss: number
  percentage: number
}

const currencyPairs = [
  { 
    value: 'EURUSD', 
    label: 'EUR/USD', 
    pipPosition: 4,
    baseValue: 10,
    description: 'Euro vs US Dollar'
  },
  { 
    value: 'GBPUSD', 
    label: 'GBP/USD', 
    pipPosition: 4,
    baseValue: 10,
    description: 'British Pound vs US Dollar'
  },
  { 
    value: 'USDJPY', 
    label: 'USD/JPY', 
    pipPosition: 2,
    baseValue: 9.09,
    description: 'US Dollar vs Japanese Yen'
  },
  { 
    value: 'USDCHF', 
    label: 'USD/CHF', 
    pipPosition: 4,
    baseValue: 10.87,
    description: 'US Dollar vs Swiss Franc'
  },
  { 
    value: 'AUDUSD', 
    label: 'AUD/USD', 
    pipPosition: 4,
    baseValue: 10,
    description: 'Australian Dollar vs US Dollar'
  },
  { 
    value: 'USDCAD', 
    label: 'USD/CAD', 
    pipPosition: 4,
    baseValue: 7.46,
    description: 'US Dollar vs Canadian Dollar'
  },
  { 
    value: 'NZDUSD', 
    label: 'NZD/USD', 
    pipPosition: 4,
    baseValue: 10,
    description: 'New Zealand Dollar vs US Dollar'
  },
  { 
    value: 'EURGBP', 
    label: 'EUR/GBP', 
    pipPosition: 4,
    baseValue: 12.5,
    description: 'Euro vs British Pound'
  },
  { 
    value: 'EURJPY', 
    label: 'EUR/JPY', 
    pipPosition: 2,
    baseValue: 9.09,
    description: 'Euro vs Japanese Yen'
  },
  { 
    value: 'GBPJPY', 
    label: 'GBP/JPY', 
    pipPosition: 2,
    baseValue: 9.09,
    description: 'British Pound vs Japanese Yen'
  }
]

const accountCurrencies = [
  { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
  { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
  { value: 'GBP', label: 'GBP - British Pound', symbol: '£' },
  { value: 'JPY', label: 'JPY - Japanese Yen', symbol: '¥' },
  { value: 'AUD', label: 'AUD - Australian Dollar', symbol: 'A$' },
  { value: 'CAD', label: 'CAD - Canadian Dollar', symbol: 'C$' },
  { value: 'CHF', label: 'CHF - Swiss Franc', symbol: 'CHF' },
  { value: 'NZD', label: 'NZD - New Zealand Dollar', symbol: 'NZ$' }
]

export function PipCalculator() {
  const [selectedPair, setSelectedPair] = useState<string>('EURUSD')
  const [positionSize, setPositionSize] = useState<string>('100000')
  const [accountCurrency, setAccountCurrency] = useState<string>('USD')
  const [pipMovement, setPipMovement] = useState<string>('10')
  const [currentPrice, setCurrentPrice] = useState<string>('1.1000')
  const [calculation, setCalculation] = useState<PipCalculation | null>(null)

  const calculatePipValue = () => {
    const pair = currencyPairs.find(p => p.value === selectedPair)
    const accountCurr = accountCurrencies.find(c => c.value === accountCurrency)
    
    if (!pair || !accountCurr) return

    const position = parseFloat(positionSize)
    const pips = parseFloat(pipMovement)
    const price = parseFloat(currentPrice)

    if (!position || !pips || !price) return

    // Calculate pip value based on position size
    let pipValue: number
    
    if (pair.pipPosition === 4) {
      // Most pairs (4 decimal places)
      pipValue = (position * 0.0001) / price
    } else {
      // JPY pairs (2 decimal places)
      pipValue = (position * 0.01) / price
    }

    // Adjust for account currency (simplified conversion)
    if (accountCurrency !== 'USD') {
      pipValue *= 1.1 // Simplified conversion rate
    }

    const totalValue = pipValue * pips
    const profitLoss = totalValue
    const percentage = (profitLoss / position) * 100

    setCalculation({
      pipValue: Math.round(pipValue * 100) / 100,
      totalValue: Math.round(totalValue * 100) / 100,
      profitLoss: Math.round(profitLoss * 100) / 100,
      percentage: Math.round(percentage * 10000) / 10000
    })
  }

  useEffect(() => {
    calculatePipValue()
  }, [selectedPair, positionSize, accountCurrency, pipMovement, currentPrice])

  const handleSave = () => {
    if (calculation) {
      const data = {
        selectedPair,
        positionSize,
        accountCurrency,
        pipMovement,
        currentPrice,
        calculation,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('pip-calculation', JSON.stringify(data))
      console.log('Pip calculation saved')
    }
  }

  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('pair', selectedPair)
    url.searchParams.set('size', positionSize)
    url.searchParams.set('currency', accountCurrency)
    url.searchParams.set('pips', pipMovement)
    url.searchParams.set('price', currentPrice)
    
    navigator.clipboard.writeText(url.toString())
    console.log('Calculation link copied to clipboard')
  }

  const handleExport = () => {
    if (!calculation) return

    const pair = currencyPairs.find(p => p.value === selectedPair)
    const accountCurr = accountCurrencies.find(c => c.value === accountCurrency)

    const data = {
      'Currency Pair': selectedPair,
      'Position Size': positionSize,
      'Account Currency': accountCurrency,
      'Pip Movement': pipMovement,
      'Current Price': currentPrice,
      'Pip Value': `${accountCurr?.symbol}${calculation.pipValue.toFixed(2)}`,
      'Total Value': `${accountCurr?.symbol}${calculation.totalValue.toFixed(2)}`,
      'Profit/Loss': `${accountCurr?.symbol}${calculation.profitLoss.toFixed(2)}`,
      'Percentage': `${calculation.percentage.toFixed(4)}%`
    }

    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pip-calculation-${selectedPair}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedPairInfo = currencyPairs.find(p => p.value === selectedPair)
  const selectedAccountCurrency = accountCurrencies.find(c => c.value === accountCurrency)

  return (
    <BaseToolPage
      title="Pip Calculator"
      description="Calculate the value of a pip for any currency pair and position size. Understand how much each pip movement is worth in your account currency."
      category="Risk Management"
      difficulty="beginner"
      features={['All currency pairs', 'Custom position sizes', 'Real-time rates', 'Multiple account currencies', 'Profit/loss calculation']}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      seoTitle="Pip Calculator | Calculate Pip Value for Forex Trading"
      seoDescription="Free pip calculator to determine the value of each pip movement in your trades. Calculate pip values for all major currency pairs and position sizes."
      seoKeywords="pip calculator, pip value calculator, forex pip calculator, currency pip value, trading calculator"
    >
      <div className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
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
                      <div className="flex flex-col">
                        <span>{pair.label}</span>
                        <span className="text-xs text-gray-400">{pair.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedPairInfo && (
                <div className="mt-2 p-2 bg-gray-800/50 rounded text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>Pip position: {selectedPairInfo.pipPosition} decimal places</span>
                  </div>
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
              <div className="mt-1 text-xs text-gray-400">
                Standard lot = 100,000 units, Mini lot = 10,000 units, Micro lot = 1,000 units
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Currency
              </label>
              <Select value={accountCurrency} onValueChange={setAccountCurrency}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {accountCurrencies.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                Pip Movement
              </label>
              <Input
                type="number"
                value={pipMovement}
                onChange={(e) => setPipMovement(e.target.value)}
                placeholder="10"
                className="bg-gray-800 border-gray-600 text-white"
              />
              <div className="mt-1 text-xs text-gray-400">
                Enter positive number for profit, negative for loss
              </div>
            </div>

            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-400 mb-2">Quick Lot Sizes</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPositionSize('1000')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Micro (1K)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPositionSize('10000')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Mini (10K)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPositionSize('100000')}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Standard (100K)
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {calculation && selectedAccountCurrency && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Calculation Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Pip Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {selectedAccountCurrency.symbol}{calculation.pipValue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">Per Pip</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {selectedAccountCurrency.symbol}{Math.abs(calculation.totalValue).toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">{pipMovement} Pips</div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${
                calculation.profitLoss >= 0 
                  ? 'from-green-600/10 to-green-800/10 border-green-500/20' 
                  : 'from-red-600/10 to-red-800/10 border-red-500/20'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-lg flex items-center gap-2 ${
                    calculation.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendingUp className="w-5 h-5" />
                    P&L
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.profitLoss >= 0 ? '+' : ''}{selectedAccountCurrency.symbol}{calculation.profitLoss.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {calculation.profitLoss >= 0 ? 'Profit' : 'Loss'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-purple-400">Percentage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold mb-1 ${
                    calculation.percentage >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {calculation.percentage >= 0 ? '+' : ''}{calculation.percentage.toFixed(4)}%
                  </div>
                  <div className="text-sm text-gray-400">Of Position</div>
                </CardContent>
              </Card>
            </div>

            {/* Pip Movement Examples */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Pip Movement Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[-10, -5, -1, 1, 5, 10].map((pips) => {
                    const value = calculation.pipValue * pips
                    return (
                      <div key={pips} className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                        <span className="text-gray-300">{pips > 0 ? '+' : ''}{pips} pips</span>
                        <span className={`font-medium ${
                          value >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {value >= 0 ? '+' : ''}{selectedAccountCurrency.symbol}{value.toFixed(2)}
                        </span>
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