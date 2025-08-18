import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, Shield, Users, ExternalLink, TrendingUp, Award } from 'lucide-react'
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
  const rank = index + 1
  const matchScore = Math.round(88 + Math.random() * 12) // Mock match score for recommendations
  const isTopBroker = rank <= 3
  
  return (
    <div className="professional-card p-6 hover:shadow-lg transition-all duration-300 group">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Badge 
            className={`px-3 py-1 text-sm font-bold ${
              rank === 1 ? 'bg-yellow-500 text-white' :
              rank === 2 ? 'bg-gray-400 text-white' :
              rank === 3 ? 'bg-amber-600 text-white' :
              'bg-accent-blue/20 text-accent-blue border-accent-blue/30'
            }`}
          >
            {isTopBroker && <Award className="w-3 h-3 mr-1" />}
            #{rank} Match
          </Badge>
          
          <BrokerLogo
            brokerId={broker.id}
            brokerName={broker.name}
            size="64"
            className="rounded-lg shadow-sm"
            fallbackToInitials={true}
          />
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-pure-white mb-2 group-hover:text-accent-blue transition-colors">
              {broker.name}
            </h3>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-pure-white font-semibold">{broker.rating}</span>
                <span className="text-light-grey text-sm ml-1">
                  ({broker.reviewCount.toLocaleString()} reviews)
                </span>
              </div>
              
              <div className="flex items-center text-green-400">
                <Shield className="w-4 h-4 mr-1" />
                <span className="text-xs font-medium">Regulated</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {broker.regulation.slice(0, 3).map((reg) => (
                <Badge 
                  key={reg} 
                  className="bg-green-500/20 text-green-400 border-green-500/30 text-xs px-2 py-1"
                >
                  {reg}
                </Badge>
              ))}
              {broker.regulation.length > 3 && (
                <Badge className="bg-medium-grey/20 text-light-grey text-xs px-2 py-1">
                  +{broker.regulation.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right space-y-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            {matchScore}% match
          </Badge>
          
          <div className="text-pure-white">
            <div className="font-semibold text-lg">
              ${broker.minDeposit.toLocaleString()}
            </div>
            <div className="text-light-grey text-xs">
              Min Deposit
            </div>
          </div>
          
          <div className="text-light-grey text-sm">
            {broker.avgSpread} pips spread
          </div>
        </div>
      </div>

      {/* Match Score Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-light-grey">Compatibility Score</span>
          <span className="text-sm font-semibold text-pure-white">{matchScore}%</span>
        </div>
        <Progress value={matchScore} className="h-2" />
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-lg font-bold text-pure-white">
            {broker.assetClasses.length}+
          </div>
          <div className="text-xs text-light-grey">Asset Classes</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-pure-white flex items-center justify-center">
            <Users className="w-4 h-4 mr-1" />
            10k+
          </div>
          <div className="text-xs text-light-grey">Active Users</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {broker.rating}
          </div>
          <div className="text-xs text-light-grey">User Rating</div>
        </div>
      </div>

      {/* Asset Classes */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-pure-white mb-3">Available Assets</h4>
        <div className="flex flex-wrap gap-2">
          {broker.assetClasses.slice(0, 4).map((asset) => (
            <Badge 
              key={asset} 
              variant="outline" 
              className="text-light-grey border-medium-grey text-xs px-2 py-1 hover:bg-accent-blue/10 hover:border-accent-blue/30 transition-colors"
            >
              {asset}
            </Badge>
          ))}
          {broker.assetClasses.length > 4 && (
            <Badge 
              variant="outline" 
              className="text-light-grey border-medium-grey text-xs px-2 py-1"
            >
              +{broker.assetClasses.length - 4} more
            </Badge>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button 
          asChild 
          className="flex-1 bg-accent-blue hover:bg-accent-blue/90 text-white font-medium group-hover:shadow-md transition-all"
        >
          <Link to={`/brokers/${broker.id}`} className="flex items-center justify-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Profile
          </Link>
        </Button>
        
        <Button 
          asChild 
          variant="outline" 
          className="flex-1 border-accent-blue text-accent-blue hover:bg-accent-blue/10 font-medium transition-all"
        >
          <Link to={`/compare?brokers=${broker.id}`} className="flex items-center justify-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Compare
          </Link>
        </Button>
      </div>
      
      {/* Top Broker Indicator */}
      {isTopBroker && (
        <div className="absolute top-4 right-4">
          <Badge className="bg-yellow-500 text-white text-xs px-2 py-1 shadow-lg">
            ⭐ Top Pick
          </Badge>
        </div>
      )}
    </div>
  )
}
