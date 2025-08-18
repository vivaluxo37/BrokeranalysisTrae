import React, { useState } from 'react';
import { BrokerAnalysisHeader } from './layout/BrokerAnalysisHeader';
import { BrokerAnalysisFooter } from './layout/BrokerAnalysisFooter';
import { BrokerHero } from './broker/BrokerHero';
import { BrokerOverview } from './broker/BrokerOverview';
import { ProsCons } from './ui/ProsCons';
import { RatingBreakdown } from './ui/RatingBreakdown';
import { FeeComparisonChart } from './ui/FeeComparisonChart';
import { BrokerReviewSection } from './broker/BrokerReviewSection';
import { ExpertReview } from './broker/ExpertReview';
import { KeyTakeaways } from './broker/KeyTakeaways';
import { DetailedTabs } from './broker/DetailedTabs';
import { BrokerFAQ } from './broker/BrokerFAQ';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOMetaTags } from "./seo/SEOMetaTags";
import type { SEOMetaData } from "./seo/SEOMetaTags";
import { useBroker, useReviews, useFeeComparison, useCreateReview } from '../hooks/useBrokerQuery';
import { useBrokerLocalized, useBrokerReviews } from '../hooks/useSupabase';
import { useI18n } from '../hooks/useI18n';
import { mockRootProps } from './AllyInvestMockData';

interface AllyInvestReviewPageProps {
  brokerId?: string;
  showComparison?: boolean;
  showReviews?: boolean;
  showFAQ?: boolean;
}

