import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { BrokerCard } from './BrokerCard'
import type { Broker } from '@/types/broker'

interface TopRatedBrokersSectionProps {
  brokers: Broker[]
}

export function TopRatedBrokersSection({ brokers }: TopRatedBrokersSectionProps) {
  return (
    <section className="professional-section bg-professional-black">
      <div className="professional-container">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Top-Rated Brokers This Month
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Discover the highest-rated brokers based on our comprehensive analysis and verified user reviews.
          </p>
        </div>

        {/* Brokers Grid */}
        <div className="professional-grid professional-grid-3 mb-12">
          {brokers.slice(0, 3).map((broker, index) => (
            <div 
              key={broker.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <BrokerCard broker={broker} />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link 
            to="/brokers"
            className="inline-flex items-center text-pure-white hover:text-light-grey transition-colors font-medium"
          >
            View All Top Brokers
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}