import { 
  AssetCategoriesSection,
  EducationalHubSection,
  FeaturedBrokersSection,
  HeroSection,
  TradingToolsSection,
  TrustSignalsSection
} from '@/components/brokeranalysis'
import { Layout } from '@/components/layout/Layout'
import { mockRootProps } from '@/brokerAnalysisMockData'

export function BrokerAnalysisHomePage() {
  return (
    <Layout>
      <div className="min-h-screen cosmic-void">
        {/* Hero Section with Search */}
        <HeroSection 
          heroData={mockRootProps.heroData}
          trustIndicators={mockRootProps.trustIndicators}
        />

        {/* Multi-Asset Categories */}
        <AssetCategoriesSection 
          assetCategories={mockRootProps.assetCategories}
        />

        {/* Featured Top-Rated Brokers */}
        <FeaturedBrokersSection 
          featuredBrokers={mockRootProps.featuredBrokers}
        />

        {/* Trading Tools Hub */}
        <TradingToolsSection 
          tradingTools={mockRootProps.tradingTools}
        />

        {/* Trust Signals & Credibility */}
        <TrustSignalsSection 
          trustIndicators={mockRootProps.trustIndicators}
        />

        {/* Educational Content Hub */}
        <EducationalHubSection />
      </div>
    </Layout>
  )
}
