import React from 'react';
import { Card } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="card-cryptix p-6 flex flex-col items-start gap-6">
      <div className="w-16 h-16 rounded-full bg-cryptix-dark flex items-center justify-center border border-white/8 shadow-[inset_0px_0px_16px_rgba(255,255,255,0.08)]">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-base font-medium text-pure-white font-['DM_Sans']">
          {title}
        </h3>
        <p className="text-cryptix-body text-cryptix-light-grey leading-6">
          {description}
        </p>
      </div>
    </Card>
  );
}