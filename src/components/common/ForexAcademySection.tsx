import { ArrowRight, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export function ForexAcademySection() {
  const courses = [
    {
      title: "Trading Fundamentals",
      lessons: "45 lessons",
      duration: "12 hours",
      students: "25,000+",
      description: "Master the basics of trading with comprehensive lessons covering market analysis, order types, and risk management strategies.",
      link: "/academy/trading-fundamentals"
    },
    {
      title: "Risk Management",
      lessons: "28 lessons", 
      duration: "8 hours",
      students: "18,500+",
      description: "Learn advanced risk management techniques to protect your capital and maximize long-term trading success.",
      link: "/academy/risk-management"
    },
    {
      title: "Technical Analysis",
      lessons: "52 lessons",
      duration: "15 hours", 
      students: "12,300+",
      description: "Deep dive into technical analysis with advanced charting techniques, indicators, and pattern recognition.",
      link: "/academy/technical-analysis"
    }
  ]

  return (
    <section className="section-padding cosmic-void neural-network">
      <div className="container mx-auto container-padding">
        <header className="text-center mb-16 animate-fade-in">
          <h2 className="text-section-title cosmic-text mb-6 text-glow">
            Forex Academy & Learning Hub
          </h2>
          <p className="text-xl neural-text max-w-4xl mx-auto leading-relaxed">
            Master the art of trading with our comprehensive educational resources. 
            From beginner guides to advanced strategies, we provide everything you need 
            to become a successful trader.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <Card key={index} className="topforex-card topforex-card-hover floating-node" style={{ animationDelay: `${index * 0.2}s` }}>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mx-auto mb-6 cosmic-glow">
                  <BookOpen className="w-8 h-8 text-topforex-accent" />
                </div>
                <h3 className="text-2xl font-bold cosmic-text mb-4">{course.title}</h3>
                <p className="neural-text text-center mb-6 leading-relaxed">
                  {course.description}
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-center gap-4 neural-text text-sm">
                    <span>{course.lessons}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </div>
                  <div className="neural-text text-sm">{course.students} students</div>
                </div>
                <Button 
                  className="w-full bg-topforex-accent hover:bg-topforex-accent/80 text-white rounded-full"
                  asChild
                >
                  <Link to={course.link}>
                    Start Learning {course.title}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}