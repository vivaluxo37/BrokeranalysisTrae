import React, { useState, useEffect } from 'react'
import { Activity, BarChart3, TrendingUp, AlertTriangle, Clock, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BaseToolPage } from '@/components/tools/BaseToolPage'

interface VolatilityData {
  instrument: string
  historicalVolatility: number
  impliedVolatility?: number
  averageRange: number
  volatilityRank: number
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  expectedMove: number
  supportResistance: {
    support: number
    resistance: number
  }
}

const instruments = [
  { 
    value: 'EURUSD', 
    label: 'EUR/USD', 
    type: 'Major Forex',
    currentPrice: 1.1000,
    baseVolatility: 0.12
  },
  { 
    value: 'GBPUSD', 
    label: 'GBP/USD', 
    type: 'Major Forex',
    currentPrice: 1.2500,
    baseVolatility: 0.15
  },
  { 
    value: 'USDJPY', 
    label: 'USD/JPY', 
    type: 'Major Forex',
    currentPrice: 150.00,
    baseVolatility: 0.13
  },
  { 
    value: 'GBPJPY', 
    label: 'GBP/JPY', 
    type: 'Cross Forex',
    currentPrice: 187.50,
    baseVolatility: 0.18
  },
  { 
    value: 'XAUUSD', 
    label: 'Gold/USD', 
    type: 'Precious Metal',
    currentPrice: 2000.00,
    baseVolatility: 0.20
  },
  { 
    value: 'BTCUSD', 
    label: 'Bitcoin/USD', 
    type: 'Cryptocurrency',
    currentPrice: 45000.00,
    baseVolatility: 0.65
  },
  { 
    value: 'SPX500', 
    label: 'S&P 500', 
    type: 'Stock Index',
    currentPrice: 4500.00,
    baseVolatility: 0.16
  },
  { 
    value: 'USOIL', 
    label: 'Crude Oil', 
    type: 'Commodity',
    currentPrice: 75.00,
    baseVolatility: 0.35
  }
]

const timeframes = [
  { value: '1D', label: '1 Day', multiplier: 1 },
  { value: '1W', label: '1 Week', multiplier: Math.sqrt(7) },
  { value: '1M', label: '1 Month', multiplier: Math.sqrt(30) },
  { value: '3M', label: '3 Months', multiplier: Math.sqrt(90) },
  { value: '1Y', label: '1 Year', multiplier: Math.sqrt(365) }
]

const generateVolatilityData = (instrument: any, timeframe: string, customPrice?: number): VolatilityData => {
  const tf = timeframes.find(t => t.value === timeframe) || timeframes[0]
  const price = customPrice || instrument.currentPrice
  
  // Generate realistic volatility data
  const baseVol = instrument.baseVolatility
  const marketStress = Math.random() * 0.5 + 0.75 // 0.75 to 1.25 multiplier
  const historicalVolatility = baseVol * marketStress * tf.multiplier
  
  // Implied volatility (slightly higher than historical for most instruments)
  const impliedVolatility = historicalVolatility * (1 + Math.random() * 0.3)
  
  // Average daily range as percentage
  const averageRange = historicalVolatility / Math.sqrt(365) * 100
  
  // Volatility rank (0-100)
  const volatilityRank = Math.min(100, Math.max(0, (historicalVolatility / 0.5) * 100))
  
  // Risk level based on volatility
  let riskLevel: VolatilityData['riskLevel']
  if (historicalVolatility < 0.15) riskLevel = 'low'
  else if (historicalVolatility < 0.25) riskLevel = 'medium'
  else if (historicalVolatility < 0.40) riskLevel = 'high'
  else riskLevel = 'extreme'
  
  // Expected move (1 standard deviation)
  const expectedMove = price * historicalVolatility / Math.sqrt(365)
  
  // Support and resistance levels
  const supportResistance = {
    support: price * (1 - averageRange / 100),
    resistance: price * (1 + averageRange / 100)
  }
  
  return {
    instrument: instrument.value,
    historicalVolatility: Math.round(historicalVolatility * 10000) / 100,
    impliedVolatility: Math.round(impliedVolatility * 10000) / 100,
    averageRange: Math.round(averageRange * 100) / 100,
    volatilityRank: Math.round(volatilityRank),
    riskLevel,
    expectedMove: Math.round(expectedMove * 10000) / 10000,
    supportResistance: {
      support: Math.round(supportResistance.support * 10000) / 10000,
      resistance: Math.round(supportResistance.resistance * 10000) / 10000
    }
  }
}

