import { BrokerSearchWidget } from './BrokerSearchWidget'
import { Badge } from '@/components/ui/badge'

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
      className="professional-hero bg-professional-black relative overflow-hidden"
      role="banner"
      aria-labelledby="hero-title"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="professional-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 
            id="hero-title"
            className="text-hero text-pure-white mb-6 animate-fade-in"
            tabIndex={-1}
          >
            {heroData.title}
          </h1>
          
          <p 
            className="text-subtitle mb-12 max-w-3xl mx-auto animate-slide-up"
            aria-describedby="hero-title"
          >
            {heroData.subtitle}
          </p>

          {/* Broker Search Widget */}
          <div className="mb-12 animate-scale-in" role="search" aria-label="Find brokers">
            <BrokerSearchWidget onSearch={handleSearch} />
          </div>

          {/* Trust Logos */}
          <div 
            className="animate-fade-in" 
            style={{ animationDelay: '0.6s' }}
            role="complementary"
            aria-label="Featured in media"
          >
            <p className="text-light-grey text-sm mb-6">As featured in...</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {trustLogos.map((logo, index) => (
                <div key={logo.name} className="flex items-center">
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
    </section>
  )
}