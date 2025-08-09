import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Award, Users, Globe, CheckCircle, Star } from 'lucide-react'

interface TrustSignalsSectionProps {
  trustIndicators: {
    totalBrokers: number
    totalReviews: number
    averageRating: number
    regulatedBrokers: number
    yearsOfExperience: number
    countriesServed: number
  }
}

export function TrustSignalsSection({ trustIndicators }: TrustSignalsSectionProps) {
  const trustFeatures = [
    {
      icon: Shield,
      title: "100% Regulated Brokers",
      description: "Every broker is licensed by top-tier financial authorities",
      color: "text-rating-excellent"
    },
    {
      icon: Award,
      title: "Independent Reviews",
      description: "Unbiased analysis with no hidden broker partnerships",
      color: "text-neural-blue"
    },
    {
      icon: CheckCircle,
      title: "Verified User Reviews",
      description: "Real trader experiences with fraud detection measures",
      color: "text-brokeranalysis-accent"
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Brokers from every major financial jurisdiction worldwide",
      color: "text-topforex-teal"
    }
  ]

  return (
    <section className="section-padding bg-deep-charcoal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="bg-rating-excellent/20 text-rating-excellent border-rating-excellent/30 mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Trusted & Verified
          </Badge>
          <h2 className="text-section-title text-gradient mb-6">
            Why 2.5M+ Traders Trust BrokerAnalysis
          </h2>
          <p className="text-xl text-starfield-gray max-w-3xl mx-auto">
            Independent, transparent, and comprehensive broker analysis backed by industry-leading verification standards.
          </p>
        </div>

        {/* Trust Statistics */}
        <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          <Card className="glass-card text-center p-6 hover:bg-glass-overlay/20 transition-all duration-300">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-brokeranalysis-accent mb-2">
                {trustIndicators.totalBrokers}+
              </div>
              <div className="text-sm text-starfield-gray">Regulated Brokers</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center p-6 hover:bg-glass-overlay/20 transition-all duration-300">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-rating-excellent mb-2 flex items-center justify-center">
                <Star className="w-6 h-6 mr-1 fill-current" />
                {trustIndicators.averageRating}
              </div>
              <div className="text-sm text-starfield-gray">Average Rating</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center p-6 hover:bg-glass-overlay/20 transition-all duration-300">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-neural-blue mb-2">
                {(trustIndicators.totalReviews / 1000000).toFixed(1)}M+
              </div>
              <div className="text-sm text-starfield-gray">User Reviews</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center p-6 hover:bg-glass-overlay/20 transition-all duration-300">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-topforex-teal mb-2">
                96%
              </div>
              <div className="text-sm text-starfield-gray">Accuracy Rate</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center p-6 hover:bg-glass-overlay/20 transition-all duration-300">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-topforex-purple mb-2">
                {trustIndicators.yearsOfExperience}+
              </div>
              <div className="text-sm text-starfield-gray">Years Experience</div>
            </CardContent>
          </Card>

          <Card className="glass-card text-center p-6 hover:bg-glass-overlay/20 transition-all duration-300">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-rating-excellent mb-2 flex items-center justify-center">
                <Globe className="w-6 h-6 mr-1" />
                {trustIndicators.countriesServed}+
              </div>
              <div className="text-sm text-starfield-gray">Countries</div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFeatures.map((feature, index) => (
            <Card key={index} className="topforex-card group hover:bg-glass-overlay/10 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 mx-auto mb-6 bg-glass-overlay/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-luminescent-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-starfield-gray leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Regulatory Badges */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-luminescent-white mb-8">
            Regulated by Leading Financial Authorities
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <Badge variant="outline" className="border-glass-overlay/30 text-starfield-gray px-4 py-2">
              FCA (UK)
            </Badge>
            <Badge variant="outline" className="border-glass-overlay/30 text-starfield-gray px-4 py-2">
              CySEC (Cyprus)
            </Badge>
            <Badge variant="outline" className="border-glass-overlay/30 text-starfield-gray px-4 py-2">
              ASIC (Australia)
            </Badge>
            <Badge variant="outline" className="border-glass-overlay/30 text-starfield-gray px-4 py-2">
              SEC (USA)
            </Badge>
            <Badge variant="outline" className="border-glass-overlay/30 text-starfield-gray px-4 py-2">
              ESMA (Europe)
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}