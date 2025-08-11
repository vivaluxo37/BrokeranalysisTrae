import { Link } from 'react-router-dom'

export function ProfessionalFooter() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'DeFi App', href: '/defi' },
        { name: 'Assets', href: '/assets' },
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Community', href: '/community' },
        { name: 'Status', href: '/status' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Security', href: '/security' },
        { name: 'Compliance', href: '/compliance' },
      ]
    }
  ]

  return (
    <footer className="bg-charcoal-grey border-t border-medium-grey">
      <div className="professional-container py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-pure-white rounded-full flex items-center justify-center mr-3">
                <div className="w-4 h-4 bg-professional-black rounded-full"></div>
              </div>
              <span className="text-pure-white font-semibold text-lg">
                AssetDefense
              </span>
            </div>
            <p className="text-light-grey text-sm leading-relaxed">
              Professional asset protection and blockchain technology solutions for modern traders.
            </p>
          </div>

          {/* Footer sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-pure-white font-medium mb-4">
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

        {/* Bottom section */}
        <div className="border-t border-medium-grey mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-light-grey text-sm">
            © 2024 AssetDefense. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-light-grey hover:text-pure-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-light-grey hover:text-pure-white text-sm transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-light-grey hover:text-pure-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}