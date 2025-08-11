import { Progress } from '@/components/ui/progress'

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100)

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-light-grey mb-2">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{progressPercentage}% Complete</span>
      </div>
      <Progress 
        value={progressPercentage} 
        className="h-2 bg-charcoal-grey"
      />
    </div>
  )
}