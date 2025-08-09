import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, AlertCircle } from 'lucide-react'
import BrokerLogo from '@/components/BrokerLogo'
import type { Broker } from '@/types/broker'
import { RegulatorType } from '@/enums'
import { useAssetLoader, generateBrokerLogoFallbacks } from '@/utils/assetLoader'

interface BrokerCardProps {
  broker: Broker
}

export function BrokerCard({ broker }: BrokerCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Use asset loader for broker logo with fallbacks
  const logoConfig = generateBrokerLogoFallbacks(broker);
  const { url: logoUrl, loading: logoLoading, error: logoError } = useAssetLoader(logoConfig);
  
  const formatMinDeposit = (amount: number): string => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  }

  const formatLeverage = (leverage: number): string => {
    return `1:${leverage}`;
  }

  const formatSpread = (spread: number): string => {
    return `${spread} pips`;
  }

  const getRegulatorDisplayName = (regulator: RegulatorType): string => {
    const regulatorNames: Record<RegulatorType, string> = {
      fca: 'FCA',
      cysec: 'CySEC',
      asic: 'ASIC',
      finma: 'FINMA',
      bafin: 'BaFin',
      fsa: 'FSA',
      cftc: 'CFTC',
      nfa: 'NFA',
      sec: 'SEC',
      finra: 'FINRA',
      mifid: 'MiFID',
      esma: 'ESMA'
    };
    return regulatorNames[regulator] || regulator.toUpperCase();
  }

  return (
    <div className="professional-card p-8 interactive-professional">
      {/* Header with Logo and Name */}
      <div className="flex items-center mb-6">
        <div className="relative w-20 h-20 mr-4">
          {logoLoading ? (
            <div className="w-20 h-20 rounded-lg bg-white/10 animate-pulse flex items-center justify-center">
              <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : logoError || !logoUrl ? (
            <div className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-light-grey" />
            </div>
          ) : (
            <img 
              src={logoUrl} 
              alt={`${broker.name} logo`}
              className="w-20 h-20 rounded-lg object-contain bg-white/10 p-2"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-pure-white mb-2">
            {broker.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span className="text-pure-white font-medium">{broker.rating}</span>
              <span className="text-light-grey text-sm ml-1">
                ({broker.reviewCount} reviews)
              </span>
            </div>
            {broker.trustScore && (
              <div className="flex items-center">
                <span className="text-xs text-light-grey mr-1">Trust:</span>
                <span className={`text-xs font-medium ${
                  broker.trustScore >= 8 ? 'text-green-400' :
                  broker.trustScore >= 6 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {broker.trustScore}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-sm text-light-grey mb-1">Spreads From</div>
          <div className="text-pure-white font-semibold text-lg">
            {formatSpread(broker.spreadsFrom)}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-sm text-light-grey mb-1">Min. Deposit</div>
          <div className="text-pure-white font-semibold text-lg">
            {formatMinDeposit(broker.minDeposit)}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5">
          <div className="text-sm text-light-grey mb-1">Max Leverage</div>
          <div className="text-pure-white font-semibold text-lg">
            {formatLeverage(broker.maxLeverage)}
          </div>
        </div>
      </div>

      {/* Regulation Badges */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-light-grey">Regulation</span>
            {broker.isRegulated && (
              <span className="text-xs text-green-400 font-medium">✓ Regulated</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {broker.regulation && broker.regulation.length > 0 ? (
              broker.regulation.map((reg, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className={`text-xs ${
                    reg.status === 'active' 
                      ? 'text-green-400 border-green-400/30 bg-green-400/10' 
                      : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10'
                  }`}
                  title={`License: ${reg.licenseNumber} | Status: ${reg.status} | ${reg.jurisdiction}`}
                >
                  {getRegulatorDisplayName(reg.authority as RegulatorType)}
                </Badge>
              ))
            ) : (
              broker.regulators.map((regulator) => (
                <Badge 
                  key={regulator} 
                  variant="outline" 
                  className="text-light-grey border-medium-grey text-xs"
                >
                  {getRegulatorDisplayName(regulator as RegulatorType)}
                </Badge>
              ))
            )}
          </div>
        </div>

      {/* Action Button */}
      <Button 
        asChild
        className="btn-professional-primary w-full mt-2 py-3 text-base font-semibold"
      >
        <Link to={`/brokers/${broker.id}`}>
          View Profile
        </Link>
      </Button>
    </div>
  )
}