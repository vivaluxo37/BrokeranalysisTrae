import { useState } from 'react'
import { Globe, ChevronDown, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLanguageSwitcher } from '../../hooks/useLanguageManagement'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile'
  className?: string
}

export function LanguageSwitcher({ variant = 'desktop', className = '' }: LanguageSwitcherProps) {
  const {
    availableLanguages,
    currentLanguage,
    isLoading,
    error,
    isChanging,
    changeLanguage
  } = useLanguageSwitcher()
  
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = async (languageCode: string) => {
    try {
      await changeLanguage(languageCode)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <Button variant="ghost" size="sm" disabled className={cn('gap-2', className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="hidden sm:inline">Loading...</span>
      </Button>
    )
  }

  // Show error state
  if (error) {
    return (
      <Button variant="ghost" size="sm" disabled className={cn('gap-2 text-destructive', className)}>
        <AlertCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Error</span>
      </Button>
    )
  }

  if (variant === 'mobile') {
    return (
      <div className={cn('w-full', className)}>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between h-12 px-4 text-left font-normal"
              disabled={isChanging}
            >
              <div className="flex items-center gap-3">
                {isChanging ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="text-xl">{currentLanguage?.flag || '🌐'}</span>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {currentLanguage?.nativeName || 'Loading...'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {currentLanguage?.label || ''}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {availableLanguages.map((language) => (
              <DropdownMenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className="flex items-center gap-3 px-4 py-3"
                disabled={isChanging}
              >
                <span className="text-xl">{language.flag || '🌐'}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{language.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{language.label}</span>
                </div>
                {currentLanguage?.code === language.code && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Desktop variant
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn('gap-2', className)}
          disabled={isChanging}
        >
          {isChanging ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">{currentLanguage?.flag || '🌐'}</span>
          <span className="hidden md:inline">
            {currentLanguage?.nativeName || 'Language'}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2 px-3 py-2"
            disabled={isChanging}
          >
            <span>{language.flag || '🌐'}</span>
            <span className="flex-1">{language.nativeName}</span>
            {currentLanguage?.code === language.code && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
