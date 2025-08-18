import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function FinalCTASection() {
  return (
    <section className="py-16 bg-cryptix-dark relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cryptix-green to-transparent" />
      
      {/* Background Lights */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[614px] h-[194px] bg-white/9 rounded-[307px]" />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[666px] h-[184px] bg-cryptix-green/9 rounded-[320px] blur-[79px]" />

      <div className="content-container relative z-10">
        <div className="text-center space-y-10">
          {/* Floating Text */}
          <div className="text-cryptix-hero text-pure-white leading-tight space-y-2">
            <div className="flex flex-wrap justify-center items-center gap-2">
              <span>Join</span>
              <span className="bg-white/9 rounded-[307px] px-4 py-2">Ready</span>
              <span>thousands of users who trust</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2">
              <span>Cryptix for secure,</span>
              <span className="bg-white/9 rounded-[307px] px-4 py-2">to take control</span>
              <span>seamless, and efficient</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2">
              <span className="bg-white/9 rounded-[307px] px-4 py-2">of your crypto?</span>
              <span>cryptocurrency</span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-cryptix-body text-cryptix-light-grey max-w-2xl mx-auto">
                transactions. Start now and unlock the full potential of digital assets.
              </p>
            </div>

            {/* CTA Button */}
            <Button className="btn-cryptix-primary inline-flex items-center gap-2">
              Get started now
              <ArrowRight size={24} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}