import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WizardProgress } from './WizardProgress'
import { BrokerResultsPanel } from './BrokerResultsPanel'
import { WizardEducationalContent } from './WizardEducationalContent'
import { SaveResultModal } from '@/components/SavedResults/SaveResultModal'
import { CountryStep } from './steps/CountryStep'
import { AssetsStep } from './steps/AssetsStep'
import { ExperienceStep } from './steps/ExperienceStep'
import { FeesStep } from './steps/FeesStep'
import { FrequencyStep } from './steps/FrequencyStep'
import { DepositStep } from './steps/DepositStep'
import { ResultsStep } from './steps/ResultsStep'
import { WizardStep } from '@/types/wizard'
import type { UserPreferences } from '@/types/wizard'
import { mockQuery } from '@/brokerRecommendationMockData'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface BrokerRecommendationWizardProps {
  onComplete?: () => void
  onSaveResults?: () => void
  initialStep?: number
}

export function BrokerRecommendationWizard({
  onComplete,
  onSaveResults,
  initialStep = 1
}: BrokerRecommendationWizardProps) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showEducationalContent, setShowEducationalContent] = useState(false)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    country: 'PH', // Default to Philippines
    assets: [],
    experience: '',
    feePreference: '',
    frequency: '',
    depositAmount: ''
  })

  const totalSteps = 6

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleted(true)
      setCurrentStep(WizardStep.RESULTS)
      onComplete?.()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setIsCompleted(false)
    }
  }

  const handleSaveResults = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your search results.",
        variant: "destructive"
      })
      navigate('/auth/signin')
      return
    }
    setShowSaveModal(true)
  }

  const handleLogin = () => {
    setShowSaveModal(false)
    navigate('/auth/signin')
  }

  const handleCompare = () => {
    navigate('/compare')
  }

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...updates }))
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case WizardStep.COUNTRY:
        return (
          <CountryStep
            countries={mockQuery.countries}
            selectedCountry={userPreferences.country}
            onCountryChange={(country) => updatePreferences({ country })}
            onNext={handleNext}
          />
        )
      case WizardStep.ASSETS:
        return (
          <AssetsStep
            selectedAssets={userPreferences.assets}
            onAssetsChange={(assets) => updatePreferences({ assets })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case WizardStep.EXPERIENCE:
        return (
          <ExperienceStep
            selectedExperience={userPreferences.experience}
            onExperienceChange={(experience) => updatePreferences({ experience })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case WizardStep.FEES:
        return (
          <FeesStep
            selectedFeePreference={userPreferences.feePreference}
            onFeePreferenceChange={(feePreference) => updatePreferences({ feePreference })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case WizardStep.FREQUENCY:
        return (
          <FrequencyStep
            selectedFrequency={userPreferences.frequency}
            onFrequencyChange={(frequency) => updatePreferences({ frequency })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case WizardStep.DEPOSIT:
        return (
          <DepositStep
            selectedDeposit={userPreferences.depositAmount}
            onDepositChange={(depositAmount) => updatePreferences({ depositAmount })}
            onNext={handleNext}
            onBack={handleBack}
          />
        )
      case WizardStep.RESULTS:
        return (
          <ResultsStep
            onBack={handleBack}
            onSaveResults={handleSaveResults}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WizardProgress
        currentStep={currentStep}
        totalSteps={totalSteps}
        isCompleted={isCompleted}
      />
      
      <div className="flex">
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {renderCurrentStep()}
            
            {/* Educational Content Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => setShowEducationalContent(!showEducationalContent)}
                  className="w-full flex items-center justify-between text-left p-0 h-auto font-medium text-gray-900 hover:text-blue-600"
                >
                  <span className="flex items-center space-x-2">
                    <span>Learn About Our Process</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      FAQ & Methodology
                    </span>
                  </span>
                  {showEducationalContent ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </Button>
              </div>
              
              {showEducationalContent && (
                <div className="p-0">
                  <WizardEducationalContent 
                    currentStep={currentStep}
                    className="border-0 shadow-none"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <BrokerResultsPanel
          brokers={mockQuery.brokerRecommendations}
          isCompleted={isCompleted}
          onSaveResults={handleSaveResults}
          onCompare={handleCompare}
        />
      </div>

      <SaveResultModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        brokers={mockQuery.brokerRecommendations}
        searchCriteria={userPreferences}
        onSaveSuccess={() => {
          setShowSaveModal(false)
          toast({
            title: "Results Saved",
            description: "Your broker search results have been saved successfully."
          })
        }}
      />
    </div>
  )
}
