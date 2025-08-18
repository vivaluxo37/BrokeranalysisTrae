// Simple test server for OG image generation
import express from 'express';
import path from 'path';
import { config } from 'dotenv';
config();

const app = express();
const PORT = 3002;

// Test route that simulates the OG image generation
app.get('/api/og/broker', async (req, res) => {
  try {
    const { slug } = req.query;
    
    if (!slug) {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }

    // Mock broker data for testing
    const mockBroker = {
      id: slug,
      name: slug === 'broker-1' ? 'TradePro Markets' : 'GlobalFX Elite',
      logo_url: 'https://via.placeholder.com/100x100/0066cc/ffffff?text=LOGO',
      rating: 4.8,
      review_count: 2847,
      headquarters: 'London, UK'
    };

    const mockRegulations = [
      { authority: 'FCA', license_number: '123456' },
      { authority: 'CySEC', license_number: '789012' }
    ];

    // For testing, we'll return JSON instead of generating an actual image
    res.json({
      success: true,
      message: 'OG image would be generated for:',
      broker: mockBroker,
      regulations: mockRegulations,
      imageUrl: `/api/og/broker?slug=${slug}`,
      dimensions: '1200x630'
    });

  } catch (error) {
    console.error('Error in OG image generation:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Test endpoint to verify environment variables
app.get('/test/env', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL ? 'Set' : 'Not set',
    supabaseKey: process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Test OG server running on http://localhost:${PORT}`);
  console.log(`📸 Test OG image: http://localhost:${PORT}/api/og/broker?slug=broker-1`);
  console.log(`🔧 Test environment: http://localhost:${PORT}/test/env`);
});