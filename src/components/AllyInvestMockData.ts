import { BrokerRatingCategory, BrokerStatus, TradingExperience, AssetClass, RegionAvailability } from '../enums';

// Mock data for Ally Invest broker review
export const mockRootProps = {
  broker: {
    id: 'ally-invest-001',
    name: 'Ally Invest',
    slug: 'ally-invest',
    logo_url: 'https://images.unsplash.com/photo-1651055705032-d4187855b004?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxsb2dvJTIwZmluYW5jaWFsJTIwaW52ZXN0bWVudCUyMGFsbHl8ZW58MHwyfHx8MTc1NTMyNzc4NXww&ixlib=rb-4.1.0&q=85',
    website: 'https://www.ally.com/invest/',
    rating: 4.2 as const,
    review_count: 1847 as const,
    min_deposit: 0 as const,
    max_leverage: '2:1' as const,
    spreads_from: 0.1 as const,
    regulation: ['SEC', 'FINRA', 'SIPC'] as const,
    platforms: ['Ally Invest Live', 'Mobile App', 'Web Platform'] as const,
    founded: 2016 as const,
    headquarters: 'Detroit, Michigan, USA' as const,
    description: 'Ally Invest is a leading online brokerage offering commission-free stock and ETF trades with comprehensive investment tools and research.' as const,
    verified: true as const,
    featured: true as const,
    trust_score: 8.5 as const,
    category: 'discount_broker' as const,
    asset_classes: [AssetClass.STOCKS, AssetClass.ETFS, AssetClass.OPTIONS, AssetClass.BONDS] as const,
    account_types: ['Individual', 'Joint', 'IRA', 'Roth IRA', 'SEP-IRA'] as const,
    payment_methods: ['ACH Transfer', 'Wire Transfer', 'Check Deposit'] as const,
    customer_support: ['Phone', 'Email', 'Live Chat', 'Help Center'] as const,
    is_active: true as const,
    created_at: '2024-01-15T10:00:00Z' as const,
    updated_at: '2024-12-20T15:30:00Z' as const
  },
  ratings: {
    overall: 4.2 as const,
    fees: 4.5 as const,
    safety: 4.8 as const,
    deposit_withdrawal: 3.7 as const,
    account_opening: 4.1 as const,
    mobile_app: 4.0 as const,
    desktop_platform: 4.3 as const,
    product_selection: 3.9 as const
  },
  pros: [
    'Commission-free stock and ETF trades' as const,
    'No account minimums' as const,
    'Comprehensive research tools' as const,
    'Strong mobile app' as const,
    'FDIC insured cash management' as const,
    'Low options pricing' as const
  ],
  cons: [
    'Limited international markets' as const,
    'No fractional shares' as const,
    'Basic charting tools' as const,
    'Limited cryptocurrency options' as const,
    'No robo-advisor integration' as const
  ],
  keyFeatures: [
    {
      category: 'Trading' as const,
      features: [
        { name: 'Stock Trades' as const, value: '$0' as const },
        { name: 'ETF Trades' as const, value: '$0' as const },
        { name: 'Options Trades' as const, value: '$0.50 per contract' as const },
        { name: 'Mutual Fund Trades' as const, value: '$9.95' as const }
      ]
    },
    {
      category: 'Account' as const,
      features: [
        { name: 'Account Minimum' as const, value: '$0' as const },
        { name: 'Inactivity Fee' as const, value: 'None' as const },
        { name: 'Transfer Fee' as const, value: '$25' as const },
        { name: 'Wire Transfer Fee' as const, value: '$20' as const }
      ]
    }
  ],
  comparisonBrokers: [
    {
      name: 'Charles Schwab' as const,
      slug: 'charles-schwab' as const,
      rating: 4.6 as const,
      stockFee: 0 as const,
      minDeposit: 0 as const,
      logo_url: 'https://images.unsplash.com/photo-1620205334939-211dd2af1556?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxzY2h3YWIlMjBsb2dvJTIwZmluYW5jaWFsJTIwaW52ZXN0bWVudHxlbnwwfDJ8fGJsdWV8MTc1NTMyNzc4NXww&ixlib=rb-4.1.0&q=85' as const
    },
    {
      name: 'Fidelity' as const,
      slug: 'fidelity' as const,
      rating: 4.5 as const,
      stockFee: 0 as const,
      minDeposit: 0 as const,
      logo_url: 'https://images.unsplash.com/photo-1662201966782-395ada85ec09?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw0fHxmaWRlbGl0eSUyMGxvZ28lMjBmaW5hbmNpYWwlMjBpbnZlc3RtZW50fGVufDB8Mnx8Z3JlZW58MTc1NTMyNzc4NXww&ixlib=rb-4.1.0&q=85' as const
    },
    {
      name: 'E*TRADE' as const,
      slug: 'etrade' as const,
      rating: 4.3 as const,
      stockFee: 0 as const,
      minDeposit: 0 as const,
      logo_url: 'https://images.unsplash.com/photo-1651055705032-d4187855b004?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxsb2dvJTIwZmluYW5jaWFsJTIwaW52ZXN0bWVudCUyMGFsbHl8ZW58MHwyfHx8MTc1NTMyNzc4NXww&ixlib=rb-4.1.0&q=85' as const
    },
    {
      name: 'TD Ameritrade' as const,
      slug: 'td-ameritrade' as const,
      rating: 4.4 as const,
      stockFee: 0 as const,
      minDeposit: 0 as const,
      logo_url: 'https://images.unsplash.com/photo-1651055705032-d4187855b004?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxsb2dvJTIwZmluYW5jaWFsJTIwaW52ZXN0bWVudCUyMGFsbHl8ZW58MHwyfHx8MTc1NTMyNzc4NXww&ixlib=rb-4.1.0&q=85' as const
    },
    {
      name: 'Robinhood' as const,
      slug: 'robinhood' as const,
      rating: 3.8 as const,
      stockFee: 0 as const,
      minDeposit: 0 as const,
      logo_url: 'https://images.unsplash.com/photo-1651055705032-d4187855b004?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxsb2dvJTIwZmluYW5jaWFsJTIwaW52ZXN0bWVudCUyMGFsbHl8ZW58MHwyfHx8MTc1NTMyNzc4NXww&ixlib=rb-4.1.0&q=85' as const
    }
  ],
  feeComparison: {
    stockTrade: [
      { broker: 'Ally Invest' as const, fee: 0 as const },
      { broker: 'Charles Schwab' as const, fee: 0 as const },
      { broker: 'Fidelity' as const, fee: 0 as const },
      { broker: 'E*TRADE' as const, fee: 0 as const },
      { broker: 'TD Ameritrade' as const, fee: 0 as const }
    ],
    optionsTrade: [
      { broker: 'Ally Invest' as const, fee: 0.5 as const },
      { broker: 'Charles Schwab' as const, fee: 0.65 as const },
      { broker: 'Fidelity' as const, fee: 0.65 as const },
      { broker: 'E*TRADE' as const, fee: 0.65 as const },
      { broker: 'TD Ameritrade' as const, fee: 0.65 as const }
    ]
  },
  reviews: [
    {
      id: 'review-001' as const,
      user_name: 'Sarah M.' as const,
      rating: 5 as const,
      title: 'Great platform for beginners' as const,
      content: 'Ally Invest has been perfect for my investment journey. The commission-free trades and easy-to-use interface make it ideal for someone just starting out. Customer service has been responsive when I had questions.' as const,
      created_at: '2024-12-15T10:30:00Z' as const,
      trading_experience: TradingExperience.BEGINNER,
      verified: true as const,
      helpful_count: 23 as const
    },
    {
      id: 'review-002' as const,
      user_name: 'Mike R.' as const,
      rating: 4 as const,
      title: 'Solid broker with room for improvement' as const,
      content: 'Been using Ally Invest for 2 years. Love the zero commissions and research tools. However, I wish they had more international markets and better charting capabilities. Overall satisfied with the service.' as const,
      created_at: '2024-12-10T14:22:00Z' as const,
      trading_experience: TradingExperience.INTERMEDIATE,
      verified: true as const,
      helpful_count: 18 as const
    },
    {
      id: 'review-003' as const,
      user_name: 'Jennifer L.' as const,
      rating: 3 as const,
      title: 'Good for basic trading' as const,
      content: 'Ally Invest works well for basic stock and ETF trading. The mobile app is decent but could use more advanced features. Limited options for active traders who need sophisticated tools.' as const,
      created_at: '2024-12-08T09:15:00Z' as const,
      trading_experience: TradingExperience.ADVANCED,
      verified: false as const,
      helpful_count: 12 as const
    }
  ],
  faqs: [
    {
      question: 'What is the minimum deposit required to open an Ally Invest account?' as const,
      answer: 'There is no minimum deposit required to open an Ally Invest account. You can start investing with any amount you\'re comfortable with.' as const,
      category: 'account' as const
    },
    {
      question: 'Does Ally Invest charge commissions for stock trades?' as const,
      answer: 'No, Ally Invest offers commission-free stock and ETF trades. Options trades are charged $0.50 per contract.' as const,
      category: 'fees' as const
    },
    {
      question: 'What types of investment accounts does Ally Invest offer?' as const,
      answer: 'Ally Invest offers Individual taxable accounts, Joint accounts, Traditional IRA, Roth IRA, SEP-IRA, and other retirement account types.' as const,
      category: 'account' as const
    },
    {
      question: 'Is Ally Invest SIPC insured?' as const,
      answer: 'Yes, Ally Invest is a member of SIPC (Securities Investor Protection Corporation), which protects securities customers up to $500,000 (including $250,000 for cash claims).' as const,
      category: 'safety' as const
    },
    {
      question: 'Can I trade international stocks with Ally Invest?' as const,
      answer: 'Ally Invest primarily focuses on US markets. International trading options are limited compared to some other brokers.' as const,
      category: 'trading' as const
    }
  ],
  expertReview: {
    author: {
      name: 'Michael Thompson' as const,
      title: 'Senior Financial Analyst' as const,
      credentials: 'CFA, 15+ years experience' as const,
      avatar_url: 'https://i.pravatar.cc/150?img=1' as const,
      bio: 'Michael Thompson is a Chartered Financial Analyst with over 15 years of experience in investment analysis and brokerage evaluation. He has tested over 50 online brokers and specializes in retail investor platforms.' as const
    },
    content: 'Ally Invest stands out as an excellent choice for beginning to intermediate investors seeking a straightforward, cost-effective trading platform. The commission-free stock and ETF trades, combined with no account minimums, make it particularly attractive for new investors. While the platform may lack some advanced features that sophisticated traders require, its simplicity and reliability make it a solid choice for long-term investors focused on building diversified portfolios.' as const,
    rating: 4.2 as const,
    updated_at: '2024-12-20T10:00:00Z' as const
  }
};

