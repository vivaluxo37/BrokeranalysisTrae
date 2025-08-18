#!/usr/bin/env node
/**
 * BrokerChooser.com Web Crawler
 * Main driver script that orchestrates the crawling process
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import path from 'path';
import WebUnlocker from './unlocker.js';
import SitemapCollector from './sitemap.js';
import BrokerReviewParser from './parse.js';
import DatabaseService from './db.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class BrokerChooserCrawler {
  constructor(options = {}) {
    this.options = {
      concurrency: parseInt(process.env.CRAWLER_CONCURRENCY) || options.concurrency || 6,
      timeout: parseInt(process.env.CRAWLER_TIMEOUT) || options.timeout || 60000,
      retries: parseInt(process.env.CRAWLER_RETRIES) || options.retries || 3,
      delay: parseInt(process.env.CRAWLER_DELAY) || options.delay || 1000,
      force: options.force || false,
      skipIfExists: options.skipIfExists !== false,
      maxUrls: options.maxUrls || null,
      debug: options.debug || process.env.CRAWLER_DEBUG === 'true',
      resumable: options.resumable !== false && process.env.CRAWLER_RESUMABLE !== 'false',
      ...options
    };
    
    // Initialize services
    this.unlocker = new WebUnlocker({
      apiKey: process.env.BRIGHTDATA_API_KEY,
      zone: process.env.BRIGHTDATA_ZONE,
      timeout: this.options.timeout,
      retries: this.options.retries,
      debug: this.options.debug
    });
    
    this.sitemapCollector = new SitemapCollector({
      timeout: this.options.timeout,
      retries: this.options.retries,
      debug: this.options.debug
    });
    
    this.parser = new BrokerReviewParser({
      debug: this.options.debug
    });
    
    this.db = new DatabaseService({
      debug: this.options.debug
    });
    
    // Crawling state
    this.stats = {
      startTime: null,
      endTime: null,
      totalUrls: 0,
      crawledUrls: 0,
      successfulCrawls: 0,
      failedCrawls: 0,
      skippedCrawls: 0,
      reviewPages: 0,
      errors: []
    };
    
    this.isRunning = false;
    this.shouldStop = false;
  }

  /**
   * Log with timestamp
   */
  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      info: '📝',
      success: '✅',
      warning: '⚠️',
      error: '❌',
      debug: '🔍'
    }[level] || '📝';
    
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  /**
   * Handle graceful shutdown
   */
  setupGracefulShutdown() {
    const shutdown = (signal) => {
      this.log(`Received ${signal}, shutting down gracefully...`, 'warning');
      this.shouldStop = true;
      
      if (!this.isRunning) {
        process.exit(0);
      }
    };
    
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }

  /**
   * Collect URLs from sitemap
   */
  async collectUrls() {
    this.log('🗺️ Collecting URLs from sitemap...');
    
    try {
      const result = await this.sitemapCollector.collectAllUrls();
      const urlObjects = result.urls || [];
      
      if (urlObjects.length === 0) {
        throw new Error('No URLs found in sitemap');
      }
      
      // Extract URL strings from URL objects
      const urls = urlObjects.map(urlObj => typeof urlObj === 'string' ? urlObj : urlObj.url);
      
      this.log(`📊 Found ${urls.length} URLs in sitemap`, 'success');
      
      // Apply URL limit if specified
      if (this.options.maxUrls && urls.length > this.options.maxUrls) {
        this.log(`🔢 Limiting to ${this.options.maxUrls} URLs`, 'warning');
        return urls.slice(0, this.options.maxUrls);
      }
      
      return urls;
      
    } catch (error) {
      this.log(`Failed to collect URLs: ${error.message}`, 'error');
      throw error;
    }
  }

  /**
   * Filter URLs for resumable crawling
   */
  async filterUrlsForResume(urls) {
    if (!this.options.resumable || this.options.force) {
      return urls;
    }
    
    this.log('🔄 Checking for existing pages to enable resume...');
    
    const filteredUrls = [];
    const batchSize = 100;
    
    for (let i = 0; i < urls.length; i += batchSize) {
      if (this.shouldStop) break;
      
      const batch = urls.slice(i, i + batchSize);
      const checkPromises = batch.map(async (url) => {
        const existing = await this.db.getPageByUrl(url);
        return { url, exists: existing.exists };
      });
      
      const results = await Promise.allSettled(checkPromises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { url, exists } = result.value;
          if (!exists) {
            filteredUrls.push(url);
          }
        } else {
          // If check fails, include URL to be safe
          filteredUrls.push(batch[results.indexOf(result)]);
        }
      });
      
      if (this.options.debug && i % (batchSize * 10) === 0) {
        this.log(`🔍 Checked ${Math.min(i + batchSize, urls.length)}/${urls.length} URLs for resume`);
      }
    }
    
    const skipped = urls.length - filteredUrls.length;
    if (skipped > 0) {
      this.log(`⏭️ Skipping ${skipped} already crawled URLs`, 'success');
    }
    
    return filteredUrls;
  }

  /**
   * Crawl a single URL
   */
  async crawlUrl(url) {
    try {
      // Fetch page content
      const fetchResult = await this.unlocker.fetch(url);
      
      if (!fetchResult.success) {
        throw new Error(fetchResult.error || 'Failed to fetch URL');
      }
      
      // Parse page content
      const pageData = this.parser.parsePage(fetchResult.content, url);

      // Add fetch metadata
      pageData.status = fetchResult.status;
      pageData.fetchedAt = new Date().toISOString();
      pageData.html = fetchResult.content;
      pageData.fetchMethod = fetchResult.method || 'web_unlocker';
      
      // Store in database
      const dbResult = await this.db.upsertPage(pageData, {
        force: this.options.force,
        skipIfExists: this.options.skipIfExists
      });
      
      if (!dbResult.success) {
        throw new Error(dbResult.error || 'Failed to store in database');
      }
      
      // Update stats
      this.stats.crawledUrls++;
      
      if (dbResult.skipped) {
        this.stats.skippedCrawls++;
      } else {
        this.stats.successfulCrawls++;
      }
      
      if (pageData.pageType === 'broker_review') {
        this.stats.reviewPages++;
      }
      
      const status = dbResult.skipped ? 'SKIPPED' : dbResult.updated ? 'UPDATED' : 'NEW';
      
      if (this.options.debug) {
        this.log(`${status}: ${url} (${pageData.pageType})`);
      }
      
      return {
        success: true,
        url: url,
        status: status,
        pageType: pageData.pageType,
        dbResult: dbResult
      };
      
    } catch (error) {
      this.stats.failedCrawls++;
      this.stats.errors.push({
        url: url,
        error: error.message,
        timestamp: new Date().toISOString()
      });
      
      if (this.options.debug) {
        this.log(`FAILED: ${url} - ${error.message}`, 'error');
      }
      
      return {
        success: false,
        url: url,
        error: error.message
      };
    }
  }

  /**
   * Crawl multiple URLs with concurrency control
   */
  async crawlUrls(urls) {
    this.log(`🚀 Starting crawl of ${urls.length} URLs with concurrency ${this.options.concurrency}`);
    
    const results = [];
    const semaphore = new Array(this.options.concurrency).fill(null);
    let urlIndex = 0;
    
    const crawlNext = async () => {
      while (urlIndex < urls.length && !this.shouldStop) {
        const currentIndex = urlIndex++;
        const url = urls[currentIndex];
        
        const result = await this.crawlUrl(url);
        results.push(result);
        
        // Progress reporting
        if (currentIndex % 10 === 0 || currentIndex === urls.length - 1) {
          const progress = ((currentIndex + 1) / urls.length * 100).toFixed(1);
          this.log(`📊 Progress: ${currentIndex + 1}/${urls.length} (${progress}%) - Success: ${this.stats.successfulCrawls}, Failed: ${this.stats.failedCrawls}, Skipped: ${this.stats.skippedCrawls}`);
        }
        
        // Delay between requests
        if (this.options.delay > 0 && currentIndex < urls.length - 1) {
          await new Promise(resolve => setTimeout(resolve, this.options.delay));
        }
      }
    };
    
    // Start concurrent crawlers
    const crawlerPromises = semaphore.map(() => crawlNext());
    await Promise.all(crawlerPromises);
    
    return results;
  }

  /**
   * Generate crawl report
   */
  generateReport() {
    const duration = this.stats.endTime - this.stats.startTime;
    const durationMinutes = (duration / 1000 / 60).toFixed(2);
    const urlsPerMinute = (this.stats.crawledUrls / (duration / 1000 / 60)).toFixed(2);
    
    const report = {
      summary: {
        totalUrls: this.stats.totalUrls,
        crawledUrls: this.stats.crawledUrls,
        successfulCrawls: this.stats.successfulCrawls,
        failedCrawls: this.stats.failedCrawls,
        skippedCrawls: this.stats.skippedCrawls,
        reviewPages: this.stats.reviewPages,
        duration: `${durationMinutes} minutes`,
        urlsPerMinute: parseFloat(urlsPerMinute),
        successRate: `${((this.stats.successfulCrawls / this.stats.crawledUrls) * 100).toFixed(1)}%`
      },
      errors: this.stats.errors,
      dbStats: this.db.getStats()
    };
    
    return report;
  }

  /**
   * Main crawl method
   */
  async crawl() {
    if (this.isRunning) {
      throw new Error('Crawler is already running');
    }
    
    this.isRunning = true;
    this.stats.startTime = Date.now();
    
    try {
      this.log('🎯 Starting BrokerChooser.com crawl...', 'success');
      this.log(`⚙️ Configuration: concurrency=${this.options.concurrency}, timeout=${this.options.timeout}ms, retries=${this.options.retries}`);
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();
      
      // Check database connection
      this.log('🔌 Checking database connection...');
      const tableExists = await this.db.checkTableExists();
      if (!tableExists) {
        throw new Error('Database table does not exist. Please run the SQL migration first.');
      }
      this.log('✅ Database connection verified', 'success');
      
      // Collect URLs
      const allUrls = await this.collectUrls();
      this.stats.totalUrls = allUrls.length;
      
      if (this.shouldStop) {
        this.log('🛑 Crawl stopped by user', 'warning');
        return this.generateReport();
      }
      
      // Filter URLs for resume
      const urlsToCrawl = await this.filterUrlsForResume(allUrls);
      
      if (urlsToCrawl.length === 0) {
        this.log('✅ All URLs already crawled', 'success');
        this.stats.endTime = Date.now();
        return this.generateReport();
      }
      
      if (this.shouldStop) {
        this.log('🛑 Crawl stopped by user', 'warning');
        return this.generateReport();
      }
      
      // Start crawling
      this.log(`🕷️ Crawling ${urlsToCrawl.length} URLs...`);
      await this.crawlUrls(urlsToCrawl);
      
      this.stats.endTime = Date.now();
      
      if (this.shouldStop) {
        this.log('🛑 Crawl stopped by user', 'warning');
      } else {
        this.log('🎉 Crawl completed successfully!', 'success');
      }
      
      return this.generateReport();
      
    } catch (error) {
      this.stats.endTime = Date.now();
      this.log(`💥 Crawl failed: ${error.message}`, 'error');
      throw error;
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Stop the crawler
   */
  stop() {
    this.log('🛑 Stopping crawler...', 'warning');
    this.shouldStop = true;
  }
}

// CLI interface
if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--force':
        options.force = true;
        break;
      case '--no-resume':
        options.resumable = false;
        break;
      case '--debug':
        options.debug = true;
        break;
      case '--concurrency':
        options.concurrency = parseInt(args[++i]);
        break;
      case '--max-urls':
        options.maxUrls = parseInt(args[++i]);
        break;
      case '--timeout':
        options.timeout = parseInt(args[++i]);
        break;
      case '--delay':
        options.delay = parseInt(args[++i]);
        break;
      case '--help':
        console.log(`
BrokerChooser.com Web Crawler

Usage: node crawl.js [options]

Options:
  --force           Force re-crawl all URLs (ignore existing)
  --no-resume       Disable resume functionality
  --debug           Enable debug logging
  --concurrency N   Set concurrency level (default: 6)
  --max-urls N      Limit number of URLs to crawl
  --timeout N       Request timeout in milliseconds
  --delay N         Delay between requests in milliseconds
  --help            Show this help message

Environment Variables:
  BRIGHTDATA_API_KEY        Bright Data API key (required)
  BRIGHTDATA_ZONE          Bright Data zone (required)
  SUPABASE_URL             Supabase URL (required)
  SUPABASE_SERVICE_ROLE_KEY Supabase service role key (required)
  CRAWLER_CONCURRENCY      Default concurrency (default: 6)
  CRAWLER_TIMEOUT          Default timeout (default: 60000)
  CRAWLER_RETRIES          Default retries (default: 3)
  CRAWLER_DELAY            Default delay (default: 1000)
  CRAWLER_DEBUG            Enable debug mode (default: false)
  CRAWLER_RESUMABLE        Enable resume mode (default: true)

Examples:
  node crawl.js                    # Normal crawl with resume
  node crawl.js --force            # Force re-crawl all URLs
  node crawl.js --debug            # Enable debug logging
  node crawl.js --max-urls 100     # Crawl only first 100 URLs
  node crawl.js --concurrency 10   # Use 10 concurrent workers
`);
        process.exit(0);
        break;
    }
  }
  
  // Validate required environment variables
  const requiredEnvVars = [
    'BRIGHTDATA_API_KEY',
    'BRIGHTDATA_ZONE',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingEnvVars.forEach(varName => {
      console.error(`   ${varName}`);
    });
    console.error('\nPlease check your .env file or set these variables.');
    process.exit(1);
  }
  
  // Start crawler
  const crawler = new BrokerChooserCrawler(options);
  
  crawler.crawl()
    .then(report => {
      console.log('\n📊 CRAWL REPORT');
      console.log('================');
      console.log(JSON.stringify(report.summary, null, 2));
      
      if (report.errors.length > 0) {
        console.log('\n❌ ERRORS:');
        report.errors.slice(0, 10).forEach(error => {
          console.log(`   ${error.url}: ${error.error}`);
        });
        
        if (report.errors.length > 10) {
          console.log(`   ... and ${report.errors.length - 10} more errors`);
        }
      }
      
      console.log('\n✅ Crawl completed!');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Crawl failed:', error.message);
      process.exit(1);
    });
}

export default BrokerChooserCrawler;