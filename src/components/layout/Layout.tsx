import { ReactNode } from 'react'
import { BrokerAnalysisHeader } from './BrokerAnalysisHeader'
import { BrokerAnalysisFooter } from './BrokerAnalysisFooter'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-professional-black">
      {/* Skip Navigation Links */}
      <div className="sr-only focus-within:not-sr-only">
        <a 
          href="#main-content" 
          className="absolute top-4 left-4 z-[9999] bg-primary-blue text-white px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-blue hover:bg-blue-700"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              document.getElementById('main-content')?.focus();
            }
          }}
        >
          Skip to main content
        </a>
        <a 
          href="#navigation" 
          className="absolute top-4 left-40 z-[9999] bg-primary-blue text-white px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-blue hover:bg-blue-700"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              document.getElementById('navigation')?.focus();
            }
          }}
        >
          Skip to navigation
        </a>
        <a 
          href="#footer" 
          className="absolute top-4 left-72 z-[9999] bg-primary-blue text-white px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-blue hover:bg-blue-700"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              document.getElementById('footer')?.focus();
            }
          }}
        >
          Skip to footer
        </a>
      </div>
      
      <BrokerAnalysisHeader totalTraders={2500000} />
      <main 
        id="main-content" 
        className="flex-1" 
        tabIndex={-1}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
      <BrokerAnalysisFooter />
    </div>
  )
}