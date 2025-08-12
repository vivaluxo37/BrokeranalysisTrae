import { BrokerSearchWidget } from './BrokerSearchWidget'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Shield, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeroData {
  title: string
  subtitle: string
  searchPlaceholder: string
  ctaPrimary: string
  ctaSecondary: string
}

interface TrustLogos {
  name: string
  logo: string
}

interface BrokerAnalysisHeroSectionProps {
  heroData: HeroData
  trustLogos: TrustLogos[]
}

export function BrokerAnalysisHeroSection({ heroData, trustLogos }: BrokerAnalysisHeroSectionProps) {
  const handleSearch = (filters: { assetClass?: string; region?: string }) => {
    console.log('Search filters:', filters)
    // Handle search logic
  }

  return (
    <section 
      className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden"
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5" />
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-50" />
      </div>

      <div className="relative z-10 flex items-center min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-8 mb-8 animate-fade-in">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4 text-green-400" />
                <span>Regulated Brokers</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4 text-blue-400" />
                <span>1M+ Users</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <TrendingUp className="w-4 h-4 text-purple-400" />
                <span>Real-time Data</span>
              </div>
            </div>

            {/* Main Heading */}
            <h1 
              id="hero-title"
              className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in leading-tight"
              tabIndex={-1}
            >
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                {heroData.title}
              </span>
            </h1>
            
            <p 
              className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-slide-up leading-relaxed"
              aria-describedby="hero-title"
            >
              {heroData.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {heroData.ctaPrimary}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                asChild
                className="border-gray-600 text-white hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                <Link to="/brokers">
                  {heroData.ctaSecondary}
                </Link>
              </Button>
            </div>

            {/* Broker Search Widget */}
            <div className="mb-16 animate-scale-in" role="search" aria-label="Find brokers">
              <BrokerSearchWidget onSearch={handleSearch} />
            </div>

            {/* Trust Logos */}
            <div 
              className="animate-fade-in" 
              style={{ animationDelay: '0.6s' }}
              role="complementary"
              aria-label="Featured in media"
            >
              <p className="text-gray-400 text-sm mb-6">Trusted by leading financial publications</p>
              <div className="flex justify-center items-center flex-wrap gap-8 opacity-60">
                {trustLogos.map((logo, index) => (
                  <div 
                    key={logo.name} 
                    className="flex items-center transition-all duration-300 hover:opacity-100 hover:scale-110"
                  >
                    <img 
                      src={logo.logo} 
                      alt={`Featured in ${logo.name}`}
                      className="h-8 object-contain filter grayscale hover:grayscale-0 focus:grayscale-0 transition-all duration-300"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          // Could open media coverage or press page
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
