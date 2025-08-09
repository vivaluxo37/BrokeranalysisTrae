import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BrokerAnalysisLogo } from '@/components/common'

export function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: t('footer.sections.reviews'),
      links: [
        { name: t('footer.links.bestBrokers'), href: '/best-brokers' },
        { name: t('footer.links.brokerReviews'), href: '/broker-reviews' },
        { name: t('footer.links.comparisonTool'), href: '/tools' },
        { name: t('footer.links.allReviews'), href: '/broker-reviews' },
      ],
    },
    {
      title: t('footer.sections.tools'),
      links: [
        { name: t('footer.links.profitCalculator'), href: '/tools' },
        { name: t('footer.links.positionSizeCalculator'), href: '/tools' },
        { name: t('footer.links.marginCalculator'), href: '/tools' },
        { name: t('footer.links.marketScanner'), href: '/tools' },
      ],
    },
    {
      title: t('footer.sections.company'),
      links: [
        { name: t('footer.links.aboutUs'), href: '/about' },
        { name: t('footer.links.contact'), href: '/contact' },
        { name: t('footer.links.privacyPolicy'), href: '/privacy' },
        { name: t('footer.links.termsOfService'), href: '/terms' },
      ],
    },
    {
      title: t('footer.sections.resources'),
      links: [
        { name: t('footer.links.tradingGuide'), href: '/guide' },
        { name: t('footer.links.blog'), href: '/blog' },
        { name: t('footer.links.faq'), href: '/faq' },
        { name: t('footer.links.support'), href: '/support' },
      ],
    },
  ]

  return (
    <footer className='bg-tradez-dark border-t border-tradez-dark-secondary text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid md:grid-cols-5 gap-8'>
          {/* Logo and Description */}
          <div className='md:col-span-1'>
            <Link to='/' className='inline-block mb-4'>
              <BrokerAnalysisLogo size="md" />
            </Link>
            <p className='text-tradez-secondary text-sm leading-relaxed'>
              {t('footer.description')}
            </p>
            <div className='flex space-x-4 mt-4'>
              <a
                href='#'
                className='text-tradez-secondary hover:text-tradez-lime transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
              <a
                href='#'
                className='text-tradez-secondary hover:text-tradez-lime transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84' />
                </svg>
              </a>
              <a
                href='#'
                className='text-tradez-secondary hover:text-tradez-lime transition-colors'
              >
                <svg
                  className='w-5 h-5'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z'
                    clipRule='evenodd'
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map(section => (
            <div key={section.title}>
              <h3 className='text-sm font-semibold text-gray-100 tracking-wider uppercase mb-4'>
                {section.title}
              </h3>
              <ul className='space-y-3'>
                {section.links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className='text-tradez-secondary hover:text-tradez-lime transition-colors text-sm'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className='border-t border-tradez-dark-secondary mt-12 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <div className='text-tradez-secondary text-sm'>
              © {currentYear} BrokerAnalysis. {t('footer.copyright')}
            </div>
            <div className='flex space-x-6 mt-4 md:mt-0'>
              <Link
                to='/privacy'
                className='text-tradez-secondary hover:text-tradez-lime text-sm transition-colors'
              >
                {t('footer.links.privacyPolicy')}
              </Link>
              <Link
                to='/terms'
                className='text-tradez-secondary hover:text-tradez-lime text-sm transition-colors'
              >
                {t('footer.links.termsOfService')}
              </Link>
              <Link
                to='/cookies'
                className='text-tradez-secondary hover:text-tradez-lime text-sm transition-colors'
              >
                {t('footer.links.cookiePolicy')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}