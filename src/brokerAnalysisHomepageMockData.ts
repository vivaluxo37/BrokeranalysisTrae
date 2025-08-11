// Mock data for BrokerAnalysis homepage
import { AccountType, AssetClass, BrokerCategory, RegulatorType, ReviewType, ToolType, TradingPlatform } from './enums';

// Data for global state store
export const mockStore = {
  user: {
    isAuthenticated: false,
    preferences: {
      language: 'en' as const,
      region: 'global' as const,
      theme: 'professional' as const
    }
  },
  search: {
    recentSearches: [
      'IG Markets',
      'XM Global', 
      'Coinbase Pro'
    ],
    popularSearches: [
      'Best Forex Brokers',
      'Low Spread Brokers',
      'Crypto Trading Platforms'
    ]
  }
};

// Data returned by API queries
export const mockQuery = {
  topRatedBrokers: [
    {
      id: 'broker-1',
      name: 'IG Markets',
      logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=100&h=100&fit=crop&crop=center',
      rating: 4.8,
      reviewCount: 12500,
      avgSpread: 0.6,
      minDeposit: 250,
      leverage: 200,
      regulationBadges: ['FCA', 'ASIC'],
      featured: true,
      assetClasses: [AssetClass.FOREX, AssetClass.STOCKS, AssetClass.CFD]
    },
    {
      id: 'broker-2', 
      name: 'XM Global',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop&crop=center',
      rating: 4.6,
      reviewCount: 8900,
      avgSpread: 1.0,
      minDeposit: 5,
      leverage: 888,
      regulationBadges: ['CySEC', 'ASIC'],
      featured: true,
      assetClasses: [AssetClass.FOREX, AssetClass.CFD, AssetClass.COMMODITIES]
    },
    {
      id: 'broker-3',
      name: 'Coinbase Pro', 
      logo: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=100&h=100&fit=crop&crop=center',
      rating: 4.4,
      reviewCount: 15600,
      avgSpread: 0.5,
      minDeposit: 1,
      leverage: 3,
      regulationBadges: ['SEC'],
      featured: true,
      assetClasses: [AssetClass.CRYPTO]
    },
    {
      id: 'broker-4',
      name: 'Plus500',
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100&fit=crop&crop=center',
      rating: 4.2,
      reviewCount: 9800,
      avgSpread: 0.8,
      minDeposit: 100,
      leverage: 300,
      regulationBadges: ['FCA', 'CySEC'],
      featured: true,
      assetClasses: [AssetClass.CFD, AssetClass.FOREX]
    }
  ],
  marketNews: [
    {
      id: 'news-1',
      title: 'Federal Reserve Signals Rate Cut Expectations for 2024',
      excerpt: 'Latest FOMC meeting minutes reveal dovish sentiment among policymakers as inflation shows signs of cooling.',
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop',
      publishDate: '2024-01-15T10:30:00Z' as const,
      category: 'Central Banks' as const,
      readTime: '3 min read'
    },
    {
      id: 'news-2', 
      title: 'Bitcoin ETF Approval Drives Crypto Broker Surge',
      excerpt: 'Major cryptocurrency exchanges report 300% increase in new account registrations following SEC approval.',
      thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=200&fit=crop',
      publishDate: '2024-01-14T15:45:00Z' as const,
      category: 'Cryptocurrency' as const,
      readTime: '5 min read'
    },
    {
      id: 'news-3',
      title: 'European Markets Rally on ECB Policy Outlook', 
      excerpt: 'STOXX 600 reaches new highs as traders position for potential monetary policy shifts in the eurozone.',
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=200&fit=crop',
      publishDate: '2024-01-13T09:20:00Z' as const,
      category: 'European Markets' as const,
      readTime: '4 min read'
    }
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      quote: 'BrokerAnalysis helped me find the perfect broker for my trading style. The comparison tools are incredibly detailed and accurate.',
      author: 'Sarah Chen',
      location: 'Singapore',
      rating: 5,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: 'testimonial-2',
      quote: 'Finally, a platform that provides honest, unbiased broker reviews. The real-time spread data saved me thousands in trading costs.',
      author: 'Marcus Weber', 
      location: 'Germany',
      rating: 5,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: 'testimonial-3',
      quote: 'The educational content is top-notch. I went from a complete beginner to profitable trader in just 6 months.',
      author: 'Jennifer Rodriguez',
      location: 'United States',
      rating: 5,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=3'
    }
  ],
  trustLogos: [
    { name: 'Investopedia', logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=40&fit=crop' },
    { name: 'FX Empire', logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=120&h=40&fit=crop' },
    { name: 'DailyForex', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=40&fit=crop' }
  ]
};

// Data passed as props to the root component
export const mockRootProps = {
  trustStats: {
    totalTraders: 2500000,
    totalBrokers: 500,
    totalReviews: 2500000,
    averageRating: 4.6,
    yearsOfExperience: 15
  },
  heroData: {
    title: 'Find the Best Forex, Stocks, Crypto & CFD Brokers—Worldwide',
    subtitle: 'Data-driven reviews, live spreads, user feedback & expert analysis—all in one place.',
    searchPlaceholder: 'Search brokers, platforms, or instruments...',
    ctaPrimary: 'Search',
    ctaSecondary: 'Use Advanced Filter'
  },
  trustFeatures: [
    {
      type: 'independent_data' as const,
      title: 'Independent Data',
      description: '600+ data points per broker',
      icon: 'database' as const
    },
    {
      type: 'real_time_spreads' as const,
      title: 'Real-Time Spreads', 
      description: 'Live feed from 30+ exchanges',
      icon: 'activity' as const
    },
    {
      type: 'verified_reviews' as const,
      title: 'Verified Reviews',
      description: 'Fraud-checked, trader-submitted', 
      icon: 'shield-check' as const
    },
    {
      type: 'expert_insights' as const,
      title: 'Expert Insights',
      description: 'Daily analysis by pros',
      icon: 'trending-up' as const
    }
  ],
  educationLevels: [
    {
      level: 'beginner' as const,
      title: 'Beginner',
      description: 'Start your trading journey with fundamental concepts and basic strategies.',
      courseCount: 25,
      estimatedTime: '2-4 weeks'
    },
    {
      level: 'intermediate' as const, 
      title: 'Intermediate',
      description: 'Advance your skills with technical analysis and risk management techniques.',
      courseCount: 18,
      estimatedTime: '4-6 weeks'
    },
    {
      level: 'advanced' as const,
      title: 'Advanced', 
      description: 'Master complex strategies and algorithmic trading approaches.',
      courseCount: 12,
      estimatedTime: '6-8 weeks'
    }
  ],
  tradingTools: [
    {
      type: 'economic_calendar' as const,
      title: 'Economic Calendar',
      description: 'Track market-moving events and economic releases',
      icon: 'calendar' as const,
      link: '/tools/economic-calendar'
    },
    {
      type: 'position_size_calculator' as const,
      title: 'Position-Size Calculator',
      description: 'Calculate optimal position sizes for risk management',
      icon: 'calculator' as const, 
      link: '/tools/position-calculator'
    },
    {
      type: 'swap_analyzer' as const,
      title: 'Swap Analyzer',
      description: 'Compare overnight financing costs across brokers',
      icon: 'refresh-cw' as const,
      link: '/tools/swap-analyzer'
    },
    {
      type: 'correlation_matrix' as const,
      title: 'Correlation Matrix',
      description: 'Analyze relationships between currency pairs and assets',
      icon: 'grid' as const,
      link: '/tools/correlation-matrix'
    },
    {
      type: 'spread_comparison' as const,
      title: 'Spread Comparison',
      description: 'Compare real-time spreads across multiple brokers',
      icon: 'bar-chart' as const,
      link: '/tools/spread-comparison'
    },
    {
      type: 'fee_calculator' as const,
      title: 'Fee Calculator',
      description: 'Calculate total trading costs and fees',
      icon: 'dollar-sign' as const,
      link: '/tools/fee-calculator'
    }
  ],
  assetCategories: [
    {
      type: AssetClass.FOREX as const,
      title: "Forex Brokers" as const,
      description: "Trade 50+ currency pairs with tight spreads" as const,
      brokerCount: 180,
      icon: "trending-up" as const,
      featured: true
    },
    {
      type: AssetClass.STOCKS as const,
      title: "Stock Brokers" as const,
      description: "Access global stock markets and ETFs" as const,
      brokerCount: 95,
      icon: "bar-chart-3" as const,
      featured: true
    },
    {
      type: AssetClass.CRYPTO as const,
      title: "Crypto Brokers" as const,
      description: "Trade Bitcoin, Ethereum and 100+ altcoins" as const,
      brokerCount: 67,
      icon: "coins" as const,
      featured: true
    },
    {
      type: AssetClass.CFD as const,
      title: "CFD Brokers" as const,
      description: "Contract for difference trading on various assets" as const,
      brokerCount: 120,
      icon: "line-chart" as const,
      featured: true
    }
  ],
  trustIndicators: {
    totalBrokers: 500,
    totalReviews: 2500000,
    averageRating: 4.6,
    regulatedBrokers: 485,
    yearsOfExperience: 15,
    countriesServed: 180
  }
};
