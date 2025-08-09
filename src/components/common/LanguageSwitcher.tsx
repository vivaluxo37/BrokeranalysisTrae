import { useTranslation } from 'react-i18next'
import { supportedLanguages } from '../../i18n/config'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, Globe } from 'lucide-react'

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'mobile'
  showLabel?: boolean
}

export function LanguageSwitcher({
  variant = 'default',
  showLabel = false,
}: LanguageSwitcherProps) {
  const { i18n, t } = useTranslation()

  const currentLanguage =
    supportedLanguages.find(lang => lang.code === i18n.language) ||
    supportedLanguages[0]

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)

    // Update HTML lang attribute
    document.documentElement.lang = langCode

    // Optional: Save to localStorage (already handled by i18next detection)
    localStorage.setItem('i18nextLng', langCode)
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            size='sm'
            className='flex items-center space-x-1'
            aria-label={t('header.language')}
          >
            <span className='text-lg'>{currentLanguage.flag}</span>
            <span className='text-xs font-medium'>
              {currentLanguage.code.toUpperCase()}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          {supportedLanguages.map(lang => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className='flex items-center justify-between cursor-pointer'
            >
              <div className='flex items-center space-x-2'>
                <span className='text-lg'>{lang.flag}</span>
                <span className='text-sm'>{lang.nativeName}</span>
              </div>
              {i18n.language === lang.code && (
                <Check className='w-4 h-4 text-primary' />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === 'mobile') {
    return (
      <div className='space-y-2'>
        <div className='text-sm font-medium text-muted-foreground px-4'>
          {t('header.language')}
        </div>
        <div className='grid grid-cols-2 gap-2 px-4'>
          {supportedLanguages.map(lang => (
            <Button
              key={lang.code}
              variant={i18n.language === lang.code ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleLanguageChange(lang.code)}
              className='flex items-center space-x-2 justify-start'
            >
              <span className='text-base'>{lang.flag}</span>
              <span className='text-xs'>{lang.code.toUpperCase()}</span>
            </Button>
          ))}
        </div>
        <DropdownMenuSeparator />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size={showLabel ? 'default' : 'icon'}
          aria-label={t('header.language')}
          className='flex items-center space-x-2'
        >
          <Globe className='w-4 h-4' />
          {showLabel && (
            <>
              <span className='hidden sm:inline'>
                {currentLanguage.nativeName}
              </span>
              <span className='sm:hidden text-xs'>
                {currentLanguage.code.toUpperCase()}
              </span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-52'>
        <div className='px-2 py-1.5 text-xs font-medium text-muted-foreground'>
          {t('header.language')}
        </div>
        <DropdownMenuSeparator />
        {supportedLanguages.map(lang => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className='flex items-center justify-between cursor-pointer py-2'
          >
            <div className='flex items-center space-x-3'>
              <span className='text-lg'>{lang.flag}</span>
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>{lang.name}</span>
                <span className='text-xs text-muted-foreground'>
                  {lang.nativeName}
                </span>
              </div>
            </div>
            {i18n.language === lang.code && (
              <Check className='w-4 h-4 text-primary' />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LanguageSwitcher