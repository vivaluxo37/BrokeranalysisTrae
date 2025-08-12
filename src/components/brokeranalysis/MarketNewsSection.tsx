import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { NewsCard } from './NewsCard'

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  thumbnail: string
  publishDate: string
  category: string
  readTime?: string
}

interface MarketNewsSectionProps {
  articles: NewsArticle[]
}

export function MarketNewsSection({ articles }: MarketNewsSectionProps) {
  return (
    <section className="professional-section bg-charcoal-grey">
      <div className="professional-container">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Market News & Expert Insights
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Stay informed with the latest market developments, broker updates, and expert analysis.
          </p>
        </div>

        {/* News Grid */}
        <div className="professional-grid professional-grid-3 mb-12">
          {articles.slice(0, 3).map((article, index) => (
            <div 
              key={article.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center">
          <Link 
            to="/news"
            className="inline-flex items-center text-pure-white hover:text-light-grey transition-colors font-medium"
          >
            View All News
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  )
}
