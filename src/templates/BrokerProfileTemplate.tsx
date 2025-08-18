import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, ExternalLink, Plus, ThumbsUp, Globe, Star, Shield, Phone, Mail, MapPin } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { SeoHead } from '@/components/common'
import { useBroker } from '@/hooks/useBrokers'
import { useSafeBrokerProperty } from '@/hooks/useSafeBrokerData'
import { generateBrokerSEO } from '@/utils/seo/brokerSeoGenerator'
import { BrokerStructuredData } from '@/components/seo/BrokerStructuredData'
import { GenerativeSEO } from '@/components/seo/GenerativeSEO'
import { BrokerFAQSection } from '@/components/broker/BrokerFAQSection'
import { BrokerProsConsSection } from '@/components/broker/BrokerProsConsSection'
import { BrokerComparisonSnippet } from '@/components/broker/BrokerComparisonSnippet'
import { BrokerKeyTakeaways } from '@/components/broker/BrokerKeyTakeaways'
import { BrokerCallToAction } from '@/components/broker/BrokerCallToAction'
import { BrokerInternalLinks } from '@/components/broker/BrokerInternalLinks'
import type { Broker } from '@/types/brokerTypes'

interface BrokerProfileTemplateProps {
  brokerId?: string
  customBrokerData?: Broker
  templateVariant?: 'standard' | 'detailed' | 'comparison'
}

