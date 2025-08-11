import { 
  FAQStructuredData,
  FaviconMeta,
  NavigationAnalytics,
  OrganizationStructuredData,
  SeoHead,
  WebsiteStructuredData,
  seoConfigs
} from '@/components/common'
import {
  BrokerAnalysisHeroSection,
  EducationalSpotlightSection,
  MarketNewsSection,
  NewsletterSection,
  QuickCompareModule,
  TestimonialsSection,
  ToolsPreviewSection,
  TopRatedBrokersSection,
  TrustFeaturesSection
} from '@/components/brokeranalysis'
import { Layout } from '@/components/layout/Layout'
import { dataIntegrationService } from '@/services/dataIntegrationService'
import { mockQuery } from '@/brokerAnalysisMockData'
// Removed failing TradingView widgets

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
        {/* 1. Hero Section with Broker Search Widget */}
        <BrokerAnalysisHeroSection 
          heroData={homepageData.heroData}
          trustLogos={mockQuery.trustLogos}
        />

        {/* Market Overview Section */}
        <section className="professional-section bg-charcoal-grey">
          <div className="professional-container">
            <h2 className="text-section-title text-center mb-12 text-pure-white">
              Market Overview
            </h2>
            <div className="professional-grid professional-grid-3">
              <div className="professional-card p-6 text-center">
                <h3 className="text-xl font-semibold text-pure-white mb-2">S&P 500</h3>
                <div className="text-2xl font-bold text-green-400 mb-1">4,567.89</div>
                <div className="text-sm text-light-grey">+1.2% Today</div>
              </div>
              <div className="professional-card p-6 text-center">
                <h3 className="text-xl font-semibold text-pure-white mb-2">NASDAQ</h3>
                <div className="text-2xl font-bold text-green-400 mb-1">14,234.56</div>
                <div className="text-sm text-light-grey">+0.8% Today</div>
              </div>
              <div className="professional-card p-6 text-center">
                <h3 className="text-xl font-semibold text-pure-white mb-2">EUR/USD</h3>
                <div className="text-2xl font-bold text-red-400 mb-1">1.0845</div>
                <div className="text-sm text-light-grey">-0.3% Today</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Top-Rated Brokers Showcase - Using Real Extracted Data */}
        <TopRatedBrokersSection 
          brokers={topRatedBrokers}
        />

        {/* Trading Insights Section */}
        <section className="professional-section">
          <div className="professional-container">
            <h2 className="text-section-title text-center mb-12 text-pure-white">
              Trading Insights
            </h2>
            <div className="professional-grid professional-grid-2">
              <div className="professional-card p-6">
                <img 
                  src="https://images.unsplash.com/photo-1518186285589-2f7649de83e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxmaW5hbmNpYWwlMjBhbmFseXNpcyUyMG1hcmtldCUyMGRhdGElMjBncmFwaHMlMjBwcm9mZXNzaW9uYWx8ZW58MHwwfHx8MTc1NDkwNjg1MHww&ixlib=rb-4.1.0&q=85"
                  alt="Professional financial market analysis with graphs and charts - Chris Liverani on Unsplash"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  style={{ width: '100%', height: '192px' }}
                />
                <h3 className="text-xl font-semibold text-pure-white mb-3">
                  Market Analysis Tools
                </h3>
                <p className="text-light-grey">
                  Access professional-grade market analysis tools and real-time data to make informed trading decisions.
                </p>
              </div>
              <div className="professional-card p-6">
                <img 
                  src="https://images.unsplash.com/photo-1586448910234-297fae7189e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHx0cmFkaW5nJTIwcGxhdGZvcm0lMjBjaGFydHMlMjBmaW5hbmNpYWwlMjBkYXRhJTIwaW50ZXJmYWNlfGVufDB8MHx8fDE3NTQ5MDY4NDl8MA&ixlib=rb-4.1.0&q=85"
                  alt="Modern trading platform interface screenshot with charts and data - KOBU Agency on Unsplash"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  style={{ width: '100%', height: '192px' }}
                />
                <h3 className="text-xl font-semibold text-pure-white mb-3">
                  Advanced Trading Platforms
                </h3>
                <p className="text-light-grey">
                  Compare advanced trading platforms with cutting-edge features and professional-grade execution.
                </p>
              </div>
            </div>
          </div>
        </section>

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
        
        {/* Navigation Analytics (Development Tool) */}
        {process.env.NODE_ENV === 'development' && <NavigationAnalytics />}
      </div>
    </Layout>
  )
}