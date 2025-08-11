import React, { useMemo, useState } from 'react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Link } from 'react-router-dom';
import { Award, BookOpen, Calculator, FileText, Shield, Target, TrendingUp, Users, Search, Filter, Clock, CheckCircle, PlayCircle, Star } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { 
  ProfessionalBadge, 
  ProfessionalProgress, 
  ProfessionalHero, 
  ProfessionalSearchFilter,
  ProfessionalCategoryCard,
  ProfessionalLearningPath,
  ProfessionalNewsletter
} from '@/components/ui/professional-components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  modules: number;
  completedModules?: number;
  icon: React.ComponentType<any>;
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
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
    <Layout>
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

      <div className="min-h-screen bg-professional-black">
        <div className="professional-container space-y-12">
          {/* Hero Section */}
          <ProfessionalHero
            title="Trading Education Hub 2025"
            description="Master trading with our comprehensive educational resources. From beginner basics to advanced strategies, learn everything you need to succeed in 2025."
            icon={<BookOpen className="w-16 h-16" />}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-professional-secondary">
                <Link to="/education/trading-glossary">
                  <FileText className="w-4 h-4 mr-2" />
                  Trading Glossary
                </Link>
              </Button>
              <Button asChild className="btn-professional-primary">
                <Link to="/education/complete-beginners-guide-2025">
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Learning
                </Link>
              </Button>
            </div>
          </ProfessionalHero>

          {/* Search and Filter Section */}
          <ProfessionalSearchFilter
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            filters={[
              {
                label: 'Level',
                value: selectedLevel,
                options: levels.map(level => level + ' Level'),
                onChange: setSelectedLevel
              },
              {
                label: 'Category',
                value: selectedCategory,
                options: categories,
                onChange: setSelectedCategory
              }
            ]}
            resultsCount={filteredCategories.length + filteredLearningPaths.length}
            totalCount={educationCategories.length + learningPaths.length}
          />

          {/* Learning Paths Section */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-pure-white">Learning Paths</h2>
              <div className="text-sm text-light-grey">
                Structured courses for systematic learning
              </div>
            </div>
            <div className="professional-grid professional-grid-2">
              {filteredLearningPaths.map((path) => (
                <ProfessionalLearningPath
                  key={path.id}
                  title={path.title}
                  description={path.description}
                  level={path.level}
                  duration={path.duration}
                  modules={path.modules}
                  completedModules={path.completedModules}
                  icon={<path.icon className="w-6 h-6" />}
                />
              ))}
            </div>
          </div>

          {/* Featured Articles */}
          <div>
            <h2 className="text-3xl font-bold text-pure-white mb-8 text-center">
              Featured Educational Content
            </h2>
            <div className="professional-grid professional-grid-3">
              {featuredArticles.map((article, index) => (
                <Card key={index} className="professional-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ProfessionalBadge variant="secondary">
                        {article.category}
                      </ProfessionalBadge>
                      <ProfessionalBadge variant="level" level={article.level as any}>
                        {article.level}
                      </ProfessionalBadge>
                      <Star className="w-4 h-4 text-light-grey" />
                    </div>
                    <h3 className="text-lg font-bold text-pure-white mb-3">{article.title}</h3>
                    <p className="text-light-grey mb-4">{article.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-light-grey flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </span>
                      <Button asChild variant="ghost" size="sm" className="text-pure-white hover:text-light-grey">
                        <Link to={`/education/${article.slug}`}>
                          Read More →
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Education Categories */}
          <div>
            <h2 className="text-3xl font-bold text-pure-white mb-8 text-center">
              Browse by Category
            </h2>
            <div className="professional-grid professional-grid-3">
              {filteredCategories.map((category) => (
                <ProfessionalCategoryCard
                  key={category.id}
                  title={category.title}
                  description={category.description}
                  icon={<category.icon className="w-10 h-10" />}
                  level={category.level}
                  articles={category.articles}
                  onViewAll={() => console.log(`View all ${category.title}`)}
                />
              ))}
            </div>
          </div>

          {/* Quick Access Tools */}
          <div className="professional-card p-8">
            <h2 className="text-3xl font-bold text-pure-white mb-8 text-center">
              Quick Access Tools
            </h2>
            <div className="professional-grid professional-grid-4">
              <Card className="professional-card text-center hover:shadow-lg transition-shadow">
                <Link to="/tools/find-my-broker" className="block p-6">
                  <Users className="w-10 h-10 text-pure-white mx-auto mb-4" />
                  <h3 className="font-semibold text-pure-white mb-2">Find My Broker</h3>
                  <p className="text-light-grey text-sm">Take our quiz to find the perfect broker</p>
                </Link>
              </Card>
              
              <Card className="professional-card text-center hover:shadow-lg transition-shadow">
                <Link to="/tools/brokerage-fee-calculator" className="block p-6">
                  <Calculator className="w-10 h-10 text-pure-white mx-auto mb-4" />
                  <h3 className="font-semibold text-pure-white mb-2">Fee Calculator</h3>
                  <p className="text-light-grey text-sm">Calculate trading costs and fees</p>
                </Link>
              </Card>
              
              <Card className="professional-card text-center hover:shadow-lg transition-shadow">
                <Link to="/tools/spread-comparison" className="block p-6">
                  <TrendingUp className="w-10 h-10 text-pure-white mx-auto mb-4" />
                  <h3 className="font-semibold text-pure-white mb-2">Spread Comparison</h3>
                  <p className="text-light-grey text-sm">Compare spreads across brokers</p>
                </Link>
              </Card>
              
              <Card className="professional-card text-center hover:shadow-lg transition-shadow">
                <Link to="/education/trading-glossary" className="block p-6">
                  <FileText className="w-10 h-10 text-pure-white mx-auto mb-4" />
                  <h3 className="font-semibold text-pure-white mb-2">Trading Glossary</h3>
                  <p className="text-light-grey text-sm">Learn trading terminology</p>
                </Link>
              </Card>
            </div>
          </div>

          {/* Newsletter Signup */}
          <ProfessionalNewsletter
            title="Stay Updated with Trading Education 2025"
            description="Get the latest educational content, market insights, and broker updates delivered to your inbox."
          />
        </div>
      </div>
    </Layout>
  );
};

export default EducationHub;