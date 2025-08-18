import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FAQItem } from './FAQItem';
// import { FAQItem as FAQItemType } from '../../types/cryptix';

// Define FAQItem interface locally to avoid import issues
interface FAQItemType {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'trading' | 'security' | 'fees';
}

interface FAQSectionProps {
  faqItems: FAQItemType[];
}

export function FAQSection({ faqItems }: FAQSectionProps) {
  const leftColumnFAQs = faqItems.slice(0, 4);
  const rightColumnFAQs = faqItems.slice(4, 8);

  return (
    <section className="py-16 bg-cryptix-dark" id="faq">
      <div className="content-container">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-cryptix-hero text-pure-white">
              Your Questions, Answered
            </h2>
            <p className="text-cryptix-body text-cryptix-light-grey max-w-2xl">
              Find everything you need to know about Cryptix, from security to supported assets.
            </p>
          </div>

          <Button className="btn-cryptix-secondary inline-flex items-center gap-2">
            Create account now
            <ArrowRight size={24} />
          </Button>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-0">
            {leftColumnFAQs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-cryptix-border mx-auto" />

          {/* Right Column */}
          <div className="space-y-0">
            {rightColumnFAQs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}