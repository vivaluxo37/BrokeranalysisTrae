import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://diykotyhjwcwdscozltq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  console.log('🔍 Checking brokers table structure...');
  
  try {
    // Try to insert a test record to see what happens
    console.log('\n🧪 Testing insert with minimal data...');
    
    const testBroker = {
      name: 'Test Broker',
      logo_url: 'https://example.com/logo.png',
      rating: 4.5,
      review_count: 0,
      features: {},
      fees: {},
      regulation: {},
      is_active: true
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('brokers')
      .insert(testBroker)
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError);
      
      // Try without some fields
      console.log('\n🧪 Testing with even simpler data...');
      const simpleBroker = {
        name: 'Simple Test Broker'
      };
      
      const { data: simpleResult, error: simpleError } = await supabase
        .from('brokers')
        .insert(simpleBroker)
        .select()
        .single();
      
      if (simpleError) {
        console.log('❌ Simple insert also failed:', simpleError);
      } else {
        console.log('✅ Simple insert succeeded:', simpleResult);
        
        // Clean up
        await supabase
          .from('brokers')
          .delete()
          .eq('id', simpleResult.id);
        
        console.log('🧹 Cleaned up test record');
      }
    } else {
      console.log('✅ Insert test succeeded:', insertResult);
      
      // Clean up
      await supabase
        .from('brokers')
        .delete()
        .eq('id', insertResult.id);
      
      console.log('🧹 Cleaned up test record');
    }
    
    // Check existing records to understand the structure
    console.log('\n📊 Checking existing records...');
    const { data: existingBrokers, error: selectError } = await supabase
      .from('brokers')
      .select('*')
      .limit(3);
    
    if (selectError) {
      console.log('❌ Error selecting existing records:', selectError);
    } else {
      console.log(`✅ Found ${existingBrokers.length} existing records`);
      if (existingBrokers.length > 0) {
        console.log('📋 Sample record structure:');
        const sample = existingBrokers[0];
        Object.keys(sample).forEach(key => {
          console.log(`   ${key}: ${typeof sample[key]} = ${JSON.stringify(sample[key]).substring(0, 100)}`);
        });
      }
    }
    
    // Try to understand the ID generation
    console.log('\n🔍 Checking ID generation...');
    
    // Check if there's a sequence for the ID
    const { data: sequences, error: seqError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT column_name, column_default, is_nullable, data_type
          FROM information_schema.columns 
          WHERE table_name = 'brokers' 
          AND table_schema = 'public'
          ORDER BY ordinal_position;
        `
      });
    
    if (seqError) {
      console.log('⚠️ Could not query column info via RPC:', seqError.message);
    } else {
      console.log('📋 Column information:', sequences);
    }
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error);
  }
}

// Run the check
checkTableStructure().catch(console.error);