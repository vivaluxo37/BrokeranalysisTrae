import { Info, ArrowLeft, ArrowRight, TrendingUp, DollarSign, Wallet, CreditCard, Banknote, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useQuestionnaire } from '@/contexts/QuestionnaireContext'
import { formatStepNumber, formatDepositRange } from '@/utils/wizardFormatters'
import { DepositAmount } from '@/types/wizard'

interface DepositStepProps {}

export function DepositStep({}: DepositStepProps) {
  const { state, updatePreferences, nextStep, previousStep } = useQuestionnaire()
  const selectedDeposit = state.userPreferences.depositAmount || ''
  const filteredBrokersCount = state.filteredBrokers.length

  const depositOptions = [
    {
      value: DepositAmount.LESS_THAN_50,
      icon: Wallet,
      description: 'Perfect for beginners starting small'
    },
    {
      value: DepositAmount.RANGE_51_200,
      icon: DollarSign,
      description: 'Good starting amount for most traders'
    },
    {
      value: DepositAmount.RANGE_201_500,
      icon: CreditCard,
      description: 'Moderate investment for serious trading'
    },
    {
      value: DepositAmount.RANGE_501_1000,
      icon: Banknote,
      description: 'Substantial amount for active trading'
    },
    {
      value: DepositAmount.RANGE_1001_2000,
      icon: TrendingUp,
      description: 'Large deposit for experienced traders'
    },
    {
      value: DepositAmount.MORE_THAN_2000,
      icon: TrendingUp,
      description: 'High-value trading with premium features'
    },
    {
      value: DepositAmount.DONT_KNOW,
      icon: HelpCircle,
      description: 'We\'ll help you determine the right amount'
    }
  ]

  const handleDepositChange = (deposit: string) => {
    updatePreferences({ depositAmount: deposit })
  }

  const handleNext = () => {
    nextStep()
  }

  const handleBack = () => {
    previousStep()
  }

  const isValid = selectedDeposit !== ''

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-medium-grey">
              {formatStepNumber(6)}
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
                  <p>Minimum deposit requirements vary between brokers</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-professional-black">
                How much money would you like to deposit?
              </h2>
              {selectedDeposit && (
                <Badge variant="secondary" className="bg-accent-blue/10 text-accent-blue">
                  <TrendingUp size={14} className="mr-1" />
                  {filteredBrokersCount} brokers
                </Badge>
              )}
            </div>
            {selectedDeposit && (
              <p className="text-sm text-medium-grey">
                Based on your deposit amount, we found {filteredBrokersCount} matching brokers.
              </p>
            )}
          </div>

          <RadioGroup value={selectedDeposit} onValueChange={handleDepositChange}>
            <div className="space-y-4">
              {depositOptions.map((option) => {
                const IconComponent = option.icon
                const isSelected = selectedDeposit === option.value
                return (
                  <div 
                    key={option.value} 
                    className={`flex items-start space-x-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-accent-blue bg-accent-blue/5' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleDepositChange(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <IconComponent size={18} className={isSelected ? 'text-accent-blue' : 'text-medium-grey'} />
                        <Label
                          htmlFor={option.value}
                          className="text-sm font-medium text-professional-black cursor-pointer"
                        >
                          {formatDepositRange(option.value)}
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
