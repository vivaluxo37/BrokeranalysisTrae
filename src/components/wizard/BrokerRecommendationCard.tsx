import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import BrokerLogo from '@/components/BrokerLogo'

interface Broker {
  id: string
  name: string
  logo: string
  rating: number
  reviewCount: number
  regulation: string[]
  minDeposit: number
  avgSpread: number
  assetClasses: string[]
}

interface BrokerRecommendationCardProps {
  broker: Broker
  index: number
}

export function BrokerRecommendationCard({ broker, index }: BrokerRecommendationCardProps) {
  return (
    <div className="professional-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mr-4">
            #{index + 1} Match
          </Badge>
          <BrokerLogo
            brokerId={broker.id}
            brokerName={broker.name}
            size="64"
            className="mr-4"
            fallbackToInitials={true}
          />
          <div>
            <h3 className="text-xl font-semibold text-pure-white mb-1">
              {broker.name}
            </h3>
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-pure-white font-medium">{broker.rating}</span>
              <span className="text-light-grey text-sm ml-1">
                ({broker.reviewCount.toLocaleString()} reviews)
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {broker.regulation.map((reg) => (
                <Badge 
                  key={reg} 
                  className="bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                >
                  {reg}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-pure-white font-semibold mb-1">
            Min Deposit: ${broker.minDeposit}
          </div>
          <div className="text-light-grey text-sm">
            Avg Spread: {broker.avgSpread} pips
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {broker.assetClasses.map((asset) => (
          <Badge 
            key={asset} 
            variant="outline" 
            className="text-light-grey border-medium-grey text-xs"
          >
            {asset}
          </Badge>
        ))}
      </div>

      <div className="flex space-x-3">
        <Button asChild className="btn-professional-primary">
          <Link to={`/brokers/${broker.id}`}>
            View Profile
          </Link>
        </Button>
        <Button asChild className="btn-professional-secondary">
          <Link to={`/compare?brokers=${broker.id}`}>
            Add to Compare
          </Link>
        </Button>
      </div>
    </div>
  )
}
