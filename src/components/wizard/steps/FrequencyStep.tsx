import { Info, ArrowLeft, ArrowRight, TrendingUp, Calendar, Clock, BarChart3, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useQuestionnaire } from '@/contexts/QuestionnaireContext'
import { formatStepNumber } from '@/utils/wizardFormatters'
import { TradingFrequency } from '@/types/wizard'

interface FrequencyStepProps {}

export function FrequencyStep({}: FrequencyStepProps) {
  const { state, updatePreferences, nextStep, previousStep } = useQuestionnaire()
  const selectedFrequency = state.userPreferences.tradingFrequency || ''
  const filteredBrokersCount = state.filteredBrokers.length

  const frequencyOptions = [
    { 
      value: TradingFrequency.DAILY, 
      label: 'Daily',
      icon: BarChart3,
      description: 'Active trading with frequent transactions'
    },
    { 
      value: TradingFrequency.WEEKLY, 
      label: 'Weekly',
      icon: Calendar,
      description: 'Regular trading with weekly reviews'
    },
    { 
      value: TradingFrequency.MONTHLY, 
      label: 'Monthly',
      icon: Clock,
      description: 'Long-term investing with monthly adjustments'
    },
    { 
      value: TradingFrequency.YEARLY, 
      label: 'Yearly',
      icon: TrendingUp,
      description: 'Buy and hold strategy with annual reviews'
    },
    { 
      value: TradingFrequency.DONT_KNOW, 
      label: "I don't know",
      icon: HelpCircle,
      description: 'We\'ll help you determine the best approach'
    }
  ]

  const handleFrequencyChange = (frequency: string) => {
    updatePreferences({ tradingFrequency: frequency })
  }

  const handleNext = () => {
    nextStep()
  }

  const handleBack = () => {
    previousStep()
  }

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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-professional-black">
                How often do you want to deal with your investments and trades?
              </h2>
              {selectedFrequency && (
                <Badge variant="secondary" className="bg-accent-blue/10 text-accent-blue">
                  <TrendingUp size={14} className="mr-1" />
                  {filteredBrokersCount} brokers
                </Badge>
              )}
            </div>
            {selectedFrequency && (
              <p className="text-sm text-medium-grey">
                Based on your trading frequency, we found {filteredBrokersCount} matching brokers.
              </p>
            )}
          </div>

          <RadioGroup value={selectedFrequency} onValueChange={handleFrequencyChange}>
            <div className="space-y-4">
              {frequencyOptions.map((option) => {
                const IconComponent = option.icon
                const isSelected = selectedFrequency === option.value
                return (
                  <div 
                    key={option.value} 
                    className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-accent-blue bg-accent-blue/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleFrequencyChange(option.value)}
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
