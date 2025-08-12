import { Info, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { formatStepNumber } from '@/utils/wizardFormatters'
import { Country } from '@/types/wizard'

interface CountryStepProps {
  countries: Country[]
  selectedCountry: string
  onCountryChange: (country: string) => void
  onNext: () => void
}

export function CountryStep({ 
  countries, 
  selectedCountry, 
  onCountryChange, 
  onNext 
}: CountryStepProps) {
  const isValid = selectedCountry !== ''

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
            <h2 className="text-2xl font-bold text-professional-black">
              Where do you live?
            </h2>
            <p className="text-medium-grey">
              Please select your country
            </p>
          </div>

          <div className="space-y-4">
            <Select value={selectedCountry} onValueChange={onCountryChange}>
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

            <Button
              onClick={onNext}
              disabled={!isValid}
              className="w-full bg-accent-blue hover:bg-accent-blue/90"
              size="lg"
            >
              Start matching
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
