import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

interface NewsCardProps {
  article: {
    id: string
    title: string
    excerpt: string
    thumbnail: string
    publishDate: string
    category: string
    readTime?: string
  }
}

export function NewsCard({ article }: NewsCardProps) {
  const formatDate = (dateString: string): string => {
    // Validate the date string before creating Date object
    if (!dateString || dateString.trim() === '') {
      return 'Date unavailable'
    }
    
    const date = new Date(dateString)
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date)
  }

  const formatTitle = (title: string, maxLength = 60): string => {
    if (!title) return ''
    if (title.length <= maxLength) return title
    return `${title.substring(0, maxLength).trim()  }...`
  }

  const formatExcerpt = (excerpt: string, maxLength = 120): string => {
    if (!excerpt) return ''
    if (excerpt.length <= maxLength) return excerpt
    return `${excerpt.substring(0, maxLength).trim()  }...`
  }

  return (
    <Link to={`/news/${article.id}`} className="block">
      <div className="professional-card p-0 overflow-hidden interactive-professional">
        {/* Thumbnail */}
        <div className="aspect-video overflow-hidden">
          <img 
            src={article.thumbnail} 
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category and Date */}
          <div className="flex items-center justify-between mb-3">
            <Badge 
              variant="outline" 
              className="text-light-grey border-medium-grey text-xs"
            >
              {article.category}
            </Badge>
            <div className="flex items-center text-light-grey text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {article.readTime || '3 min read'}
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-pure-white mb-3 leading-tight">
            {formatTitle(article.title)}
          </h3>

          {/* Excerpt */}
          <p className="text-light-grey text-sm leading-relaxed mb-4">
            {formatExcerpt(article.excerpt)}
          </p>

          {/* Date */}
          <div className="text-light-grey text-xs">
            {formatDate(article.publishDate)}
          </div>
        </div>
      </div>
    </Link>
  )
}
