import React from 'react';
import { FeatureCard } from './FeatureCard';
import SecurityIcon from '../icons/SecurityIcon';
import LightningIcon from '../icons/LightningIcon';
import OptimizationIcon from '../icons/OptimizationIcon';
import InterfaceIcon from '../icons/InterfaceIcon';

export function CryptixFeatures() {
  return (
    <section className="py-12 bg-cryptix-dark">
      <div className="content-container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="space-y-4 mb-6">
            <h2 className="text-cryptix-hero text-pure-white">
              Why Choose Cryptix?
            </h2>
            <p className="text-cryptix-body text-cryptix-light-grey max-w-2xl mx-auto">
              Benefits designed to provide a seamless, secure, and accessible experience for all users.
            </p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<SecurityIcon width={64} height={64} color="#f5f5f5" />}
            title="Maximum Security"
            description="Your assets are protected with cutting-edge security protocols."
          />
          <FeatureCard
            icon={<LightningIcon width={64} height={64} color="#f5f5f5" />}
            title="Instant Transactions"
            description="Execute your transactions in real-time, without delays."
          />
          <FeatureCard
            icon={<OptimizationIcon width={64} height={64} color="#f5f5f5" />}
            title="Optimized Fees"
            description="Benefit from some of the lowest fees on the market."
          />
          <FeatureCard
            icon={<InterfaceIcon width={64} height={64} color="#f5f5f5" />}
            title="Premium Interface"
            description="An elegant, intuitive design that's easy to use, even for beginners."
          />
        </div>

        {/* Border */}
        <div className="mt-12 border-t border-b border-cryptix-border h-px" />
      </div>
    </section>
  );
}