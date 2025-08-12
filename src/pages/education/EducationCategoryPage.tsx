import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from '@dr.pogodin/react-helmet';
import { BookOpen, Clock, Filter, Search, Star, ArrowLeft, CheckCircle } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { ProfessionalCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Article {
  title: string;
  slug: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  featured?: boolean;
  completed?: boolean;
  tags: string[];
}

interface CategoryData {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  level: string;
  totalArticles: number;
  estimatedTime: string;
  articles: Article[];
}

const EducationCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Mock category data - in real app, this would come from API/context
  const categoryData: Record<string, CategoryData> = {
    'trading-basics': {
      id: 'trading-basics',
      title: 'Trading Basics',
      description: 'Essential knowledge for new traders starting their journey in 2025',
      icon: BookOpen,
      color: 'bg-blue-500',
      level: 'Beginner',
      totalArticles: 12,
      estimatedTime: '3-4 hours',
      articles: [
        {
          title: 'How to Choose a Broker in 2025',
          slug: 'how-to-choose-broker-2025',
          description: 'Complete guide to selecting the right broker for your trading needs in 2025',
          level: 'Beginner',
          duration: '8 min',
          featured: true,
          tags: ['broker selection', 'regulation', 'fees']
        },
        {
          title: 'Understanding Trading Platforms',
          slug: 'understanding-trading-platforms',
          description: 'Learn about different trading platforms and their features',
          level: 'Beginner',
          duration: '6 min',
          tags: ['platforms', 'software', 'tools']
        },
        {
          title: 'Types of Trading Accounts',
          slug: 'types-of-trading-accounts',
          description: 'Explore different account types and their benefits',
          level: 'Beginner',
          duration: '5 min',
          tags: ['accounts', 'demo', 'live']
        },
        {
          title: 'Getting Started with Demo Trading',
          slug: 'demo-trading-guide',
          description: 'Practice trading without risk using demo accounts',
          level: 'Beginner',
          duration: '7 min',
          featured: true,
          tags: ['demo', 'practice', 'risk-free']
        },
        {
          title: 'Basic Order Types Explained',
          slug: 'basic-order-types',
          description: 'Understanding market orders, limit orders, and stop orders',
          level: 'Beginner',
          duration: '9 min',
          tags: ['orders', 'execution', 'types']
        },
        {
          title: 'Reading Price Charts',
          slug: 'reading-price-charts',
          description: 'Learn to interpret candlestick and line charts',
          level: 'Beginner',
          duration: '10 min',
          tags: ['charts', 'candlesticks', 'analysis']
        }
      ]
    },
    'advanced-strategies': {
      id: 'advanced-strategies',
      title: 'Advanced Strategies',
      description: 'Professional trading techniques and advanced market strategies',
      icon: BookOpen,
      color: 'bg-green-500',
      level: 'Advanced',
      totalArticles: 15,
      estimatedTime: '6-8 hours',
      articles: [
        {
          title: 'Technical Analysis Mastery 2025',
          slug: 'technical-analysis-mastery-2025',
          description: 'Advanced technical analysis techniques for professional traders',
          level: 'Advanced',
          duration: '15 min',
          featured: true,
          tags: ['technical analysis', 'indicators', 'patterns']
        },
        {
          title: 'Algorithmic Trading Strategies',
          slug: 'algorithmic-trading-strategies',
          description: 'Introduction to automated trading systems and algorithms',
          level: 'Advanced',
          duration: '20 min',
          tags: ['algorithms', 'automation', 'systems']
        }
      ]
    }
  };

  const category = categoryData[categoryId || ''];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'duration', label: 'Duration' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'level', label: 'Difficulty Level' }
  ];

  const filteredAndSortedArticles = useMemo(() => {
    if (!category) return [];

    let filtered = category.articles.filter(article => {
      const matchesSearch = searchTerm === '' || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLevel = selectedLevel === 'All' || article.level === selectedLevel;
      
      return matchesSearch && matchesLevel;
    });

    // Sort articles
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.title.localeCompare(b.title);
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'level':
          const levelOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return levelOrder[a.level] - levelOrder[b.level];
        default:
          return 0;
      }
    });

    return filtered;
  }, [category, searchTerm, selectedLevel, sortBy]);

  if (!category) {
    return (
      <PageLayout
        title="Category Not Found"
        description="The requested education category could not be found."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Education', href: '/education' },
          { label: 'Category Not Found', current: true }
        ]}
      >
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h2>
          <p className="text-gray-600 mb-8">The education category you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/education">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Education Hub
            </Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const IconComponent = category.icon;

  return (
    <PageLayout
      title={category.title}
      description={category.description}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Education', href: '/education' },
        { label: category.title, current: true }
      ]}
    >
      <Helmet>
        <title>{category.title} - Trading Education | BrokerAnalysis 2025</title>
        <meta name="description" content={`${category.description} - Comprehensive ${category.title.toLowerCase()} education for traders in 2025.`} />
        <meta name="keywords" content={`${category.title.toLowerCase()}, trading education, broker analysis, ${category.level.toLowerCase()} trading`} />
        <link rel="canonical" href={`https://brokeranalysis.com/education/category/${category.id}`} />
      </Helmet>

      <div className="space-y-8">
        {/* Category Header */}
        <div className={`${category.color} text-white p-8 rounded-lg`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <IconComponent className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{category.title}</h1>
                <p className="text-white/90 text-lg mb-4">{category.description}</p>
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {category.totalArticles} articles
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {category.estimatedTime}
                  </span>
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {category.level}
                  </span>
                </div>
              </div>
            </div>
            <Button asChild variant="secondary">
              <Link to="/education">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hub
              </Link>
            </Button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map(level => (
                  <option key={level} value={level}>{level} Level</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredAndSortedArticles.length} of {category.articles.length} articles
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6">
          {filteredAndSortedArticles.map((article, index) => (
            <ProfessionalCard key={article.slug} variant="default" className="hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      {article.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        article.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                        article.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {article.level}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {article.duration}
                      </span>
                      {article.completed && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {article.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col gap-2">
                    <Button asChild>
                      <Link to={`/education/${article.slug}`}>
                        {article.completed ? 'Review' : 'Read Article'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          ))}
        </div>

        {filteredAndSortedArticles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedLevel('All');
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        {/* Related Categories */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Continue Learning</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
              <Link to="/education/category/risk-management-category" className="block p-4">
                <div className="w-8 h-8 bg-red-500 rounded-lg mx-auto mb-2"></div>
                <h3 className="font-semibold text-gray-900 text-sm">Risk Management</h3>
              </Link>
            </ProfessionalCard>
            
            <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
              <Link to="/education/category/market-analysis" className="block p-4">
                <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2"></div>
                <h3 className="font-semibold text-gray-900 text-sm">Market Analysis</h3>
              </Link>
            </ProfessionalCard>
            
            <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
              <Link to="/education/trading-glossary" className="block p-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                <h3 className="font-semibold text-gray-900 text-sm">Trading Glossary</h3>
              </Link>
            </ProfessionalCard>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default EducationCategoryPage;
