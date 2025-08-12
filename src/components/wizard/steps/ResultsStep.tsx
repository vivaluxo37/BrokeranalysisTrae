import { ArrowLeft, PartyPopper } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ResultsStepProps {
  onBack: () => void
  onSaveResults: () => void
}

export function ResultsStep({ onBack, onSaveResults }: ResultsStepProps) {
  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <PartyPopper className="w-12 h-12 text-green-600" />
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-professional-black">
              You're All Set!
            </h2>
            <p className="text-lg text-medium-grey max-w-md mx-auto">
              Click on a broker now to learn more or open an account, or save your list for later.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex-1 sm:flex-none"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            <Button
              onClick={onSaveResults}
              className="flex-1 sm:flex-none bg-accent-blue hover:bg-accent-blue/90"
            >
              Save my toplist
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}