import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ToolUsage {
  toolId: string
  toolName: string
  lastUsed: string
  usageCount: number
}

interface ToolComparison {
  id: string
  name: string
  category: string
  results: any
  timestamp: string
}

interface ToolsContextType {
  favorites: string[]
  recentlyUsed: ToolUsage[]
  comparisons: ToolComparison[]
  addToFavorites: (toolId: string) => void
  removeFromFavorites: (toolId: string) => void
  isFavorite: (toolId: string) => boolean
  addToRecentlyUsed: (toolId: string, toolName: string) => void
  addToComparison: (comparison: ToolComparison) => void
  removeFromComparison: (comparisonId: string) => void
  clearComparisons: () => void
  getToolUsageStats: (toolId: string) => ToolUsage | undefined
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined)

interface ToolsProviderProps {
  children: ReactNode
}

export function ToolsProvider({ children }: ToolsProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentlyUsed, setRecentlyUsed] = useState<ToolUsage[]>([])
  const [comparisons, setComparisons] = useState<ToolComparison[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('tool-favorites')
    const savedRecentlyUsed = localStorage.getItem('tool-recently-used')
    const savedComparisons = localStorage.getItem('tool-comparisons')

    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }

    if (savedRecentlyUsed) {
      try {
        setRecentlyUsed(JSON.parse(savedRecentlyUsed))
      } catch (error) {
        console.error('Error loading recently used:', error)
      }
    }

    if (savedComparisons) {
      try {
        setComparisons(JSON.parse(savedComparisons))
      } catch (error) {
        console.error('Error loading comparisons:', error)
      }
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('tool-favorites', JSON.stringify(favorites))
  }, [favorites])

  // Save recently used to localStorage
  useEffect(() => {
    localStorage.setItem('tool-recently-used', JSON.stringify(recentlyUsed))
  }, [recentlyUsed])

  // Save comparisons to localStorage
  useEffect(() => {
    localStorage.setItem('tool-comparisons', JSON.stringify(comparisons))
  }, [comparisons])

  const addToFavorites = (toolId: string) => {
    setFavorites(prev => {
      if (!prev.includes(toolId)) {
        return [...prev, toolId]
      }
      return prev
    })
  }

  const removeFromFavorites = (toolId: string) => {
    setFavorites(prev => prev.filter(id => id !== toolId))
  }

  const isFavorite = (toolId: string) => {
    return favorites.includes(toolId)
  }

  const addToRecentlyUsed = (toolId: string, toolName: string) => {
    setRecentlyUsed(prev => {
      const existingIndex = prev.findIndex(item => item.toolId === toolId)
      const now = new Date().toISOString()

      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          lastUsed: now,
          usageCount: updated[existingIndex].usageCount + 1
        }
        // Move to front
        const item = updated.splice(existingIndex, 1)[0]
        return [item, ...updated]
      } else {
        // Add new entry
        const newItem: ToolUsage = {
          toolId,
          toolName,
          lastUsed: now,
          usageCount: 1
        }
        // Keep only last 10 items
        return [newItem, ...prev.slice(0, 9)]
      }
    })
  }

  const addToComparison = (comparison: ToolComparison) => {
    setComparisons(prev => {
      // Remove existing comparison with same id if exists
      const filtered = prev.filter(c => c.id !== comparison.id)
      // Keep only last 5 comparisons
      return [comparison, ...filtered.slice(0, 4)]
    })
  }

  const removeFromComparison = (comparisonId: string) => {
    setComparisons(prev => prev.filter(c => c.id !== comparisonId))
  }

  const clearComparisons = () => {
    setComparisons([])
  }

  const getToolUsageStats = (toolId: string) => {
    return recentlyUsed.find(item => item.toolId === toolId)
  }

  const value: ToolsContextType = {
    favorites,
    recentlyUsed,
    comparisons,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToRecentlyUsed,
    addToComparison,
    removeFromComparison,
    clearComparisons,
    getToolUsageStats
  }

  return (
    <ToolsContext.Provider value={value}>
      {children}
    </ToolsContext.Provider>
  )
}

export function useTools() {
  const context = useContext(ToolsContext)
  if (context === undefined) {
    throw new Error('useTools must be used within a ToolsProvider')
  }
  return context
}