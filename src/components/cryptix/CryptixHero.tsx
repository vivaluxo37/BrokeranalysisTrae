import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';

export function CryptixHero() {
  return (
    <section className="relative min-h-screen bg-cryptix-dark pt-24 pb-24 overflow-hidden">
      {/* Background Lights */}
      <div className="absolute top-0 left-0 w-[535px] h-[440px] bg-white/1 rounded-full blur-[90px]" />
      <div className="absolute top-0 left-0 w-[347px] h-[332px] bg-[#abffe6]/5 rounded-full blur-[90px]" />
      <div className="absolute top-0 right-0 w-[308px] h-[909px] bg-white/1 rounded-full blur-[90px]" />
      <div className="absolute top-24 right-0 w-[190px] h-[694px] bg-[#abffe6]/5 rounded-full blur-[90px]" />

      {/* Dashboard Preview */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/assets/dashboard-preview.svg" 
          alt="Cryptix Dashboard Preview" 
          className="w-full max-w-[1184px] h-auto opacity-60"
        />
      </div>

      <div className="content-container relative z-10">
        <div className="flex flex-col items-center text-center gap-12">
          {/* Main Content */}
          <div className="max-w-4xl">
            <div className="space-y-4 mb-8">
              <h1 className="text-cryptix-hero text-pure-white leading-tight">
                Take Control of
                <br />
                Your Digital Assets
              </h1>
              <p className="text-cryptix-body text-cryptix-light-grey max-w-2xl mx-auto">
                Cryptix offers a comprehensive platform for buying, selling, and managing 
                cryptocurrencies, optimized fees and premium design.
              </p>
            </div>

            {/* CTA Button */}
            <Button className="btn-cryptix-primary inline-flex items-center gap-2 mb-12">
              Get started now
              <ArrowRight size={24} />
            </Button>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-cryptix-light-grey font-['DM_Sans']">
              They trust us
            </span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-cryptix-green text-cryptix-green" />
                ))}
              </div>
              <span className="text-base font-medium text-pure-white font-['DM_Sans']">
                4,9
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}