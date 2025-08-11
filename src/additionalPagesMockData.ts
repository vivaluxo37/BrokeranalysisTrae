// Mock data for additional BrokerAnalysis pages
import { AccountType, AssetClass, BrokerCategory, RegulatorType, ReviewType, ToolType, TradingPlatform } from './enums';

// Data for global state store
export const mockStore = {
  filters: {
    assetClass: '',
    region: '',
    regulation: '',
    minDeposit: '',
    spread: '',
    sortBy: 'rating_desc' as const
  },
  comparison: {
    selectedBrokers: [] as string[],
    maxBrokers: 4
  },
  user: {
    isAuthenticated: false,
    preferences: {
      language: 'en' as const,
      currency: 'USD' as const,
      timezone: 'UTC' as const
    }
  }
};

// Data returned by API queries
export const mockQuery = {
  brokerDirectory: {
    brokers: [
      {
        id: 'broker-1',
        name: 'IG Markets',
        logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop',
        rating: 4.8,
        reviewCount: 12500,
        assetClasses: ['Forex', 'Stocks', 'CFDs'],
        regulation: ['FCA', 'ASIC'],
        minDeposit: 250,
        avgSpread: 0.6,
        platforms: ['Proprietary', 'MT4'],
        founded: 1974,
        headquarters: 'London, UK'
      },
      {
        id: 'broker-2',
        name: 'XM Global',
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop',
        rating: 4.6,
        reviewCount: 8900,
        assetClasses: ['Forex', 'CFDs', 'Commodities'],
        regulation: ['CySEC', 'ASIC'],
        minDeposit: 5,
        avgSpread: 1.0,
        platforms: ['MT4', 'MT5'],
        founded: 2009,
        headquarters: 'Cyprus'
      },
      {
        id: 'broker-3',
        name: 'Coinbase Pro',
        logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop',
        rating: 4.4,
        reviewCount: 15600,
        assetClasses: ['Crypto'],
        regulation: ['SEC'],
        minDeposit: 1,
        avgSpread: 0.5,
        platforms: ['Proprietary', 'Mobile'],
        founded: 2012,
        headquarters: 'San Francisco, US'
      },
      {
        id: 'broker-4',
        name: 'Plus500',
        logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop',
        rating: 4.2,
        reviewCount: 9800,
        assetClasses: ['CFDs', 'Forex'],
        regulation: ['FCA', 'CySEC'],
        minDeposit: 100,
        avgSpread: 0.8,
        platforms: ['Proprietary'],
        founded: 2008,
        headquarters: 'London, UK'
      }
    ],
    totalCount: 500,
    currentPage: 1,
    totalPages: 50
  },
  brokerProfile: {
    id: 'broker-1',
    name: 'IG Markets',
    logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=200&h=200&fit=crop',
    rating: 4.8,
    reviewCount: 12500,
    description: 'IG Markets is a leading global provider of CFDs, forex, and spread betting.',
    pros: [
      'Excellent trading platforms',
      'Wide range of markets',
      'Strong regulation',
      'Educational resources'
    ],
    cons: [
      'Higher minimum deposit',
      'Complex fee structure',
      'Limited cryptocurrency options'
    ],
    fees: {
      forexSpread: 0.6,
      commission: 0,
      inactivityFee: 12,
      withdrawalFee: 0
    },
    regulation: [
      { authority: 'FCA', license: '195355', country: 'United Kingdom' },
      { authority: 'ASIC', license: '515106', country: 'Australia' }
    ],
    platforms: ['IG Trading Platform', 'MetaTrader 4', 'Mobile Apps'],
    accountTypes: ['Standard', 'Professional'],
    founded: 1974,
    headquarters: 'London, UK',
    customerSupport: '24/5',
    minDeposit: 250,
    maxLeverage: 200
  },
  userReviews: [
    {
      id: 'review-1',
      brokerId: 'broker-1',
      brokerName: 'IG Markets',
      userId: 'user-1',
      userName: 'TradingPro2024',
      userLocation: 'United Kingdom',
      rating: 5,
      title: 'Excellent platform for serious traders',
      pros: ['Great execution', 'Professional tools', 'Reliable platform'],
      cons: ['High minimum deposit', 'Complex for beginners'],
      review: 'Been using IG for over 2 years now and very satisfied with their service.',
      verified: true,
      helpful: 45,
      publishDate: '2024-01-15T10:30:00Z' as const,
      tradingExperience: 'advanced' as const
    },
    {
      id: 'review-2',
      brokerId: 'broker-2',
      brokerName: 'XM Global',
      userId: 'user-2',
      userName: 'ForexNewbie',
      userLocation: 'Germany',
      rating: 4,
      title: 'Good for beginners',
      pros: ['Low minimum deposit', 'Good education', 'Responsive support'],
      cons: ['Higher spreads', 'Limited research'],
      review: 'Started with XM as my first broker. Good experience overall.',
      verified: true,
      helpful: 23,
      publishDate: '2024-01-10T14:20:00Z' as const,
      tradingExperience: 'beginner' as const
    }
  ],
  forumThreads: [
    {
      id: 'thread-1',
      title: 'Best forex brokers for scalping strategies?',
      category: 'trading_strategies' as const,
      author: 'ScalpingMaster',
      authorAvatar: 'https://i.pravatar.cc/150?img=1',
      replies: 23,
      views: 1250,
      lastActivity: '2024-01-15T14:30:00Z' as const,
      isPinned: false,
      isLocked: false
    },
    {
      id: 'thread-2',
      title: 'How to choose the right leverage?',
      category: 'beginner_questions' as const,
      author: 'NewTrader2024',
      authorAvatar: 'https://i.pravatar.cc/150?img=2',
      replies: 45,
      views: 2100,
      lastActivity: '2024-01-14T16:45:00Z' as const,
      isPinned: true,
      isLocked: false
    }
  ],
  educationCourses: [
    {
      id: 'course-1',
      title: 'Forex Trading Fundamentals',
      description: 'Learn the basics of forex trading from currency pairs to market analysis.',
      level: 'beginner' as const,
      duration: '4 hours',
      lessons: 12,
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop',
      instructor: 'John Smith',
      rating: 4.7,
      enrollments: 15420
    },
    {
      id: 'course-2',
      title: 'Technical Analysis Mastery',
      description: 'Advanced technical analysis techniques for professional traders.',
      level: 'advanced' as const,
      duration: '8 hours',
      lessons: 24,
      thumbnail: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=300&h=200&fit=crop',
      instructor: 'Sarah Johnson',
      rating: 4.9,
      enrollments: 8750
    }
  ],
  newsArticles: [
    {
      id: 'news-1',
      title: 'Federal Reserve Signals Rate Cut Expectations for 2024',
      slug: 'fed-rate-cut-expectations-2024',
      excerpt: 'Latest FOMC meeting minutes reveal dovish sentiment among policymakers.',
      content: 'Full article content with detailed analysis...',
      author: 'Sarah Johnson',
      authorBio: 'Senior Financial Analyst with 10+ years experience',
      authorAvatar: 'https://i.pravatar.cc/150?img=2',
      publishDate: '2024-01-15T10:30:00Z' as const,
      readTime: 5,
      category: 'Central Banks' as const,
      tags: ['Federal Reserve', 'Interest Rates', 'Monetary Policy'],
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
      relatedArticles: ['news-2', 'news-3']
    }
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  brokerWizardSteps: [
    {
      step: 1,
      title: 'What do you want to trade?',
      description: 'Select your preferred asset classes',
      options: [
        { value: 'forex', label: 'Forex (Currency Pairs)', icon: 'trending-up' },
        { value: 'stocks', label: 'Stocks & ETFs', icon: 'bar-chart' },
        { value: 'crypto', label: 'Cryptocurrencies', icon: 'bitcoin' },
        { value: 'cfds', label: 'CFDs', icon: 'line-chart' },
        { value: 'commodities', label: 'Commodities', icon: 'package' }
      ]
    },
    {
      step: 2,
      title: "What's your experience level?",
      description: 'Help us recommend suitable brokers',
      options: [
        { value: 'beginner', label: 'Beginner (0-1 years)', description: 'New to trading' },
        { value: 'intermediate', label: 'Intermediate (1-3 years)', description: 'Some experience' },
        { value: 'advanced', label: 'Advanced (3+ years)', description: 'Experienced trader' },
        { value: 'professional', label: 'Professional', description: 'Trading professionally' }
      ]
    },
    {
      step: 3,
      title: 'How much can you deposit?',
      description: 'This helps us filter brokers by minimum deposit requirements',
      options: [
        { value: 'under_100', label: 'Under $100', description: 'Low minimum deposit' },
        { value: '100_500', label: '$100 - $500', description: 'Standard deposit range' },
        { value: '500_1000', label: '$500 - $1,000', description: 'Medium deposit range' },
        { value: '1000_5000', label: '$1,000 - $5,000', description: 'Higher deposit range' },
        { value: 'over_5000', label: 'Over $5,000', description: 'Premium account level' }
      ]
    },
    {
      step: 4,
      title: 'Which region do you prefer?',
      description: 'Regulatory preference and location',
      options: [
        { value: 'global', label: 'Global (Any Region)', description: 'No preference' },
        { value: 'us', label: 'United States', description: 'US regulated brokers' },
        { value: 'eu', label: 'European Union', description: 'EU regulated brokers' },
        { value: 'uk', label: 'United Kingdom', description: 'FCA regulated brokers' },
        { value: 'asia', label: 'Asia-Pacific', description: 'ASIC and other Asian regulators' }
      ]
    }
  ],
  tradingTools: [
    {
      id: 'economic-calendar',
      name: 'Economic Calendar',
      description: 'Track market-moving economic events and news releases',
      category: 'Market Analysis',
      icon: 'calendar',
      difficulty: 'beginner',
      features: ['Real-time updates', 'Impact indicators', 'Historical data', 'Custom filters']
    },
    {
      id: 'position-calculator',
      name: 'Position Size Calculator',
      description: 'Calculate optimal position sizes based on risk management rules',
      category: 'Risk Management',
      icon: 'calculator',
      difficulty: 'intermediate',
      features: ['Risk percentage', 'Stop loss levels', 'Multiple currencies', 'Lot size calculation']
    }
  ],
  teamMembers: [
    {
      name: 'Michael Chen',
      position: 'CEO & Founder',
      bio: 'Former investment banker with 15+ years in financial markets',
      avatar: 'https://i.pravatar.cc/150?img=3',
      linkedin: 'https://linkedin.com/in/michaelchen'
    },
    {
      name: 'Sarah Williams',
      position: 'Head of Research',
      bio: 'CFA charterholder specializing in broker analysis and market research',
      avatar: 'https://i.pravatar.cc/150?img=4',
      linkedin: 'https://linkedin.com/in/sarahwilliams'
    }
  ]
};