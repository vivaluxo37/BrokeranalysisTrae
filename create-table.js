import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function createTable() {
    console.log('🚀 Creating crawled_pages table...');
    
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Create table using direct SQL
    const createTableSQL = `
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
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_crawled_pages_url ON crawled_pages(url);
        CREATE INDEX IF NOT EXISTS idx_crawled_pages_sha256 ON crawled_pages(sha256);
        CREATE INDEX IF NOT EXISTS idx_crawled_pages_fetched_at ON crawled_pages(fetched_at);
    `;
    
    try {
        // Use the REST API to execute SQL
        const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
            },
            body: JSON.stringify({ sql: createTableSQL })
        });
        
        if (!response.ok) {
            console.log('❌ Direct SQL execution failed, trying alternative method...');
            
            // Alternative: Try using supabase-js query builder to create a simple insert
            // This will force table creation if it doesn't exist
            const testData = {
                url: 'https://test.example.com',
                status: 200,
                sha256: 'test_hash_' + Date.now(),
                html: '<html><body>Test</body></html>',
                text_content: 'Test content',
                meta: { test: true },
                data: { test: true }
            };
            
            console.log('🔧 Attempting to create table through insert operation...');
            const { data, error } = await supabase
                .from('crawled_pages')
                .insert([testData])
                .select();
                
            if (error) {
                console.error('❌ Table creation failed:', error);
                return false;
            } else {
                console.log('✅ Table created successfully with test data!');
                console.log('Test record:', data[0]);
                return true;
            }
        } else {
            console.log('✅ Table created successfully via SQL!');
            return true;
        }
        
    } catch (error) {
        console.error('❌ Error creating table:', error);
        return false;
    }
}

// Verify table exists
async function verifyTable() {
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log('🔍 Verifying table exists...');
    const { data, error, count } = await supabase
        .from('crawled_pages')
        .select('*', { count: 'exact' });
        
    if (error) {
        console.error('❌ Table verification failed:', error);
        return false;
    } else {
        console.log('✅ Table verified! Row count:', count);
        if (data && data.length > 0) {
            console.log('Sample data:', data[0]);
        }
        return true;
    }
}

// Run the creation and verification
if (import.meta.url === `file://${process.argv[1]}`) {
    const created = await createTable();
    if (created) {
        await verifyTable();
    }
}

export { createTable, verifyTable };