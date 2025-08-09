import { 
  SeoHead,
  seoConfigs,
  WebsiteStructuredData,
  OrganizationStructuredData,
  FAQStructuredData,
  FaviconMeta
} from '@/components/common'
import {
  BrokerAnalysisHeroSection,
  TopRatedBrokersSection,
  QuickCompareModule,
  TrustFeaturesSection,
  MarketNewsSection,
  EducationalSpotlightSection,
  ToolsPreviewSection,
  TestimonialsSection,
  NewsletterSection
} from '@/components/brokeranalysis'
import { Layout } from '@/components/layout/Layout'
import { dataIntegrationService } from '@/services/dataIntegrationService'
import { mockQuery } from '@/brokerAnalysisMockData'

export function HomePage() {
  // Get integrated data that combines extracted real broker data with mock data
  const homepageData = dataIntegrationService.getHomepageData();
  const { topRatedBrokers } = dataIntegrationService.getIntegratedBrokerData();
  
  return (
    <Layout>
      <div className="min-h-screen bg-professional-black">
        {/* SEO Meta Tags */}
        <SeoHead {...seoConfigs.home} />
        <FaviconMeta />

        {/* Structured Data for SEO */}
        <WebsiteStructuredData />
        <OrganizationStructuredData />
        <FAQStructuredData />

        {/* Main content sections */}
        <main>
          {/* 1. Hero Section with Broker Search Widget */}
          <BrokerAnalysisHeroSection 
            heroData={homepageData.heroData}
            trustLogos={mockQuery.trustLogos}
          />

          {/* 2. Top-Rated Brokers Showcase - Using Real Extracted Data */}
          <TopRatedBrokersSection 
            brokers={topRatedBrokers}
          />

          {/* 3. Quick Compare Module - Using Real Extracted Data */}
          <QuickCompareModule 
            brokers={topRatedBrokers}
          />

          {/* 4. Trust and Credibility Section */}
          <TrustFeaturesSection 
            features={homepageData.trustFeatures}
          />

          {/* 5. Market News and Analysis */}
          <MarketNewsSection 
            articles={mockQuery.marketNews}
          />

          {/* 6. Educational Spotlight */}
          <EducationalSpotlightSection 
            educationLevels={homepageData.educationLevels}
          />

          {/* 7. Tools Preview */}
          <ToolsPreviewSection 
            tools={homepageData.tradingTools}
          />

          {/* 8. Community Testimonials */}
          <TestimonialsSection 
            testimonials={mockQuery.testimonials}
          />

          {/* 9. Newsletter Subscription */}
          <NewsletterSection />
        </main>
      </div>
    </Layout>
  )
}