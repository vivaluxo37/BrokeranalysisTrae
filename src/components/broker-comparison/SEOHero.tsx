import { Search, Filter, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

export function SEOHero() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search logic
    console.log('Searching for:', searchQuery)
  }

  const handleGetRecommendation = () => {
    navigate('/compare/wizard')
  }

  return (
    <section className="py-20 bg-gradient-to-br from-professional-black via-charcoal-grey to-professional-black">
      <div className="content-container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline - SEO Optimized */}
          <h1 className="text-section-title font-bold text-white mb-6 leading-tight">
            Independent Broker Reviews & Comparisons for 
            <span className="text-accent-blue"> Forex, Stocks, Crypto & CFDs</span>
          </h1>

          {/* Subheadline with USP */}
          <p className="text-xl text-light-grey mb-8 leading-relaxed max-w-3xl mx-auto">
            Compare 100+ regulated brokers with our transparent methodology. 
            Read independent reviews, compare fees and execution, and find the best broker for your trading style.
          </p>

          {/* Hero Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Input
                  type="search"
                  placeholder="Search brokers by name, country, or asset class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={Search}
                  iconPosition="left"
                  inputSize="lg"
                  className="w-full"
                  aria-label="Search for brokers"
                />
              </div>
              <Button type="submit" size="lg" className="px-8">
                Find Brokers
                <ArrowRight size={20} />
              </Button>
            </div>
          </form>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button size="lg" className="px-8">
              Compare Brokers
            </Button>
            <Button size="lg" variant="outline" className="px-8" onClick={handleGetRecommendation}>
              Get Broker Recommendation
            </Button>
            <Button size="lg" variant="ghost" icon={Filter} className="px-8">
              Advanced Filter
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">100+</div>
              <div className="text-sm text-light-grey">In-depth Reviews</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">50+</div>
              <div className="text-sm text-light-grey">Countries Covered</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">5-Point</div>
              <div className="text-sm text-light-grey">Scoring System</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm text-light-grey">Updated Data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}