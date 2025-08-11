import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BarChart3, BookOpen, FileText, GraduationCap, TrendingUp, Users } from 'lucide-react'

export function EducationalHubSection() {
  const educationalContent = [
    {
      icon: GraduationCap,
      title: "Forex Academy",
      description: "Complete forex trading course from basics to advanced strategies",
      articles: 150,
      color: "text-brokeranalysis-accent",
      bgColor: "bg-brokeranalysis-accent/20"
    },
    {
      icon: FileText,
      title: "Trading Guides",
      description: "Step-by-step tutorials for all trading platforms and strategies",
      articles: 85,
      color: "text-neural-blue",
      bgColor: "bg-neural-blue/20"
    },
    {
      icon: BarChart3,
      title: "Market Analysis",
      description: "Daily market insights and expert technical analysis",
      articles: 200,
      color: "text-topforex-teal",
      bgColor: "bg-topforex-teal/20"
    },
    {
      icon: BookOpen,
      title: "Trading Glossary",
      description: "Comprehensive dictionary of trading terms and concepts",
      articles: 300,
      color: "text-topforex-purple",
      bgColor: "bg-topforex-purple/20"
    }
  ]

  const recentArticles = [
    {
      title: "How to Choose Your First Forex Broker",
      category: "Beginner Guide",
      readTime: "5 min read",
      featured: true
    },
    {
      title: "Understanding Leverage and Margin Requirements",
      category: "Risk Management",
      readTime: "8 min read",
      featured: false
    },
    {
      title: "Top 10 Trading Strategies for 2025",
      category: "Strategy",
      readTime: "12 min read",
      featured: false
    }
  ]

  return (
    <section className="section-padding bg-gradient-mesh">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Badge className="bg-topforex-purple/20 text-topforex-purple border-topforex-purple/30 mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Educational Hub
          </Badge>
          <h2 className="text-section-title text-gradient mb-6">
            Master Trading with Expert Knowledge
          </h2>
          <p className="text-xl text-starfield-gray max-w-3xl mx-auto">
            From beginner basics to advanced strategies - comprehensive educational resources to accelerate your trading journey.
          </p>
        </div>

        {/* Educational Categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {educationalContent.map((content, index) => (
            <Card key={index} className="topforex-card topforex-card-hover group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto mb-4 ${content.bgColor} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <content.icon className={`w-8 h-8 ${content.color}`} />
                </div>
                <CardTitle className="text-lg text-luminescent-white mb-2">
                  {content.title}
                </CardTitle>
                <Badge variant="secondary" className="bg-glass-overlay/20 text-starfield-gray">
                  {content.articles} Articles
                </Badge>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-starfield-gray mb-6">
                  {content.description}
                </CardDescription>
                <Button 
                  variant="ghost" 
                  className={`${content.color} hover:text-white hover:${content.bgColor} group-hover:translate-x-1 transition-all duration-300`}
                >
                  Explore
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Articles */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-semibold text-luminescent-white mb-6">Latest Articles</h3>
            <div className="space-y-4">
              {recentArticles.map((article, index) => (
                <Card key={index} className={`glass-card hover:bg-glass-overlay/20 transition-all duration-300 cursor-pointer ${article.featured ? 'border-brokeranalysis-accent/30' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="secondary" className="bg-brokeranalysis-accent/20 text-brokeranalysis-accent text-xs">
                            {article.category}
                          </Badge>
                          {article.featured && (
                            <Badge className="bg-rating-excellent/20 text-rating-excellent text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <h4 className="text-lg font-semibold text-luminescent-white mb-2 hover:text-brokeranalysis-accent transition-colors duration-300">
                          {article.title}
                        </h4>
                        <div className="text-sm text-starfield-gray">
                          {article.readTime}
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-starfield-gray group-hover:text-brokeranalysis-accent group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-luminescent-white mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <Card className="glass-card p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-brokeranalysis-accent mb-2 flex items-center justify-center">
                    <Users className="w-6 h-6 mr-2" />
                    50K+
                  </div>
                  <div className="text-sm text-starfield-gray">Students Enrolled</div>
                </CardContent>
              </Card>
              
              <Card className="glass-card p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-neural-blue mb-2">
                    735+
                  </div>
                  <div className="text-sm text-starfield-gray">Educational Articles</div>
                </CardContent>
              </Card>
              
              <Card className="glass-card p-6 text-center">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-rating-excellent mb-2 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 mr-2" />
                    95%
                  </div>
                  <div className="text-sm text-starfield-gray">Success Rate</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-topforex-purple to-neural-blue hover:from-topforex-purple/90 hover:to-neural-blue/90 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <GraduationCap className="w-5 h-5 mr-2" />
            Start Learning Today
          </Button>
        </div>
      </div>
    </section>
  )
}