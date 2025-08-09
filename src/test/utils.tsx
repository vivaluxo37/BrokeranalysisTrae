import React, { ReactElement } from 'react'
import { RenderOptions, render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data factories
export const createMockBroker = (overrides = {}) => ({
  id: '1',
  name: 'Test Broker',
  logo: '/test-logo.png',
  rating: 4.5,
  reviewCount: 100,
  tradingFees: '$5 per trade',
  minDeposit: '$100',
  regulatedBy: ['FCA', 'CySEC'],
  countries: ['US', 'UK', 'EU'],
  categories: ['forex', 'stocks'],
  features: ['ECN', 'STP', 'Low Spreads'],
  description:
    'A reliable broker with competitive fees and excellent customer service.',
  pros: ['Low fees', 'Fast execution', 'Good customer support'],
  cons: ['Limited educational resources', 'No crypto trading'],
  website: 'https://testbroker.com',
  founded: 2010,
  headquarters: 'London, UK',
  platforms: ['MT4', 'MT5', 'WebTrader'],
  instruments: ['Forex', 'Stocks', 'Indices', 'Commodities'],
  accountTypes: [
    {
      name: 'Standard',
      minDeposit: '$100',
      features: ['Standard spreads', 'No commission'],
    },
    {
      name: 'Pro',
      minDeposit: '$1000',
      features: ['Raw spreads', 'Commission based'],
    },
  ],
  spreads: {
    type: 'variable',
    typical: '1.2 pips',
    major_pairs: {
      'EUR/USD': '1.2',
      'GBP/USD': '1.5',
      'USD/JPY': '1.0',
    },
  },
  commissions: {
    stocks: '$5 per trade',
    forex: '$0',
    crypto: 'N/A',
    options: '$1 per contract',
  },
  promotions: [
    {
      id: '1',
      title: 'Welcome Bonus',
      description: 'Get 50% bonus on your first deposit',
      conditions: 'Minimum deposit $500',
      validUntil: '2024-12-31',
    },
  ],
  educationalResources: true,
  customerSupport: {
    phone: true,
    email: true,
    liveChat: true,
    languages: ['English', 'Spanish', 'French'],
    availability: '24/5',
  },
  isPopular: false,
  rank: 1,
  ...overrides,
})

export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    country: 'US',
    language: 'en',
    timezone: 'America/New_York',
    isVerified: false,
  },
  preferences: {
    tradingStyle: ['day-trading'],
    preferredInstruments: ['forex'],
    riskTolerance: 'medium',
    budgetRange: { min: 1000, max: 10000 },
    importantFeatures: ['low-spreads', 'regulation'],
    notifications: {
      email: true,
      push: false,
      sms: false,
    },
  },
  ...overrides,
})

export const createMockReview = (overrides = {}) => ({
  id: '1',
  userId: '1',
  brokerId: '1',
  rating: 4,
  title: 'Great broker',
  content: 'I have been using this broker for 2 years and it is excellent.',
  pros: ['Low spreads', 'Fast execution'],
  cons: ['Limited educational resources'],
  tradingExperience: {
    level: 'intermediate',
    yearsTrading: 2,
    primaryMarkets: ['forex'],
    averageTradesPerMonth: 50,
    typicalTradeSize: 1000,
  },
  verificationStatus: 'verified',
  helpfulnessScore: 10,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  ...overrides,
})
