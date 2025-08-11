import { ArrowRight, BookOpen, Calculator, Clock, Play, Shield, Star, TrendingUp, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function EducationalHub() {
  const courses = [
    {
      id: 1,
      title: 'Complete Forex Trading Masterclass',
      description: 'Learn everything from basics to advanced trading strategies',
      level: 'Beginner to Advanced',
      duration: '12 hours',
      lessons: 45,
      rating: 4.9,
      students: '25,000+',
      image: 'https://images.unsplash.com/photo-1501780392773-287d506245a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw2fHx0cmFkaW5nJTIwcGxhdGZvcm0lMjBpbnRlcmZhY2UlMjBjaGFydHMlMjBkYXNoYm9hcmR8ZW58MHwwfHx8MTc1NDUyMjAwNXww&ixlib=rb-4.1.0&q=85',
      category: 'Trading Fundamentals'
    },
    {
      id: 2,
      title: 'Risk Management & Psychology',
      description: 'Master the mental game and protect your capital',
      level: 'Intermediate',
      duration: '8 hours',
      lessons: 28,
      rating: 4.8,
      students: '18,500+',
      image: 'https://images.unsplash.com/photo-1586448910234-297fae7189e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwzfHx0cmFkaW5nJTIwcGxhdGZvcm0lMjBpbnRlcmZhY2UlMjBjaGFydHMlMjBkYXNoYm9hcmR8ZW58MHwwfHx8MTc1NDUyMjAwNXww&ixlib=rb-4.1.0&q=85',
      category: 'Risk Management'
    },
    {
      id: 3,
      title: 'Technical Analysis Deep Dive',
      description: 'Advanced chart patterns and indicator strategies',
      level: 'Advanced',
      duration: '15 hours',
      lessons: 52,
      rating: 4.9,
      students: '12,300+',
      image: 'https://images.unsplash.com/photo-1615992174118-9b8e9be025e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHx0cmFkaW5nJTIwcGxhdGZvcm0lMjBpbnRlcmZhY2UlMjBjaGFydHMlMjBkYXNoYm9hcmR8ZW58MHwwfHx8MTc1NDUyMjAwNXww&ixlib=rb-4.1.0&q=85',
      category: 'Technical Analysis'
    }
  ]

  const tools = [
    {
      icon: Calculator,
      title: 'Profit/Loss Calculator',
      description: 'Calculate potential profits and losses before placing trades',
      category: 'Essential Tools'
    },
    {
      icon: TrendingUp,
      title: 'Position Size Calculator',
      description: 'Determine optimal position sizes based on risk tolerance',
      category: 'Risk Management'
    },
    {
      icon: Shield,
      title: 'Risk/Reward Analyzer',
      description: 'Analyze risk-to-reward ratios for better trade planning',
      category: 'Analysis Tools'
    },
    {
      icon: BookOpen,
      title: 'Economic Calendar',
      description: 'Stay updated with market-moving economic events',
      category: 'Market Intelligence'
    }
  ]

  const articles = [
    {
      title: 'How to Choose the Right Forex Broker in 2025',
      excerpt: 'Complete guide to evaluating brokers based on regulation, costs, and features',
      readTime: '8 min read',
      category: 'Broker Selection',
      featured: true
    },
    {
      title: 'Understanding Leverage and Margin Requirements',
      excerpt: 'Learn how leverage works and how to use it responsibly in forex trading',
      readTime: '6 min read',
      category: 'Trading Basics'
    },
    {
      title: 'Top 10 Trading Psychology Mistakes to Avoid',
      excerpt: 'Common psychological pitfalls that can destroy your trading account',
      readTime: '10 min read',
      category: 'Psychology'
    }
  ]

  return (
    <section className="section-padding bg-topforex-surface-elevated">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-bold text-topforex-text-primary mb-6">
            Forex Academy & Learning Hub
          </h2>
          <p className="text-xl text-topforex-text-secondary max-w-4xl mx-auto leading-relaxed">
            Master the art of trading with our comprehensive educational resources. 
            From beginner guides to advanced strategies, we provide everything you need 
            to become a successful trader.
          </p>
        </header>

        <Tabs defaultValue="courses" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="courses" className="text-lg py-3">
              <BookOpen className="w-5 h-5 mr-2" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="tools" className="text-lg py-3">
              <Calculator className="w-5 h-5 mr-2" />
              Trading Tools
            </TabsTrigger>
            <TabsTrigger value="articles" className="text-lg py-3">
              <TrendingUp className="w-5 h-5 mr-2" />
              Articles & Guides
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <Card key={course.id} className="glass-card topforex-card-hover animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="relative">
                    <img 
                      src={course.image}
                      alt={`${course.title} - Jacob Miller on Unsplash`}
                      className="w-full h-48 object-cover rounded-t-lg"
                      width="400"
                      height="192"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-topforex-accent text-white">
                        {course.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-bold text-topforex-text-primary mb-2">
                          {course.title}
                        </h3>
                        <p className="text-topforex-text-secondary">
                          {course.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-topforex-text-secondary">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.lessons} lessons
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{course.rating}</span>
                          </div>
                          <span className="text-sm text-topforex-text-secondary">
                            ({course.students})
                          </span>
                        </div>
                        <Badge variant="outline">
                          {course.level}
                        </Badge>
                      </div>

                      <Button className="w-full btn-topforex-primary interactive-hover">
                        Start Learning
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              {tools.map((tool, index) => (
                <Card key={index} className="glass-card topforex-card-hover animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-topforex-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-8 h-8 text-topforex-accent" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-topforex-text-primary">
                            {tool.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {tool.category}
                          </Badge>
                        </div>
                        <p className="text-topforex-text-secondary mb-4">
                          {tool.description}
                        </p>
                        <Button className="btn-topforex-primary interactive-hover">
                          Use Tool
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="articles" className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <Card key={index} className="glass-card topforex-card-hover animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {article.category}
                        </Badge>
                        {article.featured && (
                          <Badge className="bg-topforex-accent text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-topforex-text-primary mb-2">
                          {article.title}
                        </h3>
                        <p className="text-topforex-text-secondary">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-topforex-text-secondary">
                          {article.readTime}
                        </span>
                        <Button variant="ghost" className="text-topforex-accent hover:text-topforex-accent/80">
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="glass-card mt-16 animate-fade-in">
          <CardContent className="p-12 text-center">
            <div className="max-w-3xl mx-auto space-y-6">
              <h3 className="text-3xl font-bold text-topforex-text-primary">
                Ready to Start Your Trading Journey?
              </h3>
              <p className="text-xl text-topforex-text-secondary">
                Join thousands of successful traders who started with our educational resources. 
                Get access to premium courses, exclusive tools, and expert mentorship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-topforex-primary text-lg px-8 py-4 interactive-hover">
                  <Users className="w-5 h-5 mr-2" />
                  Join Trading Community
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Browse All Courses
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}