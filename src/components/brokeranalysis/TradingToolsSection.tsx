import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calculator, Search, CalendarDays, BarChart3, ArrowRight, Zap } from 'lucide-react'
import { ToolType } from '@/enums'

interface TradingTool {
  type: ToolType
  title: string
  description: string
  icon: string
  link: string
}

interface TradingToolsSectionProps {
  tradingTools: TradingTool[]
}

const iconMap = {
  'calculator': Calculator,
  'search': Search,
  'calendar': CalendarDays,
  'compare': BarChart3,
}

export function TradingToolsSection({ tradingTools }: TradingToolsSectionProps) {
  return (
    <section className="section-padding bg-gradient-hero">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="bg-neural-blue/20 text-neural-blue border-neural-blue/30 mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Trading Tools
          </Badge>
          <h2 className="text-section-title text-gradient mb-6">
            Professional Trading Arsenal
          </h2>
          <p className="text-xl text-starfield-gray max-w-3xl mx-auto">
            Advanced calculators, market scanners, and comparison tools to optimize your trading decisions and maximize profits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {tradingTools.map((tool, index) => {
            const IconComponent = iconMap[tool.icon as keyof typeof iconMap] || Calculator
            
            return (
              <Card key={tool.type} className="topforex-card topforex-card-hover group cursor-pointer relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-neural-blue/5 to-brokeranalysis-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <CardHeader className="text-center pb-4 relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neural-blue to-brokeranalysis-accent rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg text-luminescent-white mb-2 group-hover:text-brokeranalysis-accent transition-colors duration-300">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center relative z-10">
                  <CardDescription className="text-starfield-gray mb-6 group-hover:text-ghostly-glow transition-colors duration-300">
                    {tool.description}
                  </CardDescription>
                  
                  <Button 
                    variant="ghost" 
                    className="text-brokeranalysis-accent hover:text-white hover:bg-brokeranalysis-accent/20 group-hover:translate-y-[-2px] transition-all duration-300 font-semibold"
                  >
                    Try Tool
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>

                {/* Hover effect overlay */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neural-blue to-brokeranalysis-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </Card>
            )
          })}
        </div>

        {/* Additional Tools Grid */}
        <div className="mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center hover:bg-glass-overlay/20 transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 mx-auto mb-4 bg-topforex-purple/20 rounded-xl flex items-center justify-center group-hover:bg-topforex-purple/30 transition-colors duration-300">
                <BarChart3 className="w-6 h-6 text-topforex-purple" />
              </div>
              <h3 className="text-lg font-semibold text-luminescent-white mb-2">Risk Calculator</h3>
              <p className="text-sm text-starfield-gray mb-4">Calculate position sizes and risk levels</p>
              <Button variant="ghost" size="sm" className="text-topforex-purple hover:bg-topforex-purple/20">
                Calculate Risk
              </Button>
            </div>

            <div className="glass-card p-8 text-center hover:bg-glass-overlay/20 transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 mx-auto mb-4 bg-topforex-teal/20 rounded-xl flex items-center justify-center group-hover:bg-topforex-teal/30 transition-colors duration-300">
                <Search className="w-6 h-6 text-topforex-teal" />
              </div>
              <h3 className="text-lg font-semibold text-luminescent-white mb-2">Broker Finder</h3>
              <p className="text-sm text-starfield-gray mb-4">AI-powered broker matching wizard</p>
              <Button variant="ghost" size="sm" className="text-topforex-teal hover:bg-topforex-teal/20">
                Find Broker
              </Button>
            </div>

            <div className="glass-card p-8 text-center hover:bg-glass-overlay/20 transition-all duration-300 cursor-pointer group">
              <div className="w-12 h-12 mx-auto mb-4 bg-rating-excellent/20 rounded-xl flex items-center justify-center group-hover:bg-rating-excellent/30 transition-colors duration-300">
                <CalendarDays className="w-6 h-6 text-rating-excellent" />
              </div>
              <h3 className="text-lg font-semibold text-luminescent-white mb-2">Market Calendar</h3>
              <p className="text-sm text-starfield-gray mb-4">Track economic events and earnings</p>
              <Button variant="ghost" size="sm" className="text-rating-excellent hover:bg-rating-excellent/20">
                View Calendar
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-neural-blue to-brokeranalysis-accent hover:from-neural-blue/90 hover:to-brokeranalysis-accent/90 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Zap className="w-5 h-5 mr-2" />
            Explore All Tools
          </Button>
        </div>
      </div>
    </section>
  )
}