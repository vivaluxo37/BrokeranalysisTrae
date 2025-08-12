import { Info, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatStepNumber, formatDepositRange } from '@/utils/wizardFormatters'
import { DepositAmount } from '@/types/wizard'

interface DepositStepProps {
  selectedDeposit: string
  onDepositChange: (deposit: string) => void
  onNext: () => void
  onBack: () => void
}

export function DepositStep({ 
  selectedDeposit, 
  onDepositChange, 
  onNext, 
  onBack 
}: DepositStepProps) {
  const depositOptions = [
    DepositAmount.LESS_THAN_50,
    DepositAmount.RANGE_51_200,
    DepositAmount.RANGE_201_500,
    DepositAmount.RANGE_501_1000,
    DepositAmount.RANGE_1001_2000,
    DepositAmount.MORE_THAN_2000,
    DepositAmount.DONT_KNOW
  ]

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
            <h2 className="text-2xl font-bold text-professional-black">
              How much money would you like to deposit?
            </h2>
          </div>

          <RadioGroup value={selectedDeposit} onValueChange={onDepositChange}>
            <div className="space-y-3">
              {depositOptions.map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <RadioGroupItem value={option} id={option} />
                  <Label
                    htmlFor={option}
                    className="text-sm text-professional-black cursor-pointer flex-1"
                  >
                    {formatDepositRange(option)}
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