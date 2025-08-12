import { Calculator, TrendingUp, PieChart, ArrowRight, BarChart3, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function PopularComparisons() {
  const popularComparisons = [
    {
      title: 'Interactive Brokers vs IG Markets',
      description: 'Compare two leading brokers for international trading',
      views: '12.5k views',
      category: 'Broker vs Broker'
    },
    {
      title: 'Best Forex Brokers 2025',
      description: 'Top-rated forex brokers with tight spreads',
      views: '8.3k views',
      category: 'Best Of'
    },
    {
      title: 'Best Crypto Brokers UK',
      description: 'FCA-regulated brokers for cryptocurrency trading',
      views: '6.7k views',
      category: 'Country Guide'
    },
    {
      title: 'Plus500 vs eToro',
      description: 'CFD trading platforms comparison',
      views: '5.9k views',
      category: 'Broker vs Broker'
    },
    {
      title: 'Best Brokers for Scalping',
      description: 'Low-latency brokers for high-frequency trading',
      views: '4.2k views',
      category: 'Trading Style'
    },
    {
      title: 'Best Stock Brokers for Beginners',
      description: 'User-friendly platforms with educational resources',
      views: '9.1k views',
      category: 'Best Of'
    }
  ]

  const tradingTools = [
    {
      icon: Calculator,
      title: 'Fee Calculator',
      description: 'Calculate trading costs across different brokers',
      color: 'text-blue-500'
    },
    {
      icon: TrendingUp,
      title: 'Spread Comparison',
      description: 'Compare real-time spreads on major currency pairs',
      color: 'text-green-500'
    },
    {
      icon: PieChart,
      title: 'Portfolio Analyzer',
      description: 'Analyze your portfolio allocation and risk',
      color: 'text-purple-500'
    },
    {
      icon: BarChart3,
      title: 'P&L Calculator',
      description: 'Calculate potential profits and losses',
      color: 'text-orange-500'
    },
    {
      icon: DollarSign,
      title: 'Currency Converter',
      description: 'Real-time currency conversion rates',
      color: 'text-yellow-500'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Popular Comparisons */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-professional-black mb-4">
                Popular Comparisons
              </h2>
              <p className="text-medium-grey">
                Discover the most searched broker comparisons and guides
              </p>
            </div>

            <div className="space-y-4">
              {popularComparisons.map((comparison, index) => (
                <Card key={index} className="bg-white border-gray-200 text-professional-black hover:shadow-md transition-shadow cursor-pointer group">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-accent-blue/10 text-accent-blue text-xs rounded-full font-medium">
                            {comparison.category}
                          </span>
                          <span className="text-xs text-medium-grey">{comparison.views}</span>
                        </div>
                        <h3 className="font-semibold text-professional-black mb-1 group-hover:text-accent-blue transition-colors">
                          {comparison.title}
                        </h3>
                        <p className="text-sm text-medium-grey">
                          {comparison.description}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-medium-grey group-hover:text-accent-blue transition-colors ml-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <Button variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
                View All Comparisons
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>

          {/* Trading Tools */}
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-professional-black mb-4">
                Trading Tools
              </h2>
              <p className="text-medium-grey">
                Free calculators and tools to enhance your trading decisions
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tradingTools.map((tool, index) => (
                <Card key={index} className="bg-white border-gray-200 text-professional-black hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${tool.color}`}>
                      <tool.icon size={20} />
                    </div>
                    <CardTitle level={5} className="text-professional-black group-hover:text-accent-blue transition-colors">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-medium-grey mb-4">
                      {tool.description}
                    </p>
                    <Button size="sm" variant="outline" className="w-full border-gray-300 text-professional-black hover:bg-gray-50">
                      Use Tool
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8">
              <Button variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
                View All Tools
                <ArrowRight size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
