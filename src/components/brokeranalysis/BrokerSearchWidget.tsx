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
    <div 
      className="professional-card p-6 max-w-2xl mx-auto"
      role="search"
      aria-label="Broker search form"
    >
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        role="search"
        aria-label="Find brokers by criteria"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Asset Class Dropdown */}
          <div>
            <label 
              htmlFor="asset-class-select"
              className="block text-sm font-medium text-light-grey mb-2"
            >
              Asset Class <span className="text-red-400" aria-label="required">*</span>
            </label>
            <Select 
              value={assetClass} 
              onValueChange={setAssetClass}
              required
            >
              <SelectTrigger 
                id="asset-class-select"
                className="professional-input focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                aria-describedby="asset-class-help"
                aria-required="true"
              >
                <SelectValue placeholder="Select Asset Class" />
              </SelectTrigger>
              <SelectContent 
                className="bg-charcoal-grey border-medium-grey"
                role="listbox"
                aria-label="Asset class options"
              >
                {assetClasses.map((asset) => (
                  <SelectItem 
                    key={asset.value} 
                    value={asset.value}
                    className="text-pure-white hover:bg-medium-grey/20 focus:bg-medium-grey/30"
                    role="option"
                  >
                    {asset.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div id="asset-class-help" className="sr-only">
              Choose the type of financial instrument you want to trade
            </div>
          </div>

          {/* Region Dropdown */}
          <div>
            <label 
              htmlFor="region-select"
              className="block text-sm font-medium text-light-grey mb-2"
            >
              Region (Optional)
            </label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger 
                id="region-select"
                className="professional-input focus:ring-2 focus:ring-primary-blue focus:border-primary-blue"
                aria-describedby="region-help"
              >
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent 
                className="bg-charcoal-grey border-medium-grey"
                role="listbox"
                aria-label="Region options"
              >
                {regions.map((regionItem) => (
                  <SelectItem 
                    key={regionItem.value} 
                    value={regionItem.value}
                    className="text-pure-white hover:bg-medium-grey/20 focus:bg-medium-grey/30"
                    role="option"
                  >
                    {regionItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div id="region-help" className="sr-only">
              Optionally filter brokers by geographic region
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button 
              type="submit"
              onClick={handleSearch}
              className="btn-professional-primary w-full focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-professional-black"
              disabled={!assetClass}
              aria-describedby={!assetClass ? "search-disabled-help" : undefined}
            >
              <Search className="w-4 h-4 mr-2" aria-hidden="true" />
              Search Brokers
            </Button>
            {!assetClass && (
              <div id="search-disabled-help" className="sr-only">
                Please select an asset class to enable search
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Advanced Filter Link */}
      <div className="text-center mt-4">
        <button 
          className="text-light-grey hover:text-pure-white focus:text-pure-white text-sm transition-colors focus:outline-none focus:underline"
          aria-label="Open advanced search filters"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Handle advanced filter opening
            }
          }}
        >
          Use Advanced Filter
        </button>
      </div>
    </div>
  )
}
