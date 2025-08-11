import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BarChart3, Coins, LineChart, TrendingUp } from 'lucide-react'
import { AssetClass } from '@/enums'
import { CollectionManager } from '@/utils/SafeCollection'

interface AssetCategory {
  type: AssetClass
  title: string
  description: string
  brokerCount: number
  icon: string
  featured: boolean
}

interface AssetCategoriesSectionProps {
  assetCategories: AssetCategory[]
}

const iconMap = {
  'trending-up': TrendingUp,
  'bar-chart-3': BarChart3,
  'coins': Coins,
  'line-chart': LineChart,
}

export function AssetCategoriesSection({ assetCategories }: AssetCategoriesSectionProps) {
  // Create safe collection wrapper for asset categories
  const safeAssetCategories = CollectionManager.validateCollection(
    assetCategories,
    'assetCategories'
  )

  return (
    <section className="section-padding bg-gradient-mesh">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="bg-brokeranalysis-accent/20 text-brokeranalysis-accent border-brokeranalysis-accent/30 mb-4">
            All Asset Classes
          </Badge>
          <h2 className="text-section-title text-gradient mb-6">
            Trade Every Market, Every Asset
          </h2>
          <p className="text-xl text-starfield-gray max-w-3xl mx-auto">
            From forex to crypto, stocks to commodities - find specialized brokers for every trading style and asset class.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {safeAssetCategories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || TrendingUp
            
            return (
              <Card key={category.type} className="topforex-card topforex-card-hover group cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-success rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-luminescent-white mb-2">
                    {category.title}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-brokeranalysis-accent/20 text-brokeranalysis-accent">
                    {category.brokerCount} Brokers
                  </Badge>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-starfield-gray mb-6">
                    {category.description}
                  </CardDescription>
                  <Button 
                    variant="ghost" 
                    className="text-brokeranalysis-accent hover:text-white hover:bg-brokeranalysis-accent/20 group-hover:translate-x-1 transition-all duration-300"
                  >
                    Explore Brokers
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Additional Categories Grid */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 text-center hover:bg-glass-overlay/20 transition-all duration-300 cursor-pointer">
            <div className="text-2xl font-bold text-brokeranalysis-accent mb-2">85+</div>
            <div className="text-sm text-starfield-gray">Commodities Brokers</div>
          </div>
          <div className="glass-card p-6 text-center hover:bg-glass-overlay/20 transition-all duration-300 cursor-pointer">
            <div className="text-2xl font-bold text-neural-blue mb-2">120+</div>
            <div className="text-sm text-starfield-gray">Indices Brokers</div>
          </div>
          <div className="glass-card p-6 text-center hover:bg-glass-overlay/20 transition-all duration-300 cursor-pointer">
            <div className="text-2xl font-bold text-topforex-teal mb-2">95+</div>
            <div className="text-sm text-starfield-gray">ETF Brokers</div>
          </div>
          <div className="glass-card p-6 text-center hover:bg-glass-overlay/20 transition-all duration-300 cursor-pointer">
            <div className="text-2xl font-bold text-topforex-purple mb-2">65+</div>
            <div className="text-sm text-starfield-gray">Futures Brokers</div>
          </div>
        </div>
      </div>
    </section>
  )
}