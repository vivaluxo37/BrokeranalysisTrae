import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { SeoHead } from '@/components/common'
import { mockQuery, mockRootProps } from '@/additionalPagesMockData'
import {
  AssetClassSelector,
  BrokerRecommendationCard,
  PreferencesSummary,
  RadioSelector,
  WizardNavigation,
  WizardProgress
} from '@/components/wizard'

interface WizardState {
  assetClass: string[]
  experience: string
  deposit: string
  region: string
}

export function BrokerWizardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardState, setWizardState] = useState<WizardState>({
    assetClass: [],
    experience: '',
    deposit: '',
    region: ''
  })
  const [showResults, setShowResults] = useState(false)

  const steps = mockRootProps.brokerWizardSteps
  const totalSteps = steps.length

  const updateWizardState = (key: keyof WizardState, value: string | string[]) => {
    setWizardState(prev => ({ ...prev, [key]: value }))
  }

  const handleAssetClassToggle = (value: string) => {
    const currentAssets = wizardState.assetClass
    if (currentAssets.includes(value)) {
      updateWizardState('assetClass', currentAssets.filter(asset => asset !== value))
    } else {
      updateWizardState('assetClass', [...currentAssets, value])
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardState.assetClass.length > 0
      case 2:
        return wizardState.experience !== ''
      case 3:
        return wizardState.deposit !== ''
      case 4:
        return wizardState.region !== ''
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStartOver = () => {
    setCurrentStep(1)
    setWizardState({
      assetClass: [],
      experience: '',
      deposit: '',
      region: ''
    })
    setShowResults(false)
  }

  const getRecommendedBrokers = () => {
    // Filter brokers based on wizard preferences
    return mockQuery.brokerDirectory.brokers.slice(0, 3)
  }

  if (showResults) {
    const recommendedBrokers = getRecommendedBrokers()
    
    return (
      <Layout>
        <div className="min-h-screen bg-professional-black">
          <SeoHead 
            title="Your Recommended Brokers | BrokerAnalysis"
            description="Personalized broker recommendations based on your trading preferences and experience level."
          />

          <div className="content-container py-8">
            <div className="max-w-4xl mx-auto">
              {/* Success Header */}
              <div className="text-center mb-8">
                <CheckCircle className="w-16 h-16 text-accent-blue mx-auto mb-4" />
                <h1 className="text-section-title text-pure-white mb-4">
                  Your Recommended Brokers
                </h1>
                <p className="text-subtitle">
                  Based on your preferences, we've found the perfect brokers for you.
                </p>
              </div>

              {/* Preferences Summary */}
              <PreferencesSummary wizardState={wizardState} />

              {/* Recommended Brokers */}
              <div className="space-y-6 mb-8">
                {recommendedBrokers.map((broker, index) => (
                  <BrokerRecommendationCard 
                    key={broker.id} 
                    broker={broker} 
                    index={index} 
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="text-center space-y-4">
                <Button onClick={handleStartOver} className="btn-professional-secondary">
                  Start Over
                </Button>
                <div>
                  <Link 
                    to="/brokers" 
                    className="text-light-grey hover:text-pure-white transition-colors"
                  >
                    Browse All Brokers
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  const currentStepData = steps[currentStep - 1]

  return (
    <Layout>
      <div className="min-h-screen bg-professional-black">
        <SeoHead 
          title="Find My Broker | BrokerAnalysis"
          description="Answer a few questions to get personalized broker recommendations based on your trading needs."
        />

        <div className="content-container py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-section-title text-pure-white mb-4">
                Find My Broker
              </h1>
              <p className="text-subtitle">
                Answer a few questions to get personalized broker recommendations.
              </p>
            </div>

            {/* Progress */}
            <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />

            {/* Step Content */}
            <Card className="professional-card p-8 mb-8">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl text-pure-white">
                  {currentStepData.title}
                </CardTitle>
                <CardDescription className="text-light-grey">
                  {currentStepData.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 1 ? (
                  <AssetClassSelector
                    options={currentStepData.options}
                    selectedAssets={wizardState.assetClass}
                    onToggle={handleAssetClassToggle}
                  />
                ) : (
                  <RadioSelector
                    options={currentStepData.options}
                    value={
                      currentStep === 2 ? wizardState.experience :
                      currentStep === 3 ? wizardState.deposit :
                      wizardState.region
                    }
                    onValueChange={(value) => {
                      if (currentStep === 2) updateWizardState('experience', value)
                      else if (currentStep === 3) updateWizardState('deposit', value)
                      else updateWizardState('region', value)
                    }}
                  />
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={totalSteps}
              canProceed={canProceed()}
              onPrevious={handlePrevious}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}
