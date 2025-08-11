import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import type { BreadcrumbItem } from '@/components/layout/Breadcrumb'

/**
 * Route Configuration for Breadcrumbs
 */
interface RouteConfig {
  path: string
  label: string
  parent?: string
  dynamic?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

/**
 * Static route configurations for breadcrumb generation
 */
const routeConfigs: RouteConfig[] = [
  // Main sections
  { path: '/', label: 'Home' },
  { path: '/brokers', label: 'Brokers' },
  { path: '/compare', label: 'Compare' },
  { path: '/tools', label: 'Tools' },
  { path: '/education', label: 'Education' },
  { path: '/news', label: 'News & Insights' },
  { path: '/community', label: 'Community' },
  { path: '/about', label: 'About' },
  
  // Broker categories
  { path: '/brokers/forex', label: 'Forex Brokers', parent: '/brokers' },
  { path: '/brokers/stocks', label: 'Stock Brokers', parent: '/brokers' },
  { path: '/brokers/crypto', label: 'Crypto Brokers', parent: '/brokers' },
  { path: '/brokers/cfds', label: 'CFD Brokers', parent: '/brokers' },
  { path: '/brokers/commodities', label: 'Commodity Brokers', parent: '/brokers' },
  
  // Broker regions
  { path: '/brokers/global', label: 'Global Brokers', parent: '/brokers' },
  { path: '/brokers/us', label: 'US Brokers', parent: '/brokers' },
  { path: '/brokers/eu', label: 'EU Brokers', parent: '/brokers' },
  { path: '/brokers/asia-pacific', label: 'Asia-Pacific Brokers', parent: '/brokers' },
  { path: '/brokers/mena', label: 'MENA Brokers', parent: '/brokers' },
  
  // Comparison pages
  { path: '/comparison/best-online-brokers', label: 'Best Online Brokers', parent: '/compare' },
  { path: '/comparison/best-forex-brokers', label: 'Best Forex Brokers', parent: '/compare' },
  { path: '/comparison/best-stock-brokers', label: 'Best Stock Brokers', parent: '/compare' },
  { path: '/comparison/best-cfd-brokers', label: 'Best CFD Brokers', parent: '/compare' },
  { path: '/comparison/best-crypto-brokers', label: 'Best Crypto Brokers', parent: '/compare' },
  { path: '/comparison/best-beginner-brokers', label: 'Best for Beginners', parent: '/compare' },
  { path: '/comparison/best-day-trading-brokers', label: 'Best for Day Trading', parent: '/compare' },
  { path: '/comparison/best-options-trading-brokers', label: 'Best for Options', parent: '/compare' },
  { path: '/comparison/best-low-cost-brokers', label: 'Best Low Cost', parent: '/compare' },
  { path: '/comparison/best-futures-brokers', label: 'Best Futures Brokers', parent: '/compare' },
  
  // Tool pages
  { path: '/tools/find-my-broker', label: 'Find My Broker', parent: '/tools' },
  { path: '/tools/economic-calendar', label: 'Economic Calendar', parent: '/tools' },
  { path: '/tools/position-calculator', label: 'Position Calculator', parent: '/tools' },
  { path: '/tools/swap-analyzer', label: 'Swap & Spread Analyzer', parent: '/tools' },
  { path: '/tools/correlation-matrix', label: 'Correlation Matrix', parent: '/tools' },
  { path: '/tools/brokerage-fee-calculator', label: 'Brokerage Fee Calculator', parent: '/tools' },
  { path: '/tools/spread-comparison', label: 'Spread Comparison', parent: '/tools' },
  { path: '/tools/leverage-calculator', label: 'Leverage Calculator', parent: '/tools' },
  
  // Education pages
  { path: '/education/beginners', label: "Beginner's Guides", parent: '/education' },
  { path: '/education/technical-analysis', label: 'Technical Analysis 101', parent: '/education' },
  { path: '/education/risk-management', label: 'Risk Management', parent: '/education' },
  { path: '/education/videos', label: 'Video Tutorials', parent: '/education' },
  { path: '/education/trading-glossary', label: 'Trading Glossary', parent: '/education' },
  { path: '/education/how-to-choose-broker-2025', label: 'How to Choose a Broker 2025', parent: '/education' },
  { path: '/education/understanding-forex-spreads', label: 'Understanding Forex Spreads', parent: '/education' },
  { path: '/education/cfd-trading-guide-2025', label: 'CFD Trading Guide 2025', parent: '/education' },
  { path: '/education/risk-management-strategies', label: 'Risk Management Strategies', parent: '/education' },
  
  // News pages
  { path: '/news/market', label: 'Market News', parent: '/news' },
  { path: '/news/broker-updates', label: 'Broker Updates', parent: '/news' },
  { path: '/news/regulatory', label: 'Regulatory Alerts', parent: '/news' },
  { path: '/news/expert-commentary', label: 'Expert Commentary', parent: '/news' },
  
  // Community pages
  { path: '/community/reviews', label: 'User Reviews', parent: '/community' },
  { path: '/community/forum', label: 'Forum & Q&A', parent: '/community' },
  { path: '/community/events', label: 'Webinars & Events', parent: '/community' },
  { path: '/community/glossary', label: 'Glossary', parent: '/community' },
  
  // Country pages
  { path: '/countries/united-states', label: 'United States', parent: '/countries' },
  { path: '/countries/united-kingdom', label: 'United Kingdom', parent: '/countries' },
  { path: '/countries/australia', label: 'Australia', parent: '/countries' },
  { path: '/countries/canada', label: 'Canada', parent: '/countries' },
  { path: '/countries/germany', label: 'Germany', parent: '/countries' },
  { path: '/countries/france', label: 'France', parent: '/countries' },
  { path: '/countries/singapore', label: 'Singapore', parent: '/countries' },
  { path: '/countries/japan', label: 'Japan', parent: '/countries' },
]

/**
 * Broker name mappings for dynamic breadcrumbs
 */
const brokerNameMappings: Record<string, string> = {
  'interactive-brokers': 'Interactive Brokers',
  'etoro': 'eToro',
  'xtb': 'XTB',
  'saxo-bank': 'Saxo Bank',
  'charles-schwab': 'Charles Schwab',
  'trading-212': 'Trading 212',
  'plus500': 'Plus500',
  'avatrade': 'AvaTrade',
  'admirals-admiral-markets': 'Admirals (Admiral Markets)',
  'degiro': 'DEGIRO',
  'ig': 'IG',
  'mexem': 'MEXEM',
  'oanda': 'OANDA',
  'swissquote': 'Swissquote',
  'tastytrade': 'tastytrade',
  'moomoo': 'moomoo',
  'pepperstone': 'Pepperstone',
  'fidelity': 'Fidelity',
  'ninjatrader': 'NinjaTrader',
  'questrade': 'Questrade',
  'jp-morgan-self-directed-investing': 'J.P. Morgan Self-Directed Investing',
  'lightyear': 'Lightyear',
  'merrill-edge': 'Merrill Edge',
  'activtrades': 'ActivTrades',
  'aj-bell-youinvest': 'AJ Bell Youinvest',
  'ally-invest': 'Ally Invest',
  'alpaca-trading': 'Alpaca Trading',
  'amp-futures': 'AMP Futures',
  'axitrader': 'AxiTrader',
  'barclays': 'Barclays',
  'blackbull-markets': 'BlackBull Markets',
  'bnp-paribas': 'BNP Paribas',
  'capitalcom': 'Capital.com',
  'captrader': 'CapTrader',
  'charles-stanley-direct': 'Charles Stanley Direct',
  'choicetrade': 'ChoiceTrade',
  'citic-securities': 'CITIC Securities',
  'city-index': 'City Index',
  'comdirect': 'comdirect',
  'davy-select': 'Davy Select',
  'e-trade': 'E*TRADE',
  'easyequities': 'EasyEquities',
  'eightcap': 'Eightcap',
  'exness': 'Exness',
  'fbs': 'FBS',
  'fidelity-international': 'Fidelity International',
  'firstrade': 'Firstrade',
  'flatex': 'flatex',
  'forex.com': 'Forex.com',
  'fp-markets': 'FP Markets',
  'freetrade': 'Freetrade',
  'fusion-markets': 'Fusion Markets',
  'fxcm': 'FXCM',
  'fxpro': 'FxPro',
  'fxtm': 'FXTM',
  'fxtradingcom': 'FxTrading.com',
  'global-prime': 'Global Prime',
  'go-markets': 'GO Markets',
  'halifax': 'Halifax',
  'hantec-markets': 'Hantec Markets',
  'hargreaves-lansdown': 'Hargreaves Lansdown',
  'hycm': 'HYCM',
  'interactive-investor': 'Interactive Investor',
  'lynx': 'LYNX',
  'marketsx': 'MarketsX',
  'moneta-markets': 'Moneta Markets',
  'multibank': 'MultiBank',
  'optimus-futures': 'Optimus Futures',
  'publiccom': 'Public.com',
  'revolut': 'Revolut',
  'robinhood': 'Robinhood',
  'royal': 'Royal',
  'sharekhan': 'Sharekhan',
  'skilling': 'Skilling',
  'sofi-invest': 'SoFi Invest',
  'sogotrade': 'SogoTrade',
  'spreadex': 'Spreadex',
  'stake': 'Stake',
  'tickmill': 'Tickmill',
  'tmgm': 'TMGM',
  'trade-nation': 'Trade Nation',
  'trade-republic': 'Trade Republic',
  'tradestation': 'TradeStation',
  'tradezero': 'TradeZero',
  'tradier': 'Tradier',
  'vanguard': 'Vanguard',
  'vantage-markets': 'Vantage Markets',
  'vt-markets': 'VT Markets',
  'webull': 'Webull',
  'xm': 'XM',
  'zacks-trade': 'Zacks Trade',
  'zerodha': 'Zerodha',
}

/**
 * Custom hook for generating breadcrumbs based on current route
 */
export function useBreadcrumbs(customBreadcrumbs?: BreadcrumbItem[]): BreadcrumbItem[] {
  const location = useLocation()

  return useMemo(() => {
    // If custom breadcrumbs are provided, use them
    if (customBreadcrumbs && customBreadcrumbs.length > 0) {
      return customBreadcrumbs
    }

    const pathname = location.pathname
    const segments = pathname.split('/').filter(Boolean)
    
    // Handle root path
    if (pathname === '/') {
      return [{ label: 'Home', href: '/', current: true, position: 1 }]
    }

    const breadcrumbs: BreadcrumbItem[] = []
    let currentPath = ''

    // Always start with Home
    breadcrumbs.push({
      label: 'Home',
      href: '/',
      position: 1,
    })

    // Build breadcrumbs for each segment
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === segments.length - 1
      
      // Find exact route configuration
      const routeConfig = routeConfigs.find(config => config.path === currentPath)
      
      if (routeConfig) {
        breadcrumbs.push({
          label: routeConfig.label,
          href: isLast ? undefined : currentPath,
          current: isLast,
          position: breadcrumbs.length + 1,
          icon: routeConfig.icon,
        })
      } else {
        // Handle dynamic routes
        let label = segment

        // Special handling for broker pages
        if (segments[0] === 'brokers' && index === 1) {
          label = brokerNameMappings[segment] || formatSegmentLabel(segment)
          
          // Add Brokers parent if not already present
          if (!breadcrumbs.some(b => b.label === 'Brokers')) {
            breadcrumbs.push({
              label: 'Brokers',
              href: '/brokers',
              position: breadcrumbs.length + 1,
            })
          }
        } else if (segments[0] === 'broker' && index === 1) {
          // Handle /broker/:id routes
          label = brokerNameMappings[segment] || formatSegmentLabel(segment)
          
          // Add Brokers parent
          if (!breadcrumbs.some(b => b.label === 'Brokers')) {
            breadcrumbs.push({
              label: 'Brokers',
              href: '/brokers',
              position: breadcrumbs.length + 1,
            })
          }
        } else {
          label = formatSegmentLabel(segment)
        }

        breadcrumbs.push({
          label,
          href: isLast ? undefined : currentPath,
          current: isLast,
          position: breadcrumbs.length + 1,
        })
      }
    })

    return breadcrumbs
  }, [location.pathname, customBreadcrumbs])
}

