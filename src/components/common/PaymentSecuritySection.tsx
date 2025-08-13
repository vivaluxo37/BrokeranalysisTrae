import { Bitcoin, Building2, CreditCard, Lock, Shield, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CollectionManager } from '@/utils/SafeCollection'

export function PaymentSecuritySection() {
  const paymentMethods = [
    { name: 'PayPal', icon: CreditCard, description: 'Secure online payments' },
    { name: 'Stripe', icon: CreditCard, description: 'Credit & debit cards' },
    { name: 'Skrill', icon: Wallet, description: 'Digital wallet' },
    { name: 'Neteller', icon: Wallet, description: 'E-wallet service' },
    { name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfers' },
    { name: 'Bitcoin', icon: Bitcoin, description: 'Cryptocurrency payments' }
  ]

  // Create safe collection wrappers
  const safePaymentMethods = CollectionManager.validateCollection(
    paymentMethods,
    'paymentMethods'
  )

  const securityFeatures = [
    {
      icon: Shield,
      title: 'SSL Encryption',
      description: '256-bit SSL encryption protects all data transmission'
    },
    {
      icon: Lock,
      title: 'Secure Storage',
      description: 'Payment data is never stored on our servers'
    },
    {
      icon: CreditCard,
      title: 'PCI Compliant',
      description: 'Full PCI DSS compliance for payment processing'
    }
  ]

  const safeSecurityFeatures = CollectionManager.validateCollection(
    securityFeatures,
    'securityFeatures'
  )

  return (
    <section className="section-padding cosmic-void" aria-labelledby="payment-security-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 id="payment-security-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Secure Payment Methods
          </h2>
          <p className="text-xl neural-text max-w-3xl mx-auto leading-relaxed">
            Top-rated brokers support multiple secure payment systems for seamless deposits 
            and withdrawals, ensuring your funds are always protected and accessible.
          </p>
        </header>

        {/* Payment methods grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {safePaymentMethods.map((payment, index) => (
            <Card 
              key={payment.name} 
              className="topforex-card topforex-card-hover floating-node" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 glass-card rounded-lg flex items-center justify-center mx-auto mb-3 cosmic-glow">
                  <payment.icon className="w-6 h-6 text-topforex-accent" />
                </div>
                <h3 className="cosmic-text font-semibold mb-1">{payment.name}</h3>
                <p className="neural-text text-xs">{payment.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security features */}
        <div className="grid md:grid-cols-3 gap-8">
          {safeSecurityFeatures.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="topforex-card floating-node" 
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mx-auto mb-4 cosmic-glow">
                  <feature.icon className="w-8 h-8 text-topforex-accent" />
                </div>
                <h3 className="text-xl font-bold cosmic-text mb-3">{feature.title}</h3>
                <p className="neural-text">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust badges */}
        <div className="text-center mt-12">
          <p className="neural-text text-sm mb-6">
            Your security is our priority. All transactions are protected by industry-leading security measures.
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent-blue" />
              <span className="neural-text text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-accent-blue" />
              <span className="neural-text text-sm">PCI Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent-blue" />
              <span className="neural-text text-sm">Bank Grade Security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
