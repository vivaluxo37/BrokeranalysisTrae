import { ChevronRight, Star, TrendingUp, Shield, Award, ExternalLink, Bookmark, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useQuestionnaire } from '@/contexts/QuestionnaireContext'
import type { BrokerRecommendation } from '@/types/wizard'
import type { Broker } from '@/types/brokerTypes'

export interface BrokerResultsPanelProps {
  className?: string
  onSaveResults?: (results: any[]) => Promise<void>
}

export function BrokerResultsPanel({ className = '', onSaveResults }: BrokerResultsPanelProps) {
  const { state, saveResults } = useQuestionnaire()
  const brokers = state.filteredBrokers.slice(0, 10) // Top 10 brokers
  const totalBrokers = state.filteredBrokers.length
  
  const handleSaveResults = async () => {
    try {
      if (onSaveResults) {
        // Call the prop function if available
        await onSaveResults(brokers)
      } else if (saveResults) {
        // Fallback to context function
        saveResults()
      } else {
        console.error('No save handler available')
      }
    } catch (error) {
      console.error('Error saving results:', error)
    }
  }
  
  const handleCompare = () => {
    // Navigate to comparison page with selected brokers
    console.log('Compare brokers:', brokers.slice(0, 3))
  }
  
  const handleBrokerClick = (brokerId: string) => {
    // Navigate to broker detail page
    console.log('Navigate to broker:', brokerId)
  }

  return (
    <div className={`w-full lg:w-96 bg-white border-l border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-professional-black">
            {state.isCompleted ? 'FINAL RESULTS' : 'LIVE RESULTS'}
          </h3>
          {state.isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveResults}
              className="text-xs"
            >
              <Bookmark size={12} className="mr-1" />
              Save
            </Button>
          )}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-sm text-medium-grey">
            {totalBrokers} brokers found
          </p>
          <Badge variant="secondary" className="bg-accent-blue/10 text-accent-blue">
            <TrendingUp size={12} className="mr-1" />
            Top {Math.min(10, totalBrokers)}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {brokers.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp size={32} className="mx-auto text-medium-grey mb-2" />
            <p className="text-sm text-medium-grey">Complete the questionnaire to see broker recommendations</p>
          </div>
        ) : (
          brokers.map((broker, index) => {
            const rank = index + 1
            const matchScore = Math.round(85 + Math.random() * 15) // Mock match score
            
            return (
              <Card 
                key={broker.id} 
                className="border border-gray-200 hover:border-accent-blue/50 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => handleBrokerClick(broker.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={rank <= 3 ? "default" : "secondary"} 
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          rank === 1 ? 'bg-yellow-500 text-white' :
                          rank === 2 ? 'bg-gray-400 text-white' :
                          rank === 3 ? 'bg-amber-600 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {rank}
                      </Badge>
                      
                      <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        {broker.logo ? (
                          <img
                            src={broker.logo}
                            alt={`${broker.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-accent-blue text-white text-xs font-bold flex items-center justify-center">
                            {broker.name.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-professional-black truncate group-hover:text-accent-blue transition-colors">
                          {broker.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star size={12} className="text-yellow-500 fill-current" />
                            <span className="text-xs text-medium-grey ml-1">
                              {broker.rating || '4.5'}
                            </span>
                          </div>
                          {broker.isRegulated && (
                            <Shield size={12} className="text-green-600" />
                          )}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          {matchScore}% match
                        </Badge>
                        <ChevronRight size={14} className="text-gray-400 group-hover:text-accent-blue transition-colors mt-1" />
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-medium-grey">Match Score</span>
                        <span className="text-professional-black font-medium">{matchScore}%</span>
                      </div>
                      <Progress value={matchScore} className="h-1.5" />
                    </div>
                    
                    {/* Quick Info */}
                    <div className="flex items-center justify-between text-xs text-medium-grey">
                      <div className="flex items-center space-x-3">
                        <span>Min: ${broker.minDeposit || '100'}</span>
                        <span className="flex items-center">
                          <Users size={10} className="mr-1" />
                          {broker.userCount || '10k+'}
                        </span>
                      </div>
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>


    </div>
  )
}
