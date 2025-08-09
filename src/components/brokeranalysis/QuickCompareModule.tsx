import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Star, ArrowRight } from 'lucide-react'

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
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>([
    brokers[0]?.id || '',
    brokers[1]?.id || '',
    brokers[2]?.id || ''
  ])

  const handleBrokerChange = (index: number, brokerId: string) => {
    const newSelection = [...selectedBrokers]
    newSelection[index] = brokerId
    setSelectedBrokers(newSelection)
  }

  const getSelectedBrokerData = () => {
    return selectedBrokers.map(id => brokers.find(broker => broker.id === id)).filter(Boolean) as Broker[]
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
    <section className="professional-section bg-charcoal-grey">
      <div className="professional-container">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Compare Brokers Side-by-Side
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Get instant comparisons of key metrics to find the perfect broker for your trading needs.
          </p>
        </div>

        <div className="professional-card p-6 max-w-5xl mx-auto">
          {/* Broker Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {selectedBrokers.map((selectedId, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-light-grey mb-2">
                  Broker {index + 1}
                </label>
                <Select value={selectedId} onValueChange={(value) => handleBrokerChange(index, value)}>
                  <SelectTrigger className="professional-input">
                    <SelectValue placeholder="Select Broker" />
                  </SelectTrigger>
                  <SelectContent className="bg-charcoal-grey border-medium-grey">
                    {brokers.map((broker) => (
                      <SelectItem 
                        key={broker.id} 
                        value={broker.id}
                        className="text-pure-white hover:bg-medium-grey/20"
                      >
                        <div className="flex items-center">
                          <img 
                            src={broker.logo} 
                            alt={broker.name}
                            className="w-6 h-6 rounded mr-2"
                          />
                          {broker.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-medium-grey">
                  <TableHead className="text-light-grey">Metric</TableHead>
                  {selectedBrokerData.map((broker) => (
                    <TableHead key={broker.id} className="text-center">
                      <div className="flex items-center justify-center">
                        <img 
                          src={broker.logo} 
                          alt={broker.name}
                          className="w-8 h-8 rounded mr-2"
                        />
                        <span className="text-pure-white font-medium">{broker.name}</span>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-medium-grey">
                  <TableCell className="text-light-grey font-medium">Rating</TableCell>
                  {selectedBrokerData.map((broker) => (
                    <TableCell key={broker.id} className="text-center">
                      <div className="flex items-center justify-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-pure-white">{broker.rating.toFixed(1)}</span>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-medium-grey">
                  <TableCell className="text-light-grey font-medium">Avg. Spreads</TableCell>
                  {selectedBrokerData.map((broker) => (
                    <TableCell key={broker.id} className="text-center text-pure-white">
                      {formatSpread(broker.avgSpread)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-medium-grey">
                  <TableCell className="text-light-grey font-medium">Min. Deposit</TableCell>
                  {selectedBrokerData.map((broker) => (
                    <TableCell key={broker.id} className="text-center text-pure-white">
                      {formatMinDeposit(broker.minDeposit)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-medium-grey">
                  <TableCell className="text-light-grey font-medium">Max Leverage</TableCell>
                  {selectedBrokerData.map((broker) => (
                    <TableCell key={broker.id} className="text-center text-pure-white">
                      {formatLeverage(broker.leverage)}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow className="border-medium-grey">
                  <TableCell className="text-light-grey font-medium">Platforms</TableCell>
                  {selectedBrokerData.map((broker) => (
                    <TableCell key={broker.id} className="text-center text-pure-white text-sm">
                      {broker.platforms?.join(', ') || 'N/A'}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>

          {/* Advanced Compare Link */}
          <div className="text-center mt-8">
            <Button asChild className="btn-professional-primary">
              <Link to="/compare/advanced">
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Advanced Compare
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}