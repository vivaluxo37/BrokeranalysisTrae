import { Link } from 'react-router-dom'
import { ArrowRight, Loader2 } from 'lucide-react'
import { BrokerCard } from './BrokerCard'
import type { Broker } from '@/types/broker'

interface TopRatedBrokersSectionProps {
  brokers: Broker[]
  isLoading?: boolean
  error?: string | null
}

export function TopRatedBrokersSection({ brokers, isLoading = false, error = null }: TopRatedBrokersSectionProps) {
  return (
    <section 
      className="professional-section bg-professional-black"
      aria-labelledby="top-brokers-title"
      role="region"
    >
      <div className="professional-container">
        <div className="text-center mb-12">
          <h2 
            id="top-brokers-title"
            className="text-section-title text-pure-white mb-4"
          >
            Top-Rated Brokers This Month
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Discover the highest-rated brokers based on our comprehensive analysis and verified user reviews.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div 
            className="flex flex-col items-center justify-center py-16"
            role="status"
            aria-label="Loading top-rated brokers"
          >
            <Loader2 className="w-8 h-8 text-primary-blue animate-spin mb-4" />
            <p className="text-light-grey text-sm">Loading top-rated brokers...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div 
            className="text-center py-16"
            role="alert"
            aria-live="polite"
          >
            <p className="text-red-400 mb-4">Failed to load brokers: {error}</p>
            <button 
              className="text-primary-blue hover:text-primary-blue/80 underline focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-professional-black"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        )}

        {/* Brokers Grid */}
        {!isLoading && !error && brokers.length > 0 && (
          <div 
            className="professional-grid professional-grid-3 mb-12"
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
                <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2">
                  <BrokerCard broker={broker} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && brokers.length === 0 && (
          <div className="text-center py-16">
            <p className="text-light-grey mb-4">No brokers available at the moment.</p>
            <p className="text-sm text-medium-grey">Please check back later for updated broker listings.</p>
          </div>
        )}

        {/* View All Link */}
        {!isLoading && !error && brokers.length > 0 && (
          <div className="text-center">
            <Link 
              to="/brokers"
              className="inline-flex items-center text-pure-white hover:text-light-grey focus:text-light-grey transition-all duration-300 font-medium group focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-professional-black rounded-lg px-4 py-2"
              aria-label="View all top-rated brokers"
            >
              View All Top Brokers
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-focus:translate-x-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}