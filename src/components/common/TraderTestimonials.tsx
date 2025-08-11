import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function TraderTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: '1',
      name: 'Sarah M.',
      location: 'London, UK',
      tradingExperience: '3 years',
      rating: 5,
      review: "BrokerAnalysis helped me find the perfect broker for my forex trading needs. The AI matching was spot-on, and I've saved hundreds in fees since switching. The regulatory verification gave me complete confidence.",
      brokerFound: 'Interactive Brokers',
      verifiedTrader: true,
      tradingStyle: 'Forex Day Trading'
    },
    {
      id: '2',
      name: 'Michael R.',
      location: 'New York, USA',
      tradingExperience: '7 years',
      rating: 5,
      review: "As a professional trader, I needed a broker with advanced tools and low latency. The detailed performance analysis and real-time data helped me make an informed decision. Execution speed improved by 40%.",
      brokerFound: 'TD Ameritrade',
      verifiedTrader: true,
      tradingStyle: 'Options Trading'
    },
    {
      id: '3',
      name: 'Elena K.',
      location: 'Sydney, Australia',
      tradingExperience: '1 year',
      rating: 5,
      review: "Being new to trading, I was overwhelmed by broker choices. The educational resources and personalized matching made everything clear. Found a beginner-friendly broker with excellent support.",
      brokerFound: 'Charles Schwab',
      verifiedTrader: true,
      tradingStyle: 'Stock Investing'
    },
    {
      id: '4',
      name: 'David L.',
      location: 'Toronto, Canada',
      tradingExperience: '5 years',
      rating: 5,
      review: "The community reviews were incredibly helpful. Real trader experiences helped me avoid brokers with hidden fees. The AI analysis confirmed my choice with data-backed insights.",
      brokerFound: 'Questrade',
      verifiedTrader: true,
      tradingStyle: 'Swing Trading'
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentReview = testimonials[currentTestimonial]

  return (
    <section className="section-padding cosmic-void aurora-bg" aria-labelledby="testimonials-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 id="testimonials-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Trusted by Professional Traders Worldwide
          </h2>
          <p className="text-xl neural-text max-w-3xl mx-auto leading-relaxed">
            Join thousands of traders who found their perfect broker through our platform. 
            Real stories from verified traders who improved their trading experience.
          </p>
        </header>

        {/* Main testimonial display */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="topforex-card cosmic-glow animate-scale-in">
            <CardContent className="p-8 md:p-12 text-center">
              {/* Quote icon */}
              <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mx-auto mb-6">
                <Quote className="w-8 h-8 text-topforex-accent" />
              </div>

              {/* Rating stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(currentReview.rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Review text */}
              <blockquote className="text-xl md:text-2xl cosmic-text leading-relaxed mb-8 italic">
                "{currentReview.review}"
              </blockquote>

              {/* Trader info */}
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <div className="text-center">
                    <div className="cosmic-text font-semibold text-lg">{currentReview.name}</div>
                    <div className="neural-text text-sm">{currentReview.location}</div>
                  </div>
                  <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
                  <div className="text-center">
                    <div className="neural-text text-sm">Trading Experience</div>
                    <div className="cosmic-text font-semibold">{currentReview.tradingExperience}</div>
                  </div>
                  <div className="w-px h-8 bg-white/20 hidden sm:block"></div>
                  <div className="text-center">
                    <div className="neural-text text-sm">Trading Style</div>
                    <div className="cosmic-text font-semibold">{currentReview.tradingStyle}</div>
                  </div>
                </div>

                {/* Broker found and verification */}
                <div className="flex items-center justify-center gap-4 pt-4 border-t border-white/10">
                  <span className="neural-text text-sm">Matched with:</span>
                  <span className="text-topforex-accent font-semibold">{currentReview.brokerFound}</span>
                  {currentReview.verifiedTrader && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs font-medium">
                      ✓ Verified Trader
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevTestimonial}
            className="border-white/20 text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Dots indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-topforex-accent' : 'bg-white/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextTestimonial}
            className="border-white/20 text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Trust metrics */}
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {[
            { value: '2.5M+', label: 'Traders Helped', description: 'Found their perfect broker' },
            { value: '4.9/5', label: 'Average Rating', description: 'From verified reviews' },
            { value: '96%', label: 'Match Success', description: 'Traders satisfied with matches' },
            { value: '15+', label: 'Years Experience', description: 'In broker analysis' }
          ].map((metric, index) => (
            <div key={index} className="floating-node" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="text-3xl font-bold cosmic-text mb-2 text-glow">{metric.value}</div>
              <div className="text-topforex-accent font-semibold mb-1">{metric.label}</div>
              <div className="neural-text text-sm">{metric.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}