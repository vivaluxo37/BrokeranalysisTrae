import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Eye, Plus, Star } from 'lucide-react'
import { BrokerDirectoryFilters } from '@/components/brokeranalysis/BrokerDirectoryFilters'
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
      <div className="min-h-screen bg-professional-black">
        <SeoHead 
          title="Browse Brokers | BrokerAnalysis"
          description="Browse and compare 500+ regulated brokers worldwide. Filter by asset class, region, regulation, and more."
        />

        <div className="professional-container py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-section-title text-pure-white mb-4">
              Browse Brokers
            </h1>
            <p className="text-subtitle max-w-3xl">
              Discover and compare {totalCount}+ regulated brokers worldwide. Use our advanced filters to find the perfect broker for your trading needs.
            </p>
          </div>

          {/* Filters */}
          <BrokerDirectoryFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-light-grey">
              Showing {((currentPage - 1) * 20) + 1}-{Math.min(currentPage * 20, totalCount)} of {totalCount} brokers
            </div>
            {selectedBrokers.length > 0 && (
              <Button asChild className="btn-professional-primary">
                <Link to={`/compare?brokers=${selectedBrokers.join(',')}`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Compare Selected ({selectedBrokers.length})
                </Link>
              </Button>
            )}
          </div>

          {/* Brokers Table */}
          <div className="professional-card p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-medium-grey">
                  <TableHead className="text-light-grey">Broker</TableHead>
                  <TableHead className="text-light-grey">Rating</TableHead>
                  <TableHead className="text-light-grey">Asset Classes</TableHead>
                  <TableHead className="text-light-grey">Regulation</TableHead>
                  <TableHead className="text-light-grey">Min Deposit</TableHead>
                  <TableHead className="text-light-grey">Avg Spread</TableHead>
                  <TableHead className="text-light-grey">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="border-medium-grey">
                      <TableCell colSpan={7}>
                        <div className="animate-pulse flex items-center space-x-4">
                          <div className="w-12 h-12 bg-medium-grey rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-medium-grey rounded w-3/4"></div>
                            <div className="h-3 bg-medium-grey rounded w-1/2"></div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  brokers.map((broker) => (
                    <TableRow key={broker.id} className="border-medium-grey hover:bg-charcoal-grey/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={selectedBrokers.includes(broker.id)}
                            onChange={() => toggleBrokerSelection(broker.id)}
                            className="w-4 h-4 text-pure-white bg-charcoal-grey border-medium-grey rounded focus:ring-pure-white"
                          />
                          <img 
                            src={brokerDataService.getBrokerProperty(broker, 'logo', '/assets/icons/broker-placeholder.svg')} 
                            alt={`${brokerDataService.getBrokerProperty(broker, 'name', 'Unknown Broker')} logo`}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/assets/icons/broker-placeholder.svg'
                            }}
                          />
                          <div>
                            <div className="text-pure-white font-medium">
                              {brokerDataService.getBrokerProperty(broker, 'name', 'Unknown Broker')}
                            </div>
                            <div className="text-light-grey text-sm">
                              {brokerDataService.getBrokerProperty(broker, 'details', {})?.headquarters || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-pure-white font-medium">
                            {brokerDataService.getBrokerProperty(broker, 'rating', 0)}
                          </span>
                          <span className="text-light-grey text-sm ml-1">
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
                              className="text-light-grey border-medium-grey text-xs"
                            >
                              {asset}
                            </Badge>
                          ))}
                          {brokerDataService.getBrokerProperty(broker, 'assetClasses', []).length > 3 && (
                            <Badge variant="outline" className="text-light-grey border-medium-grey text-xs">
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
                              {reg}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-pure-white">
                        {formatMinDeposit(brokerDataService.getBrokerProperty(broker, 'minDeposit', 0))}
                      </TableCell>
                      <TableCell className="text-pure-white">
                        {formatSpread(brokerDataService.getBrokerProperty(broker, 'spreadsFrom', 0))}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button asChild size="sm" className="btn-professional-secondary">
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
          </div>

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