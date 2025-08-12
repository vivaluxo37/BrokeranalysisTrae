import { Info, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatStepNumber } from '@/utils/wizardFormatters'
import { FeePreference } from '@/types/wizard'

interface FeesStepProps {
  selectedFeePreference: string
  onFeePreferenceChange: (preference: string) => void
  onNext: () => void
  onBack: () => void
}

export function FeesStep({ 
  selectedFeePreference, 
  onFeePreferenceChange, 
  onNext, 
  onBack 
}: FeesStepProps) {
  const feeOptions = [
    { value: FeePreference.REASONABLE_FEES, label: "I'm fine with reasonable fees if the services are exceptional" },
    { value: FeePreference.LOW_COST, label: 'I want to pay as little as possible in fees. I only need basic functions' },
    { value: FeePreference.ZERO_COMMISSION, label: "I want a zero-commission broker, I only want to pay what's absolutely necessary" },
    { value: FeePreference.DONT_KNOW, label: "I don't know" }
  ]

  const isValid = selectedFeePreference !== ''

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-medium-grey">
              {formatStepNumber(4)}
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
                  <p>Fee structure varies significantly between brokers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-professional-black">
              Brokers charge fees, not just for trading. How cost conscious are you?
            </h2>
          </div>

          <RadioGroup value={selectedFeePreference} onValueChange={onFeePreferenceChange}>
            <div className="space-y-3">
              {feeOptions.map((option) => (
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