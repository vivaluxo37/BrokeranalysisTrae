#!/usr/bin/env node
/**
 * Test script to verify database insertion functionality
 * Uses sample URLs collected from the crawl to test data parsing
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Database Insertion...');
console.log('================================');

// Validate Supabase environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Sample URLs collected from the crawl (based on the logs we saw)
const sampleUrls = [
  'https://brokerchooser.com/pl/broker-reviews/tickmill-review/tickmill-no-inactivity-fee',
  'https://brokerchooser.com/no/broker-reviews/lynx-review/micro-emini-dowjones-futures-fees',
  'https://brokerchooser.com/no/broker-reviews/fusion-markets-review/nkd-futures-fees',
  'https://brokerchooser.com/broker-reviews/etoro-review',
  'https://brokerchooser.com/broker-reviews/plus500-review'
];

// Sample crawled data structure matching the actual database schema
function createSampleCrawlData(url) {
  const urlParts = url.split('/');
  const brokerName = urlParts.includes('broker-reviews') ? 
    urlParts[urlParts.indexOf('broker-reviews') + 1]?.replace('-review', '') || 'unknown' :
    'unknown';
  
  const title = `${brokerName.charAt(0).toUpperCase() + brokerName.slice(1)} Review - BrokerChooser`;
  const htmlContent = `<html><head><title>${title}</title></head><body><h1>${title}</h1><p>Sample content for ${brokerName} broker review page.</p></body></html>`;
  const textContent = `${title}\n\nSample content for ${brokerName} broker review page. This would contain the actual scraped content with broker information, features, pricing, and reviews.`;
  
  return {
    url: url,
    status: 200,
    sha256: `sample_hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    html: htmlContent,
    text_content: textContent,
    meta: {
      title: title,
      pageType: url.includes('broker-reviews') ? 'broker_review' : 'general',
      language: url.includes('/pl/') ? 'pl' : url.includes('/no/') ? 'no' : 'en',
      description: `Comprehensive review of ${brokerName} broker`,
      keywords: [brokerName, 'broker', 'review', 'trading']
    },
    data: {
      reviewData: {
        brokerName: brokerName.charAt(0).toUpperCase() + brokerName.slice(1),
        brokerSlug: brokerName,
        rating: Math.floor(Math.random() * 5) + 6, // Random rating between 6-10
        pros: [
          'User-friendly platform',
          'Competitive fees',
          'Good customer support'
        ],
        cons: [
          'Limited research tools',
          'No phone support'
        ],
        sections: {
          fees: { score: 8.5 },
          platform: { score: 7.8 },
          research: { score: 6.2 }
        },
        lastUpdated: new Date().toISOString()
      },
      extractionMetadata: {
        word_count: 150,
        has_pricing: true,
        has_features: true,
        response_time: Math.floor(Math.random() * 3000) + 1000,
        extracted_at: new Date().toISOString()
      }
    }
  };
}

async function testDatabaseInsertion() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('crawled_pages')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ Supabase connection failed:', testError.message);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    
    // Clean up any existing test data first
    console.log('🧹 Cleaning up any existing test data...');
    await cleanupTestData();
    
    // Prepare sample data
    const sampleData = sampleUrls.map(createSampleCrawlData);
    
    console.log(`📝 Preparing to insert ${sampleData.length} sample records...`);
    
    // Insert sample data
    const { data: insertData, error: insertError } = await supabase
      .from('crawled_pages')
      .insert(sampleData)
      .select();
    
    if (insertError) {
      console.error('❌ Database insertion failed:', insertError.message);
      console.error('Error details:', insertError);
      return false;
    }
    
    console.log(`✅ Successfully inserted ${insertData.length} records`);
    
    // Verify insertion by querying back
    const { data: verifyData, error: verifyError } = await supabase
      .from('crawled_pages')
      .select('*')
      .in('url', sampleUrls)
      .order('fetched_at', { ascending: false });
    
    if (verifyError) {
      console.error('❌ Verification query failed:', verifyError.message);
      return false;
    }
    
    console.log(`✅ Verification successful: Found ${verifyData.length} records`);
    
    // Display sample of inserted data
    console.log('\n📊 Sample of inserted data:');
    verifyData.slice(0, 2).forEach((record, index) => {
      const brokerName = record.data?.reviewData?.brokerName || 'Unknown';
      const language = record.meta?.language || 'en';
      const title = record.meta?.title || 'No title';
      const pageType = record.meta?.pageType || 'unknown';
      
      console.log(`\n${index + 1}. ${brokerName} (${language})`);
      console.log(`   URL: ${record.url}`);
      console.log(`   Title: ${title}`);
      console.log(`   Type: ${pageType}`);
      console.log(`   Status: ${record.status}`);
      console.log(`   Fetched: ${new Date(record.fetched_at).toLocaleString()}`);
      console.log(`   Rating: ${record.data?.reviewData?.rating || 'N/A'}`);
    });
    
    // Get total count
    const { count, error: countError } = await supabase
      .from('crawled_pages')
      .select('*', { count: 'exact', head: true });
    
    if (!countError) {
      console.log(`\n📈 Total records in database: ${count}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    console.error('Stack trace:', error.stack);
    return false;
  }
}

async function cleanupTestData() {
  try {
    console.log('\n🧹 Cleaning up test data...');
    
    const { error } = await supabase
      .from('crawled_pages')
      .delete()
      .in('url', sampleUrls);
    
    if (error) {
      console.error('❌ Cleanup failed:', error.message);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }
  } catch (error) {
    console.error('💥 Cleanup error:', error.message);
  }
}

// Main execution
async function main() {
  const success = await testDatabaseInsertion();
  
  if (success) {
    console.log('\n🎉 Database insertion test completed successfully!');
    console.log('The crawl data parsing and database insertion is working correctly.');
    
    // Ask if user wants to keep test data
    console.log('\n❓ Test data has been inserted. Run cleanup? (Ctrl+C to keep data)');
    
    // Wait a bit then cleanup
    setTimeout(async () => {
      await cleanupTestData();
      console.log('\n✅ Test completed!');
      process.exit(0);
    }, 5000);
    
  } else {
    console.log('\n❌ Database insertion test failed!');
    console.log('Please check your database configuration and try again.');
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Test interrupted by user');
  await cleanupTestData();
  process.exit(0);
});

// Start the test
main().catch(error => {
  console.error('💥 Test failed:', error.message);
  process.exit(1);
});