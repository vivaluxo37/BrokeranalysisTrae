import { BarChart3, TrendingUp } from 'lucide-react'

interface BrokerAnalysisLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'full' | 'icon' | 'text'
  className?: string
}

const sizeClasses = {
  sm: { icon: 'w-6 h-6', text: 'text-lg', container: 'gap-2' },
  md: { icon: 'w-8 h-8', text: 'text-xl', container: 'gap-2' },
  lg: { icon: 'w-10 h-10', text: 'text-2xl', container: 'gap-3' },
  xl: { icon: 'w-12 h-12', text: 'text-3xl', container: 'gap-3' }
}

export function BrokerAnalysisLogo({ 
  size = 'md', 
  variant = 'full', 
  className = '' 
}: BrokerAnalysisLogoProps) {
  const sizes = sizeClasses[size]

  const LogoIcon = () => (
    <div className="relative">
      <div className="bg-gradient-to-br from-brokeranalysis-accent to-rating-excellent rounded-xl p-2 shadow-lg">
        <div className="relative">
          <BarChart3 className={`${sizes.icon} text-white`} />
          <TrendingUp className="w-3 h-3 text-white absolute -top-1 -right-1 bg-brokeranalysis-accent rounded-full p-0.5" />
        </div>
      </div>
    </div>
  )

  const LogoText = () => (
    <div className="flex flex-col">
      <span className={`${sizes.text} font-bold text-luminescent-white leading-tight`}>
        Broker<span className="text-brokeranalysis-accent">Analysis</span>
      </span>
      <span className="text-xs text-starfield-gray font-medium tracking-wide">
        TRUSTED BROKER REVIEWS
      </span>
    </div>
  )

  if (variant === 'icon') {
    return (
      <div className={className}>
        <LogoIcon />
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={className}>
        <LogoText />
      </div>
    )
  }

  return (
    <div className={`flex items-center ${sizes.container} ${className}`}>
      <LogoIcon />
      <LogoText />
    </div>
  )
}

// Favicon component for HTML head
export function FaviconMeta() {
  return (
    <>
      <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    </>
  )
}

export default BrokerAnalysisLogo