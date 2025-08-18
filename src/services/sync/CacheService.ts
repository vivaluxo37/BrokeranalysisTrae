/**
 * Cache Service
 * Handles caching operations for better performance
 */

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number;
  persistent?: boolean;
}

export interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl?: number;
}

export class CacheService {
  private memoryCache = new Map<string, CacheItem<any>>();
  private maxSize: number;

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 1000;
  }

  set<T>(key: string, data: T, ttl?: number): void {
    // Clean up expired items if cache is getting full
    if (this.memoryCache.size >= this.maxSize) {
      this.cleanup();
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.memoryCache.set(key, item);

    // Also store in localStorage if persistent
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to persist cache item:', error);
    }
  }

  get<T>(key: string): T | null {
    const item = this.memoryCache.get(key);
    
    if (!item) {
      // Try to load from localStorage
      try {
        const stored = localStorage.getItem(`cache_${key}`);
        if (stored) {
          const parsedItem = JSON.parse(stored) as CacheItem<T>;
          if (!this.isExpired(parsedItem)) {
            this.memoryCache.set(key, parsedItem);
            return parsedItem.data;
          } else {
            localStorage.removeItem(`cache_${key}`);
          }
        }
      } catch (error) {
        console.warn('Failed to load cache item from localStorage:', error);
      }
      return null;
    }

    if (this.isExpired(item)) {
      this.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.memoryCache.get(key);
    if (!item) return false;
    
    if (this.isExpired(item)) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.memoryCache.delete(key);
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (error) {
      console.warn('Failed to remove cache item from localStorage:', error);
    }
    return deleted;
  }

  clear(): void {
    this.memoryCache.clear();
    
    // Clear localStorage cache items
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear localStorage cache:', error);
    }
  }

  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, item] of this.memoryCache.entries()) {
      if (this.isExpired(item)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.delete(key));
  }

  size(): number {
    return this.memoryCache.size;
  }

  private isExpired(item: CacheItem<any>): boolean {
    if (!item.ttl) return false;
    return Date.now() - item.timestamp > item.ttl;
  }

  // Utility method for caching async operations
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await factory();
    this.set(key, data, ttl);
    return data;
  }
}

export const cacheService = new CacheService();
