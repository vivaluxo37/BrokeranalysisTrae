import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Shield, Star, TrendingUp, Users } from 'lucide-react'

interface HeroSectionProps {
  heroData: {
    title: string
    subtitle: string
    searchPlaceholder: string
    ctaPrimary: string
    ctaSecondary: string
  }
  trustIndicators: {
    totalBrokers: number
    totalReviews: number
    averageRating: number
    regulatedBrokers: number
    yearsOfExperience: number
    countriesServed: number
  }
}

export function HeroSection({ heroData, trustIndicators }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center cosmic-void overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 neural-network opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Badge */}
          <div className="flex justify-center mb-8">
            <Badge className="bg-brokeranalysis-accent/20 text-brokeranalysis-accent border-brokeranalysis-accent/30 px-4 py-2 text-sm font-semibold">
              <Shield className="w-4 h-4 mr-2" />
              Trusted by {(trustIndicators.totalReviews / 1000000).toFixed(1)}M+ Traders Worldwide
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-hero text-gradient mb-6 animate-fade-in">
            {heroData.title}
          </h1>
          
          <p className="text-xl text-starfield-gray mb-12 max-w-2xl mx-auto animate-slide-up">
            {heroData.subtitle}
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12 animate-scale-in">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-starfield-gray w-5 h-5" />
                <Input
                  type="text"
                  placeholder={heroData.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-32 py-4 text-lg bg-glass-overlay/10 border-glass-overlay/20 backdrop-blur-xl rounded-2xl focus:ring-2 focus:ring-brokeranalysis-accent focus:border-transparent"
                />
                <Button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brokeranalysis-accent hover:bg-brokeranalysis-accent/90 text-white px-6 py-2 rounded-xl font-semibold"
                >
                  {heroData.ctaPrimary}
                </Button>
              </div>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-brokeranalysis-accent hover:bg-brokeranalysis-accent/90 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              {heroData.ctaSecondary}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-glass-overlay/30 text-luminescent-white hover:bg-glass-overlay/10 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-xl"
            >
              Learn More
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-brokeranalysis-accent mb-1">
                {trustIndicators.totalBrokers}+
              </div>
              <div className="text-sm text-starfield-gray">Regulated Brokers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brokeranalysis-accent mb-1 flex items-center justify-center">
                <Star className="w-5 h-5 mr-1 fill-current" />
                {trustIndicators.averageRating}
              </div>
              <div className="text-sm text-starfield-gray">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brokeranalysis-accent mb-1">
                {trustIndicators.yearsOfExperience}+
              </div>
              <div className="text-sm text-starfield-gray">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brokeranalysis-accent mb-1 flex items-center justify-center">
                <Users className="w-5 h-5 mr-1" />
                {trustIndicators.countriesServed}+
              </div>
              <div className="text-sm text-starfield-gray">Countries Served</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 floating-node">
        <div className="w-16 h-16 bg-brokeranalysis-accent/20 rounded-full flex items-center justify-center backdrop-blur-xl">
          <TrendingUp className="w-8 h-8 text-brokeranalysis-accent" />
        </div>
      </div>
      
      <div className="absolute bottom-20 right-10 floating-node" style={{ animationDelay: '2s' }}>
        <div className="w-12 h-12 bg-neural-blue/20 rounded-full flex items-center justify-center backdrop-blur-xl">
          <Shield className="w-6 h-6 text-neural-blue" />
        </div>
      </div>
    </section>
  )
}
