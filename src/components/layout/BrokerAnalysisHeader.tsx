import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useNavigation, useMobileMenu, useNavigationSearch, useRouteUtils } from '@/contexts/NavigationContext'
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
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { NavigationMenuItem } from './NavigationMenuItem'
import { MobileNavigationMenu } from './MobileNavigationMenu'
import {
  ChevronDown,
  Edit3,
  Menu,
  Search,
  User,
  X,
} from 'lucide-react'
import { BrokerAnalysisLogo } from '@/components/common'
import { TrustBar } from './TrustBar'
import { cn } from '@/lib/utils'

interface BrokerAnalysisHeaderProps {
  totalTraders: number
}

export function BrokerAnalysisHeader({ totalTraders }: BrokerAnalysisHeaderProps) {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Use navigation context
  const { trackNavigation } = useNavigation()
  const { isOpen: isMobileMenuOpen, toggle: toggleMobileMenu, close: closeMobileMenu } = useMobileMenu()
  const { query: searchQuery, setQuery: setSearchQuery, performSearch } = useNavigationSearch()
  const { isActiveRoute } = useRouteUtils()

  // Mobile menu is automatically closed by NavigationContext on route changes

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
      // Escape to close mobile menu
      if (e.key === 'Escape' && isMobileMenuOpen) {
        closeMobileMenu()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim())
      searchInputRef.current?.blur()
    }
  }

  // isActiveRoute is now provided by useRouteUtils hook

  // Get active navigation item class
  const getNavItemClass = (href: string, exact = false): string => {
    const baseClass = "professional-nav-item focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black rounded-md transition-colors"
    const activeClass = "text-pure-white bg-charcoal-grey/50 border-b-2 border-accent-blue"
    const inactiveClass = "text-light-grey hover:text-pure-white"
    
    return cn(baseClass, isActiveRoute(href, exact) ? activeClass : inactiveClass)
  }

  const navigation = [
    {
      name: 'Brokers',
      href: '/brokers',
      sections: [
        {
          title: 'Popular Brokers',
          items: [
            { name: 'Interactive Brokers', href: '/brokers/interactive-brokers' },
            { name: 'eToro', href: '/brokers/etoro' },
            { name: 'XTB', href: '/brokers/xtb' },
            { name: 'Saxo Bank', href: '/brokers/saxo-bank' },
            { name: 'Charles Schwab', href: '/brokers/charles-schwab' },
            { name: 'Trading 212', href: '/brokers/trading-212' },
            { name: 'Plus500', href: '/brokers/plus500' },
            { name: 'AvaTrade', href: '/brokers/avatrade' },
          ]
        },
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
        }
      ]
    },
    {
      name: 'Compare',
      href: '/compare',
      sections: [
        {
          title: 'Best Brokers 2025',
          items: [
            { name: 'Best Online Brokers', href: '/comparison/best-online-brokers' },
            { name: 'Best Forex Brokers', href: '/comparison/best-forex-brokers' },
            { name: 'Best Stock Brokers', href: '/comparison/best-stock-brokers' },
            { name: 'Best CFD Brokers', href: '/comparison/best-cfd-brokers' },
            { name: 'Best Crypto Brokers', href: '/comparison/best-crypto-brokers' },
          ]
        },
        {
          title: 'Specialized Lists',
          items: [
            { name: 'Best for Beginners', href: '/comparison/best-beginner-brokers' },
            { name: 'Best for Day Trading', href: '/comparison/best-day-trading-brokers' },
            { name: 'Best for Options', href: '/comparison/best-options-trading-brokers' },
            { name: 'Best Low Cost', href: '/comparison/best-low-cost-brokers' },
            { name: 'Best Futures Brokers', href: '/comparison/best-futures-brokers' },
          ]
        },
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
    <header 
      id="navigation"
      className="sticky top-0 z-50" 
      role="banner"
      tabIndex={-1}
    >
      {/* Skip Navigation Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[60] focus:bg-professional-black focus:text-pure-white focus:px-4 focus:py-2 focus:rounded-md focus:m-2"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            document.getElementById('main-content')?.focus();
          }
        }}
      >
        Skip to main content
      </a>
      
      {/* Top Trust Bar */}
      <TrustBar totalTraders={totalTraders} />

      {/* Main Navigation */}
      <nav className="professional-nav" role="navigation" aria-label="Main navigation">
        <div className="professional-container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black rounded-md"
              aria-label="BrokerAnalysis homepage"
              onClick={() => trackNavigation({
                type: 'navigation_click',
                path: '/',
                previousPath: location.pathname,
                metadata: { source: 'logo' }
              })}
            >
              <BrokerAnalysisLogo size="md" />
            </Link>

            {/* Enhanced Search Bar */}
            <div className="flex-1 mx-8 max-w-md hidden lg:block">
              <form onSubmit={handleSearch} className="relative" role="search">
                <label htmlFor="desktop-search" className="sr-only">
                  Search brokers, platforms, or instruments (Ctrl+K)
                </label>
                <Search 
                  className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors",
                    isSearchFocused ? "text-pure-white" : "text-light-grey"
                  )}
                  aria-hidden="true"
                />
                <Input
                  ref={searchInputRef}
                  id="desktop-search"
                  type="text"
                  placeholder="Search brokers, platforms, or instruments... (Ctrl+K)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={cn(
                    "professional-input pl-10 pr-16 transition-all duration-200",
                    "focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black",
                    isSearchFocused && "border-accent-blue shadow-lg"
                  )}
                  aria-describedby="search-help"
                  autoComplete="off"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-medium text-light-grey bg-charcoal-grey border border-medium-grey rounded">
                    ⌘K
                  </kbd>
                </div>
                <div id="search-help" className="sr-only">
                  Press Enter to search, Ctrl+K to focus, or use arrow keys to navigate suggestions
                </div>
              </form>
            </div>

            {/* Enhanced Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {navigation.map((item) => (
                  <NavigationMenuItem key={item.name} item={item} />
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
                    className="text-light-grey hover:text-pure-white hover:bg-charcoal-grey focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black rounded-md"
                    aria-label="User account menu"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <User className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-charcoal-grey border-medium-grey"
                  role="menu"
                  aria-label="User account options"
                >
                  <DropdownMenuItem 
                    className="text-pure-white hover:bg-medium-grey/20 focus:bg-medium-grey/20 focus:outline-none"
                    role="menuitem"
                  >
                    Sign In
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-pure-white hover:bg-medium-grey/20 focus:bg-medium-grey/20 focus:outline-none"
                    role="menuitem"
                  >
                    Create Account
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Enhanced Mobile menu */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={toggleMobileMenu}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-light-grey hover:text-pure-white focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black rounded-md transition-colors"
                    aria-label={isMobileMenuOpen ? "Close mobile navigation menu" : "Open mobile navigation menu"}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="mobile-menu"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6" aria-hidden="true" />
                    ) : (
                      <Menu className="w-6 h-6" aria-hidden="true" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  id="mobile-menu"
                  side="right" 
                  className="bg-professional-black border-charcoal-grey w-80 overflow-y-auto"
                  role="dialog"
                  aria-label="Mobile navigation menu"
                >
                  <div className="space-y-6 mt-8">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="relative" role="search">
                      <label htmlFor="mobile-search" className="sr-only">
                        Search brokers, platforms, or instruments
                      </label>
                      <Search 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey w-4 h-4" 
                        aria-hidden="true"
                      />
                      <Input
                        id="mobile-search"
                        type="text"
                        placeholder="Search brokers, platforms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="professional-input pl-10 focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black"
                        autoComplete="off"
                      />
                    </form>

                    {/* Mobile Navigation */}
                    <MobileNavigationMenu 
                      navigation={navigation} 
                      onItemClick={closeMobileMenu}
                    />

                    {/* Mobile Auth Links */}
                    <div className="space-y-3 pt-6 border-t border-medium-grey">
                      <Button 
                        asChild 
                        className="btn-professional-secondary w-full focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black"
                      >
                        <Link 
                          to="/signin" 
                          aria-label="Sign in to your account"
                          onClick={() => {
                            trackNavigation({
                              type: 'navigation_click',
                              path: '/signin',
                              previousPath: location.pathname,
                              metadata: { source: 'mobile_auth', button: 'signin' }
                            })
                            closeMobileMenu()
                          }}
                        >
                          Sign In
                        </Link>
                      </Button>
                      <Button 
                        asChild 
                        className="btn-professional-primary w-full focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 focus:ring-offset-professional-black"
                      >
                        <Link 
                          to="/signup" 
                          aria-label="Create a new account"
                          onClick={() => {
                            trackNavigation({
                              type: 'navigation_click',
                              path: '/signup',
                              previousPath: location.pathname,
                              metadata: { source: 'mobile_auth', button: 'signup' }
                            })
                            closeMobileMenu()
                          }}
                        >
                          Join Free
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}