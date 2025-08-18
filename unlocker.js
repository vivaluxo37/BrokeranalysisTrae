/**
 * Bright Data Web Unlocker Direct API Wrapper
 * Handles authentication, retries, and error handling for web scraping
 */

import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

class WebUnlocker {
  constructor(options = {}) {
    this.apiKey = options.apiKey || process.env.BRIGHTDATA_API_KEY;
    this.zone = options.zone || process.env.BRIGHTDATA_ZONE;
    this.baseURL = 'https://api.brightdata.com/request';
    this.timeout = options.timeout || parseInt(process.env.CRAWL_TIMEOUT) || 120000;
    this.retries = options.retries || parseInt(process.env.CRAWL_RETRIES) || 3;
    this.delay = options.delay || parseInt(process.env.CRAWL_DELAY) || 1000;
    
    if (!this.apiKey || !this.zone) {
      throw new Error('BRIGHTDATA_API_KEY and BRIGHTDATA_ZONE must be provided');
    }
  }

  /**
   * Generate SHA256 hash for content deduplication
   */
  generateHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Sleep utility for delays
   */
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch a single URL using Bright Data Web Unlocker Direct API
   * @param {string} url - Target URL to fetch
   * @param {Object} options - Additional options
   * @returns {Object} Response object with success, data, and metadata
   */
  async fetch(url, options = {}) {
    const startTime = Date.now();
    let lastError = null;
    
    // Validate URL
    if (!url || typeof url !== 'string') {
      throw new Error('Valid URL is required');
    }

    // Ensure URL is from brokerchooser.com
    if (!url.startsWith('https://brokerchooser.com/')) {
      throw new Error(`URL must be from brokerchooser.com domain: ${url}`);
    }

    console.log(`🔓 Fetching: ${url}`);

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const requestPayload = {
          zone: this.zone,
          url: url,
          format: 'raw',
          ...options.requestOptions
        };

        const response = await axios.post(this.baseURL, requestPayload, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'BrokerChooser-Crawler/1.0'
          },
          timeout: this.timeout,
          validateStatus: (status) => status < 500 // Don't throw on 4xx errors
        });

        // Extract content from response
        const content = typeof response.data === 'string' 
          ? response.data 
          : (response.data?.body || response.data?.content || '');

        if (!content || content.length === 0) {
          throw new Error('Empty response received from Web Unlocker');
        }

        const duration = Date.now() - startTime;
        const contentHash = this.generateHash(content);

        console.log(`✅ Success (attempt ${attempt}): ${url} - ${content.length} chars in ${duration}ms`);

        return {
          success: true,
          url: url,
          status: response.status || 200,
          content: content,
          contentLength: content.length,
          contentHash: contentHash,
          duration: duration,
          attempt: attempt,
          fetchedAt: new Date().toISOString(),
          method: 'web_unlocker_direct'
        };

      } catch (error) {
        lastError = error;
        const duration = Date.now() - startTime;
        
        console.log(`❌ Attempt ${attempt}/${this.retries} failed for ${url}: ${error.message}`);
        
        // Check if we should retry
        const shouldRetry = this.shouldRetry(error, attempt);
        
        if (!shouldRetry || attempt === this.retries) {
          console.log(`💥 All attempts failed for ${url} after ${duration}ms`);
          break;
        }

        // Exponential backoff with jitter
        const backoffDelay = Math.min(
          this.delay * Math.pow(2, attempt - 1) + Math.random() * 1000,
          30000 // Max 30 seconds
        );
        
        console.log(`⏳ Waiting ${Math.round(backoffDelay)}ms before retry...`);
        await this.sleep(backoffDelay);
      }
    }

    // All attempts failed
    const duration = Date.now() - startTime;
    return {
      success: false,
      url: url,
      error: lastError?.message || 'Unknown error',
      errorCode: lastError?.code,
      status: lastError?.response?.status || 0,
      duration: duration,
      attempts: this.retries,
      fetchedAt: new Date().toISOString(),
      method: 'web_unlocker_direct'
    };
  }

  /**
   * Determine if an error should trigger a retry
   */
  shouldRetry(error, attempt) {
    // Don't retry on last attempt
    if (attempt >= this.retries) {
      return false;
    }

    // Retry on network errors
    if (error.code === 'ECONNRESET' || 
        error.code === 'ETIMEDOUT' || 
        error.code === 'ENOTFOUND' ||
        error.code === 'ECONNREFUSED') {
      return true;
    }

    // Retry on 5xx server errors
    if (error.response && error.response.status >= 500) {
      return true;
    }

    // Retry on 429 (rate limit)
    if (error.response && error.response.status === 429) {
      return true;
    }

    // Retry on timeout
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      return true;
    }

    // Don't retry on 4xx client errors (except 429)
    if (error.response && error.response.status >= 400 && error.response.status < 500) {
      return false;
    }

    // Retry on other errors
    return true;
  }

  /**
   * Fetch multiple URLs with concurrency control
   * @param {Array} urls - Array of URLs to fetch
   * @param {Object} options - Options including concurrency limit
   * @returns {Object} Results summary with successful and failed fetches
   */
  async fetchBatch(urls, options = {}) {
    const { concurrency = 6 } = options;
    const pLimit = (await import('p-limit')).default;
    const limit = pLimit(concurrency);
    
    console.log(`🚀 Starting batch fetch of ${urls.length} URLs with concurrency ${concurrency}`);
    const startTime = Date.now();
    
    const results = await Promise.allSettled(
      urls.map(url => limit(() => this.fetch(url, options)))
    );
    
    const successful = [];
    const failed = [];
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          successful.push(result.value);
        } else {
          failed.push({
            url: urls[index],
            error: result.value.error,
            status: result.value.status
          });
        }
      } else {
        failed.push({
          url: urls[index],
          error: result.reason?.message || 'Unknown error',
          status: 0
        });
      }
    });
    
    const duration = Date.now() - startTime;
    const successRate = ((successful.length / urls.length) * 100).toFixed(2);
    
    console.log(`📊 Batch complete: ${successful.length}/${urls.length} successful (${successRate}%) in ${duration}ms`);
    
    return {
      total: urls.length,
      successful: successful,
      failed: failed,
      successCount: successful.length,
      failureCount: failed.length,
      successRate: parseFloat(successRate),
      duration: duration,
      completedAt: new Date().toISOString()
    };
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      zone: this.zone,
      timeout: this.timeout,
      retries: this.retries,
      delay: this.delay,
      baseURL: this.baseURL
    };
  }
}

export default WebUnlocker;

// For testing purposes
if (import.meta.url === `file://${process.argv[1]}`) {
  const unlocker = new WebUnlocker();
  
  // Test with a sample URL
  const testUrl = 'https://brokerchooser.com/';
  
  console.log('🧪 Testing Web Unlocker with:', testUrl);
  console.log('📋 Configuration:', unlocker.getConfig());
  
  try {
    const result = await unlocker.fetch(testUrl);
    console.log('🎯 Test result:', {
      success: result.success,
      status: result.status,
      contentLength: result.contentLength,
      duration: result.duration
    });
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}