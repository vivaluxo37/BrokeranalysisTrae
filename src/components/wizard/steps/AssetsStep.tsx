import { Info, ArrowLeft, ArrowRight, TrendingUp, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useQuestionnaire } from '@/contexts/QuestionnaireContext'
import { formatStepNumber, formatAssetType } from '@/utils/wizardFormatters'
import { AssetType } from '@/types/wizard'

interface AssetsStepProps {}

export function AssetsStep({}: AssetsStepProps) {
  const { state, updatePreferences, nextStep, previousStep } = useQuestionnaire()
  const selectedAssets = state.userPreferences.assets
  const filteredBrokersCount = state.filteredBrokers.length

  const assetOptions = [
    AssetType.STOCKS_ETFS,
    AssetType.FOREX,
    AssetType.OPTIONS,
    AssetType.FUTURES,
    AssetType.FUNDS,
    AssetType.BONDS,
    AssetType.CFDS,
    AssetType.CRYPTOS,
    AssetType.DONT_KNOW
  ]

  const handleAssetToggle = (asset: string) => {
    const newAssets = selectedAssets.includes(asset)
      ? selectedAssets.filter(a => a !== asset)
      : [...selectedAssets, asset]
    updatePreferences({ assets: newAssets })
  }

  const handleNext = () => {
    nextStep()
  }

  const handleBack = () => {
    previousStep()
  }

  const isValid = selectedAssets.length > 0

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-medium-grey">
              {formatStepNumber(2)}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-accent-blue">
                    <Info size={16} />
                    Why it matters
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Different brokers specialize in different asset classes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-professional-black">
                Choose the most important assets for you!
              </h2>
              {selectedAssets.length > 0 && filteredBrokersCount > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  {filteredBrokersCount} brokers match
                </Badge>
              )}
            </div>
            <p className="text-medium-grey">
              Select all asset classes you're interested in trading. This helps us find brokers with the best offerings for your needs.
            </p>
          </div>

          <div className="space-y-3">
            {assetOptions.map((asset) => (
              <div key={asset} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                <Checkbox
                  id={asset}
                  checked={selectedAssets.includes(asset)}
                  onCheckedChange={() => handleAssetToggle(asset)}
                />
                <label
                  htmlFor={asset}
                  className="text-sm text-professional-black cursor-pointer flex-1 font-medium"
                >
                  {formatAssetType(asset)}
                </label>
                {selectedAssets.includes(asset) && (
                  <Target size={16} className="text-accent-blue" />
                )}
              </div>
            ))}
          </div>

          {selectedAssets.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-800">
                <Target size={16} />
                <span className="text-sm font-medium">
                  Perfect! You've selected {selectedAssets.length} asset class{selectedAssets.length > 1 ? 'es' : ''}. 
                  We found {filteredBrokersCount} brokers that support your preferences.
                </span>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isValid}
              className="flex-1 bg-accent-blue hover:bg-accent-blue/90"
            >
              Continue to experience
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
