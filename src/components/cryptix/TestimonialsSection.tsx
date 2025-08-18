import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TestimonialCard } from './TestimonialCard';
// import { Testimonial } from '../../types/cryptix';

// Define Testimonial interface locally to avoid import issues
interface Testimonial {
  id: number;
  quote: string;
  author: string;
  position: string;
  avatar: string;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  // Default testimonials if none provided
  const defaultTestimonials: Testimonial[] = [
    {
      id: 1,
      quote: "Cryptix has revolutionized my trading experience. The platform is intuitive, secure, and the zero fees have saved me thousands.",
      author: "Alex Thompson",
      position: "Professional Trader",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      id: 2,
      quote: "The best crypto platform I've used. Lightning-fast execution and excellent customer support make all the difference.",
      author: "Sarah Chen",
      position: "Crypto Investor",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      id: 3,
      quote: "As a beginner, Cryptix made crypto trading accessible and safe. The educational resources are top-notch.",
      author: "Michael Rodriguez",
      position: "New Investor",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  return (
    <section className="py-16 bg-cryptix-dark">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-cryptix-hero text-pure-white mb-4">
            Trusted by Crypto Enthusiasts Worldwide
          </h2>
          <p className="text-cryptix-body text-cryptix-light-grey max-w-3xl mx-auto">
            Join a growing community of investors who choose Cryptix for its seamless experience, 
            security, and premium design.
          </p>
        </div>

        {/* Testimonial and Navigation */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          {/* Testimonial Card */}
          <div className="flex-1 flex justify-center">
            <TestimonialCard testimonial={displayTestimonials[0]} />
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col gap-4">
            <Button 
              variant="outline" 
              className="btn-cryptix-secondary inline-flex items-center gap-2 border-white border-[1.67px]"
            >
              <ChevronLeft size={12} />
              Previous
            </Button>
            <Button 
              variant="outline" 
              className="btn-cryptix-secondary inline-flex items-center gap-2 border-white border-2"
            >
              Next
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}