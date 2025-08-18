import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/StarRating';

interface ExpertReviewProps {
  expertReview: {
    author: {
      name: string;
      title: string;
      credentials: string;
      avatar_url: string;
      bio: string;
    };
    content: string;
    rating: number;
    updated_at: string;
  };
}

export const ExpertReview: React.FC<ExpertReviewProps> = ({ expertReview }) => {
  const { author, content, rating, updated_at } = expertReview;

  return (
    <section className="py-12 bg-charcoal-grey">
      <div className="content-container">
        <Card className="professional-card">
          <CardHeader>
            <CardTitle className="text-2xl text-pure-white">Expert Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Author Info */}
              <div className="lg:col-span-1">
                <div className="text-center lg:text-left">
                  <Avatar className="w-32 h-32 mx-auto lg:mx-0 mb-4">
                    <AvatarImage 
                      src={author.avatar_url} 
                      alt={`${author.name} - Professional headshot of financial analyst for expert review section`}
                      style={{ width: '128px', height: '128px' }}
                    />
                    <AvatarFallback className="text-2xl">
                      {author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h3 className="text-xl font-bold text-pure-white mb-2">{author.name}</h3>
                  <p className="text-accent-blue font-medium mb-2">{author.title}</p>
                  <Badge variant="secondary" className="mb-4">{author.credentials}</Badge>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                    <span className="text-sm text-light-grey">Expert Rating:</span>
                    <StarRating rating={rating} showValue size={16} />
                  </div>
                  
                  <p className="text-sm text-light-grey leading-relaxed">{author.bio}</p>
                  
                  <div className="mt-4 pt-4 border-t border-medium-grey">
                    <p className="text-xs text-light-grey">
                      Last updated: {new Date(updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg max-w-none">
                  <blockquote className="border-l-4 border-accent-blue pl-6 italic text-lg text-pure-white leading-relaxed">
                    "{content}"
                  </blockquote>
                </div>
                
                {/* Media Mentions */}
                <div className="mt-8 pt-6 border-t border-medium-grey">
                  <h4 className="text-sm font-semibold text-pure-white mb-4">Media mentions</h4>
                  <div className="flex flex-wrap gap-4">
                    <Badge variant="outline" className="text-xs">TRADERS</Badge>
                    <Badge variant="outline" className="text-xs">Bloomberg</Badge>
                    <Badge variant="outline" className="text-xs">FINANCIAL TIMES</Badge>
                    <Badge variant="outline" className="text-xs">sifted/ft</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};