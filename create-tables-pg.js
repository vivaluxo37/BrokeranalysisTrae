import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// Extract database connection details from Supabase URL
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

// Parse the Supabase URL to get connection details
const url = new URL(supabaseUrl);
const projectRef = url.hostname.split('.')[0];

// Supabase connection configuration
const dbConfig = {
  host: `aws-1-ap-southeast-1.pooler.supabase.com`,
  port: 5432,
  database: 'postgres',
  user: `postgres.${projectRef}`,
  password: serviceRoleKey, // Using service role key as password
  ssl: {
    rejectUnauthorized: false
  }
};

async function createTables() {
  const client = new Client(dbConfig);
  
  try {
    console.log('🔌 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    // Read the migration SQL file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20240115000000_create_i18n_tables.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      return;
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 Migration SQL loaded successfully');
    
    // Execute the migration
    console.log('🚀 Executing migration...');
    await client.query(migrationSQL);
    console.log('✅ Migration executed successfully!');
    
    // Verify tables were created
    console.log('🔍 Verifying table creation...');
    
    const localesResult = await client.query('SELECT COUNT(*) FROM public.locales');
    const pagesResult = await client.query('SELECT COUNT(*) FROM public.pages_i18n');
    
    console.log(`✅ Locales table created with ${localesResult.rows[0].count} records`);
    console.log(`✅ Pages_i18n table created with ${pagesResult.rows[0].count} records`);
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Refresh your browser to test the 404 fix');
    console.log('2. Check the browser console for any remaining errors');
    console.log('3. Verify that i18n functionality is working');
    
  } catch (error) {
    console.error('❌ Database operation failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\n💡 Authentication failed. This might be because:');
      console.log('1. The service role key is not valid for direct database connections');
      console.log('2. Supabase requires different credentials for direct PostgreSQL access');
      console.log('\n📋 Alternative solution:');
      console.log('Please execute the SQL commands manually in your Supabase Dashboard:');
      console.log('1. Go to https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql');
      console.log('2. Copy and paste the contents of MANUAL_SQL_SETUP.sql');
      console.log('3. Click "Run" to execute the commands');
    }
  } finally {
    await client.end();
    console.log('🔌 Database connection closed');
  }
}

// Alternative approach using connection string
async function createTablesWithConnectionString() {
  console.log('🔄 Trying alternative connection method...');
  
  // Try different connection approaches
  const connectionConfigs = [
    {
      connectionString: `postgresql://postgres.${projectRef}:${serviceRoleKey}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
      ssl: { rejectUnauthorized: false }
    },
    {
      connectionString: `postgresql://postgres:${serviceRoleKey}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`,
      ssl: { rejectUnauthorized: false }
    }
  ];
  
  for (let i = 0; i < connectionConfigs.length; i++) {
    const client = new Client(connectionConfigs[i]);
    
    try {
      console.log(`🔌 Attempting connection method ${i + 1}...`);
      await client.connect();
      console.log('✅ Connected successfully!');
      
      // Read and execute migration
      const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20240115000000_create_i18n_tables.sql');
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      await client.query(migrationSQL);
      console.log('✅ Migration executed successfully!');
      
      await client.end();
      return true;
      
    } catch (error) {
      console.log(`❌ Connection method ${i + 1} failed:`, error.message);
      await client.end();
    }
  }
  
  return false;
}

// Run the table creation
createTablesWithConnectionString().then(success => {
  if (!success) {
    console.log('\n📋 All connection methods failed.');
    console.log('Please execute the SQL manually in Supabase Dashboard:');
    console.log('https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql');
  }
}).catch(error => {
  console.error('❌ Unexpected error:', error);
});