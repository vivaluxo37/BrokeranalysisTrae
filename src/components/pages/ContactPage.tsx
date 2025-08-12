import { useTranslation } from 'react-i18next'

export function ContactPage() {
  const { t } = useTranslation()

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold mb-4'>{t('contact.title')}</h1>
        <p className='text-xl text-muted-foreground'>
          {t('contact.description')}
        </p>
      </div>
    </div>
  )
}
