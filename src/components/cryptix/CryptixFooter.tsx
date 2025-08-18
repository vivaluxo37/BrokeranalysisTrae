import React from 'react';
import CryptixLogoIcon from '../icons/CryptixLogoIcon';

export function CryptixFooter() {
  return (
    <footer className="bg-cryptix-dark border-t border-cryptix-border">
      <div className="content-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Logo and Description */}
            <div className="space-y-3">
              <CryptixLogoIcon width={117} height={40} color="#f5f5f5" />
              <p className="text-cryptix-body text-cryptix-light-grey max-w-md leading-6">
                Secure, fast, and seamless crypto trading. Cryptix makes digital assets effortless.
              </p>
            </div>

            {/* Attribution */}
            <div className="flex items-center gap-2 text-cryptix-body text-cryptix-light-grey">
              <span>Created by</span>
              <div className="flex items-center gap-2">
                <img 
                  src="/assets/framer-logo.png" 
                  alt="Arthur" 
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium">Arthur</span>
              </div>
              <span>in</span>
              <span className="font-medium">Framer</span>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex gap-16">
            {/* Navigation Column */}
            <div className="space-y-6">
              <h3 className="text-base font-medium text-pure-white font-['DM_Sans']">
                Navigation
              </h3>
              <div className="space-y-5">
                <a href="#why-cryptix" className="block text-sm text-cryptix-light-grey hover:text-pure-white transition-colors font-['DM_Sans']">
                  Why Cryptix?
                </a>
                <a href="#cryptos" className="block text-sm text-cryptix-light-grey hover:text-pure-white transition-colors font-['DM_Sans']">
                  Cryptos
                </a>
                <a href="#how-it-works" className="block text-sm text-cryptix-light-grey hover:text-pure-white transition-colors font-['DM_Sans']">
                  How it works
                </a>
                <a href="#faq" className="block text-sm text-cryptix-light-grey hover:text-pure-white transition-colors font-['DM_Sans']">
                  FAQ
                </a>
                <a href="/404" className="block text-sm text-cryptix-light-grey hover:text-pure-white transition-colors font-['DM_Sans']">
                  404
                </a>
              </div>
            </div>

            {/* Socials Column */}
            <div className="space-y-6">
              <h3 className="text-base font-medium text-pure-white font-['DM_Sans']">
                Socials
              </h3>
              <div className="space-y-5">
                <a href="#" className="block text-sm text-cryptix-light-grey hover:text-pure-white transition-colors font-['DM_Sans']">
                  Twitter (X)
                </a>
                <a href="#" className="block text-sm text-cryptix-light-grey hover:text-pure-white transition-colors font-['DM_Sans']">
                  Instagram
                </a>
                <a href="#" className="block text-sm text-cryptix-light-grey hover:text-pure-white transition-colors font-['DM_Sans']">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="border-t border-cryptix-border h-px" />
    </footer>
  );
}