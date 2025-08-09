import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import {
  ChevronDown,
  Menu,
  Search,
  User,
  Edit3,
} from 'lucide-react'
import { BrokerAnalysisLogo } from '@/components/common'
import { TrustBar } from './TrustBar'

interface BrokerAnalysisHeaderProps {
  totalTraders: number
}

export function BrokerAnalysisHeader({ totalTraders }: BrokerAnalysisHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery)
    }
  }

  const navigation = [
    {
      name: 'Brokers',
      href: '/brokers',
      sections: [
        {
          title: 'By Asset Class',
          items: [
            { name: 'Forex', href: '/brokers/forex' },
            { name: 'Stocks', href: '/brokers/stocks' },
            { name: 'Crypto', href: '/brokers/crypto' },
            { name: 'CFDs', href: '/brokers/cfds' },
            { name: 'Commodities', href: '/brokers/commodities' },
          ]
        },
        {
          title: 'By Region',
          items: [
            { name: 'Global', href: '/brokers/global' },
            { name: 'US', href: '/brokers/us' },
            { name: 'EU', href: '/brokers/eu' },
            { name: 'Asia-Pacific', href: '/brokers/asia-pacific' },
            { name: 'MENA', href: '/brokers/mena' },
          ]
        },
        {
          title: 'By Account Type',
          items: [
            { name: 'Standard', href: '/brokers/standard' },
            { name: 'ECN', href: '/brokers/ecn' },
            { name: 'Islamic', href: '/brokers/islamic' },
            { name: 'Demo', href: '/brokers/demo' },
          ]
        }
      ]
    },
    {
      name: 'Compare',
      href: '/compare',
      sections: [
        {
          title: 'Comparison Tools',
          items: [
            { name: 'Quick Compare', href: '/compare/quick' },
            { name: 'Advanced Filter', href: '/compare/advanced' },
            { name: 'Find My Broker', href: '/compare/wizard' },
          ]
        }
      ]
    },
    {
      name: 'Tools',
      href: '/tools',
      sections: [
        {
          title: 'Trading Tools',
          items: [
            { name: 'Economic Calendar', href: '/tools/economic-calendar' },
            { name: 'Position-Size Calculator', href: '/tools/position-calculator' },
            { name: 'Swap & Spread Analyzer', href: '/tools/swap-analyzer' },
            { name: 'Correlation Matrix', href: '/tools/correlation-matrix' },
          ]
        }
      ]
    },
    {
      name: 'Education',
      href: '/education',
      sections: [
        {
          title: 'Learning Resources',
          items: [
            { name: "Beginner's Guides", href: '/education/beginners' },
            { name: 'Technical Analysis 101', href: '/education/technical-analysis' },
            { name: 'Risk Management', href: '/education/risk-management' },
            { name: 'Video Tutorials', href: '/education/videos' },
          ]
        }
      ]
    },
    {
      name: 'News & Insights',
      href: '/news',
      sections: [
        {
          title: 'Market Coverage',
          items: [
            { name: 'Market News', href: '/news/market' },
            { name: 'Broker Updates', href: '/news/broker-updates' },
            { name: 'Regulatory Alerts', href: '/news/regulatory' },
            { name: 'Expert Commentary', href: '/news/expert-commentary' },
          ]
        }
      ]
    },
    {
      name: 'Community',
      href: '/community',
      sections: [
        {
          title: 'Community Features',
          items: [
            { name: 'User Reviews', href: '/community/reviews' },
            { name: 'Forum & Q&A', href: '/community/forum' },
            { name: 'Webinars & Events', href: '/community/events' },
            { name: 'Glossary', href: '/community/glossary' },
          ]
        }
      ]
    }
  ]

  return (
    <header className="sticky top-0 z-50">
      {/* Top Trust Bar */}
      <TrustBar totalTraders={totalTraders} />

      {/* Main Navigation */}
      <div className="professional-nav">
        <div className="professional-container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <BrokerAnalysisLogo size="md" />
            </Link>

            {/* Search Bar */}
            <div className="flex-1 mx-8 max-w-md hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search brokers, platforms, or instruments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="professional-input pl-10"
                />
              </form>
            </div>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuTrigger className="professional-nav-item">
                      {item.name}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-charcoal-grey border-medium-grey p-6 w-96 left-0">
                      <div className="grid gap-6">
                        {item.sections.map((section) => (
                          <div key={section.title}>
                            <h4 className="text-pure-white font-medium mb-3">
                              {section.title}
                            </h4>
                            <div className="space-y-2">
                              {section.items.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="block text-light-grey hover:text-pure-white transition-colors text-sm"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-light-grey hover:text-pure-white hover:bg-charcoal-grey"
                  >
                    <User className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-charcoal-grey border-medium-grey"
                >
                  <DropdownMenuItem className="text-pure-white hover:bg-medium-grey/20">
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-pure-white hover:bg-medium-grey/20">
                    Create Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Primary CTAs */}
              <Button asChild className="btn-professional-secondary">
                <Link to="/compare">
                  Compare Brokers
                </Link>
              </Button>
              <Button asChild className="btn-professional-primary">
                <Link to="/find-broker">
                  Find My Broker
                </Link>
              </Button>
            </div>

            {/* Mobile menu */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-light-grey hover:text-pure-white"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="bg-professional-black border-charcoal-grey w-80"
                >
                  <div className="space-y-6 mt-8">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey w-4 h-4" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="professional-input pl-10"
                      />
                    </form>

                    {/* Mobile Navigation */}
                    {navigation.map((item) => (
                      <div key={item.name}>
                        <Link
                          to={item.href}
                          className="block text-pure-white hover:text-light-grey py-2 text-lg font-medium"
                        >
                          {item.name}
                        </Link>
                        {item.sections.map((section) => (
                          <div key={section.title} className="ml-4 mt-2">
                            <h5 className="text-light-grey text-sm font-medium mb-2">
                              {section.title}
                            </h5>
                            <div className="space-y-1">
                              {section.items.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="block text-light-grey hover:text-pure-white py-1 text-sm"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}

                    {/* Mobile CTAs */}
                    <div className="space-y-3 pt-4 border-t border-medium-grey">
                      <Button asChild className="btn-professional-secondary w-full">
                        <Link to="/compare">
                          Compare Brokers
                        </Link>
                      </Button>
                      <Button asChild className="btn-professional-primary w-full">
                        <Link to="/find-broker">
                          Find My Broker
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}