import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Activity, 
  BarChart3, 
  Calculator, 
  Calendar, 
  DollarSign, 
  Grid3X3,
  PieChart,
  RefreshCw,
  Search,
  TrendingUp
} from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { SeoHead } from '@/components/common'

interface TradingTool {
  id: string
  name: string
  description: string
  category: string
  icon: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  features: string[]
  popular?: boolean
}

export function ToolsLandingPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const tools: TradingTool[] = [
    {
      id: 'economic-calendar',
      name: 'Economic Calendar',
      description: 'Track market-moving economic events and news releases with real-time updates and impact indicators.',
      category: 'Market Analysis',
      icon: 'calendar',
      difficulty: 'beginner',
      features: ['Real-time updates', 'Impact indicators', 'Historical data', 'Custom filters'],
      popular: true
    },
    {
      id: 'position-calculator',
      name: 'Position Size Calculator',
      description: 'Calculate optimal position sizes based on your risk management rules and account balance.',
      category: 'Risk Management',
      icon: 'calculator',
      difficulty: 'intermediate',
      features: ['Risk percentage', 'Stop loss levels', 'Multiple currencies', 'Lot size calculation'],
      popular: true
    },
    {
      id: 'pip-calculator',
      name: 'Pip Calculator',
      description: 'Calculate the value of a pip for any currency pair and position size.',
      category: 'Risk Management',
      icon: 'calculator',
      difficulty: 'beginner',
      features: ['All currency pairs', 'Custom position sizes', 'Real-time rates', 'Multiple accounts']
    },
    {
      id: 'swap-calculator',
      name: 'Swap Calculator',
      description: 'Calculate overnight financing costs for holding positions across different brokers.',
      category: 'Cost Analysis',
      icon: 'refresh-cw',
      difficulty: 'intermediate',
      features: ['Broker comparison', 'Multiple instruments', 'Historical data', 'Cost projections']
    },
    {
      id: 'correlation-matrix',
      name: 'Correlation Matrix',
      description: 'Analyze relationships between currency pairs and other financial instruments.',
      category: 'Market Analysis',
      icon: 'grid',
      difficulty: 'advanced',
      features: ['Real-time correlations', 'Historical analysis', 'Heatmap visualization', 'Custom timeframes']
    },
    {
      id: 'profit-calculator',
      name: 'Profit Calculator',
      description: 'Calculate potential profits and losses for your trading positions.',
      category: 'Risk Management',
      icon: 'trending-up',
      difficulty: 'beginner',
      features: ['Multiple instruments', 'Entry/exit prices', 'Commission included', 'Risk-reward ratios']
    },
    {
      id: 'margin-calculator',
      name: 'Margin Calculator',
      description: 'Calculate required margin for your trading positions across different instruments.',
      category: 'Risk Management',
      icon: 'pie-chart',
      difficulty: 'intermediate',
      features: ['All instruments', 'Leverage options', 'Broker comparison', 'Real-time rates']
    },
    {
      id: 'volatility-calculator',
      name: 'Volatility Calculator',
      description: 'Measure and analyze market volatility for better risk assessment.',
      category: 'Market Analysis',
      icon: 'activity',
      difficulty: 'advanced',
      features: ['Historical volatility', 'Implied volatility', 'Multiple timeframes', 'Volatility forecasts']
    }
  ]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'calendar':
        return Calendar
      case 'calculator':
        return Calculator
      case 'refresh-cw':
        return RefreshCw
      case 'grid':
        return Grid3X3
      case 'bar-chart':
        return BarChart3
      case 'dollar-sign':
        return DollarSign
      case 'trending-up':
        return TrendingUp
      case 'pie-chart':
        return PieChart
      case 'activity':
        return Activity
      default:
        return Calculator
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'advanced':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-medium-grey/20 text-light-grey border-medium-grey'
    }
  }

  const categories = ['all', ...Array.from(new Set(tools.map(tool => tool.category)))]

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularTools = tools.filter(tool => tool.popular)

  return (
    <Layout>
      <div className="min-h-screen bg-professional-black">
        <SeoHead 
          title="Trading Tools & Calculators | BrokerAnalysis"
          description="Free trading tools and calculators including economic calendar, position calculator, pip calculator, and more."
        />

        <div className="professional-container py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-section-title text-pure-white mb-4">
              Trading Tools & Calculators
            </h1>
            <p className="text-subtitle max-w-3xl mx-auto">
              Professional-grade trading tools to enhance your trading strategy. All tools are free and designed to help you make better trading decisions.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="professional-card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="professional-input pl-10"
                />
              </div>
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList className="bg-charcoal-grey border-medium-grey">
                  {categories.map((category) => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="text-light-grey data-[state=active]:text-pure-white capitalize"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Popular Tools */}
          {selectedCategory === 'all' && searchQuery === '' && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-pure-white mb-6">Popular Tools</h2>
              <div className="professional-grid professional-grid-2 gap-6">
                {popularTools.map((tool) => {
                  const IconComponent = getIcon(tool.icon)
                  
                  return (
                    <Link key={tool.id} to={`/tools/${tool.id}`} className="block">
                      <div className="professional-card p-6 interactive-professional">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 bg-charcoal-grey border border-medium-grey rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-pure-white" />
                          </div>
                          <div className="flex gap-2">
                            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                              Popular
                            </Badge>
                            <Badge className={`text-xs ${getDifficultyColor(tool.difficulty)}`}>
                              {tool.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-pure-white mb-2">
                          {tool.name}
                        </h3>
                        <p className="text-light-grey mb-4 leading-relaxed">
                          {tool.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tool.features.slice(0, 3).map((feature) => (
                            <Badge 
                              key={feature} 
                              variant="outline" 
                              className="text-light-grey border-medium-grey text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {tool.features.length > 3 && (
                            <Badge variant="outline" className="text-light-grey border-medium-grey text-xs">
                              +{tool.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <Button className="btn-professional-primary w-full">
                          Open Tool
                        </Button>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* All Tools */}
          <div>
            <h2 className="text-2xl font-semibold text-pure-white mb-6">
              {selectedCategory === 'all' ? 'All Tools' : selectedCategory}
              <span className="text-light-grey text-lg ml-2">({filteredTools.length})</span>
            </h2>
            
            {filteredTools.length === 0 ? (
              <div className="professional-card p-12 text-center">
                <div className="text-light-grey mb-4">No tools found matching your criteria.</div>
                <Button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                  className="btn-professional-secondary"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="professional-grid professional-grid-3 gap-6">
                {filteredTools.map((tool) => {
                  const IconComponent = getIcon(tool.icon)
                  
                  return (
                    <Link key={tool.id} to={`/tools/${tool.id}`} className="block">
                      <div className="professional-card p-6 interactive-professional h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 bg-charcoal-grey border border-medium-grey rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-pure-white" />
                          </div>
                          <div className="flex gap-2">
                            {tool.popular && (
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                Popular
                              </Badge>
                            )}
                            <Badge className={`text-xs ${getDifficultyColor(tool.difficulty)}`}>
                              {tool.difficulty}
                            </Badge>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-pure-white mb-2">
                          {tool.name}
                        </h3>
                        <p className="text-light-grey mb-4 leading-relaxed flex-1">
                          {tool.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tool.features.slice(0, 2).map((feature) => (
                            <Badge 
                              key={feature} 
                              variant="outline" 
                              className="text-light-grey border-medium-grey text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {tool.features.length > 2 && (
                            <Badge variant="outline" className="text-light-grey border-medium-grey text-xs">
                              +{tool.features.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <Button className="btn-professional-primary w-full">
                          Open Tool
                        </Button>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}