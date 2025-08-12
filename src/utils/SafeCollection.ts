import { errorReportingService } from '@/services/ErrorReportingService'

/**
 * Safe collection interface to prevent undefined property access errors
 */
export interface SafeCollection<T> {
  items: T[]
  add(item: T): void
  remove(predicate: (item: T) => boolean): boolean
  find(predicate: (item: T) => boolean): T | undefined
  filter(predicate: (item: T) => boolean): T[]
  isEmpty(): boolean
  size(): number
  clear(): void
  toArray(): T[]
  forEach(callback: (item: T, index: number) => void): void
  map<U>(callback: (item: T, index: number) => U): U[]
  some(predicate: (item: T) => boolean): boolean
  every(predicate: (item: T) => boolean): boolean
}

/**
 * Safe collection implementation with error handling and defensive programming
 */
export class SafeCollectionImpl<T> implements SafeCollection<T> {
  private _items: T[] = []
  private _name: string

  constructor(initialItems: T[] = [], name = 'SafeCollection') {
    this._name = name
    this._items = Array.isArray(initialItems) ? [...initialItems] : []
  }

  get items(): T[] {
    return [...this._items] // Return a copy to prevent external mutation
  }

  add(item: T): void {
    try {
      if (item !== null && item !== undefined) {
        this._items.push(item)
      } else {
        this.reportError('add', 'Attempted to add null or undefined item')
      }
    } catch (error) {
      this.reportError('add', error as Error)
    }
  }

  remove(predicate: (item: T) => boolean): boolean {
    try {
      if (typeof predicate !== 'function') {
        this.reportError('remove', 'Predicate must be a function')
        return false
      }

      const initialLength = this._items.length
      this._items = this._items.filter(item => {
        try {
          return !predicate(item)
        } catch (error) {
          this.reportError('remove', `Predicate function error: ${error}`)
          return true // Keep item if predicate fails
        }
      })

      return this._items.length < initialLength
    } catch (error) {
      this.reportError('remove', error as Error)
      return false
    }
  }

  find(predicate: (item: T) => boolean): T | undefined {
    try {
      if (typeof predicate !== 'function') {
        this.reportError('find', 'Predicate must be a function')
        return undefined
      }

      return this._items.find(item => {
        try {
          return predicate(item)
        } catch (error) {
          this.reportError('find', `Predicate function error: ${error}`)
          return false
        }
      })
    } catch (error) {
      this.reportError('find', error as Error)
      return undefined
    }
  }

  filter(predicate: (item: T) => boolean): T[] {
    try {
      if (typeof predicate !== 'function') {
        this.reportError('filter', 'Predicate must be a function')
        return []
      }

      return this._items.filter(item => {
        try {
          return predicate(item)
        } catch (error) {
          this.reportError('filter', `Predicate function error: ${error}`)
          return false
        }
      })
    } catch (error) {
      this.reportError('filter', error as Error)
      return []
    }
  }

  isEmpty(): boolean {
    try {
      return this._items.length === 0
    } catch (error) {
      this.reportError('isEmpty', error as Error)
      return true
    }
  }

  size(): number {
    try {
      return this._items.length
    } catch (error) {
      this.reportError('size', error as Error)
      return 0
    }
  }

  clear(): void {
    try {
      this._items = []
    } catch (error) {
      this.reportError('clear', error as Error)
    }
  }

  toArray(): T[] {
    try {
      return [...this._items]
    } catch (error) {
      this.reportError('toArray', error as Error)
      return []
    }
  }

  forEach(callback: (item: T, index: number) => void): void {
    try {
      if (typeof callback !== 'function') {
        this.reportError('forEach', 'Callback must be a function')
        return
      }

      this._items.forEach((item, index) => {
        try {
          callback(item, index)
        } catch (error) {
          this.reportError('forEach', `Callback function error at index ${index}: ${error}`)
        }
      })
    } catch (error) {
      this.reportError('forEach', error as Error)
    }
  }

