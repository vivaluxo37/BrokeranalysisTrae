import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function TraderTestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      id: '1',
      name: 'Sarah M.',
      location: 'London, UK',
      rating: 5,
      review: "BrokerAnalysis helped me find the perfect broker for my forex trading needs. The AI matching was spot-on, and I've saved hundreds in fees since switching.",
      brokerFound: 'Interactive Brokers',
      verifiedTrader: true,
      datePublished: '2024-12-15'
    },
    {
      id: '2',
      name: 'Michael R.',
      location: 'New York, USA',
      rating: 5,
      review: "As a professional trader, I needed a broker with advanced tools and low latency. The detailed performance analysis helped me make an informed decision.",
      brokerFound: 'TD Ameritrade',
      verifiedTrader: true,
      datePublished: '2024-12-10'
    },
    {
      id: '3',
      name: 'Elena K.',
      location: 'Sydney, Australia',
      rating: 5,
      review: "Being new to trading, I was overwhelmed by broker choices. The educational resources and personalized matching made everything clear.",
      brokerFound: 'Charles Schwab',
      verifiedTrader: true,
      datePublished: '2024-12-08'
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
            Trader Testimonials
          </h2>
          <p className="text-xl neural-text max-w-3xl mx-auto leading-relaxed">
            Real stories from verified traders who found their perfect broker through our platform.
          </p>
        </header>

        {/* Main testimonial display with Review schema */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="topforex-card cosmic-glow animate-scale-in">
            <CardContent className="p-8 md:p-12 text-center">
              {/* Review Schema Markup */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Review",
                  "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": currentReview.rating,
                    "bestRating": "5"
                  },
                  "author": {
                    "@type": "Person",
                    "name": currentReview.name
                  },
                  "reviewBody": currentReview.review,
                  "datePublished": currentReview.datePublished,
                  "itemReviewed": {
                    "@type": "Organization",
                    "name": "BrokerAnalysis"
                  }
                })}
              </script>

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
                    <div className="neural-text text-sm">Matched with:</div>
                    <div className="text-topforex-accent font-semibold">{currentReview.brokerFound}</div>
                  </div>
                </div>

                {/* Verification badge */}
                {currentReview.verifiedTrader && (
                  <div className="flex items-center justify-center pt-4 border-t border-white/10">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Verified Trader
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation controls */}
        <div className="flex items-center justify-center gap-4">
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
      </div>
    </section>
  )
}