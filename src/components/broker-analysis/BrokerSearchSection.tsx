import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Bookmark, Settings } from 'lucide-react';

interface SearchFilters {
  assetClasses: string[];
  regulators: string[];
  countries: string[];
  minDeposit: number | null;
  tradingCost: string | null;
  platforms: string[];
}

interface BrokerSearchSectionProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  isLoading?: boolean;
}

export function BrokerSearchSection({ onSearch, isLoading = false }: BrokerSearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    assetClasses: [],
    regulators: [],
    countries: [],
    minDeposit: null,
    tradingCost: null,
    platforms: []
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const assetClasses = [
    { id: 'forex', label: 'Forex' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Cryptocurrency' },
    { id: 'cfds', label: 'CFDs' },
    { id: 'options', label: 'Options' },
    { id: 'futures', label: 'Futures' },
    { id: 'commodities', label: 'Commodities' }
  ];

  const regulators = [
    { id: 'fca', label: 'FCA (UK)' },
    { id: 'asic', label: 'ASIC (Australia)' },
    { id: 'cysec', label: 'CySEC (Cyprus)' },
    { id: 'sec', label: 'SEC (US)' },
    { id: 'finra', label: 'FINRA (US)' },
    { id: 'nfa', label: 'NFA (US)' },
    { id: 'esma', label: 'ESMA (EU)' }
  ];

  const countries = [
    { id: 'us', label: 'United States' },
    { id: 'uk', label: 'United Kingdom' },
    { id: 'eu', label: 'European Union' },
    { id: 'au', label: 'Australia' },
    { id: 'ca', label: 'Canada' },
    { id: 'sg', label: 'Singapore' }
  ];

  const platforms = [
    { id: 'web', label: 'Web Platform' },
    { id: 'mobile', label: 'Mobile App' },
    { id: 'mt4', label: 'MetaTrader 4' },
    { id: 'mt5', label: 'MetaTrader 5' },
    { id: 'proprietary', label: 'Proprietary Platform' }
  ];

  const handleFilterChange = (category: keyof SearchFilters, value: string, checked: boolean) => {
    setFilters(prev => {
      const currentArray = prev[category] as string[];
      if (checked) {
        return { ...prev, [category]: [...currentArray, value] };
      } else {
        return { ...prev, [category]: currentArray.filter(item => item !== value) };
      }
    });
  };

  const handleSearch = () => {
    onSearch(searchQuery, filters);
  };

  const clearFilters = () => {
    setFilters({
      assetClasses: [],
      regulators: [],
      countries: [],
      minDeposit: null,
      tradingCost: null,
      platforms: []
    });
  };

  const getActiveFiltersCount = () => {
    return filters.assetClasses.length + 
           filters.regulators.length + 
           filters.countries.length + 
           filters.platforms.length +
           (filters.minDeposit ? 1 : 0) +
           (filters.tradingCost ? 1 : 0);
  };

  return (
    <section className="professional-section bg-professional-black">
      <div className="w-full px-6 lg:px-12">
        <div className="text-center mb-8">
          <h2 className="text-section-title text-pure-white mb-4">
            Find Your Perfect Broker
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Search and filter through our comprehensive database of regulated brokers 
            to find the perfect match for your trading needs.
          </p>
        </div>

        <Card className="professional-card max-w-4xl mx-auto">
          <CardContent className="p-6">
            {/* Search Bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-text w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search by broker name, instrument, or feature..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="lg" className="relative">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                    {getActiveFiltersCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-accent-blue text-white text-xs min-w-[20px] h-5">
                        {getActiveFiltersCount()}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="flex items-center justify-between">
                      Filter Brokers
                      {getActiveFiltersCount() > 0 && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                          Clear All
                        </Button>
                      )}
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-6 mt-6">
                    {/* Asset Classes */}
                    <div>
                      <h3 className="font-medium text-pure-white mb-3">Asset Classes</h3>
                      <div className="space-y-2">
                        {assetClasses.map((asset) => (
                          <div key={asset.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`asset-${asset.id}`}
                              checked={filters.assetClasses.includes(asset.id)}
                              onCheckedChange={(checked) => 
                                handleFilterChange('assetClasses', asset.id, checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`asset-${asset.id}`} 
                              className="text-sm text-light-grey cursor-pointer"
                            >
                              {asset.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Regulators */}
                    <div>
                      <h3 className="font-medium text-pure-white mb-3">Regulation</h3>
                      <div className="space-y-2">
                        {regulators.map((regulator) => (
                          <div key={regulator.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`reg-${regulator.id}`}
                              checked={filters.regulators.includes(regulator.id)}
                              onCheckedChange={(checked) => 
                                handleFilterChange('regulators', regulator.id, checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`reg-${regulator.id}`} 
                              className="text-sm text-light-grey cursor-pointer"
                            >
                              {regulator.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Countries */}
                    <div>
                      <h3 className="font-medium text-pure-white mb-3">Available In</h3>
                      <div className="space-y-2">
                        {countries.map((country) => (
                          <div key={country.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`country-${country.id}`}
                              checked={filters.countries.includes(country.id)}
                              onCheckedChange={(checked) => 
                                handleFilterChange('countries', country.id, checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`country-${country.id}`} 
                              className="text-sm text-light-grey cursor-pointer"
                            >
                              {country.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Min Deposit */}
                    <div>
                      <h3 className="font-medium text-pure-white mb-3">Minimum Deposit</h3>
                      <Select 
                        value={filters.minDeposit?.toString() || ''} 
                        onValueChange={(value) => 
                          setFilters(prev => ({ ...prev, minDeposit: value ? parseInt(value) : null }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any amount" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any amount</SelectItem>
                          <SelectItem value="0">No minimum</SelectItem>
                          <SelectItem value="100">$100 or less</SelectItem>
                          <SelectItem value="500">$500 or less</SelectItem>
                          <SelectItem value="1000">$1,000 or less</SelectItem>
                          <SelectItem value="5000">$5,000 or less</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Trading Cost */}
                    <div>
                      <h3 className="font-medium text-pure-white mb-3">Trading Cost</h3>
                      <Select 
                        value={filters.tradingCost || ''} 
                        onValueChange={(value) => 
                          setFilters(prev => ({ ...prev, tradingCost: value || null }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any cost" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any cost</SelectItem>
                          <SelectItem value="low">Low cost</SelectItem>
                          <SelectItem value="medium">Medium cost</SelectItem>
                          <SelectItem value="high">Premium service</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Platforms */}
                    <div>
                      <h3 className="font-medium text-pure-white mb-3">Platforms</h3>
                      <div className="space-y-2">
                        {platforms.map((platform) => (
                          <div key={platform.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`platform-${platform.id}`}
                              checked={filters.platforms.includes(platform.id)}
                              onCheckedChange={(checked) => 
                                handleFilterChange('platforms', platform.id, checked as boolean)
                              }
                            />
                            <label 
                              htmlFor={`platform-${platform.id}`} 
                              className="text-sm text-light-grey cursor-pointer"
                            >
                              {platform.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <Button 
                onClick={handleSearch} 
                size="lg" 
                className="bg-accent-blue hover:bg-accent-blue/90"
                disabled={isLoading}
              >
                Search
              </Button>
            </div>

            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.assetClasses.map((asset) => (
                  <Badge key={asset} variant="secondary" className="bg-charcoal-grey text-light-grey">
                    {assetClasses.find(a => a.id === asset)?.label}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('assetClasses', asset, false)}
                    />
                  </Badge>
                ))}
                {filters.regulators.map((reg) => (
                  <Badge key={reg} variant="secondary" className="bg-charcoal-grey text-light-grey">
                    {regulators.find(r => r.id === reg)?.label}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('regulators', reg, false)}
                    />
                  </Badge>
                ))}
                {filters.countries.map((country) => (
                  <Badge key={country} variant="secondary" className="bg-charcoal-grey text-light-grey">
                    {countries.find(c => c.id === country)?.label}
                    <X 
                      className="w-3 h-3 ml-1 cursor-pointer" 
                      onClick={() => handleFilterChange('countries', country, false)}
                    />
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" className="text-accent-blue hover:text-accent-blue/80">
                <Bookmark className="w-4 h-4 mr-1" />
                Save Search
              </Button>
              <Button variant="ghost" size="sm" className="text-light-grey hover:text-pure-white">
                <Settings className="w-4 h-4 mr-1" />
                Refine Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}