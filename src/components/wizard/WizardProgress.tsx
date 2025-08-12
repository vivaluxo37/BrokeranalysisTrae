import { Progress } from '@/components/ui/progress'
import { formatStepTitle } from '@/utils/wizardFormatters'

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  isCompleted: boolean
}

export function WizardProgress({ currentStep, totalSteps, isCompleted }: WizardProgressProps) {
  const progressValue = isCompleted ? 100 : ((currentStep - 1) / totalSteps) * 100

  return (
    <div className="w-full bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-professional-black">
          {isCompleted ? 'Basic Preferences (6/6)' : formatStepTitle(currentStep, totalSteps)}
        </span>
        <span className="text-sm font-medium text-accent-blue">
          {isCompleted ? 'Final result' : 'Final result'}
        </span>
      </div>
      
      <div className="space-y-2">
        <Progress 
          value={progressValue} 
          className="h-2"
        />
        <div className="flex justify-between">
          {Array.from({ length: totalSteps + 1 }, (_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i <= currentStep || isCompleted
                  ? 'bg-accent-blue'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
