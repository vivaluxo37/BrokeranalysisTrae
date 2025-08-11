import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { TrendingUp, X } from 'lucide-react'

export function StickyCtaBar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY
    const windowHeight = window.innerHeight
    
    // Show after scrolling 50% of viewport height
    if (scrollPosition > windowHeight * 0.5 && !isHidden) {
      setIsVisible(true)
    } else if (scrollPosition <= windowHeight * 0.5) {
      setIsVisible(false)
    }
  }, [isHidden])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const handleClose = () => {
    setIsHidden(true)
    setIsVisible(false)
  }

  if (!isVisible || isHidden) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass-card backdrop-blur-3xl border-t border-white/10 cosmic-glow">
      <div className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 glass-card rounded-full flex items-center justify-center cosmic-glow">
              <TrendingUp className="w-6 h-6 text-topforex-accent" />
            </div>
            <div>
              <h3 className="cosmic-text font-bold text-lg">Find Your Perfect Broker Today</h3>
              <p className="neural-text text-sm">Compare 500+ regulated brokers with our AI-powered tools</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              className="bg-topforex-accent hover:bg-topforex-accent/80 text-white font-semibold px-8 py-3 rounded-full"
              onClick={() => document.getElementById('broker-finder')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Compare Brokers Now
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="glass-card text-white hover:bg-white/10 w-10 h-10 rounded-full"
              onClick={handleClose}
              aria-label="Close sticky bar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
