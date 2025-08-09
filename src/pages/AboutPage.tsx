import { useTranslation } from '@/i18n'

export function AboutPage() {
  const { t } = useTranslation()

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>{t('about.title')}</h1>
        <p className='text-xl text-muted-foreground'>
          {t('about.description')}
        </p>
      </div>
    </div>
  )
}