  map<U>(callback: (item: T, index: number) => U): U[] {
    try {
      if (typeof callback !== 'function') {
        this.reportError('map', 'Callback must be a function')
        return []
      }

      return this._items.map((item, index) => {
        try {
          return callback(item, index)
        } catch (error) {
          this.reportError('map', `Callback function error at index ${index}: ${error}`)
          return undefined as unknown as U
        }
      }).filter(item => item !== undefined)
    } catch (error) {
      this.reportError('map', error as Error)
      return []
    }
  }

  some(predicate: (item: T) => boolean): boolean {
    try {
      if (typeof predicate !== 'function') {
        this.reportError('some', 'Predicate must be a function')
        return false
      }

      return this._items.some(item => {
        try {
          return predicate(item)
        } catch (error) {
          this.reportError('some', `Predicate function error: ${error}`)
          return false
        }
      })
    } catch (error) {
      this.reportError('some', error as Error)
      return false
    }
  }

  every(predicate: (item: T) => boolean): boolean {
    try {
      if (typeof predicate !== 'function') {
        this.reportError('every', 'Predicate must be a function')
        return false
      }

      return this._items.every(item => {
        try {
          return predicate(item)
        } catch (error) {
          this.reportError('every', `Predicate function error: ${error}`)
          return false
        }
      })
    } catch (error) {
      this.reportError('every', error as Error)
      return false
    }
  }

  private reportError(method: string, error: Error | string): void {
    const errorMessage = error instanceof Error ? error.message : error
    
    errorReportingService.reportHandledError(
      `SafeCollection error in ${method}: ${errorMessage}`,
      {
        section: 'safe-collection',
        component: 'SafeCollectionImpl',
        feature: method,
        metadata: {
          collectionName: this._name,
          collectionSize: this._items?.length || 0,
          method,
        },
      }
    )
  }
}

/**
 * Collection manager utility for creating and managing safe collections
 */
export class CollectionManager {
  /**
   * Create a new safe collection
   */
  static createSafeCollection<T>(initialItems: T[] = [], name?: string): SafeCollection<T> {
    return new SafeCollectionImpl<T>(initialItems, name)
  }

  /**
   * Validate and convert unknown data to safe collection
   */
  static validateCollection<T>(data: unknown, name?: string): SafeCollection<T> {
    try {
      if (Array.isArray(data)) {
        return new SafeCollectionImpl<T>(data, name)
      }
      
      if (data && typeof data === 'object' && 'items' in data) {
        const {items} = (data as any)
        if (Array.isArray(items)) {
          return new SafeCollectionImpl<T>(items, name)
        }
      }

      // Return empty collection for invalid data
      errorReportingService.reportHandledError(
        `Invalid collection data provided to validateCollection`,
        {
          section: 'collection-manager',
          component: 'validateCollection',
          metadata: {
            collectionName: name,
            dataType: typeof data,
            isArray: Array.isArray(data),
          },
        }
      )

      return new SafeCollectionImpl<T>([], name)
    } catch (error) {
      errorReportingService.reportError(error as Error, {
        section: 'collection-manager',
        component: 'validateCollection',
        metadata: { collectionName: name },
      })

      return new SafeCollectionImpl<T>([], name)
    }
  }

  /**
   * Safely access collection property with fallback
   */
  static safeAccess<T>(
    obj: unknown,
    property: string,
    fallback: SafeCollection<T>
  ): SafeCollection<T> {
    try {
      if (!obj || typeof obj !== 'object') {
        return fallback
      }

      const value = (obj as any)[property]
      
      if (value && typeof value === 'object') {
        // If it's already a SafeCollection, return it
        if ('add' in value && 'remove' in value && 'find' in value) {
          return value as SafeCollection<T>
        }
        
        // If it has items array, create SafeCollection from it
        if ('items' in value && Array.isArray(value.items)) {
          return new SafeCollectionImpl<T>(value.items, `${property}Collection`)
        }
        
        // If it's an array, create SafeCollection from it
        if (Array.isArray(value)) {
          return new SafeCollectionImpl<T>(value, `${property}Collection`)
        }
      }

      return fallback
    } catch (error) {
      errorReportingService.reportHandledError(
        `Error accessing collection property: ${property}`,
        {
          section: 'collection-manager',
          component: 'safeAccess',
          metadata: { property },
        }
      )

      return fallback
    }
  }

