import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

export function SEOHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  return null
}