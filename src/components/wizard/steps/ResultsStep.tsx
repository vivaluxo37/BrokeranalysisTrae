import { ArrowLeft, PartyPopper, TrendingUp, Star, Users, Badge as BadgeIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useQuestionnaire } from '@/contexts/QuestionnaireContext'

interface ResultsStepProps {}

export function ResultsStep({}: ResultsStepProps) {
  const { state, previousStep, saveResults } = useQuestionnaire()
  const filteredBrokersCount = state.filteredBrokers.length

  const handleBack = () => {
    previousStep()
  }

  const handleSaveResults = () => {
    saveResults()
  }
  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <PartyPopper className="w-12 h-12 text-green-600" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-accent-blue/10 text-accent-blue">
                <TrendingUp size={14} className="mr-1" />
                {filteredBrokersCount} brokers found
              </Badge>
            </div>
            <h2 className="text-3xl font-bold text-professional-black">
              You're All Set!
            </h2>
            <p className="text-lg text-medium-grey max-w-md mx-auto">
              We found {filteredBrokersCount} brokers that match your preferences. Click on a broker to learn more or save your personalized list for later.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            <Button
              onClick={handleSaveResults}
              className="flex-1 sm:flex-none bg-accent-blue hover:bg-accent-blue/90"
            >
              <Star size={16} className="mr-2" />
              Save my toplist
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
