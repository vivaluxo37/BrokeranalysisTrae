import { Link } from 'react-router-dom'
import { BrokerAnalysisLogo } from '@/components/common'
import { Shield, Twitter, Linkedin, Youtube } from 'lucide-react'

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
    <footer className="bg-charcoal-grey border-t border-medium-grey">
      {/* Main Footer Content */}
      <div className="professional-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <BrokerAnalysisLogo size="md" className="mb-4" />
            <p className="text-light-grey text-sm leading-relaxed mb-6">
              The world's most trusted broker comparison platform, serving millions of traders with independent analysis and verified reviews.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-professional-black border border-medium-grey rounded-lg flex items-center justify-center text-light-grey hover:text-pure-white hover:bg-medium-grey/20 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-pure-white font-semibold mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-light-grey hover:text-pure-white transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-medium-grey">
        <div className="professional-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-light-grey text-sm mb-4 md:mb-0">
              © 2025 BrokerAnalysis. All rights reserved.
            </div>

            {/* Security Badge and Links */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-light-grey text-sm">
                <Shield className="w-4 h-4 mr-2" />
                Secure site: SSL-encrypted
              </div>
              
              <div className="flex items-center space-x-4 text-sm">
                <Link 
                  to="/privacy" 
                  className="text-light-grey hover:text-pure-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms" 
                  className="text-light-grey hover:text-pure-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link 
                  to="/cookies" 
                  className="text-light-grey hover:text-pure-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}