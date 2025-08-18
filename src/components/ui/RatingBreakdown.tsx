import React from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface RatingBreakdownProps {
  ratings: {
    [key: string]: number;
  };
  maxRating?: number;
  className?: string;
}

const categoryLabels: { [key: string]: string } = {
  fees: 'Fees',
  safety: 'Safety',
  deposit_withdrawal: 'Deposit & Withdrawal',
  account_opening: 'Account Opening',
  mobile_app: 'Mobile App',
  desktop_platform: 'Desktop Platform',
  product_selection: 'Product Selection'
};

const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'bg-green-500';
  if (rating >= 4.0) return 'bg-blue-500';
  if (rating >= 3.5) return 'bg-yellow-500';
  if (rating >= 3.0) return 'bg-orange-500';
  return 'bg-red-500';
};

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  ratings,
  maxRating = 5,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Object.entries(ratings).map(([category, rating]) => {
        if (category === 'overall') return null;
        
        const percentage = (rating / maxRating) * 100;
        const label = categoryLabels[category] || category;
        
        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-pure-white">{label}</span>
              <span className="text-sm font-bold text-pure-white">{rating.toFixed(1)}/5</span>
            </div>
            <div className="relative">
              <Progress 
                value={percentage} 
                className="h-2 bg-medium-grey"
              />
              <div 
                className={cn(
                  'absolute top-0 left-0 h-2 rounded-full transition-all',
                  getRatingColor(rating)
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};