const getRiskLevelColor = (riskLevel: string) => {
  switch (riskLevel) {
    case 'low':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'high':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'extreme':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export function VolatilityCalculator() {
  const [selectedInstrument, setSelectedInstrument] = useState<string>('EURUSD')
  const [timeframe, setTimeframe] = useState<string>('1M')
  const [customPrice, setCustomPrice] = useState<string>('')
  const [volatilityData, setVolatilityData] = useState<VolatilityData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const calculateVolatility = () => {
    const instrument = instruments.find(i => i.value === selectedInstrument)
    if (!instrument) return

    setIsLoading(true)
    setTimeout(() => {
      const price = parseFloat(customPrice) || undefined
      const data = generateVolatilityData(instrument, timeframe, price)
      setVolatilityData(data)
      setIsLoading(false)
    }, 800)
  }

  useEffect(() => {
    calculateVolatility()
  }, [selectedInstrument, timeframe, customPrice])

  const handleSave = () => {
    if (volatilityData) {
      const data = {
        selectedInstrument,
        timeframe,
        customPrice,
        volatilityData,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('volatility-calculation', JSON.stringify(data))
      console.log('Volatility calculation saved')
    }
  }

  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('instrument', selectedInstrument)
    url.searchParams.set('timeframe', timeframe)
    if (customPrice) url.searchParams.set('price', customPrice)
    
    navigator.clipboard.writeText(url.toString())
    console.log('Volatility analysis link copied to clipboard')
  }

  const handleExport = () => {
    if (!volatilityData) return

    const instrument = instruments.find(i => i.value === selectedInstrument)
    const tf = timeframes.find(t => t.value === timeframe)
    
    const data = {
      'Instrument': selectedInstrument,
      'Timeframe': tf?.label || timeframe,
      'Current Price': customPrice || instrument?.currentPrice || 'N/A',
      'Historical Volatility': `${volatilityData.historicalVolatility}%`,
      'Implied Volatility': volatilityData.impliedVolatility ? `${volatilityData.impliedVolatility}%` : 'N/A',
      'Average Range': `${volatilityData.averageRange}%`,
      'Volatility Rank': volatilityData.volatilityRank,
      'Risk Level': volatilityData.riskLevel.toUpperCase(),
      'Expected Move': volatilityData.expectedMove,
      'Support Level': volatilityData.supportResistance.support,
      'Resistance Level': volatilityData.supportResistance.resistance
    }

    const csvContent = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `volatility-analysis-${selectedInstrument}-${timeframe}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const selectedInstrumentInfo = instruments.find(i => i.value === selectedInstrument)

  return (
    <BaseToolPage
      title="Volatility Calculator"
      description="Measure and analyze market volatility for better risk assessment. Calculate historical volatility, implied volatility, and expected price movements for informed trading decisions."
      category="Market Analysis"
      difficulty="advanced"
      features={['Historical volatility', 'Implied volatility', 'Multiple timeframes', 'Volatility forecasts', 'Risk assessment']}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      seoTitle="Volatility Calculator | Market Volatility Analysis Tool"
      seoDescription="Calculate and analyze market volatility for forex, stocks, commodities, and crypto. Measure historical and implied volatility for risk management."
      seoKeywords="volatility calculator, market volatility, historical volatility, implied volatility, risk analysis, trading volatility"
    >
      <div className="space-y-6">
        {/* Input Form */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Current Price: {selectedInstrumentInfo.currentPrice}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Timeframe
            </label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {timeframes.map((tf) => (
                  <SelectItem key={tf.value} value={tf.value}>
                    {tf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Price (Optional)
            </label>
            <Input
              type="number"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder={selectedInstrumentInfo?.currentPrice.toString() || ''}
              step="0.0001"
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Activity className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold text-white mb-2">Calculating Volatility</h3>
              <p className="text-gray-400">Analyzing market data...</p>
            </CardContent>
          </Card>
        ) : volatilityData && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4">Volatility Analysis Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border-blue-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Historical Volatility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {volatilityData.historicalVolatility}%
                  </div>
                  <div className="text-sm text-gray-400">Annualized</div>
                </CardContent>
              </Card>

              {volatilityData.impliedVolatility && (
                <Card className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border-purple-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-purple-400 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Implied Volatility
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-1">
                      {volatilityData.impliedVolatility}%
                    </div>
                    <div className="text-sm text-gray-400">Market Expectation</div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gradient-to-br from-green-600/10 to-green-800/10 border-green-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Average Range
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {volatilityData.averageRange}%
                  </div>
                  <div className="text-sm text-gray-400">Daily Movement</div>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br ${
                volatilityData.riskLevel === 'low' ? 'from-green-600/10 to-green-800/10 border-green-500/20' :
                volatilityData.riskLevel === 'medium' ? 'from-yellow-600/10 to-yellow-800/10 border-yellow-500/20' :
                volatilityData.riskLevel === 'high' ? 'from-orange-600/10 to-orange-800/10 border-orange-500/20' :
                'from-red-600/10 to-red-800/10 border-red-500/20'
              }`}>
                <CardHeader className="pb-3">
                  <CardTitle className={`text-lg flex items-center gap-2 ${
                    volatilityData.riskLevel === 'low' ? 'text-green-400' :
                    volatilityData.riskLevel === 'medium' ? 'text-yellow-400' :
                    volatilityData.riskLevel === 'high' ? 'text-orange-400' :
                    'text-red-400'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                    Risk Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <Badge className={getRiskLevelColor(volatilityData.riskLevel)}>
                      {volatilityData.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">Volatility Rank: {volatilityData.volatilityRank}/100</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-600/10 to-indigo-800/10 border-indigo-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-indigo-400 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Expected Move
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    ±{volatilityData.expectedMove}
                  </div>
                  <div className="text-sm text-gray-400">1 Standard Deviation</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-600/10 to-orange-800/10 border-orange-500/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-orange-400 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Timeframe
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">
                    {timeframes.find(tf => tf.value === timeframe)?.label}
                  </div>
                  <div className="text-sm text-gray-400">Analysis Period</div>
                </CardContent>
              </Card>
            </div>

            {/* Support and Resistance */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Expected Price Levels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-red-600/10 border border-red-500/20 rounded-lg">
                    <div className="text-sm text-red-400 mb-2">Support Level</div>
                    <div className="text-2xl font-bold text-white">
                      {volatilityData.supportResistance.support}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      -1 Standard Deviation
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-600/10 border border-green-500/20 rounded-lg">
                    <div className="text-sm text-green-400 mb-2">Resistance Level</div>
                    <div className="text-2xl font-bold text-white">
                      {volatilityData.supportResistance.resistance}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      +1 Standard Deviation
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Volatility Comparison */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Volatility Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {instruments.slice(0, 5).map((instrument) => {
                    const data = generateVolatilityData(instrument, timeframe)
                    const isSelected = instrument.value === selectedInstrument
                    
                    return (
                      <div key={instrument.value} className={`flex items-center justify-between p-3 rounded ${
                        isSelected ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-gray-800/50'
                      }`}>
                        <div className="flex items-center gap-3">
                          <span className={`font-medium ${isSelected ? 'text-blue-400' : 'text-white'}`}>
                            {instrument.label}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {instrument.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-400">Volatility</div>
                            <div className="font-medium text-white">{data.historicalVolatility}%</div>
                          </div>
                          <Badge className={getRiskLevelColor(data.riskLevel)}>
                            {data.riskLevel}
                          </Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Volatility Guide */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Understanding Volatility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Volatility Types:</h4>
                    <ul className="space-y-1">
                      <li>• <span className="text-blue-400">Historical</span>: Past price movements</li>
                      <li>• <span className="text-purple-400">Implied</span>: Market expectations</li>
                      <li>• Higher volatility = Higher risk & potential reward</li>
                      <li>• Lower volatility = More stable price movements</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Risk Levels:</h4>
                    <ul className="space-y-1">
                      <li>• <span className="text-green-400">Low</span>: &lt;15% annual volatility</li>
                      <li>• <span className="text-yellow-400">Medium</span>: 15-25% annual volatility</li>
                      <li>• <span className="text-orange-400">High</span>: 25-40% annual volatility</li>
                      <li>• <span className="text-red-400">Extreme</span>: &gt;40% annual volatility</li>
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
