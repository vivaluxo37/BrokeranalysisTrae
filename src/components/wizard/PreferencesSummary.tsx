import { Badge } from '@/components/ui/badge'

interface WizardState {
  assetClass: string[]
  experience: string
  deposit: string
  region: string
}

interface PreferencesSummaryProps {
  wizardState: WizardState
}

export function PreferencesSummary({ wizardState }: PreferencesSummaryProps) {
  const formatDepositRange = (range: string): string => {
    switch (range) {
      case 'under_100':
        return 'Under $100'
      case '100_500':
        return '$100 - $500'
      case '500_1000':
        return '$500 - $1,000'
      case '1000_5000':
        return '$1,000 - $5,000'
      case 'over_5000':
        return 'Over $5,000'
      default:
        return range
    }
  }

  const formatExperience = (level: string): string => {
    switch (level) {
      case 'beginner':
        return 'Beginner (0-1 years)'
      case 'intermediate':
        return 'Intermediate (1-3 years)'
      case 'advanced':
        return 'Advanced (3+ years)'
      case 'professional':
        return 'Professional Trader'
      default:
        return level
    }
  }

  return (
    <div className="professional-card p-6 mb-8">
      <h3 className="text-lg font-semibold text-pure-white mb-4">Your Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="text-light-grey text-sm mb-1">Asset Classes</div>
          <div className="flex flex-wrap gap-1">
            {wizardState.assetClass.map(asset => (
              <Badge key={asset} variant="outline" className="text-light-grey border-medium-grey text-xs">
                {asset}
              </Badge>
            ))}
          </div>
        </div>
        <div>
          <div className="text-light-grey text-sm mb-1">Experience</div>
          <div className="text-pure-white">{formatExperience(wizardState.experience)}</div>
        </div>
        <div>
          <div className="text-light-grey text-sm mb-1">Deposit Range</div>
          <div className="text-pure-white">{formatDepositRange(wizardState.deposit)}</div>
        </div>
        <div>
          <div className="text-light-grey text-sm mb-1">Region</div>
          <div className="text-pure-white">{wizardState.region}</div>
        </div>
      </div>
    </div>
  )
}