import { Info, ArrowLeft, ArrowRight, TrendingUp, GraduationCap, Award } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useQuestionnaire } from '@/contexts/QuestionnaireContext'
import { formatStepNumber } from '@/utils/wizardFormatters'
import { TradingExperience } from '@/types/wizard'

interface ExperienceStepProps {}

export function ExperienceStep({}: ExperienceStepProps) {
  const { state, updatePreferences, nextStep, previousStep } = useQuestionnaire()
  const selectedExperience = state.userPreferences.experience
  const filteredBrokersCount = state.filteredBrokers.length

  const experienceOptions = [
    { 
      value: TradingExperience.FIRST_TIMER, 
      label: 'I am a first-timer with no experience',
      icon: GraduationCap,
      description: 'Perfect for beginners with educational resources'
    },
    { 
      value: TradingExperience.SIMPLE_TRANSACTIONS, 
      label: "I've already made a few simple transactions",
      icon: TrendingUp,
      description: 'Great for building on basic trading knowledge'
    },
    { 
      value: TradingExperience.EXPERIENCED, 
      label: 'I have experience with various products and different trading strategies',
      icon: Award,
      description: 'Advanced tools and features available'
    },
    { 
      value: TradingExperience.PROFESSIONAL, 
      label: 'I am a professional and fully confident',
      icon: Award,
      description: 'Professional-grade platforms and tools'
    }
  ]

  const handleExperienceChange = (experience: string) => {
    updatePreferences({ experience })
  }

  const handleNext = () => {
    nextStep()
  }

  const handleBack = () => {
    previousStep()
  }

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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-professional-black">
                How familiar are you with trading and investing?
              </h2>
              {selectedExperience && filteredBrokersCount > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  {filteredBrokersCount} suitable brokers
                </Badge>
              )}
            </div>
            <p className="text-medium-grey">
              Your experience level helps us recommend brokers with the right features and complexity for you.
            </p>
          </div>

          <RadioGroup value={selectedExperience} onValueChange={handleExperienceChange}>
            <div className="space-y-3">
              {experienceOptions.map((option) => {
                const IconComponent = option.icon
                const isSelected = selectedExperience === option.value
                return (
                  <div key={option.value} className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors ${
                    isSelected ? 'border-accent-blue bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <IconComponent size={18} className={isSelected ? 'text-accent-blue' : 'text-gray-500'} />
                        <Label
                          htmlFor={option.value}
                          className="text-sm text-professional-black cursor-pointer font-medium"
                        >
                          {option.label}
                        </Label>
                      </div>
                      <p className="text-xs text-medium-grey mt-1 ml-6">
                        {option.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </RadioGroup>

          {selectedExperience && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800">
                <GraduationCap size={16} />
                <span className="text-sm font-medium">
                  Excellent! We'll match you with brokers that suit your experience level.
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
              Continue to trading style
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
