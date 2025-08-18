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

async function inspectSchema() {
  console.log('🔍 Inspecting Supabase database schema...');
  
  try {
    // Check if brokers table exists and get its structure
    const { data: tables, error: tablesError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_type = 'BASE TABLE'
          ORDER BY table_name;
        `
      });
    
    if (tablesError) {
      console.log('⚠️ Could not query tables using RPC, trying direct query...');
      
      // Try a simpler approach - just try to select from brokers table
      const { data: brokersTest, error: brokersError } = await supabase
        .from('brokers')
        .select('*')
        .limit(1);
      
      if (brokersError) {
        console.log('❌ Brokers table does not exist or is not accessible:');
        console.log(brokersError);
        
        // Check what tables we can access
        console.log('\n🔍 Checking accessible tables...');
        const tableNames = ['brokers', 'broker_features', 'broker_regulation', 'reviews', 'users'];
        
        for (const tableName of tableNames) {
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .limit(1);
          
          if (error) {
            console.log(`❌ Table '${tableName}': ${error.message}`);
          } else {
            console.log(`✅ Table '${tableName}': accessible (${data.length} records found)`);
            if (data.length > 0) {
              console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);
            }
          }
        }
      } else {
        console.log('✅ Brokers table exists and is accessible');
        if (brokersTest.length > 0) {
          console.log(`📊 Current brokers table structure:`);
          console.log(`   Columns: ${Object.keys(brokersTest[0]).join(', ')}`);
          console.log(`   Sample record:`, brokersTest[0]);
        } else {
          console.log('📊 Brokers table is empty');
        }
      }
    } else {
      console.log('✅ Successfully queried database schema');
      console.log('📋 Available tables:', tables);
    }
    
    // Try to get column information for brokers table specifically
    console.log('\n🔍 Checking brokers table columns...');
    const { data: columns, error: columnsError } = await supabase
      .rpc('exec', {
        sql: `
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'brokers'
          ORDER BY ordinal_position;
        `
      });
    
    if (columnsError) {
      console.log('⚠️ Could not query column information:', columnsError.message);
    } else {
      console.log('📋 Brokers table columns:', columns);
    }
    
  } catch (error) {
    console.error('❌ Error inspecting schema:', error);
  }
}

// Run the inspection
inspectSchema().catch(console.error);