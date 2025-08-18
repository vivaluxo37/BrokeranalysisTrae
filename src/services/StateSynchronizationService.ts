import { useCallback, useEffect, useRef } from 'react'

/**
 * State synchronization actions for cross-component communication
 */
export const STATE_SYNC_ACTIONS = {
  SEARCH_UPDATED: 'search_updated',
  USER_AUTHENTICATED: 'user_authenticated',
  USER_LOGGED_OUT: 'user_logged_out',
  BROKER_COMPARISON_UPDATED: 'broker_comparison_updated',
  AI_CHAT_OPENED: 'ai_chat_opened',
  AI_CHAT_CLOSED: 'ai_chat_closed',
  PREFERENCES_UPDATED: 'preferences_updated',
  NOTIFICATION_ADDED: 'notification_added',
  MODAL_OPENED: 'modal_opened',
  MODAL_CLOSED: 'modal_closed',
} as const

export type StateSyncAction = typeof STATE_SYNC_ACTIONS[keyof typeof STATE_SYNC_ACTIONS]

/**
 * Event data structure for state synchronization
 */
export interface StateSyncEvent {
  action: StateSyncAction
  payload?: any
  timestamp: number
  source?: string
}

/**
 * Global event emitter for state synchronization
 */
class StateSyncEmitter {
  private listeners: Map<StateSyncAction, Set<(event: StateSyncEvent) => void>> = new Map()

  /**
   * Subscribe to a specific action
   */
  on(action: StateSyncAction, callback: (event: StateSyncEvent) => void): () => void {
    if (!this.listeners.has(action)) {
      this.listeners.set(action, new Set())
    }
    
    this.listeners.get(action)!.add(callback)
    
    // Return unsubscribe function
    return () => {
      this.listeners.get(action)?.delete(callback)
    }
  }

  /**
   * Emit an event to all subscribers
   */
  emit(action: StateSyncAction, payload?: any, source?: string): void {
    const event: StateSyncEvent = {
      action,
      payload,
      timestamp: Date.now(),
      source,
    }

    const callbacks = this.listeners.get(action)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event)
        } catch (error) {
          console.error(`Error in state sync callback for action ${action}:`, error)
        }
      })
    }
  }

  /**
   * Remove all listeners for a specific action
   */
  removeAllListeners(action?: StateSyncAction): void {
    if (action) {
      this.listeners.delete(action)
    } else {
      this.listeners.clear()
    }
  }

  /**
   * Get the number of listeners for an action
   */
  listenerCount(action: StateSyncAction): number {
    return this.listeners.get(action)?.size || 0
  }
}

// Global instance
const stateSyncEmitter = new StateSyncEmitter()

/**
 * Hook for emitting state synchronization events
 */
export const useStateSyncEmitter = () => {
  const emit = useCallback((action: StateSyncAction, payload?: any, source?: string) => {
    stateSyncEmitter.emit(action, payload, source)
  }, [])

  return { emit }
}

/**
 * Hook for listening to state synchronization events
 */
export const useStateSync = (
  action: StateSyncAction,
  callback: (event: StateSyncEvent) => void,
  deps: React.DependencyList = []
) => {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  useEffect(() => {
    const unsubscribe = stateSyncEmitter.on(action, (event) => {
      callbackRef.current(event)
    })

    return unsubscribe
  }, [action, ...deps])
}

/**
 * Hook for multiple state sync subscriptions
 */
export const useMultipleStateSync = (
  subscriptions: Array<{
    action: StateSyncAction
    callback: (event: StateSyncEvent) => void
  }>,
  deps: React.DependencyList = []
) => {
  const subscriptionsRef = useRef(subscriptions)
  subscriptionsRef.current = subscriptions

  useEffect(() => {
    const unsubscribeFunctions = subscriptions.map(({ action, callback }) => {
      return stateSyncEmitter.on(action, callback)
    })

    return () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe())
    }
  }, [JSON.stringify(subscriptions.map(s => s.action)), ...deps])
}

/**
 * Service for managing state synchronization
 */
export const stateSynchronizationService = {
  emitter: stateSyncEmitter,
  actions: STATE_SYNC_ACTIONS,
  
  /**
   * Emit a state sync event
   */
  emit: (action: StateSyncAction, payload?: any, source?: string) => {
    stateSyncEmitter.emit(action, payload, source)
  },
  
  /**
   * Subscribe to state sync events
   */
  subscribe: (action: StateSyncAction, callback: (event: StateSyncEvent) => void) => {
    return stateSyncEmitter.on(action, callback)
  },
  
  /**
   * Get listener count for debugging
   */
  getListenerCount: (action: StateSyncAction) => {
    return stateSyncEmitter.listenerCount(action)
  },
  
  /**
   * Clear all listeners (useful for testing)
   */
  clearAllListeners: () => {
    stateSyncEmitter.removeAllListeners()
  },
}

export default stateSynchronizationService