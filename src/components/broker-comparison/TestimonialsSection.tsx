import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ChevronLeft, ChevronRight, Quote, Award, Users, Globe } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

export function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const navigate = useNavigate()

  const testimonials = [
    {
      id: 1,
      name: 'James Mitchell',
      role: 'Day Trader',
      location: 'London, UK',
      rating: 5,
      text: 'BrokerAnalysis helped me find the perfect broker for my trading style. Their methodology is transparent and their reviews are incredibly detailed. Saved me thousands in fees!',
      tradingExperience: '5 years',
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      role: 'Forex Trader',
      location: 'Singapore',
      rating: 5,
      text: 'The comparison tools are fantastic. I was able to compare spreads and fees across multiple brokers in minutes. The real account testing gives me confidence in their reviews.',
      tradingExperience: '3 years',
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 3,
      name: 'Michael Rodriguez',
      role: 'Investment Manager',
      location: 'New York, USA',
      rating: 5,
      text: 'As a professional, I need accurate and up-to-date information. BrokerAnalysis delivers exactly that. Their regulatory analysis is particularly valuable for compliance.',
      tradingExperience: '10+ years',
      avatar: 'https://i.pravatar.cc/150?img=3'
    },
    {
      id: 4,
      name: 'Emma Thompson',
      role: 'Beginner Trader',
      location: 'Melbourne, Australia',
      rating: 5,
      text: 'Starting my trading journey was overwhelming until I found BrokerAnalysis. Their beginner guides and broker recommendations made everything so much clearer.',
      tradingExperience: '6 months',
      avatar: 'https://i.pravatar.cc/150?img=4'
    }
  ]

  const trustSignals = [
    {
      icon: Users,
      value: '50,000+',
      label: 'Traders Helped'
    },
    {
      icon: Globe,
      value: '100+',
      label: 'Brokers Reviewed'
    },
    {
      icon: Award,
      value: '99%',
      label: 'Satisfaction Rate'
    },
    {
      icon: Star,
      value: '4.9/5',
      label: 'Average Rating'
    }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleGetRecommendation = () => {
    navigate('/compare/wizard')
  }

  return (
    <section className="py-20 bg-professional-black">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title text-pure-white mb-4">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-lg text-light-grey max-w-2xl mx-auto">
            Join thousands of traders who have found their perfect broker through our independent reviews and comparisons.
          </p>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {trustSignals.map((signal, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-accent-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <signal.icon className="w-8 h-8 text-accent-blue" />
              </div>
              <div className="text-2xl font-bold text-pure-white mb-1">{signal.value}</div>
              <div className="text-sm text-light-grey">{signal.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <Card className="professional-card overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                {/* Current Testimonial */}
                <div className="p-8 lg:p-12">
                  <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
                    {/* Avatar and Info */}
                    <div className="flex-shrink-0 text-center lg:text-left">
                      <img
                        src={testimonials[currentTestimonial].avatar}
                        alt={testimonials[currentTestimonial].name}
                        className="w-20 h-20 rounded-full mx-auto lg:mx-0 mb-4"
                        style={{ width: '80px', height: '80px' }}
                      />
                      <h4 className="font-semibold text-pure-white">
                        {testimonials[currentTestimonial].name}
                      </h4>
                      <p className="text-sm text-light-grey">
                        {testimonials[currentTestimonial].role}
                      </p>
                      <p className="text-xs text-light-grey">
                        {testimonials[currentTestimonial].location}
                      </p>
                      <p className="text-xs text-accent-blue mt-1">
                        {testimonials[currentTestimonial].tradingExperience} experience
                      </p>
                    </div>

                    {/* Testimonial Content */}
                    <div className="flex-1">
                      <Quote className="w-8 h-8 text-accent-blue mb-4 mx-auto lg:mx-0" />
                      
                      {/* Rating */}
                      <div className="flex justify-center lg:justify-start space-x-1 mb-4">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      {/* Testimonial Text */}
                      <blockquote className="text-lg text-pure-white leading-relaxed text-center lg:text-left">
                        "{testimonials[currentTestimonial].text}"
                      </blockquote>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between p-6 bg-medium-grey border-t border-charcoal-grey">
                  <button
                    onClick={prevTestimonial}
                    className="flex items-center space-x-2 text-light-grey hover:text-pure-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  {/* Dots Indicator */}
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentTestimonial ? 'bg-accent-blue' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="flex items-center space-x-2 text-light-grey hover:text-pure-white transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-semibold text-pure-white mb-4">
            Ready to Find Your Perfect Broker?
          </h3>
          <p className="text-light-grey mb-6">
            Join thousands of satisfied traders who found their ideal broker through our platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" onClick={handleGetRecommendation}>
              Get Broker Recommendation
            </Button>
            <Button size="lg" variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
              Read All Reviews
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}