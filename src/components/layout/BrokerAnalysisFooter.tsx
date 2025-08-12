import { Link } from 'react-router-dom'
import { BrokerAnalysisLogo } from '@/components/common'
import { Linkedin, Shield, Twitter, Youtube } from 'lucide-react'

export function BrokerAnalysisFooter() {
  const footerSections = [
    {
      title: 'Brokers',
      links: [
        { name: 'All Brokers', href: '/brokers' },
        { name: 'Compare Brokers', href: '/compare' },
        { name: 'Top-Rated', href: '/brokers/top-rated' },
        { name: 'Submit Review', href: '/reviews/write' },
      ]
    },
    {
      title: 'Research & News',
      links: [
        { name: 'Market News', href: '/news/market' },
        { name: 'Analysis', href: '/news/analysis' },
        { name: 'Regulatory Alerts', href: '/news/regulatory' },
        { name: 'Blog', href: '/blog' },
      ]
    },
    {
      title: 'Education & Tools',
      links: [
        { name: "Beginner's Hub", href: '/education/beginners' },
        { name: 'Technical Analysis', href: '/education/technical-analysis' },
        { name: 'Risk Management', href: '/education/risk-management' },
        { name: 'Calculators', href: '/tools' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Partners', href: '/partners' },
        { name: 'Contact Us', href: '/contact' },
      ]
    },
    {
      title: 'Legal & Social',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Use', href: '/terms' },
        { name: 'Cookie Settings', href: '/cookies' },
      ]
    }
  ]

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/brokeranalysis', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/brokeranalysis', icon: Linkedin },
    { name: 'YouTube', href: 'https://youtube.com/brokeranalysis', icon: Youtube },
  ]

  return (
    <footer 
      id="footer"
      className="w-full bg-charcoal-grey border-t border-medium-grey mt-24"
      role="contentinfo"
      aria-label="Site footer"
      tabIndex={-1}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <div className="mb-4">
              <BrokerAnalysisLogo 
                size="md" 
                className="focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-charcoal-grey" 
                tabIndex={0}
                aria-label="BrokerAnalysis homepage"
              />
            </div>
            <p className="text-light-grey text-sm leading-relaxed mb-6">
              The world's most trusted broker comparison platform, serving millions of traders with independent analysis and verified reviews.
            </p>
            
            {/* Social Links */}
            <nav aria-label="Social media links">
              <div className="flex space-x-4" role="list">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-professional-black border border-medium-grey rounded-lg flex items-center justify-center text-light-grey hover:text-pure-white hover:bg-medium-grey/20 hover:scale-110 focus:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-charcoal-grey"
                    aria-label={`Follow us on ${social.name} (opens in new tab)`}
                    role="listitem"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                  >
                    <social.icon className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </nav>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <nav key={section.title} aria-labelledby={`footer-section-${sectionIndex}`}>
              <h3 
                id={`footer-section-${sectionIndex}`}
                className="text-pure-white font-semibold mb-4"
              >
                {section.title}
              </h3>
              <ul className="space-y-3" role="list">
                {section.links.map((link) => (
                  <li key={link.name} role="listitem">
                    <Link
                      to={link.href}
                      className="text-light-grey hover:text-pure-white hover:underline focus:text-pure-white focus:underline transition-all duration-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-charcoal-grey rounded-sm px-1 py-0.5 -mx-1 -my-0.5"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          e.currentTarget.click();
                        }
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="w-full border-t border-medium-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-light-grey text-sm mb-4 md:mb-0" role="contentinfo">
              © 2025 BrokerAnalysis. All rights reserved.
            </div>

            {/* Security Badge and Links */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div 
                className="flex items-center text-light-grey text-sm"
                role="status"
                aria-label="Security information"
              >
                <Shield className="w-4 h-4 mr-2" aria-hidden="true" />
                <span>Secure site: SSL-encrypted</span>
              </div>
              
              <nav aria-label="Legal links">
                <div className="flex items-center space-x-4 text-sm" role="list">
                  <Link 
                    to="/privacy" 
                    className="text-light-grey hover:text-pure-white hover:underline focus:text-pure-white focus:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-charcoal-grey rounded-sm px-1 py-0.5 -mx-1 -my-0.5"
                    role="listitem"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    to="/terms" 
                    className="text-light-grey hover:text-pure-white hover:underline focus:text-pure-white focus:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-charcoal-grey rounded-sm px-1 py-0.5 -mx-1 -my-0.5"
                    role="listitem"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                  >
                    Terms of Service
                  </Link>
                  <Link 
                    to="/cookies" 
                    className="text-light-grey hover:text-pure-white hover:underline focus:text-pure-white focus:underline transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-charcoal-grey rounded-sm px-1 py-0.5 -mx-1 -my-0.5"
                    role="listitem"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                  >
                    Cookie Policy
                  </Link>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
