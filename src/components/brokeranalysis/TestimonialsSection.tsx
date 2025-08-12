import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Shield, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CollectionManager } from '@/utils/SafeCollection'

interface Testimonial {
  id: string
  quote: string
  author: string
  location: string
  rating: number
  verified: boolean
  avatar: string
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[]
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // Create safe collection wrapper for testimonials
  const safeTestimonials = CollectionManager.validateCollection(
    testimonials,
    'testimonials'
  )
  
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % safeTestimonials.size())
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + safeTestimonials.size()) % safeTestimonials.size())
  }

  return (
    <section className="professional-section bg-professional-black">
      <div className="professional-container">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            What Traders Are Saying
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Real feedback from verified traders who have found success using our platform.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto mb-12 relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {safeTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="professional-card p-8">
                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-medium-grey'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-pure-white text-lg leading-relaxed mb-6">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex items-center">
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.author}
                        className="w-12 h-12 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="text-pure-white font-semibold mr-2">
                            {testimonial.author}
                          </h4>
                          {testimonial.verified && (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-light-grey text-sm">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-charcoal-grey border-medium-grey text-pure-white hover:bg-medium-grey/20 w-10 h-10 rounded-full p-0"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          
          <Button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-charcoal-grey border-medium-grey text-pure-white hover:bg-medium-grey/20 w-10 h-10 rounded-full p-0"
            disabled={currentIndex === safeTestimonials.size() - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {safeTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-pure-white' : 'bg-medium-grey'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            to="/reviews"
            className="inline-flex items-center text-pure-white hover:text-light-grey transition-colors font-medium"
          >
            Read All Reviews
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <div className="hidden sm:block w-px h-4 bg-medium-grey"></div>
          <Link 
            to="/community/reviews"
            className="inline-flex items-center text-light-grey hover:text-pure-white transition-colors font-medium"
          >
            Share Your Experience
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
