import { BrokerRecommendationWizard } from '@/components/wizard/BrokerRecommendationWizard'
import { QuestionnaireProvider } from '@/contexts/QuestionnaireContext'

export function BrokerRecommendationWizardPage() {
  const handleComplete = () => {
    console.log('Wizard completed')
  }

  const handleSaveResults = () => {
    console.log('Save results requested')
  }

  return (
    <QuestionnaireProvider>
      <BrokerRecommendationWizard
        onComplete={handleComplete}
        onSaveResults={handleSaveResults}
      />
    </QuestionnaireProvider>
  )
}
