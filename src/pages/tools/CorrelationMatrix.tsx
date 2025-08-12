import React, { useState, useEffect } from 'react'
import { Grid3X3, TrendingUp, TrendingDown, BarChart3, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BaseToolPage } from '@/components/tools/BaseToolPage'

interface CorrelationData {
  pair1: string
  pair2: string
  correlation: number
  strength: 'very-strong' | 'strong' | 'moderate' | 'weak' | 'very-weak'
  direction: 'positive' | 'negative'
}

const currencyPairs = [
  'EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD', 'NZDUSD',
  'EURGBP', 'EURJPY', 'EURCHF', 'EURAUD', 'EURCAD', 'EURNZD',
  'GBPJPY', 'GBPCHF', 'GBPAUD', 'GBPCAD', 'GBPNZD',
  'CHFJPY', 'AUDJPY', 'CADJPY', 'NZDJPY',
  'AUDCHF', 'AUDCAD', 'AUDNZD',
  'CADCHF', 'NZDCHF', 'NZDCAD'
]

const timeframes = [
  { value: '1H', label: '1 Hour' },
  { value: '4H', label: '4 Hours' },
  { value: '1D', label: '1 Day' },
  { value: '1W', label: '1 Week' },
  { value: '1M', label: '1 Month' }
]

// Mock correlation data - in a real app, this would come from an API
const generateMockCorrelations = (selectedPairs: string[], timeframe: string): CorrelationData[] => {
  const correlations: CorrelationData[] = []
  
  for (let i = 0; i < selectedPairs.length; i++) {
    for (let j = i + 1; j < selectedPairs.length; j++) {
      const pair1 = selectedPairs[i]
      const pair2 = selectedPairs[j]
      
      // Generate realistic correlation based on currency relationships
      let correlation = Math.random() * 2 - 1 // -1 to 1
      
      // Adjust correlation based on common currency relationships
      if (pair1.includes('EUR') && pair2.includes('EUR')) {
        correlation = Math.abs(correlation) * 0.8 + 0.2 // Positive correlation
      } else if (pair1.includes('USD') && pair2.includes('USD')) {
        const usdFirst1 = pair1.startsWith('USD')
        const usdFirst2 = pair2.startsWith('USD')
        if (usdFirst1 === usdFirst2) {
          correlation = Math.abs(correlation) * 0.7 + 0.1
        } else {
          correlation = -(Math.abs(correlation) * 0.7 + 0.1)
        }
      }
      
      // Adjust for timeframe
      const timeframeMultiplier = {
        '1H': 0.6,
        '4H': 0.7,
        '1D': 0.8,
        '1W': 0.9,
        '1M': 1.0
      }[timeframe] || 0.8
      
      correlation *= timeframeMultiplier
      correlation = Math.max(-1, Math.min(1, correlation))
      
      const absCorr = Math.abs(correlation)
      let strength: CorrelationData['strength']
      
      if (absCorr >= 0.8) strength = 'very-strong'
      else if (absCorr >= 0.6) strength = 'strong'
      else if (absCorr >= 0.4) strength = 'moderate'
      else if (absCorr >= 0.2) strength = 'weak'
      else strength = 'very-weak'
      
      correlations.push({
        pair1,
        pair2,
        correlation: Math.round(correlation * 1000) / 1000,
        strength,
        direction: correlation >= 0 ? 'positive' : 'negative'
      })
    }
  }
  
  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
}

const getCorrelationColor = (correlation: number) => {
  const abs = Math.abs(correlation)
  if (correlation > 0) {
    if (abs >= 0.8) return 'bg-green-600 text-white'
    if (abs >= 0.6) return 'bg-green-500 text-white'
    if (abs >= 0.4) return 'bg-green-400 text-black'
    if (abs >= 0.2) return 'bg-green-300 text-black'
    return 'bg-green-200 text-black'
  } else {
    if (abs >= 0.8) return 'bg-red-600 text-white'
    if (abs >= 0.6) return 'bg-red-500 text-white'
    if (abs >= 0.4) return 'bg-red-400 text-white'
    if (abs >= 0.2) return 'bg-red-300 text-black'
    return 'bg-red-200 text-black'
  }
}

