import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'Present' : 'Missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupSchema() {
  try {
    console.log('🚀 Setting up Supabase schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📄 Schema file loaded, length:', schemaContent.length, 'characters');
    
    // Split the schema into individual statements
    const statements = schemaContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      .filter(stmt => !stmt.match(/^\s*$/));
    
    console.log('📝 Found', statements.length, 'SQL statements to execute');
    
    // Execute each statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim().length === 0) {
        continue;
      }
      
      try {
        console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);
        console.log('Statement preview:', statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));
        
        const { data, error } = await supabase.rpc('exec_sql', {
          sql: statement + ';'
        });
        
        if (error) {
          // Try direct execution if RPC fails
          const { data: directData, error: directError } = await supabase
            .from('_temp_')
            .select('*')
            .limit(0);
          
          if (directError && directError.message.includes('relation "_temp_" does not exist')) {
            // This means we can't execute raw SQL with the current key
            console.log('⚠️  Cannot execute raw SQL with current API key');
            console.log('   Statement:', statement.substring(0, 200) + '...');
            console.log('   Please run this manually in Supabase SQL Editor');
          } else {
            throw error;
          }
        } else {
          console.log('✅ Statement executed successfully');
          successCount++;
        }
        
      } catch (err) {
        console.error('❌ Error executing statement:', err.message);
        console.error('   Statement:', statement.substring(0, 200) + '...');
        errorCount++;
        
        // Continue with next statement instead of failing completely
        continue;
      }
    }
    
    console.log('\n🎉 Schema setup completed!');
    console.log('✅ Successful statements:', successCount);
    console.log('❌ Failed statements:', errorCount);
    
    if (errorCount > 0) {
      console.log('\n⚠️  Some statements failed. Please run the failed statements manually in Supabase SQL Editor.');
      console.log('   You can find the complete schema in: supabase-schema.sql');
    }
    
    // Test the tables
    console.log('\n🔍 Testing table creation...');
    await testTables();
    
  } catch (error) {
    console.error('💥 Fatal error setting up schema:', error);
    process.exit(1);
  }
}

async function testTables() {
  const tablesToTest = ['brokers', 'broker_features', 'locales', 'broker_i18n'];
  
  for (const table of tablesToTest) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table '${table}' not accessible:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists and accessible`);
      }
    } catch (err) {
      console.log(`❌ Table '${table}' test failed:`, err.message);
    }
  }
}

// Alternative: Create tables individually
async function createTablesIndividually() {
  console.log('\n🔧 Creating tables individually...');
  
  const tables = {
    locales: `
      CREATE TABLE IF NOT EXISTS locales (
        code VARCHAR(5) PRIMARY KEY,
        label TEXT NOT NULL,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      INSERT INTO locales (code, label) VALUES 
        ('en', 'English'),
        ('es', 'Español'),
        ('pt', 'Português'),
        ('fr', 'Français'),
        ('de', 'Deutsch')
      ON CONFLICT (code) DO NOTHING;
    `,
    
    broker_details: `
      CREATE TABLE IF NOT EXISTS broker_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        founded_year INTEGER,
        headquarters TEXT,
        base_currency TEXT,
        avg_rating NUMERIC(2,1) CHECK (avg_rating >= 0 AND avg_rating <= 5),
        logo_url TEXT,
        status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      
      CREATE INDEX IF NOT EXISTS idx_broker_details_slug ON broker_details(slug);
    `
  };
  
  for (const [tableName, sql] of Object.entries(tables)) {
    try {
      console.log(`Creating table: ${tableName}`);
      
      // Since we can't execute raw SQL, let's try to create via the REST API
      // This is a workaround - ideally this should be done in Supabase SQL Editor
      console.log(`⚠️  Please create table '${tableName}' manually in Supabase SQL Editor:`);
      console.log(sql);
      console.log('\n' + '='.repeat(80) + '\n');
      
    } catch (error) {
      console.error(`Error creating table ${tableName}:`, error.message);
    }
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  setupSchema().then(() => {
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of supabase-schema.sql');
    console.log('4. Execute the script');
    console.log('5. Verify tables are created');
    
    createTablesIndividually();
  });
}

export { setupSchema, testTables };