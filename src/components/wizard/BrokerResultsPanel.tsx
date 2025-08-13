import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { BrokerRecommendation } from '@/types/wizard'

interface BrokerResultsPanelProps {
  brokers: BrokerRecommendation[]
  isCompleted: boolean
  onSaveResults: () => void
  onCompare: () => void
}

export function BrokerResultsPanel({ 
  brokers, 
  isCompleted, 
  onSaveResults, 
  onCompare 
}: BrokerResultsPanelProps) {
  return (
    <div className="w-full lg:w-96 bg-white border-l border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-professional-black">
            {isCompleted ? 'FINAL RESULT' : 'YOUR RESULT'}
          </h3>
          {isCompleted && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveResults}
              className="text-xs"
            >
              Save my toplist
            </Button>
          )}
        </div>
        <p className="text-sm text-medium-grey">Top 10 brokers in Philippines</p>
      </div>

      <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
        {brokers.map((broker) => (
          <Card key={broker.id} className="border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Badge variant="secondary" className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium bg-yellow-100 text-yellow-800">
                  {broker.rank}
                </Badge>
                
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                  <img
                    src={broker.logo}
                    alt={`${broker.name} logo - Yumu on Unsplash`}
                    className="w-full h-full object-cover"
                    style={{ width: '32px', height: '32px' }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-professional-black truncate">
                    {broker.name}
                  </p>
                </div>
                
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isCompleted && (
        <div className="p-6 border-t border-gray-200">
          <Button
            onClick={onCompare}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-professional-black font-medium"
          >
            Compare These Brokers
          </Button>
        </div>
      )}
    </div>
  )
}
