import { useState } from 'react'
import { Star, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function FeaturedBrokers() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filters = ['All', 'Forex', 'Stocks', 'Crypto', 'CFDs', 'Options']

  const featuredBrokers = [
    {
      id: 1,
      name: 'Interactive Brokers',
      logo: 'IB',
      rating: 4.8,
      reviewCount: 1247,
      categories: ['Stocks', 'Options', 'Forex'],
      pros: ['Low fees', 'Global markets', 'Advanced platform'],
      cons: ['Complex interface'],
      minDeposit: '$0',
      regulation: 'SEC, FCA, ASIC',
      featured: true
    },
    {
      id: 2,
      name: 'IG Markets',
      logo: 'IG',
      rating: 4.6,
      reviewCount: 892,
      categories: ['CFDs', 'Forex', 'Stocks'],
      pros: ['Tight spreads', 'Good education', 'Mobile app'],
      cons: ['Higher fees for small accounts'],
      minDeposit: '$250',
      regulation: 'FCA, ASIC',
      featured: true
    },
    {
      id: 3,
      name: 'Plus500',
      logo: 'P5',
      rating: 4.4,
      reviewCount: 1156,
      categories: ['CFDs', 'Crypto', 'Forex'],
      pros: ['User-friendly', 'No commission', 'Demo account'],
      cons: ['Limited research tools'],
      minDeposit: '$100',
      regulation: 'FCA, CySEC',
      featured: true
    },
    {
      id: 4,
      name: 'eToro',
      logo: 'eT',
      rating: 4.3,
      reviewCount: 2341,
      categories: ['Stocks', 'Crypto', 'Social Trading'],
      pros: ['Social trading', 'Copy trading', 'Crypto wallet'],
      cons: ['Limited advanced tools'],
      minDeposit: '$200',
      regulation: 'FCA, CySEC',
      featured: false
    }
  ]

  const filteredBrokers = activeFilter === 'All' 
    ? featuredBrokers 
    : featuredBrokers.filter(broker => broker.categories.includes(activeFilter))

  return (
    <section className="py-20 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-section-title text-professional-black mb-4">
            Top-Rated Brokers
          </h2>
          <p className="text-lg text-medium-grey max-w-2xl mx-auto">
            Compare our highest-rated brokers based on comprehensive analysis of fees, platforms, regulation, and user reviews.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                activeFilter === filter
                  ? 'bg-accent-blue text-white'
                  : 'bg-gray-100 text-medium-grey hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Brokers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredBrokers.map((broker) => (
            <Card key={broker.id} variant="interactive" className="bg-white border-gray-200 text-professional-black">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-accent-blue rounded-lg flex items-center justify-center text-white font-bold">
                      {broker.logo}
                    </div>
                    <div>
                      <CardTitle level={4} className="text-professional-black">{broker.name}</CardTitle>
                      {broker.featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${
                          i < Math.floor(broker.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-professional-black">{broker.rating}</span>
                  <span className="text-sm text-medium-grey">({broker.reviewCount} reviews)</span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {broker.categories.map((category) => (
                    <span 
                      key={category}
                      className="px-2 py-1 bg-gray-100 text-xs rounded-full text-medium-grey"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </CardHeader>

              <CardContent>
                {/* Key Info */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-medium-grey">Min Deposit:</span>
                    <div className="font-semibold text-professional-black">{broker.minDeposit}</div>
                  </div>
                  <div>
                    <span className="text-medium-grey">Regulation:</span>
                    <div className="font-semibold text-professional-black">{broker.regulation}</div>
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="space-y-3 mb-6">
                  <div>
                    <h5 className="text-sm font-medium text-green-600 mb-1 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Pros
                    </h5>
                    <ul className="text-xs text-medium-grey space-y-1">
                      {broker.pros.slice(0, 2).map((pro, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    Read Review
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-gray-300 text-professional-black hover:bg-gray-50">
                    Compare
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
            View All Broker Reviews
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </section>
  )
}