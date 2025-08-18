import React from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { Testimonial } from '../../types/cryptix';

// Define Testimonial interface locally to avoid import issues
interface Testimonial {
  id: number;
  quote: string;
  author: string;
  position: string;
  avatar: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="relative">
      {/* Background Light */}
      <div className="absolute inset-0 w-[779px] h-[329px] bg-white/9 rounded-[475px] blur-[88px]" />
      
      <Card className="card-cryptix p-10 relative z-10 max-w-2xl">
        {/* Avatar */}
        <div className="mb-8">
          <Avatar className="w-[86px] h-12">
            <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
            <AvatarFallback>{testimonial.author.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        {/* Quote */}
        <blockquote className="mb-8">
          <p className="text-[28px] font-normal text-pure-white font-['DM_Sans'] leading-10 tracking-[-0.56px]">
            {testimonial.quote}
          </p>
        </blockquote>

        {/* Author Info */}
        <div className="flex justify-between items-end">
          <div>
            <div className="text-lg font-medium text-pure-white font-['DM_Sans']">
              {testimonial.author}
            </div>
            <div className="text-cryptix-body text-cryptix-light-grey">
              {testimonial.position}
            </div>
          </div>
          <div className="text-cryptix-body text-cryptix-light-grey">
            1/3
          </div>
        </div>
      </Card>
    </div>
  );
}