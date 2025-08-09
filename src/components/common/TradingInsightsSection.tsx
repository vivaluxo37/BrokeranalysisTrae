import { useState } from 'react'
import { CheckCircle, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export function TradingInsightsSection() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !consent) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitting(false)
  }

  return (
    <section className="section-padding cosmic-void aurora-bg" aria-labelledby="insights-heading">
      <div className="container mx-auto container-padding text-center">
        <header className="mb-12 animate-fade-in">
          <h2 id="insights-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Get Exclusive Trading Insights
          </h2>
          <p className="text-xl neural-text mb-8 max-w-4xl mx-auto leading-relaxed">
            Join 100,000+ traders receiving our AI-powered market analysis, exclusive broker comparisons, 
            trading strategies, and early access to new features. Completely free, forever.
          </p>
        </header>
        
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
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
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
      </div>
    </section>
  )
}