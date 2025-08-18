import { 
  SEOHeader,
  SEOHero,
  TrustStrip,
  FeaturedBrokers,
  BrokerSearch,
  MethodologySection,
  PopularComparisons,
  LatestReviews,
  TestimonialsSection
} from '../components/broker-comparison'
import { FullWidthLayout } from '../components/layout/Layout'
import { SavedResultsPanel } from '../components/SavedResults/SavedResultsPanel'
import { useAuth } from '../hooks/useAuth'
import { HomepageAuthIntegration } from '../components/auth/HomepageAuthIntegration'

export function BrokerComparisonHomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <FullWidthLayout>
      <div className="min-h-screen bg-professional-black text-lg">
        {/* SEO-Optimized Header */}
        <div className="w-full">
          <SEOHeader />
        </div>

        {/* Hero Section with Search */}
        <div className="w-full">
          <SEOHero />
        </div>

        {/* Trust Strip */}
        <div className="w-full">
          <TrustStrip />
        </div>

        {/* Featured Brokers Carousel */}
        <div className="w-full">
          <FeaturedBrokers />
        </div>

        {/* Advanced Broker Search */}
        <div className="w-full">
          <BrokerSearch />
        </div>

        {/* Authentication Integration Section */}
        <HomepageAuthIntegration />

        {/* Authentication-aware Saved Results Section */}
        {isAuthenticated && user && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Your Saved Broker Searches
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Access your previously saved broker recommendations and continue your research where you left off.
                  </p>
                </div>
                <SavedResultsPanel />
              </div>
            </div>
          </section>
        )}

        {/* Methodology Section */}
        <div className="w-full">
          <MethodologySection />
        </div>

        {/* Popular Comparisons & Tools */}
        <div className="w-full">
          <PopularComparisons />
        </div>

        {/* Latest Reviews & Analysis */}
        <div className="w-full">
          <LatestReviews />
        </div>

        {/* Testimonials & Social Proof */}
        <div className="w-full">
          <TestimonialsSection />
        </div>


      </div>
    </FullWidthLayout>
  )
}
