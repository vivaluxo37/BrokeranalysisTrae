import { BookOpen, ArrowRight, Clock, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'

export function EducationalHubTeaser() {
  const courses = [
    {
      id: 'trading-fundamentals',
      title: 'Trading Fundamentals',
      description: 'Master the basics of trading with comprehensive lessons covering market analysis, order types, and risk management strategies.',
      lessons: 45,
      duration: '12 hours',
      students: '25,000+',
      level: 'Beginner',
      rating: 4.8,
      topics: ['Market Basics', 'Order Types', 'Chart Reading', 'Risk Management'],
      slug: '/academy/trading-fundamentals'
    },
    {
      id: 'risk-management',
      title: 'Risk Management Strategies',
      description: 'Learn advanced risk management techniques to protect your capital and maximize long-term trading success.',
      lessons: 28,
      duration: '8 hours',
      students: '18,500+',
      level: 'Intermediate',
      rating: 4.9,
      topics: ['Position Sizing', 'Stop Losses', 'Portfolio Management', 'Psychology'],
      slug: '/academy/risk-management'
    },
    {
      id: 'technical-analysis',
      title: 'Technical Analysis Mastery',
      description: 'Deep dive into technical analysis with advanced charting techniques, indicators, and pattern recognition.',
      lessons: 52,
      duration: '15 hours',
      students: '12,300+',
      level: 'Advanced',
      rating: 4.7,
      topics: ['Chart Patterns', 'Indicators', 'Support/Resistance', 'Trading Systems'],
      slug: '/academy/technical-analysis'
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-500/20 text-green-400'
      case 'Intermediate': return 'bg-yellow-500/20 text-yellow-400'
      case 'Advanced': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <section className="section-padding cosmic-void neural-network" aria-labelledby="education-heading">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 id="education-heading" className="text-section-title cosmic-text mb-6 text-glow">
            Forex Academy & Learning Hub
          </h2>
          <p className="text-xl neural-text max-w-4xl mx-auto leading-relaxed">
            Master the art of trading with our comprehensive educational resources. 
            From beginner guides to advanced strategies, we provide everything you need 
            to become a successful trader.
          </p>
        </header>

        {/* Course grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, index) => (
            <Card key={course.id} className="topforex-card topforex-card-hover floating-node" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-8">
                {/* Course header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mx-auto mb-4 cosmic-glow">
                    <BookOpen className="w-8 h-8 text-topforex-accent" />
                  </div>
                  <h3 className="text-2xl font-bold cosmic-text mb-2">{course.title}</h3>
                  <Badge className={`${getLevelColor(course.level)} text-xs rounded-full`}>
                    {course.level}
                  </Badge>
                </div>

                {/* Course description */}
                <p className="neural-text text-center mb-6 leading-relaxed">
                  {course.description}
                </p>

                {/* Course stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 glass-card rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BookOpen className="w-4 h-4 text-topforex-accent" />
                      <span className="cosmic-text font-semibold">{course.lessons}</span>
                    </div>
                    <div className="neural-text text-sm">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-topforex-accent" />
                      <span className="cosmic-text font-semibold">{course.duration}</span>
                    </div>
                    <div className="neural-text text-sm">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-topforex-accent" />
                      <span className="cosmic-text font-semibold">{course.students}</span>
                    </div>
                    <div className="neural-text text-sm">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-4 h-4 text-topforex-accent" />
                      <span className="cosmic-text font-semibold">{course.rating}</span>
                    </div>
                    <div className="neural-text text-sm">Rating</div>
                  </div>
                </div>

                {/* Course topics */}
                <div className="mb-6">
                  <h4 className="cosmic-text font-semibold mb-3 text-sm">What You'll Learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs border-topforex-accent/30 text-topforex-accent">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* CTA button */}
                <Button 
                  className="w-full bg-topforex-accent hover:bg-topforex-accent/80 text-white rounded-full"
                  asChild
                >
                  <Link to={course.slug}>
                    Start Learning
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional learning resources */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="topforex-card">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold cosmic-text mb-4">Free Trading Tools</h3>
              <p className="neural-text mb-6">
                Access our collection of free calculators, market analysis tools, and trading utilities.
              </p>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full" asChild>
                <Link to="/tools">
                  Explore Tools
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="topforex-card">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold cosmic-text mb-4">Market Insights Blog</h3>
              <p className="neural-text mb-6">
                Stay updated with daily market analysis, trading strategies, and broker industry news.
              </p>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-full" asChild>
                <Link to="/blog">
                  Read Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA to full academy */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-topforex-accent hover:bg-topforex-accent/80 text-white px-8 rounded-full"
            asChild
          >
            <Link to="/academy">
              Explore Full Academy
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}