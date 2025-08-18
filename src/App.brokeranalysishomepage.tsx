import React from 'react'
import { BrokerComparisonHomePage } from './pages/BrokerComparisonHomePage'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from '@dr.pogodin/react-helmet'
import { NavigationProvider } from './contexts/NavigationContext'

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <NavigationProvider enableAnalytics={false} maxAnalyticsEvents={100}>
          <div className="min-h-screen">
            <BrokerComparisonHomePage />
          </div>
        </NavigationProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}