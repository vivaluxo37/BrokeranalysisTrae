import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Star, Shield, TrendingUp, ArrowRight, Users } from 'lucide-react'
import { AssetClass, BrokerCategory, RegulatorType, TradingPlatform } from '@/enums'

interface FeaturedBroker {
  id: string
  name: string
  logo: string
  rating: number
  reviewCount: number
  regulators: RegulatorType[]
  minDeposit: number
  maxLeverage: number
  spreadsFrom: number
  assetClasses: AssetClass[]
  platforms: TradingPlatform[]
  category: BrokerCategory
  featured: boolean
}

interface FeaturedBrokersSectionProps {
  featuredBrokers: FeaturedBroker[]
}

const formatMinDeposit = (amount: number): string => {
  return `$${amount.toLocaleString()}`
}

const formatLeverage = (leverage: number): string => {
  return `1:${leverage}`
}

const formatSpread = (spread: number): string => {
  return `${spread} pips`
}

const formatReviewCount = (count: number): string => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K+`
  }
  return count.toString()
}

const getCategoryBadgeColor = (category: BrokerCategory): string => {
  switch (category) {
    case BrokerCategory.TOP_RATED:
      return 'bg-rating-excellent/20 text-rating-excellent border-rating-excellent/30'
    case BrokerCategory.BEGINNER_FRIENDLY:
      return 'bg-neural-blue/20 text-neural-blue border-neural-blue/30'
    case BrokerCategory.CRYPTO_SPECIALIST:
      return 'bg-topforex-purple/20 text-topforex-purple border-topforex-purple/30'
    default:
      return 'bg-brokeranalysis-accent/20 text-brokeranalysis-accent border-brokeranalysis-accent/30'
  }
}

export function FeaturedBrokersSection({ featuredBrokers }: FeaturedBrokersSectionProps) {
  return (
    <section className="section-padding bg-cosmic-void">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="bg-rating-excellent/20 text-rating-excellent border-rating-excellent/30 mb-4">
            Top Rated Brokers
          </Badge>
          <h2 className="text-section-title text-gradient mb-6">
            Most Trusted Trading Partners
          </h2>
          <p className="text-xl text-starfield-gray max-w-3xl mx-auto">
            Hand-picked brokers with the highest ratings, best execution, and strongest regulatory compliance.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {featuredBrokers.map((broker, index) => (
            <Card key={broker.id} className="topforex-card topforex-card-hover group relative overflow-hidden">
              {/* Featured Badge */}
              {index === 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-rating-excellent text-white border-0 shadow-lg">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    #1 Choice
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <img 
                    src={broker.logo} 
                    alt={`${broker.name} - Professional trading platform logo, financial services branding - Simone Hutsch on Unsplash`}
                    className="w-12 h-12 rounded-lg object-cover"
                    style={{ width: '48px', height: '48px' }}
                  />
                  <Badge className={getCategoryBadgeColor(broker.category)}>
                    {broker.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                
                <CardTitle className="text-xl text-luminescent-white mb-2">
                  {broker.name}
                </CardTitle>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(broker.rating) ? 'text-rating-excellent fill-current' : 'text-starfield-gray'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-rating-excellent">
                    {broker.rating}
                  </span>
                  <span className="text-sm text-starfield-gray">
                    ({formatReviewCount(broker.reviewCount)} reviews)
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-4 h-4 text-brokeranalysis-accent" />
                  <span className="text-sm text-starfield-gray">
                    Regulated by {broker.regulators.join(', ').toUpperCase()}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-starfield-gray mb-1">Min Deposit</div>
                    <div className="font-semibold text-luminescent-white">
                      {formatMinDeposit(broker.minDeposit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-starfield-gray mb-1">Max Leverage</div>
                    <div className="font-semibold text-luminescent-white">
                      {formatLeverage(broker.maxLeverage)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-starfield-gray mb-1">Spreads From</div>
                    <div className="font-semibold text-luminescent-white">
                      {formatSpread(broker.spreadsFrom)}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-starfield-gray mb-2">Asset Classes</div>
                  <div className="flex flex-wrap gap-1">
                    {broker.assetClasses.slice(0, 3).map((asset) => (
                      <Badge key={asset} variant="secondary" className="text-xs bg-glass-overlay/20 text-starfield-gray">
                        {asset.toUpperCase()}
                      </Badge>
                    ))}
                    {broker.assetClasses.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-glass-overlay/20 text-starfield-gray">
                        +{broker.assetClasses.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <Button className="w-full bg-brokeranalysis-accent hover:bg-brokeranalysis-accent/90 text-white font-semibold group-hover:shadow-lg transition-all duration-300">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Start Trading
                  </Button>
                  <Button variant="outline" className="w-full border-glass-overlay/30 text-luminescent-white hover:bg-glass-overlay/10">
                    Read Full Review
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>

              {/* Progress indicator for rating */}
              <div className="absolute bottom-0 left-0 right-0">
                <Progress 
                  value={(broker.rating / 5) * 100} 
                  className="h-1 bg-transparent"
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline" 
            className="border-brokeranalysis-accent text-brokeranalysis-accent hover:bg-brokeranalysis-accent hover:text-white px-8 py-4 rounded-xl font-semibold"
          >
            <Users className="w-5 h-5 mr-2" />
            View All {featuredBrokers.length * 10}+ Brokers
          </Button>
        </div>
      </div>
    </section>
  )
}