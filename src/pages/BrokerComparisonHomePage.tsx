import { 
  SEOHeader,
  SEOHero,
  TrustStrip,
  FeaturedBrokers,
  BrokerSearch,
  MethodologySection,
  PopularComparisons,
  LatestReviews,
  TestimonialsSection,
  SEOFooter
} from '@/components/broker-comparison'

export function BrokerComparisonHomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* SEO-Optimized Header */}
      <SEOHeader />

      {/* Hero Section with Search */}
      <SEOHero />

      {/* Trust Strip */}
      <TrustStrip />

      {/* Featured Brokers Carousel */}
      <FeaturedBrokers />

      {/* Advanced Broker Search */}
      <BrokerSearch />

      {/* Methodology Section */}
      <MethodologySection />

      {/* Popular Comparisons & Tools */}
      <PopularComparisons />

      {/* Latest Reviews & Analysis */}
      <LatestReviews />

      {/* Testimonials & Social Proof */}
      <TestimonialsSection />

      {/* SEO-Rich Footer */}
      <SEOFooter />
    </div>
  )
}
