import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  canProceed: boolean
  onPrevious: () => void
  onNext: () => void
  isLoading?: boolean
  showStepInfo?: boolean
}

export function WizardNavigation({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  onPrevious, 
  onNext,
  isLoading = false,
  showStepInfo = true
}: WizardNavigationProps) {
  const isFirstStep = currentStep === 1
  const isLastStep = currentStep === totalSteps
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && !isFirstStep) {
        event.preventDefault()
        onPrevious()
      } else if (event.key === 'ArrowRight' && canProceed && !isLoading) {
        event.preventDefault()
        onNext()
      } else if (event.key === 'Enter' && canProceed && !isLoading) {
        event.preventDefault()
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isFirstStep, canProceed, isLoading, onPrevious, onNext])

  return (
    <div className="bg-white border-t border-gray-200 p-6">
      {/* Step Information */}
      {showStepInfo && (
        <div className="flex items-center justify-center mb-4">
          <div className="text-sm text-gray-600">
            Step <span className="font-semibold text-blue-600">{currentStep}</span> of {totalSteps}
            {canProceed && (
              <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />
            )}
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        {/* Previous Button */}
        <Button
          onClick={onPrevious}
          disabled={isFirstStep || isLoading}
          variant="outline"
          size="lg"
          className={cn(
            "min-w-[120px] transition-all duration-200",
            isFirstStep 
              ? "opacity-50 cursor-not-allowed" 
              : "hover:bg-gray-50 hover:border-gray-300"
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        {/* Step Counter (Mobile) */}
        <div className="flex items-center space-x-2 md:hidden">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-200",
                i + 1 <= currentStep ? "bg-blue-600" : "bg-gray-300"
              )}
            />
          ))}
        </div>
        
        {/* Next/Complete Button */}
        <Button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          size="lg"
          className={cn(
            "min-w-[120px] transition-all duration-200",
            isLastStep 
              ? "bg-green-600 hover:bg-green-700 text-white" 
              : "bg-blue-600 hover:bg-blue-700 text-white",
            !canProceed && "opacity-50 cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {isLastStep ? 'Get Results' : 'Next'}
              {isLastStep ? (
                <CheckCircle className="w-4 h-4 ml-2" />
              ) : (
                <ArrowRight className="w-4 h-4 ml-2" />
              )}
            </>
          )}
        </Button>
      </div>
      
      {/* Keyboard Shortcuts Hint */}
      <div className="flex justify-center mt-4">
        <div className="text-xs text-gray-400 flex items-center space-x-4">
          <span className="flex items-center">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">←</kbd>
            <span className="ml-1">Previous</span>
          </span>
          <span className="flex items-center">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">→</kbd>
            <span className="ml-1">Next</span>
          </span>
          <span className="flex items-center">
            <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">Enter</kbd>
            <span className="ml-1">Continue</span>
          </span>
        </div>
      </div>
    </div>
  )
}
