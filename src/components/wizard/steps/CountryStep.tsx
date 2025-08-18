import { Info, ArrowRight, Globe, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useQuestionnaire } from '@/contexts/QuestionnaireContext'
import { formatStepNumber } from '@/utils/wizardFormatters'
import type { Country } from '@/types/wizard'

interface CountryStepProps {
  countries: Country[]
}

export function CountryStep({ countries }: CountryStepProps) {
  const { state, updatePreferences, nextStep } = useQuestionnaire()
  const selectedCountry = state.userPreferences.country
  const filteredBrokersCount = state.filteredBrokers.length
  const isValid = selectedCountry !== ''

  const handleCountryChange = (country: string) => {
    updatePreferences({ country })
  }

  const handleNext = () => {
    if (isValid) {
      nextStep()
    }
  }

  return (
    <Card className="bg-white border-gray-200">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-medium-grey">
              {formatStepNumber(1)}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-accent-blue">
                    <Info size={16} />
                    Why it matters
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Different countries have different broker regulations and available services</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-professional-black">
                Where do you live?
              </h2>
              {selectedCountry && filteredBrokersCount > 0 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp size={14} />
                  {filteredBrokersCount} brokers available
                </Badge>
              )}
            </div>
            <p className="text-medium-grey">
              Please select your country to see available brokers in your region
            </p>
          </div>

          <div className="space-y-4">
            <Select value={selectedCountry} onValueChange={handleCountryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center space-x-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCountry && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-green-800">
                  <Globe size={16} />
                  <span className="text-sm font-medium">
                    Great! We found {filteredBrokersCount} regulated brokers in your region.
                  </span>
                </div>
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={!isValid}
              className="w-full bg-accent-blue hover:bg-accent-blue/90"
              size="lg"
            >
              Continue to trading preferences
              <ArrowRight size={20} />
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Go ahead! Future you will be grateful for starting this tool!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
