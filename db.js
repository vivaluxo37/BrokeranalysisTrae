/**
 * Supabase Database Client for BrokerChooser Crawler
 * Handles database operations and upsert functionality
 */

import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

class DatabaseService {
  constructor(options = {}) {
    this.supabaseUrl = options.supabaseUrl || process.env.SUPABASE_URL;
    this.supabaseKey = options.supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY;
    this.tableName = options.tableName || 'crawled_pages';
    this.batchSize = options.batchSize || parseInt(process.env.DB_BATCH_SIZE) || 50;
    this.debug = options.debug || false;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Supabase URL and Service Role Key are required');
    }
    
    // Initialize Supabase client
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    this.stats = {
      totalUpserts: 0,
      successfulUpserts: 0,
      failedUpserts: 0,
      skippedUpserts: 0,
      totalBatches: 0
    };
  }

  /**
   * Generate SHA256 hash for content
   */
  generateHash(content) {
    return crypto.createHash('sha256').update(content || '').digest('hex');
  }

  /**
   * Check if table exists and is accessible
   */
  async checkTableExists() {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('id')
        .limit(1);
      
      if (error) {
        throw new Error(`Table check failed: ${error.message}`);
      }
      
      return true;
    } catch (error) {
      if (this.debug) {
        console.error(`❌ Table ${this.tableName} check failed:`, error.message);
      }
      return false;
    }
  }

  /**
   * Check if URL already exists with same content hash
   */
  async checkExistingPage(url, contentHash) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('id, sha256, fetched_at')
        .eq('url', url)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }
      
      if (data) {
        return {
          exists: true,
          sameContent: data.sha256 === contentHash,
          lastFetched: data.fetched_at,
          id: data.id
        };
      }
      
      return { exists: false };
    } catch (error) {
      if (this.debug) {
        console.warn(`⚠️ Error checking existing page for ${url}:`, error.message);
      }
      return { exists: false, error: error.message };
    }
  }

  /**
   * Prepare data for database insertion
   */
  prepareDataForInsert(pageData) {
    const now = new Date().toISOString();
    
    // Generate content hash if not provided
    const contentHash = pageData.contentHash || this.generateHash(pageData.textContent);
    
    // Prepare metadata
    const metadata = {
      ...pageData.metadata,
      pageType: pageData.pageType || 'general',
      parsedAt: pageData.parsedAt || now
    };
    
    // Prepare structured data
    const data = {};
    
    // Add review data if it's a broker review
    if (pageData.reviewData) {
      data.reviewData = pageData.reviewData;
    }
    
    // Add any additional structured data
    if (pageData.structuredData) {
      data.structuredData = pageData.structuredData;
    }
    
    return {
      url: pageData.url,
      status: pageData.status || 200,
      fetched_at: pageData.fetchedAt || now,
      sha256: contentHash,
      html: pageData.html || '',
      text_content: pageData.textContent || '',
      meta: metadata,
      data: data
    };
  }

  /**
   * Upsert a single page
   */
  async upsertPage(pageData, options = {}) {
    const { force = false, skipIfExists = false } = options;
    
    try {
      const preparedData = this.prepareDataForInsert(pageData);
      
      // Check if page exists (unless forcing)
      if (!force) {
        const existing = await this.checkExistingPage(preparedData.url, preparedData.sha256);
        
        if (existing.exists) {
          if (existing.sameContent && skipIfExists) {
            this.stats.skippedUpserts++;
            if (this.debug) {
              console.log(`⏭️ Skipping ${preparedData.url} (unchanged content)`);
            }
            return { success: true, skipped: true, id: existing.id };
          }
          
          if (existing.sameContent) {
            // Update only the fetched_at timestamp
            const { data, error } = await this.supabase
              .from(this.tableName)
              .update({ fetched_at: preparedData.fetched_at })
              .eq('url', preparedData.url)
              .select('id')
              .single();
            
            if (error) throw error;
            
            this.stats.successfulUpserts++;
            if (this.debug) {
              console.log(`🔄 Updated timestamp for ${preparedData.url}`);
            }
            return { success: true, updated: true, id: data.id };
          }
        }
      }
      
      // Perform upsert
      const { data, error } = await this.supabase
        .from(this.tableName)
        .upsert(preparedData, { 
          onConflict: 'url',
          ignoreDuplicates: false 
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      this.stats.totalUpserts++;
      this.stats.successfulUpserts++;
      
      if (this.debug) {
        console.log(`✅ Upserted ${preparedData.url} (ID: ${data.id})`);
      }
      
      return { success: true, id: data.id, upserted: true };
      
    } catch (error) {
      this.stats.totalUpserts++;
      this.stats.failedUpserts++;
      
      if (this.debug) {
        console.error(`❌ Failed to upsert ${pageData.url}:`, error.message);
      }
      
      return { 
        success: false, 
        error: error.message,
        url: pageData.url 
      };
    }
  }

  /**
   * Upsert multiple pages in batches
   */
  async upsertPages(pagesData, options = {}) {
    const { force = false, skipIfExists = false, batchSize = this.batchSize } = options;
    const results = [];
    const errors = [];
    
    if (this.debug) {
      console.log(`📦 Processing ${pagesData.length} pages in batches of ${batchSize}`);
    }
    
    // Process in batches
    for (let i = 0; i < pagesData.length; i += batchSize) {
      const batch = pagesData.slice(i, i + batchSize);
      this.stats.totalBatches++;
      
      if (this.debug) {
        console.log(`📦 Processing batch ${Math.ceil((i + 1) / batchSize)} of ${Math.ceil(pagesData.length / batchSize)}`);
      }
      
      // Process batch concurrently
      const batchPromises = batch.map(pageData => 
        this.upsertPage(pageData, { force, skipIfExists })
      );
      
      try {
        const batchResults = await Promise.allSettled(batchPromises);
        
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            const error = {
              url: batch[index].url,
              error: result.reason.message || 'Unknown error'
            };
            errors.push(error);
            this.stats.failedUpserts++;
          }
        });
        
      } catch (error) {
        if (this.debug) {
          console.error(`❌ Batch processing error:`, error.message);
        }
        errors.push({ batch: i / batchSize + 1, error: error.message });
      }
      
      // Small delay between batches to avoid overwhelming the database
      if (i + batchSize < pagesData.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return {
      success: errors.length === 0,
      results: results,
      errors: errors,
      stats: {
        total: pagesData.length,
        successful: results.filter(r => r.success).length,
        failed: errors.length,
        skipped: results.filter(r => r.skipped).length
      }
    };
  }

  /**
   * Get crawling statistics
   */
  async getCrawlingStats() {
    try {
      // Total pages
      const { count: totalPages } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true });
      
      // Pages by status
      const { data: statusData } = await this.supabase
        .from(this.tableName)
        .select('status')
        .neq('status', null);
      
      const statusCounts = statusData?.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
      }, {}) || {};
      
      // Recent crawls (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: recentCrawls } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .gte('fetched_at', yesterday);
      
      // Broker review pages
      const { count: reviewPages } = await this.supabase
        .from(this.tableName)
        .select('*', { count: 'exact', head: true })
        .like('url', '%/broker-reviews/%');
      
      return {
        totalPages: totalPages || 0,
        statusCounts: statusCounts,
        recentCrawls: recentCrawls || 0,
        reviewPages: reviewPages || 0,
        sessionStats: this.stats
      };
      
    } catch (error) {
      if (this.debug) {
        console.error('❌ Error getting crawling stats:', error.message);
      }
      return {
        error: error.message,
        sessionStats: this.stats
      };
    }
  }

  /**
   * Search crawled pages
   */
  async searchPages(query, options = {}) {
    const { 
      limit = 50, 
      offset = 0, 
      status = null, 
      pageType = null,
      dateFrom = null,
      dateTo = null 
    } = options;
    
    try {
      let queryBuilder = this.supabase
        .from(this.tableName)
        .select('url, status, fetched_at, meta, data')
        .order('fetched_at', { ascending: false })
        .range(offset, offset + limit - 1);
      
      // Add filters
      if (status) {
        queryBuilder = queryBuilder.eq('status', status);
      }
      
      if (pageType) {
        queryBuilder = queryBuilder.eq('meta->>pageType', pageType);
      }
      
      if (dateFrom) {
        queryBuilder = queryBuilder.gte('fetched_at', dateFrom);
      }
      
      if (dateTo) {
        queryBuilder = queryBuilder.lte('fetched_at', dateTo);
      }
      
      // Text search in URL or title
      if (query) {
        queryBuilder = queryBuilder.or(`url.ilike.%${query}%,meta->>title.ilike.%${query}%`);
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data || [],
        count: data?.length || 0
      };
      
    } catch (error) {
      if (this.debug) {
        console.error('❌ Error searching pages:', error.message);
      }
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  }

  /**
   * Get page by URL
   */
  async getPageByUrl(url) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('url', url)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return {
        success: true,
        data: data || null,
        exists: !!data
      };
      
    } catch (error) {
      if (this.debug) {
        console.error(`❌ Error getting page ${url}:`, error.message);
      }
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * Delete pages by URLs
   */
  async deletePages(urls) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .delete()
        .in('url', urls)
        .select('url');
      
      if (error) {
        throw error;
      }
      
      if (this.debug) {
        console.log(`🗑️ Deleted ${data?.length || 0} pages`);
      }
      
      return {
        success: true,
        deletedCount: data?.length || 0,
        deletedUrls: data?.map(row => row.url) || []
      };
      
    } catch (error) {
      if (this.debug) {
        console.error('❌ Error deleting pages:', error.message);
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = {
      totalUpserts: 0,
      successfulUpserts: 0,
      failedUpserts: 0,
      skippedUpserts: 0,
      totalBatches: 0
    };
  }

  /**
   * Get current statistics
   */
  getStats() {
    return { ...this.stats };
  }
}

export default DatabaseService;

// For testing purposes
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🧪 Testing DatabaseService...');
  
  const db = new DatabaseService({ debug: true });
  
  // Test connection
  db.checkTableExists()
    .then(exists => {
      console.log(`📊 Table exists: ${exists}`);
      
      if (exists) {
        return db.getCrawlingStats();
      }
    })
    .then(stats => {
      if (stats) {
        console.log('📈 Current stats:', JSON.stringify(stats, null, 2));
      }
    })
    .catch(error => {
      console.error('❌ Test failed:', error.message);
    });
}