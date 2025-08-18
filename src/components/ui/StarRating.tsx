import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
  readonly?: boolean;
  onRatingChange?: (rating: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 20,
  showValue = false,
  className,
  readonly = true,
  onRatingChange
}) => {
  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.floor(rating);
          const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;
          
          return (
            <button
              key={index}
              type="button"
              disabled={readonly}
              onClick={() => handleStarClick(starValue)}
              className={cn(
                'relative transition-colors',
                !readonly && 'hover:scale-110 cursor-pointer',
                readonly && 'cursor-default'
              )}
            >
              <Star
                size={size}
                className={cn(
                  'transition-colors',
                  isFilled || isHalfFilled
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300',
                  !readonly && 'hover:text-yellow-300'
                )}
              />
              {isHalfFilled && (
                <Star
                  size={size}
                  className="absolute inset-0 text-yellow-400 fill-yellow-400"
                  style={{
                    clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-pure-white ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};