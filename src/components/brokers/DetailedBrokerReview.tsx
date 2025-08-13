import { Star, Shield, Award, TrendingUp, Users, Globe, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface BrokerReviewProps {
  broker: {
    name: string
    logo: string
    rating: number
    founded: string
    headquarters: string
    regulation: string[]
    minDeposit: string
    spreads: string
    platforms: string[]
    assets: string[]
    pros: string[]
    cons: string[]
    description: string
    trustScore: number
    userReviews: number
    features: {
      name: string
      available: boolean
      description?: string
    }[]
    fees: {
      category: string
      amount: string
      description: string
    }[]
  }
}

export function DetailedBrokerReview({ broker }: BrokerReviewProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : i < rating 
            ? 'text-yellow-400 fill-current opacity-50' 
            : 'text-medium-grey'
        }`}
      />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-accent-blue'
    if (rating >= 4.0) return 'text-yellow-400'
    if (rating >= 3.0) return 'text-orange-400'
    return 'text-red-400'
  }

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'bg-accent-blue'
    if (score >= 80) return 'bg-yellow-500'
    if (score >= 70) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="professional-card p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <img 
              src={broker.logo} 
              alt={`${broker.name} logo - Professional trading platform`}
              className="w-16 h-16 rounded-lg object-contain bg-pure-white p-2"
              style={{ width: '64px', height: '64px' }}
            />
            <div>
              <h1 className="text-3xl font-bold text-pure-white mb-2">{broker.name} Review</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">{renderStars(broker.rating)}</div>
                  <span className={`text-lg font-semibold ${getRatingColor(broker.rating)}`}>
                    {broker.rating.toFixed(1)}
                  </span>
                </div>
                <Badge variant="secondary" className="bg-medium-grey text-pure-white">
                  {broker.userReviews.toLocaleString()} reviews
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex-1 lg:text-right">
            <div className="space-y-2">
              <div className="flex items-center justify-start lg:justify-end gap-2">
                <Shield className="w-5 h-5 text-accent-blue" />
                <span className="text-light-grey">Trust Score:</span>
                <span className="text-pure-white font-semibold">{broker.trustScore}/100</span>
              </div>
              <Progress 
                value={broker.trustScore} 
                className={`h-2 ${getTrustScoreColor(broker.trustScore)}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Facts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="professional-card">
          <CardContent className="p-4 text-center">
            <Globe className="w-8 h-8 text-light-grey mx-auto mb-2" />
            <div className="text-sm text-light-grey">Founded</div>
            <div className="text-lg font-semibold text-pure-white">{broker.founded}</div>
          </CardContent>
        </Card>
        
        <Card className="professional-card">
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-light-grey mx-auto mb-2" />
            <div className="text-sm text-light-grey">Regulation</div>
            <div className="text-lg font-semibold text-pure-white">{broker.regulation[0]}</div>
          </CardContent>
        </Card>
        
        <Card className="professional-card">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-light-grey mx-auto mb-2" />
            <div className="text-sm text-light-grey">Min Deposit</div>
            <div className="text-lg font-semibold text-pure-white">{broker.minDeposit}</div>
          </CardContent>
        </Card>
        
        <Card className="professional-card">
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-light-grey mx-auto mb-2" />
            <div className="text-sm text-light-grey">Spreads From</div>
            <div className="text-lg font-semibold text-pure-white">{broker.spreads}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Review */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="text-pure-white">Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-light-grey leading-relaxed">{broker.description}</p>
            </CardContent>
          </Card>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-accent-blue flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Pros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {broker.pros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2 text-light-grey">
                      <CheckCircle className="w-4 h-4 text-accent-blue mt-0.5 flex-shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Cons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {broker.cons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2 text-light-grey">
                      <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Trading Platforms */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="text-pure-white">Trading Platforms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {broker.platforms.map((platform, index) => (
                  <Badge key={index} variant="secondary" className="bg-medium-grey text-pure-white">
                    {platform}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Assets */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="text-pure-white">Available Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {broker.assets.map((asset, index) => (
                  <Badge key={index} variant="outline" className="border-medium-grey text-light-grey">
                    {asset}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Features & Fees */}
        <div className="space-y-6">
          {/* Key Features */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="text-pure-white">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {broker.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-light-grey text-sm">{feature.name}</span>
                    {feature.available ? (
                      <CheckCircle className="w-4 h-4 text-accent-blue" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fees */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="text-pure-white">Fees & Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {broker.fees.map((fee, index) => (
                  <div key={index} className="border-b border-medium-grey pb-3 last:border-b-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-light-grey text-sm">{fee.category}</span>
                      <span className="text-pure-white font-semibold">{fee.amount}</span>
                    </div>
                    <p className="text-xs text-light-grey">{fee.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card className="professional-card">
            <CardContent className="p-6 text-center">
              <Button className="btn-professional-primary w-full mb-3">
                Visit {broker.name}
              </Button>
              <Button className="btn-professional-secondary w-full">
                Compare with Others
              </Button>
              <p className="text-xs text-light-grey mt-3">
                Risk warning: Trading involves risk of loss
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
