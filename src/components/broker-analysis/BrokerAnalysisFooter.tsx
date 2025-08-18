import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingUp, 
  Mail, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Youtube,
  Shield,
  FileText,
  HelpCircle,
  Globe
} from 'lucide-react';

export function BrokerAnalysisFooter() {
  const footerSections = [
    {
      title: 'Compare Brokers',
      links: [
        { name: 'Best Forex Brokers', href: '/brokers/forex' },
        { name: 'Best Stock Brokers', href: '/brokers/stocks' },
        { name: 'Best Crypto Brokers', href: '/brokers/crypto' },
        { name: 'Best CFD Brokers', href: '/brokers/cfds' },
        { name: 'Low Cost Brokers', href: '/brokers/low-cost' },
        { name: 'All Brokers', href: '/brokers' }
      ]
    },
    {
      title: 'Tools & Resources',
      links: [
        { name: 'Fee Calculator', href: '/tools/fee-calculator' },
        { name: 'Broker Comparison Tool', href: '/tools/comparison' },
        { name: 'Trading Calculator', href: '/tools/trading-calculator' },
        { name: 'Economic Calendar', href: '/tools/economic-calendar' },
        { name: 'Market Analysis', href: '/analysis' },
        { name: 'Trading Guides', href: '/guides' }
      ]
    },
    {
      title: 'Learn',
      links: [
        { name: 'How to Choose a Broker', href: '/education/choose-broker' },
        { name: 'Trading Basics', href: '/education/basics' },
        { name: 'Risk Management', href: '/education/risk-management' },
        { name: 'Regulation Guide', href: '/education/regulation' },
        { name: 'Trading Glossary', href: '/education/glossary' },
        { name: 'Market News', href: '/news' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Our Methodology', href: '/methodology' },
        { name: 'Editorial Policy', href: '/editorial-policy' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/brokeranalysis', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/brokeranalysis', label: 'LinkedIn' },
    { icon: Facebook, href: 'https://facebook.com/brokeranalysis', label: 'Facebook' },
    { icon: Youtube, href: 'https://youtube.com/brokeranalysis', label: 'YouTube' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    { name: 'Terms of Service', href: '/terms', icon: FileText },
    { name: 'Cookie Policy', href: '/cookies', icon: Globe },
    { name: 'Disclaimer', href: '/disclaimer', icon: HelpCircle }
  ];

  return (
    <footer className="bg-professional-black border-t border-charcoal-grey">
      {/* Newsletter Section */}
      <div className="border-b border-charcoal-grey">
        <div className="w-full px-6 lg:px-12">
          <div className="py-12">
            <div className="max-w-2xl mx-auto text-center">
              <Mail className="w-12 h-12 text-accent-blue mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-pure-white mb-2">
                Stay Informed
              </h3>
              <p className="text-muted-text mb-6">
                Get the latest broker reviews, market analysis, and trading insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1"
                />
                <Button className="bg-accent-blue hover:bg-accent-blue/90">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-text mt-3">
                No spam. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="w-full px-6 lg:px-12">
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-accent-blue rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-pure-white">BrokerAnalysis</span>
              </Link>
              <p className="text-muted-text mb-6 text-sm leading-relaxed">
                Independent broker reviews and comparisons to help traders make informed decisions. 
                We analyze 100+ brokers across 50+ regulators worldwide.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-charcoal-grey rounded-lg flex items-center justify-center text-light-grey hover:text-accent-blue hover:bg-medium-grey transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Sections */}
            {footerSections.map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-pure-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        to={link.href}
                        className="text-muted-text hover:text-pure-white transition-colors text-sm"
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
      </div>

      <Separator className="bg-charcoal-grey" />

      {/* Bottom Footer */}
      <div className="content-container">
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm text-muted-text">
              © {new Date().getFullYear()} BrokerAnalysis. All rights reserved.
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-6">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="flex items-center space-x-1 text-sm text-muted-text hover:text-pure-white transition-colors"
                >
                  <link.icon className="w-3 h-3" />
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-charcoal-grey">
            <div className="text-xs text-muted-text leading-relaxed">
              <p className="mb-2">
                <strong>Risk Warning:</strong> Trading involves substantial risk and may result in the loss of your invested capital. 
                You should not invest more than you can afford to lose and should ensure that you fully understand the risks involved.
              </p>
              <p className="mb-2">
                <strong>Disclaimer:</strong> BrokerAnalysis.com provides information and reviews about online brokers. 
                We may receive compensation from some of the brokers we review through affiliate partnerships. 
                This does not influence our reviews or rankings.
              </p>
              <p>
                The information on this website is general in nature and doesn't take into account your personal financial situation. 
                You should consider whether the products or services featured on our site are appropriate for your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}