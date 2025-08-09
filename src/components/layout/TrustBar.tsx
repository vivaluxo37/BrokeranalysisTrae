import { Link } from 'react-router-dom'
import { Globe, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-light-grey hover:text-pure-white text-sm h-8"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  English
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-charcoal-grey border-medium-grey"
              >
                <DropdownMenuItem className="text-pure-white hover:bg-medium-grey/20">
                  English
                </DropdownMenuItem>
                <DropdownMenuItem className="text-pure-white hover:bg-medium-grey/20">
                  Español
                </DropdownMenuItem>
                <DropdownMenuItem className="text-pure-white hover:bg-medium-grey/20">
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem className="text-pure-white hover:bg-medium-grey/20">
                  Deutsch
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-4 w-px bg-medium-grey"></div>

            {/* Auth Links */}
            <Link 
              to="/signin" 
              className="text-light-grey hover:text-pure-white transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="text-pure-white hover:text-light-grey transition-colors font-medium"
            >
              Join Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}