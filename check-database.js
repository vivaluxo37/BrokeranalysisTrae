import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function checkDatabase() {
  console.log('🔍 Checking database contents...');
  
  try {
    // Get all records
    const { data, error } = await supabase
      .from('crawled_pages')
      .select('url, data, meta, status')
      .order('fetched_at', { ascending: false });
      
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    
    console.log(`\n📊 Total records in database: ${data.length}`);
    
    if (data.length === 0) {
      console.log('\n⚠️  No data found in database');
      return;
    }
    
    console.log('\n📋 Records breakdown:');
    data.forEach((record, index) => {
      console.log(`${index + 1}. ${record.url}`);
      console.log(`   Broker: ${record.data?.reviewData?.brokerName || 'Unknown'}`);
      console.log(`   Language: ${record.meta?.language || 'Unknown'}`);
      console.log(`   Status: ${record.status}`);
      console.log('');
    });
    
    // Count by broker
    const brokerCounts = {};
    data.forEach(record => {
      const broker = record.data?.reviewData?.brokerName || 'Unknown';
      brokerCounts[broker] = (brokerCounts[broker] || 0) + 1;
    });
    
    console.log('\n🏢 Brokers in database:');
    Object.entries(brokerCounts).forEach(([broker, count]) => {
      console.log(`   ${broker}: ${count} records`);
    });
    
  } catch (error) {
    console.error('❌ Database check failed:', error.message);
  }
}

checkDatabase();