import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

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

async function applySchema() {
  console.log('🔧 Applying database schema...');
  
  try {
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Schema file loaded successfully');
    
    // Split the schema into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement individually
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim().length === 0) {
        continue;
      }
      
      console.log(`\n🔄 Executing statement ${i + 1}/${statements.length}:`);
      console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));
      
      try {
        // For CREATE TABLE statements, we'll use a different approach
        if (statement.toUpperCase().includes('CREATE TABLE')) {
          // Extract table name
          const tableMatch = statement.match(/CREATE TABLE\s+(\w+)/i);
          const tableName = tableMatch ? tableMatch[1] : 'unknown';
          
          console.log(`   Creating table: ${tableName}`);
          
          // Try to execute the statement directly
          const { data, error } = await supabase.rpc('exec', { sql: statement });
          
          if (error) {
            if (error.message.includes('already exists')) {
              console.log(`   ⚠️ Table ${tableName} already exists, skipping...`);
            } else {
              console.log(`   ❌ Error creating table ${tableName}:`, error.message);
              errorCount++;
            }
          } else {
            console.log(`   ✅ Table ${tableName} created successfully`);
            successCount++;
          }
        } else {
          // For other statements (indexes, etc.)
          const { data, error } = await supabase.rpc('exec', { sql: statement });
          
          if (error) {
            if (error.message.includes('already exists') || error.message.includes('does not exist')) {
              console.log(`   ⚠️ Statement skipped (already exists or dependency issue):`, error.message);
            } else {
              console.log(`   ❌ Error:`, error.message);
              errorCount++;
            }
          } else {
            console.log(`   ✅ Statement executed successfully`);
            successCount++;
          }
        }
      } catch (err) {
        console.log(`   ❌ Exception:`, err.message);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Schema application completed:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    // Verify the schema was applied correctly
    console.log('\n🔍 Verifying schema application...');
    
    const { data: brokersTest, error: brokersError } = await supabase
      .from('brokers')
      .select('*')
      .limit(1);
    
    if (brokersError) {
      console.log('❌ Brokers table verification failed:', brokersError.message);
    } else {
      console.log('✅ Brokers table is accessible');
      if (brokersTest.length > 0) {
        console.log(`📋 Current columns: ${Object.keys(brokersTest[0]).join(', ')}`);
      }
    }
    
    // Check for broker_features table
    const { data: featuresTest, error: featuresError } = await supabase
      .from('broker_features')
      .select('*')
      .limit(1);
    
    if (featuresError) {
      console.log('❌ broker_features table not accessible:', featuresError.message);
    } else {
      console.log('✅ broker_features table is accessible');
    }
    
    // Check for broker_regulation table
    const { data: regulationTest, error: regulationError } = await supabase
      .from('broker_regulation')
      .select('*')
      .limit(1);
    
    if (regulationError) {
      console.log('❌ broker_regulation table not accessible:', regulationError.message);
    } else {
      console.log('✅ broker_regulation table is accessible');
    }
    
  } catch (error) {
    console.error('❌ Error applying schema:', error);
  }
}

// Run the schema application
applySchema().catch(console.error);