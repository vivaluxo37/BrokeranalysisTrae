import { useTranslation } from 'react-i18next'

interface PlaceholderPageProps {
  translationKey: 'contact' | 'privacy' | 'terms'
}

export function PlaceholderPage({ translationKey }: PlaceholderPageProps) {
  const { t } = useTranslation()

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>
          {t(`placeholders.${translationKey}.title`)}
        </h1>
        <p className='text-xl text-muted-foreground'>
          {t(`placeholders.${translationKey}.description`)}
        </p>
      </div>
    </div>
  )
}

// 404 Error Page component
export function NotFoundPage() {
  const { t } = useTranslation()

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>
          {t('errors.pageNotFound.title')}
        </h1>
        <p className='text-xl text-muted-foreground'>
          {t('errors.pageNotFound.description')}
        </p>
      </div>
    </div>
  )
}