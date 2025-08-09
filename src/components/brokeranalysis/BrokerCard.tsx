import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Star } from 'lucide-react'
import BrokerLogo from '@/components/BrokerLogo'
import type { Broker } from '@/types/broker'
import { RegulatorType } from '@/enums'
import { generateBrokerLogoFallbacks, useAssetLoader } from '@/utils/assetLoader'

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
    <article 
      className="professional-card p-8 interactive-professional group hover:shadow-2xl hover:shadow-primary-blue/20 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary-blue focus-within:ring-offset-2 focus-within:ring-offset-professional-black"
      role="article"
      aria-labelledby={`broker-${broker.id}-name`}
      tabIndex={0}
    >
      {/* Header with Logo and Name */}
      <header className="flex items-center mb-6">
        <div className="relative w-20 h-20 mr-4">
          {logoLoading ? (
            <div 
              className="w-20 h-20 rounded-lg bg-white/10 animate-pulse flex items-center justify-center"
              role="status"
              aria-label="Loading broker logo"
            >
              <div className="w-10 h-10 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : logoError || !logoUrl ? (
            <div 
              className="w-20 h-20 rounded-lg bg-white/10 flex items-center justify-center"
              role="img"
              aria-label={`${broker.name} logo unavailable`}
            >
              <AlertCircle className="w-10 h-10 text-light-grey" aria-hidden="true" />
            </div>
          ) : (
            <img 
              src={logoUrl} 
              alt={`${broker.name} official logo`}
              className="w-20 h-20 rounded-lg object-contain bg-white/10 p-2 transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 
            id={`broker-${broker.id}-name`}
            className="text-xl font-semibold text-pure-white mb-2 group-hover:text-primary-blue transition-colors duration-300"
          >
            {broker.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center" role="group" aria-label="Broker rating">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" aria-hidden="true" />
              <span className="text-pure-white font-medium" aria-label={`Rating: ${broker.rating} out of 5 stars`}>
                {broker.rating}
              </span>
              <span className="text-light-grey text-sm ml-1" aria-label={`Based on ${broker.reviewCount} reviews`}>
                ({broker.reviewCount} reviews)
              </span>
            </div>
            {broker.trustScore && (
              <div className="flex items-center" role="group" aria-label="Trust score">
                <span className="text-xs text-light-grey mr-1">Trust:</span>
                <span 
                  className={`text-xs font-medium ${
                    broker.trustScore >= 8 ? 'text-green-400' :
                    broker.trustScore >= 6 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}
                  aria-label={`Trust score: ${broker.trustScore} out of 10`}
                >
                  {broker.trustScore}/10
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Key Stats */}
      <section 
        className="grid grid-cols-3 gap-6 mb-6"
        role="group"
        aria-label="Key trading statistics"
      >
        <div className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
          <div className="text-sm text-light-grey mb-1" id={`spreads-${broker.id}`}>Spreads From</div>
          <div 
            className="text-pure-white font-semibold text-lg"
            aria-labelledby={`spreads-${broker.id}`}
            aria-label={`Spreads starting from ${formatSpread(broker.spreadsFrom)}`}
          >
            {formatSpread(broker.spreadsFrom)}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
          <div className="text-sm text-light-grey mb-1" id={`deposit-${broker.id}`}>Min. Deposit</div>
          <div 
            className="text-pure-white font-semibold text-lg"
            aria-labelledby={`deposit-${broker.id}`}
            aria-label={`Minimum deposit ${formatMinDeposit(broker.minDeposit)}`}
          >
            {formatMinDeposit(broker.minDeposit)}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-300">
          <div className="text-sm text-light-grey mb-1" id={`leverage-${broker.id}`}>Max Leverage</div>
          <div 
            className="text-pure-white font-semibold text-lg"
            aria-labelledby={`leverage-${broker.id}`}
            aria-label={`Maximum leverage ${formatLeverage(broker.maxLeverage)}`}
          >
            {formatLeverage(broker.maxLeverage)}
          </div>
        </div>
      </section>

      {/* Regulation Badges */}
      <section className="mb-6" role="group" aria-labelledby={`regulation-${broker.id}`}>
        <div className="flex items-center justify-between mb-2">
          <span id={`regulation-${broker.id}`} className="text-sm text-light-grey">Regulation</span>
          {broker.isRegulated && (
            <span 
              className="text-xs text-green-400 font-medium"
              role="status"
              aria-label="This broker is regulated"
            >
              ✓ Regulated
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Regulatory authorities">
          {broker.regulation && broker.regulation.length > 0 ? (
            broker.regulation.map((reg, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className={`text-xs hover:scale-105 transition-transform duration-200 ${
                  reg.status === 'active' 
                    ? 'text-green-400 border-green-400/30 bg-green-400/10 hover:bg-green-400/20' 
                    : 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10 hover:bg-yellow-400/20'
                }`}
                title={`License: ${reg.licenseNumber} | Status: ${reg.status} | ${reg.jurisdiction}`}
                role="listitem"
                tabIndex={0}
                aria-label={`Regulated by ${getRegulatorDisplayName(reg.authority)}, license ${reg.licenseNumber}, status ${reg.status}`}
              >
                {getRegulatorDisplayName(reg.authority)}
              </Badge>
            ))
          ) : (
            broker.regulators.map((regulator) => (
              <Badge 
                key={regulator} 
                variant="outline" 
                className="text-light-grey border-medium-grey text-xs hover:scale-105 hover:bg-white/5 transition-all duration-200"
                role="listitem"
                tabIndex={0}
                aria-label={`Regulated by ${getRegulatorDisplayName(regulator)}`}
              >
                {getRegulatorDisplayName(regulator)}
              </Badge>
            ))
          )}
        </div>
      </section>

      {/* Action Button */}
      <footer className="mt-auto">
        <Button 
          asChild
          className="btn-professional-primary w-full mt-2 py-3 text-base font-semibold hover:scale-105 focus:scale-105 transition-all duration-300 focus:ring-2 focus:ring-primary-blue focus:ring-offset-2 focus:ring-offset-professional-black"
        >
          <Link 
            to={`/brokers/${broker.id}`}
            aria-label={`View detailed profile for ${broker.name} broker`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.currentTarget.click();
              }
            }}
          >
            View Profile
          </Link>
        </Button>
      </footer>
    </article>
  )
}