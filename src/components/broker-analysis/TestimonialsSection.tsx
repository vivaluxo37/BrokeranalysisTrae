import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Star, Quote, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  position: string;
  avatar: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const stats = [
    { icon: Users, label: 'Traders Helped', value: '10,000+', color: '#3b82f6' },
    { icon: Star, label: 'Average Rating', value: '4.8/5', color: '#f59e0b' },
    { icon: CheckCircle, label: 'Success Rate', value: '95%', color: '#10b981' },
    { icon: Award, label: 'Industry Awards', value: '12', color: '#ef4444' }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`}
      />
    ));
  };

  return (
    <section className="professional-section bg-charcoal-grey">
      <div className="content-container">
        <div className="text-center mb-12">
          <h2 className="text-section-title text-pure-white mb-4">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-subtitle max-w-2xl mx-auto">
            Join thousands of traders who trust our analysis to make informed decisions 
            about their broker selection and trading strategy.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index} className="professional-card text-center">
              <CardContent className="p-6">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="text-2xl font-bold text-pure-white mb-1">{stat.value}</div>
                <div className="text-sm text-muted-text">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-4xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="pl-4 md:basis-1/2">
                  <Card className="professional-card h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <Quote className="w-8 h-8 text-accent-blue flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center space-x-1 mb-3">
                            {renderStars(testimonial.rating)}
                          </div>
                          <blockquote className="text-light-grey leading-relaxed mb-4">
                            "{testimonial.quote}"
                          </blockquote>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage 
                            src={testimonial.avatar} 
                            alt={testimonial.author}
                          />
                          <AvatarFallback className="bg-accent-blue text-white">
                            {testimonial.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-pure-white">
                            {testimonial.author}
                          </div>
                          <div className="text-sm text-muted-text">
                            {testimonial.position}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Social Proof Section */}
        <div className="mt-16">
          <Card className="professional-card bg-gradient-to-r from-charcoal-grey to-medium-grey/20 border-accent-blue/20">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-pure-white mb-4">
                    Join Our Community
                  </h3>
                  <p className="text-muted-text mb-6">
                    Connect with fellow traders, share experiences, and get expert advice 
                    on broker selection and trading strategies.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-blue" />
                      <span className="text-light-grey">Free broker recommendations</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-blue" />
                      <span className="text-light-grey">Expert market analysis</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-blue" />
                      <span className="text-light-grey">Trading tools and calculators</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-accent-blue" />
                      <span className="text-light-grey">Community support</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-accent-blue mx-auto mb-4" />
                  <div className="text-3xl font-bold text-pure-white mb-2">10,000+</div>
                  <div className="text-muted-text mb-4">Active Community Members</div>
                  <div className="flex justify-center space-x-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Avatar key={i} className="w-8 h-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?img=${i + 10}`} />
                        <AvatarFallback className="bg-accent-blue text-white text-xs">
                          {String.fromCharCode(65 + i)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <div className="w-8 h-8 bg-medium-grey rounded-full flex items-center justify-center">
                      <span className="text-xs text-light-grey">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-text">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-accent-blue" />
              <span>Industry Recognition</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-accent-blue" />
              <span>Verified Reviews</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-accent-blue" />
              <span>Expert Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent-blue" />
              <span>Community Driven</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}