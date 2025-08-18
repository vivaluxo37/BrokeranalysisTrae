/**
 * Broker interface definition
 */
export interface BrokerDefinition {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  trustScore?: number;
  spreadsFrom: number;
  minDeposit: number;
  maxLeverage: number;
  regulation: string[];
  platforms: string[];
  description: string;
  website: string;
  founded: number;
  headquarters: string;
  verified: boolean;
  featured: boolean;
  lastUpdated: string;
}

/**
 * Broker rating interface definition
 */
export interface BrokerRating {
  brokerId: string;
  userId: string;
  rating: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}
