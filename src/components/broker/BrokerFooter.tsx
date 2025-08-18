import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export const BrokerFooter: React.FC = () => {
  return (
    <footer className="bg-dark-navy text-pure-white">
      <div className="content-container py-12">
        {/* Footer content sections removed */}

        <Separator className="bg-medium-grey mb-8" />

        {/* CTA Section */}
        <div className="text-center mb-8">
          <Button size="lg" className="bg-accent-blue hover:bg-blue-600">
            <a href="#" className="flex items-center">
              VISIT ALLY INVEST
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>

        <Separator className="bg-medium-grey mb-8" />

        {/* Legal Information */}
        <div className="space-y-6 text-xs text-light-grey">
          <div>
            <h4 className="font-semibold text-pure-white mb-2">Disclaimer:</h4>
            <p className="leading-relaxed">
              Please note that by investing in and/or trading financial instruments, commodities and any other assets, you are 
              taking a high degree of risk and you can lose all your deposited money. You should only invest if you are fully 
              aware of the relevant risks. BrokerChooser does not provide investment or any other advice, for further information 
              please read our <a href="#" className="text-accent-blue hover:underline">General Terms and Conditions</a>.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-pure-white mb-2">Advertiser Disclosure:</h4>
            <p className="leading-relaxed">
              At BrokerChooser, we consider clarity and transparency as core values. BrokerChooser is free to use for everyone, 
              but earns a commission from some of its partners with no additional cost to you (please find the{' '}
              <a href="#" className="text-accent-blue hover:underline">list of such partners here</a>). However, please note that 
              all the material and information made available by BrokerChooser is prepared in accordance with the{' '}
              <a href="#" className="text-accent-blue hover:underline">best interest of our customers</a> and most importantly 
              independent from the remuneration structure we have in place with some of our partners.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-medium-grey">
            <div className="mb-4 md:mb-0">
              <p>Copyright <span className="font-semibold">BROKERCHOOSER</span> Ltd. 2025.</p>
              <p>Company reg#: C86950</p>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-pure-white">Privacy Policy</a>
              <a href="#" className="hover:text-pure-white">Cookie Policy</a>
              <a href="#" className="hover:text-pure-white">General Terms and Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};