export const AllyInvestReviewPage: React.FC<AllyInvestReviewPageProps> = ({
  brokerId = 'ally-invest',
  showComparison = true,
  showReviews = true,
  showFAQ = true
}) => {
  const [selectedComparisonMetric, setSelectedComparisonMetric] = useState('stockTrade');
  
  // Get current language and supported languages from i18n (call all hooks at the top)
  const { currentLanguage, supportedLanguages } = useI18n();
  const currentLang = currentLanguage?.code || 'en';
  
  // Fetch real broker data from Supabase
  const { data: brokerData, isLoading, error } = useBroker(brokerId);
  const { data: localizedData, isLoading: isLoadingLocalized } = useBrokerLocalized(brokerId, currentLang);
  
  const { data: feeComparisonData, isLoading: isLoadingFeeComparison } = useFeeComparison(brokerId);
  const { data: expertReviewsData, isLoading: isLoadingExpertReviews } = useBrokerReviews(brokerId, 'editorial');
  const { data: reviewsData, isLoading: isLoadingReviews } = useReviews(brokerId, currentLang);
  
  // Move useCreateReview hook to top level to maintain hook order
  const createReview = useCreateReview();
  
  // Fallback to mock data if Supabase data is not available
  const {
    broker: mockBroker,
    ratings,
    pros,
    cons,
    keyFeatures,
    comparisonBrokers,
    feeComparison,
    reviews,
    faqs,
    expertReview
  } = mockRootProps;
  
  // Use real data if available, otherwise fallback to mock data
  const broker = brokerData ? {
    id: brokerData.broker.id,
    name: localizedData?.title || brokerData.broker.name,
    logo: brokerData.broker.logo_url || mockBroker.logo,
    slug: brokerData.broker.slug,
    founded_year: brokerData.broker.founded_year,
    headquarters: brokerData.broker.headquarters,
    review_count: reviews.length, // Use mock review count for now
    website: 'https://www.ally.com/invest/', // Corrected website URL
    status: brokerData.broker.status,
    // Add missing properties with safe fallbacks
    regulation: mockBroker.regulation || ['SEC', 'FINRA', 'SIPC'],
    rating: mockBroker.rating || 4.0,
    // Add localized content
    summary: localizedData?.summary || `Comprehensive review of ${brokerData.broker.name}`,
    localizedPros: localizedData?.pros || pros,
    localizedCons: localizedData?.cons || cons,
    localizedFaqs: localizedData?.faqs || faqs,
    key_takeaways: keyFeatures.map(kf => kf.features.map(f => f.name)).flat() || []
  } : mockBroker;
  
  // Show loading state
  if (isLoading || isLoadingLocalized || isLoadingReviews || isLoadingExpertReviews || isLoadingFeeComparison) {
    return (
      <div className="min-h-screen bg-professional-black flex items-center justify-center">
        <div className="text-white text-xl">Loading broker information...</div>
      </div>
    );
  }
  
  // Show error state
  if (error) {
    console.warn('Failed to load broker data from Supabase, using mock data:', error);
  }

  // Generate dynamic hreflang attributes for all supported languages
  const hreflangs = (supportedLanguages || []).map(lang => ({
    hreflang: lang.code,
    href: `https://brokeranalysis.com/${lang.code === 'en' ? '' : lang.code + '/'}brokers/${broker.slug}`
  }));

  // SEO Meta Data Configuration
  const seoMetaData: SEOMetaData = {
    title: `${broker.name} Review 2025 - Comprehensive Analysis & Rating`,
    description: broker.summary || `In-depth ${broker.name} review covering fees, platform features, safety, and user experience. Get expert insights and user ratings for informed trading decisions.`,
    canonical: `https://brokeranalysis.com/brokers/${broker.slug}`,
    keywords: `${broker.name}, broker review, trading platform, investment, fees, safety, user experience`,
    ogImage: `https://brokeranalysis.com/api/og/broker?name=${encodeURIComponent(broker.name)}&rating=${ratings.overall}&logo=${encodeURIComponent(broker.logo)}`,
    ogType: 'article',
    twitterCard: 'summary_large_image',
    author: 'BrokerAnalysis Editorial Team',
    publishedTime: '2024-01-15T10:00:00Z',
    modifiedTime: new Date().toISOString(),
    locale: 'en_US',
    alternateLanguages: hreflangs
  };

  const comparisonMetrics = [
    { value: 'stockTrade', label: 'US Stock Fees' },
    { value: 'optionsTrade', label: 'Options Fees' }
  ];

  // Define handleSubmitReview function after all hooks
  const handleSubmitReview = (reviewData: {
    rating: number;
    title: string;
    content: string;
    tradingExperience: string;
  }) => {
    createReview.mutate({ ...reviewData, broker_id: brokerId });
  };
  
  const currentComparisonData = feeComparison[selectedComparisonMetric as keyof typeof feeComparison];

  const productsFeatures = brokerData?.features?.filter(f => f.category === 'products');
  const desktopFeatures = brokerData?.features?.filter(f => f.category === 'desktop');
  const mobileFeatures = brokerData?.features?.filter(f => f.category === 'mobile');
  const accountFeatures = brokerData?.features?.filter(f => f.category === 'account');
  const depositFeatures = brokerData?.features?.filter(f => f.category === 'deposit');
  const safetyFeatures = brokerData?.features?.filter(f => f.category === 'safety');
  const feeFeatures = brokerData?.features?.filter(f => f.category === 'fees');

  return (
    <>
      {/* SEO Meta Tags */}
      <SEOMetaTags 
        meta={seoMetaData}
        siteName="BrokerAnalysis"
        twitterSite="@brokeranalysis"
      />
      
      <div className="min-h-screen bg-professional-black">
        {/* Header */}
        <BrokerAnalysisHeader />
      
      {/* Hero Section */}
      <BrokerHero />
      
      {/* Broker Overview */}
      <BrokerOverview broker={broker} ratings={ratings} />

      {/* Key Takeaways Section */}
      <KeyTakeaways takeaways={broker.key_takeaways} />

      {/* Why Choose Section */}
      <section className="py-12 bg-charcoal-grey">
        <div className="content-container">
          <Card className="professional-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-pure-white">
                Why choose {broker.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-light-grey leading-relaxed mb-6">
                {broker.name} is highly recommended for those seeking a broker with{' '}
                <span className="text-accent-blue font-medium">all-round great services</span> at{' '}
                <span className="text-accent-blue font-medium">low fees</span>. It has an{' '}
                <span className="text-accent-blue font-medium">unrivaled selection of all asset types</span>{' '}
                from exchanges across the globe, and offers{' '}
                <span className="text-accent-blue font-medium">many trading platforms</span> with{' '}
                <span className="text-accent-blue font-medium">great functionality</span> and{' '}
                <span className="text-accent-blue font-medium">advanced research</span>.
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pros & Cons */}
                <div className="lg:col-span-2">
                  <ProsCons pros={broker.localizedPros || pros} cons={broker.localizedCons || cons} />
                </div>
                
                {/* Rating Breakdown */}
                <div>
                  <Card className="professional-card">
                    <CardHeader>
                      <CardTitle className="text-lg text-pure-white flex items-center gap-2">
                        Overall Score
                        <Badge className="bg-green-600 text-white text-lg px-3 py-1">
                          {ratings.overall}/5
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RatingBreakdown ratings={ratings} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Fee Comparison Chart */}
      {showComparison && (
        <section className="py-12 bg-professional-black">
          <div className="content-container">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-pure-white mb-4">
                See how the best brokers compare to {broker.name}
              </h2>
            </div>
            
            <FeeComparisonChart
              title="Fee Comparison"
              data={feeComparisonData || currentComparisonData}
              selectedMetric={selectedComparisonMetric}
              onMetricChange={setSelectedComparisonMetric}
              metrics={comparisonMetrics}
              description="Estimated commission of a $2,000 trade, assuming a $240 stock price"
            />
          </div>
        </section>
      )}

      {/* Detailed Sections */}
      <DetailedTabs 
        broker={broker} 
        ratings={ratings} 
        feeFeatures={feeFeatures} 
        safetyFeatures={safetyFeatures} 
        depositFeatures={depositFeatures} 
        accountFeatures={accountFeatures} 
        mobileFeatures={mobileFeatures} 
        desktopFeatures={desktopFeatures} 
        productsFeatures={productsFeatures} 
      />

      {/* Expert Review */}
      <ExpertReview expertReview={expertReviewsData?.[0] || expertReview} />

      

      {/* FAQ Section */}
      {showFAQ && (
        <BrokerFAQ faqs={broker.localizedFaqs || faqs} brokerName={broker.name} />
      )}

      {/* User Reviews */}
      {showReviews && (
        <BrokerReviewSection
          reviews={reviewsData?.reviews || reviews}
          averageRating={broker.rating}
          totalReviews={reviewsData?.totalCount || broker.review_count}
          onSubmitReview={handleSubmitReview}
        />
      )}

      {/* Related Brokers & Internal Links section removed */}

        {/* Footer */}
        <BrokerAnalysisFooter />
      </div>
      
      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "FinancialService",
            "name": broker.name,
            "description": `${broker.name} is a regulated online broker offering stock trading, investment services, and financial products.`,
            "url": `https://brokeranalysis.com/brokers/ally-invest`,
            "logo": broker.logo,
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": ratings.overall,
              "bestRating": 5,
              "worstRating": 1,
              "ratingCount": broker.review_count
            },
            "offers": {
              "@type": "Offer",
              "description": "Online trading and investment services",
              "category": "Financial Services"
            }
          },
          "author": {
            "@type": "Organization",
            "name": "BrokerAnalysis",
            "url": "https://brokeranalysis.com"
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": ratings.overall,
            "bestRating": 5,
            "worstRating": 1
          },
          "datePublished": seoMetaData.publishedTime,
          "dateModified": seoMetaData.modifiedTime,
          "reviewBody": `Comprehensive review of ${broker.name} covering trading fees, platform features, safety, and user experience. ${broker.name} offers competitive pricing and robust trading tools for investors.`
        })}
      </script>
    </>
  );
};