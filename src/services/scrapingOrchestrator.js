import WebScrapingService from './webScrapingService.js';
import {
  getAllBrokerUrls,
  getReviewSiteUrls,
  getRegulatoryUrls,
  getNewsUrls,
  getPriorityUrls,
  scrapingConfig
} from '../data/brokerUrls.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class ScrapingOrchestrator {
  constructor() {
    this.scraper = new WebScrapingService();
    this.isRunning = false;
    this.currentJob = null;
    this.stats = {
      totalJobs: 0,
      successfulJobs: 0,
      failedJobs: 0,
      totalPages: 0,
      successfulPages: 0,
      failedPages: 0,
      startTime: null,
      lastJobTime: null
    };
  }

  /**
   * Start a comprehensive scraping job
   */
  async startComprehensiveScraping(options = {}) {
    const {
      includeBrokers = true,
      includeReviews = true,
      includeRegulatory = false, // More conservative with regulatory sites
      includeNews = false, // News can be scraped separately
      priorityOnly = false,
      maxConcurrent = 3,
      delayBetweenBatches = 5000
    } = options;

    if (this.isRunning) {
      throw new Error('Scraping job is already running');
    }

    this.isRunning = true;
    this.stats.startTime = new Date();
    this.stats.totalJobs++;

    console.log('🚀 Starting comprehensive scraping job...');
    console.log('=' .repeat(60));

    try {
      let allUrls = [];

      if (priorityOnly) {
        console.log('📋 Using priority URLs only...');
        allUrls = getPriorityUrls();
      } else {
        // Collect URLs based on options
        if (includeBrokers) {
          console.log('🏦 Adding broker URLs...');
          allUrls.push(...getAllBrokerUrls());
        }

        if (includeReviews) {
          console.log('⭐ Adding review site URLs...');
          allUrls.push(...getReviewSiteUrls());
        }

        if (includeRegulatory) {
          console.log('🏛️ Adding regulatory URLs...');
          allUrls.push(...getRegulatoryUrls());
        }

        if (includeNews) {
          console.log('📰 Adding news URLs...');
          allUrls.push(...getNewsUrls());
        }
      }

      console.log(`\n📊 Total URLs to scrape: ${allUrls.length}`);

      // Group URLs by category for different processing
      const urlGroups = this.groupUrlsByCategory(allUrls);

      // Process each group with appropriate settings
      const results = {
        broker: null,
        review: null,
        regulatory: null,
        news: null,
        priority: null
      };

      for (const [category, urls] of Object.entries(urlGroups)) {
        if (urls.length === 0) continue;

        console.log(`\n🔄 Processing ${category} URLs (${urls.length} items)...`);
        
        const categoryConfig = scrapingConfig[category] || scrapingConfig.brokers;
        const urlList = urls.map(item => item.url);

        // Set current job info
        this.currentJob = {
          category,
          totalUrls: urls.length,
          processedUrls: 0,
          startTime: new Date()
        };

        // Process URLs in batches
        const batchResults = await this.processBatch(urlList, categoryConfig, maxConcurrent);
        results[category] = batchResults;

        // Update stats
        this.stats.totalPages += batchResults.total;
        this.stats.successfulPages += batchResults.successful.length;
        this.stats.failedPages += batchResults.failed.length;

        // Delay between batches
        if (delayBetweenBatches > 0) {
          console.log(`⏳ Waiting ${delayBetweenBatches / 1000}s before next batch...`);
          await this.delay(delayBetweenBatches);
        }
      }

      // Generate comprehensive report
      const report = await this.generateScrapingReport(results);
      
      this.stats.successfulJobs++;
      this.stats.lastJobTime = new Date();
      
      console.log('\n🎉 Comprehensive scraping completed!');
      return report;

    } catch (error) {
      this.stats.failedJobs++;
      console.error('❌ Scraping job failed:', error.message);
      throw error;
    } finally {
      this.isRunning = false;
      this.currentJob = null;
    }
  }

  /**
   * Group URLs by category for processing
   */
  groupUrlsByCategory(urls) {
    const groups = {
      broker: [],
      review: [],
      regulatory: [],
      news: [],
      priority: []
    };

    urls.forEach(item => {
      const category = item.category || 'broker';
      if (groups[category]) {
        groups[category].push(item);
      } else {
        groups.broker.push(item); // Default to broker category
      }
    });

    return groups;
  }

  /**
   * Process a batch of URLs with specific configuration
   */
  async processBatch(urls, config, maxConcurrent = 3) {
    console.log(`   📦 Processing batch of ${urls.length} URLs...`);
    console.log(`   ⚙️ Config: ${config.delay}ms delay, ${config.timeout}ms timeout`);

    // Apply rate limiting based on config
    const originalLimit = this.scraper.limit;
    this.scraper.limit = require('p-limit')(maxConcurrent);

    try {
      const results = await this.scraper.scrapeMultiplePages(urls, {
        timeout: config.timeout,
        retries: config.retries,
        headers: config.headers
      });

      return results;
    } finally {
      // Restore original limit
      this.scraper.limit = originalLimit;
    }
  }

  /**
   * Generate a comprehensive scraping report
   */
  async generateScrapingReport(results) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalCategories: Object.keys(results).filter(k => results[k]).length,
        totalUrls: 0,
        totalSuccessful: 0,
        totalFailed: 0,
        overallSuccessRate: 0,
        duration: 0
      },
      categories: {},
      topErrors: [],
      recommendations: [],
      nextSteps: []
    };

    // Calculate summary statistics
    Object.entries(results).forEach(([category, result]) => {
      if (!result) return;

      report.summary.totalUrls += result.total;
      report.summary.totalSuccessful += result.successful.length;
      report.summary.totalFailed += result.failed.length;

      report.categories[category] = {
        total: result.total,
        successful: result.successful.length,
        failed: result.failed.length,
        successRate: result.successRate,
        duration: result.duration,
        avgResponseTime: result.duration / result.total
      };
    });

    report.summary.overallSuccessRate = 
      (report.summary.totalSuccessful / report.summary.totalUrls * 100).toFixed(2);
    
    report.summary.duration = Date.now() - this.stats.startTime.getTime();

    // Analyze errors
    const allErrors = [];
    Object.values(results).forEach(result => {
      if (result && result.failed) {
        allErrors.push(...result.failed.map(f => f.error));
      }
    });

    // Count error types
    const errorCounts = {};
    allErrors.forEach(error => {
      errorCounts[error] = (errorCounts[error] || 0) + 1;
    });

    report.topErrors = Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([error, count]) => ({ error, count }));

    // Generate recommendations
    report.recommendations = this.generateRecommendations(report);
    report.nextSteps = this.generateNextSteps(report);

    // Store report in Supabase
    await this.storeScrapingReport(report);

    return report;
  }

  /**
   * Generate recommendations based on scraping results
   */
  generateRecommendations(report) {
    const recommendations = [];

    // Success rate recommendations
    if (parseFloat(report.summary.overallSuccessRate) < 80) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Overall success rate is below 80%. Consider reducing concurrent requests or increasing timeouts.'
      });
    }

    // Error analysis recommendations
    report.topErrors.forEach(({ error, count }) => {
      if (error.includes('timeout')) {
        recommendations.push({
          type: 'timeout',
          priority: 'medium',
          message: `${count} timeout errors detected. Consider increasing timeout values.`
        });
      }
      if (error.includes('rate limit') || error.includes('429')) {
        recommendations.push({
          type: 'rate_limit',
          priority: 'high',
          message: `${count} rate limit errors detected. Reduce concurrent requests and increase delays.`
        });
      }
    });

    // Category-specific recommendations
    Object.entries(report.categories).forEach(([category, stats]) => {
      if (parseFloat(stats.successRate) < 70) {
        recommendations.push({
          type: 'category_performance',
          priority: 'medium',
          message: `${category} category has low success rate (${stats.successRate}%). Review site-specific configurations.`
        });
      }
    });

    return recommendations;
  }

  /**
   * Generate next steps based on results
   */
  generateNextSteps(report) {
    const steps = [];

    // Data analysis steps
    if (report.summary.totalSuccessful > 0) {
      steps.push({
        step: 'data_analysis',
        description: 'Analyze scraped data for broker insights and trends',
        priority: 'high',
        estimatedTime: '2-4 hours'
      });
    }

    // Error resolution steps
    if (report.summary.totalFailed > 0) {
      steps.push({
        step: 'error_resolution',
        description: 'Review and resolve failed scraping attempts',
        priority: 'medium',
        estimatedTime: '1-2 hours'
      });
    }

    // Data quality steps
    steps.push({
      step: 'data_validation',
      description: 'Validate extracted broker information for accuracy',
      priority: 'high',
      estimatedTime: '3-5 hours'
    });

    // Automation steps
    steps.push({
      step: 'schedule_automation',
      description: 'Set up automated daily/weekly scraping schedules',
      priority: 'medium',
      estimatedTime: '1 hour'
    });

    return steps;
  }

  /**
   * Store scraping report in Supabase
   */
  async storeScrapingReport(report) {
    try {
      const { data, error } = await supabase
        .from('scraping_reports')
        .insert({
          report_data: report,
          created_at: new Date().toISOString(),
          total_urls: report.summary.totalUrls,
          successful_urls: report.summary.totalSuccessful,
          failed_urls: report.summary.totalFailed,
          success_rate: parseFloat(report.summary.overallSuccessRate),
          duration_ms: report.summary.duration
        });

      if (error) {
        console.warn('⚠️ Failed to store scraping report:', error.message);
      } else {
        console.log('✅ Scraping report stored successfully');
      }
    } catch (error) {
      console.warn('⚠️ Error storing scraping report:', error.message);
    }
  }

  /**
   * Get current job status
   */
  getJobStatus() {
    return {
      isRunning: this.isRunning,
      currentJob: this.currentJob,
      stats: this.stats
    };
  }

  /**
   * Stop current scraping job
   */
  stopJob() {
    if (this.isRunning) {
      console.log('🛑 Stopping scraping job...');
      this.isRunning = false;
      return true;
    }
    return false;
  }

  /**
   * Schedule regular scraping jobs
   */
  scheduleRegularScraping(options = {}) {
    const {
      interval = 24 * 60 * 60 * 1000, // 24 hours
      priorityInterval = 6 * 60 * 60 * 1000, // 6 hours for priority URLs
      autoStart = true
    } = options;

    console.log('⏰ Setting up scheduled scraping...');
    console.log(`   📅 Full scraping every ${interval / (60 * 60 * 1000)} hours`);
    console.log(`   🎯 Priority scraping every ${priorityInterval / (60 * 60 * 1000)} hours`);

    // Schedule priority scraping
    const priorityTimer = setInterval(async () => {
      if (!this.isRunning) {
        console.log('🎯 Starting scheduled priority scraping...');
        try {
          await this.startComprehensiveScraping({ priorityOnly: true });
        } catch (error) {
          console.error('❌ Scheduled priority scraping failed:', error.message);
        }
      }
    }, priorityInterval);

    // Schedule full scraping
    const fullTimer = setInterval(async () => {
      if (!this.isRunning) {
        console.log('🔄 Starting scheduled full scraping...');
        try {
          await this.startComprehensiveScraping({
            includeBrokers: true,
            includeReviews: true,
            includeRegulatory: false,
            includeNews: false
          });
        } catch (error) {
          console.error('❌ Scheduled full scraping failed:', error.message);
        }
      }
    }, interval);

    // Start immediately if requested
    if (autoStart) {
      setTimeout(() => {
        this.startComprehensiveScraping({ priorityOnly: true })
          .catch(error => console.error('❌ Initial scraping failed:', error.message));
      }, 5000); // Start after 5 seconds
    }

    return {
      priorityTimer,
      fullTimer,
      stop: () => {
        clearInterval(priorityTimer);
        clearInterval(fullTimer);
        console.log('⏹️ Scheduled scraping stopped');
      }
    };
  }

  /**
   * Utility function for delays
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get scraping statistics
   */
  async getScrapingStatistics() {
    try {
      // Get recent scraping reports
      const { data: reports, error } = await supabase
        .from('scraping_reports')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Get crawled pages statistics
      const crawlingStats = await this.scraper.getCrawlingStats();

      return {
        orchestrator: this.stats,
        recentReports: reports || [],
        crawledPages: crawlingStats,
        currentJob: this.currentJob
      };
    } catch (error) {
      console.error('❌ Failed to get scraping statistics:', error.message);
      return {
        orchestrator: this.stats,
        recentReports: [],
        crawledPages: null,
        currentJob: this.currentJob,
        error: error.message
      };
    }
  }
}

export default ScrapingOrchestrator;
export { ScrapingOrchestrator };