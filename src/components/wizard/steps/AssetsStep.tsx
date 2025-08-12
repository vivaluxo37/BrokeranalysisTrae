import { Info, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatStepNumber, formatAssetType } from '@/utils/wizardFormatters'
import { AssetType } from '@/types/wizard'

interface AssetsStepProps {
  selectedAssets: string[]
  onAssetsChange: (assets: string[]) => void
  onNext: () => void
  onBack: () => void
}

export function AssetsStep({ 
  selectedAssets, 
  onAssetsChange, 
  onNext, 
  onBack 
}: AssetsStepProps) {
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
    onAssetsChange(newAssets)
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
            <h2 className="text-2xl font-bold text-professional-black">
              Choose the most important assets for you!
            </h2>
          </div>

          <div className="space-y-3">
            {assetOptions.map((asset) => (
              <div key={asset} className="flex items-center space-x-3">
                <Checkbox
                  id={asset}
                  checked={selectedAssets.includes(asset)}
                  onCheckedChange={() => handleAssetToggle(asset)}
                />
                <label
                  htmlFor={asset}
                  className="text-sm text-professional-black cursor-pointer flex-1"
                >
                  {formatAssetType(asset)}
                </label>
              </div>
            ))}
          </div>

          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            <Button
              onClick={onNext}
              disabled={!isValid}
              className="flex-1 bg-accent-blue hover:bg-accent-blue/90"
            >
              Next
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}