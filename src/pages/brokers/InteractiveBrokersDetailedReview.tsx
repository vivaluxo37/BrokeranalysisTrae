import { Layout } from '@/components/layout/Layout'
import { DetailedBrokerReview } from '@/components/brokers/DetailedBrokerReview'
import { SeoHead } from '@/components/common'

const interactiveBrokersData = {
  name: 'Interactive Brokers',
  logo: 'https://images.unsplash.com/photo-1508145721696-a55c227daae0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxJbnRlcmFjdGl2ZSUyMEJyb2tlcnMlMjBmaW5hbmNpYWwlMjB0cmFkaW5nJTIwbG9nb3xlbnwwfDJ8fHwxNzU0OTA2ODUwfDA&ixlib=rb-4.1.0&q=85',
  rating: 4.7,
  founded: '1978',
  headquarters: 'Greenwich, CT',
  regulation: ['SEC', 'FINRA', 'CFTC', 'FCA'],
  minDeposit: '$0',
  spreads: '0.1 pips',
  platforms: ['TWS', 'IBKR Mobile', 'WebTrader', 'Client Portal'],
  assets: ['Stocks', 'Options', 'Futures', 'Forex', 'Bonds', 'ETFs', 'Mutual Funds', 'Cryptocurrencies'],
  trustScore: 95,
  userReviews: 12847,
  description: `Interactive Brokers is a leading online broker that has been serving traders and investors since 1978. Known for its advanced trading technology, comprehensive market access, and competitive pricing, IBKR offers one of the most sophisticated trading platforms in the industry. With access to over 150 markets in 33 countries, Interactive Brokers provides unparalleled global reach for serious traders and institutional investors.`,
  pros: [
    'Extremely low trading costs and fees',
    'Access to 150+ global markets',
    'Advanced trading platform (TWS)',
    'Excellent research and analysis tools',
    'Strong regulatory oversight',
    'Wide range of tradeable instruments',
    'Professional-grade execution quality',
    'Comprehensive API for algorithmic trading'
  ],
  cons: [
    'Complex platform may overwhelm beginners',
    'Minimum activity fees for small accounts',
    'Limited educational resources',
    'Customer service can be slow',
    'No guaranteed stop losses',
    'Inactivity fees apply'
  ],
  features: [
    { name: 'Mobile Trading', available: true, description: 'Full-featured mobile app' },
    { name: 'Demo Account', available: true, description: 'Paper trading available' },
    { name: 'Copy Trading', available: false },
    { name: 'Automated Trading', available: true, description: 'API and algorithmic trading' },
    { name: 'Research Tools', available: true, description: 'Comprehensive market research' },
    { name: 'Educational Content', available: true, description: 'Limited but quality content' },
    { name: 'Social Trading', available: false },
    { name: 'Robo Advisor', available: true, description: 'Portfolio Analyst tool' },
    { name: '24/7 Support', available: false },
    { name: 'Negative Balance Protection', available: true }
  ],
  fees: [
    {
      category: 'Stock Trading (US)',
      amount: '$0.005/share',
      description: 'Minimum $1 per order, maximum 1% of trade value'
    },
    {
      category: 'Options Trading',
      amount: '$0.65/contract',
      description: 'Plus exchange and regulatory fees'
    },
    {
      category: 'Forex Trading',
      amount: '0.2 bps',
      description: 'Minimum $2 per order for major pairs'
    },
    {
      category: 'Futures Trading',
      amount: '$0.85/contract',
      description: 'Plus exchange fees'
    },
    {
      category: 'Account Maintenance',
      amount: '$0-$20/month',
      description: 'Based on account equity and activity'
    },
    {
      category: 'Withdrawal Fee',
      amount: '$0-$1',
      description: 'Free for ACH, $1 for wire transfers'
    }
  ]
}

export default function InteractiveBrokersDetailedReview() {
  return (
    <Layout>
      <SeoHead 
        title="Interactive Brokers Review 2025 - Detailed Analysis & Rating"
        description="Comprehensive Interactive Brokers review covering fees, platforms, pros & cons. Expert analysis of IBKR's trading conditions, regulation, and user experience."
        keywords="Interactive Brokers review, IBKR review, Interactive Brokers fees, TWS platform, professional trading"
      />
      
      <div className="min-h-screen bg-professional-black">
        <div className="professional-container professional-section">
          <DetailedBrokerReview broker={interactiveBrokersData} />
        </div>
      </div>
    </Layout>
  )
}