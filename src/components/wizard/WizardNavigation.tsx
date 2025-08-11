import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface WizardNavigationProps {
  currentStep: number
  totalSteps: number
  canProceed: boolean
  onPrevious: () => void
  onNext: () => void
}

export function WizardNavigation({ 
  currentStep, 
  totalSteps, 
  canProceed, 
  onPrevious, 
  onNext 
}: WizardNavigationProps) {
  return (
    <div className="flex justify-between">
      <Button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="btn-professional-secondary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Previous
      </Button>
      
      <Button
        onClick={onNext}
        disabled={!canProceed}
        className="btn-professional-primary"
      >
        {currentStep === totalSteps ? 'Get Results' : 'Next'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}