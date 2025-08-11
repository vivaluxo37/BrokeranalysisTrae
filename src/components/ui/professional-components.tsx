import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Professional Badge Component - Only Black/White/Grey
interface ProfessionalBadgeProps {
  children: ReactNode
  variant?: 'default' | 'secondary' | 'outline' | 'level'
  level?: 'Beginner' | 'Intermediate' | 'Advanced'
  className?: string
}

export function ProfessionalBadge({ 
  children, 
  variant = 'default', 
  level,
  className 
}: ProfessionalBadgeProps) {
  const getVariantClasses = () => {
    if (variant === 'level' && level) {
      switch (level) {
        case 'Beginner':
          return 'bg-light-grey text-professional-black'
        case 'Intermediate':
          return 'bg-medium-grey text-pure-white'
        case 'Advanced':
          return 'bg-professional-black text-pure-white border border-light-grey'
        default:
          return 'bg-charcoal-grey text-pure-white'
      }
    }
    
    switch (variant) {
      case 'secondary':
        return 'bg-charcoal-grey text-pure-white'
      case 'outline':
        return 'border border-medium-grey text-light-grey bg-transparent'
      default:
        return 'bg-medium-grey text-pure-white'
    }
  }

  return (
    <Badge 
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium transition-colors',
        getVariantClasses(),
        className
      )}
    >
      {children}
    </Badge>
  )
}

// Professional Progress Bar - Only Black/White/Grey
interface ProfessionalProgressProps {
  value: number
  max?: number
  className?: string
  showPercentage?: boolean
}

