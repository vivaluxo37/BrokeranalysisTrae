import { Info, ArrowLeft, ArrowRight, TrendingUp, DollarSign, Zap, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useQuestionnaire } from '@/contexts/QuestionnaireContext'
import { formatStepNumber } from '@/utils/wizardFormatters'
import { FeePreference } from '@/types/wizard'

interface FeesStepProps {}

export function FeesStep({}: FeesStepProps) {
  const { state, updatePreferences, nextStep, previousStep } = useQuestionnaire()
  const selectedFeePreference = state.userPreferences.feePreference || ''
  const filteredBrokersCount = state.filteredBrokers.length

  const feeOptions = [
    { 
      value: FeePreference.REASONABLE_FEES, 
      label: "I'm fine with reasonable fees if the services are exceptional",
      icon: DollarSign,
      description: "Premium services with competitive pricing"
    },
    { 
      value: FeePreference.LOW_COST, 
      label: 'I want to pay as little as possible in fees. I only need basic functions',
      icon: TrendingUp,
      description: "Cost-effective trading with essential features"
    },
    { 
      value: FeePreference.ZERO_COMMISSION, 
      label: "I want a zero-commission broker, I only want to pay what's absolutely necessary",
      icon: Zap,
      description: "Minimal fees, maximum savings"
    },
    { 
      value: FeePreference.DONT_KNOW, 
      label: "I don't know",
      icon: HelpCircle,
      description: "We'll help you find the best option"
    }
  ]

  const handleFeePreferenceChange = (preference: string) => {
    updatePreferences({ feePreference: preference })
  }

  const handleNext = () => {
    nextStep()
  }

  const handleBack = () => {
    previousStep()
  }

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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-professional-black">
                Brokers charge fees, not just for trading. How cost conscious are you?
              </h2>
              {selectedFeePreference && (
                <Badge variant="secondary" className="bg-accent-blue/10 text-accent-blue">
                  <TrendingUp size={14} className="mr-1" />
                  {filteredBrokersCount} brokers
                </Badge>
              )}
            </div>
            {selectedFeePreference && (
              <p className="text-sm text-medium-grey">
                Based on your fee preference, we found {filteredBrokersCount} matching brokers.
              </p>
            )}
          </div>

          <RadioGroup value={selectedFeePreference} onValueChange={handleFeePreferenceChange}>
            <div className="space-y-4">
              {feeOptions.map((option) => {
                const IconComponent = option.icon
                const isSelected = selectedFeePreference === option.value
                return (
                  <div 
                    key={option.value} 
                    className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-accent-blue bg-accent-blue/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFeePreferenceChange(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <IconComponent size={18} className={isSelected ? 'text-accent-blue' : 'text-medium-grey'} />
                        <Label
                          htmlFor={option.value}
                          className="text-sm font-medium text-professional-black cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-xs text-medium-grey pl-6">
                        {option.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </RadioGroup>

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
              Next
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
