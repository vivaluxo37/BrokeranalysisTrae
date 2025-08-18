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

export interface SavedSearch {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  search_criteria: SearchFilters;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  tags?: string[];
}
