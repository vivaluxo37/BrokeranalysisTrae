/**
 * AI Content Generator Utilities
 * 
 * This file contains utility functions used throughout the AI Content Generator system.
 */

import { ContentType, BrokerData } from '../types';

/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique content ID
 */
export function generateContentId(contentType: ContentType, title: string): string {
  const timestamp = Date.now();
  const slug = generateSlug(title);
  const random = Math.random().toString(36).substr(2, 6);
  return `${contentType}-${slug}-${timestamp}-${random}`;
}

/**
 * Count words in text content
 */
export function countWords(text: string): number {
  return text
    .replace(/[#*`\[\]()]/g, '') // Remove markdown formatting
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
}

/**
 * Calculate estimated reading time
 */
export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Simple keyword extraction - can be enhanced with NLP libraries
  const words = text
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);

  // Count word frequency
  const wordCount: Record<string, number> = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Validate email address
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize HTML content
 */
export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '');
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Capitalize first letter of each word
 */
export function titleCase(text: string): string {
  return text.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Generate random string
 */
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    Object.keys(obj).forEach(key => {
      (cloned as any)[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  
  return obj;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Check if string is JSON
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse JSON safely
 */
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}

/**
 * Get broker rating color
 */
export function getBrokerRatingColor(rating: number): string {
  if (rating >= 4.5) return '#22c55e'; // green
  if (rating >= 4.0) return '#84cc16'; // lime
  if (rating >= 3.5) return '#eab308'; // yellow
  if (rating >= 3.0) return '#f97316'; // orange
  return '#ef4444'; // red
}

/**
 * Format broker regulation list
 */
export function formatRegulationList(regulations: string[]): string {
  if (regulations.length === 0) return 'Unregulated';
  if (regulations.length === 1) return regulations[0];
  if (regulations.length === 2) return regulations.join(' and ');
  
  const last = regulations.pop();
  return regulations.join(', ') + ', and ' + last;
}

/**
 * Get broker risk level based on regulation
 */
export function getBrokerRiskLevel(broker: BrokerData): 'low' | 'medium' | 'high' {
  const tierOneRegulators = ['FCA', 'SEC', 'ASIC', 'CySEC', 'BaFin', 'FINRA'];
  const tierTwoRegulators = ['FSA', 'CFTC', 'NFA', 'IIROC', 'AMF'];
  
  const hasTierOne = broker.regulation.some(reg => tierOneRegulators.includes(reg));
  const hasTierTwo = broker.regulation.some(reg => tierTwoRegulators.includes(reg));
  
  if (hasTierOne) return 'low';
  if (hasTierTwo) return 'medium';
  return 'high';
}

/**
 * Calculate content similarity score
 */
export function calculateContentSimilarity(content1: string, content2: string): number {
  const words1 = new Set(content1.toLowerCase().split(/\s+/));
  const words2 = new Set(content2.toLowerCase().split(/\s+/));
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Generate meta description from content
 */
export function generateMetaDescription(content: string, maxLength: number = 160): string {
  // Remove markdown and HTML
  const cleanContent = content
    .replace(/[#*`\[\]()]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Find first sentence or paragraph
  const sentences = cleanContent.split(/[.!?]+/);
  let description = sentences[0];
  
  // Add more sentences if under length limit
  for (let i = 1; i < sentences.length && description.length < maxLength - 50; i++) {
    const nextSentence = sentences[i].trim();
    if (nextSentence && description.length + nextSentence.length + 2 <= maxLength) {
      description += '. ' + nextSentence;
    } else {
      break;
    }
  }
  
  return truncateText(description, maxLength);
}

/**
 * Validate content schema
 */
export function validateContentSchema(content: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!content.id) errors.push('Content ID is required');
  if (!content.title) errors.push('Title is required');
  if (!content.content) errors.push('Content body is required');
  if (!content.type) errors.push('Content type is required');
  if (!content.slug) errors.push('Slug is required');
  
  // Validate SEO fields
  if (content.seo) {
    if (content.seo.title && content.seo.title.length > 60) {
      errors.push('SEO title should be 60 characters or less');
    }
    if (content.seo.metaDescription && content.seo.metaDescription.length > 160) {
      errors.push('Meta description should be 160 characters or less');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Convert content type to display name
 */
export function getContentTypeDisplayName(contentType: ContentType): string {
  const displayNames: Record<ContentType, string> = {
    'broker-review': 'Broker Review',
    'broker-comparison': 'Broker Comparison',
    'toplist': 'Top List',
    'educational': 'Educational Content',
    'country-page': 'Country Page',
    'faq': 'FAQ'
  };
  
  return displayNames[contentType] || contentType;
}

/**
 * Get content type icon
 */
export function getContentTypeIcon(contentType: ContentType): string {
  const icons: Record<ContentType, string> = {
    'broker-review': '📊',
    'broker-comparison': '⚖️',
    'toplist': '🏆',
    'educational': '📚',
    'country-page': '🌍',
    'faq': '❓'
  };
  
  return icons[contentType] || '📄';
}