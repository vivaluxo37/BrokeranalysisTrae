/**
 * AI Content Generator System Types
 * 
 * This file contains all TypeScript types and interfaces used throughout
 * the AI Content Generator System.
 */

// Content Types
export type ContentType = 
  | 'broker-review'
  | 'broker-comparison'
  | 'toplist'
  | 'educational'
  | 'country-page'
  | 'faq'
  | 'news-article'
  | 'tool-description';

export type ContentStatus = 
  | 'draft'
  | 'generating'
  | 'qa-pending'
  | 'qa-failed'
  | 'qa-passed'
  | 'published'
  | 'archived';

export type QACheckType = 
  | 'grammar'
  | 'factAccuracy'
  | 'seoOptimization'
  | 'readability'
  | 'plagiarism'
  | 'brandConsistency'
  | 'geoCompliance';

// Content Schema
export interface ContentSchema {
  id: string;
  type: ContentType;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaDescription: string;
  keywords: string[];
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  author: string;
  brokerIds?: string[];
  countryCode?: string;
  language: string;
  wordCount: number;
  readingTime: number;
  seoScore: number;
  qualityScore: number;
  structuredData?: Record<string, any>;
  images?: ContentImage[];
  relatedContent?: string[];
}

export interface ContentImage {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  format: string;
  size: number;
}

// Broker-specific types
export interface BrokerData {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  website: string;
  description: string;
  founded: number;
  headquarters: string;
  regulation: string[];
  minDeposit: number;
  spreads: {
    eurusd: number;
    gbpusd: number;
    usdjpy: number;
  };
  platforms: string[];
  assets: string[];
  features: string[];
  pros: string[];
  cons: string[];
  rating: {
    overall: number;
    trustScore: number;
    costScore: number;
    platformScore: number;
  };
  countries: {
    allowed: string[];
    restricted: string[];
  };
  lastUpdated: Date;
}

// AI Provider types
export interface AIProvider {
  name: string;
  isAvailable: boolean;
  lastError?: string;
  requestCount: number;
  successRate: number;
  averageResponseTime: number;
  costPerToken: number;
}

export interface AIRequest {
  id: string;
  provider: string;
  model: string;
  prompt: string;
  maxTokens: number;
  temperature: number;
  createdAt: Date;
  completedAt?: Date;
  status: 'pending' | 'completed' | 'failed';
  response?: string;
  error?: string;
  tokenUsage?: {
    prompt: number;
    completion: number;
    total: number;
  };
  cost?: number;
}

// Content Generation types
export interface ContentGenerationRequest {
  id: string;
  type: ContentType;
  parameters: ContentGenerationParameters;
  priority: number;
  createdAt: Date;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  result?: ContentSchema;
  error?: string;
}

export interface ContentGenerationParameters {
  brokerIds?: string[];
  countryCode?: string;
  language: string;
  targetKeywords: string[];
  wordCountRange: { min: number; max: number };
  tone: 'professional' | 'casual' | 'educational' | 'promotional';
  includeComparison?: boolean;
  includeRatings?: boolean;
  includeProsAndCons?: boolean;
  customInstructions?: string;
}

// QA Pipeline types
export interface QAResult {
  id: string;
  contentId: string;
  checkType: QACheckType;
  score: number;
  passed: boolean;
  issues: QAIssue[];
  suggestions: string[];
  checkedAt: Date;
  checkedBy: 'ai' | 'human';
}

export interface QAIssue {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  location?: {
    line: number;
    column: number;
    length: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoFixable: boolean;
}

// Publishing types
export interface PublishingJob {
  id: string;
  contentId: string;
  scheduledAt?: Date;
  publishedAt?: Date;
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
  platform: string;
  error?: string;
}

// Analytics types
export interface ContentAnalytics {
  contentId: string;
  views: number;
  uniqueViews: number;
  timeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  seoRanking: Record<string, number>;
  socialShares: number;
  comments: number;
  lastUpdated: Date;
}

// System types
export interface SystemMetrics {
  totalContent: number;
  contentByType: Record<ContentType, number>;
  contentByStatus: Record<ContentStatus, number>;
  aiProviderStats: Record<string, AIProvider>;
  averageGenerationTime: number;
  averageQAScore: number;
  publishingSuccessRate: number;
  costMetrics: {
    totalCost: number;
    costPerContent: number;
    costByProvider: Record<string, number>;
  };
  lastUpdated: Date;
}

export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'critical';
  component: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  resolved: boolean;
}

// Template types
export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentType;
  description: string;
  template: string;
  variables: TemplateVariable[];
  seoTemplate: SEOTemplate;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  description: string;
}

export interface SEOTemplate {
  titleTemplate: string;
  metaDescriptionTemplate: string;
  keywordTemplate: string;
  structuredDataTemplate: Record<string, any>;
}

// API Response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
    totalPages: number;
  };
}