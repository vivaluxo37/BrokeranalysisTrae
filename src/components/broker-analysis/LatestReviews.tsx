import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Eye, Star, TrendingUp } from 'lucide-react';

interface Review {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  readTime: number;
  slug: string;
  author?: string;
}

interface LatestReviewsProps {
  reviews: Review[];
}

export function LatestReviews({ reviews }: LatestReviewsProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const featuredReview = reviews[0];
  const otherReviews = reviews.slice(1);

  return (
    <section className="professional-section bg-professional-black">
      <div className="w-full px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Latest Reviews & Analysis
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Stay updated with our latest broker reviews, market analysis, and trading insights 
            from our team of financial experts.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Review */}
          {featuredReview && (
            <div className="lg:col-span-2">
              <Card className="professional-card overflow-hidden h-full">
                <div className="relative h-64 md:h-80">
                  <img
                    src={featuredReview.image}
                    alt={featuredReview.title}
                    className="w-full h-full object-cover"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-professional-black/80 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-accent-blue text-white">
                    Featured
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-muted-text mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(featuredReview.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{featuredReview.readTime} min read</span>
                    </div>
                    {featuredReview.author && (
                      <div className="flex items-center space-x-1">
                        <span>by {featuredReview.author}</span>
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl text-pure-white mb-3 leading-tight">
                    {featuredReview.title}
                  </CardTitle>
                  <p className="text-muted-text mb-4 line-clamp-3">
                    {featuredReview.excerpt}
                  </p>
                  <Button asChild className="bg-accent-blue hover:bg-accent-blue/90">
                    <Link to={`/reviews/${featuredReview.slug}`}>
                      Read Full Review
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other Reviews */}
          <div className="space-y-6">
            {otherReviews.map((review) => (
              <Card key={review.id} className="professional-card group hover:border-accent-blue/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex space-x-4">
                    <img
                      src={review.image}
                      alt={review.title}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      style={{ width: '80px', height: '80px' }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-xs text-muted-text mb-2">
                        <span>{formatDate(review.publishedAt)}</span>
                        <span>•</span>
                        <span>{review.readTime} min</span>
                      </div>
                      <h3 className="font-semibold text-pure-white mb-2 line-clamp-2 group-hover:text-accent-blue transition-colors">
                        {review.title}
                      </h3>
                      <p className="text-sm text-muted-text mb-3 line-clamp-2">
                        {review.excerpt}
                      </p>
                      <Button asChild variant="ghost" size="sm" className="p-0 h-auto text-accent-blue hover:text-accent-blue/80">
                        <Link to={`/reviews/${review.slug}`}>
                          Read more →
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Newsletter Signup */}
            <Card className="professional-card bg-gradient-to-br from-charcoal-grey to-medium-grey/20 border-accent-blue/20">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-10 h-10 text-accent-blue mx-auto mb-3" />
                <h3 className="font-semibold text-pure-white mb-2">
                  Stay Updated
                </h3>
                <p className="text-sm text-muted-text mb-4">
                  Get the latest broker reviews and market insights delivered to your inbox.
                </p>
                <Button size="sm" className="bg-accent-blue hover:bg-accent-blue/90 w-full">
                  Subscribe to Newsletter
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-charcoal-grey">
          {[
            { icon: Eye, label: 'Monthly Readers', value: '50K+' },
            { icon: Star, label: 'Expert Reviews', value: '500+' },
            { icon: TrendingUp, label: 'Brokers Covered', value: '100+' },
            { icon: Calendar, label: 'Years Experience', value: '10+' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className="w-8 h-8 text-accent-blue mx-auto mb-2" />
              <div className="text-xl font-bold text-pure-white">{stat.value}</div>
              <div className="text-sm text-muted-text">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* View All Reviews CTA */}
        <div className="text-center mt-12">
          <Button asChild size="lg" variant="outline">
            <Link to="/reviews">
              View All Reviews
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}