import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarRating } from '@/components/ui/StarRating';
import { formatTimeAgo } from '../string-formatters';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  trading_experience: string;
  verified: boolean;
  helpful_count: number;
}

interface BrokerReviewSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onSubmitReview?: (review: {
    rating: number;
    title: string;
    content: string;
    tradingExperience: string;
  }) => void;
}

export const BrokerReviewSection: React.FC<BrokerReviewSectionProps> = ({
  reviews,
  averageRating,
  totalReviews,
  onSubmitReview
}) => {
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: '',
    content: '',
    tradingExperience: ''
  });
  const [filter, setFilter] = useState('all');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitReview && newReview.title && newReview.content) {
      onSubmitReview(newReview);
      setNewReview({ rating: 5, title: '', content: '', tradingExperience: '' });
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === 'verified') return review.verified;
    if (filter === 'recent') {
      const reviewDate = new Date(review.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reviewDate > thirtyDaysAgo;
    }
    if (filter === 'helpful') return review.helpful_count > 10;
    return true;
  });

  return (
    <section className="py-12 bg-charcoal-grey">
      <div className="content-container">
        <Card className="professional-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl text-pure-white">User Reviews</CardTitle>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={averageRating} showValue size={20} />
                </div>
                <p className="text-sm text-light-grey">{totalReviews} reviews</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Review Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Reviews
              </Button>
              <Button
                variant={filter === 'verified' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('verified')}
              >
                Verified Only
              </Button>
              <Button
                variant={filter === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('recent')}
              >
                Recent (30 days)
              </Button>
              <Button
                variant={filter === 'helpful' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('helpful')}
              >
                Most Helpful
              </Button>
            </div>

            {/* Write Review Form */}
            <div className="mb-8 p-6 border border-medium-grey rounded-lg bg-professional-black">
              <h3 className="text-lg font-semibold text-pure-white mb-4">Write a Review</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-pure-white">Rating</Label>
                    <div className="mt-2">
                      <StarRating
                        rating={newReview.rating}
                        readonly={false}
                        onRatingChange={(rating) => setNewReview(prev => ({ ...prev, rating }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-pure-white">Trading Experience</Label>
                    <Select 
                      value={newReview.tradingExperience} 
                      onValueChange={(value) => setNewReview(prev => ({ ...prev, tradingExperience: value }))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                        <SelectItem value="professional">Professional (5+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label className="text-pure-white">Review Title</Label>
                  <Input
                    value={newReview.title}
                    onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Summarize your experience"
                    className="mt-2"
                    maxLength={100}
                  />
                </div>
                
                <div>
                  <Label className="text-pure-white">Detailed Review</Label>
                  <Textarea
                    value={newReview.content}
                    onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your detailed experience with this broker..."
                    rows={4}
                    className="mt-2"
                    maxLength={1000}
                  />
                  <div className="text-xs text-light-grey mt-1">
                    {newReview.content.length}/1000 characters
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={!newReview.title || !newReview.content}
                  className="bg-accent-blue hover:bg-blue-600"
                >
                  Submit Review
                </Button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="border border-medium-grey rounded-lg p-6 bg-professional-black">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-pure-white text-lg">{review.title}</h4>
                        {review.verified && (
                          <Badge className="bg-green-600 text-white text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-light-grey mb-2">
                        <StarRating rating={review.rating} size={16} showValue />
                        <span>by {review.user_name}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {review.trading_experience}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right text-sm text-light-grey">
                      <div>{formatTimeAgo(new Date(review.created_at))}</div>
                      {review.helpful_count > 0 && (
                        <div className="mt-1">{review.helpful_count} found helpful</div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-pure-white leading-relaxed mb-4">{review.content}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-medium-grey">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-light-grey hover:text-pure-white">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Helpful ({review.helpful_count})
                      </Button>
                      <Button variant="ghost" size="sm" className="text-light-grey hover:text-pure-white">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12">
                <p className="text-light-grey text-lg">No reviews found for the selected filter.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};