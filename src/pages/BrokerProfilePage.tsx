import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ExternalLink, Plus, Shield, Star, ThumbsDown, ThumbsUp, AlertCircle, RefreshCw } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { SeoHead } from '@/components/common'
import { useSafeBrokerData, useSafeBrokerProperty } from '@/hooks/useSafeBrokerData'
import { BrokerPageErrorBoundary } from '@/components/common/BrokerPageErrorBoundary'
import { mockQuery } from '@/additionalPagesMockData'

export function BrokerProfilePage() {
  const { brokerId } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  
  // Use safe broker data loading with error handling and fallbacks
  const { broker, isLoading, error, retry } = useSafeBrokerData(brokerId)
  
  // Safe property access with fallbacks
  const brokerName = useSafeBrokerProperty(broker, 'name', 'Unknown Broker')
  const brokerLogo = useSafeBrokerProperty(broker, 'logo', '/assets/icons/broker-placeholder.svg')
  const brokerRating = useSafeBrokerProperty(broker, 'rating', 0)
  const brokerReviewCount = useSafeBrokerProperty(broker, 'reviewCount', 0)
  
  const reviews = mockQuery.userReviews.filter(review => review.brokerId === brokerId)

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-professional-black">
          <div className="professional-container py-8">
            <div className="professional-card p-8 mb-8">
              <div className="animate-pulse">
                <div className="flex items-center mb-6">
                  <div className="w-20 h-20 bg-medium-grey rounded-xl mr-6"></div>
                  <div className="space-y-2">
                    <div className="h-8 bg-medium-grey rounded w-64"></div>
                    <div className="h-4 bg-medium-grey rounded w-32"></div>
                    <div className="h-4 bg-medium-grey rounded w-48"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="professional-card p-4">
                  <div className="animate-pulse">
                    <div className="h-6 bg-medium-grey rounded mb-2"></div>
                    <div className="h-4 bg-medium-grey rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Error state with retry option
  if (error && !broker) {
    return (
      <Layout>
        <div className="min-h-screen bg-professional-black">
          <div className="professional-container py-8">
            <div className="professional-card p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-pure-white mb-2">
                Unable to Load Broker Information
              </h1>
              <p className="text-light-grey mb-6">
                {error}
              </p>
              <Button onClick={retry} className="btn-professional-primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  // Ensure broker exists (should always be true due to fallback, but extra safety)
  if (!broker) {
    return (
      <Layout>
        <div className="min-h-screen bg-professional-black">
          <div className="professional-container py-8">
            <div className="professional-card p-8 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-pure-white mb-2">
                Broker Not Found
              </h1>
              <p className="text-light-grey mb-6">
                The requested broker could not be found. Please check the URL or browse our broker directory.
              </p>
              <Button asChild className="btn-professional-primary">
                <Link to="/brokers">
                  Browse Brokers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <BrokerPageErrorBoundary brokerId={brokerId || 'unknown'} brokerName={brokerName}>
      <Layout>
        <div className="min-h-screen bg-professional-black">
          <SeoHead 
            title={`${brokerName} Review | BrokerAnalysis`}
            description={`Detailed review of ${brokerName}. Read expert analysis, user reviews, fees, and regulation information.`}
          />

        <div className="professional-container py-8">
          {/* Broker Header */}
          <div className="professional-card p-8 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div className="flex items-center mb-6 lg:mb-0">
                <img 
                  src={brokerLogo} 
                  alt={`${brokerName} logo`}
                  className="w-20 h-20 rounded-xl object-cover mr-6"
                  onError={(e) => {
                    e.currentTarget.src = '/assets/icons/broker-placeholder.svg'
                  }}
                />
                <div>
                  <h1 className="text-3xl font-bold text-pure-white mb-2">
                    {brokerName}
                  </h1>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-4">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-pure-white font-semibold text-lg">
                        {brokerRating}
                      </span>
                    </div>
                    <span className="text-light-grey">
                      Based on {brokerReviewCount.toLocaleString()} reviews
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {useSafeBrokerProperty(broker, 'regulation', []).map((reg: any) => (
                      <Badge 
                        key={reg.authority} 
                        className="bg-green-500/20 text-green-400 border-green-500/30"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {reg.authority}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="btn-professional-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Compare
                </Button>
                <Button className="btn-professional-primary">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Website
                </Button>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="professional-card p-4 text-center">
              <div className="text-2xl font-bold text-pure-white mb-1">
                {formatCurrency(useSafeBrokerProperty(broker, 'minDeposit', 0))}
              </div>
              <div className="text-light-grey text-sm">Min Deposit</div>
            </div>
            <div className="professional-card p-4 text-center">
              <div className="text-2xl font-bold text-pure-white mb-1">
                {useSafeBrokerProperty(broker, 'spreadsFrom', 0)} pips
              </div>
              <div className="text-light-grey text-sm">Avg Spread</div>
            </div>
            <div className="professional-card p-4 text-center">
              <div className="text-2xl font-bold text-pure-white mb-1">
                1:{useSafeBrokerProperty(broker, 'maxLeverage', 1)}
              </div>
              <div className="text-light-grey text-sm">Max Leverage</div>
            </div>
            <div className="professional-card p-4 text-center">
              <div className="text-2xl font-bold text-pure-white mb-1">
                {useSafeBrokerProperty(broker, 'details', {})?.foundedYear || 'N/A'}
              </div>
              <div className="text-light-grey text-sm">Founded</div>
            </div>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-charcoal-grey border-medium-grey mb-8">
              <TabsTrigger value="overview" className="text-light-grey data-[state=active]:text-pure-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="fees" className="text-light-grey data-[state=active]:text-pure-white">
                Fees & Spreads
              </TabsTrigger>
              <TabsTrigger value="regulation" className="text-light-grey data-[state=active]:text-pure-white">
                Regulation
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-light-grey data-[state=active]:text-pure-white">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pros */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-4 flex items-center">
                    <ThumbsUp className="w-5 h-5 text-green-400 mr-2" />
                    Pros
                  </h3>
                  <ul className="space-y-3">
                    {(broker?.pros || [
                      'Regulated by reputable authorities',
                      'Competitive spreads and fees',
                      'Multiple trading platforms available',
                      'Good customer support'
                    ]).map((pro: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-light-grey">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-4 flex items-center">
                    <ThumbsDown className="w-5 h-5 text-red-400 mr-2" />
                    Cons
                  </h3>
                  <ul className="space-y-3">
                    {(broker?.cons || [
                      'Limited educational resources',
                      'Higher minimum deposit requirements',
                      'Some advanced features require premium account'
                    ]).map((con: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-light-grey">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Description */}
              <div className="professional-card p-6">
                <h3 className="text-xl font-semibold text-pure-white mb-4">About {brokerName}</h3>
                <p className="text-light-grey leading-relaxed">
                  {useSafeBrokerProperty(broker, 'details', {})?.description || 
                   `${brokerName} is a regulated broker offering trading services across multiple asset classes. 
                    Please visit their website for more detailed information about their services and offerings.`}
                </p>
              </div>

              {/* Trading Platforms */}
              <div className="professional-card p-6">
                <h3 className="text-xl font-semibold text-pure-white mb-4">Trading Platforms</h3>
                <div className="flex flex-wrap gap-3">
                  {useSafeBrokerProperty(broker, 'platforms', ['MetaTrader 4', 'Web Platform']).map((platform: string) => (
                    <Badge 
                      key={platform} 
                      variant="outline" 
                      className="text-light-grey border-medium-grey"
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Fees Tab */}
            <TabsContent value="fees">
              <div className="professional-card p-6">
                <h3 className="text-xl font-semibold text-pure-white mb-6">Fees & Spreads</h3>
                <Table>
                  <TableHeader>
                    <TableRow className="border-medium-grey">
                      <TableHead className="text-light-grey">Fee Type</TableHead>
                      <TableHead className="text-light-grey">Amount</TableHead>
                      <TableHead className="text-light-grey">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-medium-grey">
                      <TableCell className="text-pure-white">Forex Spread (EUR/USD)</TableCell>
                      <TableCell className="text-pure-white">
                        {useSafeBrokerProperty(broker, 'spreadsFrom', 0)} pips
                      </TableCell>
                      <TableCell className="text-light-grey">Variable spread</TableCell>
                    </TableRow>
                    <TableRow className="border-medium-grey">
                      <TableCell className="text-pure-white">Commission</TableCell>
                      <TableCell className="text-pure-white">
                        {useSafeBrokerProperty(broker, 'costs', {})?.commissions?.forex === 0 ? 'Free' : 'Contact broker'}
                      </TableCell>
                      <TableCell className="text-light-grey">Per trade</TableCell>
                    </TableRow>
                    <TableRow className="border-medium-grey">
                      <TableCell className="text-pure-white">Inactivity Fee</TableCell>
                      <TableCell className="text-pure-white">
                        Contact broker
                      </TableCell>
                      <TableCell className="text-light-grey">After 12 months</TableCell>
                    </TableRow>
                    <TableRow className="border-medium-grey">
                      <TableCell className="text-pure-white">Withdrawal Fee</TableCell>
                      <TableCell className="text-pure-white">
                        Contact broker
                      </TableCell>
                      <TableCell className="text-light-grey">Per withdrawal</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Regulation Tab */}
            <TabsContent value="regulation">
              <div className="professional-card p-6">
                <h3 className="text-xl font-semibold text-pure-white mb-6">Regulatory Information</h3>
                <div className="space-y-6">
                  {useSafeBrokerProperty(broker, 'regulation', []).map((reg: any, index: number) => (
                    <div key={reg.authority || index} className="border border-medium-grey rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Shield className="w-5 h-5 text-green-400 mr-2" />
                        <h4 className="text-lg font-semibold text-pure-white">{reg.authority || 'Regulatory Authority'}</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-light-grey">License Number:</span>
                          <span className="text-pure-white ml-2">{reg.licenseNumber || 'Contact broker'}</span>
                        </div>
                        <div>
                          <span className="text-light-grey">Status:</span>
                          <span className="text-pure-white ml-2">{reg.status || 'Active'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {useSafeBrokerProperty(broker, 'regulation', []).length === 0 && (
                    <div className="border border-medium-grey rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <Shield className="w-5 h-5 text-yellow-400 mr-2" />
                        <h4 className="text-lg font-semibold text-pure-white">Regulation Information</h4>
                      </div>
                      <p className="text-light-grey">
                        Please contact the broker directly for detailed regulatory information.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="professional-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-charcoal-grey rounded-full flex items-center justify-center mr-3">
                          <span className="text-pure-white font-semibold">
                            {review.userName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="text-pure-white font-medium mr-2">{review.userName}</span>
                            {review.verified && (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="text-light-grey text-sm">{review.userLocation}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-medium-grey'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-light-grey text-sm">
                          {formatDate(review.publishDate)}
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-pure-white mb-3">{review.title}</h4>
                    <p className="text-light-grey mb-4">{review.review}</p>
                    
                    {(review.pros.length > 0 || review.cons.length > 0) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {review.pros.length > 0 && (
                          <div>
                            <h5 className="text-green-400 font-medium mb-2">Pros:</h5>
                            <ul className="space-y-1">
                              {review.pros.map((pro, index) => (
                                <li key={index} className="text-light-grey text-sm flex items-start">
                                  <span className="text-green-400 mr-2">+</span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {review.cons.length > 0 && (
                          <div>
                            <h5 className="text-red-400 font-medium mb-2">Cons:</h5>
                            <ul className="space-y-1">
                              {review.cons.map((con, index) => (
                                <li key={index} className="text-light-grey text-sm flex items-start">
                                  <span className="text-red-400 mr-2">-</span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-medium-grey">
                      <div className="flex items-center space-x-4">
                        <button className="flex items-center text-light-grey hover:text-pure-white transition-colors">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                      <Badge variant="outline" className="text-light-grey border-medium-grey text-xs">
                        {review.tradingExperience}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                <div className="text-center">
                  <Button asChild className="btn-professional-primary">
                    <Link to={`/reviews/write?broker=${broker.id}`}>
                      Write a Review
                    </Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
    </BrokerPageErrorBoundary>
  )
}