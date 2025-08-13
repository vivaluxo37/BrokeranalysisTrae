import React, { useState, useEffect } from 'react'
import { Calendar, Clock, TrendingUp, TrendingDown, AlertTriangle, Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { BaseToolPage } from '@/components/tools/BaseToolPage'

interface EconomicEvent {
  id: string
  time: string
  currency: string
  event: string
  impact: 'low' | 'medium' | 'high'
  forecast: string
  previous: string
  actual?: string
  country: string
  category: string
}

const mockEvents: EconomicEvent[] = [
  {
    id: '1',
    time: '08:30',
    currency: 'USD',
    event: 'Non-Farm Payrolls',
    impact: 'high',
    forecast: '180K',
    previous: '199K',
    actual: '175K',
    country: 'United States',
    category: 'Employment'
  },
  {
    id: '2',
    time: '10:00',
    currency: 'EUR',
    event: 'ECB Interest Rate Decision',
    impact: 'high',
    forecast: '4.50%',
    previous: '4.50%',
    country: 'European Union',
    category: 'Interest Rates'
  },
  {
    id: '3',
    time: '12:30',
    currency: 'GBP',
    event: 'GDP Growth Rate',
    impact: 'medium',
    forecast: '0.2%',
    previous: '0.1%',
    country: 'United Kingdom',
    category: 'GDP'
  },
  {
    id: '4',
    time: '14:00',
    currency: 'JPY',
    event: 'Core CPI',
    impact: 'medium',
    forecast: '2.8%',
    previous: '2.7%',
    country: 'Japan',
    category: 'Inflation'
  },
  {
    id: '5',
    time: '16:00',
    currency: 'CAD',
    event: 'Employment Change',
    impact: 'medium',
    forecast: '25K',
    previous: '47K',
    country: 'Canada',
    category: 'Employment'
  }
]

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'low':
      return 'bg-accent-blue/20 text-accent-blue border-green-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

const getImpactIcon = (impact: string) => {
  switch (impact) {
    case 'high':
      return <TrendingUp className="w-4 h-4" />
    case 'medium':
      return <AlertTriangle className="w-4 h-4" />
    case 'low':
      return <TrendingDown className="w-4 h-4" />
    default:
      return <Clock className="w-4 h-4" />
  }
}

const getCurrencyFlag = (currency: string) => {
  const flags: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    CHF: '🇨🇭',
    NZD: '🇳🇿'
  }
  return flags[currency] || '🌍'
}

export function EconomicCalendar() {
  const [events, setEvents] = useState<EconomicEvent[]>(mockEvents)
  const [filteredEvents, setFilteredEvents] = useState<EconomicEvent[]>(mockEvents)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedCurrency, setSelectedCurrency] = useState('all')
  const [selectedImpact, setSelectedImpact] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let filtered = events

    if (selectedCurrency !== 'all') {
      filtered = filtered.filter(event => event.currency === selectedCurrency)
    }

    if (selectedImpact !== 'all') {
      filtered = filtered.filter(event => event.impact === selectedImpact)
    }

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
  }, [events, selectedCurrency, selectedImpact, searchQuery])

  const handleSave = () => {
    // Implement save functionality
    console.log('Saving economic calendar settings...')
  }

  const handleShare = () => {
    // Implement share functionality
    navigator.clipboard.writeText(window.location.href)
    console.log('Calendar link copied to clipboard')
  }

  const handleExport = () => {
    // Implement export functionality
    const csvContent = [
      ['Time', 'Currency', 'Event', 'Impact', 'Forecast', 'Previous', 'Actual', 'Country', 'Category'],
      ...filteredEvents.map(event => [
        event.time,
        event.currency,
        event.event,
        event.impact,
        event.forecast,
        event.previous,
        event.actual || '',
        event.country,
        event.category
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `economic-calendar-${selectedDate}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <BaseToolPage
      title="Economic Calendar"
      description="Track market-moving economic events and news releases with real-time updates and impact indicators. Stay informed about key economic data that affects currency pairs and market volatility."
      category="Market Analysis"
      difficulty="beginner"
      features={['Real-time updates', 'Impact indicators', 'Historical data', 'Custom filters', 'Export functionality']}
      onSave={handleSave}
      onShare={handleShare}
      onExport={handleExport}
      seoTitle="Economic Calendar 2025 | Real-Time Market Events & News"
      seoDescription="Stay ahead of market-moving events with our comprehensive economic calendar. Track GDP, employment, inflation, and central bank decisions with real-time updates."
      seoKeywords="economic calendar, market events, forex news, economic indicators, trading calendar, market analysis"
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="All Currencies" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Currencies</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Impact</label>
            <Select value={selectedImpact} onValueChange={setSelectedImpact}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="All Impact Levels" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all">All Impact Levels</SelectItem>
                <SelectItem value="high">High Impact</SelectItem>
                <SelectItem value="medium">Medium Impact</SelectItem>
                <SelectItem value="low">Low Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
                <p className="text-gray-400">
                  No economic events match your current filters. Try adjusting your search criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <div className="text-lg font-bold text-white">{event.time}</div>
                        <div className="text-xs text-gray-400">GMT</div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCurrencyFlag(event.currency)}</div>
                        <Badge className={`text-xs font-medium ${getImpactColor(event.impact)}`}>
                          {getImpactIcon(event.impact)}
                          <span className="ml-1 capitalize">{event.impact}</span>
                        </Badge>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">{event.event}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{event.country}</span>
                          <span>•</span>
                          <span>{event.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-gray-400">Previous</div>
                        <div className="text-white font-medium">{event.previous}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Forecast</div>
                        <div className="text-white font-medium">{event.forecast}</div>
                      </div>
                      {event.actual && (
                        <div className="text-center">
                          <div className="text-gray-400">Actual</div>
                          <div className={`font-medium ${
                            parseFloat(event.actual) > parseFloat(event.forecast) 
                              ? 'text-accent-blue' 
                              : parseFloat(event.actual) < parseFloat(event.forecast)
                              ? 'text-red-400'
                              : 'text-white'
                          }`}>
                            {event.actual}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Legend */}
        <Card className="bg-gray-800/30 border-gray-700">
          <CardContent className="p-4">
            <h4 className="text-lg font-semibold text-white mb-3">Impact Legend</h4>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  High
                </Badge>
                <span className="text-gray-400 text-sm">Major market impact expected</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Medium
                </Badge>
                <span className="text-gray-400 text-sm">Moderate market impact</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-accent-blue/20 text-accent-blue border-green-500/30">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  Low
                </Badge>
                <span className="text-gray-400 text-sm">Minimal market impact</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseToolPage>
  )
}
