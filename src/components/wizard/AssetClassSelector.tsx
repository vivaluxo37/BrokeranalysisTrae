import { BarChart3, Bitcoin, LineChart, Package, TrendingUp } from 'lucide-react'
import { CheckCircle } from 'lucide-react'

interface Option {
  value: string
  label: string
  description?: string
  icon?: string
}

interface AssetClassSelectorProps {
  options: Option[]
  selectedAssets: string[]
  onToggle: (value: string) => void
}

export function AssetClassSelector({ options, selectedAssets, onToggle }: AssetClassSelectorProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending-up':
        return TrendingUp
      case 'bar-chart':
        return BarChart3
      case 'bitcoin':
        return Bitcoin
      case 'line-chart':
        return LineChart
      case 'package':
        return Package
      default:
        return TrendingUp
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {options.map((option) => {
        const IconComponent = getIcon(option.icon || 'trending-up')
        const isSelected = selectedAssets.includes(option.value)
        
        return (
          <div
            key={option.value}
            onClick={() => onToggle(option.value)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              isSelected 
                ? 'border-pure-white bg-charcoal-grey' 
                : 'border-medium-grey hover:border-light-grey'
            }`}
          >
            <div className="flex items-center">
              <IconComponent className="w-6 h-6 text-pure-white mr-3" />
              <div className="flex-1">
                <div className="text-pure-white font-medium">{option.label}</div>
                {option.description && (
                  <div className="text-light-grey text-sm">{option.description}</div>
                )}
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                isSelected 
                  ? 'border-pure-white bg-pure-white' 
                  : 'border-medium-grey'
              }`}>
                {isSelected && (
                  <CheckCircle className="w-3 h-3 text-professional-black m-0.5" />
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
