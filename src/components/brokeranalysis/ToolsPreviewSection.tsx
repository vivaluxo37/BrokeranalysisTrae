import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Calculator, 
  Calendar, 
  DollarSign, 
  Grid3X3, 
  RefreshCw 
} from 'lucide-react'

interface TradingTool {
  type: string
  title: string
  description: string
  icon: string
  link: string
}

interface ToolsPreviewSectionProps {
  tools: TradingTool[]
}

export function ToolsPreviewSection({ tools }: ToolsPreviewSectionProps) {
  const getIcon = (iconType: string) => {
    switch (iconType) {
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
      default:
        return Calculator
    }
  }

  return (
    <section className="professional-section bg-charcoal-grey">
      <div className="professional-container">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Free Trading Tools
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Access professional-grade trading tools and calculators to enhance your trading strategy.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="professional-grid professional-grid-3 lg:grid-cols-6 gap-6">
          {tools.map((tool, index) => {
            const IconComponent = getIcon(tool.icon)
            
            return (
              <Link
                key={tool.type}
                to={tool.link}
                className="group"
              >
                <div 
                  className="professional-card p-6 text-center interactive-professional animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 bg-professional-black border border-medium-grey rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-medium-grey/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-pure-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-pure-white mb-2 leading-tight">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="text-light-grey text-xs leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* View All Tools Link */}
        <div className="text-center mt-12">
          <Link 
            to="/tools"
            className="inline-flex items-center text-pure-white hover:text-light-grey transition-colors font-medium"
          >
            Explore All Trading Tools
            <Calculator className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}