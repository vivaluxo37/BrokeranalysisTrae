// Mock data for broker analysis platform

export const mockStore = {
  user: {
    id: 'user_123',
    email: 'trader@example.com',
    preferences: {
      language: 'en' as const,
      currency: 'USD' as const,
      experience: 'intermediate' as const,
      preferredAssets: ['forex', 'stocks', 'crypto'] as const
    },
    savedBrokers: ['interactive-brokers', 'td-ameritrade', 'etoro'],
    savedComparisons: [
      {
        id: 'comp_1',
        brokers: ['interactive-brokers', 'td-ameritrade'],
        createdAt: '2024-01-15T10:30:00Z'
      }
    ]
  },
  filters: {
    assetClasses: [],
    regulators: [],
    countries: [],
    minDeposit: null,
    tradingCost: null,
    platforms: []
  }
};

export const mockQuery = {
  topRatedBrokers: [
    {
      id: 'interactive-brokers',
      name: 'Interactive Brokers',
      slug: 'interactive-brokers',
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100',
      rating: 4.8,
      trustScore: 95,
      minDeposit: 0,
      spreads: {
        eurusd: 0.1,
        gbpusd: 0.2,
        usdjpy: 0.1
      },
      instruments: 5000,
      regulators: ['sec', 'finra', 'fca'],
      keyFeatures: ['Low fees', 'Global markets', 'Professional tools'],
      pros: ['Excellent execution', 'Low costs', 'Wide instrument selection'],
      cons: ['Complex interface', 'High learning curve'],
      isPromoted: false
    },
    {
      id: 'td-ameritrade',
      name: 'TD Ameritrade',
      slug: 'td-ameritrade',
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100',
      rating: 4.6,
      trustScore: 92,
      minDeposit: 0,
      spreads: {
        eurusd: 0.3,
        gbpusd: 0.4,
        usdjpy: 0.3
      },
      instruments: 3000,
      regulators: ['sec', 'finra'],
      keyFeatures: ['Commission-free stocks', 'thinkorswim platform', 'Education'],
      pros: ['Great platform', 'Educational resources', 'No commission stocks'],
      cons: ['Higher forex spreads', 'US only'],
      isPromoted: true
    },
    {
      id: 'etoro',
      name: 'eToro',
      slug: 'etoro',
      logo: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=100&h=100',
      rating: 4.4,
      trustScore: 88,
      minDeposit: 200,
      spreads: {
        eurusd: 1.0,
        gbpusd: 1.5,
        usdjpy: 1.0
      },
      instruments: 2000,
      regulators: ['fca', 'cysec', 'asic'],
      keyFeatures: ['Social trading', 'Copy trading', 'Crypto'],
      pros: ['Social features', 'User-friendly', 'Crypto support'],
      cons: ['Higher spreads', 'Limited research'],
      isPromoted: false
    }
  ],
  popularComparisons: [
    {
      title: 'Interactive Brokers vs TD Ameritrade',
      slug: 'interactive-brokers-vs-td-ameritrade',
      description: 'Compare two top US brokers for stocks and options trading'
    },
    {
      title: 'eToro vs Plus500',
      slug: 'etoro-vs-plus500',
      description: 'Social trading vs traditional CFD broker comparison'
    },
    {
      title: 'Best Forex Brokers 2024',
      slug: 'best-forex-brokers-2024',
      description: 'Top-rated forex brokers with tight spreads and regulation'
    }
  ],
  latestReviews: [
    {
      id: 'review_1',
      title: 'Interactive Brokers Review 2024: Pros, Cons & Verdict',
      excerpt: 'Comprehensive review of Interactive Brokers covering fees, platforms, and regulation.',
      image: 'https://images.unsplash.com/photo-1586448681913-2fc1b29c5cca?w=400&h=200',
      publishedAt: '2024-01-10T09:00:00Z',
      readTime: 8,
      slug: 'interactive-brokers-review-2024'
    },
    {
      id: 'review_2',
      title: 'eToro Social Trading: Complete Guide & Analysis',
      excerpt: 'In-depth look at eToro\'s social trading features and investment options.',
      image: 'https://images.unsplash.com/photo-1587401511935-a7f87afadf2f?w=400&h=200',
      publishedAt: '2024-01-08T14:30:00Z',
      readTime: 6,
      slug: 'etoro-social-trading-guide'
    }
  ],
  testimonials: [
    {
      id: 1,
      quote: "BrokerAnalysis helped me find the perfect broker for my trading style. The comparison tools are incredibly detailed.",
      author: "Sarah Johnson",
      position: "Day Trader",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5
    },
    {
      id: 2,
      quote: "The educational content and broker reviews are top-notch. I finally understand how to choose a reliable broker.",
      author: "Michael Chen",
      position: "Investment Advisor",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 5
    }
  ]
};

export const mockRootProps = {
  currentLanguage: 'en' as const,
  userPreferences: {
    currency: 'USD' as const,
    experience: 'intermediate' as const,
    preferredAssets: ['forex', 'stocks'] as const
  },
  isAuthenticated: false,
  searchQuery: '',
  activeFilters: {
    assetClasses: [],
    regulators: [],
    countries: []
  }
};