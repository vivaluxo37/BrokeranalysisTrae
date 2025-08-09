import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Shield, Calculator, Users, FileText, Award, Target } from 'lucide-react';

const EducationHub: React.FC = () => {
  const educationCategories = [
    {
      id: 'trading-basics',
      title: 'Trading Basics',
      description: 'Essential knowledge for new traders starting their journey in 2025',
      icon: BookOpen,
      articles: [
        { title: 'How to Choose a Broker in 2025', slug: 'how-to-choose-broker-2025' },
        { title: 'Understanding Trading Platforms', slug: 'understanding-trading-platforms' },
        { title: 'Types of Trading Accounts', slug: 'types-of-trading-accounts' },
        { title: 'Getting Started with Demo Trading', slug: 'demo-trading-guide' }
      ],
      color: 'bg-blue-500'
    },
    {
      id: 'advanced-strategies',
      title: 'Advanced Strategies',
      description: 'Professional trading techniques and advanced market strategies',
      icon: TrendingUp,
      articles: [
        { title: 'Technical Analysis Mastery 2025', slug: 'technical-analysis-mastery-2025' },
        { title: 'Algorithmic Trading Strategies', slug: 'algorithmic-trading-strategies' },
        { title: 'Options Trading Advanced Guide', slug: 'options-trading-advanced' },
        { title: 'Scalping Techniques for 2025', slug: 'scalping-techniques-2025' }
      ],
      color: 'bg-green-500'
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Learn to analyze markets, trends, and economic indicators',
      icon: Target,
      articles: [
        { title: 'Fundamental Analysis Guide 2025', slug: 'fundamental-analysis-guide-2025' },
        { title: 'Economic Calendar Trading', slug: 'economic-calendar-trading' },
        { title: 'Market Sentiment Analysis', slug: 'market-sentiment-analysis' },
        { title: 'Cryptocurrency Market Analysis', slug: 'crypto-market-analysis' }
      ],
      color: 'bg-purple-500'
    },
    {
      id: 'risk-management',
      title: 'Risk Management',
      description: 'Protect your capital with proven risk management strategies',
      icon: Shield,
      articles: [
        { title: 'Risk Management Strategies 2025', slug: 'risk-management-strategies-2025' },
        { title: 'Position Sizing Calculator Guide', slug: 'position-sizing-guide' },
        { title: 'Stop Loss and Take Profit', slug: 'stop-loss-take-profit' },
        { title: 'Portfolio Diversification', slug: 'portfolio-diversification' }
      ],
      color: 'bg-red-500'
    },
    {
      id: 'broker-selection',
      title: 'Broker Selection Guide',
      description: 'Everything you need to know about choosing the right broker',
      icon: Award,
      articles: [
        { title: 'Broker Regulation Guide 2025', slug: 'broker-regulation-guide-2025' },
        { title: 'Understanding Forex Spreads', slug: 'understanding-forex-spreads' },
        { title: 'CFD Trading Guide 2025', slug: 'cfd-trading-guide-2025' },
        { title: 'Broker Fees Comparison', slug: 'broker-fees-comparison' }
      ],
      color: 'bg-yellow-500'
    },
    {
      id: 'trading-tools',
      title: 'Trading Tools & Calculators',
      description: 'Master essential trading tools and calculators for better results',
      icon: Calculator,
      articles: [
        { title: 'Pip Calculator Guide', slug: 'pip-calculator-guide' },
        { title: 'Margin Calculator Explained', slug: 'margin-calculator-explained' },
        { title: 'Profit Calculator Usage', slug: 'profit-calculator-usage' },
        { title: 'Economic Calendar Usage', slug: 'economic-calendar-usage' }
      ],
      color: 'bg-indigo-500'
    }
  ];

  const featuredArticles = [
    {
      title: 'Complete Beginner\'s Guide to Trading in 2025',
      description: 'Everything you need to start trading successfully in 2025',
      slug: 'complete-beginners-guide-2025',
      category: 'Trading Basics',
      readTime: '15 min read'
    },
    {
      title: 'Best Trading Strategies for 2025 Market Conditions',
      description: 'Proven strategies adapted for current market dynamics',
      slug: 'best-trading-strategies-2025',
      category: 'Advanced Strategies',
      readTime: '12 min read'
    },
    {
      title: 'How to Choose the Best Broker in 2025',
      description: 'Comprehensive guide to selecting the right broker for your needs',
      slug: 'how-to-choose-best-broker-2025',
      category: 'Broker Selection',
      readTime: '10 min read'
    }
  ];

  return (
    <>
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

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Trading Education Hub 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
                Master trading with our comprehensive educational resources. From beginner basics to advanced strategies, learn everything you need to succeed in 2025.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/education/trading-glossary"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Trading Glossary
                </Link>
                <Link
                  to="/education/complete-beginners-guide-2025"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Articles */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Educational Content
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {featuredArticles.map((article, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="text-sm text-blue-600 font-semibold mb-2">{article.category}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{article.readTime}</span>
                    <Link
                      to={`/education/${article.slug}`}
                      className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Categories */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Explore Our Educational Categories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {educationCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <div key={category.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className={`${category.color} p-6 text-white`}>
                    <IconComponent className="w-12 h-12 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">{category.title}</h3>
                    <p className="text-white/90">{category.description}</p>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Popular Articles:</h4>
                    <ul className="space-y-2">
                      {category.articles.map((article, index) => (
                        <li key={index}>
                          <Link
                            to={`/education/${article.slug}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {article.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      to={`/education/category/${category.id}`}
                      className="inline-block mt-4 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                    >
                      View All Articles →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Quick Access Tools
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link
                to="/tools/find-my-broker"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
              >
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Find My Broker</h3>
                <p className="text-gray-600 text-sm">Take our quiz to find the perfect broker</p>
              </Link>
              <Link
                to="/tools/fee-calculator"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
              >
                <Calculator className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Fee Calculator</h3>
                <p className="text-gray-600 text-sm">Calculate trading costs and fees</p>
              </Link>
              <Link
                to="/tools/spread-comparison"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
              >
                <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Spread Comparison</h3>
                <p className="text-gray-600 text-sm">Compare spreads across brokers</p>
              </Link>
              <Link
                to="/education/trading-glossary"
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-center"
              >
                <FileText className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Trading Glossary</h3>
                <p className="text-gray-600 text-sm">Learn trading terminology</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Trading Education 2025
            </h2>
            <p className="text-xl mb-8">
              Get the latest educational content, market insights, and broker updates delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationHub;