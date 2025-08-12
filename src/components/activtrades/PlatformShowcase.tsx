import { Button } from '@/components/ui/button'

export function PlatformShowcase() {
  return (
    <section className="py-20 bg-gradient-to-br from-professional-black via-charcoal-grey to-blue-900 relative overflow-hidden">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <h2 className="text-section-title mb-8">
              Trade the Markets<br />
              Your Way
            </h2>

            {/* Platform Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button className="bg-white text-professional-black hover:bg-gray-100 px-6 py-3">
                ActivTrader
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-professional-black px-6 py-3">
                MT4
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-professional-black px-6 py-3">
                MT5
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-professional-black px-6 py-3">
                TradingView
              </Button>
            </div>

            <p className="text-lg text-light-grey mb-8 leading-relaxed">
              Trade across 7 asset classes on our next-generation trading platform
            </p>

            <div className="flex items-center space-x-4 mb-8">
              <Button className="bg-green-500 hover:bg-green-600 text-white px-6">
                Read More →
              </Button>
            </div>

            <Button size="lg" className="bg-accent-blue hover:bg-blue-700 text-white px-8">
              Start Trading Now
            </Button>
          </div>

          {/* Right - Platform Screenshots */}
          <div className="relative">
            {/* Desktop */}
            <div className="relative z-10 mb-8">
              <img
                src="https://images.unsplash.com/photo-1586448910234-297fae7189e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHx0cmFkaW5nJTIwcGxhdGZvcm0lMjBmaW5hbmNpYWwlMjBjaGFydHMlMjBjb21wdXRlciUyMHNjcmVlbiUyMHN0b2NrJTIwbWFya2V0fGVufDB8MHx8fDE3NTQ5NzY1OTV8MA&ixlib=rb-4.1.0&q=85"
                alt="Professional trading platform interface on desktop computer with charts and financial data - KOBU Agency on Unsplash"
                className="w-full rounded-lg shadow-2xl"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>

            {/* Tablet - Positioned overlapping */}
            <div className="absolute -bottom-4 -left-8 z-20 w-48">
              <img
                src="https://images.unsplash.com/photo-1533906966484-a9c978a3f090?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHx0YWJsZXQlMjB0cmFkaW5nJTIwYXBwJTIwZmluYW5jaWFsJTIwZGF0YSUyMG1vYmlsZSUyMHRyYWRpbmd8ZW58MHwxfHx8MTc1NDk3NjU5NXww&ixlib=rb-4.1.0&q=85"
                alt="Trading platform interface displayed on tablet device with financial charts - AltumCode on Unsplash"
                className="w-full rounded-lg shadow-xl"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>

            {/* Mobile - Positioned overlapping */}
            <div className="absolute -bottom-8 -right-4 z-30 w-24">
              <img
                src="https://images.unsplash.com/photo-1611967556157-d5c8830b5161?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxzbWFydHBob25lJTIwbW9iaWxlJTIwYXBwJTIwdHJhZGluZyUyMGludGVyZmFjZSUyMGZpbmFuY2lhbCUyMGNoYXJ0c3xlbnwwfDF8fHwxNzU0OTc2NTk1fDA&ixlib=rb-4.1.0&q=85"
                alt="Mobile trading app interface on smartphone with charts and trading data - Clay Banks on Unsplash"
                className="w-full rounded-lg shadow-xl"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent-blue/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-green-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
