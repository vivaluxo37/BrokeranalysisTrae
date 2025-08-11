import { Award, Quote, Shield, Star, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Professional Trader",
    company: "Goldman Sachs",
    rating: 5,
    text: "TopForex.Trade helped me find the perfect broker for my trading style. Their detailed reviews and comparison tools saved me weeks of research.",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Investment Manager",
    company: "Morgan Stanley",
    rating: 5,
    text: "The regulatory insights and fee comparisons are incredibly detailed. I recommend this platform to all my clients looking for reliable brokers.",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Forex Analyst",
    company: "JP Morgan",
    rating: 5,
    text: "Excellent platform with unbiased reviews. The educational content in their Forex Academy is top-notch for both beginners and experienced traders.",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
]

const trustStats = [
  {
    icon: Users,
    number: "2.5M+",
    label: "Traders Helped",
    description: "Active users who found their perfect broker"
  },
  {
    icon: Shield,
    number: "500+",
    label: "Verified Brokers",
    description: "All brokers are regulatory compliant"
  },
  {
    icon: Award,
    number: "15+",
    label: "Years Experience",
    description: "Combined team expertise in financial markets"
  },
  {
    icon: Star,
    number: "4.9/5",
    label: "User Rating",
    description: "Based on 50,000+ user reviews"
  }
]

export function TrustSignals() {
  return (
    <section className="section-padding bg-topforex-secondary" aria-labelledby="trust-signals-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16">
          <h2 id="trust-signals-heading" className="text-section-title text-white mb-6">
            Trusted by Professional Traders Worldwide
          </h2>
          <p className="text-topforex-muted text-lg max-w-3xl mx-auto">
            Join millions of traders who trust our platform for honest broker reviews, 
            comprehensive comparisons, and expert market insights.
          </p>
        </header>

        {/* Trust Statistics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-topforex-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-topforex-accent font-semibold mb-1">{stat.label}</div>
              <div className="text-topforex-muted text-sm">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="topforex-card topforex-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-topforex-accent mb-4" />
                <blockquote className="text-white leading-relaxed mb-6">
                  "{testimonial.text}"
                </blockquote>
                <footer className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.name} testimonial`}
                    className="w-12 h-12 rounded-full object-cover"
                    width="48"
                    height="48"
                  />
                  <div>
                    <cite className="text-white font-semibold not-italic">{testimonial.name}</cite>
                    <div className="text-topforex-muted text-sm">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </footer>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}