/**
 * Format segment label for display
 */
function formatSegmentLabel(segment: string): string {
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Hook for creating broker-specific breadcrumbs
 */
export function useBrokerBreadcrumbs(brokerSlug: string, brokerName?: string): BreadcrumbItem[] {
  return useMemo(() => {
    const displayName = brokerName || brokerNameMappings[brokerSlug] || formatSegmentLabel(brokerSlug)
    
    return [
      { label: 'Home', href: '/', position: 1 },
      { label: 'Brokers', href: '/brokers', position: 2 },
      { label: displayName, current: true, position: 3 },
    ]
  }, [brokerSlug, brokerName])
}

/**
 * Hook for creating comparison page breadcrumbs
 */
export function useComparisonBreadcrumbs(comparisonType: string): BreadcrumbItem[] {
  return useMemo(() => {
    const routeConfig = routeConfigs.find(config => config.path === `/comparison/${comparisonType}`)
    const label = routeConfig?.label || formatSegmentLabel(comparisonType)
    
    return [
      { label: 'Home', href: '/', position: 1 },
      { label: 'Compare', href: '/compare', position: 2 },
      { label, current: true, position: 3 },
    ]
  }, [comparisonType])
}

/**
 * Hook for creating tool page breadcrumbs
 */
export function useToolBreadcrumbs(toolSlug: string, toolName?: string): BreadcrumbItem[] {
  return useMemo(() => {
    const routeConfig = routeConfigs.find(config => config.path === `/tools/${toolSlug}`)
    const label = toolName || routeConfig?.label || formatSegmentLabel(toolSlug)
    
    return [
      { label: 'Home', href: '/', position: 1 },
      { label: 'Tools', href: '/tools', position: 2 },
      { label, current: true, position: 3 },
    ]
  }, [toolSlug, toolName])
}

/**
 * Hook for creating education page breadcrumbs
 */
export function useEducationBreadcrumbs(category?: string, article?: string): BreadcrumbItem[] {
  return useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', position: 1 },
      { label: 'Education', href: '/education', position: 2 },
    ]
    
    if (category) {
      const routeConfig = routeConfigs.find(config => config.path === `/education/${category}`)
      const label = routeConfig?.label || formatSegmentLabel(category)
      
      breadcrumbs.push({
        label,
        href: article ? `/education/${category}` : undefined,
        current: !article,
        position: 3,
      })
    }
    
    if (article) {
      const routeConfig = routeConfigs.find(config => config.path === `/education/${article}`)
      const label = routeConfig?.label || formatSegmentLabel(article)
      
      breadcrumbs.push({
        label,
        current: true,
        position: 4,
      })
    }
    
    return breadcrumbs
  }, [category, article])
}

/**
 * Hook for creating news page breadcrumbs
 */
export function useNewsBreadcrumbs(category?: string, article?: string): BreadcrumbItem[] {
  return useMemo(() => {
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', position: 1 },
      { label: 'News & Insights', href: '/news', position: 2 },
    ]
    
    if (category) {
      const routeConfig = routeConfigs.find(config => config.path === `/news/${category}`)
      const label = routeConfig?.label || formatSegmentLabel(category)
      
      breadcrumbs.push({
        label,
        href: article ? `/news/${category}` : undefined,
        current: !article,
        position: 3,
      })
    }
    
    if (article) {
      const label = formatSegmentLabel(article)
      
      breadcrumbs.push({
        label,
        current: true,
        position: 4,
      })
    }
    
    return breadcrumbs
  }, [category, article])
}