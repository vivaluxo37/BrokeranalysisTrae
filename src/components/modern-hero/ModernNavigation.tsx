import React, { useState } from 'react'
import { Button } from '../ui/button'
import { ArrowRight, Menu, X } from 'lucide-react'

interface NavigationItem {
  label: string
  href: string
  isActive?: boolean
}

export function ModernNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems: NavigationItem[] = [
    { label: 'Evaluations', href: '/evaluations' },
    { label: 'About us', href: '/about' },
    { label: 'Resources', href: '/resources' },
    { label: 'Careers', href: '/careers' },
    { label: 'FAQ', href: '/faq' }
  ]

  return (
    <div className="w-full flex justify-center pt-8 pb-4 relative z-50">
      <nav className="nav-pill flex items-center justify-between w-full max-w-4xl mx-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <span className="text-black font-bold text-sm">QT</span>
          </div>
          <span className="text-white font-semibold text-lg">FUNDED</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-full ${
                item.isActive
                  ? 'nav-item-active text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <a
            href="/login"
            className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
          >
            Login
          </a>
          <Button
            className="bg-white text-black hover:bg-gray-100 rounded-full px-6 py-2 text-sm font-semibold"
          >
            Sign Up
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white p-2"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-black/95 backdrop-blur-lg border border-white/10 rounded-2xl p-4 md:hidden z-40">
          <div className="flex flex-col space-y-3">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-300 hover:text-white py-2 text-sm font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="border-t border-white/10 pt-3 mt-3 flex flex-col space-y-3">
              <a
                href="/login"
                className="text-gray-300 hover:text-white text-sm font-medium"
              >
                Login
              </a>
              <Button
                className="bg-white text-black hover:bg-gray-100 rounded-full px-6 py-2 text-sm font-semibold w-fit"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}