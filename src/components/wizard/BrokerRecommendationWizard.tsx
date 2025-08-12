import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { WizardProgress } from './WizardProgress'
import { BrokerResultsPanel } from './BrokerResultsPanel'
import { SaveModal } from './SaveModal'
import { CountryStep } from './steps/CountryStep'
import { AssetsStep } from './steps/AssetsStep'
import { ExperienceStep } from './steps/ExperienceStep'
import { FeesStep } from './steps/FeesStep'
import { FrequencyStep } from './steps/FrequencyStep'
import { DepositStep } from './steps/DepositStep'
import { ResultsStep } from './steps/ResultsStep'
import { WizardStep, UserPreferences } from '@/types/wizard'
import { mockQuery } from '@/brokerRecommendationMockData'

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
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
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
          <div className="max-w-2xl mx-auto">
            {renderCurrentStep()}
          </div>
        </div>
        
        <BrokerResultsPanel
          brokers={mockQuery.brokerRecommendations}
          isCompleted={isCompleted}
          onSaveResults={handleSaveResults}
          onCompare={handleCompare}
        />
      </div>

      <SaveModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}