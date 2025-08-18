import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration in .env file');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to generate SHA256 hash
function generateSHA256(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Helper function to extract text content (simplified)
function extractTextContent(html) {
  // Simple text extraction - remove HTML tags
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// Helper function to extract metadata (simplified)
function extractMetadata(html) {
  const metadata = {};
  
  // Extract title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }
  
  // Extract meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  if (descMatch) {
    metadata.description = descMatch[1].trim();
  }
  
  return metadata;
}

async function testCrawledPagesTable() {
  console.log('🧪 Testing crawled_pages table...');
  
  try {
    // Test 1: Check if table exists by querying its structure
    console.log('\n1️⃣ Checking table structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('crawled_pages')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.error('❌ Table does not exist or is not accessible:', tableError.message);
      console.log('\n📋 Please execute the SQL commands from CRAWLED_PAGES_TABLE_SETUP.md first!');
      return;
    }
    
    console.log('✅ Table exists and is accessible');
    
    // Test 2: Insert sample data
    console.log('\n2️⃣ Inserting sample crawl data...');
    
    const sampleHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sample Broker Review</title>
        <meta name="description" content="Comprehensive review of XYZ Broker">
      </head>
      <body>
        <h1>XYZ Broker Review</h1>
        <p>This broker offers excellent trading conditions with low spreads.</p>
        <div class="rating">Rating: 4.5/5</div>
      </body>
      </html>
    `;
    
    const sampleUrl = `https://example.com/broker-review-${Date.now()}`;
    const textContent = extractTextContent(sampleHtml);
    const metadata = extractMetadata(sampleHtml);
    const sha256Hash = generateSHA256(sampleHtml);
    
    const sampleData = {
      url: sampleUrl,
      status: 200,
      html: sampleHtml,
      text_content: textContent,
      meta: metadata,
      data: {
        rating: 4.5,
        broker_name: 'XYZ Broker',
        features: ['low_spreads', 'excellent_conditions'],
        review_type: 'comprehensive',
        extracted_at: new Date().toISOString()
      },
      sha256: sha256Hash
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('crawled_pages')
      .insert(sampleData)
      .select();
    
    if (insertError) {
      console.error('❌ Failed to insert sample data:', insertError.message);
      return;
    }
    
    console.log('✅ Sample data inserted successfully');
    console.log('📄 Inserted record ID:', insertData[0].id);
    
    // Test 3: Query the inserted data
    console.log('\n3️⃣ Querying inserted data...');
    
    const { data: queryData, error: queryError } = await supabase
      .from('crawled_pages')
      .select('id, url, status, fetched_at, meta, data')
      .eq('url', sampleUrl)
      .single();
    
    if (queryError) {
      console.error('❌ Failed to query data:', queryError.message);
      return;
    }
    
    console.log('✅ Data queried successfully:');
    console.log('🔗 URL:', queryData.url);
    console.log('📊 Status:', queryData.status);
    console.log('⏰ Fetched at:', queryData.fetched_at);
    console.log('📋 Metadata:', JSON.stringify(queryData.meta, null, 2));
    console.log('📦 Data:', JSON.stringify(queryData.data, null, 2));
    
    // Test 4: Test JSON queries
    console.log('\n4️⃣ Testing JSON queries...');
    
    // Query by rating
    const { data: ratingData, error: ratingError } = await supabase
      .from('crawled_pages')
      .select('url, data->rating as rating')
      .gte('data->rating', 4.0);
    
    if (ratingError) {
      console.error('❌ Failed to query by rating:', ratingError.message);
    } else {
      console.log('✅ Found', ratingData.length, 'pages with rating >= 4.0');
      ratingData.forEach(item => {
        console.log(`   📈 ${item.url}: Rating ${item.rating}`);
      });
    }
    
    // Query by features
    const { data: featureData, error: featureError } = await supabase
      .from('crawled_pages')
      .select('url, data->features as features')
      .contains('data->features', ['low_spreads']);
    
    if (featureError) {
      console.error('❌ Failed to query by features:', featureError.message);
    } else {
      console.log('✅ Found', featureData.length, 'pages with low_spreads feature');
      featureData.forEach(item => {
        console.log(`   🎯 ${item.url}: Features ${JSON.stringify(item.features)}`);
      });
    }
    
    // Test 5: Test recent crawls query
    console.log('\n5️⃣ Testing recent crawls query...');
    
    const { data: recentData, error: recentError } = await supabase
      .from('crawled_pages')
      .select('url, status, fetched_at')
      .gte('fetched_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('fetched_at', { ascending: false })
      .limit(5);
    
    if (recentError) {
      console.error('❌ Failed to query recent crawls:', recentError.message);
    } else {
      console.log('✅ Found', recentData.length, 'recent crawls (last 24 hours):');
      recentData.forEach(item => {
        console.log(`   🕐 ${item.fetched_at}: ${item.url} (${item.status})`);
      });
    }
    
    // Test 6: Clean up test data
    console.log('\n6️⃣ Cleaning up test data...');
    
    const { error: deleteError } = await supabase
      .from('crawled_pages')
      .delete()
      .eq('url', sampleUrl);
    
    if (deleteError) {
      console.error('❌ Failed to clean up test data:', deleteError.message);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }
    
    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📋 Table is ready for use with your web crawling workflow.');
    
  } catch (error) {
    console.error('❌ Unexpected error during testing:', error.message);
  }
}

// Run the test
testCrawledPagesTable().catch(console.error);