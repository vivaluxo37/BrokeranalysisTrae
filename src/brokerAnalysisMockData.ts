// Mock data for BrokerAnalysis platform
// This file contains sample data for development and testing purposes

import type {
  AssetCategory,
  Broker,
  BrokerReview,
  EducationLevel,
  NewsArticle,
  TradingTool,
  TrustIndicators,
  UserTestimonial
} from './types/broker';
import {
  AccountType,
  AssetClass,
  BrokerCategory,
  RegulatorType,
  ReviewType,
  ToolType,
  TradingPlatform
} from './enums';

// Data passed as props to the root component
const mockRootProps: {
  heroSection: {
    title: string;
    subtitle: string;
    ctaText: string;
    backgroundImage: string;
  };

featuredBrokers: Broker[];
  assetCategories: AssetCategory[];
  tradingTools: TradingTool[];
  trustIndicators: TrustIndicators;
  recentReviews: BrokerReview[];
  trustFeatures: {
    icon: string;
    title: string;
    description: string;
  }[];
  educationLevels: EducationLevel[];
} = {
  // Hero section data
  heroData: {
    title: "Find Your Perfect Trading Partner" as const,
    subtitle: "Compare 500+ Regulated Brokers Worldwide" as const,
    searchPlaceholder: "Search brokers, platforms, or instruments..." as const,
    ctaPrimary: "Find Brokers" as const,
    ctaSecondary: "Compare Brokers" as const
  },
  
  // Featured brokers data
  featuredBrokers: [
    {
      id: "broker-1",
      name: "TradePro Markets",
      logo: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20professional%20trading%20company%20logo%20with%20blue%20and%20white%20colors%2C%20clean%20design%2C%20financial%20theme&image_size=square",
      rating: 4.8,
      reviewCount: 2847,
      regulators: [RegulatorType.FCA, RegulatorType.CYSEC],
      minDeposit: 100,
      maxLeverage: 500,
      spreadsFrom: 0.8,
      assetClasses: [AssetClass.FOREX, AssetClass.STOCKS, AssetClass.COMMODITIES],
      platforms: [TradingPlatform.MT4, TradingPlatform.MT5, TradingPlatform.WEBTRADER],
      category: BrokerCategory.RETAIL,
      featured: true
    } as Broker,
    {
      id: "broker-2",
      name: "GlobalFX Elite",
      logo: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20forex%20trading%20logo%20with%20gold%20and%20black%20colors%2C%20premium%20design%2C%20global%20finance%20theme&image_size=square",
      rating: 4.6,
      reviewCount: 1923,
      regulators: [RegulatorType.ASIC, RegulatorType.FCA],
      minDeposit: 250,
      maxLeverage: 400,
      spreadsFrom: 1.2,
      assetClasses: [AssetClass.FOREX, AssetClass.INDICES, AssetClass.CRYPTO],
      platforms: [TradingPlatform.MT4, TradingPlatform.CTRADER, TradingPlatform.WEBTRADER],
      category: BrokerCategory.RETAIL,
      featured: true
    } as Broker,
    {
      id: "broker-3",
      name: "InvestMax Pro",
      logo: "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20investment%20company%20logo%20with%20green%20and%20silver%20colors%2C%20modern%20design%2C%20wealth%20management%20theme&image_size=square",
      rating: 4.7,
      reviewCount: 3156,
      regulators: [RegulatorType.SEC, RegulatorType.FINRA],
      minDeposit: 500,
      maxLeverage: 200,
      spreadsFrom: 0.5,
      assetClasses: [AssetClass.STOCKS, AssetClass.ETFS, AssetClass.OPTIONS],
      platforms: [TradingPlatform.PROPRIETARY, TradingPlatform.WEBTRADER, TradingPlatform.MOBILE],
      category: BrokerCategory.INSTITUTIONAL,
      featured: true
    } as Broker
  ],
  

  // Asset class categories
  assetCategories: [
    {
      id: "forex",
      name: "Forex Trading",
      description: "Trade major, minor, and exotic currency pairs with tight spreads",
      icon: "TrendingUp",
      brokerCount: 156,
      popularPairs: ["EUR/USD", "GBP/USD", "USD/JPY"],
      avgSpread: 0.8,
      maxLeverage: 500,
      assetClass: AssetClass.FOREX
    } as AssetCategory,
    {
      id: "stocks",
      name: "Stock Trading",
      description: "Invest in global equities from major exchanges worldwide",
      icon: "BarChart3",
      brokerCount: 89,
      popularPairs: ["AAPL", "TSLA", "MSFT"],
      avgSpread: 0.02,
      maxLeverage: 10,
      assetClass: AssetClass.STOCKS
    } as AssetCategory,
    {
      id: "crypto",
      name: "Cryptocurrency",
      description: "Trade Bitcoin, Ethereum, and other digital assets 24/7",
      icon: "Coins",
      brokerCount: 67,
      popularPairs: ["BTC/USD", "ETH/USD", "ADA/USD"],
      avgSpread: 0.1,
      maxLeverage: 100,
      assetClass: AssetClass.CRYPTO
    } as AssetCategory
  ],
  
  // Trading tools data
  tradingTools: [
    {
      type: "comparison",
      title: "Broker Comparison",
      description: "Compare brokers side by side",
      icon: "grid",
      link: "/tools/comparison"
    },
    {
      type: "calculator",
      title: "Fee Calculator",
      description: "Calculate your trading costs",
      icon: "calculator",
      link: "/tools/calculator"
    },
    {
      type: "scanner",
      title: "Market Scanner",
      description: "Scan markets for opportunities",
      icon: "bar-chart",
      link: "/tools/scanner"
    },
    {
      type: "calendar",
      title: "Economic Calendar",
      description: "Track important market events",
      icon: "calendar",
      link: "/tools/calendar"
    },
    {
      type: "signals",
      title: "Trading Signals",
      description: "Get expert trading recommendations",
      icon: "refresh-cw",
      link: "/tools/signals"
    },
    {
      type: "copy-trading",
      title: "Copy Trading",
      description: "Follow and copy successful traders",
      icon: "dollar-sign",
      link: "/tools/copy-trading"
    }
  ],
  
  // Trust indicators
  trustIndicators: {
    totalBrokers: 500,
    totalReviews: 2500000,
    averageRating: 4.6,
    regulatedBrokers: 485,
    yearsOfExperience: 15,
    countriesServed: 180
  },
  
  // Recent reviews data
  recentReviews: [
    {
      id: "review-1",
      brokerId: "broker-1",
      brokerName: "TradePro Markets",
      rating: 5,
      title: "Excellent platform for beginners",
      excerpt: "Great customer service and easy-to-use platform. Spreads are competitive.",
      content: "I've been trading with TradePro Markets for 6 months now and I'm very satisfied. The platform is intuitive, customer service responds quickly, and the spreads are competitive. Highly recommended for beginners.",
      author: "Sarah M.",
      date: "2024-01-15",
      verified: true,
      helpful: 24,
      type: ReviewType.POSITIVE,
      pros: ["Great customer service", "Competitive spreads", "User-friendly platform"],
      cons: ["Limited educational resources"]
    } as BrokerReview,
    {
      id: "review-2",
      brokerId: "broker-2",
      brokerName: "GlobalFX Elite",
      rating: 4,
      title: "Good for forex trading",
      excerpt: "Solid platform with good execution speeds. Could improve mobile app.",
      content: "GlobalFX Elite offers a solid trading experience with fast execution and good spreads. The desktop platform is excellent, but the mobile app could use some improvements. Overall satisfied with the service.",
      author: "Mike R.",
      date: "2024-01-12",
      verified: true,
      helpful: 18,
      type: ReviewType.POSITIVE,
      pros: ["Fast execution", "Good spreads", "Reliable platform"],
      cons: ["Mobile app needs improvement", "Limited crypto options"]
    } as BrokerReview
  ],
  
  // Trust features data
  trustFeatures: [
    {
      type: 'independent_data',
      title: 'Independent Data',
      description: '600+ data points per broker',
      icon: 'database'
    },
    {
      type: 'real_time_spreads',
      title: 'Real-Time Spreads',
      description: 'Live feed from 30+ exchanges',
      icon: 'activity'
    },
    {
      type: 'verified_reviews',
      title: 'Verified Reviews',
      description: 'Fraud-checked, trader-submitted',
      icon: 'shield-check'
    },
    {
      type: 'expert_insights',
      title: 'Expert Insights',
      description: 'Daily analysis by pros',
      icon: 'trending-up'
    }
  ],

  // Education levels data
  educationLevels: [
    {
      id: "beginner",
      title: "Beginner",
      description: "New to trading? Start here with basic concepts",
      icon: "GraduationCap",
      courseCount: 12,
      estimatedTime: "2-4 weeks",
      difficulty: "Easy",
      topics: ["Trading Basics", "Market Analysis", "Risk Management"],
      prerequisites: [],
      completionRate: 85
    } as EducationLevel,
    {
      id: "intermediate",
      title: "Intermediate",
      description: "Build on your knowledge with advanced strategies",
      icon: "TrendingUp",
      courseCount: 18,
      estimatedTime: "4-8 weeks",
      difficulty: "Medium",
      topics: ["Technical Analysis", "Trading Psychology", "Portfolio Management"],
      prerequisites: ["beginner"],
      completionRate: 72
    } as EducationLevel,
    {
      id: "advanced",
      title: "Advanced",
      description: "Master professional trading techniques",
      icon: "Target",
      courseCount: 24,
      estimatedTime: "8-12 weeks",
      difficulty: "Hard",
      topics: ["Algorithmic Trading", "Options Strategies", "Market Making"],
      prerequisites: ["beginner", "intermediate"],
      completionRate: 58
    } as EducationLevel
  ]
};

