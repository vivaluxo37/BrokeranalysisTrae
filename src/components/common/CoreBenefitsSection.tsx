import { BarChart3, Shield, Target, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function CoreBenefitsSection() {
  const benefits = [
    {
      icon: Shield,
      title: "Regulatory Compliance Verified Brokers",
      description: "Every broker undergoes rigorous regulatory verification. We only feature brokers licensed by top-tier financial authorities including FCA, CySEC, ASIC, and SEC.",
      stats: "500+ Verified Brokers",
      features: [
        "Multi-jurisdiction regulatory checks",
        "Real-time license status monitoring", 
        "Compliance history tracking"
      ]
    },
    {
      icon: BarChart3,
      title: "AI-Powered Broker Analysis",
      description: "Our advanced 10-point evaluation system uses machine learning to analyze trading costs, platform quality, execution speed, and customer satisfaction for complete transparency.",
      stats: "30-Day Deep Analysis",
      features: [
        "Real-time spread monitoring",
        "Execution quality metrics",
        "Performance benchmarking"
      ]
    },
    {
      icon: Users,
      title: "Community-Driven Reviews",
      description: "Access thousands of verified trader reviews with sentiment analysis. Our community-driven feedback system helps you understand real trading experiences with authenticity verification.",
      stats: "2.5M+ User Reviews",
      features: [
        "Verified trader testimonials",
        "Sentiment analysis scoring",
        "Review authenticity checks"
      ]
    },
    {
      icon: Target,
      title: "Personalized Broker Matching",
      description: "Advanced AI algorithm matches you with brokers based on your trading style, experience level, preferred instruments, risk tolerance, and geographic location.",
      stats: "96% Match Accuracy",
      features: [
        "Trading style assessment",
        "Risk tolerance analysis",
        "Geographic compliance matching"
      ]
    }
  ]

  return (
    <section className="section-padding cosmic-void neural-network" aria-labelledby="benefits-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 id="benefits-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Why 2.5M+ Traders Trust BrokerAnalysis
          </h2>
          <p className="text-xl neural-text max-w-4xl mx-auto leading-relaxed">
            Our comprehensive approach combines cutting-edge AI analysis with expert insights 
            and real user experiences to help you make informed trading decisions with confidence.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="topforex-card topforex-card-hover floating-node" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 glass-card rounded-xl flex items-center justify-center flex-shrink-0 cosmic-glow">
                    <benefit.icon className="w-8 h-8 text-topforex-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-2xl font-bold cosmic-text">{benefit.title}</h3>
                      <Badge className="bg-topforex-accent text-white text-xs rounded-full">
                        {benefit.stats}
                      </Badge>
                    </div>
                    <p className="neural-text leading-relaxed text-lg mb-6">{benefit.description}</p>
                    
                    {/* Feature list */}
                    <ul className="space-y-2">
                      {benefit.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 neural-text">
                          <div className="w-1.5 h-1.5 bg-topforex-accent rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}