import { useState } from 'react'
import { CheckCircle, Mail, Shield, TrendingUp, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !consent) return

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsSubmitting(false)
  }

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Weekly Market Insights',
      description: 'AI-powered market analysis and trading opportunities'
    },
    {
      icon: Shield,
      title: 'Broker Updates & Alerts',
      description: 'Real-time notifications about regulatory changes and broker news'
    },
    {
      icon: Zap,
      title: 'Exclusive Trading Tips',
      description: 'Advanced strategies and techniques from professional traders'
    }
  ]

  if (isSubscribed) {
    return (
      <section className="section-padding cosmic-void aurora-bg" aria-labelledby="newsletter-success-heading">
        <div className="container mx-auto container-padding text-center">
          <Card className="glass-card max-w-2xl mx-auto cosmic-glow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-accent-blue" />
              </div>
              <h2 id="newsletter-success-heading" className="text-3xl font-bold cosmic-text mb-4 text-glow">
                Welcome to the Community!
              </h2>
              <p className="neural-text text-lg mb-6">
                Thank you for subscribing! You'll receive your first market insights email within 24 hours.
              </p>
              <div className="grid md:grid-cols-3 gap-4 neural-text text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-blue" />
                  <span>Weekly market insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-blue" />
                  <span>Broker updates & alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-blue" />
                  <span>Exclusive trading tips</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding cosmic-void aurora-bg" aria-labelledby="newsletter-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-12 animate-fade-in">
          <h2 id="newsletter-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Get Exclusive Trading Insights
          </h2>
          <p className="text-xl neural-text mb-8 max-w-4xl mx-auto leading-relaxed">
            Join 100,000+ traders receiving our AI-powered market analysis, exclusive broker comparisons, 
            trading strategies, and early access to new features. Completely free, forever.
          </p>
        </header>

        {/* Benefits grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="topforex-card floating-node" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center mx-auto mb-4 cosmic-glow">
                  <benefit.icon className="w-6 h-6 text-topforex-accent" />
                </div>
                <h3 className="text-lg font-bold cosmic-text mb-2">{benefit.title}</h3>
                <p className="neural-text text-sm">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Newsletter signup form */}
        <Card className="glass-card max-w-2xl mx-auto animate-slide-up cosmic-glow">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address for newsletter subscription
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-topforex-accent" />
                    <Input
                      id="newsletter-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 glass-card bg-white/5 border-white/10 text-white placeholder:text-white/60 h-12 rounded-full"
                      required
                      aria-describedby="email-description"
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  size="lg"
                  disabled={!email || !consent || isSubmitting}
                  className="bg-topforex-accent hover:bg-topforex-accent/80 text-white px-8 h-12 rounded-full disabled:opacity-50"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe Free'}
                </Button>
              </div>

              {/* GDPR consent checkbox */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="newsletter-consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                  className="mt-1"
                  aria-describedby="consent-description"
                />
                <label htmlFor="newsletter-consent" className="neural-text text-sm leading-relaxed cursor-pointer">
                  I agree to receive marketing emails from BrokerAnalysis. You can unsubscribe at any time. 
                  We respect your privacy and never share your data. 
                  <a href="/privacy" className="text-topforex-accent hover:underline ml-1">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <div id="email-description" className="grid md:grid-cols-3 gap-4 neural-text text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-topforex-accent" />
                  <span>Weekly market insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-topforex-accent" />
                  <span>Broker updates & alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-topforex-accent" />
                  <span>Exclusive trading tips</span>
                </div>
              </div>
              
              <p id="consent-description" className="neural-text text-sm text-center">
                Unsubscribe anytime. We respect your privacy and never share your data.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Social proof */}
        <div className="text-center mt-8">
          <p className="neural-text text-sm">
            Join <span className="text-topforex-accent font-semibold">100,000+</span> traders already receiving our insights
          </p>
        </div>
      </div>
    </section>
  )
}