export function ProfessionalProgress({ 
  value, 
  max = 100, 
  className,
  showPercentage = false 
}: ProfessionalProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  
  return (
    <div className={cn('space-y-2', className)}>
      {showPercentage && (
        <div className="flex justify-between text-sm">
          <span className="text-light-grey">Progress</span>
          <span className="text-pure-white font-medium">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-charcoal-grey rounded-full h-2">
        <div 
          className="bg-pure-white h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Professional Hero Section - Only Black/White/Grey
interface ProfessionalHeroProps {
  title: string
  subtitle?: string
  description?: string
  icon?: ReactNode
  children?: ReactNode
  className?: string
}

export function ProfessionalHero({ 
  title, 
  subtitle, 
  description, 
  icon, 
  children,
  className 
}: ProfessionalHeroProps) {
  return (
    <div className={cn(
      'bg-charcoal-grey text-pure-white py-16 rounded-lg',
      className
    )}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        {icon && (
          <div className="w-16 h-16 mx-auto mb-6 text-pure-white">
            {icon}
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-pure-white">
          {title}
        </h1>
        {subtitle && (
          <div className="text-lg font-medium mb-4 text-light-grey">
            {subtitle}
          </div>
        )}
        {description && (
          <p className="text-xl mb-8 text-light-grey">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}

// Professional Search and Filter Section
interface ProfessionalSearchFilterProps {
  searchValue: string
  onSearchChange: (value: string) => void
  filters?: Array<{
    label: string
    value: string
    options: string[]
    onChange: (value: string) => void
  }>
  resultsCount?: number
  totalCount?: number
  className?: string
}

export function ProfessionalSearchFilter({
  searchValue,
  onSearchChange,
  filters = [],
  resultsCount,
  totalCount,
  className
}: ProfessionalSearchFilterProps) {
  return (
    <div className={cn('professional-card p-6', className)}>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="professional-input w-full"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter, index) => (
            <select
              key={index}
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="professional-input min-w-[120px]"
            >
              {filter.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ))}
        </div>
      </div>
      {(resultsCount !== undefined && totalCount !== undefined) && (
        <div className="mt-4 text-sm text-light-grey">
          Showing {resultsCount} of {totalCount} results
        </div>
      )}
    </div>
  )
}

// Professional Category Card
interface ProfessionalCategoryCardProps {
  title: string
  description: string
  icon: ReactNode
  level?: string
  articles?: Array<{
    title: string
    slug: string
    duration?: string
  }>
  onViewAll?: () => void
  className?: string
}

export function ProfessionalCategoryCard({
  title,
  description,
  icon,
  level,
  articles = [],
  onViewAll,
  className
}: ProfessionalCategoryCardProps) {
  return (
    <Card className={cn('professional-card hover:shadow-lg transition-shadow', className)}>
      <CardHeader className="bg-charcoal-grey text-pure-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 text-pure-white">
            {icon}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-pure-white">{title}</CardTitle>
            {level && (
              <ProfessionalBadge variant="outline" className="mt-2">
                {level}
              </ProfessionalBadge>
            )}
          </div>
        </div>
        <p className="text-light-grey text-sm">{description}</p>
      </CardHeader>
      <CardContent className="p-6">
        {articles.length > 0 && (
          <>
            <h4 className="font-semibold text-pure-white mb-3">Popular Articles:</h4>
            <ul className="space-y-2 mb-4">
              {articles.slice(0, 3).map((article, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="text-light-grey hover:text-pure-white transition-colors text-sm flex-1 cursor-pointer">
                    {article.title}
                  </span>
                  {article.duration && (
                    <span className="text-xs text-light-grey ml-2">{article.duration}</span>
                  )}
                </li>
              ))}
            </ul>
            {onViewAll && (
              <Button 
                onClick={onViewAll}
                className="btn-professional-secondary w-full"
              >
                View All Articles ({articles.length})
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Professional Learning Path Card
interface ProfessionalLearningPathProps {
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  modules: number
  completedModules?: number
  icon: ReactNode
  onStart?: () => void
  onContinue?: () => void
  className?: string
}

export function ProfessionalLearningPath({
  title,
  description,
  level,
  duration,
  modules,
  completedModules = 0,
  icon,
  onStart,
  onContinue,
  className
}: ProfessionalLearningPathProps) {
  const progress = completedModules > 0 ? (completedModules / modules) * 100 : 0
  const hasProgress = progress > 0

  return (
    <Card className={cn('professional-card hover:shadow-lg transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-pure-white text-professional-black rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <ProfessionalBadge variant="level" level={level}>
            {level}
          </ProfessionalBadge>
        </div>
        
        <h3 className="text-xl font-bold text-pure-white mb-2">{title}</h3>
        <p className="text-light-grey mb-4">{description}</p>
        
        <div className="flex items-center gap-4 text-sm text-light-grey mb-4">
          <span>{duration}</span>
          <span>{modules} modules</span>
        </div>
        
        {hasProgress && (
          <div className="mb-4">
            <ProfessionalProgress 
              value={progress} 
              showPercentage 
            />
          </div>
        )}
        
        <Button 
          className={hasProgress ? "btn-professional-primary w-full" : "btn-professional-secondary w-full"}
          onClick={hasProgress ? onContinue : onStart}
        >
          {hasProgress ? 'Continue Learning' : 'Start Path'}
        </Button>
      </CardContent>
    </Card>
  )
}

// Professional Newsletter Section
interface ProfessionalNewsletterProps {
  title: string
  description: string
  onSubscribe?: (email: string) => void
  className?: string
}

export function ProfessionalNewsletter({
  title,
  description,
  onSubscribe,
  className
}: ProfessionalNewsletterProps) {
  return (
    <div className={cn('professional-card p-8 text-center', className)}>
      <h2 className="text-3xl font-bold mb-4 text-pure-white">
        {title}
      </h2>
      <p className="text-xl mb-8 max-w-2xl mx-auto text-light-grey">
        {description}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          className="professional-input flex-1"
        />
        <Button className="btn-professional-primary">
          Subscribe
        </Button>
      </div>
      <p className="text-sm mt-4 text-light-grey">
        No spam. Unsubscribe anytime. Your privacy is protected.
      </p>
    </div>
  )
}
