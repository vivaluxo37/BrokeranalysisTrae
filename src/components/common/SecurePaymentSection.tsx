import { Shield, CreditCard, Wallet, Building2, Bitcoin, Lock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function SecurePaymentSection() {
  const paymentMethods = [
    { name: 'Western Union', icon: Building2 },
    { name: 'Bitcoin', icon: Bitcoin },
    { name: 'Skrill', icon: Wallet },
    { name: 'PayPal', icon: CreditCard },
    { name: 'WebMoney', icon: Wallet },
    { name: 'Neteller', icon: Wallet }
  ]

  return (
    <section className="section-padding cosmic-void" aria-labelledby="payment-heading">
      <div className="container mx-auto container-padding text-center">
        <header className="mb-12 animate-fade-in">
          <h2 id="payment-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Secure Payment Methods
          </h2>
          <p className="text-xl neural-text max-w-3xl mx-auto leading-relaxed">
            Top-rated brokers support multiple secure payment systems for seamless deposits 
            and withdrawals, ensuring your funds are always protected and accessible.
          </p>
        </header>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {paymentMethods.map((payment, idx) => (
            <Card key={idx} className="topforex-card topforex-card-hover floating-node" style={{ animationDelay: `${idx * 0.1}s` }}>
              <CardContent className="p-6 text-center">
                <payment.icon className="w-12 h-12 text-topforex-accent mx-auto mb-3" />
                <span className="cosmic-text font-semibold text-sm">{payment.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Security badges */}
        <div className="flex justify-center items-center gap-8 mt-12 flex-wrap">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className="neural-text text-sm">SSL Secured</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-green-400" />
            <span className="neural-text text-sm">Bank Grade Security</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-400" />
            <span className="neural-text text-sm">PCI Compliant</span>
          </div>
        </div>
      </div>
    </section>
  )
}