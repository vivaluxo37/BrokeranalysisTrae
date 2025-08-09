import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export function CookieConsentBanner() {
  const { t } = useTranslation()
  const [consentGiven, setConsentGiven] = useState(false)

  if (consentGiven) return null

  return (
    <div className='fixed bottom-0 w-full bg-gray-800 text-white p-4 text-center'>
      <p className='mb-2'>{t('cookieConsent.message')}</p>
      <button
        onClick={() => setConsentGiven(true)}
        className='bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded'
      >
        {t('cookieConsent.acceptButton')}
      </button>
    </div>
  )
}