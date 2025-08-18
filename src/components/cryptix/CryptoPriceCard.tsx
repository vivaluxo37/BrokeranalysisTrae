import React from 'react';
import { Card } from '@/components/ui/card';
import { formatCryptoPrice, formatPercentage } from '@/utils/formatters';
import type { CryptoPrice } from '@/types/cryptix';
import BitcoinIcon from '../icons/BitcoinIcon';
import EthereumIcon from '../icons/EthereumIcon';
import DashIcon from '../icons/DashIcon';
import XRPIcon from '../icons/XRPIcon';
import { Shield } from 'lucide-react';

interface CryptoPriceCardProps {
  crypto: CryptoPrice;
  variant?: 'default' | 'compact';
}

export function CryptoPriceCard({ crypto, variant = 'default' }: CryptoPriceCardProps) {
  const isPositive = crypto.change24h >= 0;
  const changeColor = isPositive ? 'text-cryptix-green' : 'text-red-500';

  const getCryptoIcon = () => {
    const iconSize = variant === 'compact' ? 13 : 16;
    const iconColor = '#f5f5f5';
    
    switch (crypto.name.toLowerCase()) {
      case 'bitcoin':
        return <BitcoinIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'ethereum':
        return <EthereumIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'dash':
        return <DashIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'xrp':
        return <XRPIcon width={iconSize} height={iconSize} color={iconColor} />;
      case 'solana':
        return <Shield size={iconSize} className="text-purple-500" />;
      default:
        return <div className={`w-${iconSize/4} h-${iconSize/4} bg-gray-500 rounded-full`} />;
    }
  };

  if (variant === 'compact') {
    return (
      <Card className="card-cryptix p-3 flex items-center gap-3 min-w-[140px]">
        <div className="flex items-center gap-2">
          {getCryptoIcon()}
          <div className="flex flex-col items-start gap-1">
            <span className="text-cryptix-small text-pure-white font-['DM_Sans'] leading-tight">
              {crypto.name}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-cryptix-small text-pure-white font-['DM_Sans']">
                {formatCryptoPrice(crypto.price)}
              </span>
              <span className={`text-cryptix-small font-['DM_Sans'] ${changeColor}`}>
                {formatPercentage(crypto.change24h)}
              </span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card-cryptix p-4 flex items-center gap-3">
      {/* Crypto Icon */}
      <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
        {getCryptoIcon()}
      </div>

      {/* Crypto Info */}
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-pure-white font-['DM_Sans'] leading-tight">
          {crypto.name}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-cryptix-small text-pure-white font-['DM_Sans']">
            {formatCryptoPrice(crypto.price)}
          </span>
          <span className={`text-cryptix-small font-['DM_Sans'] ${changeColor}`}>
            {formatPercentage(crypto.change24h)}
          </span>
        </div>
      </div>
    </Card>
  );
}