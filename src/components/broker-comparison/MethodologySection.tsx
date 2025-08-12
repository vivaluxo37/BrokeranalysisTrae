import { DollarSign, Monitor, Zap, Shield, Headphones, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MethodologySection() {
  const scoringCriteria = [
    {
      icon: DollarSign,
      title: 'Costs & Fees',
      weight: '25%',
      description: 'Trading commissions, spreads, overnight fees, deposit/withdrawal costs',
      color: 'text-green-500'
    },
    {
      icon: Monitor,
      title: 'Platform & Tools',
      weight: '25%',
      description: 'Trading platforms, charting tools, research, mobile apps, order types',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Execution',
      weight: '20%',
      description: 'Order execution speed, slippage, requotes, market access',
      color: 'text-yellow-500'
    },
    {
      icon: Shield,
      title: 'Safety & Regulation',
      weight: '20%',
      description: 'Regulatory licenses, client fund protection, company history',
      color: 'text-purple-500'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      weight: '10%',
      description: 'Support availability, response times, education resources',
      color: 'text-orange-500'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-section-title text-professional-black mb-4">
            Why We're Different
          </h2>
          <p className="text-xl text-medium-grey max-w-3xl mx-auto mb-8">
            Our transparent 5-point scoring methodology ensures you get unbiased, comprehensive broker reviews. 
            Every broker is evaluated using the same rigorous criteria.
          </p>
          <Button variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
            View Full Methodology
            <ArrowRight size={20} />
          </Button>
        </div>

        {/* Scoring Criteria Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16">
          {scoringCriteria.map((criteria, index) => (
            <Card key={index} className="bg-white border-gray-200 text-professional-black hover:shadow-lg transition-shadow group">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform ${criteria.color}`}>
                  <criteria.icon size={32} />
                </div>
                <CardTitle level={4} className="text-professional-black mb-2">
                  {criteria.title}
                </CardTitle>
                <div className="text-2xl font-bold text-accent-blue">{criteria.weight}</div>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-medium-grey leading-relaxed">
                  {criteria.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Methodology Highlights */}
        <div className="bg-gray-50 rounded-2xl p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-professional-black mb-6">
                Transparent & Independent Reviews
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-professional-black">No Paid Rankings</h4>
                    <p className="text-medium-grey text-sm">Our reviews are never influenced by broker partnerships or payments</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-professional-black">Real Account Testing</h4>
                    <p className="text-medium-grey text-sm">We test brokers with real money to verify execution and costs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-professional-black">Regular Updates</h4>
                    <p className="text-medium-grey text-sm">Reviews are updated quarterly to reflect current conditions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-professional-black">Expert Analysis</h4>
                    <p className="text-medium-grey text-sm">Reviews conducted by experienced traders and financial analysts</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h4 className="font-bold text-professional-black mb-4">Sample Scoring Breakdown</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-medium-grey">Costs & Fees</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-20 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">4.2/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-medium-grey">Platform & Tools</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-22 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">4.6/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-medium-grey">Execution</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-18 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">3.8/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-medium-grey">Safety & Regulation</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-24 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">5.0/5</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-medium-grey">Customer Support</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div className="w-16 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">3.4/5</span>
                  </div>
                </div>
                <div className="border-t pt-3 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-professional-black">Overall Score</span>
                    <span className="text-xl font-bold text-accent-blue">4.3/5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
