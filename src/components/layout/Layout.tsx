import { ReactNode } from 'react'
import { BrokerAnalysisHeader } from './BrokerAnalysisHeader'
import { BrokerAnalysisFooter } from './BrokerAnalysisFooter'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-professional-black">
      <BrokerAnalysisHeader totalTraders={2500000} />
      <main className="flex-1">
        {children}
      </main>
      <BrokerAnalysisFooter />
    </div>
  )
}