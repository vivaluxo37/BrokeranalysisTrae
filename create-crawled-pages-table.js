// Create crawled_pages table in Supabase
// This script executes the SQL to create the table for web crawling data

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

async function createCrawledPagesTable() {
  console.log('🔧 Creating crawled_pages table in Supabase...');
  
  try {
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log('✅ Supabase client created with service role');
    
    // SQL to create the crawled_pages table
    const createTableSQL = `
      create table if not exists crawled_pages (
        id uuid primary key default gen_random_uuid(),
        url text unique not null,
        status int,
        fetched_at timestamptz default now(),
        sha256 text,
        html text,
        text_content text,
        meta jsonb,
        data jsonb
      );
    `;
    
    // Execute the table creation
    const { data: tableResult, error: tableError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    });
    
    if (tableError) {
      // Try alternative method using direct SQL execution
      console.log('⚠️  RPC method failed, trying direct SQL execution...');
      
      const { data, error } = await supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        console.log('✅ Database connection confirmed, executing SQL manually...');
        
        // Since we can't execute arbitrary SQL directly through the client,
        // we'll provide the SQL for manual execution
        console.log('\n📋 Please execute the following SQL in your Supabase SQL Editor:');
        console.log('\n' + '='.repeat(60));
        console.log(createTableSQL);
        console.log('\n-- Create helpful index for JSON queries');
        console.log('create index if not exists crawled_pages_data_idx on crawled_pages using gin (data);');
        console.log('='.repeat(60));
        
        console.log('\n🔗 Access your Supabase SQL Editor at:');
        console.log(`   ${process.env.SUPABASE_URL.replace('.supabase.co', '')}.supabase.co/project/${process.env.SUPABASE_PROJECT_REF}/sql`);
        
        return;
      }
    } else {
      console.log('✅ Table creation executed successfully');
    }
    
    // Create the index
    const createIndexSQL = `
      create index if not exists crawled_pages_data_idx on crawled_pages using gin (data);
    `;
    
    console.log('🔧 Creating GIN index for JSON queries...');
    
    // Note: Since we can't execute arbitrary SQL through the client,
    // we'll provide instructions for manual execution
    console.log('\n📋 SQL Commands to Execute in Supabase SQL Editor:');
    console.log('\n' + '='.repeat(60));
    console.log('-- Create crawled_pages table');
    console.log(createTableSQL);
    console.log('\n-- Create helpful index for JSON queries');
    console.log(createIndexSQL);
    console.log('='.repeat(60));
    
    console.log('\n🔗 Access your Supabase SQL Editor at:');
    console.log(`   https://supabase.com/dashboard/project/${process.env.SUPABASE_PROJECT_REF}/sql/new`);
    
    console.log('\n✅ SQL commands prepared for execution!');
    console.log('\n📝 Table Structure:');
    console.log('   - id: UUID primary key (auto-generated)');
    console.log('   - url: Unique text field for page URLs');
    console.log('   - status: HTTP status code');
    console.log('   - fetched_at: Timestamp (defaults to now)');
    console.log('   - sha256: Content hash for deduplication');
    console.log('   - html: Raw HTML content');
    console.log('   - text_content: Extracted text content');
    console.log('   - meta: JSONB for metadata');
    console.log('   - data: JSONB for extracted data');
    console.log('   - GIN index on data column for efficient JSON queries');
    
  } catch (error) {
    console.error('❌ Error creating crawled_pages table:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Verify SUPABASE_SERVICE_ROLE_KEY is correct');
    console.error('   2. Check if project is active and accessible');
    console.error('   3. Ensure you have admin privileges');
    console.error('   4. Try executing SQL manually in Supabase dashboard');
  }
}

// Run the table creation
createCrawledPagesTable().catch(console.error);