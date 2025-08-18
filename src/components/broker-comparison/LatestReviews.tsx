import { Calendar, User, ArrowRight, TrendingUp, AlertTriangle } from 'lucide-react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function LatestReviews() {
  const latestArticles = [
    {
      id: 1,
      title: 'XTB Review 2025: Comprehensive Analysis of Fees, Platforms & Regulation',
      excerpt: 'Our in-depth review of XTB covers everything from trading costs to platform features. Find out if this European broker is right for your trading needs.',
      author: 'Sarah Johnson',
      publishDate: '2025-01-15',
      readTime: '12 min read',
      category: 'Broker Review',
      rating: 4.6,
      image: '/api/placeholder/400/200',
      featured: true
    },
    {
      id: 2,
      title: 'Best Forex Brokers for 2025: Updated Rankings & Analysis',
      excerpt: 'Our annual ranking of the best forex brokers, featuring updated spreads, regulation status, and platform comparisons.',
      author: 'Michael Chen',
      publishDate: '2025-01-12',
      readTime: '15 min read',
      category: 'Market Analysis',
      trending: true
    },
    {
      id: 3,
      title: 'IG Markets vs Plus500: Which CFD Broker Wins in 2025?',
      excerpt: 'Head-to-head comparison of two popular CFD brokers, analyzing costs, platforms, and regulatory protection.',
      author: 'Emma Rodriguez',
      publishDate: '2025-01-10',
      readTime: '10 min read',
      category: 'Comparison',
      rating: null
    },
    {
      id: 4,
      title: 'New EU Regulations Impact on Retail Trading: What You Need to Know',
      excerpt: 'Analysis of recent regulatory changes affecting retail traders in the European Union and their implications.',
      author: 'David Wilson',
      publishDate: '2025-01-08',
      readTime: '8 min read',
      category: 'Regulation Update',
      urgent: true
    }
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <section className="py-20 bg-professional-black">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Latest Reviews & Analysis
          </h2>
          <p className="text-lg text-light-grey max-w-2xl mx-auto">
            Stay updated with our latest broker reviews, market analysis, and trading insights from our expert team.
          </p>
        </div>

        {/* Featured Article */}
        {latestArticles.filter(article => article.featured).map((article) => (
          <Card key={article.id} className="professional-card mb-12 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-medium-grey h-64 lg:h-auto flex items-center justify-center">
                <div className="text-center text-light-grey">
                  <div className="w-16 h-16 bg-charcoal-grey rounded-full mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp size={24} />
                  </div>
                  <p>Featured Article Image</p>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-accent-blue text-white text-sm rounded-full font-medium">
                    Featured
                  </span>
                  <span className="px-3 py-1 bg-medium-grey text-light-grey text-sm rounded-full">
                    {article.category}
                  </span>
                  {article.rating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium">{article.rating}/5</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-pure-white mb-4 leading-tight">
                  {article.title}
                </h3>
                
                <p className="text-light-grey mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-light-grey">
                    <div className="flex items-center space-x-1">
                      <User size={16} />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                  
                  <Button>
                    Read Review
                    <ArrowRight size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {latestArticles.filter(article => !article.featured).map((article) => (
            <Card key={article.id} className="professional-card group cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      article.trending ? 'bg-green-100 text-green-800' :
                      article.urgent ? 'bg-red-100 text-red-800' :
                      'bg-medium-grey text-light-grey'
                    }`}>
                      {article.trending && <TrendingUp size={12} className="inline mr-1" />}
                      {article.urgent && <AlertTriangle size={12} className="inline mr-1" />}
                      {article.category}
                    </span>
                  </div>
                  {article.rating && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium">{article.rating}/5</span>
                    </div>
                  )}
                </div>
                
                <CardTitle level={4} className="text-pure-white group-hover:text-accent-blue transition-colors leading-tight">
                  {article.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-light-grey text-sm mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-light-grey">
                  <div className="flex items-center space-x-2">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{formatDate(article.publishDate)}</span>
                  </div>
                  <span>{article.readTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white">
            View All Articles
            <ArrowRight size={20} />
          </Button>
        </div>
      </div>
    </section>
  )
}