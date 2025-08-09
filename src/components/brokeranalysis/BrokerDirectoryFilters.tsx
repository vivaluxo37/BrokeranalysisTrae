import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'

interface FilterState {
  assetClass: string
  region: string
  regulation: string
  minDeposit: string
  sortBy: string
  search: string
}

interface BrokerDirectoryFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
}

export function BrokerDirectoryFilters({ filters, onFiltersChange, onReset }: BrokerDirectoryFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => value && value !== '').length
  }

  const assetClasses = [
    { value: 'forex', label: 'Forex' },
    { value: 'stocks', label: 'Stocks' },
    { value: 'crypto', label: 'Crypto' },
    { value: 'cfds', label: 'CFDs' },
    { value: 'commodities', label: 'Commodities' },
  ]

  const regions = [
    { value: 'global', label: 'Global' },
    { value: 'us', label: 'United States' },
    { value: 'eu', label: 'European Union' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'asia', label: 'Asia-Pacific' },
  ]

  const regulations = [
    { value: 'fca', label: 'FCA (UK)' },
    { value: 'sec', label: 'SEC (US)' },
    { value: 'cysec', label: 'CySEC (Cyprus)' },
    { value: 'asic', label: 'ASIC (Australia)' },
    { value: 'esma', label: 'ESMA (EU)' },
  ]

  const depositRanges = [
    { value: 'under_100', label: 'Under $100' },
    { value: '100_500', label: '$100 - $500' },
    { value: '500_1000', label: '$500 - $1,000' },
    { value: '1000_5000', label: '$1,000 - $5,000' },
    { value: 'over_5000', label: 'Over $5,000' },
  ]

  const sortOptions = [
    { value: 'rating_desc', label: 'Highest Rated' },
    { value: 'rating_asc', label: 'Lowest Rated' },
    { value: 'name_asc', label: 'Name A-Z' },
    { value: 'name_desc', label: 'Name Z-A' },
    { value: 'reviews_desc', label: 'Most Reviews' },
    { value: 'spread_asc', label: 'Lowest Spread' },
    { value: 'deposit_asc', label: 'Lowest Deposit' },
  ]

  return (
    <div className="professional-card p-6 mb-6">
      {/* Search and Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey w-4 h-4" />
          <Input
            type="text"
            placeholder="Search brokers..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="professional-input pl-10"
          />
        </div>

        {/* Quick Sort */}
        <div className="w-full lg:w-48">
          <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger className="professional-input">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal-grey border-medium-grey">
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className="text-pure-white hover:bg-medium-grey/20"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter Toggle */}
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="btn-professional-secondary"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge className="ml-2 bg-pure-white text-professional-black">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="border-t border-medium-grey pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Asset Class */}
            <div>
              <label className="block text-sm font-medium text-light-grey mb-2">
                Asset Class
              </label>
              <Select value={filters.assetClass} onValueChange={(value) => updateFilter('assetClass', value)}>
                <SelectTrigger className="professional-input">
                  <SelectValue placeholder="Any Asset Class" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-grey border-medium-grey">
                  <SelectItem value="" className="text-pure-white hover:bg-medium-grey/20">
                    Any Asset Class
                  </SelectItem>
                  {assetClasses.map((asset) => (
                    <SelectItem 
                      key={asset.value} 
                      value={asset.value}
                      className="text-pure-white hover:bg-medium-grey/20"
                    >
                      {asset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-light-grey mb-2">
                Region
              </label>
              <Select value={filters.region} onValueChange={(value) => updateFilter('region', value)}>
                <SelectTrigger className="professional-input">
                  <SelectValue placeholder="Any Region" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-grey border-medium-grey">
                  <SelectItem value="" className="text-pure-white hover:bg-medium-grey/20">
                    Any Region
                  </SelectItem>
                  {regions.map((region) => (
                    <SelectItem 
                      key={region.value} 
                      value={region.value}
                      className="text-pure-white hover:bg-medium-grey/20"
                    >
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Regulation */}
            <div>
              <label className="block text-sm font-medium text-light-grey mb-2">
                Regulation
              </label>
              <Select value={filters.regulation} onValueChange={(value) => updateFilter('regulation', value)}>
                <SelectTrigger className="professional-input">
                  <SelectValue placeholder="Any Regulator" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-grey border-medium-grey">
                  <SelectItem value="" className="text-pure-white hover:bg-medium-grey/20">
                    Any Regulator
                  </SelectItem>
                  {regulations.map((reg) => (
                    <SelectItem 
                      key={reg.value} 
                      value={reg.value}
                      className="text-pure-white hover:bg-medium-grey/20"
                    >
                      {reg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Min Deposit */}
            <div>
              <label className="block text-sm font-medium text-light-grey mb-2">
                Min Deposit
              </label>
              <Select value={filters.minDeposit} onValueChange={(value) => updateFilter('minDeposit', value)}>
                <SelectTrigger className="professional-input">
                  <SelectValue placeholder="Any Amount" />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-grey border-medium-grey">
                  <SelectItem value="" className="text-pure-white hover:bg-medium-grey/20">
                    Any Amount
                  </SelectItem>
                  {depositRanges.map((range) => (
                    <SelectItem 
                      key={range.value} 
                      value={range.value}
                      className="text-pure-white hover:bg-medium-grey/20"
                    >
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={onReset}
                variant="ghost"
                className="text-light-grey hover:text-pure-white"
              >
                <X className="w-4 h-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}