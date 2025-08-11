import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface Option {
  value: string
  label: string
  description?: string
}

interface RadioSelectorProps {
  options: Option[]
  value: string
  onValueChange: (value: string) => void
}

export function RadioSelector({ options, value, onValueChange }: RadioSelectorProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="space-y-4"
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-3 p-4 border border-medium-grey rounded-lg hover:border-light-grey transition-colors">
          <RadioGroupItem 
            value={option.value} 
            id={option.value}
            className="border-medium-grey text-pure-white"
          />
          <Label 
            htmlFor={option.value} 
            className="flex-1 cursor-pointer"
          >
            <div className="text-pure-white font-medium">{option.label}</div>
            {option.description && (
              <div className="text-light-grey text-sm">{option.description}</div>
            )}
          </Label>
        </div>
      ))}
    </RadioGroup>
  )
}
