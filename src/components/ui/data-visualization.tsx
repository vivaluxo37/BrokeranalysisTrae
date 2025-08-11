import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Badge } from './badge'

// Types for data visualization
export interface MetricCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: 'increase' | 'decrease' | 'neutral'
    period?: string
  }
  icon?: React.ReactNode
  className?: string
}

export interface ComparisonBarProps {
  label: string
  value: number
  maxValue: number
  color?: 'primary' | 'success' | 'warning' | 'error'
  showValue?: boolean
  className?: string
}

export interface RatingDisplayProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  showValue?: boolean
  className?: string
}

export interface ProgressRingProps {
  value: number
  maxValue?: number
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
}

// Metric Card Component
const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, change, icon, className }, ref) => (
    <Card ref={ref} className={cn('', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">
          {title}
        </CardTitle>
        {icon && <div className="text-gray-400">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-white">{value}</div>
        {change && (
          <div className="flex items-center text-xs mt-1">
            <span
              className={cn(
                'font-medium',
                change.type === 'increase' && 'text-green-400',
                change.type === 'decrease' && 'text-red-400',
                change.type === 'neutral' && 'text-gray-400'
              )}
            >
              {change.type === 'increase' && '+'}
              {change.value}%
            </span>
            {change.period && (
              <span className="text-gray-400 ml-1">from {change.period}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
)
MetricCard.displayName = 'MetricCard'

// Comparison Bar Component
const ComparisonBar = React.forwardRef<HTMLDivElement, ComparisonBarProps>(
  ({ label, value, maxValue, color = 'primary', showValue = true, className }, ref) => {
    const percentage = Math.min((value / maxValue) * 100, 100)
    
    const colorClasses = {
      primary: 'bg-white',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500',
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">{label}</span>
          {showValue && (
            <span className="text-white font-medium">{value}</span>
          )}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={cn('h-2 rounded-full transition-all duration-300', colorClasses[color])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)
ComparisonBar.displayName = 'ComparisonBar'

// Rating Display Component
const RatingDisplay = React.forwardRef<HTMLDivElement, RatingDisplayProps>(
  ({ rating, maxRating = 5, size = 'md', showValue = true, className }, ref) => {
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    }

    const starSizes = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }

    return (
      <div ref={ref} className={cn('flex items-center space-x-1', className)}>
        <div className="flex items-center">
          {Array.from({ length: maxRating }).map((_, index) => (
            <svg
              key={index}
              className={cn(
                starSizes[size],
                index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        {showValue && (
          <span className={cn('font-medium text-white', sizeClasses[size])}>
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    )
  }
)
RatingDisplay.displayName = 'RatingDisplay'

// Progress Ring Component
const ProgressRing = React.forwardRef<HTMLDivElement, ProgressRingProps>(
  ({ 
    value, 
    maxValue = 100, 
    size = 120, 
    strokeWidth = 8, 
    color = '#ffffff',
    className 
  }, ref) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const percentage = Math.min((value / maxValue) * 100, 100)
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`

    return (
      <div ref={ref} className={cn('relative inline-flex items-center justify-center', className)}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-white">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    )
  }
)
ProgressRing.displayName = 'ProgressRing'

// Broker Comparison Chart Component
export interface BrokerComparisonData {
  name: string
  rating: number
  fees: number
  features: number
  support: number
  color?: string
}

export interface BrokerComparisonChartProps {
  data: BrokerComparisonData[]
  className?: string
}

const BrokerComparisonChart = React.forwardRef<HTMLDivElement, BrokerComparisonChartProps>(
  ({ data, className }, ref) => {
    const maxValues = {
      rating: 5,
      fees: Math.max(...data.map(d => d.fees)),
      features: Math.max(...data.map(d => d.features)),
      support: 5,
    }

    return (
      <Card ref={ref} className={cn('', className)}>
        <CardHeader>
          <CardTitle>Broker Comparison</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {data.map((broker, index) => (
            <div key={broker.name} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">{broker.name}</h4>
                <Badge variant="secondary">
                  {broker.rating.toFixed(1)} ★
                </Badge>
              </div>
              
              <div className="space-y-2">
                <ComparisonBar
                  label="Rating"
                  value={broker.rating}
                  maxValue={maxValues.rating}
                  color="success"
                />
                <ComparisonBar
                  label="Low Fees"
                  value={maxValues.fees - broker.fees + 1}
                  maxValue={maxValues.fees}
                  color="primary"
                />
                <ComparisonBar
                  label="Features"
                  value={broker.features}
                  maxValue={maxValues.features}
                  color="warning"
                />
                <ComparisonBar
                  label="Support"
                  value={broker.support}
                  maxValue={maxValues.support}
                  color="success"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }
)
BrokerComparisonChart.displayName = 'BrokerComparisonChart'

// Feature Comparison Grid
export interface FeatureComparisonProps {
  brokers: string[]
  features: {
    name: string
    values: (boolean | string | number)[]
  }[]
  className?: string
}

const FeatureComparisonGrid = React.forwardRef<HTMLDivElement, FeatureComparisonProps>(
  ({ brokers, features, className }, ref) => (
    <Card ref={ref} className={cn('overflow-hidden', className)}>
      <CardHeader>
        <CardTitle>Feature Comparison</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0f0f0f] border-b border-gray-600">
              <tr>
                <th className="text-left p-4 font-medium text-gray-300">Feature</th>
                {brokers.map((broker) => (
                  <th key={broker} className="text-center p-4 font-medium text-gray-300">
                    {broker}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr key={feature.name} className={cn(
                  'border-b border-gray-700',
                  index % 2 === 0 ? 'bg-[#1a1a1a]' : 'bg-[#1f1f1f]'
                )}>
                  <td className="p-4 font-medium text-white">{feature.name}</td>
                  {feature.values.map((value, valueIndex) => (
                    <td key={valueIndex} className="p-4 text-center">
                      {typeof value === 'boolean' ? (
                        <span className={cn(
                          'inline-flex h-2 w-2 rounded-full',
                          value ? 'bg-green-500' : 'bg-red-500'
                        )} />
                      ) : (
                        <span className="text-white">{value}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
)
FeatureComparisonGrid.displayName = 'FeatureComparisonGrid'

export {
  MetricCard,
  ComparisonBar,
  RatingDisplay,
  ProgressRing,
  BrokerComparisonChart,
  FeatureComparisonGrid,
}
