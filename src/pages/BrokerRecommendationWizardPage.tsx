import { BrokerRecommendationWizard } from '@/components/wizard/BrokerRecommendationWizard'

export function BrokerRecommendationWizardPage() {
  const handleComplete = () => {
    console.log('Wizard completed')
  }

  const handleSaveResults = () => {
    console.log('Save results requested')
  }

  return (
    <BrokerRecommendationWizard
      onComplete={handleComplete}
      onSaveResults={handleSaveResults}
    />
  )
}