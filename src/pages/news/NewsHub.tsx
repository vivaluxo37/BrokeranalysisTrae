import React, { useMemo, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { BookOpen, Building, Calendar, Clock, Filter, Search, Shield, TrendingUp, BarChart3, Eye, Share2, Bookmark, ArrowUpRight, Tag } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { ProfessionalCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TopStories from '@/components/widgets/news/TopStories';

interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishDate: string;
  readTime: number;
  tags: string[];
  featured: boolean;
  imageUrl?: string;
  views?: number;
  likes?: number;
  bookmarked?: boolean;
  trending?: boolean;
}

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
}

interface TrendingTopic {
  topic: string;
  articles: number;
  trend: 'up' | 'down' | 'stable';
}

const NewsHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock market data
  const marketData: MarketData[] = [
    { symbol: 'EUR/USD', name: 'Euro/US Dollar', price: 1.0845, change: 0.0012, changePercent: 0.11, volume: '2.1B' },
    { symbol: 'GBP/USD', name: 'British Pound/US Dollar', price: 1.2634, change: -0.0023, changePercent: -0.18, volume: '1.8B' },
    { symbol: 'USD/JPY', name: 'US Dollar/Japanese Yen', price: 149.82, change: 0.45, changePercent: 0.30, volume: '1.9B' },
    { symbol: 'BTC/USD', name: 'Bitcoin/US Dollar', price: 43250, change: 1250, changePercent: 2.98, volume: '890M' }
  ];

  // Mock trending topics
  const trendingTopics: TrendingTopic[] = [
    { topic: 'Federal Reserve Policy', articles: 15, trend: 'up' },
    { topic: 'Cryptocurrency Regulation', articles: 12, trend: 'up' },
    { topic: 'European Markets', articles: 8, trend: 'stable' },
    { topic: 'AI Trading', articles: 6, trend: 'up' },
    { topic: 'Broker Mergers', articles: 4, trend: 'down' }
  ];

  const newsArticles: NewsArticle[] = [
    {
      id: '1',
      title: 'Top 10 Forex Brokers for 2025: Complete Analysis and Rankings',
      excerpt: 'Our comprehensive review of the best forex brokers for 2025, including new regulations, features, and trading conditions.',
      content: 'Detailed analysis of forex brokers...',
      category: 'Broker News',
      author: 'Trading Experts Team',
      publishDate: '2025-01-15',
      readTime: 8,
      tags: ['Forex', 'Brokers', '2025', 'Rankings'],
      featured: true,
      views: 15420,
      likes: 234,
      trending: true,
      imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20forex%20trading%20desk%20with%20multiple%20monitors%20showing%20charts%20and%20data%20modern%20office%20environment&image_size=landscape_16_9'
    },
    {
      id: '2',
      title: 'New EU Regulations Impact CFD Trading in 2025',
      excerpt: 'Understanding the latest regulatory changes affecting CFD traders and brokers across European markets.',
      content: 'Regulatory analysis...',
      category: 'Regulatory Changes',
      author: 'Regulatory Affairs Team',
      publishDate: '2025-01-14',
      readTime: 6,
      tags: ['Regulation', 'CFD', 'EU', 'Compliance'],
      featured: true,
      views: 8930,
      likes: 156,
      imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=european%20union%20flag%20with%20financial%20documents%20and%20legal%20papers%20regulatory%20compliance%20concept&image_size=landscape_16_9'
    },
    {
      id: '3',
      title: 'Market Volatility Strategies: How to Trade in Uncertain Times',
      excerpt: 'Expert strategies for navigating volatile markets and protecting your trading capital during uncertain periods.',
      content: 'Trading strategies...',
      category: 'Trading Tips',
      author: 'Market Strategist',
      publishDate: '2025-01-13',
      readTime: 10,
      tags: ['Volatility', 'Risk Management', 'Strategies'],
      featured: false,
      views: 12340,
      likes: 189,
      bookmarked: true,
      imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=volatile%20financial%20charts%20with%20dramatic%20price%20movements%20trading%20strategy%20concept&image_size=landscape_16_9'
    },
    {
      id: '4',
      title: 'Federal Reserve Policy Impact on Currency Markets',
      excerpt: 'Analysis of how recent Fed decisions are affecting major currency pairs and trading opportunities.',
      content: 'Market analysis...',
      category: 'Market Updates',
      author: 'Economic Analyst',
      publishDate: '2025-01-12',
      readTime: 7,
      tags: ['Federal Reserve', 'Currency', 'Policy', 'USD'],
      featured: false,
      views: 9876,
      likes: 143,
      trending: true,
      imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=federal%20reserve%20building%20with%20currency%20symbols%20and%20economic%20data%20financial%20policy%20concept&image_size=landscape_16_9'
    },
    {
      id: '5',
      title: 'Cryptocurrency Integration in Traditional Brokerages',
      excerpt: 'How traditional forex and CFD brokers are adapting to include cryptocurrency trading in their platforms.',
      content: 'Crypto integration analysis...',
      category: 'Broker News',
      author: 'Crypto Specialist',
      publishDate: '2025-01-11',
      readTime: 5,
      tags: ['Cryptocurrency', 'Integration', 'Brokers', 'Innovation'],
      featured: false,
      views: 7654,
      likes: 98,
      imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=bitcoin%20and%20traditional%20trading%20platforms%20merging%20cryptocurrency%20integration%20concept&image_size=landscape_16_9'
    },
    {
      id: '6',
      title: 'Risk Management Fundamentals for New Traders',
      excerpt: 'Essential risk management principles every new trader should understand before starting their trading journey.',
      content: 'Risk management guide...',
      category: 'Trading Tips',
      author: 'Education Team',
      publishDate: '2025-01-10',
      readTime: 12,
      tags: ['Risk Management', 'Education', 'Beginners', 'Safety'],
      featured: false,
      views: 11230,
      likes: 167,
      imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=risk%20management%20concept%20with%20scales%20charts%20and%20protective%20shields%20financial%20safety&image_size=landscape_16_9'
    }
  ];

  const categories = [
    { name: 'All', icon: TrendingUp, count: newsArticles.length },
    { name: 'Market Updates', icon: TrendingUp, count: newsArticles.filter(a => a.category === 'Market Updates').length },
    { name: 'Broker News', icon: Building, count: newsArticles.filter(a => a.category === 'Broker News').length },
    { name: 'Regulatory Changes', icon: Shield, count: newsArticles.filter(a => a.category === 'Regulatory Changes').length },
    { name: 'Trading Tips', icon: BookOpen, count: newsArticles.filter(a => a.category === 'Trading Tips').length }
  ];

  const filteredArticles = useMemo(() => {
    let filtered = newsArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'trending':
          if (a.trending && !b.trending) return -1;
          if (!a.trending && b.trending) return 1;
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'readTime':
          return a.readTime - b.readTime;
        default:
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const featuredArticles = newsArticles.filter(article => article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <PageLayout
      title="Trading News Hub 2025"
      description="Stay ahead with the latest broker news, market updates, regulatory changes, and expert trading insights."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'News', href: '/news', current: true }
      ]}
    >
      <Helmet>
        <title>Trading News Hub 2025 | Latest Broker News & Market Updates</title>
        <meta name="description" content="Stay updated with the latest trading news, broker updates, regulatory changes, and market analysis for 2025. Expert insights and trading tips." />
        <meta name="keywords" content="trading news 2025, broker news, market updates, regulatory changes, forex news, CFD news, trading tips, financial news" />
        <link rel="canonical" href="https://brokeranalysis.com/news" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Trading News Hub 2025 | Latest Broker News & Market Updates" />
        <meta property="og:description" content="Stay updated with the latest trading news, broker updates, and market analysis for 2025." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brokeranalysis.com/news" />
        <meta property="og:image" content="https://brokeranalysis.com/images/news-hub-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trading News Hub 2025 | Latest Broker News & Market Updates" />
        <meta name="twitter:description" content="Stay updated with the latest trading news, broker updates, and market analysis for 2025." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/news-hub-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "BrokerAnalysis News",
            "url": "https://brokeranalysis.com/news",
            "logo": "https://brokeranalysis.com/logo.png",
            "description": "Latest trading news, broker updates, and market analysis for 2025",
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": featuredArticles.map((article, index) => ({
                "@type": "NewsArticle",
                "position": index + 1,
                "headline": article.title,
                "description": article.excerpt,
                "author": {
                  "@type": "Person",
                  "name": article.author
                },
                "datePublished": article.publishDate,
                "url": `https://brokeranalysis.com/news/${article.id}`
              }))
            }
          })}
        </script>
      </Helmet>

      <div className="space-y-8">
        {/* Hero Section with Market Data */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-lg">
          <div className="text-center mb-8">
            <TrendingUp className="w-12 h-12 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Trading News Hub 2025</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Stay ahead with the latest broker news, market updates, regulatory changes, and expert trading insights.
            </p>
          </div>
          
          {/* Live Market Data */}
          <div className="bg-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Live Market Data
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {marketData.map((market, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-3">
                  <div className="text-sm font-medium">{market.symbol}</div>
                  <div className="text-lg font-bold">{market.price.toFixed(market.symbol.includes('JPY') ? 2 : 4)}</div>
                  <div className={`text-sm flex items-center gap-1 ${
                    market.change >= 0 ? 'text-green-300' : 'text-red-300'
                  }`}>
                    <ArrowUpRight className={`w-3 h-3 ${market.change < 0 ? 'rotate-90' : ''}`} />
                    {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search, Filter and Sort Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Trending</option>
                <option value="readTime">Quick Reads</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredArticles.length} articles
          </div>
        </div>

        {/* News Content and Sidebar */}
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Top Stories News Widget */}
          <div className="lg:col-span-3">
            <div className="mt-8" style={{ height: '600px', width: '100%' }}>
              <TopStories />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trending Topics */}
            <ProfessionalCard variant="compact">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Topics
                </h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{topic.topic}</div>
                        <div className="text-xs text-gray-500">{topic.articles} articles</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        topic.trend === 'up' ? 'bg-green-500' :
                        topic.trend === 'down' ? 'bg-red-500' : 'bg-gray-400'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
            </ProfessionalCard>

            {/* Newsletter Signup */}
            <ProfessionalCard variant="compact">
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get the latest trading news delivered to your inbox.
                </p>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="text-sm"
                  />
                  <Button size="sm" className="w-full">
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </ProfessionalCard>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default NewsHub;
