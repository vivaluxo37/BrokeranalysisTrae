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
  ChevronDown,
  Menu,
  Search,
  User,
  Shield,
} from 'lucide-react'

export function ProfessionalHeader() {
  const [searchQuery, setSearchQuery] = useState('')

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'DeFi App', href: '/defi' },
    { name: 'Assets', href: '/assets' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'FAQ', href: '/faq' },
    {
      name: 'Protection',
      href: '/protection',
      hasDropdown: true,
      items: [
        { name: 'Security Features', href: '/protection/security' },
        { name: 'Insurance Coverage', href: '/protection/insurance' },
        { name: 'Risk Management', href: '/protection/risk' },
      ]
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Search:', searchQuery)
    }
  }

  return (
    <header className="professional-nav sticky top-0 z-50">
      <div className="professional-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 bg-pure-white rounded-full flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-professional-black rounded-full"></div>
            </div>
            <span className="text-pure-white font-semibold text-lg hidden sm:block">
              AssetDefense
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="professional-nav-item flex items-center">
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4 ml-1" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="start" 
                      className="bg-charcoal-grey border-medium-grey"
                    >
                      {item.items?.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link
                            to={subItem.href}
                            className="text-pure-white hover:bg-medium-grey/20"
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link to={item.href} className="professional-nav-item">
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-light-grey w-4 h-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="professional-input pl-10 w-48"
              />
            </div>

            {/* Protection Badge */}
            <div className="flex items-center text-light-grey text-sm">
              <Shield className="w-4 h-4 mr-1" />
              <span className="hidden xl:inline">Protected</span>
            </div>

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

            {/* CTA Button */}
            <Button className="btn-professional-primary">
              Create Account
            </Button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
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
                className="bg-professional-black border-charcoal-grey"
              >
                <div className="space-y-4 mt-8">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        to={item.href}
                        className="block text-pure-white hover:text-light-grey py-2 text-lg"
                      >
                        {item.name}
                      </Link>
                      {item.items && (
                        <div className="ml-4 mt-2 space-y-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.name}
                              to={subItem.href}
                              className="block text-light-grey hover:text-pure-white py-1"
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="pt-4">
                    <Button className="btn-professional-primary w-full">
                      Create Account
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