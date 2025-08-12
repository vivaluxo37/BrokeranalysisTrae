import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function SEOHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'Broker Reviews', href: '/brokers' },
    { label: 'Compare', href: '/compare' },
    { label: 'Tools', href: '/tools' },
    { label: 'Country Guides', href: '/countries' },
    { label: 'Learn', href: '/education' },
    { label: 'News & Analysis', href: '/news' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-professional-black/95 backdrop-blur-sm border-b border-charcoal-grey">
      <div className="content-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent-blue rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-white font-bold text-xl">BrokerAnalysis</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-light-grey hover:text-white transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Box */}
            <div className="hidden md:block relative">
              <Input
                type="search"
                placeholder="Search brokers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                iconPosition="left"
                className="w-64"
                aria-label="Search for brokers"
              />
            </div>

            {/* Language Selector */}
            <div className="hidden sm:flex items-center space-x-2">
              <img src="/favicon.svg" alt="Language" className="w-4 h-4" />
              <span className="text-white text-sm">EN</span>
            </div>

            {/* Auth Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
              <Button size="sm">
                Sign Up
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-light-grey hover:text-white transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-charcoal-grey">
            {/* Mobile Search */}
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search brokers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={Search}
                iconPosition="left"
                aria-label="Search for brokers"
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-light-grey hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Mobile Auth */}
            <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-charcoal-grey">
              <Button variant="ghost" size="sm" className="flex-1">
                Sign In
              </Button>
              <Button size="sm" className="flex-1">
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
