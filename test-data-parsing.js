/**
 * Test Data Parsing Script
 * Simple test to verify data parsing functionality
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import crypto from 'crypto';

dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testDataParsing() {
  console.log('🚀 Testing data parsing functionality...');
  
  try {
    // Test database connection
    console.log('\n🔌 Testing database connection...');
    const { data, error } = await supabase.from('crawled_pages').select('count').limit(1);
    if (error) throw error;
    console.log('✅ Database connection successful');
    
    // Check for collected URLs
    console.log('\n📥 Checking for collected URLs...');
    try {
      const urlsData = await fs.readFile('./collected_urls.json', 'utf8');
      const urls = JSON.parse(urlsData);
      console.log(`✅ Found ${urls.total} collected URLs`);
      console.log('Sample URLs:', urls.urls.slice(0, 3));
    } catch (error) {
      console.log('⚠️  No collected_urls.json found');
    }
    
    // Check for scraped data
    console.log('\n📄 Checking for scraped data...');
    try {
      const scrapedData = await fs.readFile('./scraped_data/sample-crawled-data.json', 'utf8');
      const data = JSON.parse(scrapedData);
      console.log(`✅ Found ${data.total} scraped pages`);
      console.log('Sample pages:');
      data.pages.forEach((page, index) => {
        console.log(`  ${index + 1}. ${page.url}`);
        console.log(`     Broker: ${page.data?.reviewData?.brokerName || 'Unknown'}`);
        console.log(`     Rating: ${page.data?.reviewData?.rating || 'N/A'}`);
        console.log(`     Language: ${page.language}`);
      });
    } catch (error) {
      console.log('⚠️  No scraped data found');
    }
    
    // Test data insertion
    console.log('\n💾 Testing sample data insertion...');
    const htmlContent = '<html><body><h1>Test Broker Review</h1></body></html>';
    const sha256Hash = crypto.createHash('sha256').update(htmlContent).digest('hex');
    
    const sampleRecord = {
      url: 'https://test-broker-review.com/sample-test',
      status: 200,
      sha256: sha256Hash,
      html: htmlContent,
      text_content: 'Test Broker Review',
      meta: {
        title: 'Test Broker Review',
        language: 'en',
        pageType: 'broker_review'
      },
      data: {
        reviewData: {
          brokerName: 'Test Broker',
          rating: 8.5,
          summary: 'This is a test broker review'
        },
        extractionMetadata: {
          extractedAt: new Date().toISOString(),
          source: 'test_script',
          confidence: 1.0
        }
      }
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('crawled_pages')
      .upsert(sampleRecord, { onConflict: 'url' })
      .select();
      
    if (insertError) {
      console.log('❌ Insert failed:', insertError.message);
    } else {
      console.log('✅ Sample data inserted successfully');
    }
    
    // Get database statistics
    console.log('\n📊 Database statistics:');
    const { data: stats, error: statsError } = await supabase
      .from('crawled_pages')
      .select('url, status, meta, data')
      .order('fetched_at', { ascending: false })
      .limit(5);
      
    if (statsError) {
      console.log('❌ Stats query failed:', statsError.message);
    } else {
      console.log(`Total recent records: ${stats.length}`);
      stats.forEach((record, index) => {
        console.log(`  ${index + 1}. ${record.url}`);
        console.log(`     Broker: ${record.data?.reviewData?.brokerName || 'Unknown'}`);
        console.log(`     Status: ${record.status}`);
      });
    }
    
    console.log('\n✅ Data parsing test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testDataParsing();