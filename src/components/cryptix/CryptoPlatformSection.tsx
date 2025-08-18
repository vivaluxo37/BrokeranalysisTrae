import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CryptoPriceCard } from './CryptoPriceCard';

// Define CryptoPrice interface locally to avoid import issues
interface CryptoPrice {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  icon: string;
}

interface CryptoPlatformSectionProps {
  cryptoPrices: CryptoPrice[];
}

export function CryptoPlatformSection({ cryptoPrices }: CryptoPlatformSectionProps) {
  // Safety check to ensure we have enough crypto data
  if (!cryptoPrices || cryptoPrices.length < 4) {
    return (
      <section className="py-16 bg-cryptix-dark">
        <div className="content-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-cryptix-hero text-pure-white">
                  All Cryptos, One Platform
                </h2>
                <p className="text-cryptix-body text-cryptix-light-grey">
                  Buy, sell, and convert all major cryptocurrencies on a single platform. 
                  A seamless experience with no compromises.
                </p>
              </div>

              <Button className="btn-cryptix-secondary inline-flex items-center gap-2">
                Buy crypto now
                <ArrowRight size={24} />
              </Button>
            </div>

            {/* Right Content - Loading State */}
            <div className="space-y-4">
              <div className="text-cryptix-body text-cryptix-light-grey text-center">
                Loading crypto prices...
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-cryptix-dark">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-cryptix-hero text-pure-white">
                All Cryptos, One Platform
              </h2>
              <p className="text-cryptix-body text-cryptix-light-grey">
                Buy, sell, and convert all major cryptocurrencies on a single platform. 
                A seamless experience with no compromises.
              </p>
            </div>

            <Button className="btn-cryptix-secondary inline-flex items-center gap-2">
              Buy crypto now
              <ArrowRight size={24} />
            </Button>
          </div>

          {/* Right Content - Crypto Price Lists */}
          <div className="space-y-2">
            {/* First Row */}
            <div className="flex gap-2 overflow-x-auto">
              <CryptoPriceCard crypto={cryptoPrices[0]} />
              <CryptoPriceCard crypto={cryptoPrices[1]} />
              <CryptoPriceCard crypto={cryptoPrices[2]} />
              <CryptoPriceCard crypto={cryptoPrices[3]} />
            </div>

            {/* Second Row */}
            <div className="flex gap-2 overflow-x-auto">
              <CryptoPriceCard crypto={cryptoPrices[2]} />
              <CryptoPriceCard crypto={cryptoPrices[3]} />
              <CryptoPriceCard crypto={cryptoPrices[0]} />
              <CryptoPriceCard crypto={cryptoPrices[4] || cryptoPrices[1]} />
            </div>

            {/* Third Row */}
            <div className="flex gap-2 overflow-x-auto">
              <CryptoPriceCard crypto={cryptoPrices[0]} />
              <CryptoPriceCard crypto={cryptoPrices[1]} />
              <CryptoPriceCard crypto={cryptoPrices[2]} />
              <CryptoPriceCard crypto={cryptoPrices[3]} />
            </div>

            {/* Fourth Row */}
            <div className="flex gap-2 overflow-x-auto">
              <CryptoPriceCard crypto={cryptoPrices[2]} />
              <CryptoPriceCard crypto={cryptoPrices[3]} />
              <CryptoPriceCard crypto={cryptoPrices[0]} />
              <CryptoPriceCard crypto={cryptoPrices[4] || cryptoPrices[1]} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}