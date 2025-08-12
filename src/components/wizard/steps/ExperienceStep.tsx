import { Info, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatStepNumber } from '@/utils/wizardFormatters'
import { TradingExperience } from '@/types/wizard'

interface ExperienceStepProps {
  selectedExperience: string
  onExperienceChange: (experience: string) => void
  onNext: () => void
  onBack: () => void
}

export function ExperienceStep({ 
  selectedExperience, 
  onExperienceChange, 
  onNext, 
  onBack 
}: ExperienceStepProps) {
  const experienceOptions = [
    { value: TradingExperience.FIRST_TIMER, label: 'I am a first-timer with no experience' },
    { value: TradingExperience.SIMPLE_TRANSACTIONS, label: "I've already made a few simple transactions" },
    { value: TradingExperience.EXPERIENCED, label: 'I have experience with various products and different trading strategies' },
    { value: TradingExperience.PROFESSIONAL, label: 'I am a professional and fully confident' }
  ]

  const isValid = selectedExperience !== ''

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-medium-grey">
              {formatStepNumber(3)}
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
                  <p>Your experience level helps us recommend brokers with appropriate features</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-professional-black">
              How familiar are you with trading and investing?
            </h2>
          </div>

          <RadioGroup value={selectedExperience} onValueChange={onExperienceChange}>
            <div className="space-y-3">
              {experienceOptions.map((option) => (
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

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Keep it up! A custom-fit broker can greatly boost your long-term gains.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}