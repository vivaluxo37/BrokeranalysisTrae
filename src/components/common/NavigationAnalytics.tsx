import React, { useState } from 'react'
import { useNavigationAnalytics } from '@/contexts/NavigationContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Download, Trash2, Eye, EyeOff } from 'lucide-react'

/**
 * Navigation Analytics Component
 * Displays navigation analytics data for debugging and insights
 */
export function NavigationAnalytics() {
  const { getAnalytics, clearAnalytics } = useNavigationAnalytics()
  const [isVisible, setIsVisible] = useState(false)
  const analytics = getAnalytics()

  const handleExportAnalytics = () => {
    const data = JSON.stringify(analytics, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `navigation-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'page_view':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'navigation_click':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'breadcrumb_click':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'search':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'mobile_menu_toggle':
        return 'bg-pink-500/10 text-pink-500 border-pink-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const getEventSummary = () => {
    const summary = analytics.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(summary).map(([type, count]) => ({
      type,
      count,
      color: getEventTypeColor(type)
    }))
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-professional-black/90 border-charcoal-grey text-light-grey hover:text-pure-white hover:bg-charcoal-grey"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics ({analytics.length})
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-96 overflow-hidden">
      <Card className="bg-professional-black/95 border-charcoal-grey backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-pure-white text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Navigation Analytics
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                onClick={handleExportAnalytics}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-light-grey hover:text-pure-white"
                title="Export analytics data"
              >
                <Download className="w-3 h-3" />
              </Button>
              <Button
                onClick={clearAnalytics}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-light-grey hover:text-red-400"
                title="Clear analytics data"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-light-grey hover:text-pure-white"
                title="Hide analytics"
              >
                <EyeOff className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {/* Event Summary */}
          <div className="flex flex-wrap gap-1 mt-2">
            {getEventSummary().map(({ type, count, color }) => (
              <Badge
                key={type}
                variant="outline"
                className={`text-xs ${color}`}
              >
                {type.replace('_', ' ')}: {count}
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {analytics.slice(-10).reverse().map((event, index) => (
              <div
                key={`${event.timestamp}-${index}`}
                className="text-xs p-2 rounded bg-charcoal-grey/50 border border-medium-grey/30"
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getEventTypeColor(event.type)}`}
                  >
                    {event.type.replace('_', ' ')}
                  </Badge>
                  <span className="text-light-grey">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
                
                <div className="text-pure-white font-mono">
                  {event.path}
                </div>
                
                {event.previousPath && (
                  <div className="text-light-grey">
                    from: {event.previousPath}
                  </div>
                )}
                
                {event.metadata && Object.keys(event.metadata).length > 0 && (
                  <div className="text-light-grey mt-1">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <span key={key} className="mr-2">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {analytics.length === 0 && (
              <div className="text-center text-light-grey py-4">
                No navigation events recorded yet
              </div>
            )}
            
            {analytics.length > 10 && (
              <div className="text-center text-light-grey text-xs py-2">
                Showing last 10 of {analytics.length} events
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
