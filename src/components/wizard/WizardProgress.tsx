import { Progress } from '@/components/ui/progress'
import { formatStepTitle } from '@/utils/wizardFormatters'
import { CheckCircle, Circle, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WizardProgressProps {
  currentStep: number
  totalSteps: number
  isCompleted: boolean
}

const stepLabels = [
  'Country',
  'Assets',
  'Experience',
  'Fees',
  'Frequency',
  'Deposit',
  'Results'
]

export function WizardProgress({ currentStep, totalSteps, isCompleted }: WizardProgressProps) {
  const progressValue = isCompleted ? 100 : ((currentStep - 1) / totalSteps) * 100
  const currentStepIndex = currentStep - 1

  return (
    <div className="w-full bg-white border-b border-gray-200 p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {isCompleted ? 'Recommendations Ready!' : `Step ${currentStep} of ${totalSteps}`}
          </h2>
          <p className="text-sm text-gray-600">
            {isCompleted 
              ? 'Your personalized broker recommendations are ready'
              : stepLabels[currentStepIndex] || 'Getting your preferences'
            }
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(progressValue)}%
          </div>
          <div className="text-xs text-gray-500">Complete</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="space-y-4">
        <Progress 
          value={progressValue} 
          className="h-3 bg-gray-100"
        />
        
        {/* Step Indicators */}
        <div className="flex justify-between items-center">
          {Array.from({ length: totalSteps + 1 }, (_, i) => {
            const isActive = i === currentStep
            const isStepCompleted = i < currentStep || isCompleted
            const isFuture = i > currentStep && !isCompleted
            
            return (
              <div key={i} className="flex flex-col items-center space-y-2">
                {/* Step Circle */}
                <div className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300",
                  {
                    "bg-blue-600 border-blue-600 text-white shadow-lg scale-110": isActive,
                    "bg-green-500 border-green-500 text-white": isStepCompleted && !isActive,
                    "bg-white border-gray-300 text-gray-400": isFuture
                  }
                )}>
                  {isStepCompleted && !isActive ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isActive ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  
                  {/* Active Step Pulse Animation */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-20" />
                  )}
                </div>
                
                {/* Step Label */}
                <div className={cn(
                  "text-xs font-medium text-center transition-colors duration-200",
                  {
                    "text-blue-600": isActive,
                    "text-green-600": isStepCompleted && !isActive,
                    "text-gray-400": isFuture
                  }
                )}>
                  {stepLabels[i] || `Step ${i + 1}`}
                </div>
                
                {/* Connection Line */}
                {i < totalSteps && (
                  <ArrowRight className={cn(
                    "absolute top-3 left-8 w-4 h-4 transition-colors duration-200",
                    {
                      "text-green-500": isStepCompleted,
                      "text-blue-500": isActive,
                      "text-gray-300": isFuture
                    }
                  )} />
                )}
              </div>
            )
          })}
        </div>
        
        {/* Progress Summary */}
        <div className="flex justify-between text-xs text-gray-500 pt-2">
          <span>
            {isCompleted ? 'All steps completed' : `${currentStep - 1} of ${totalSteps} steps completed`}
          </span>
          <span>
            {isCompleted ? 'Ready to view results' : `${totalSteps - currentStep + 1} steps remaining`}
          </span>
        </div>
      </div>
    </div>
  )
}
