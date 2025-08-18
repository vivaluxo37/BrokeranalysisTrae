// Test script for OG image generation
const { handler } = require('./api/og/broker.ts');

// Mock request for testing
const mockRequest = {
  url: 'http://localhost:3000/api/og/broker?slug=broker-1',
  method: 'GET'
};

// Test the handler
async function testOGImage() {
  try {
    console.log('Testing OG image generation for broker-1...');
    const response = await handler(mockRequest);
    
    if (response.status === 200) {
      console.log('✅ OG image generated successfully!');
      console.log('Response headers:', response.headers);
      console.log('Content-Type:', response.headers.get('Content-Type'));
    } else {
      console.log('❌ Error generating OG image');
      console.log('Status:', response.status);
      console.log('Response:', await response.text());
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testOGImage();