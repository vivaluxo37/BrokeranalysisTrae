import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export function TestimonialsAwards() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      rating: 5,
      title: "New trader",
      text: "For forex beginners, great webinars and in general platform. So far mastering on...",
      author: "James",
      timeAgo: "20 hours ago",
      verified: true
    },
    {
      rating: 5,
      title: "Spreads are unbeatable",
      text: "I thought it was a joke when I saw 1.1 pips on eurusd on demo. But when I swit...",
      author: "Laurent Lemoine",
      timeAgo: "1 day ago",
      verified: true
    },
    {
      rating: 5,
      title: "Legit the only broker I'm not afraid to trade...",
      text: "These people answer all my questions",
      author: "Dionysios Einartag",
      timeAgo: "3 days ago",
      verified: true
    }
  ]

  const awards = [
    { name: "Top Share CFD Broker", category: "FX EMPIRE" },
    { name: "Safest Global Broker", category: "GLOBAL INVESTOR" },
    { name: "Best Customer Service", category: "ADVFN" },
    { name: "The Best FX Broker", category: "AV" },
    { name: "Best CFD Broker", category: "Rankia" },
    { name: "Forex Broker of the Year", category: "LE FONTI AWARDS" }
  ]

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20 bg-white">
      <div className="content-container">
        {/* Client Testimonials */}
        <div className="text-center mb-20">
          <h2 className="text-section-title text-professional-black mb-12">
            In Our Clients' Own Words...
          </h2>

          {/* Testimonials Carousel */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`bg-white border rounded-lg p-6 transition-all duration-300 ${
                    index === currentTestimonial ? 'border-green-400 shadow-lg scale-105' : 'border-gray-200'
                  }`}
                >
                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                      ))}
                    </div>
                    {testimonial.verified && (
                      <span className="text-green-400 text-sm">✓ Verified</span>
                    )}
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-professional-black mb-2">{testimonial.title}</h4>

                  {/* Text */}
                  <p className="text-medium-grey text-sm mb-4 leading-relaxed">{testimonial.text}</p>

                  {/* Author */}
                  <div className="text-sm">
                    <p className="font-medium text-professional-black">{testimonial.author}</p>
                    <p className="text-medium-grey">{testimonial.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <div className="flex justify-center items-center space-x-4">
              <button 
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-medium-grey" />
              </button>
              
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentTestimonial ? 'bg-green-400' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-medium-grey" />
              </button>
            </div>

            {/* Trustpilot Branding */}
            <div className="flex justify-center items-center mt-8">
              <div className="flex items-center space-x-2">
                <span className="text-professional-black font-semibold">Excellent</span>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-green-400 text-green-400" />
                  ))}
                </div>
                <span className="text-medium-grey">Based on 1,488 reviews</span>
                <span className="text-green-400 font-bold">★ Trustpilot</span>
              </div>
            </div>

            <p className="text-center text-medium-grey mt-4">
              Showing our 5 star reviews
            </p>
          </div>
        </div>

        {/* Awards Section */}
        <div className="text-center">
          <h2 className="text-section-title text-professional-black mb-4">
            20+ Global Awards
          </h2>
          <p className="text-xl text-medium-grey mb-12">
            Trade With a Multi-Award-Winning Broker
          </p>

          {/* Awards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {awards.map((award, index) => (
              <div key={index} className="text-center group">
                {/* Award Icon/Badge */}
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <div className="w-12 h-12 bg-professional-black rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">★</span>
                  </div>
                </div>
                
                {/* Award Text */}
                <h4 className="font-semibold text-professional-black text-sm mb-1">{award.name}</h4>
                <p className="text-medium-grey text-xs">{award.category}</p>
              </div>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center">
            <a href="#" className="text-accent-blue hover:text-blue-700 transition-colors font-medium inline-flex items-center space-x-1">
              <span>View All</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}