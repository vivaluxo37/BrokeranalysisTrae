import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'

interface BrokerSearchWidgetProps {
  onSearch: (filters: { assetClass?: string; region?: string }) => void
}

export function BrokerSearchWidget({ onSearch }: BrokerSearchWidgetProps) {
  const [assetClass, setAssetClass] = useState<string>('')
  const [region, setRegion] = useState<string>('')

  const handleSearch = () => {
    onSearch({ assetClass, region })
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
    { value: 'asia-pacific', label: 'Asia-Pacific' },
    { value: 'mena', label: 'MENA' },
  ]

  return (
    <div className="professional-card p-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Asset Class Dropdown */}
        <div>
          <label className="block text-sm font-medium text-light-grey mb-2">
            Asset Class
          </label>
          <Select value={assetClass} onValueChange={setAssetClass}>
            <SelectTrigger className="professional-input">
              <SelectValue placeholder="Select Asset Class" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal-grey border-medium-grey">
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

        {/* Region Dropdown */}
        <div>
          <label className="block text-sm font-medium text-light-grey mb-2">
            Region (Optional)
          </label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="professional-input">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent className="bg-charcoal-grey border-medium-grey">
              {regions.map((regionItem) => (
                <SelectItem 
                  key={regionItem.value} 
                  value={regionItem.value}
                  className="text-pure-white hover:bg-medium-grey/20"
                >
                  {regionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button 
            onClick={handleSearch}
            className="btn-professional-primary w-full"
            disabled={!assetClass}
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Advanced Filter Link */}
      <div className="text-center mt-4">
        <button className="text-light-grey hover:text-pure-white text-sm transition-colors">
          Use Advanced Filter
        </button>
      </div>
    </div>
  )
}