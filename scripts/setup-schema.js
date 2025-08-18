import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupSchema() {
  try {
    console.log('🔧 Setting up Supabase database schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    console.log('📄 Reading schema from:', schemaPath);
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }
    
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    console.log('📊 Schema file loaded successfully');
    
    // Split the SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔨 Executing ${statements.length} SQL statements...`);
    
    // Execute each statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        console.log(`⚡ Executing statement ${i + 1}/${statements.length}`);
        
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        });
        
        if (error) {
          // Try direct execution if RPC fails
          const { error: directError } = await supabase
            .from('_temp_schema_setup')
            .select('*')
            .limit(0);
          
          // If table doesn't exist, create it and try again
          if (directError && directError.message.includes('does not exist')) {
            console.log('📝 Creating temporary setup function...');
            
            // Create a function to execute SQL
            const createFunctionSQL = `
              CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
              RETURNS void
              LANGUAGE plpgsql
              SECURITY DEFINER
              AS $$
              BEGIN
                EXECUTE sql_query;
              END;
              $$;
            `;
            
            const { error: funcError } = await supabase.rpc('exec_sql', {
              sql_query: createFunctionSQL
            });
            
            if (funcError) {
              console.log('⚠️ Could not create exec function, trying direct execution...');
              // For basic statements, we can try to execute them directly
              if (statement.toUpperCase().startsWith('CREATE TABLE') || 
                  statement.toUpperCase().startsWith('CREATE INDEX') ||
                  statement.toUpperCase().startsWith('INSERT INTO')) {
                console.log(`⚠️ Skipping statement (requires admin privileges): ${statement.substring(0, 50)}...`);
                continue;
              }
            }
          }
          
          if (error && !error.message.includes('already exists')) {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.error(`Statement: ${statement.substring(0, 100)}...`);
            errorCount++;
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
            successCount++;
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error executing statement ${i + 1}:`, err.message);
        console.error(`Statement: ${statement.substring(0, 100)}...`);
        errorCount++;
      }
    }
    
    console.log('\n📈 Schema Setup Summary:');
    console.log(`✅ Successfully executed: ${successCount} statements`);
    console.log(`❌ Failed executions: ${errorCount} statements`);
    console.log(`📊 Total processed: ${statements.length} statements`);
    
    // Verify that key tables exist
    console.log('\n🔍 Verifying table creation...');
    
    const tables = ['brokers', 'broker_features', 'broker_regulation', 'reviews', 'locales'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table '${table}' not accessible:`, error.message);
        } else {
          console.log(`✅ Table '${table}' exists and is accessible`);
        }
      } catch (err) {
        console.log(`❌ Error checking table '${table}':`, err.message);
      }
    }
    
    if (errorCount === 0) {
      console.log('\n🎉 Schema setup completed successfully!');
      console.log('✨ You can now run the broker data import script.');
    } else {
      console.log('\n⚠️ Schema setup completed with some errors.');
      console.log('🔧 Please check the errors above and manually create any missing tables if needed.');
    }
    
  } catch (error) {
    console.error('💥 Schema setup failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the schema setup
if (process.argv[1] && process.argv[1].includes('setup-schema.js')) {
  console.log('🚀 Starting Supabase schema setup...');
  setupSchema().catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
}

export { setupSchema };