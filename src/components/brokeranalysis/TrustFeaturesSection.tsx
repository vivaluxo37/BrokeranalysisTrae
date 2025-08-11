import { Activity, Database, ShieldCheck, TrendingUp } from 'lucide-react'

interface TrustFeature {
  type: string
  title: string
  description: string
  icon: string
}

interface TrustFeaturesSectionProps {
  features: TrustFeature[]
}

export function TrustFeaturesSection({ features }: TrustFeaturesSectionProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'database':
        return Database
      case 'activity':
        return Activity
      case 'shield-check':
        return ShieldCheck
      case 'trending-up':
        return TrendingUp
      default:
        return Database
    }
  }

  return (
    <section className="professional-section bg-professional-black">
      <div className="professional-container">
        <div className="text-center mb-16">
          <h2 className="text-section-title text-pure-white mb-6">
            Why Millions of Traders Rely on BrokerAnalysis
          </h2>
          <p className="text-subtitle max-w-3xl mx-auto">
            Our commitment to transparency, accuracy, and independence has made us the trusted choice for traders worldwide.
          </p>
        </div>

        <div className="professional-grid professional-grid-4">
          {features.map((feature, index) => {
            const IconComponent = getIcon(feature.icon)
            
            return (
              <div 
                key={feature.type}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-charcoal-grey border border-medium-grey rounded-xl flex items-center justify-center mx-auto mb-6 interactive-professional">
                  <IconComponent className="w-8 h-8 text-pure-white" />
                </div>
                <h3 className="text-xl font-semibold text-pure-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-light-grey leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
