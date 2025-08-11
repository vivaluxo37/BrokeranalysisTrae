import { useState } from 'react'
import { Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CosmicNavigation() {
  const [activeItem, setActiveItem] = useState('Home')

  const navItems = [
    'Home',
    'DeFi App',
    'Assets',
    'Features',
    'Pricing',
    'FAQ'
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-6">
      <div className="container mx-auto">
        <div className="glass-card px-8 py-4 rounded-full neural-network">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-cosmic-black"></div>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveItem(item)}
                  className={`neural-text text-sm font-medium transition-all duration-300 hover:text-topforex-accent ${
                    activeItem === item ? 'text-topforex-accent' : 'text-white/80'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Protection Badge & User */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-topforex-accent" />
                <span className="neural-text text-sm">Protection</span>
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <span className="text-cosmic-black text-xs font-bold">U</span>
                </div>
              </div>
              
              <Button 
                size="sm"
                className="glass-card bg-transparent border-white/20 text-white hover:bg-white/10 rounded-full"
              >
                <User className="w-4 h-4 mr-2" />
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}