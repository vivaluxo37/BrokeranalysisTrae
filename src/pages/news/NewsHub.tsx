import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, TrendingUp, Building, Shield, BookOpen, Search, Filter } from 'lucide-react';

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
}

const NewsHub: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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
    return newsArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [searchTerm, selectedCategory]);

  const featuredArticles = newsArticles.filter(article => article.featured);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
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

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Trading News Hub 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Stay ahead with the latest broker news, market updates, regulatory changes, and expert trading insights.
              </p>
              <div className="flex justify-center gap-4 text-lg">
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  {newsArticles.length} Articles
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-full">
                  Daily Updates
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category, index) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
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
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        {selectedCategory === 'All' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Stories</h2>
            <div className="grid lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="aspect-video bg-gray-200">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      <span className="text-gray-500 text-sm">Featured</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.publishDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime} min read
                        </span>
                      </div>
                      <span>{article.author}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Articles */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'Latest News' : selectedCategory}
            </h2>
            <div className="text-gray-600">
              {filteredArticles.length} articles
            </div>
          </div>

          <div className="grid gap-6">
            {filteredArticles.map((article, index) => (
              <div key={article.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-64 flex-shrink-0">
                    <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {article.category}
                      </span>
                      {article.featured && (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-lg">
                      {article.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(article.publishDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.readTime} min read
                        </span>
                      </div>
                      <span>{article.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Trading News 2025
            </h2>
            <p className="text-xl mb-8">
              Get the latest broker news, market updates, and trading insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm mt-4 text-blue-100">
              No spam. Unsubscribe anytime. Your privacy is protected.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsHub;