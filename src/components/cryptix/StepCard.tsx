import React from 'react';

interface StepCardProps {
  step: number;
  title: string;
  description: string;
  illustration: React.ReactNode;
}

export function StepCard({ step, title, description, illustration }: StepCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 relative">
      {/* Illustration */}
      <div className="relative flex items-center justify-center">
        {illustration}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-pure-white font-['DM_Sans']">
          {title}
        </h3>
        <p className="text-cryptix-body text-cryptix-light-grey max-w-xs leading-6">
          {description}
        </p>
      </div>
    </div>
  );
}