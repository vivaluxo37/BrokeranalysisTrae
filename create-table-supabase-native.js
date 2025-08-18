import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createTableNatively() {
    console.log('🎯 Creating crawled_pages table using Supabase native methods');
    console.log('================================================================\n');
    
    try {
        // First, let's try to drop the table if it exists to start fresh
        console.log('🧹 Cleaning up existing table...');
        
        const dropSQL = `DROP TABLE IF EXISTS crawled_pages CASCADE;`;
        
        try {
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseServiceKey}`,
                    'apikey': supabaseServiceKey
                },
                body: JSON.stringify({ sql: dropSQL })
            });
            
            if (response.ok) {
                console.log('✅ Existing table dropped successfully');
            } else {
                console.log('ℹ️  No existing table to drop or drop failed');
            }
        } catch (error) {
            console.log('ℹ️  Drop operation skipped:', error.message);
        }
        
        // Now create the table using a simpler approach
        console.log('\n🏗️  Creating new table...');
        
        const createSQL = `
        CREATE TABLE crawled_pages (
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
        
        -- Create indexes
        CREATE INDEX idx_crawled_pages_url ON crawled_pages(url);
        CREATE INDEX idx_crawled_pages_status ON crawled_pages(status);
        CREATE INDEX idx_crawled_pages_fetched_at ON crawled_pages(fetched_at DESC);
        CREATE INDEX idx_crawled_pages_sha256 ON crawled_pages(sha256);
        CREATE INDEX idx_crawled_pages_data_gin ON crawled_pages USING GIN(data);
        
        -- Create update trigger
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
        
        CREATE TRIGGER update_crawled_pages_updated_at
            BEFORE UPDATE ON crawled_pages
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        `;
        
        // Try multiple methods to execute the SQL
        let success = false;
        
        // Method 1: Direct REST API call
        try {
            console.log('📝 Attempting REST API method...');
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseServiceKey}`,
                    'apikey': supabaseServiceKey
                },
                body: JSON.stringify({ sql: createSQL })
            });
            
            if (response.ok) {
                console.log('✅ Table created via REST API!');
                success = true;
            } else {
                const errorText = await response.text();
                console.log('⚠️  REST API failed:', errorText);
            }
        } catch (error) {
            console.log('⚠️  REST API method failed:', error.message);
        }
        
        // Method 2: Supabase RPC if REST failed
        if (!success) {
            try {
                console.log('📝 Attempting Supabase RPC method...');
                const { data, error } = await supabase.rpc('exec_sql', {
                    sql: createSQL
                });
                
                if (!error) {
                    console.log('✅ Table created via Supabase RPC!');
                    success = true;
                } else {
                    console.log('⚠️  Supabase RPC failed:', error.message);
                }
            } catch (error) {
                console.log('⚠️  Supabase RPC method failed:', error.message);
            }
        }
        
        // Wait a moment for schema to propagate
        if (success) {
            console.log('\n⏳ Waiting for schema to propagate...');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
        
        // Test the table
        console.log('\n🧪 Testing table access...');
        
        // Test insert
        const testData = {
            url: 'https://test-broker-final-' + Date.now() + '.com',
            status: 200,
            sha256: 'test-hash-final-' + Date.now(),
            html: '<html><body>Final Test</body></html>',
            text_content: 'Final test content',
            meta: { title: 'Final Test Page' },
            data: { test: true, final: true }
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('crawled_pages')
            .insert(testData)
            .select();
            
        if (insertError) {
            console.log('❌ Insert test failed:', insertError.message);
            
            // Provide manual instructions
            console.log('\n' + '='.repeat(80));
            console.log('🔧 MANUAL SETUP REQUIRED');
            console.log('='.repeat(80));
            console.log('\nPlease create the table manually:');
            console.log('\n1. Go to: https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql');
            console.log('2. Copy and paste this SQL:');
            console.log('\n' + '-'.repeat(40));
            console.log(createSQL);
            console.log('-'.repeat(40));
            console.log('\n3. Click "Run" to execute');
            console.log('4. Verify in Table Editor');
            console.log('\n' + '='.repeat(80));
        } else {
            console.log('✅ Insert test successful!');
            console.log('📊 Inserted data:', insertData[0]);
            
            // Test count
            const { count, error: countError } = await supabase
                .from('crawled_pages')
                .select('*', { count: 'exact', head: true });
                
            if (!countError) {
                console.log('📊 Total rows:', count);
            }
            
            console.log('\n🎉 SUCCESS! Table is fully functional!');
            console.log('\n✅ Next steps:');
            console.log('1. Run: node crawl.js --max-urls=5');
            console.log('2. Check Supabase dashboard for data');
            console.log('3. Start building broker analysis features!');
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

// Run the creation
createTableNatively().catch(console.error);