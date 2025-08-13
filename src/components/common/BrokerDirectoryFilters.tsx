import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'

interface FilterState {
  search: string
  assetClass: string
  regulation: string
  minDeposit: string
  maxLeverage: string
  spread: string
  platform: string
  accountType: string
}

interface BrokerDirectoryFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function BrokerDirectoryFilters({ filters, onFiltersChange }: BrokerDirectoryFiltersProps) {
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      assetClass: '',
      regulation: '',
      minDeposit: '',
      maxLeverage: '',
      spread: '',
      platform: '',
      accountType: ''
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-400" />
        <h3 className="text-lg font-semibold text-white">Filter Brokers</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
          Clear All
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search brokers..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filters.assetClass} onValueChange={(value) => handleFilterChange('assetClass', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Asset Class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Assets</SelectItem>
            <SelectItem value="forex">Forex</SelectItem>
            <SelectItem value="stocks">Stocks</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="commodities">Commodities</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.regulation} onValueChange={(value) => handleFilterChange('regulation', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Regulation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Regulators</SelectItem>
            <SelectItem value="fca">FCA</SelectItem>
            <SelectItem value="cysec">CySEC</SelectItem>
            <SelectItem value="asic">ASIC</SelectItem>
            <SelectItem value="sec">SEC</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.minDeposit} onValueChange={(value) => handleFilterChange('minDeposit', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Min Deposit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Amount</SelectItem>
            <SelectItem value="0-100">$0 - $100</SelectItem>
            <SelectItem value="100-500">$100 - $500</SelectItem>
            <SelectItem value="500-1000">$500 - $1000</SelectItem>
            <SelectItem value="1000+">$1000+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}