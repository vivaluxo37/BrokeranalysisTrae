import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Star, BarChart3, Shuffle } from 'lucide-react'
import { CollectionManager } from '@/utils/SafeCollection'

interface Broker {
  id: string
  name: string
  logo: string
  rating: number
  avgSpread: number
  minDeposit: number
  leverage: number
  platforms: string[]
  fees: number
}

interface QuickCompareModuleProps {
  brokers: Broker[]
}

export function QuickCompareModule({ brokers }: QuickCompareModuleProps) {
  // Create safe collection wrapper for brokers
  const safeBrokers = CollectionManager.validateCollection<Broker>(
    brokers,
    'brokers'
  )
  
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([
    safeBrokers.toArray()[0]?.id || '',
    safeBrokers.toArray()[1]?.id || '',
    safeBrokers.toArray()[2]?.id || ''
  ])

  const handleBrokerChange = (index: number, brokerId: string) => {
    const newSelection = [...selectedBrokers]
    newSelection[index] = brokerId
    setSelectedBrokers(newSelection)
  }

  const getSelectedBrokerData = () => {
    return CollectionManager.validateCollection(selectedBrokers, 'selectedBrokers')
      .map(id => safeBrokers.find(broker => broker.id === id))
      .filter(Boolean) as Broker[]
  }

  const selectedBrokerData = getSelectedBrokerData()

  const formatMinDeposit = (amount: number): string => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  }

  const formatLeverage = (leverage: number): string => {
    return `1:${leverage}`;
  }

  const formatSpread = (spread: number): string => {
    return `${spread} pips`;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 font-medium text-sm uppercase tracking-wider">
              Quick Compare
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Compare Brokers Side-by-Side
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Get instant comparisons of key metrics to find the perfect broker for your trading needs.
            Compare spreads, deposits, leverage, and more.
          </p>
        </div>

        <Card className="max-w-6xl mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-2 text-white">
              <Shuffle className="w-5 h-5 text-blue-400" />
              Select Brokers to Compare
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Broker Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedBrokers.map((selectedId, index) => (
                <div key={index} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Broker {index + 1}
                  </label>
                  <Select value={selectedId} onValueChange={(value) => handleBrokerChange(index, value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white hover:border-gray-500 transition-colors">
                      <SelectValue placeholder="Select Broker" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      {safeBrokers.map((broker) => (
                        <SelectItem 
                          key={broker.id} 
                          value={broker.id}
                          className="text-white hover:bg-gray-700 focus:bg-gray-700"
                        >
                          <div className="flex items-center">
                            <img 
                              src={broker.logo} 
                              alt={broker.name}
                              className="w-6 h-6 rounded mr-3 object-contain bg-white/10 p-0.5"
                            />
                            <span className="font-medium">{broker.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>

            {/* Comparison Table - Desktop */}
            <div className="hidden lg:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-300 font-semibold">Metric</TableHead>
                    {CollectionManager.validateCollection(selectedBrokerData, 'selectedBrokerData').map((broker) => (
                      <TableHead key={broker.id} className="text-center">
                        <div className="flex items-center justify-center space-x-3">
                          <img 
                            src={broker.logo} 
                            alt={broker.name}
                            className="w-10 h-10 rounded-lg object-contain bg-white/10 p-1"
                          />
                          <div className="text-left">
                            <div className="text-white font-semibold">{broker.name}</div>
                            <div className="text-xs text-gray-400">Broker</div>
                          </div>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-gray-300 font-medium">Rating</TableCell>
                    {CollectionManager.validateCollection(selectedBrokerData, 'selectedBrokerData').map((broker) => (
                      <TableCell key={broker.id} className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">{broker.rating.toFixed(1)}</span>
                          <span className="text-gray-400 text-sm">/5</span>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-gray-300 font-medium">Avg. Spreads</TableCell>
                    {CollectionManager.validateCollection(selectedBrokerData, 'selectedBrokerData').map((broker) => (
                      <TableCell key={broker.id} className="text-center">
                        <span className="text-white font-semibold">{formatSpread(broker.avgSpread)}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-gray-300 font-medium">Min. Deposit</TableCell>
                    {selectedBrokerData.map((broker) => (
                      <TableCell key={broker.id} className="text-center">
                        <span className="text-white font-semibold">${formatMinDeposit(broker.minDeposit)}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-gray-300 font-medium">Max Leverage</TableCell>
                    {selectedBrokerData.map((broker) => (
                      <TableCell key={broker.id} className="text-center">
                        <span className="text-white font-semibold">{formatLeverage(broker.leverage)}</span>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell className="text-gray-300 font-medium">Platforms</TableCell>
                    {selectedBrokerData.map((broker) => (
                      <TableCell key={broker.id} className="text-center">
                        <div className="text-white text-sm">
                          {broker.platforms?.slice(0, 2).join(', ') || 'N/A'}
                          {broker.platforms && broker.platforms.length > 2 && (
                            <span className="text-gray-400"> +{broker.platforms.length - 2}</span>
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Comparison Cards - Mobile */}
            <div className="lg:hidden space-y-6">
              {selectedBrokerData.map((broker) => (
                <Card key={broker.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <img 
                        src={broker.logo} 
                        alt={broker.name}
                        className="w-12 h-12 rounded-lg object-contain bg-white/10 p-1"
                      />
                      <div>
                        <h3 className="text-white font-semibold text-lg">{broker.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white">{broker.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-gray-400 text-sm">Spreads From</div>
                        <div className="text-white font-semibold">{formatSpread(broker.avgSpread)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Min. Deposit</div>
                        <div className="text-white font-semibold">${formatMinDeposit(broker.minDeposit)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Max Leverage</div>
                        <div className="text-white font-semibold">{formatLeverage(broker.leverage)}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Platforms</div>
                        <div className="text-white font-semibold text-sm">
                          {broker.platforms?.slice(0, 2).join(', ') || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Advanced Compare CTA */}
            <div className="text-center pt-6 border-t border-gray-700">
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link to="/compare/advanced">
                  Advanced Comparison Tool
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <p className="text-gray-400 text-sm mt-2">
                Compare up to 10 brokers with detailed metrics and analysis
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}