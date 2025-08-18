import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// Essential SQL for creating the crawled_pages table
const createTableSQL = `
-- Create crawled_pages table
CREATE TABLE IF NOT EXISTS crawled_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL UNIQUE,
    status INTEGER NOT NULL DEFAULT 200,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sha256 TEXT NOT NULL,
    html TEXT,
    text_content TEXT,
    meta JSONB,
    data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create essential indexes
CREATE INDEX IF NOT EXISTS idx_crawled_pages_url ON crawled_pages(url);
CREATE INDEX IF NOT EXISTS idx_crawled_pages_status ON crawled_pages(status);
CREATE INDEX IF NOT EXISTS idx_crawled_pages_fetched_at ON crawled_pages(fetched_at DESC);
CREATE INDEX IF NOT EXISTS idx_crawled_pages_sha256 ON crawled_pages(sha256);
CREATE INDEX IF NOT EXISTS idx_crawled_pages_data_gin ON crawled_pages USING GIN(data);
`;

async function createCrawledPagesTable() {
    try {
        console.log('🚀 Starting table creation process...');
        console.log('📊 Supabase URL:', supabaseUrl);
        
        // Method 1: Try to create table using direct SQL execution
        console.log('\n📝 Method 1: Attempting direct SQL execution...');
        
        try {
            // Try using the REST API directly
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseServiceKey}`,
                    'apikey': supabaseServiceKey
                },
                body: JSON.stringify({
                    sql: createTableSQL
                })
            });
            
            if (response.ok) {
                console.log('✅ Table created successfully via REST API!');
                await verifyTable();
                return;
            } else {
                console.log('⚠️  REST API method failed, trying alternative...');
            }
        } catch (error) {
            console.log('⚠️  REST API method failed:', error.message);
        }
        
        // Method 2: Try using Supabase client RPC
        console.log('\n📝 Method 2: Attempting Supabase client RPC...');
        
        try {
            const { data, error } = await supabase.rpc('exec_sql', {
                sql: createTableSQL
            });
            
            if (!error) {
                console.log('✅ Table created successfully via Supabase RPC!');
                await verifyTable();
                return;
            } else {
                console.log('⚠️  Supabase RPC method failed:', error.message);
            }
        } catch (error) {
            console.log('⚠️  Supabase RPC method failed:', error.message);
        }
        
        // Method 3: Manual instructions
        console.log('\n📝 Method 3: Manual execution required');
        console.log('\n' + '='.repeat(80));
        console.log('🔧 MANUAL SETUP REQUIRED');
        console.log('='.repeat(80));
        console.log('\nPlease follow these steps to create the table manually:');
        console.log('\n1. Go to: https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql');
        console.log('2. Copy and paste the following SQL:');
        console.log('\n' + '-'.repeat(40));
        console.log(createTableSQL);
        console.log('-'.repeat(40));
        console.log('\n3. Click "Run" to execute the SQL');
        console.log('4. Verify the table was created in the Table Editor');
        console.log('\n' + '='.repeat(80));
        
        // Still try to verify if table exists
        await verifyTable();
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

async function verifyTable() {
    try {
        console.log('\n🔍 Verifying table creation...');
        
        // Try to query the table
        const { data, error, count } = await supabase
            .from('crawled_pages')
            .select('*', { count: 'exact', head: true });
            
        if (error) {
            if (error.message.includes('does not exist') || error.message.includes('schema cache')) {
                console.log('❌ Table not found in schema cache');
                console.log('💡 This usually means the table needs to be created manually');
                console.log('📋 Please use the SQL provided above in the Supabase SQL Editor');
                return false;
            } else {
                console.log('⚠️  Verification error:', error.message);
                return false;
            }
        } else {
            console.log('✅ Table verified successfully!');
            console.log(`📊 Current row count: ${count || 0}`);
            return true;
        }
        
    } catch (error) {
        console.log('⚠️  Verification failed:', error.message);
        return false;
    }
}

async function testCrawler() {
    console.log('\n🧪 Testing crawler with the new table...');
    
    try {
        // Import and run a simple test
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        
        console.log('🏃 Running crawler test...');
        const { stdout, stderr } = await execAsync('node crawl.js --max-urls=1 --debug');
        
        if (stderr) {
            console.log('⚠️  Crawler stderr:', stderr);
        }
        
        console.log('✅ Crawler test completed');
        
        // Verify data was inserted
        const { data, error, count } = await supabase
            .from('crawled_pages')
            .select('*', { count: 'exact' });
            
        if (!error && count > 0) {
            console.log(`🎉 SUCCESS! Crawler saved ${count} page(s) to the database`);
            console.log('📄 Sample data:', data[0]);
        } else if (!error && count === 0) {
            console.log('ℹ️  Crawler ran but no data was saved (this might be normal)');
        } else {
            console.log('⚠️  Could not verify crawler data:', error?.message);
        }
        
    } catch (error) {
        console.log('⚠️  Crawler test failed:', error.message);
    }
}

// Main execution
async function main() {
    console.log('🎯 BrokerAnalysis Database Setup');
    console.log('================================\n');
    
    const tableExists = await verifyTable();
    
    if (!tableExists) {
        await createCrawledPagesTable();
    } else {
        console.log('✅ Table already exists and is accessible!');
    }
    
    // Test the crawler
    await testCrawler();
    
    console.log('\n🏁 Setup process completed!');
    console.log('\nNext steps:');
    console.log('1. Run the crawler: node crawl.js --max-urls=5');
    console.log('2. Check the Supabase dashboard for saved data');
    console.log('3. Start building your broker analysis features!');
}

// Run the setup
main().catch(console.error);