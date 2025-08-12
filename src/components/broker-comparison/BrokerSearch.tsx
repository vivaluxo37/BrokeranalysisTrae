import { useState } from 'react'
import { Search, Filter, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export function BrokerSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    assetClass: [],
    regulation: [],
    minDeposit: '',
    platform: []
  })

  const filterOptions = {
    assetClass: ['Forex', 'Stocks', 'Crypto', 'CFDs', 'Options', 'Futures', 'ETFs'],
    regulation: ['FCA (UK)', 'SEC (US)', 'ASIC (AU)', 'CySEC (EU)', 'CFTC (US)', 'BaFin (DE)'],
    minDeposit: ['$0', '$100', '$250', '$500', '$1000', '$5000+'],
    platform: ['MetaTrader 4', 'MetaTrader 5', 'TradingView', 'Proprietary', 'Web-based', 'Mobile App']
  }

  const mockResults = [
    {
      id: 1,
      name: 'Interactive Brokers',
      rating: 4.8,
      instruments: '7000+',
      country: 'United States',
      minDeposit: '$0',
      regulation: 'SEC, FCA, ASIC',
      highlights: ['Low fees', 'Global markets', 'Advanced platform']
    },
    {
      id: 2,
      name: 'IG Markets',
      rating: 4.6,
      instruments: '17000+',
      country: 'United Kingdom',
      minDeposit: '$250',
      regulation: 'FCA, ASIC',
      highlights: ['Tight spreads', 'Good education', 'Mobile app']
    },
    {
      id: 3,
      name: 'Plus500',
      rating: 4.4,
      instruments: '2800+',
      country: 'Israel',
      minDeposit: '$100',
      regulation: 'FCA, CySEC',
      highlights: ['User-friendly', 'No commission', 'Demo account']
    }
  ]

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({
      assetClass: [],
      regulation: [],
      minDeposit: '',
      platform: []
    })
  }

  const hasActiveFilters = Object.values(selectedFilters).some(filter => 
    Array.isArray(filter) ? filter.length > 0 : filter !== ''
  )

  return (
    <section className="py-20 bg-gray-50">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-section-title text-professional-black mb-4">
            Find Your Perfect Broker
          </h2>
          <p className="text-lg text-medium-grey max-w-2xl mx-auto">
            Use our advanced search and filtering system to discover brokers that match your trading needs and preferences.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="max-w-4xl mx-auto mb-12">
          {/* Main Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search by broker name, country, or features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                iconPosition="left"
                inputSize="lg"
                className="w-full bg-white border-gray-300"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "primary" : "outline"}
              size="lg"
              icon={Filter}
              className="px-8 border-gray-300"
            >
              Filters {hasActiveFilters && `(${Object.values(selectedFilters).flat().length})`}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="bg-white border-gray-200 text-professional-black">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-professional-black">Advanced Filters</h3>
                  {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="ghost" size="sm">
                      Clear All
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Asset Class Filter */}
                  <div>
                    <h4 className="font-medium text-professional-black mb-3">Asset Classes</h4>
                    <div className="space-y-2">
                      {filterOptions.assetClass.map((asset) => (
                        <label key={asset} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.assetClass.includes(asset)}
                            onChange={() => toggleFilter('assetClass', asset)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-medium-grey">{asset}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Regulation Filter */}
                  <div>
                    <h4 className="font-medium text-professional-black mb-3">Regulation</h4>
                    <div className="space-y-2">
                      {filterOptions.regulation.map((reg) => (
                        <label key={reg} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.regulation.includes(reg)}
                            onChange={() => toggleFilter('regulation', reg)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-medium-grey">{reg}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Min Deposit Filter */}
                  <div>
                    <h4 className="font-medium text-professional-black mb-3">Minimum Deposit</h4>
                    <div className="space-y-2">
                      {filterOptions.minDeposit.map((deposit) => (
                        <label key={deposit} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name="minDeposit"
                            checked={selectedFilters.minDeposit === deposit}
                            onChange={() => setSelectedFilters(prev => ({ ...prev, minDeposit: deposit }))}
                            className="border-gray-300"
                          />
                          <span className="text-sm text-medium-grey">{deposit}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Platform Filter */}
                  <div>
                    <h4 className="font-medium text-professional-black mb-3">Trading Platform</h4>
                    <div className="space-y-2">
                      {filterOptions.platform.map((platform) => (
                        <label key={platform} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selectedFilters.platform.includes(platform)}
                            onChange={() => toggleFilter('platform', platform)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm text-medium-grey">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Search Results */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-professional-black">
              Search Results ({mockResults.length} brokers found)
            </h3>
            <select className="px-4 py-2 border border-gray-300 rounded-md bg-white text-professional-black">
              <option>Sort by Rating</option>
              <option>Sort by Name</option>
              <option>Sort by Min Deposit</option>
            </select>
          </div>

          {/* Results List */}
          <div className="space-y-4">
            {mockResults.map((broker) => (
              <Card key={broker.id} className="bg-white border-gray-200 text-professional-black hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-accent-blue rounded-lg flex items-center justify-center text-white font-bold">
                          {broker.name.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-professional-black">{broker.name}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <span className="text-yellow-400">★</span>
                              <span className="font-medium">{broker.rating}</span>
                            </div>
                            <span className="text-medium-grey">•</span>
                            <span className="text-medium-grey">{broker.country}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-medium-grey">Instruments:</span>
                          <div className="font-semibold">{broker.instruments}</div>
                        </div>
                        <div>
                          <span className="text-medium-grey">Min Deposit:</span>
                          <div className="font-semibold">{broker.minDeposit}</div>
                        </div>
                        <div>
                          <span className="text-medium-grey">Regulation:</span>
                          <div className="font-semibold">{broker.regulation}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {broker.highlights.map((highlight, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:ml-6">
                      <Button size="sm" className="px-6">
                        Read Review
                      </Button>
                      <Button size="sm" variant="outline" className="px-6 border-gray-300 text-professional-black hover:bg-gray-50">
                        Compare
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Button variant="outline" size="lg" className="border-gray-300 text-professional-black hover:bg-gray-50">
              Load More Results
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}