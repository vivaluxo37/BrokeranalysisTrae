// Test the actual OG image generation handler
import { handler } from './api/og/broker.ts';
import { config } from 'dotenv';
config();

// Create a mock request object that matches Vercel's Request interface
class MockRequest {
  constructor(url, options = {}) {
    this.url = url;
    this.method = options.method || 'GET';
    this.headers = new Map(Object.entries(options.headers || {}));
  }
  
  // Add nextUrl property that Vercel Edge Functions expect
  get nextUrl() {
    const url = new URL(this.url);
    return {
      searchParams: url.searchParams
    };
  }
}

async function testRealOGHandler() {
  try {
    console.log('🧪 Testing real OG image handler...');
    console.log('📊 Environment check:');
    console.log('  - SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('  - SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    
    // Test with broker-1
    const mockRequest = new MockRequest('http://localhost:3000/api/og/broker?slug=broker-1');
    
    console.log('\n🚀 Calling handler with slug: broker-1');
    const response = await handler(mockRequest);
    
    console.log('📋 Response details:');
    console.log('  - Status:', response.status);
    console.log('  - Status Text:', response.statusText);
    console.log('  - Content-Type:', response.headers.get('Content-Type'));
    console.log('  - Cache-Control:', response.headers.get('Cache-Control'));
    
    if (response.status === 200) {
      console.log('\n✅ SUCCESS: OG image generated successfully!');
      console.log('📏 Expected dimensions: 1200x630 PNG');
      
      // Check if it's actually an image
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('image/png')) {
        console.log('🖼️  Confirmed: Response is a PNG image');
      } else {
        console.log('⚠️  Warning: Content-Type is not image/png:', contentType);
      }
    } else {
      console.log('\n❌ ERROR: Failed to generate OG image');
      const responseText = await response.text();
      console.log('📄 Response body:', responseText);
    }
    
  } catch (error) {
    console.error('\n💥 Test failed with error:');
    console.error('📋 Error details:', error.message);
    console.error('🔍 Stack trace:', error.stack);
  }
}

// Test with different broker IDs
async function testMultipleBrokers() {
  const testCases = ['broker-1', 'broker-2', 'invalid-broker', ''];
  
  for (const slug of testCases) {
    console.log(`\n🧪 Testing with slug: "${slug}"`);
    try {
      const mockRequest = new MockRequest(`http://localhost:3000/api/og/broker?slug=${slug}`);
      const response = await handler(mockRequest);
      console.log(`  ✅ Status: ${response.status} - ${response.statusText}`);
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

// Run the tests
console.log('🎯 Starting OG Image Handler Tests\n');
testRealOGHandler()
  .then(() => {
    console.log('\n🔄 Testing multiple broker scenarios...');
    return testMultipleBrokers();
  })
  .then(() => {
    console.log('\n🏁 All tests completed!');
  })
  .catch(error => {
    console.error('💥 Test suite failed:', error);
  });