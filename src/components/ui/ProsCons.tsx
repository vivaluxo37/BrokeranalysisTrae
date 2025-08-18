import React from 'react';
import { CircleCheck, CircleX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ProsConsProps {
  pros: string[];
  cons: string[];
  className?: string;
}

export const ProsCons: React.FC<ProsConsProps> = ({
  pros,
  cons,
  className
}) => {
  return (
    <div className={cn('grid md:grid-cols-2 gap-6', className)}>
      {/* Pros */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="text-xl text-green-600 flex items-center gap-2">
            <CircleCheck className="w-5 h-5" />
            Pros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {pros.map((pro, index) => (
              <li key={index} className="flex items-start gap-3">
                <CircleCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-pure-white leading-relaxed">{pro}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Cons */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="text-xl text-red-600 flex items-center gap-2">
            <CircleX className="w-5 h-5" />
            Cons
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {cons.map((con, index) => (
              <li key={index} className="flex items-start gap-3">
                <CircleX className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-pure-white leading-relaxed">{con}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};