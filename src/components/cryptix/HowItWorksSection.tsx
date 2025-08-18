import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { StepCard } from './StepCard';

export function HowItWorksSection() {
  return (
    <section className="py-16 bg-cryptix-dark relative">
      {/* Background Lights */}
      <div className="absolute left-1/2 top-16 transform -translate-x-1/2 w-[396px] h-[188px] bg-white/8 rounded-full blur-[79px]" />
      <div className="absolute right-0 top-16 w-[305px] h-[140px] bg-white/8 rounded-full blur-[79px]" />
      <div className="absolute left-0 top-16 w-[316px] h-[188px] bg-white/8 rounded-full blur-[79px]" />

      <div className="content-container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="space-y-4">
            <h2 className="text-cryptix-hero text-pure-white">
              How It Works
            </h2>
            <p className="text-cryptix-body text-cryptix-light-grey max-w-2xl">
              A simple, fast, and secure platform to manage your cryptocurrencies in just a few steps.
            </p>
          </div>

          <Button className="btn-cryptix-secondary inline-flex items-center gap-2">
            Create account now
            <ArrowRight size={24} />
          </Button>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <StepCard
            step={1}
            title="Create your account"
            description="Sign up easily and secure your profile in just a few steps."
            illustration={
              <img 
                src="/assets/step-1-illustration.svg" 
                alt="Create account illustration" 
                className="w-[304px] h-[277px]"
              />
            }
          />

          <StepCard
            step={2}
            title="Fund your wallet"
            description="Deposit your cryptos or make a transfer to start trading."
            illustration={
              <img 
                src="/assets/step-2-illustration.svg" 
                alt="Fund wallet illustration" 
                className="w-[305px] h-[277px]"
              />
            }
          />

          <StepCard
            step={3}
            title="Buy, sell, or convert"
            description="Enjoy the simplicity of a platform that makes every transaction seamless in real-time."
            illustration={
              <img 
                src="/assets/step-3-illustration.svg" 
                alt="Buy sell convert illustration" 
                className="w-[305px] h-[277px]"
              />
            }
          />
        </div>
      </div>
    </section>
  );
}