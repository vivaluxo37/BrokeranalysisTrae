import { useState, useCallback } from 'react';

export interface SearchFilters {
  tradingType?: string;
  experienceLevel?: string;
  accountSize?: string;
  region?: string;
  regulation?: string;
  platforms?: string[];
  minRating?: number;
  maxSpread?: number;
  features?: string[];
}

export interface SearchResult {
  id: string;
  brokers: any[];
  total_count: number;
  search_criteria: SearchFilters;
  generated_at: string;
}

export function useSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const performSearch = useCallback(async (filters: SearchFilters) => {
    setIsSearching(true);
    setSearchError(null);
    
    try {
      // Placeholder for actual search implementation
      console.log('Performing search with filters:', filters);
      
      const mockResult: SearchResult = {
        id: `search_${Date.now()}`,
        brokers: [],
        total_count: 0,
        search_criteria: filters,
        generated_at: new Date().toISOString()
      };
      
      setSearchResults(mockResult);
      return mockResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      setSearchError(errorMessage);
      throw error;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchError(null);
  }, []);

  return {
    isSearching,
    searchResults,
    searchError,
    performSearch,
    clearSearch
  };
}
