import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export const BrokerHero: React.FC = () => {
  return (
    <section className="bg-dark-navy py-12">
      <div className="content-container">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-light-grey hover:text-pure-white">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href="/broker-reviews" className="text-light-grey hover:text-pure-white">
                Broker reviews
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-pure-white">
                Ally Invest review
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex-1 mb-8 lg:mb-0">
            <div className="flex items-center mb-4">
              <img
                src="https://images.unsplash.com/photo-1651055705032-d4187855b004?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw1fHxsb2dvJTIwZmluYW5jaWFsJTIwaW52ZXN0bWVudCUyMGFsbHl8ZW58MHwyfHx8MTc1NTMyNzc4NXww&ixlib=rb-4.1.0&q=85"
                alt="Professional financial services logo for Ally Invest brokerage company - Mariia Shalabaieva on Unsplash"
                className="w-16 h-16 object-contain rounded-lg bg-white p-2 mr-4"
                style={{ width: '64px', height: '64px' }}
              />
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-pure-white mb-2">
                  Ally Invest Review 2025
                </h1>
                <div className="flex items-center text-light-grey text-sm space-x-4">
                  <span>Written by <span className="text-pure-white">Adam Nasli</span></span>
                  <span>•</span>
                  <span>Fact checked by <span className="text-pure-white">Theresa W. Carey</span></span>
                  <span>•</span>
                  <span>Updated <span className="text-pure-white">4d ago</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Media Logos */}
          <div className="flex items-center space-x-8 opacity-60">
            <div className="text-center">
              <div className="w-24 h-12 bg-medium-grey rounded flex items-center justify-center mb-2">
                <span className="text-xs text-light-grey font-medium">BUSINESS</span>
              </div>
              <div className="text-xs text-light-grey">INSIDER</div>
            </div>
            <div className="text-center">
              <div className="w-24 h-12 bg-medium-grey rounded flex items-center justify-center mb-2">
                <span className="text-xs text-light-grey font-medium">CNBC</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-12 bg-medium-grey rounded flex items-center justify-center mb-2">
                <span className="text-xs text-light-grey font-medium">Forbes</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-12 bg-medium-grey rounded flex items-center justify-center mb-2">
                <span className="text-xs text-light-grey font-medium">Bloomberg</span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-12 bg-medium-grey rounded flex items-center justify-center mb-2">
                <span className="text-xs text-light-grey font-medium">FINANCIAL</span>
              </div>
              <div className="text-xs text-light-grey">TIMES</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};