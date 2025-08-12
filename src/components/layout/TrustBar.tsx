import { Link } from 'react-router-dom'
import { LanguageSwitcher } from '@/components/common'

interface TrustBarProps {
  totalTraders: number
}

export function TrustBar({ totalTraders }: TrustBarProps) {
  const formatTraderCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M+`;
    }
    return count.toString();
  }

  return (
    <div className="bg-charcoal-grey border-b border-medium-grey">
      <div className="professional-container">
        <div className="flex justify-between items-center h-10 text-sm">
          {/* Left: Trust Signal */}
          <div className="text-light-grey">
            Trusted by {formatTraderCount(totalTraders)} traders worldwide
          </div>

          {/* Right: Language & Auth */}
          <div className="flex items-center space-x-4">
            {/* Language Selector with Top 15 Languages */}
            <LanguageSwitcher variant="desktop" />

            <div className="h-4 w-px bg-medium-grey"></div>

            {/* Auth Links */}
            <Link 
              to="/signin" 
              className="text-light-grey hover:text-pure-white transition-colors text-sm"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="text-pure-white hover:text-light-grey transition-colors font-medium text-sm"
            >
              Join Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
