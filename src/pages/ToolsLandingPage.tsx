import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  TrendingUp,
  Zap,
  Users,
  Star,
  ArrowRight,
  Filter,
  Sparkles
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
        return 'bg-accent-blue/20 text-accent-blue border-green-500/30'
      case 'intermediate':
        return 'bg-accent-blue/20 text-accent-blue border-blue-500/30'
      case 'advanced':
        return 'bg-accent-blue/20 text-accent-blue border-purple-500/30'
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <SeoHead
          title="Trading Tools & Calculators | BrokerAnalysis"
          description="Free trading tools and calculators including economic calendar, position calculator, pip calculator, and more."
        />

        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0" aria-hidden="true">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5" />
            <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40" />
            <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse opacity-50" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-8 mb-8 animate-fade-in">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Free Tools</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4 text-accent-blue" />
                <span>500K+ Users</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Star className="w-4 h-4 text-accent-blue" />
                <span>Professional Grade</span>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                  Trading Tools & Calculators
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up">
                Professional-grade trading tools to enhance your strategy. All tools are free, 
                real-time, and designed to help you make better trading decisions.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-500/20">
                <div className="text-3xl font-bold text-accent-blue mb-2">15+</div>
                <div className="text-gray-300">Trading Tools</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-500/20">
                <div className="text-3xl font-bold text-accent-blue mb-2">Real-time</div>
                <div className="text-gray-300">Market Data</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-500/20">
                <div className="text-3xl font-bold text-accent-blue mb-2">100%</div>
                <div className="text-gray-300">Free to Use</div>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-20">
          {/* New section for Heatmaps and Screeners */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Market Insights</h2>
            <Tabs defaultValue="heatmaps" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="heatmaps">Heatmaps</TabsTrigger>
                <TabsTrigger value="screeners">Screeners</TabsTrigger>
              </TabsList>
              <TabsContent value="heatmaps">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div style={{ height: '400px', width: '100%' }}>
                    <StockHeatmap />
                  </div>
                  <div style={{ height: '400px', width: '100%' }}>
                    <CryptoHeatmap />
                  </div>
                  <div style={{ height: '400px', width: '100%' }}>
                    <ForexHeatmap />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="screeners">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div style={{ height: '500px', width: '100%' }}>
                    <StockScreener />
                  </div>
                  <div style={{ height: '500px', width: '100%' }}>
                    <CryptoScreener />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Search and Filter */}
          <Card className="mb-12 bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search tools by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">Filter by:</span>
                  </div>
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="bg-gray-800 border-gray-600">
                      {categories.map((category) => (
                        <TabsTrigger
                          key={category}
                          value={category}
                          className="text-gray-400 data-[state=active]:text-white data-[state=active]:bg-gray-700 capitalize transition-colors"
                        >
                          {category}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Popular Tools */}
          {selectedCategory === 'all' && searchQuery === '' && (
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h2 className="text-3xl font-bold text-white">Most Popular Tools</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {popularTools.map((tool, index) => {
                  const IconComponent = getIcon(tool.icon)

                  return (
                    <Link key={tool.id} to={`/tools/${tool.id}`} className="block group">
                      <Card className="h-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-8 h-8 text-accent-blue" />
                            </div>
                            <div className="flex gap-2">
                              <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 text-xs font-medium">
                                <Star className="w-3 h-3 mr-1" />
                                Popular
                              </Badge>
                              <Badge className={`text-xs font-medium ${getDifficultyColor(tool.difficulty)}`}>
                                {tool.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-2xl text-white group-hover:text-accent-blue transition-colors duration-300">
                            {tool.name}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6">
                          <p className="text-gray-300 leading-relaxed text-lg">
                            {tool.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {tool.features.slice(0, 4).map((feature, featureIndex) => (
                              <Badge
                                key={`${tool.id}-feature-${featureIndex}`}
                                variant="outline"
                                className="text-gray-400 border-gray-600 hover:border-gray-500 text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {tool.features.length > 4 && (
                              <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                                +{tool.features.length - 4} more
                              </Badge>
                            )}
                          </div>

                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
                            Open Tool
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* All Tools */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                {selectedCategory === 'all' ? 'All Tools' : selectedCategory}
              </h2>
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-sm">Showing</span>
                <Badge variant="outline" className="text-gray-300 border-gray-600">
                  {filteredTools.length} tools
                </Badge>
              </div>
            </div>

            {filteredTools.length === 0 ? (
              <Card className="max-w-md mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">No Tools Found</h3>
                  <p className="text-gray-400 mb-6">
                    No tools found matching your search criteria. Try adjusting your filters.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTools.map((tool, index) => {
                  const IconComponent = getIcon(tool.icon)

                  if (tool.id === 'economic-calendar') {
                    return (
                      <div key={tool.id} className="col-span-full"> {/* Make it span full width */}
                        <EconomicCalendar />
                      </div>
                    );
                  }

                  return (
                    <Link key={tool.id} to={`/tools/${tool.id}`} className="block group">
                      <Card className="h-full bg-gradient-to-br from-gray-800/30 to-gray-900/30 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-900/20">
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <IconComponent className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div className="flex gap-2">
                              {tool.popular && (
                                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                              <Badge className={`text-xs ${getDifficultyColor(tool.difficulty)}`}>
                                {tool.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <CardTitle className="text-xl text-white group-hover:text-accent-blue transition-colors duration-300">
                            {tool.name}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-4 flex flex-col flex-1">
                          <p className="text-gray-300 leading-relaxed flex-1">
                            {tool.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {tool.features.slice(0, 3).map((feature, featureIndex) => (
                              <Badge
                                key={`${tool.id}-feature-${featureIndex}`}
                                variant="outline"
                                className="text-gray-400 border-gray-600 text-xs"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {tool.features.length > 3 && (
                              <Badge variant="outline" className="text-gray-400 border-gray-600 text-xs">
                                +{tool.features.length - 3}
                              </Badge>
                            )}
                          </div>

                          <Button className="w-full bg-white text-black hover:bg-gray-100 transition-all duration-300 group mt-auto">
                            Open Tool
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </Button>
                        </CardContent>
                      </Card>
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

export default ToolsLandingPage
