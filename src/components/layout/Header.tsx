import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../../i18n/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun,
  TrendingUp,
  User,
} from 'lucide-react'
import { BrokerAnalysisLogo, LanguageSwitcher } from '@/components/common'

export function Header() {
  const { t } = useTranslation()
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/' },
    {
      name: 'Brokers',
      href: '/best-brokers',
      dropdown: [
        { name: 'Top Rated Brokers', href: '/best-brokers/top-rated', description: 'Highest rated brokers by our experts' },
        { name: 'Low Cost Brokers', href: '/best-brokers/low-cost', description: 'Brokers with lowest trading fees' },
        { name: 'Crypto Brokers', href: '/best-brokers/crypto', description: 'Best brokers for cryptocurrency trading' },
        { name: 'Forex Brokers', href: '/best-brokers/forex', description: 'Top forex trading platforms' },
        { name: 'CFD Brokers', href: '/best-brokers/cfd', description: 'Best CFD trading brokers' },
        { name: 'All Brokers', href: '/best-brokers', description: 'Complete broker directory' },
      ],
    },
    {
      name: 'Reviews',
      href: '/broker-reviews',
      dropdown: [
        { name: 'All Reviews', href: '/broker-reviews', description: 'Complete broker review database' },
        { name: 'Recent Reviews', href: '/broker-reviews/recent', description: 'Latest broker reviews and updates' },
        { name: 'Expert Reviews', href: '/broker-reviews/expert', description: 'In-depth expert analysis' },
        { name: 'User Reviews', href: '/broker-reviews/user', description: 'Real trader experiences' },
      ],
    },
    {
      name: 'Tools',
      href: '/tools',
      dropdown: [
        { name: 'Broker Comparison', href: '/tools/comparison', description: 'Compare brokers side by side' },
        { name: 'Fee Calculator', href: '/tools/fee-calculator', description: 'Calculate trading costs' },
        { name: 'Risk Assessment', href: '/tools/risk-assessment', description: 'Evaluate your risk profile' },
        { name: 'Spread Comparison', href: '/tools/spreads', description: 'Compare broker spreads' },
      ],
    },
    {
      name: 'Learn',
      href: '/academy',
      dropdown: [
        { name: 'Forex Academy', href: '/academy/forex', description: 'Learn forex trading basics' },
        { name: 'Trading Guides', href: '/academy/guides', description: 'Step-by-step trading tutorials' },
        { name: 'Market Analysis', href: '/academy/analysis', description: 'Expert market insights' },
        { name: 'Glossary', href: '/academy/glossary', description: 'Trading terms explained' },
      ],
    },
    { name: 'About', href: '/about' },
  ]

  const isActiveRoute = (path: string) => location.pathname === path

  // Dark mode toggle
  useEffect(() => {
    const root = window.document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDark])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Search:', searchQuery)
    }
  }

  return (
    <header className='sticky top-0 z-50 bg-tradez-dark border-b border-tradez-dark-secondary'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <Link to='/' className='flex items-center'>
            <BrokerAnalysisLogo size="md" />
          </Link>

          {/* Search Bar */}
          <div className='flex-1 mx-4 max-w-md hidden md:block'>
            <form onSubmit={handleSearch} className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
              <Input
                type='text'
                placeholder={t('nav.search')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10'
              />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className='hidden lg:flex items-center space-x-1'>
            {navigation.map(item => (
              <div key={item.name} className='relative'>
                {item.dropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className='flex items-center space-x-1'
                      >
                        <span>{item.name}</span>
                        <ChevronDown className='w-4 h-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start' className='w-80 p-4'>
                      <div className="grid gap-2">
                        {item.dropdown.map(subItem => (
                          <DropdownMenuItem key={subItem.name} asChild>
                            <Link
                              to={subItem.href}
                              className='flex flex-col items-start p-3 rounded-lg hover:bg-accent'
                            >
                              <div className="font-medium">{subItem.name}</div>
                              {subItem.description && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  {subItem.description}
                                </div>
                              )}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to={item.href}>
                    <Button
                      variant={isActiveRoute(item.href) ? 'default' : 'ghost'}
                      size='sm'
                    >
                      {item.name}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className='hidden md:flex items-center space-x-2'>
            {/* Language Selector */}
            <LanguageSwitcher />

            {/* Dark Mode Toggle */}
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsDark(!isDark)}
              aria-label={isDark ? t('header.lightMode') : t('header.darkMode')}
            >
              {isDark ? (
                <Sun className='w-4 h-4' />
              ) : (
                <Moon className='w-4 h-4' />
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label={t('header.userMenu')}
                >
                  <User className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuItem className='cursor-pointer'>
                  {t('header.signIn')}
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer'>
                  {t('header.createAccount')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer'>
                  {t('header.helpSupport')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CTA Button */}
            <Button className='bg-tradez-lime text-tradez-dark font-semibold px-6 hover:bg-tradez-lime-bright transition-all duration-300'>
              {t('nav.compareBrokers')}
            </Button>
          </div>

          {/* Mobile menu */}
          <div className='md:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' aria-label={t('nav.menu')}>
                  <Menu className='w-6 h-6' />
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-80'>
                <SheetHeader>
                  <div className='flex items-center space-x-2 mb-4'>
                    <div className='gradient-primary text-white p-2 rounded-xl shadow-lg'>
                      <TrendingUp className='w-6 h-6' />
                    </div>
                    <span className='text-xl font-bold text-gradient-primary'>
                      {t('header.logo')}
                    </span>
                  </div>
                  <form onSubmit={handleSearch} className='relative mb-4'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
                    <Input
                      type='text'
                      placeholder={t('nav.search')}
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className='pl-10'
                    />
                  </form>
                </SheetHeader>
                <div className='space-y-2'>
                  {navigation.map(item => (
                    <div key={item.name}>
                      <Link
                        to={item.href}
                        className={`block px-4 py-2 text-base font-medium transition-colors rounded-md ${
                          isActiveRoute(item.href)
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {item.name}
                      </Link>
                      {item.dropdown && (
                        <div className='ml-4 mt-1 space-y-1'>
                          {item.dropdown.map(subItem => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className='block px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className='pt-4 space-y-4'>
                    {/* Mobile Language Switcher */}
                    <LanguageSwitcher variant='mobile' />

                    <div className='flex items-center justify-between px-4'>
                      <span className='text-sm font-medium'>
                        {isDark ? t('header.lightMode') : t('header.darkMode')}
                      </span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setIsDark(!isDark)}
                      >
                        {isDark ? (
                          <Sun className='w-4 h-4' />
                        ) : (
                          <Moon className='w-4 h-4' />
                        )}
                      </Button>
                    </div>
                    <Button className='w-full bg-tradez-lime text-tradez-dark font-semibold hover:bg-tradez-lime-bright transition-all duration-300' size='lg'>
                      {t('nav.compareBrokers')}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
