import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'

export function ActivTradesHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-professional-black via-charcoal-grey to-professional-black overflow-hidden">
      {/* Background Racing Car Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1727127445534-8c1127a4418f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxmb3JtdWxhJTIwMSUyMHJhY2luZyUyMGNhciUyMHJlZCUyMGJ1bGwlMjBtb3RvcnNwb3J0fGVufDB8MHx8fDE3NTQ5NzY1OTV8MA&ixlib=rb-4.1.0&q=85"
          alt="Formula 1 Red Bull racing car in action on track, dynamic racing scene, professional motorsport photography - Jake Banasik on Unsplash"
          className="w-full h-full object-cover opacity-30"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-professional-black/80 via-professional-black/60 to-transparent" />
      </div>

      {/* Header Navigation */}
      <div className="relative z-20 w-full">
        <div className="flex items-center justify-between p-6 lg:px-12">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent-blue rounded-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <span className="text-white font-semibold text-lg">For Institutions</span>
            </div>
            
            <nav className="hidden lg:flex items-center space-x-6">
              <a href="#" className="text-light-grey hover:text-white transition-colors">Markets</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">Platforms</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">Accounts</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">Education</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">Tools</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">About Us</a>
              <a href="#" className="text-light-grey hover:text-white transition-colors">Rewards</a>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src="/favicon.svg" alt="UK Flag" className="w-5 h-5" />
              <span className="text-white">English</span>
            </div>
            <Button variant="ghost" className="text-white">Log in</Button>
            <Button className="bg-accent-blue hover:bg-blue-700 text-white">Sign Up</Button>
          </div>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex items-center min-h-[80vh] px-6 lg:px-12">
        <div className="max-w-4xl">
          {/* Risk Warning */}
          <div className="mb-8 p-4 bg-charcoal-grey/80 rounded-lg border border-medium-grey">
            <p className="text-light-grey text-sm">
              CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 82% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money.
            </p>
          </div>

          {/* Main Headline */}
          <h1 className="text-hero font-bold text-white mb-6 leading-tight">
            Trade With Ultra<br />
            Fast Execution
          </h1>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
            {/* Trustpilot */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-green-400 text-green-400" />
                ))}
              </div>
              <span className="text-white font-medium">Trustpilot</span>
            </div>

            {/* TradingView */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-green-400 text-green-400" />
                ))}
              </div>
              <span className="text-white font-medium">TradingView</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Button size="lg" className="bg-accent-blue hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Start Trading Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg">
              Try a Free Demo
            </Button>
          </div>

          {/* Partnership Branding */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold text-xl">ACTIVTRADES</span>
              <span className="text-light-grey">/</span>
              <span className="text-white font-bold text-xl">NL</span>
              <span className="text-light-grey text-sm">NIKOLA TSOLOV<br />OFFICIAL PARTNER</span>
            </div>
          </div>

          {/* Bottom Text */}
          <p className="text-light-grey mt-8 max-w-2xl">
            ActivTrades backs those who push the limits - on the track and in the markets.
          </p>
        </div>
      </div>
    </section>
  )
}
