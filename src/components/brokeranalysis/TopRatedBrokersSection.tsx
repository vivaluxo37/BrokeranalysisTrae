import { Link } from 'react-router-dom'
import { ArrowRight, Loader2, Star, TrendingUp } from 'lucide-react'
import { BrokerCard } from './BrokerCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Broker } from '@/types/brokerTypes'

interface TopRatedBrokersSectionProps {
  brokers: Broker[]
  isLoading?: boolean
  error?: string | null
}

export function TopRatedBrokersSection({ brokers, isLoading = false, error = null }: TopRatedBrokersSectionProps) {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gray-700 rounded-lg mr-4" />
            <div className="flex-1">
              <div className="h-4 bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-700 rounded w-3/4" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="h-12 bg-gray-700 rounded" />
            <div className="h-12 bg-gray-700 rounded" />
            <div className="h-12 bg-gray-700 rounded" />
          </div>
          <div className="h-10 bg-gray-700 rounded" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section 
      className="py-20 bg-gradient-to-b from-black to-gray-900"
      aria-labelledby="top-brokers-title"
      role="region"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-6 h-6 text-yellow-400 fill-current" />
            <span className="text-yellow-400 font-medium text-sm uppercase tracking-wider">
              Top Rated
            </span>
          </div>
          <h2 
            id="top-brokers-title"
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Best Brokers This Month
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover the highest-rated brokers based on our comprehensive analysis, 
            verified user reviews, and real-time performance metrics.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[...Array(3)].map((_, index) => (
              <div 
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <LoadingSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Unable to Load Brokers
              </h3>
              <p className="text-gray-400 mb-6">
                {error}
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Brokers Grid */}
        {!isLoading && !error && brokers.length > 0 && (
          <>
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
              role="list"
              aria-label="Top-rated brokers"
            >
              {brokers.slice(0, 3).map((broker, index) => (
                <div 
                  key={broker.id}
                  className="animate-slide-up group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  role="listitem"
                >
                  <div className="transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2 h-full">
                    <BrokerCard broker={broker} />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-500/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-gray-300">Brokers Analyzed</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-500/20">
                <div className="text-3xl font-bold text-green-400 mb-2">1M+</div>
                <div className="text-gray-300">User Reviews</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-500/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">24/7</div>
                <div className="text-gray-300">Market Monitoring</div>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && brokers.length === 0 && (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No Brokers Available
              </h3>
              <p className="text-gray-400 mb-6">
                We're currently updating our broker listings. Please check back soon.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh
              </Button>
            </CardContent>
          </Card>
        )}

        {/* View All CTA */}
        {!isLoading && !error && brokers.length > 0 && (
          <div className="text-center">
            <Button 
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link to="/brokers">
                View All Top Brokers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}