import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, ExternalLink, Plus, RefreshCw, Shield, Star, ThumbsDown, ThumbsUp, Phone, Mail, Globe, MapPin, Monitor, Smartphone, Download, AlertTriangle, CheckCircle } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { SeoHead } from '@/components/common'
import { getBrokerById } from '@/data/brokers/brokerData'
import { getBrokerRating } from '@/data/brokers/brokerRatings'
import { BrokerPageErrorBoundary } from '@/components/common/BrokerPageErrorBoundary'
import { mockQuery } from '@/additionalPagesMockData'
import { useSafeBrokerProperty } from '@/hooks/useSafeBrokerData'
import type { Broker, BrokerRating } from '@/types/brokerTypes'

export function BrokerProfilePage() {
  const { brokerId } = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Get real broker data
  const broker: Broker | undefined = brokerId ? getBrokerById(brokerId) : undefined
  const brokerRating: BrokerRating | undefined = brokerId ? getBrokerRating(brokerId) : undefined
  
  // Safe property access with fallbacks
  const brokerName = useSafeBrokerProperty(broker, 'name', 'Unknown Broker')
  const brokerLogo = useSafeBrokerProperty(broker, 'logo', '/assets/icons/broker-placeholder.svg')
  const overallRating = useSafeBrokerProperty(broker, 'rating', 0)
  const reviewCount = useSafeBrokerProperty(broker, 'reviewCount', 0)
  const trustScore = useSafeBrokerProperty(broker, 'trustScore', 0)
  const yearEstablished = useSafeBrokerProperty(broker, 'details', {})?.foundedYear || useSafeBrokerProperty(broker, 'yearEstablished', null)
  const headquarters = useSafeBrokerProperty(broker, 'details', {})?.headquarters || useSafeBrokerProperty(broker, 'headquarters', null)
  const website = useSafeBrokerProperty(broker, 'details', {})?.website || useSafeBrokerProperty(broker, 'website', null)
  const description = useSafeBrokerProperty(broker, 'details', {})?.description || useSafeBrokerProperty(broker, 'description', null)
  
  const reviews = mockQuery.userReviews.filter(review => review.brokerId === brokerId)
  
  const retry = () => {
    setError(null)
    setIsLoading(true)
    // Simulate retry logic
    setTimeout(() => setIsLoading(false), 1000)
  }

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

  const getAuthorityInfo = (authority: string) => {
    const authorityMap: Record<string, any> = {
      'FCA': {
        fullName: 'Financial Conduct Authority',
        jurisdiction: 'United Kingdom',
        tier: 1,
        description: 'Premier financial regulator ensuring market integrity and consumer protection'
      },
      'CySEC': {
        fullName: 'Cyprus Securities and Exchange Commission',
        jurisdiction: 'Cyprus (EU)',
        tier: 1,
        description: 'EU-regulated authority with passporting rights across European markets'
      },
      'ASIC': {
        fullName: 'Australian Securities and Investments Commission',
        jurisdiction: 'Australia',
        tier: 1,
        description: 'Strict regulatory framework with comprehensive investor protection'
      },
      'SEC': {
        fullName: 'Securities and Exchange Commission',
        jurisdiction: 'United States',
        tier: 1,
        description: 'Leading global financial regulator with stringent compliance requirements'
      },
      'CFTC': {
        fullName: 'Commodity Futures Trading Commission',
        jurisdiction: 'United States',
        tier: 1,
        description: 'Regulates derivatives and commodity futures markets'
      },
      'BaFin': {
        fullName: 'Federal Financial Supervisory Authority',
        jurisdiction: 'Germany',
        tier: 1,
        description: 'German federal regulator ensuring financial market stability'
      },
      'FSA': {
        fullName: 'Financial Services Agency',
        jurisdiction: 'Japan',
        tier: 1,
        description: 'Japanese regulator overseeing financial institutions and markets'
      }
    }
    
    return authorityMap[authority] || {
      fullName: authority,
      jurisdiction: 'Not specified',
      tier: 2,
      description: 'Financial regulatory authority'
    }
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
                        {overallRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-light-grey">
                      Based on {reviewCount.toLocaleString()} reviews
                    </span>
                    {trustScore > 0 && (
                      <div className="ml-4 flex items-center">
                        <Shield className="w-4 h-4 text-blue-400 mr-1" />
                        <span className="text-blue-400 font-medium">
                          Trust Score: {trustScore}/100
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {useSafeBrokerProperty(broker, 'regulation', []).map((reg: any, index: number) => (
                      <Badge 
                        key={reg.authority || index} 
                        className="bg-green-500/20 text-green-400 border-green-500/30"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {(reg.authority || 'REGULATED').toUpperCase()}
                      </Badge>
                    ))}
                    {useSafeBrokerProperty(broker, 'regulators', []).map((regulator: string, index: number) => (
                      <Badge 
                        key={regulator || index} 
                        className="bg-green-500/20 text-green-400 border-green-500/30"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {regulator.toUpperCase()}
                      </Badge>
                    ))}
                    {useSafeBrokerProperty(broker, 'category', null) && (
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {useSafeBrokerProperty(broker, 'category', '').toUpperCase()}
                      </Badge>
                    )}
                  </div>
                  {/* Contact Information */}
                  <div className="flex flex-wrap gap-4 text-sm text-light-grey">
                    {useSafeBrokerProperty(broker, 'contact', {})?.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        <a href={`mailto:${useSafeBrokerProperty(broker, 'contact', {})?.email}`} className="hover:text-pure-white transition-colors">
                          {useSafeBrokerProperty(broker, 'contact', {})?.email}
                        </a>
                      </div>
                    )}
                    {useSafeBrokerProperty(broker, 'contact', {})?.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        <a href={`tel:${useSafeBrokerProperty(broker, 'contact', {})?.phone}`} className="hover:text-pure-white transition-colors">
                          {useSafeBrokerProperty(broker, 'contact', {})?.phone}
                        </a>
                      </div>
                    )}
                    {headquarters && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{headquarters}</span>
                      </div>
                    )}
                    {website && (
                      <div className="flex items-center">
                        <Globe className="w-4 h-4 mr-1" />
                        <a href={website} target="_blank" rel="noopener noreferrer" className="hover:text-pure-white transition-colors">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="btn-professional-secondary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Compare
                </Button>
                <Button 
                  className="btn-professional-primary"
                  onClick={() => website && window.open(website, '_blank')}
                  disabled={!website}
                >
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
                {useSafeBrokerProperty(broker, 'spreadsFrom', null) !== null ? `${useSafeBrokerProperty(broker, 'spreadsFrom', 0)} pips` : 'Contact broker'}
              </div>
              <div className="text-light-grey text-sm">Spreads From</div>
            </div>
            <div className="professional-card p-4 text-center">
              <div className="text-2xl font-bold text-pure-white mb-1">
                1:{useSafeBrokerProperty(broker, 'maxLeverage', null) || 'N/A'}
              </div>
              <div className="text-light-grey text-sm">Max Leverage</div>
            </div>
            <div className="professional-card p-4 text-center">
              <div className="text-2xl font-bold text-pure-white mb-1">
                {yearEstablished || 'N/A'}
              </div>
              <div className="text-light-grey text-sm">Founded</div>
            </div>
          </div>
          
          {/* Additional Stats Row */}
          {brokerRating && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="professional-card p-4 text-center">
                <div className="text-xl font-bold text-pure-white mb-1">
                  {brokerRating.platform.toFixed(1)}
                </div>
                <div className="text-light-grey text-sm">Platform Rating</div>
              </div>
              <div className="professional-card p-4 text-center">
                <div className="text-xl font-bold text-pure-white mb-1">
                  {brokerRating.customerService.toFixed(1)}
                </div>
                <div className="text-light-grey text-sm">Support Rating</div>
              </div>
              <div className="professional-card p-4 text-center">
                 <div className="text-xl font-bold text-pure-white mb-1">
                   {brokerRating.costs.toFixed(1)}
                 </div>
                 <div className="text-light-grey text-sm">Costs Rating</div>
               </div>
              <div className="professional-card p-4 text-center">
                <div className="text-xl font-bold text-pure-white mb-1">
                  {broker?.assetClasses?.length || 0}
                </div>
                <div className="text-light-grey text-sm">Asset Classes</div>
              </div>
              <div className="professional-card p-4 text-center">
                <div className="text-xl font-bold text-pure-white mb-1">
                  {broker?.platforms?.length || 0}
                </div>
                <div className="text-light-grey text-sm">Platforms</div>
              </div>
            </div>
          )}

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
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Key Features */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-4 flex items-center">
                    <ThumbsUp className="w-5 h-5 text-green-400 mr-2" />
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {broker?.keyFeatures?.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-light-grey">{feature}</span>
                      </li>
                    )) || [
                      'Regulated by reputable authorities',
                      'Competitive spreads and fees',
                      'Multiple trading platforms available',
                      'Professional trading tools'
                    ].map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-light-grey">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Asset Classes & Platforms */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-4 flex items-center">
                    <Globe className="w-5 h-5 text-blue-400 mr-2" />
                    Trading Options
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-pure-white mb-2">Asset Classes:</h4>
                      <div className="flex flex-wrap gap-2">
                        {broker?.assetClasses?.map((asset: string) => (
                          <Badge key={asset} variant="outline" className="text-light-grey border-medium-grey">
                            {asset.toUpperCase()}
                          </Badge>
                        )) || (
                          <span className="text-light-grey text-sm">Contact broker for details</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-pure-white mb-2">Trading Platforms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {broker?.platforms?.map((platform: string) => (
                          <Badge key={platform} variant="outline" className="text-light-grey border-medium-grey">
                            {platform.toUpperCase()}
                          </Badge>
                        )) || (
                          <span className="text-light-grey text-sm">Contact broker for details</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add Advanced Chart widget */}
              <div style={{ height: '500px', width: '100%' }}>
                <AdvancedChart symbol="NASDAQ:AAPL" /> {/* Use a default symbol or dynamically get one from broker data */}
              </div>

              {/* Description */}
              <div className="professional-card p-6">
                <h3 className="text-xl font-semibold text-pure-white mb-4">About {brokerName}</h3>
                <p className="text-light-grey leading-relaxed mb-4">
                  {description || 
                   `${brokerName} is a ${useSafeBrokerProperty(broker, 'isRegulated', false) || 
                     (useSafeBrokerProperty(broker, 'regulation', []).length > 0 || useSafeBrokerProperty(broker, 'regulators', []).length > 0) ? 'regulated' : ''} broker offering trading services across multiple asset classes. 
                    ${useSafeBrokerProperty(broker, 'assetClasses', []).length > 0 ? `They provide access to ${useSafeBrokerProperty(broker, 'assetClasses', []).join(', ')} trading.` : ''} 
                    Please visit their website for more detailed information about their services and offerings.`}
                </p>
                {/* Additional broker highlights */}
                {(useSafeBrokerProperty(broker, 'features', {})?.keyFeatures?.length > 0 || 
                  useSafeBrokerProperty(broker, 'keyFeatures', []).length > 0) && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-pure-white mb-3">Key Highlights</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {(useSafeBrokerProperty(broker, 'features', {})?.keyFeatures || 
                        useSafeBrokerProperty(broker, 'keyFeatures', [])).slice(0, 6).map((feature: string, index: number) => (
                        <div key={index} className="flex items-center text-light-grey">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Details */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-4">Company Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-light-grey">Founded:</span>
                      <span className="text-pure-white">{yearEstablished || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-grey">Headquarters:</span>
                      <span className="text-pure-white">{headquarters || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-grey">Category:</span>
                      <span className="text-pure-white">{useSafeBrokerProperty(broker, 'category', 'N/A')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-light-grey">Trust Score:</span>
                      <span className="text-pure-white">{trustScore > 0 ? `${trustScore}/100` : 'N/A'}</span>
                    </div>
                    {useSafeBrokerProperty(broker, 'details', {})?.clientCount && (
                      <div className="flex justify-between">
                        <span className="text-light-grey">Active Clients:</span>
                        <span className="text-pure-white">{useSafeBrokerProperty(broker, 'details', {})?.clientCount?.toLocaleString()}</span>
                      </div>
                    )}
                    {useSafeBrokerProperty(broker, 'details', {})?.assetsUnderManagement && (
                      <div className="flex justify-between">
                        <span className="text-light-grey">Assets Under Management:</span>
                        <span className="text-pure-white">{formatCurrency(useSafeBrokerProperty(broker, 'details', {})?.assetsUnderManagement || 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-light-grey">Regulated:</span>
                      <span className="text-pure-white">
                        {useSafeBrokerProperty(broker, 'isRegulated', false) ? 'Yes' : 
                         (useSafeBrokerProperty(broker, 'regulation', []).length > 0 || useSafeBrokerProperty(broker, 'regulators', []).length > 0) ? 'Yes' : 'Contact broker'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Trading Platforms */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-6">Trading Platforms</h3>
                  <div className="space-y-4">
                    {broker?.platforms?.map((platform: string, index: number) => (
                      <div key={index} className="bg-dark-grey rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Globe className="h-6 w-6 text-blue-400" />
                            <h4 className="text-lg font-semibold text-pure-white">{platform}</h4>
                          </div>
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            Available
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-light-grey" />
                            <span className="text-light-grey">Mobile App</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-light-grey" />
                            <span className="text-light-grey">Web Platform</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <ExternalLink className="h-4 w-4 text-light-grey" />
                            <span className="text-light-grey">Desktop</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-light-grey" />
                            <span className="text-light-grey">Advanced Charts</span>
                          </div>
                        </div>
                        {platform.toLowerCase().includes('metatrader') && (
                          <div className="mt-3 p-3 bg-medium-grey/30 rounded border-l-4 border-blue-400">
                            <p className="text-sm text-light-grey">
                              Industry-standard platform with advanced charting, automated trading, and extensive indicator library.
                            </p>
                          </div>
                        )}
                        {platform.toLowerCase().includes('proprietary') && (
                          <div className="mt-3 p-3 bg-medium-grey/30 rounded border-l-4 border-green-500">
                            <p className="text-sm text-light-grey">
                              Custom-built platform designed specifically for this broker's trading environment.
                            </p>
                          </div>
                        )}
                      </div>
                    )) || (
                      <p className="text-light-grey">Contact broker for platform details</p>
                    )}
                    
                    {/* Platform Features */}
                    <div className="mt-6 p-4 bg-medium-grey/20 rounded-lg">
                      <h4 className="text-lg font-semibold text-pure-white mb-3">Platform Features</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {useSafeBrokerProperty(broker, 'features', {})?.advancedCharting && (
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-light-grey">Advanced Charting</span>
                          </div>
                        )}
                        {useSafeBrokerProperty(broker, 'features', {})?.algorithmicTrading && (
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-light-grey">Algorithmic Trading</span>
                          </div>
                        )}
                        {useSafeBrokerProperty(broker, 'features', {})?.socialTrading && (
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-light-grey">Social Trading</span>
                          </div>
                        )}
                        {useSafeBrokerProperty(broker, 'features', {})?.copyTrading && (
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-light-grey">Copy Trading</span>
                          </div>
                        )}
                        {useSafeBrokerProperty(broker, 'features', {})?.mobileTrading && (
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-light-grey">Mobile Trading</span>
                          </div>
                        )}
                        {useSafeBrokerProperty(broker, 'features', {})?.apiTrading && (
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-light-grey">API Trading</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Fees Tab */}
            <TabsContent value="fees">
              <div className="space-y-6">
                {/* Spreads & Commissions */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-6">Trading Costs</h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-medium-grey">
                        <TableHead className="text-light-grey">Asset Class</TableHead>
                        <TableHead className="text-light-grey">Spread/Commission</TableHead>
                        <TableHead className="text-light-grey">Type</TableHead>
                        <TableHead className="text-light-grey">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-medium-grey">
                        <TableCell className="text-pure-white">Forex (EUR/USD)</TableCell>
                        <TableCell className="text-pure-white">
                          {useSafeBrokerProperty(broker, 'spreadsFrom', null) !== null ? 
                            `${useSafeBrokerProperty(broker, 'spreadsFrom', 0)} pips` : 'Contact broker'}
                        </TableCell>
                        <TableCell className="text-light-grey">
                          {useSafeBrokerProperty(broker, 'costs', {})?.spreads?.variable ? 'Variable' : 'Fixed'}
                        </TableCell>
                        <TableCell className="text-light-grey">Typical spread</TableCell>
                      </TableRow>
                      {useSafeBrokerProperty(broker, 'costs', {})?.commissions?.forex !== undefined && (
                        <TableRow className="border-medium-grey">
                          <TableCell className="text-pure-white">Forex Commission</TableCell>
                          <TableCell className="text-pure-white">
                            {useSafeBrokerProperty(broker, 'costs', {})?.commissions?.forex === 0 ? 
                              'Free' : `$${useSafeBrokerProperty(broker, 'costs', {})?.commissions?.forex}`}
                          </TableCell>
                          <TableCell className="text-light-grey">Per lot</TableCell>
                          <TableCell className="text-light-grey">Round turn</TableCell>
                        </TableRow>
                      )}
                      {useSafeBrokerProperty(broker, 'costs', {})?.commissions?.stocks !== undefined && (
                        <TableRow className="border-medium-grey">
                          <TableCell className="text-pure-white">Stock Commission</TableCell>
                          <TableCell className="text-pure-white">
                            {useSafeBrokerProperty(broker, 'costs', {})?.commissions?.stocks === 0 ? 
                              'Free' : `$${useSafeBrokerProperty(broker, 'costs', {})?.commissions?.stocks}`}
                          </TableCell>
                          <TableCell className="text-light-grey">Per trade</TableCell>
                          <TableCell className="text-light-grey">US stocks</TableCell>
                        </TableRow>
                      )}
                      {useSafeBrokerProperty(broker, 'costs', {})?.commissions?.crypto !== undefined && (
                        <TableRow className="border-medium-grey">
                          <TableCell className="text-pure-white">Crypto Commission</TableCell>
                          <TableCell className="text-pure-white">
                            {useSafeBrokerProperty(broker, 'costs', {})?.commissions?.crypto === 0 ? 
                              'Free' : `${useSafeBrokerProperty(broker, 'costs', {})?.commissions?.crypto}%`}
                          </TableCell>
                          <TableCell className="text-light-grey">Percentage</TableCell>
                          <TableCell className="text-light-grey">Per trade</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Account Fees */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-6">Account Fees</h3>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-medium-grey">
                        <TableHead className="text-light-grey">Fee Type</TableHead>
                        <TableHead className="text-light-grey">Amount</TableHead>
                        <TableHead className="text-light-grey">Frequency</TableHead>
                        <TableHead className="text-light-grey">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="border-medium-grey">
                        <TableCell className="text-pure-white">Deposit Fee</TableCell>
                        <TableCell className="text-pure-white">
                          {useSafeBrokerProperty(broker, 'costs', {})?.fees?.deposit === 0 ? 
                            'Free' : useSafeBrokerProperty(broker, 'costs', {})?.fees?.deposit ? 
                            `$${useSafeBrokerProperty(broker, 'costs', {})?.fees?.deposit}` : 'Contact broker'}
                        </TableCell>
                        <TableCell className="text-light-grey">Per deposit</TableCell>
                        <TableCell className="text-light-grey">Varies by method</TableCell>
                      </TableRow>
                      <TableRow className="border-medium-grey">
                        <TableCell className="text-pure-white">Withdrawal Fee</TableCell>
                        <TableCell className="text-pure-white">
                          {useSafeBrokerProperty(broker, 'costs', {})?.fees?.withdrawal === 0 ? 
                            'Free' : useSafeBrokerProperty(broker, 'costs', {})?.fees?.withdrawal ? 
                            `$${useSafeBrokerProperty(broker, 'costs', {})?.fees?.withdrawal}` : 'Contact broker'}
                        </TableCell>
                        <TableCell className="text-light-grey">Per withdrawal</TableCell>
                        <TableCell className="text-light-grey">Varies by method</TableCell>
                      </TableRow>
                      <TableRow className="border-medium-grey">
                        <TableCell className="text-pure-white">Inactivity Fee</TableCell>
                        <TableCell className="text-pure-white">
                          {useSafeBrokerProperty(broker, 'costs', {})?.fees?.inactivity === 0 ? 
                            'None' : useSafeBrokerProperty(broker, 'costs', {})?.fees?.inactivity ? 
                            `$${useSafeBrokerProperty(broker, 'costs', {})?.fees?.inactivity}` : 'Contact broker'}
                        </TableCell>
                        <TableCell className="text-light-grey">Monthly</TableCell>
                        <TableCell className="text-light-grey">After 12 months inactive</TableCell>
                      </TableRow>
                      <TableRow className="border-medium-grey">
                        <TableCell className="text-pure-white">Currency Conversion</TableCell>
                        <TableCell className="text-pure-white">
                          {useSafeBrokerProperty(broker, 'costs', {})?.fees?.currency ? 
                            `${useSafeBrokerProperty(broker, 'costs', {})?.fees?.currency}%` : 'Contact broker'}
                        </TableCell>
                        <TableCell className="text-light-grey">Per conversion</TableCell>
                        <TableCell className="text-light-grey">Non-base currency</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            {/* Regulation Tab */}
            <TabsContent value="regulation">
              <div className="space-y-6">
                {/* Regulation Status Overview */}
                <div className="professional-card p-6">
                  <h3 className="text-xl font-semibold text-pure-white mb-6">Regulatory Status</h3>
                  
                  {useSafeBrokerProperty(broker, 'isRegulated', false) ? (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <Shield className="h-8 w-8 text-green-400" />
                        <div>
                          <h4 className="text-xl font-semibold text-green-400">Regulated Broker</h4>
                          <p className="text-light-grey">This broker is regulated by recognized financial authorities</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400 mb-1">
                            {useSafeBrokerProperty(broker, 'regulation', []).length || 1}
                          </div>
                          <p className="text-sm text-light-grey">Regulatory Bodies</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400 mb-1">
                            {useSafeBrokerProperty(broker, 'regulation', []).length || 1}
                          </div>
                          <p className="text-sm text-light-grey">Active Licenses</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400 mb-1">
                            {useSafeBrokerProperty(broker, 'yearEstablished', new Date().getFullYear() - 10)}
                          </div>
                          <p className="text-sm text-light-grey">Established</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <AlertTriangle className="h-8 w-8 text-yellow-400" />
                        <div>
                          <h4 className="text-xl font-semibold text-yellow-400">Regulation Status Unknown</h4>
                          <p className="text-light-grey">Please verify the regulatory status before trading</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Regulatory Authorities */}
                {useSafeBrokerProperty(broker, 'regulation', []).length > 0 && (
                  <div className="professional-card p-6">
                    <h4 className="text-lg font-semibold text-pure-white mb-6">Regulatory Authorities</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {useSafeBrokerProperty(broker, 'regulation', []).map((reg: any, index: number) => {
                        const authorityInfo = getAuthorityInfo(reg.authority || 'Unknown');
                        return (
                          <div key={index} className="border border-medium-grey rounded-lg p-4 hover:border-accent-blue/50 transition-colors">
                            <div className="flex items-start space-x-3">
                              <div className="w-12 h-12 bg-accent-blue/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Shield className="h-6 w-6 text-accent-blue" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-pure-white mb-1">{reg.authority || 'Regulatory Authority'}</h5>
                                <p className="text-sm text-light-grey mb-2">{authorityInfo.fullName}</p>
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                                    {authorityInfo.jurisdiction}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs border-accent-blue/30 text-accent-blue">
                                    Tier {authorityInfo.tier}
                                  </Badge>
                                </div>
                                <p className="text-xs text-light-grey">{authorityInfo.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {/* License Details */}
                {useSafeBrokerProperty(broker, 'regulation', []).length > 0 && (
                  <div className="professional-card p-6">
                    <h4 className="text-lg font-semibold text-pure-white mb-6">License Information</h4>
                    <div className="space-y-4">
                      {useSafeBrokerProperty(broker, 'regulation', []).map((reg: any, index: number) => (
                        <div key={index} className="border border-medium-grey rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              </div>
                              <div>
                                <h5 className="font-semibold text-pure-white">{reg.authority || 'Regulatory Authority'}</h5>
                                <p className="text-sm text-light-grey">License #{reg.licenseNumber || 'Contact broker'}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                              {reg.status || 'Active'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-light-grey mb-1">License Type</p>
                              <p className="text-pure-white font-medium">{reg.type || 'Investment Services'}</p>
                            </div>
                            <div>
                              <p className="text-light-grey mb-1">Issue Date</p>
                              <p className="text-pure-white font-medium">{reg.issueDate || 'Not specified'}</p>
                            </div>
                            <div>
                              <p className="text-light-grey mb-1">Status</p>
                              <p className="text-green-400 font-medium">Valid</p>
                            </div>
                            <div>
                              <p className="text-light-grey mb-1">Jurisdiction</p>
                              <p className="text-pure-white font-medium">{reg.jurisdiction || getAuthorityInfo(reg.authority || '').jurisdiction}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Client Protection */}
                <div className="professional-card p-6">
                  <h4 className="text-lg font-semibold text-pure-white mb-6">Client Protection</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold text-pure-white mb-4">Investor Compensation</h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-pure-white font-medium">FSCS Protection</p>
                            <p className="text-sm text-light-grey">Up to £85,000 per client</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-pure-white font-medium">Segregated Accounts</p>
                            <p className="text-sm text-light-grey">Client funds held separately</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-pure-white mb-4">Compliance & Reporting</h5>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-pure-white font-medium">Regular Audits</p>
                            <p className="text-sm text-light-grey">Independent financial audits</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div>
                            <p className="text-pure-white font-medium">Regulatory Reporting</p>
                            <p className="text-sm text-light-grey">Transparent financial reporting</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Regulatory Warnings */}
                {!useSafeBrokerProperty(broker, 'isRegulated', false) && (
                  <div className="professional-card p-6">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold text-red-400 mb-2">Important Warning</h4>
                          <p className="text-light-grey mb-4">
                            This broker's regulatory status could not be verified. Trading with unregulated brokers 
                            carries significant risks including potential loss of funds with limited recourse.
                          </p>
                          <div className="space-y-2">
                            <p className="text-sm text-light-grey">• No investor compensation scheme protection</p>
                            <p className="text-sm text-light-grey">• Limited regulatory oversight</p>
                            <p className="text-sm text-light-grey">• Potential difficulty withdrawing funds</p>
                            <p className="text-sm text-light-grey">• No regulatory dispute resolution</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="professional-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-pure-white">User Reviews</h3>
                    <Button asChild className="btn-professional-primary">
                      <Link to={`/reviews/write?broker=${broker.id}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Write Review
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-pure-white mb-2">
                        {overallRating.toFixed(1)}
                      </div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-6 w-6 ${
                              i < Math.floor(overallRating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-medium-grey'
                            }`} 
                          />
                        ))}
                      </div>
                      <p className="text-light-grey">
                        Based on {reviewCount.toLocaleString()} reviews
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-pure-white mb-4">Rating Breakdown</h4>
                      {[5, 4, 3, 2, 1].map((rating) => {
                        const percentage = Math.max(10, Math.random() * 80);
                        const count = Math.floor(percentage / 2);
                        return (
                          <div key={rating} className="flex items-center mb-3">
                            <span className="text-sm text-light-grey w-8">{rating}★</span>
                            <div className="flex-1 bg-medium-grey rounded-full h-2 mx-3">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-light-grey w-8">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-pure-white mb-4">Review Highlights</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-light-grey">Platform Quality</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-medium-grey rounded-full h-2">
                              <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            <span className="text-xs text-green-400">4.2</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-light-grey">Customer Support</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-medium-grey rounded-full h-2">
                              <div className="bg-blue-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <span className="text-xs text-blue-400">3.8</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-light-grey">Execution Speed</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-medium-grey rounded-full h-2">
                              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '90%' }}></div>
                            </div>
                            <span className="text-xs text-yellow-400">4.5</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-light-grey">Fees & Costs</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-medium-grey rounded-full h-2">
                              <div className="bg-orange-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                            </div>
                            <span className="text-xs text-orange-400">3.5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Individual Reviews */}
                <div className="professional-card p-6">
                  <h4 className="text-lg font-semibold text-pure-white mb-6">Recent Reviews</h4>
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border border-medium-grey rounded-lg p-6 hover:border-accent-blue/50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-accent-blue to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-pure-white font-bold text-lg">
                                {review.userName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-semibold text-pure-white">{review.userName}</h5>
                              <div className="flex items-center space-x-3 mt-1">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${
                                        i < review.rating 
                                          ? 'text-yellow-400 fill-current' 
                                          : 'text-medium-grey'
                                      }`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-light-grey">
                                  {formatDate(review.publishDate)}
                                </span>
                                {review.verified && (
                                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-light-grey mt-1">{review.userLocation}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs border-accent-blue/30 text-accent-blue">
                            {review.tradingExperience}
                          </Badge>
                        </div>
                        
                        <h6 className="font-semibold text-pure-white mb-3 text-lg">{review.title}</h6>
                        <p className="text-light-grey mb-4 leading-relaxed">{review.review}</p>
                        
                        {(review.pros.length > 0 || review.cons.length > 0) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                            {review.pros.length > 0 && (
                              <div className="bg-green-500/10 rounded-lg p-4">
                                <h6 className="font-semibold text-green-400 mb-3 flex items-center">
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Pros
                                </h6>
                                <ul className="text-sm text-light-grey space-y-2">
                                  {review.pros.map((pro, index) => (
                                    <li key={index} className="flex items-start">
                                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      {pro}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {review.cons.length > 0 && (
                              <div className="bg-red-500/10 rounded-lg p-4">
                                <h6 className="font-semibold text-red-400 mb-3 flex items-center">
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Cons
                                </h6>
                                <ul className="text-sm text-light-grey space-y-2">
                                  {review.cons.map((con, index) => (
                                    <li key={index} className="flex items-start">
                                      <div className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                      {con}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-4 border-t border-medium-grey">
                          <div className="flex items-center space-x-6">
                            <button className="flex items-center space-x-2 text-light-grey hover:text-green-400 transition-colors group">
                              <ThumbsUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              <span className="text-sm">Helpful ({review.helpful})</span>
                            </button>
                            <button className="flex items-center space-x-2 text-light-grey hover:text-red-400 transition-colors group">
                              <ThumbsDown className="h-4 w-4 group-hover:scale-110 transition-transform" />
                              <span className="text-sm">Not Helpful</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {reviews.length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-medium-grey/30 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Star className="h-8 w-8 text-medium-grey" />
                        </div>
                        <h5 className="text-lg font-semibold text-pure-white mb-2">No reviews yet</h5>
                        <p className="text-light-grey mb-6">Be the first to share your experience with this broker.</p>
                        <Button asChild className="btn-professional-primary">
                          <Link to={`/reviews/write?broker=${broker.id}`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Write the first review
                          </Link>
                        </Button>
                      </div>
                    )}
                    
                    {reviews.length > 5 && (
                      <div className="text-center pt-6 border-t border-medium-grey">
                        <Button variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-pure-white">
                          Load More Reviews ({reviews.length - 5} remaining)
                        </Button>
                      </div>
                    )}
                  </div>
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