const getStrengthBadge = (strength: string) => {
  const colors = {
    'very-strong': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'strong': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'moderate': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'weak': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'very-weak': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
  
  return colors[strength as keyof typeof colors] || colors['very-weak']
}

export function CorrelationMatrix() {
  const [selectedPairs, setSelectedPairs] = useState<string[]>(['EURUSD', 'GBPUSD', 'USDJPY', 'USDCHF', 'AUDUSD', 'USDCAD'])
  const [timeframe, setTimeframe] = useState<string>('1D')
  const [strengthFilter, setStrengthFilter] = useState<string>('all')
  const [correlations, setCorrelations] = useState<CorrelationData[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const updateCorrelations = () => {
    setIsLoading(true)
    setTimeout(() => {
      const newCorrelations = generateMockCorrelations(selectedPairs, timeframe)
      setCorrelations(newCorrelations)
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    updateCorrelations()
  }, [selectedPairs, timeframe])

  const filteredCorrelations = correlations.filter(corr => {
    if (strengthFilter === 'all') return true
    return corr.strength === strengthFilter
  })

  const handleAddPair = (pair: string) => {
    if (!selectedPairs.includes(pair)) {
      setSelectedPairs([...selectedPairs, pair])
    }
  }

  const handleRemovePair = (pair: string) => {
    if (selectedPairs.length > 2) {
      setSelectedPairs(selectedPairs.filter(p => p !== pair))
    }
  }

  const handleSave = () => {
    const data = {
      selectedPairs,
      timeframe,
      correlations,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('correlation-matrix', JSON.stringify(data))
    console.log('Correlation matrix saved')
  }

  const handleShare = () => {
    const url = new URL(window.location.href)
    url.searchParams.set('pairs', selectedPairs.join(','))
    url.searchParams.set('timeframe', timeframe)
    
    navigator.clipboard.writeText(url.toString())
    console.log('Correlation matrix link copied to clipboard')
  }

  const handleExport = () => {
    const csvContent = [
      ['Pair 1', 'Pair 2', 'Correlation', 'Strength', 'Direction'],
      ...filteredCorrelations.map(corr => [
        corr.pair1,
        corr.pair2,
        corr.correlation.toString(),
        corr.strength,
        corr.direction
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `correlation-matrix-${timeframe}-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <BaseToolPage
      title="Correlation Matrix"
      description="Analyze relationships between currency pairs and other financial instruments. Understand how different assets move together to optimize your portfolio diversification."
      category="Market Analysis"
      difficulty="advanced"
      features={['Real-time correlations', 'Historical analysis', 'Heatmap visualization', 'Custom timeframes', 'Portfolio analysis']}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      seoTitle="Correlation Matrix | Currency Pair Correlation Analysis"
      seoDescription="Analyze currency pair correlations with our advanced correlation matrix tool. Understand market relationships for better trading decisions."
      seoKeywords="correlation matrix, currency correlation, forex correlation, market analysis, trading correlation"
    >
      <div className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Strength Filter
            </label>
            <Select value={strengthFilter} onValueChange={setStrengthFilter}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Strengths</SelectItem>
                <SelectItem value="very-strong">Very Strong (≥0.8)</SelectItem>
                <SelectItem value="strong">Strong (≥0.6)</SelectItem>
                <SelectItem value="moderate">Moderate (≥0.4)</SelectItem>
                <SelectItem value="weak">Weak (≥0.2)</SelectItem>
                <SelectItem value="very-weak">Very Weak (&lt;0.2)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={updateCorrelations}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Updating...' : 'Refresh Data'}
            </Button>
          </div>
        </div>

        {/* Selected Pairs */}
        <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Selected Currency Pairs ({selectedPairs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPairs.map((pair) => (
                <Badge
                  key={pair}
                  variant="outline"
                  className="text-white border-gray-600 hover:border-gray-500 cursor-pointer"
                  onClick={() => handleRemovePair(pair)}
                >
                  {pair} ×
                </Badge>
              ))}
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Add Currency Pairs:</h4>
              <div className="flex flex-wrap gap-2">
                {currencyPairs
                  .filter(pair => !selectedPairs.includes(pair))
                  .slice(0, 10)
                  .map((pair) => (
                    <Button
                      key={pair}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddPair(pair)}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      + {pair}
                    </Button>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Correlation Results */}
        {isLoading ? (
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-white mb-2">Calculating Correlations</h3>
              <p className="text-gray-400">Analyzing market relationships...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Correlation Analysis ({filteredCorrelations.length} pairs)
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Filter className="w-4 h-4" />
                <span>Timeframe: {timeframes.find(tf => tf.value === timeframe)?.label}</span>
              </div>
            </div>

            {/* Correlation Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCorrelations.slice(0, 20).map((corr, index) => (
                <Card key={`${corr.pair1}-${corr.pair2}`} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-lg font-semibold text-white">
                          {corr.pair1} × {corr.pair2}
                        </div>
                        <Badge className={getStrengthBadge(corr.strength)}>
                          {corr.strength.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {corr.direction === 'positive' ? (
                          <TrendingUp className="w-4 h-4 text-green-400" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className={`px-3 py-1 rounded text-sm font-bold ${getCorrelationColor(corr.correlation)}`}>
                        {corr.correlation >= 0 ? '+' : ''}{corr.correlation.toFixed(3)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {Math.abs(corr.correlation) >= 0.8 ? 'Very Strong' :
                         Math.abs(corr.correlation) >= 0.6 ? 'Strong' :
                         Math.abs(corr.correlation) >= 0.4 ? 'Moderate' :
                         Math.abs(corr.correlation) >= 0.2 ? 'Weak' : 'Very Weak'}
                        {' '}
                        {corr.direction === 'positive' ? 'Positive' : 'Negative'}
                      </div>
                    </div>

                    <div className="mt-3 bg-gray-800/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          corr.correlation >= 0 ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary Statistics */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Correlation Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-gray-800/50 rounded">
                    <div className="text-2xl font-bold text-green-400">
                      {correlations.filter(c => c.correlation > 0).length}
                    </div>
                    <div className="text-sm text-gray-400">Positive</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded">
                    <div className="text-2xl font-bold text-red-400">
                      {correlations.filter(c => c.correlation < 0).length}
                    </div>
                    <div className="text-sm text-gray-400">Negative</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded">
                    <div className="text-2xl font-bold text-purple-400">
                      {correlations.filter(c => Math.abs(c.correlation) >= 0.6).length}
                    </div>
                    <div className="text-sm text-gray-400">Strong</div>
                  </div>
                  <div className="text-center p-3 bg-gray-800/50 rounded">
                    <div className="text-2xl font-bold text-yellow-400">
                      {correlations.filter(c => Math.abs(c.correlation) < 0.2).length}
                    </div>
                    <div className="text-sm text-gray-400">Weak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Correlation Guide */}
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Understanding Correlations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">Correlation Strength:</h4>
                    <ul className="space-y-1">
                      <li>• <span className="text-purple-400">Very Strong</span>: ±0.8 to ±1.0</li>
                      <li>• <span className="text-blue-400">Strong</span>: ±0.6 to ±0.8</li>
                      <li>• <span className="text-yellow-400">Moderate</span>: ±0.4 to ±0.6</li>
                      <li>• <span className="text-orange-400">Weak</span>: ±0.2 to ±0.4</li>
                      <li>• <span className="text-gray-400">Very Weak</span>: 0 to ±0.2</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Trading Implications:</h4>
                    <ul className="space-y-1">
                      <li>• <span className="text-green-400">Positive</span>: Pairs move in same direction</li>
                      <li>• <span className="text-red-400">Negative</span>: Pairs move in opposite directions</li>
                      <li>• High correlation = Higher risk if trading both</li>
                      <li>• Low correlation = Better diversification</li>
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