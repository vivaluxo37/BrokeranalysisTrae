import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, ExternalLink, Shield, Star } from 'lucide-react'
import { useSafeBrokerData, useSafeBrokerProperty } from '@/hooks/useSafeBrokerData'
import { BrokerPageErrorBoundary } from '@/components/common/BrokerPageErrorBoundary'

interface SafeBrokerCardProps {
  brokerId: string
  className?: string
  showActions?: boolean
}

/**
 * Safe broker card component that handles loading states and errors gracefully
 */
export function SafeBrokerCard({ brokerId, className = '', showActions = true }: SafeBrokerCardProps) {
  const { broker, isLoading, error, retry } = useSafeBrokerData(brokerId)

  // Safe property access with fallbacks
  const brokerName = useSafeBrokerProperty(broker, 'name', 'Unknown Broker')
  const brokerLogo = useSafeBrokerProperty(broker, 'logo', '/assets/icons/broker-placeholder.svg')
  const brokerRating = useSafeBrokerProperty(broker, 'rating', 0)
  const brokerReviewCount = useSafeBrokerProperty(broker, 'reviewCount', 0)
  const brokerMinDeposit = useSafeBrokerProperty(broker, 'minDeposit', 0)
  const brokerRegulators = useSafeBrokerProperty(broker, 'regulators', [])
  const brokerIsRegulated = useSafeBrokerProperty(broker, 'isRegulated', false)

  // Loading state
  if (isLoading) {
    return (
      <div className={`professional-card p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-medium-grey rounded-lg mr-4"></div>
            <div className="flex-1">
              <div className="h-6 bg-medium-grey rounded mb-2"></div>
              <div className="h-4 bg-medium-grey rounded w-32"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-medium-grey rounded"></div>
            <div className="h-4 bg-medium-grey rounded w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-6 bg-medium-grey rounded w-16"></div>
              <div className="h-6 bg-medium-grey rounded w-20"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state with retry option
  if (error && !broker) {
    return (
      <div className={`professional-card p-6 border-red-500/30 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-pure-white mb-2">
            Failed to Load Broker
          </h3>
          <p className="text-light-grey text-sm mb-4">
            {error}
          </p>
          <Button onClick={retry} size="sm" className="btn-professional-secondary">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Ensure broker exists (should always be true due to fallback)
  if (!broker) {
    return (
      <div className={`professional-card p-6 border-yellow-500/30 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-pure-white mb-2">
            Broker Not Found
          </h3>
          <p className="text-light-grey text-sm">
            The requested broker information is not available.
          </p>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number): string => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount}`
  }

  return (
    <BrokerPageErrorBoundary brokerId={brokerId} brokerName={brokerName}>
      <div className={`professional-card p-6 hover:border-pure-white/20 transition-colors ${className}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <img
              src={brokerLogo}
              alt={`${brokerName} logo`}
              className="w-16 h-16 rounded-lg object-cover mr-4"
              onError={(e) => {
                e.currentTarget.src = '/assets/icons/broker-placeholder.svg'
              }}
            />
            <div>
              <h3 className="text-xl font-semibold text-pure-white mb-1">
                {brokerName}
              </h3>
              <div className="flex items-center">
                <div className="flex items-center mr-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-pure-white font-medium">{brokerRating}</span>
                </div>
                <span className="text-light-grey text-sm">
                  ({brokerReviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>
          </div>
          
          {brokerIsRegulated && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <Shield className="w-3 h-3 mr-1" />
              Regulated
            </Badge>
          )}
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-light-grey text-sm">Min Deposit</div>
            <div className="text-pure-white font-semibold">
              {formatCurrency(brokerMinDeposit)}
            </div>
          </div>
          <div>
            <div className="text-light-grey text-sm">Spread From</div>
            <div className="text-pure-white font-semibold">
              {useSafeBrokerProperty(broker, 'spreadsFrom', 0)} pips
            </div>
          </div>
        </div>

        {/* Regulators */}
        {brokerRegulators.length > 0 && (
          <div className="mb-4">
            <div className="text-light-grey text-sm mb-2">Regulated by</div>
            <div className="flex flex-wrap gap-1">
              {brokerRegulators.slice(0, 3).map((regulator: string) => (
                <Badge
                  key={regulator}
                  variant="outline"
                  className="text-light-grey border-medium-grey text-xs"
                >
                  {regulator}
                </Badge>
              ))}
              {brokerRegulators.length > 3 && (
                <Badge variant="outline" className="text-light-grey border-medium-grey text-xs">
                  +{brokerRegulators.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-4 border-t border-medium-grey">
            <Button asChild size="sm" className="btn-professional-secondary flex-1">
              <Link to={`/brokers/${brokerId}`}>
                View Details
              </Link>
            </Button>
            <Button
              size="sm"
              className="btn-professional-primary"
              onClick={() => {
                const website = useSafeBrokerProperty(broker, 'details', {})?.website
                if (website && website !== '#') {
                  window.open(website, '_blank', 'noopener,noreferrer')
                }
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Error indicator if there was an error but we have fallback data */}
        {error && broker && (
          <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-400">
            <AlertCircle className="w-3 h-3 inline mr-1" />
            Some data may be incomplete
          </div>
        )}
      </div>
    </BrokerPageErrorBoundary>
  )
}

/**
 * Grid of safe broker cards with loading states
 */
interface SafeBrokerGridProps {
  brokerIds: string[]
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export function SafeBrokerGrid({ 
  brokerIds, 
  className = '', 
  columns = 3 
}: SafeBrokerGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {brokerIds.map((brokerId) => (
        <SafeBrokerCard key={brokerId} brokerId={brokerId} />
      ))}
    </div>
  )
}
