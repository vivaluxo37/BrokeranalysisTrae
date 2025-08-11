import { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Language {
  code: string
  name: string
  nativeName: string
  flag: string
}

// Top 15 most spoken languages in the world
const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇹🇿' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
]

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile'
  className?: string
}

export function LanguageSwitcher({ variant = 'desktop', className = '' }: LanguageSwitcherProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language)
    // Here you would typically integrate with your i18n solution
    // For now, we'll just update the state
    console.log('Language changed to:', language.code)
  }

  if (variant === 'mobile') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="text-light-grey text-xs font-medium mb-2 uppercase tracking-wide">
          Language
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {languages.slice(0, 8).map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                selectedLanguage.code === language.code
                  ? 'bg-accent-blue/10 text-pure-white border border-accent-blue'
                  : 'text-light-grey hover:text-pure-white hover:bg-medium-grey/20'
              }`}
            >
              <span className="text-base">{language.flag}</span>
              <span className="text-xs">{language.name}</span>
            </button>
          ))}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-light-grey hover:text-pure-white text-sm justify-start"
            >
              <Globe className="w-4 h-4 mr-2" />
              More Languages
              <ChevronDown className="w-4 h-4 ml-auto" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            className="bg-charcoal-grey border-medium-grey w-56"
          >
            {languages.slice(8).map((language) => (
              <DropdownMenuItem 
                key={language.code}
                onClick={() => handleLanguageChange(language)}
                className="text-pure-white hover:bg-medium-grey/20 cursor-pointer"
              >
                <span className="mr-3">{language.flag}</span>
                <div className="flex flex-col">
                  <span className="text-sm">{language.name}</span>
                  <span className="text-xs text-light-grey">{language.nativeName}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`text-light-grey hover:text-pure-white text-sm h-8 ${className}`}
          aria-label="Select language"
        >
          <span className="mr-1">{selectedLanguage.flag}</span>
          <Globe className="w-4 h-4 mr-1" />
          <span className="hidden sm:inline">{selectedLanguage.name}</span>
          <ChevronDown className="w-3 h-3 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-charcoal-grey border-medium-grey w-64 max-h-80 overflow-y-auto"
      >
        {languages.map((language) => (
          <DropdownMenuItem 
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`text-pure-white hover:bg-medium-grey/20 cursor-pointer ${
              selectedLanguage.code === language.code ? 'bg-accent-blue/10' : ''
            }`}
          >
            <span className="mr-3 text-base">{language.flag}</span>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">{language.name}</span>
              <span className="text-xs text-light-grey">{language.nativeName}</span>
            </div>
            {selectedLanguage.code === language.code && (
              <div className="w-2 h-2 bg-accent-blue rounded-full ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}