// Export the main mock data
export { mockRootProps };

// Data returned by API queries
export const mockQuery: {
  topRatedBrokers: Broker[];
  marketNews: NewsArticle[];
  testimonials: UserTestimonial[];
} = {
  topRatedBrokers: [
    {
      id: 'broker-1',
      name: 'IG Markets',
      logo: '/assets/brokers/logos/ig-markets.png',
      rating: 4.8,
      reviewCount: 12500,
      avgSpread: 0.6,
      minDeposit: 250,
      leverage: 200,
      regulationBadges: ['FCA', 'ASIC'],
      featured: true,
      assetClasses: ['FOREX', 'STOCKS', 'CFD']
    },
    {
      id: 'broker-2', 
      name: 'XM Global',
      logo: '/assets/brokers/logos/xm-global.png',
      rating: 4.6,
      reviewCount: 8900,
      avgSpread: 1.0,
      minDeposit: 5,
      leverage: 888,
      regulationBadges: ['CySEC', 'ASIC'],
      featured: true,
      assetClasses: ['FOREX', 'CFD', 'COMMODITIES']
    },
    {
      id: 'broker-3',
      name: 'Interactive Brokers', 
      logo: '/assets/brokers/logos/interactive-brokers.png',
      rating: 4.4,
      reviewCount: 15600,
      avgSpread: 0.1,
      minDeposit: 0,
      leverage: 50,
      regulationBadges: ['SEC', 'FINRA'],
      featured: true,
      assetClasses: ['STOCKS', 'OPTIONS', 'FUTURES']
    }
  ],
  marketNews: [
    {
      id: 'news-1',
      title: 'Federal Reserve Announces New Interest Rate Decision',
      summary: 'The Fed\'s latest decision impacts forex markets and trading strategies across major currency pairs.',
      content: 'The Federal Reserve announced a 0.25% interest rate increase, marking the third consecutive hike this year. This decision significantly impacts forex trading strategies, particularly for USD pairs. Traders should adjust their positions accordingly and monitor upcoming economic indicators.',
      date: '2024-01-15',
      author: 'Financial Times Editorial',
      source: 'Financial Times',
      category: 'Central Banking',
      tags: ['Federal Reserve', 'Interest Rates', 'Forex', 'USD'],
      readTime: 3,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=federal%20reserve%20building%20with%20financial%20charts%20overlay%2C%20professional%20news%20style&image_size=landscape_16_9'
    } as NewsArticle,
    {
      id: 'news-2',
      title: 'New Cryptocurrency Regulations Affect Trading Platforms',
      summary: 'Recent regulatory changes impact how crypto brokers operate and what traders need to know.',
      content: 'New cryptocurrency regulations introduced by major financial authorities are reshaping the landscape for crypto trading platforms. These changes affect KYC requirements, leverage limits, and operational standards for brokers offering cryptocurrency trading services.',
      date: '2024-01-14',
      author: 'CoinDesk Regulatory Team',
      source: 'CoinDesk',
      category: 'Regulation',
      tags: ['Cryptocurrency', 'Regulation', 'Trading Platforms', 'KYC'],
      readTime: 5,
      image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=cryptocurrency%20regulation%20concept%2C%20legal%20documents%20with%20bitcoin%20symbols%2C%20professional%20style&image_size=landscape_16_9'
    } as NewsArticle
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      quote: 'BrokerAnalysis helped me find the perfect broker for my trading style. The comparison tools are incredibly detailed and accurate.',
      author: 'Sarah Chen',
      location: 'Singapore',
      rating: 5,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=1',
      date: '2024-01-10',
      name: 'Sarah Chen',
      role: 'Day Trader',
      content: 'BrokerAnalysis helped me find the perfect broker for my trading style. The comparison tools are incredibly detailed and accurate.'
    } as UserTestimonial,
    {
      id: 'testimonial-2',
      quote: 'Finally, a platform that provides honest, unbiased broker reviews. The real-time spread data saved me thousands in trading costs.',
      author: 'Marcus Weber', 
      location: 'Germany',
      rating: 5,
      verified: true,
      avatar: 'https://i.pravatar.cc/150?img=2',
      date: '2024-01-08',
      name: 'Marcus Weber',
      role: 'Forex Trader',
      content: 'Finally, a platform that provides honest, unbiased broker reviews. The real-time spread data saved me thousands in trading costs.'
    } as UserTestimonial
  ],
  trustLogos: [
    { name: 'Investopedia', logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=120&h=40&fit=crop' },
    { name: 'FX Empire', logo: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=120&h=40&fit=crop' },
    { name: 'DailyForex', logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=120&h=40&fit=crop' }
  ]
};