import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart3, BookOpen, Clock, Play, Target, TrendingUp } from 'lucide-react'

interface EducationLevel {
  level: string
  title: string
  description: string
  courseCount: number
  estimatedTime: string
}

interface EducationalSpotlightSectionProps {
  educationLevels: EducationLevel[]
}

export function EducationalSpotlightSection({ educationLevels }: EducationalSpotlightSectionProps) {
  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'beginner':
        return BookOpen
      case 'intermediate':
        return TrendingUp
      case 'advanced':
        return Target
      default:
        return BarChart3
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'advanced':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default:
        return 'bg-medium-grey/20 text-light-grey border-medium-grey'
    }
  }

  return (
    <section className="professional-section bg-professional-black">
      <div className="professional-container">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Learn to Trade with Confidence
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Master trading with our comprehensive educational resources designed for every skill level.
          </p>
        </div>

        {/* Education Levels Grid */}
        <div className="professional-grid professional-grid-3 mb-12">
          {educationLevels.map((level, index) => (
            <div 
              key={level.level}
              className="professional-card p-8 text-center interactive-professional animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Level Icon */}
              <div className="w-12 h-12 bg-professional-black border border-medium-grey rounded-lg flex items-center justify-center mx-auto mb-4">
                {(() => {
                  const IconComponent = getLevelIcon(level.level)
                  return <IconComponent className="w-6 h-6 text-pure-white" />
                })()}
              </div>

              {/* Level Badge */}
              <Badge 
                className={`mb-4 ${getLevelColor(level.level)}`}
              >
                {level.title}
              </Badge>

              {/* Description */}
              <p className="text-light-grey mb-6 leading-relaxed">
                {level.description}
              </p>

              {/* Stats */}
              <div className="flex justify-center space-x-6 mb-6 text-sm">
                <div className="flex items-center text-light-grey">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {level.courseCount} courses
                </div>
                <div className="flex items-center text-light-grey">
                  <Clock className="w-4 h-4 mr-1" />
                  {level.estimatedTime}
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                asChild
                className="btn-professional-primary w-full"
              >
                <Link to={`/education/${level.level}`}>
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* View All Education Link */}
        <div className="text-center">
          <Link 
            to="/education"
            className="inline-flex items-center text-pure-white hover:text-light-grey transition-colors font-medium"
          >
            Explore All Educational Content
            <Play className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}