export function BrokerProfileTemplate({ 
  brokerId, 
  customBrokerData, 
  templateVariant = 'standard' 
}: BrokerProfileTemplateProps) {
  const { id } = useParams()
  const finalBrokerId = brokerId || id
  const [activeTab, setActiveTab] = useState('overview')
  
  // Fetch broker data
  const { data: broker, isLoading, error } = useBroker(finalBrokerId || '')
  const finalBroker = customBrokerData || broker
  
  // Safe property access
  const brokerName = useSafeBrokerProperty(finalBroker, 'name', 'Unknown Broker')
  const brokerLogo = useSafeBrokerProperty(finalBroker, 'logo', '/assets/icons/broker-placeholder.svg')
  const overallRating = useSafeBrokerProperty(finalBroker, 'rating', 0)
  const reviewCount = useSafeBrokerProperty(finalBroker, 'reviewCount', 0)
  const trustScore = useSafeBrokerProperty(finalBroker, 'trustScore', 0)
  const website = useSafeBrokerProperty(finalBroker, 'website', null)
  const description = useSafeBrokerProperty(finalBroker, 'description', null)
  const minDeposit = useSafeBrokerProperty(finalBroker, 'minDeposit', 0)
  const spreadsFrom = useSafeBrokerProperty(finalBroker, 'spreadsFrom', null)
  const maxLeverage = useSafeBrokerProperty(finalBroker, 'maxLeverage', null)
  const yearEstablished = useSafeBrokerProperty(finalBroker, 'yearEstablished', null)
  const headquarters = useSafeBrokerProperty(finalBroker, 'headquarters', null)
  const regulation = useSafeBrokerProperty(finalBroker, 'regulation', [])
  const assetClasses = useSafeBrokerProperty(finalBroker, 'assetClasses', [])
  const platforms = useSafeBrokerProperty(finalBroker, 'platforms', [])
  const keyFeatures = useSafeBrokerProperty(finalBroker, 'keyFeatures', [])
  
  // Generate dynamic SEO data
  const seoData = generateBrokerSEO(finalBroker, templateVariant)
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
            <p className="text-light-grey">Loading broker information...</p>
          </div>
        </div>
      </Layout>
    )
  }
  
  if (error || !finalBroker) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-pure-white mb-2">Broker Not Found</h1>
            <p className="text-light-grey mb-4">The broker you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </Layout>
    )
  }
  
  return (
    <Layout>
      {/* SEO Head with dynamic data */}
      <SeoHead
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        canonical={seoData.canonical}
        ogImage={seoData.ogImage}
        ogType="article"
      />
      
      {/* Structured Data */}
      <BrokerStructuredData broker={finalBroker} />
      
      {/* Generative SEO */}
      <GenerativeSEO broker={finalBroker} variant={templateVariant} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Broker Header */}
        <div className="professional-card p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-start gap-6">
              <img 
                src={brokerLogo} 
                alt={`${brokerName} logo`}
                className="w-16 h-16 rounded-lg object-contain bg-white p-2"
                onError={(e) => {
                  e.currentTarget.src = '/assets/icons/broker-placeholder.svg'
                }}
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-pure-white mb-2">{brokerName} Review</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${
                            i < Math.floor(overallRating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-medium-grey'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-pure-white font-semibold">{overallRating.toFixed(1)}</span>
                    <span className="text-light-grey ml-2">({reviewCount} reviews)</span>
                  </div>
                  {trustScore > 0 && (
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 font-medium">Trust Score: {trustScore}%</span>
                    </div>
                  )}
                </div>
                
                {/* Contact Information */}
                <div className="flex flex-wrap gap-4 text-sm text-light-grey">
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
        
        {/* Key Takeaways Section */}
        <BrokerKeyTakeaways broker={finalBroker} />
        
        {/* Key Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="professional-card p-4 text-center">
            <div className="text-2xl font-bold text-pure-white mb-1">
              ${minDeposit.toLocaleString()}
            </div>
            <div className="text-light-grey text-sm">Min Deposit</div>
          </div>
          <div className="professional-card p-4 text-center">
            <div className="text-2xl font-bold text-pure-white mb-1">
              {spreadsFrom !== null ? `${spreadsFrom} pips` : 'Variable'}
            </div>
            <div className="text-light-grey text-sm">Spreads From</div>
          </div>
          <div className="professional-card p-4 text-center">
            <div className="text-2xl font-bold text-pure-white mb-1">
              1:{maxLeverage || 'N/A'}
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
        
        {/* Pros and Cons Section */}
        <BrokerProsConsSection broker={finalBroker} />
        
        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
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
              Reviews
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Key Features */}
              <div className="professional-card p-6">
                <h3 className="text-xl font-semibold text-pure-white mb-4 flex items-center">
                  <ThumbsUp className="w-5 h-5 text-accent-blue mr-2" />
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {keyFeatures.length > 0 ? keyFeatures.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-light-grey">{feature}</span>
                    </li>
                  )) : [
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
              
              {/* Trading Options */}
              <div className="professional-card p-6">
                <h3 className="text-xl font-semibold text-pure-white mb-4 flex items-center">
                  <Globe className="w-5 h-5 text-accent-blue mr-2" />
                  Trading Options
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-pure-white mb-2">Asset Classes:</h4>
                    <div className="flex flex-wrap gap-2">
                      {assetClasses.length > 0 ? assetClasses.map((asset: string) => (
                        <Badge key={asset} variant="outline" className="text-light-grey border-medium-grey">
                          {asset.toUpperCase()}
                        </Badge>
                      )) : (
                        <span className="text-light-grey text-sm">Contact broker for details</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-pure-white mb-2">Trading Platforms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {platforms.length > 0 ? platforms.map((platform: string) => (
                        <Badge key={platform} variant="outline" className="text-light-grey border-medium-grey">
                          {platform.toUpperCase()}
                        </Badge>
                      )) : (
                        <span className="text-light-grey text-sm">Contact broker for details</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Description */}
            <div className="professional-card p-6">
              <h2 className="text-2xl font-semibold text-pure-white mb-4">About {brokerName}</h2>
              <p className="text-light-grey leading-relaxed mb-4">
                {description || 
                 `${brokerName} is a ${regulation.length > 0 ? 'regulated' : ''} broker offering trading services across multiple asset classes. 
                  ${assetClasses.length > 0 ? `They provide access to ${assetClasses.join(', ')} trading.` : ''} 
                  Please visit their website for more detailed information about their services and offerings.`}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="fees">
            <div className="professional-card p-6">
              <h2 className="text-2xl font-semibold text-pure-white mb-4">Fees & Spreads</h2>
              <p className="text-light-grey">Detailed fee information will be displayed here.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="regulation">
            <div className="professional-card p-6">
              <h2 className="text-2xl font-semibold text-pure-white mb-4">Regulation & Safety</h2>
              <div className="space-y-4">
                {regulation.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium text-pure-white mb-2">Regulatory Authorities:</h3>
                    <div className="flex flex-wrap gap-2">
                      {regulation.map((reg: string) => (
                        <Badge key={reg} variant="outline" className="text-green-400 border-green-400">
                          {reg}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-light-grey">Please contact the broker for regulatory information.</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews">
            <div className="professional-card p-6">
              <h2 className="text-2xl font-semibold text-pure-white mb-4">User Reviews</h2>
              <p className="text-light-grey">User reviews will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Comparison Snippet */}
        <BrokerComparisonSnippet broker={finalBroker} />
        
        {/* FAQ Section */}
        <BrokerFAQSection broker={finalBroker} />
        
        {/* Call to Action */}
        <BrokerCallToAction broker={finalBroker} />
        
        {/* Internal Links */}
        <BrokerInternalLinks broker={finalBroker} />
      </div>
    </Layout>
  )
}

export default BrokerProfileTemplate