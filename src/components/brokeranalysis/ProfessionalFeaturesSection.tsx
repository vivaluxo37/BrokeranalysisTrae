import { Globe, Lock, Shield, Zap } from 'lucide-react'

export function ProfessionalFeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Bank-grade encryption and multi-layer security protocols protect your assets.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Execute trades in milliseconds with our optimized trading infrastructure.'
    },
    {
      icon: Globe,
      title: 'Global Access',
      description: 'Trade assets from markets worldwide with 24/7 accessibility.'
    },
    {
      icon: Lock,
      title: 'Asset Protection',
      description: 'Comprehensive insurance and risk management for your portfolio.'
    }
  ]

  return (
    <section className="professional-section bg-professional-black">
      <div className="content-container">
        <div className="text-center mb-16">
          <h2 className="text-section-title text-pure-white mb-6">
            Professional Trading Platform
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Experience institutional-grade trading with our advanced platform designed for serious traders.
          </p>
        </div>

        <div className="professional-grid professional-grid-4">
          {features.map((feature, index) => (
            <div 
              key={feature.title} 
              className="professional-card p-8 text-center interactive-professional"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-charcoal-grey border border-medium-grey rounded-lg flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-6 h-6 text-pure-white" />
              </div>
              <h3 className="text-xl font-semibold text-pure-white mb-4">
                {feature.title}
              </h3>
              <p className="text-light-grey leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
