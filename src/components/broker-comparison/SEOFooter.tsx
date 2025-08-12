import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react'

export function SEOFooter() {
  const footerSections = [
    {
      title: 'Broker Reviews',
      links: [
        { label: 'Interactive Brokers Review', href: '/brokers/interactive-brokers' },
        { label: 'IG Markets Review', href: '/brokers/ig-markets' },
        { label: 'Plus500 Review', href: '/brokers/plus500' },
        { label: 'eToro Review', href: '/brokers/etoro' },
        { label: 'XTB Review', href: '/brokers/xtb' },
        { label: 'View All Reviews', href: '/brokers' }
      ]
    },
    {
      title: 'Compare Brokers',
      links: [
        { label: 'Interactive Brokers vs IG', href: '/compare/interactive-brokers-vs-ig' },
        { label: 'Plus500 vs eToro', href: '/compare/plus500-vs-etoro' },
        { label: 'Best Forex Brokers', href: '/best/forex-brokers' },
        { label: 'Best Stock Brokers', href: '/best/stock-brokers' },
        { label: 'Best Crypto Brokers', href: '/best/crypto-brokers' },
        { label: 'Broker Comparison Tool', href: '/compare' }
      ]
    },
    {
      title: 'Country Guides',
      links: [
        { label: 'Best Brokers UK', href: '/country/uk/brokers' },
        { label: 'Best Brokers USA', href: '/country/usa/brokers' },
        { label: 'Best Brokers Australia', href: '/country/australia/brokers' },
        { label: 'Best Brokers Canada', href: '/country/canada/brokers' },
        { label: 'Best Brokers Germany', href: '/country/germany/brokers' },
        { label: 'View All Countries', href: '/countries' }
      ]
    },
    {
      title: 'Tools & Resources',
      links: [
        { label: 'Fee Calculator', href: '/tools/fee-calculator' },
        { label: 'Spread Comparison', href: '/tools/spread-comparison' },
        { label: 'Trading Glossary', href: '/education/glossary' },
        { label: 'How We Review', href: '/methodology' },
        { label: 'Market News', href: '/news' },
        { label: 'Educational Guides', href: '/education' }
      ]
    }
  ]

  const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Contact Us', href: '/contact' }
  ]

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/brokeranalysis', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/brokeranalysis', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/brokeranalysis', label: 'LinkedIn' },
    { icon: Youtube, href: 'https://youtube.com/brokeranalysis', label: 'YouTube' }
  ]

  return (
    <footer className="bg-charcoal-grey text-white">
      {/* Main Footer Content */}
      <div className="py-16">
        <div className="content-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-accent-blue rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="text-white font-bold text-xl">BrokerAnalysis</span>
              </div>
              
              <p className="text-light-grey mb-6 leading-relaxed">
                Independent broker reviews and comparisons to help traders find the best brokers for their needs.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-accent-blue" />
                  <span className="text-light-grey">contact@brokeranalysis.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-accent-blue" />
                  <span className="text-light-grey">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-accent-blue" />
                  <span className="text-light-grey">New York, NY</span>
                </div>
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-white mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-light-grey hover:text-white transition-colors text-sm"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-medium-grey py-8">
        <div className="content-container">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6">
              {legalLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-light-grey hover:text-white transition-colors text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-light-grey hover:text-white transition-colors"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright and Disclaimer */}
          <div className="mt-8 pt-8 border-t border-medium-grey">
            <div className="text-center lg:text-left space-y-4">
              <p className="text-sm text-light-grey">
                © 2025 BrokerAnalysis. All rights reserved.
              </p>
              
              <div className="text-xs text-light-grey leading-relaxed max-w-4xl">
                <p className="mb-2">
                  <strong>Risk Warning:</strong> Trading involves substantial risk and may result in the loss of your invested capital. 
                  You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved. 
                  Before trading, please take into consideration your level of experience, investment objectives, and seek independent financial advice if necessary.
                </p>
                
                <p className="mb-2">
                  <strong>Disclaimer:</strong> BrokerAnalysis provides independent broker reviews and comparisons. 
                  We may receive compensation from some brokers, but this does not influence our reviews or rankings. 
                  All information is provided for educational purposes only and should not be considered as investment advice.
                </p>
                
                <p>
                  <strong>Regulatory Notice:</strong> BrokerAnalysis is not a licensed broker or financial advisor. 
                  We recommend that you verify any broker's regulatory status before opening an account. 
                  Always ensure that any broker you choose is properly regulated in your jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}