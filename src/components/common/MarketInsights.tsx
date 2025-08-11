import { ArrowRight, Clock, Eye, MessageCircle, Share2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function MarketInsights() {
  const featuredArticles = [
    {
      id: 1,
      title: 'XM Broker Enhances Security: Mandatory 2FA Implementation Following Cyber Attack Recovery',
      excerpt: 'XM announces comprehensive security overhaul including mandatory two-factor authentication for all accounts following successful recovery from recent cyber attack.',
      category: 'Broker News',
      readTime: '5 min read',
      publishedAt: '2 hours ago',
      views: '12.5K',
      comments: 45,
      image: 'https://images.unsplash.com/photo-1660165458059-57cfb6cc87e5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHxmaW5hbmNpYWwlMjBjaGFydHMlMjB0ZWNobm9sb2d5JTIwZGF0YSUyMGFic3RyYWN0fGVufDB8MHx8Ymx1ZXwxNzU0NTIyMDA1fDA&ixlib=rb-4.1.0&q=85',
      featured: true
    },
    {
      id: 2,
      title: 'eToro Revolutionizes Trading: 24/5 Extended Hours for Top 100 US Stocks Now Available',
      excerpt: 'Social trading platform eToro expands trading hours for 100 most popular US stocks, allowing traders to capitalize on after-hours market movements.',
      category: 'Platform Updates',
      readTime: '4 min read',
      publishedAt: '6 hours ago',
      views: '8.2K',
      comments: 32,
      image: 'https://images.unsplash.com/photo-1501780392773-287d506245a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHx0cmFkaW5nJTIwcGxhdGZvcm0lMjBpbnRlcmZhY2UlMjBjaGFydHMlMjBkYXNoYm9hcmR8ZW58MHwwfHx8MTc1NDUyMjAwNXww&ixlib=rb-4.1.0&q=85',
      featured: true
    }
  ]

  const latestNews = [
    {
      title: 'SEC Expands Bitcoin ETF Options Trading Limits: New Regulatory Framework Aims for Enhanced Market Stability',
      category: 'Regulation',
      publishedAt: '1 day ago'
    },
    {
      title: 'XTB Reports 11% Q2 Profit Surge as Crypto and Options Trading Platform Launch Approaches',
      category: 'Earnings',
      publishedAt: '1 day ago'
    },
    {
      title: 'Trump Administration Tariff Increases Trigger Coordinated Global Economic Response from Major Trading Partners',
      category: 'Economic Policy',
      publishedAt: '2 days ago'
    },
    {
      title: 'Tech Stocks Rally on Meta and Microsoft Earnings Beat; Apple and Amazon Quarterly Results Anticipated',
      category: 'Market Analysis',
      publishedAt: '2 days ago'
    },
    {
      title: 'US-EU Trade Agreement Progress Temporarily Halts Euro Currency Rally Against Dollar',
      category: 'Forex News',
      publishedAt: '3 days ago'
    }
  ]

  const trendingTopics = [
    { name: 'Bitcoin ETF', posts: '2.3K' },
    { name: 'Fed Rate Decision', posts: '1.8K' },
    { name: 'EUR/USD Analysis', posts: '1.5K' },
    { name: 'AI Trading Bots', posts: '1.2K' },
    { name: 'Crypto Regulation', posts: '980' }
  ]

  return (
    <section className="section-padding bg-topforex-primary">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-white mb-6">
            Latest Market Insights & Analysis
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Stay ahead of the markets with our expert analysis, breaking news, 
            and in-depth broker reviews. Get the insights that matter most to your trading success.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Featured Articles */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-white">Featured Stories</h3>
              <Button variant="ghost" className="text-topforex-accent hover:text-topforex-accent/80">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {featuredArticles.map((article, index) => (
              <Card key={article.id} className="glass-card topforex-card-hover animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={article.image}
                      alt={`${article.title} - and machines on Unsplash`}
                      className="w-full h-48 md:h-full object-cover rounded-l-lg"
                      width="300"
                      height="200"
                    />
                  </div>
                  <CardContent className="md:w-2/3 p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-topforex-accent text-white">
                          {article.category}
                        </Badge>
                        {article.featured && (
                          <Badge variant="outline" className="text-topforex-accent border-topforex-accent">
                            Featured
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white leading-tight hover:text-topforex-accent transition-colors cursor-pointer">
                        {article.title}
                      </h3>

                      <p className="text-gray-300 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.publishedAt}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {article.views}
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {article.comments}
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-topforex-accent hover:text-topforex-accent/80">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Latest News */}
            <Card className="glass-card animate-slide-up">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Latest Updates</h3>
                <div className="space-y-4">
                  {latestNews.map((news, index) => (
                    <div key={index} className="group cursor-pointer">
                      <div className="flex gap-3">
                        <div className="text-topforex-accent text-sm font-medium whitespace-nowrap">
                          {news.publishedAt}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white text-sm leading-relaxed group-hover:text-topforex-accent transition-colors">
                            {news.title}
                          </h4>
                          <Badge variant="outline" className="text-xs mt-2">
                            {news.category}
                          </Badge>
                        </div>
                      </div>
                      {index < latestNews.length - 1 && (
                        <div className="border-b border-gray-600 mt-4"></div>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-6 text-topforex-accent hover:text-topforex-accent/80">
                  View All News
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Trending Topics</h3>
                <div className="space-y-3">
                  {trendingTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between group cursor-pointer">
                      <span className="text-white group-hover:text-topforex-accent transition-colors">
                        #{topic.name}
                      </span>
                      <span className="text-gray-400 text-sm">
                        {topic.posts} posts
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Signup */}
            <Card className="glass-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <TrendingUp className="w-12 h-12 text-topforex-accent mx-auto" />
                  <h3 className="text-xl font-bold text-white">
                    Daily Market Brief
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Get the most important market news and broker updates delivered to your inbox every morning.
                  </p>
                  <Button className="w-full btn-topforex-primary interactive-hover">
                    Subscribe Free
                  </Button>
                  <p className="text-xs text-gray-400">
                    Join 100,000+ traders • Unsubscribe anytime
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Market Analysis CTA */}
        <Card className="glass-card mt-16 animate-fade-in">
          <CardContent className="p-12 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-3xl font-bold text-white">
                Want Personalized Market Analysis?
              </h3>
              <p className="text-xl text-gray-300">
                Get custom market insights tailored to your trading style and preferred instruments. 
                Our AI analyzes your preferences to deliver the most relevant content.
              </p>
              <Button size="lg" className="btn-topforex-primary text-lg px-8 py-4 interactive-hover">
                <TrendingUp className="w-5 h-5 mr-2" />
                Get Personalized Insights
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
