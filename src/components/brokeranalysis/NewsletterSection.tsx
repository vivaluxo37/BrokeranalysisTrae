import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, Mail, Shield } from 'lucide-react'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSubscribed(true)
      setEmail('')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubscribed) {
    return (
      <section className="professional-section bg-charcoal-grey">
        <div className="content-container">
          <div className="professional-card p-12 text-center max-w-2xl mx-auto">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-pure-white mb-4">
              Welcome to the Community!
            </h2>
            <p className="text-light-grey">
              Thank you for subscribing. You'll receive your first market report within 24 hours.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="professional-section bg-charcoal-grey">
      <div className="content-container">
        <div className="professional-card p-12 text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="w-16 h-16 bg-professional-black border border-medium-grey rounded-xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-pure-white" />
          </div>

          {/* Heading */}
          <h2 className="text-section-title text-pure-white mb-4">
            Get Exclusive Broker Insights
          </h2>

          {/* Subtext */}
          <p className="text-light-grey mb-8 leading-relaxed">
            Join <span className="text-pure-white font-semibold">150,000+</span> traders receiving weekly market reports & broker deals.
          </p>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`professional-input ${error ? 'border-red-500' : ''}`}
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-red-400 text-sm mt-2 text-left">
                    {error}
                  </p>
                )}
              </div>
              <Button 
                type="submit"
                className="btn-professional-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>

          {/* Privacy Note */}
          <div className="flex items-center justify-center text-light-grey text-sm">
            <Shield className="w-4 h-4 mr-2" />
            We respect your privacy. Unsubscribe at any time.
          </div>
        </div>
      </div>
    </section>
  )
}
