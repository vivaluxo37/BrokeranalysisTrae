/**
 * Parse Collected Data to Database
 * This script parses collected URLs and scraped data to the Supabase database
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

class DataParser {
  constructor() {
    this.batchSize = 100; // Process in batches to avoid memory issues
    this.processedCount = 0;
    this.errorCount = 0;
  }

  /**
   * Validate environment variables
   */
  validateEnvironment() {
    const required = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }

  /**
   * Test database connection
   */
  async testConnection() {
    console.log('🔍 Testing database connection...');
    
    const { data, error } = await supabase
      .from('crawled_pages')
      .select('count')
      .limit(1);
    
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    
    console.log('✅ Database connection successful');
  }

  /**
   * Generate SHA256 hash for content
   */
  generateHash(content) {
    return crypto.createHash('sha256').update(content || '').digest('hex');
  }

  /**
   * Extract broker name from URL
   */
  extractBrokerFromUrl(url) {
    const match = url.match(/\/broker-reviews\/([^-]+)-review/);
    return match ? match[1] : null;
  }

  /**
   * Determine page type from URL
   */
  determinePageType(url) {
    if (url.includes('/broker-reviews/')) return 'broker_review';
    if (url.includes('/comparison/')) return 'comparison';
    if (url.includes('/news/')) return 'news';
    if (url.includes('/education/')) return 'education';
    return 'other';
  }

  /**
   * Extract language from URL
   */
  extractLanguage(url) {
    const match = url.match(/\/([a-z]{2})\//); // Extract language code like /pl/, /no/, etc.
    return match ? match[1] : 'en';
  }

  /**
   * Parse collected URLs file
   */
  async parseCollectedUrls(filePath = 'collected_urls.json') {
    console.log(`📂 Parsing collected URLs from ${filePath}...`);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      console.log(`📊 Found ${data.total} URLs collected at ${data.collectedAt}`);
      
      const urlsToInsert = data.urls.map(urlData => {
        const url = typeof urlData === 'string' ? urlData : urlData.url;
        const brokerName = this.extractBrokerFromUrl(url);
        const pageType = this.determinePageType(url);
        const language = this.extractLanguage(url);
        
        return {
          url: url,
          status: 'pending', // URLs from sitemap are pending crawl
          fetched_at: new Date().toISOString(),
          sha256: this.generateHash(url), // Hash the URL as placeholder
          html: null,
          text_content: null,
          meta: {
            language: language,
            pageType: pageType,
            source: 'sitemap_collection',
            collectedAt: data.collectedAt
          },
          data: brokerName ? {
            reviewData: {
              brokerName: brokerName
            },
            extractionMetadata: {
              source: 'url_parsing',
              extractedAt: new Date().toISOString()
            }
          } : {
            extractionMetadata: {
              source: 'url_parsing',
              extractedAt: new Date().toISOString()
            }
          }
        };
      });
      
      await this.insertDataInBatches(urlsToInsert, 'URLs from sitemap');
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`⚠️  File ${filePath} not found. Skipping URL parsing.`);
      } else {
        console.error(`❌ Error parsing collected URLs: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Parse scraped data files (if they exist)
   */
  async parseScrapedData(directory = './scraped_data') {
    console.log(`📂 Looking for scraped data in ${directory}...`);
    
    try {
      const files = await fs.readdir(directory);
      const jsonFiles = files.filter(file => file.endsWith('.json'));
      
      if (jsonFiles.length === 0) {
        console.log(`⚠️  No JSON files found in ${directory}. Skipping scraped data parsing.`);
        return;
      }
      
      console.log(`📊 Found ${jsonFiles.length} JSON files to process`);
      
      for (const file of jsonFiles) {
        const filePath = path.join(directory, file);
        await this.parseScrapedFile(filePath);
      }
      
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`⚠️  Directory ${directory} not found. Skipping scraped data parsing.`);
      } else {
        console.error(`❌ Error parsing scraped data: ${error.message}`);
        throw error;
      }
    }
  }

  /**
   * Parse individual scraped data file
   */
  async parseScrapedFile(filePath) {
    console.log(`📄 Processing ${filePath}...`);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      // Handle different data formats
      let records = [];
      
      if (Array.isArray(data)) {
        records = data;
      } else if (data.pages && Array.isArray(data.pages)) {
        records = data.pages;
      } else if (data.url && data.html) {
        records = [data]; // Single record
      } else {
        console.log(`⚠️  Unknown data format in ${filePath}. Skipping.`);
        return;
      }
      
      const dataToInsert = records.map(record => {
        const url = record.url;
        const html = record.html || record.content || '';
        const textContent = record.text || record.textContent || this.extractTextFromHtml(html);
        
        return {
          url: url,
          status: record.status || 200,
          fetched_at: record.fetchedAt || record.timestamp || new Date().toISOString(),
          sha256: this.generateHash(html),
          html: html,
          text_content: textContent,
          meta: {
            language: record.language || this.extractLanguage(url),
            pageType: record.pageType || this.determinePageType(url),
            title: record.title || this.extractTitleFromHtml(html),
            source: 'file_import',
            importedAt: new Date().toISOString(),
            originalFile: path.basename(filePath)
          },
          data: record.data || {
            extractionMetadata: {
              source: 'file_import',
              extractedAt: new Date().toISOString(),
              originalFile: path.basename(filePath)
            }
          }
        };
      });
      
      await this.insertDataInBatches(dataToInsert, `scraped data from ${path.basename(filePath)}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}: ${error.message}`);
      this.errorCount++;
    }
  }

  /**
   * Extract text content from HTML (basic implementation)
   */
  extractTextFromHtml(html) {
    if (!html) return '';
    // Remove HTML tags and decode entities (basic implementation)
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 10000); // Limit text content length
  }

  /**
   * Extract title from HTML
   */
  extractTitleFromHtml(html) {
    if (!html) return null;
    const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return match ? match[1].trim() : null;
  }

  /**
   * Insert data in batches to avoid overwhelming the database
   */
  async insertDataInBatches(data, description) {
    if (data.length === 0) {
      console.log(`⚠️  No data to insert for ${description}`);
      return;
    }
    
    console.log(`📝 Inserting ${data.length} records for ${description}...`);
    
    for (let i = 0; i < data.length; i += this.batchSize) {
      const batch = data.slice(i, i + this.batchSize);
      
      try {
        const { data: insertedData, error } = await supabase
          .from('crawled_pages')
          .upsert(batch, { 
            onConflict: 'url',
            ignoreDuplicates: false 
          })
          .select('url');
        
        if (error) {
          console.error(`❌ Batch insert failed: ${error.message}`);
          this.errorCount += batch.length;
        } else {
          this.processedCount += batch.length;
          console.log(`✅ Inserted batch ${Math.floor(i / this.batchSize) + 1}/${Math.ceil(data.length / this.batchSize)} (${batch.length} records)`);
        }
        
      } catch (error) {
        console.error(`❌ Batch insert error: ${error.message}`);
        this.errorCount += batch.length;
      }
      
      // Small delay between batches to avoid rate limiting
      if (i + this.batchSize < data.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats() {
    console.log('📊 Getting database statistics...');
    
    try {
      const { data, error } = await supabase
        .from('crawled_pages')
        .select('status, meta->pageType, meta->language')
        .limit(1000); // Sample for stats
      
      if (error) {
        console.error(`❌ Failed to get stats: ${error.message}`);
        return;
      }
      
      const stats = {
        total: data.length,
        byStatus: {},
        byPageType: {},
        byLanguage: {}
      };
      
      data.forEach(record => {
        // Count by status
        stats.byStatus[record.status] = (stats.byStatus[record.status] || 0) + 1;
        
        // Count by page type
        const pageType = record.meta?.pageType || 'unknown';
        stats.byPageType[pageType] = (stats.byPageType[pageType] || 0) + 1;
        
        // Count by language
        const language = record.meta?.language || 'unknown';
        stats.byLanguage[language] = (stats.byLanguage[language] || 0) + 1;
      });
      
      console.log('\n📈 Database Statistics:');
      console.log(`   Total records (sample): ${stats.total}`);
      console.log('   By Status:', stats.byStatus);
      console.log('   By Page Type:', stats.byPageType);
      console.log('   By Language:', stats.byLanguage);
      
    } catch (error) {
      console.error(`❌ Error getting database stats: ${error.message}`);
    }
  }

  /**
   * Main parsing function
   */
  async parseAllData() {
    console.log('🚀 Starting data parsing to database...');
    console.log('=====================================\n');
    
    try {
      // Validate environment
      console.log('\n📋 Validating environment variables...');
      this.validateEnvironment();
      console.log('✅ Environment validation passed');
      
      // Test database connection
      console.log('\n🔌 Testing database connection...');
      await this.testConnection();
      console.log('✅ Database connection successful');
      
      // Parse collected URLs
      console.log('\n📥 Parsing collected URLs...');
      await this.parseCollectedUrls();
      
      // Parse scraped data
      console.log('\n📄 Parsing scraped data...');
      await this.parseScrapedData();
      
      // Show final statistics
      console.log('\n🎯 Parsing Summary:');
      console.log(`   Successfully processed: ${this.processedCount} records`);
      console.log(`   Errors encountered: ${this.errorCount} records`);
      
      // Get database statistics
      console.log('\n📊 Generating database statistics...');
      await this.getDatabaseStats();
      
      console.log('\n✅ Data parsing completed successfully!');
      
    } catch (error) {
      console.error(`\n❌ Data parsing failed: ${error.message}`);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    }
  }
}

// Run the parser
if (import.meta.url === `file://${process.argv[1]}`) {
  const parser = new DataParser();
  parser.parseAllData();
}

export default DataParser;