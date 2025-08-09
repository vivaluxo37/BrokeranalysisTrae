import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, ArrowRight, Play, Unlock } from 'lucide-react'

interface ProfessionalHeroSectionProps {
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

export function ProfessionalHeroSection({ heroData, trustIndicators }: ProfessionalHeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery)
    }
  }

  return (
    <section className="professional-hero bg-professional-black relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="professional-container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating elements - subtle */}
          <div className="absolute top-20 left-10 w-2 h-2 bg-light-grey rounded-full opacity-40 animate-pulse hidden lg:block"></div>
          <div className="absolute top-40 right-20 w-1 h-1 bg-pure-white rounded-full opacity-60 animate-pulse hidden lg:block" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-light-grey rounded-full opacity-30 animate-pulse hidden lg:block" style={{ animationDelay: '2s' }}></div>

          {/* Asset indicators - matching the image */}
          <div className="absolute top-32 left-16 hidden xl:flex flex-col items-start space-y-1 opacity-60">
            <div className="flex items-center space-x-2 text-xs text-light-grey">
              <div className="w-3 h-3 border border-light-grey rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-light-grey rounded-full"></div>
              </div>
              <span>Cortex</span>
            </div>
            <div className="text-xs text-medium-grey ml-5">70,945</div>
          </div>

          <div className="absolute top-64 left-8 hidden xl:flex flex-col items-start space-y-1 opacity-60">
            <div className="flex items-center space-x-2 text-xs text-light-grey">
              <div className="w-3 h-3 border border-light-grey rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-light-grey rounded-full"></div>
              </div>
              <span>Aelf</span>
            </div>
            <div className="text-xs text-medium-grey ml-5">18,346</div>
          </div>

          <div className="absolute top-40 right-16 hidden xl:flex flex-col items-end space-y-1 opacity-60">
            <div className="flex items-center space-x-2 text-xs text-light-grey">
              <span>Quant</span>
              <div className="w-3 h-3 border border-light-grey rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-light-grey rounded-full"></div>
              </div>
            </div>
            <div className="text-xs text-medium-grey mr-5">2,916</div>
          </div>

          <div className="absolute bottom-40 right-12 hidden xl:flex flex-col items-end space-y-1 opacity-60">
            <div className="flex items-center space-x-2 text-xs text-light-grey">
              <span>Meeton</span>
              <div className="w-3 h-3 border border-light-grey rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-light-grey rounded-full"></div>
              </div>
            </div>
            <div className="text-xs text-medium-grey mr-5">440</div>
          </div>

          {/* Central unlock message */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-flex items-center space-x-2 text-light-grey text-sm">
              <Unlock className="w-4 h-4" />
              <span>Unlock Your Assets Spark!</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-hero text-pure-white mb-6 animate-slide-up">
            One-click for Asset <span className="text-light-grey">Defense</span>
          </h1>
          
          <p className="text-subtitle mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Dive into the art assets, where innovative blockchain technology meets financial expertise
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-scale-in" style={{ animationDelay: '0.4s' }}>
            <Button className="btn-professional-secondary">
              <span>Open App</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button className="btn-professional-primary">
              Discover More
            </Button>
          </div>

          {/* Video play button - centered */}
          <div className="mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <button className="w-16 h-16 bg-charcoal-grey border border-medium-grey rounded-full flex items-center justify-center hover:bg-medium-grey/20 transition-all duration-200 mx-auto">
              <Play className="w-6 h-6 text-pure-white ml-1" />
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-light-grey text-sm opacity-60">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 border border-light-grey rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-light-grey rounded-full animate-bounce"></div>
              </div>
              <span>02/03 . Scroll down</span>
            </div>
          </div>

          {/* Bottom section indicator */}
          <div className="absolute bottom-8 right-8 text-light-grey text-sm opacity-60 hidden lg:block">
            <div className="text-right">
              <div>DeFi horizons</div>
              <div className="w-8 h-0.5 bg-light-grey mt-2 ml-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner logos at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-charcoal-grey/50 to-transparent py-8">
        <div className="professional-container">
          <div className="flex justify-center items-center space-x-8 opacity-40">
            <div className="text-light-grey text-sm">Vercel</div>
            <div className="text-light-grey text-sm">loom</div>
            <div className="text-light-grey text-sm">Cash App</div>
            <div className="text-light-grey text-sm">Loops</div>
            <div className="text-light-grey text-sm">zapier</div>
            <div className="text-light-grey text-sm">ramp</div>
            <div className="text-light-grey text-sm">Raycast</div>
          </div>
        </div>
      </div>
    </section>
  )
}