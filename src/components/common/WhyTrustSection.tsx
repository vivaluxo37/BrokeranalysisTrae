import { BarChart3, Shield, Target, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function WhyTrustSection() {
  const features = [
    {
      icon: Shield,
      title: "Regulatory Compliance Verified Brokers",
      description: "Every broker undergoes rigorous regulatory verification. We only feature brokers licensed by top-tier financial authorities including FCA, CySEC, ASIC, and SEC.",
      color: "text-green-400",
      bulletPoints: [
        "Multi-jurisdiction regulatory checks",
        "Real-time license status monitoring",
        "Compliance history tracking"
      ]
    },
    {
      icon: BarChart3,
      title: "AI-Powered Broker Analysis",
      description: "Our advanced 10-point evaluation system uses machine learning to analyze trading costs, platform quality, execution speed, and customer satisfaction for complete transparency.",
      color: "text-blue-400",
      bulletPoints: [
        "Real-time spread monitoring",
        "Execution quality metrics",
        "Performance benchmarking"
      ]
    },
    {
      icon: Users,
      title: "Community-Driven Reviews",
      description: "Access thousands of verified trader reviews with sentiment analysis. Our community-driven feedback system helps you understand real trading experiences with authenticity verification.",
      color: "text-purple-400",
      bulletPoints: [
        "Verified trader testimonials",
        "Sentiment analysis scoring",
        "Review authenticity checks"
      ]
    },
    {
      icon: Target,
      title: "Personalized Broker Matching",
      description: "Advanced AI algorithm matches you with brokers based on your trading style, experience level, preferred instruments, risk tolerance, and geographic location.",
      color: "text-orange-400",
      bulletPoints: [
        "Trading style assessment",
        "Risk tolerance analysis",
        "Geographic compliance matching"
      ]
    }
  ]

  return (
    <section className="section-padding cosmic-void neural-network" aria-labelledby="trust-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 id="trust-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Why 2.5M+ Traders Trust BrokerAnalysis
          </h2>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="topforex-card topforex-card-hover floating-node" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 glass-card rounded-xl flex items-center justify-center flex-shrink-0 cosmic-glow">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold cosmic-text mb-3">{feature.title}</h3>
                    <p className="neural-text leading-relaxed mb-4">{feature.description}</p>
                    
                    {/* Bullet points for scannability */}
                    <ul className="space-y-2">
                      {feature.bulletPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-center gap-2 neural-text text-sm">
                          <div className="w-1.5 h-1.5 bg-topforex-accent rounded-full"></div>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust metrics */}
        <div className="grid md:grid-cols-4 gap-8 mt-16">
          {[
            { value: '500+', label: 'Regulated Brokers' },
            { value: '2.5M+', label: 'Traders Served' },
            { value: '15+', label: 'Years Experience' },
            { value: '4.9/5', label: 'User Rating' }
          ].map((metric, index) => (
            <div key={index} className="text-center floating-node" style={{ animationDelay: `${index * 0.3}s` }}>
              <div className="text-3xl font-bold cosmic-text mb-2 text-glow">{metric.value}</div>
              <div className="neural-text">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
