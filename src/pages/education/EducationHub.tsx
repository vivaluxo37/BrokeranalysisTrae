import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Calculator, FileText, Shield, Target, TrendingUp, Users, Search, Filter, Clock, CheckCircle, PlayCircle, Star } from 'lucide-react';
import { PageLayout } from '@/components/layout';
import { ProfessionalCard } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modules: number;
  completedModules?: number;
  icon: React.ComponentType<any>;
  color: string;
  articles: string[];
}

interface EducationCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  articles: Array<{
    title: string;
    slug: string;
    level?: string;
    duration?: string;
    featured?: boolean;
  }>;
  color: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
}

const EducationHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const learningPaths: LearningPath[] = [
    {
      id: 'complete-beginner',
      title: 'Complete Beginner Path',
      description: 'Start your trading journey from zero to confident trader',
      level: 'Beginner',
      duration: '4-6 weeks',
      modules: 8,
      completedModules: 0,
      icon: BookOpen,
      color: 'bg-green-500',
      articles: ['how-to-choose-broker-2025', 'understanding-trading-platforms', 'types-of-trading-accounts', 'demo-trading-guide']
    },
    {
      id: 'advanced-trader',
      title: 'Advanced Trading Mastery',
      description: 'Master professional trading techniques and strategies',
      level: 'Advanced',
      duration: '8-10 weeks',
      modules: 12,
      completedModules: 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      articles: ['technical-analysis-mastery-2025', 'algorithmic-trading-strategies', 'options-trading-advanced', 'scalping-techniques-2025']
    },
    {
      id: 'risk-management',
      title: 'Risk Management Expert',
      description: 'Protect your capital with proven risk management strategies',
      level: 'Intermediate',
      duration: '3-4 weeks',
      modules: 6,
      completedModules: 0,
      icon: Shield,
      color: 'bg-red-500',
      articles: ['risk-management-strategies-2025', 'position-sizing-guide', 'stop-loss-take-profit', 'portfolio-diversification']
    },
    {
      id: 'broker-selection',
      title: 'Broker Selection Specialist',
      description: 'Learn to choose the perfect broker for your needs',
      level: 'Beginner',
      duration: '2-3 weeks',
      modules: 5,
      completedModules: 0,
      icon: Award,
      color: 'bg-blue-500',
      articles: ['broker-regulation-guide-2025', 'understanding-forex-spreads', 'cfd-trading-guide-2025', 'broker-fees-comparison']
    }
  ];

  const educationCategories: EducationCategory[] = [
    {
      id: 'trading-basics',
      title: 'Trading Basics',
      description: 'Essential knowledge for new traders starting their journey in 2025',
      icon: BookOpen,
      level: 'Beginner',
      articles: [
        { title: 'How to Choose a Broker in 2025', slug: 'how-to-choose-broker-2025', level: 'Beginner', duration: '8 min', featured: true },
        { title: 'Understanding Trading Platforms', slug: 'understanding-trading-platforms', level: 'Beginner', duration: '6 min' },
        { title: 'Types of Trading Accounts', slug: 'types-of-trading-accounts', level: 'Beginner', duration: '5 min' },
        { title: 'Getting Started with Demo Trading', slug: 'demo-trading-guide', level: 'Beginner', duration: '7 min' }
      ],
      color: 'bg-blue-500'
    },
    {
      id: 'advanced-strategies',
      title: 'Advanced Strategies',
      description: 'Professional trading techniques and advanced market strategies',
      icon: TrendingUp,
      level: 'Advanced',
      articles: [
        { title: 'Technical Analysis Mastery 2025', slug: 'technical-analysis-mastery-2025', level: 'Advanced', duration: '15 min', featured: true },
        { title: 'Algorithmic Trading Strategies', slug: 'algorithmic-trading-strategies', level: 'Advanced', duration: '20 min' },
        { title: 'Options Trading Advanced Guide', slug: 'options-trading-advanced', level: 'Advanced', duration: '18 min' },
        { title: 'Scalping Techniques for 2025', slug: 'scalping-techniques-2025', level: 'Advanced', duration: '12 min' }
      ],
      color: 'bg-green-500'
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Learn to analyze markets, trends, and economic indicators',
      icon: Target,
      level: 'Intermediate',
      articles: [
        { title: 'Fundamental Analysis Guide 2025', slug: 'fundamental-analysis-guide-2025', level: 'Intermediate', duration: '14 min', featured: true },
        { title: 'Economic Calendar Trading', slug: 'economic-calendar-trading', level: 'Intermediate', duration: '10 min' },
        { title: 'Market Sentiment Analysis', slug: 'market-sentiment-analysis', level: 'Intermediate', duration: '12 min' },
        { title: 'Cryptocurrency Market Analysis', slug: 'crypto-market-analysis', level: 'Intermediate', duration: '16 min' }
      ],
      color: 'bg-purple-500'
    },
    {
      id: 'risk-management-category',
      title: 'Risk Management',
      description: 'Protect your capital with proven risk management strategies',
      icon: Shield,
      level: 'All Levels',
      articles: [
        { title: 'Risk Management Strategies 2025', slug: 'risk-management-strategies-2025', level: 'Intermediate', duration: '13 min', featured: true },
        { title: 'Position Sizing Calculator Guide', slug: 'position-sizing-guide', level: 'Beginner', duration: '9 min' },
        { title: 'Stop Loss and Take Profit', slug: 'stop-loss-take-profit', level: 'Beginner', duration: '7 min' },
        { title: 'Portfolio Diversification', slug: 'portfolio-diversification', level: 'Intermediate', duration: '11 min' }
      ],
      color: 'bg-red-500'
    },
    {
      id: 'broker-selection-category',
      title: 'Broker Selection Guide',
      description: 'Everything you need to know about choosing the right broker',
      icon: Award,
      level: 'All Levels',
      articles: [
        { title: 'Broker Regulation Guide 2025', slug: 'broker-regulation-guide-2025', level: 'Beginner', duration: '10 min', featured: true },
        { title: 'Understanding Forex Spreads', slug: 'understanding-forex-spreads', level: 'Beginner', duration: '8 min' },
        { title: 'CFD Trading Guide 2025', slug: 'cfd-trading-guide-2025', level: 'Intermediate', duration: '12 min' },
        { title: 'Broker Fees Comparison', slug: 'broker-fees-comparison', level: 'Beginner', duration: '6 min' }
      ],
      color: 'bg-yellow-500'
    },
    {
      id: 'trading-tools',
      title: 'Trading Tools & Calculators',
      description: 'Master essential trading tools and calculators for better results',
      icon: Calculator,
      level: 'All Levels',
      articles: [
        { title: 'Pip Calculator Guide', slug: 'pip-calculator-guide', level: 'Beginner', duration: '5 min' },
        { title: 'Margin Calculator Explained', slug: 'margin-calculator-explained', level: 'Intermediate', duration: '8 min' },
        { title: 'Profit Calculator Usage', slug: 'profit-calculator-usage', level: 'Beginner', duration: '6 min' },
        { title: 'Economic Calendar Usage', slug: 'economic-calendar-usage', level: 'Intermediate', duration: '9 min' }
      ],
      color: 'bg-indigo-500'
    }
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const categories = ['All', ...educationCategories.map(cat => cat.title)];

  const filteredCategories = useMemo(() => {
    return educationCategories.filter(category => {
      const matchesLevel = selectedLevel === 'All' || category.level === selectedLevel || category.level === 'All Levels';
      const matchesCategory = selectedCategory === 'All' || category.title === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.articles.some(article => 
          article.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesLevel && matchesCategory && matchesSearch;
    });
  }, [selectedLevel, selectedCategory, searchTerm]);

  const filteredLearningPaths = useMemo(() => {
    return learningPaths.filter(path => {
      const matchesLevel = selectedLevel === 'All' || path.level === selectedLevel;
      const matchesSearch = searchTerm === '' || 
        path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        path.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLevel && matchesSearch;
    });
  }, [selectedLevel, searchTerm]);

  const featuredArticles = [
    {
      title: 'Complete Beginner\'s Guide to Trading in 2025',
      description: 'Everything you need to start trading successfully in 2025',
      slug: 'complete-beginners-guide-2025',
      category: 'Trading Basics',
      level: 'Beginner',
      readTime: '15 min read',
      featured: true
    },
    {
      title: 'Best Trading Strategies for 2025 Market Conditions',
      description: 'Proven strategies adapted for current market dynamics',
      slug: 'best-trading-strategies-2025',
      category: 'Advanced Strategies',
      level: 'Advanced',
      readTime: '12 min read',
      featured: true
    },
    {
      title: 'How to Choose the Best Broker in 2025',
      description: 'Comprehensive guide to selecting the right broker for your needs',
      slug: 'how-to-choose-best-broker-2025',
      category: 'Broker Selection',
      level: 'Beginner',
      readTime: '10 min read',
      featured: true
    }
  ];

  return (
    <PageLayout
      title="Trading Education Hub 2025"
      description="Master trading with our comprehensive educational resources. From beginner basics to advanced strategies, learn everything you need to succeed in 2025."
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Education', href: '/education', current: true }
      ]}
    >
      <Helmet>
        <title>Trading Education Hub 2025 | Learn Trading & Broker Analysis</title>
        <meta name="description" content="Comprehensive trading education hub for 2025. Learn trading basics, advanced strategies, risk management, and broker selection. Free educational resources for traders." />
        <meta name="keywords" content="trading education 2025, learn trading, broker selection guide, trading strategies, risk management, forex education, CFD trading guide" />
        <link rel="canonical" href="https://brokeranalysis.com/education" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Trading Education Hub 2025 | Learn Trading & Broker Analysis" />
        <meta property="og:description" content="Comprehensive trading education hub for 2025. Learn trading basics, advanced strategies, risk management, and broker selection." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://brokeranalysis.com/education" />
        <meta property="og:image" content="https://brokeranalysis.com/images/education-hub-2025.jpg" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Trading Education Hub 2025 | Learn Trading & Broker Analysis" />
        <meta name="twitter:description" content="Comprehensive trading education hub for 2025. Learn trading basics, advanced strategies, risk management, and broker selection." />
        <meta name="twitter:image" content="https://brokeranalysis.com/images/education-hub-2025.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "BrokerAnalysis Trading Education Hub",
            "description": "Comprehensive trading education platform offering courses, guides, and resources for traders in 2025",
            "url": "https://brokeranalysis.com/education",
            "sameAs": [
              "https://twitter.com/brokeranalysis",
              "https://linkedin.com/company/brokeranalysis"
            ],
            "offers": {
              "@type": "Course",
              "name": "Trading Education 2025",
              "description": "Free comprehensive trading education covering basics to advanced strategies",
              "provider": {
                "@type": "Organization",
                "name": "BrokerAnalysis"
              }
            }
          })}
        </script>
      </Helmet>

      <div className="space-y-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16 rounded-lg">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trading Education Hub 2025
            </h1>
            <p className="text-xl mb-8">
              Master trading with our comprehensive educational resources. From beginner basics to advanced strategies, learn everything you need to succeed in 2025.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="secondary" size="lg">
                <Link to="/education/trading-glossary">
                  <FileText className="w-4 h-4 mr-2" />
                  Trading Glossary
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link to="/education/complete-beginners-guide-2025">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Learning
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search educational content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
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
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredCategories.length} categories and {filteredLearningPaths.length} learning paths
          </div>
        </div>

        {/* Learning Paths Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Learning Paths</h2>
            <div className="text-sm text-gray-600">
              Structured courses for systematic learning
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {filteredLearningPaths.map((path) => {
              const IconComponent = path.icon;
              const progress = path.completedModules ? (path.completedModules / path.modules) * 100 : 0;
              
              return (
                <ProfessionalCard key={path.id} variant="interactive" className="hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${path.color} text-white`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          path.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                          path.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {path.level}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{path.title}</h3>
                    <p className="text-gray-600 mb-4">{path.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {path.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {path.modules} modules
                      </span>
                    </div>
                    
                    {progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-900 font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full" variant={progress > 0 ? "default" : "outline"}>
                      {progress > 0 ? 'Continue Learning' : 'Start Path'}
                      <PlayCircle className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </ProfessionalCard>
              );
            })}
          </div>
        </div>

        {/* Featured Articles */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Educational Content
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredArticles.map((article, index) => (
              <ProfessionalCard key={index} variant="default" className="hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {article.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      article.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      article.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {article.level}
                    </span>
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {article.readTime}
                    </span>
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/education/${article.slug}`}>
                        Read More →
                      </Link>
                    </Button>
                  </div>
                </div>
              </ProfessionalCard>
            ))}
          </div>
        </div>

        {/* Education Categories */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <ProfessionalCard key={category.id} variant="default" className="hover:shadow-lg transition-shadow">
                  <div className={`${category.color} p-6 text-white`}>
                    <IconComponent className="w-10 h-10 mb-4" />
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-white/90 text-sm">{category.description}</p>
                    <div className="mt-3">
                      <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                        {category.level}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Popular Articles:</h4>
                    <ul className="space-y-2 mb-4">
                      {category.articles.slice(0, 3).map((article, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <Link
                            to={`/education/${article.slug}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm flex-1"
                          >
                            {article.title}
                          </Link>
                          {article.duration && (
                            <span className="text-xs text-gray-500 ml-2">{article.duration}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link to={`/education/category/${category.id}`}>
                        View All Articles ({category.articles.length})
                      </Link>
                    </Button>
                  </div>
                </ProfessionalCard>
              );
            })}
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Quick Access Tools
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
              <Link to="/tools/find-my-broker" className="block p-6">
                <Users className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Find My Broker</h3>
                <p className="text-gray-600 text-sm">Take our quiz to find the perfect broker</p>
              </Link>
            </ProfessionalCard>
            
            <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
              <Link to="/tools/brokerage-fee-calculator" className="block p-6">
                <Calculator className="w-10 h-10 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Fee Calculator</h3>
                <p className="text-gray-600 text-sm">Calculate trading costs and fees</p>
              </Link>
            </ProfessionalCard>
            
            <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
              <Link to="/tools/spread-comparison" className="block p-6">
                <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Spread Comparison</h3>
                <p className="text-gray-600 text-sm">Compare spreads across brokers</p>
              </Link>
            </ProfessionalCard>
            
            <ProfessionalCard variant="compact" className="text-center hover:shadow-lg transition-shadow">
              <Link to="/education/trading-glossary" className="block p-6">
                <FileText className="w-10 h-10 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Trading Glossary</h3>
                <p className="text-gray-600 text-sm">Learn trading terminology</p>
              </Link>
            </ProfessionalCard>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-blue-600 text-white py-12 px-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stay Updated with Trading Education 2025
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get the latest educational content, market insights, and broker updates delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-white text-gray-900"
            />
            <Button variant="secondary" size="lg">
              Subscribe
            </Button>
          </div>
          <p className="text-sm mt-4 text-blue-100">
            No spam. Unsubscribe anytime. Your privacy is protected.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default EducationHub;