import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Eye, Plus, Star, Filter, Grid3X3, List, Search, TrendingUp, Shield, Users } from 'lucide-react'
import { BrokerDirectoryFilters } from '@/components/common/BrokerDirectoryFilters'
import { Layout } from '@/components/layout/Layout'
import { SeoHead } from '@/components/common'
import { brokerDataService } from '@/services/BrokerDataService'
import { mockQuery } from '@/additionalPagesMockData'

interface FilterState {
  assetClass: string
  region: string
  regulation: string
  minDeposit: string
  sortBy: string
  search: string
}

export function BrokerDirectoryPage() {
  const [filters, setFilters] = useState<FilterState>({
    assetClass: '',
    region: '',
    regulation: '',
    minDeposit: '',
    sortBy: 'rating_desc',
    search: ''
  })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const {brokers} = mockQuery.brokerDirectory
  const {totalPages} = mockQuery.brokerDirectory
  const {totalCount} = mockQuery.brokerDirectory

  useEffect(() => {
    // Simulate API call when filters change
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [filters, currentPage])

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const handleResetFilters = () => {
    setFilters({
      assetClass: '',
      region: '',
      regulation: '',
      minDeposit: '',
      sortBy: 'rating_desc',
      search: ''
    })
    setCurrentPage(1)
  }

  const toggleBrokerSelection = (brokerId: string) => {
    setSelectedBrokers(prev => 
      prev.includes(brokerId) 
        ? prev.filter(id => id !== brokerId)
        : [...prev, brokerId]
    )
  }

  const formatMinDeposit = (amount: number): string => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  }

  const formatSpread = (spread: number): string => {
    return `${spread} pips`;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <SeoHead 
          title="Browse Brokers | BrokerAnalysis"
          description="Browse and compare 500+ regulated brokers worldwide. Filter by asset class, region, regulation, and more."
        />

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5" />
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-8 mb-8 animate-fade-in">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>500+ Regulated</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Real-time Data</span>
              </div>
            </div>

            {/* Page Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Browse Brokers
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up">
                Discover and compare {totalCount}+ regulated brokers worldwide. Use our advanced filters 
                to find the perfect broker for your trading needs.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">{totalCount}+</div>
                <div className="text-gray-300">Brokers Listed</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-500/20">
                <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                <div className="text-gray-300">Verified Data</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300">Updated</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-20">

          {/* Filters */}
          <Card className="mb-8 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <BrokerDirectoryFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleResetFilters}
              />
            </CardContent>
          </Card>

          {/* Results Summary and View Toggle */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="text-gray-300">
                Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalCount)} of {totalCount} brokers
              </div>
              <div className="flex items-center gap-2 bg-gray-800 rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-3"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {selectedBrokers.length > 0 && (
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                <Link to={`/compare?brokers=${selectedBrokers.join(',')}`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Compare Selected ({selectedBrokers.length})
                </Link>
              </Button>
            )}
          </div>

          {/* Brokers Display */}
          {viewMode === 'table' ? (
            <Card className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-300 font-semibold">Broker</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Rating</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Asset Classes</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Regulation</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Min Deposit</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Avg Spread</TableHead>
                    <TableHead className="text-gray-300 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index} className="border-gray-700">
                        <TableCell colSpan={7}>
                          <div className="animate-pulse flex items-center space-x-4 py-4">
                            <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                              <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    brokers.map((broker) => (
                      <TableRow key={broker.id} className="border-gray-700 hover:bg-gray-800/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedBrokers.includes(broker.id)}
                              onChange={() => toggleBrokerSelection(broker.id)}
                              className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <img 
                              src={brokerDataService.getBrokerProperty(broker, 'logo', '/assets/icons/broker-placeholder.svg')} 
                              alt={`${brokerDataService.getBrokerProperty(broker, 'name', 'Unknown Broker')} logo`}
                              className="w-12 h-12 rounded-lg object-contain bg-white/10 p-1"
                              onError={(e) => {
                                e.currentTarget.src = '/assets/icons/broker-placeholder.svg'
                              }}
                            />
                            <div>
                              <div className="text-white font-semibold">
                                {brokerDataService.getBrokerProperty(broker, 'name', 'Unknown Broker')}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {brokerDataService.getBrokerProperty(broker, 'details', {})?.headquarters || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                            <span className="text-white font-semibold">
                              {brokerDataService.getBrokerProperty(broker, 'rating', 0)}
                            </span>
                            <span className="text-gray-400 text-sm ml-1">
                              ({brokerDataService.getBrokerProperty(broker, 'reviewCount', 0).toLocaleString()})
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {brokerDataService.getBrokerProperty(broker, 'assetClasses', []).slice(0, 3).map((asset: string) => (
                              <Badge 
                                key={asset} 
                                variant="outline" 
                                className="text-gray-400 border-gray-600 text-xs"
                              >
                                {asset}
                              </Badge>
                            ))}
                            {brokerDataService.getBrokerProperty(broker, 'assetClasses', []).length > 3 && (
                              <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                                +{brokerDataService.getBrokerProperty(broker, 'assetClasses', []).length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {brokerDataService.getBrokerProperty(broker, 'regulators', []).map((reg: string) => (
                              <Badge 
                                key={reg} 
                                className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                              >
                                <Shield className="w-3 h-3 mr-1" />
                                {reg}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          ${formatMinDeposit(brokerDataService.getBrokerProperty(broker, 'minDeposit', 0))}
                        </TableCell>
                        <TableCell className="text-white font-semibold">
                          {formatSpread(brokerDataService.getBrokerProperty(broker, 'spreadsFrom', 0))}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button asChild size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              <Link to={`/brokers/${broker.id}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          ) : (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700">
                    <CardContent className="p-6">
                      <div className="animate-pulse">
                        <div className="flex items-center mb-4">
                          <div className="w-16 h-16 bg-gray-700 rounded-lg mr-4" />
                          <div className="flex-1">
                            <div className="h-4 bg-gray-700 rounded mb-2" />
                            <div className="h-3 bg-gray-700 rounded w-3/4" />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="h-3 bg-gray-700 rounded" />
                          <div className="h-3 bg-gray-700 rounded w-2/3" />
                          <div className="h-8 bg-gray-700 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                brokers.map((broker) => (
                  <Card key={broker.id} className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedBrokers.includes(broker.id)}
                            onChange={() => toggleBrokerSelection(broker.id)}
                            className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <img 
                            src={brokerDataService.getBrokerProperty(broker, 'logo', '/assets/icons/broker-placeholder.svg')} 
                            alt={`${brokerDataService.getBrokerProperty(broker, 'name', 'Unknown Broker')} logo`}
                            className="w-16 h-16 rounded-lg object-contain bg-white/10 p-2"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/icons/broker-placeholder.svg'
                            }}
                          />
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-white font-semibold">
                            {brokerDataService.getBrokerProperty(broker, 'rating', 0)}
                          </span>
                        </div>
                      </div>
                      <CardTitle className="text-xl text-white">
                        {brokerDataService.getBrokerProperty(broker, 'name', 'Unknown Broker')}
                      </CardTitle>
                      <p className="text-gray-400 text-sm">
                        {brokerDataService.getBrokerProperty(broker, 'details', {})?.headquarters || 'N/A'}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-gray-400">Min Deposit</div>
                          <div className="text-white font-semibold">
                            ${formatMinDeposit(brokerDataService.getBrokerProperty(broker, 'minDeposit', 0))}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Spreads From</div>
                          <div className="text-white font-semibold">
                            {formatSpread(brokerDataService.getBrokerProperty(broker, 'spreadsFrom', 0))}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-gray-400 text-sm mb-2">Regulation</div>
                        <div className="flex flex-wrap gap-1">
                          {brokerDataService.getBrokerProperty(broker, 'regulators', []).slice(0, 2).map((reg: string) => (
                            <Badge 
                              key={reg} 
                              className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              {reg}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-gray-400 text-sm mb-2">Asset Classes</div>
                        <div className="flex flex-wrap gap-1">
                          {brokerDataService.getBrokerProperty(broker, 'assetClasses', []).slice(0, 3).map((asset: string) => (
                            <Badge 
                              key={asset} 
                              variant="outline" 
                              className="text-gray-400 border-gray-600 text-xs"
                            >
                              {asset}
                            </Badge>
                          ))}
                          {brokerDataService.getBrokerProperty(broker, 'assetClasses', []).length > 3 && (
                            <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                              +{brokerDataService.getBrokerProperty(broker, 'assetClasses', []).length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button asChild className="w-full bg-white text-black hover:bg-gray-100 transition-colors">
                        <Link to={`/brokers/${broker.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </Layout>
  )
}
