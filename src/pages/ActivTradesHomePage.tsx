import { 
  ActivTradesHero,
  WhyActivTrades,
  TradingInstruments,
  PlatformShowcase,
  PortfolioDiversification,
  EducationTools,
  CustomerSupport,
  TestimonialsAwards,
  ActivTradesFooter
} from '@/components/activtrades'

export function ActivTradesHomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Racing Theme */}
      <ActivTradesHero />

      {/* Why ActivTrades Section */}
      <WhyActivTrades />

      {/* Trading Instruments Section */}
      <TradingInstruments />

      {/* Platform Showcase */}
      <PlatformShowcase />

      {/* Portfolio Diversification */}
      <PortfolioDiversification />

      {/* Education and Tools */}
      <EducationTools />

      {/* Customer Support */}
      <CustomerSupport />

      {/* Testimonials and Awards */}
      <TestimonialsAwards />

      {/* Footer */}
      <ActivTradesFooter />
    </div>
  )
}