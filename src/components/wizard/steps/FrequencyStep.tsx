import { Info, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatStepNumber } from '@/utils/wizardFormatters'
import { TradingFrequency } from '@/types/wizard'

interface FrequencyStepProps {
  selectedFrequency: string
  onFrequencyChange: (frequency: string) => void
  onNext: () => void
  onBack: () => void
}

export function FrequencyStep({ 
  selectedFrequency, 
  onFrequencyChange, 
  onNext, 
  onBack 
}: FrequencyStepProps) {
  const frequencyOptions = [
    { value: TradingFrequency.DAILY, label: 'Daily' },
    { value: TradingFrequency.WEEKLY, label: 'Weekly' },
    { value: TradingFrequency.MONTHLY, label: 'Monthly' },
    { value: TradingFrequency.YEARLY, label: 'Yearly' },
    { value: TradingFrequency.DONT_KNOW, label: "I don't know" }
  ]

  const isValid = selectedFrequency !== ''

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-medium-grey">
              {formatStepNumber(5)}
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
                  <p>Trading frequency affects which broker features are most important</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-professional-black">
              How often do you want to deal with your investments and trades?
            </h2>
          </div>

          <RadioGroup value={selectedFrequency} onValueChange={onFrequencyChange}>
            <div className="space-y-3">
              {frequencyOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="text-sm text-professional-black cursor-pointer flex-1"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

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