  /**
   * Check if an object has a valid collection property
   */
  static hasValidCollection(obj: unknown, property: string): boolean {
    try {
      if (!obj || typeof obj !== 'object') {
        return false
      }

      const value = (obj as any)[property]
      
      return (
        Array.isArray(value) ||
        (value && typeof value === 'object' && 'items' in value && Array.isArray(value.items)) ||
        (value && typeof value === 'object' && 'add' in value && 'remove' in value)
      )
    } catch (error) {
      return false
    }
  }

  /**
   * Create a safe wrapper around existing collection-like objects
   */
  static wrapCollection<T>(obj: unknown, property: string): SafeCollection<T> {
    const emptyCollection = new SafeCollectionImpl<T>([], `${property}Collection`)
    
    if (!obj || typeof obj !== 'object') {
      return emptyCollection
    }

    try {
      const value = (obj as any)[property]
      
      if (Array.isArray(value)) {
        return new SafeCollectionImpl<T>(value, `${property}Collection`)
      }
      
      if (value && typeof value === 'object' && 'items' in value && Array.isArray(value.items)) {
        return new SafeCollectionImpl<T>(value.items, `${property}Collection`)
      }

      return emptyCollection
    } catch (error) {
      errorReportingService.reportHandledError(
        `Error wrapping collection: ${property}`,
        {
          section: 'collection-manager',
          component: 'wrapCollection',
          metadata: { property },
        }
      )

      return emptyCollection
    }
  }
}

/**
 * Utility functions for safe collection operations
 */
export const safeCollectionUtils = {
  /**
   * Safely add item to collection-like object
   */
  safeAdd<T>(obj: unknown, property: string, item: T): boolean {
    try {
      if (!obj || typeof obj !== 'object') {
        return false
      }

      const collection = (obj as any)[property]
      
      if (collection && typeof collection.add === 'function') {
        collection.add(item)
        return true
      }
      
      if (Array.isArray(collection)) {
        collection.push(item)
        return true
      }

      return false
    } catch (error) {
      errorReportingService.reportHandledError(
        `Error in safeAdd for property: ${property}`,
        {
          section: 'safe-collection-utils',
          component: 'safeAdd',
          metadata: { property },
        }
      )
      return false
    }
  },

  /**
   * Safely check if collection exists and has items
   */
  hasItems(obj: unknown, property: string): boolean {
    try {
      if (!obj || typeof obj !== 'object') {
        return false
      }

      const collection = (obj as any)[property]
      
      if (collection && typeof collection.isEmpty === 'function') {
        return !collection.isEmpty()
      }
      
      if (Array.isArray(collection)) {
        return collection.length > 0
      }
      
      if (collection && typeof collection === 'object' && 'items' in collection) {
        return Array.isArray(collection.items) && collection.items.length > 0
      }

      return false
    } catch (error) {
      return false
    }
  },

  /**
   * Get safe collection size
   */
  getSize(obj: unknown, property: string): number {
    try {
      if (!obj || typeof obj !== 'object') {
        return 0
      }

      const collection = (obj as any)[property]
      
      if (collection && typeof collection.size === 'function') {
        return collection.size()
      }
      
      if (Array.isArray(collection)) {
        return collection.length
      }
      
      if (collection && typeof collection === 'object' && 'items' in collection) {
        return Array.isArray(collection.items) ? collection.items.length : 0
      }

      return 0
    } catch (error) {
      return 0
    }
  },
}

// Export default collection manager instance
export const collectionManager = CollectionManager
