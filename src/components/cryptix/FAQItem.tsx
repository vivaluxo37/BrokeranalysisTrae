import React, { useState } from 'react';
import { Plus } from 'lucide-react';
// import { FAQItem as FAQItemType } from '../../types/cryptix';

// Define FAQItem interface locally to avoid import issues
interface FAQItemType {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'trading' | 'security' | 'fees';
}

interface FAQItemProps {
  faq: FAQItemType;
}

export function FAQItem({ faq }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-transparent">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <span className="text-lg font-medium text-pure-white font-['DM_Sans'] group-hover:text-cryptix-green transition-colors">
          {faq.question}
        </span>
        <div className={`w-4 h-4 rounded-sm bg-cryptix-green flex items-center justify-center transition-transform ${isOpen ? 'rotate-45' : ''}`}>
          <Plus size={16} className="text-black" />
        </div>
      </button>
      
      {isOpen && (
        <div className="pb-6">
          <p className="text-cryptix-body text-cryptix-light-grey leading-6">
            {faq.answer}
          </p>
        </div>
      )}
    </div>
  );
}