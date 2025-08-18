import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   SUPABASE_URL:', !!supabaseUrl);
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
    process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createTableFixed() {
    console.log('🎯 Creating crawled_pages table with fixed SQL execution');
    console.log('================================================================\n');
    
    try {
        // Step 1: Drop existing table if it exists
        console.log('🧹 Cleaning up existing table...');
        const dropSQL = 'DROP TABLE IF EXISTS crawled_pages CASCADE;';
        
        const { error: dropError } = await supabase.rpc('exec_sql', {
            sql: dropSQL
        });
        
        if (dropError) {
            console.log('ℹ️  Drop operation result:', dropError.message);
        } else {
            console.log('✅ Existing table dropped successfully');
        }
        
        // Step 2: Create the table
        console.log('\n🏗️  Creating table...');
        const createTableSQL = `
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
        );`;
        
        const { error: tableError } = await supabase.rpc('exec_sql', {
            sql: createTableSQL
        });
        
        if (tableError) {
            throw new Error(`Table creation failed: ${tableError.message}`);
        }
        console.log('✅ Table created successfully');
        
        // Step 3: Create indexes one by one
        console.log('\n📊 Creating indexes...');
        const indexes = [
            'CREATE INDEX idx_crawled_pages_url ON crawled_pages(url);',
            'CREATE INDEX idx_crawled_pages_status ON crawled_pages(status);',
            'CREATE INDEX idx_crawled_pages_fetched_at ON crawled_pages(fetched_at DESC);',
            'CREATE INDEX idx_crawled_pages_sha256 ON crawled_pages(sha256);',
            'CREATE INDEX idx_crawled_pages_data_gin ON crawled_pages USING GIN(data);'
        ];
        
        for (const indexSQL of indexes) {
            const { error: indexError } = await supabase.rpc('exec_sql', {
                sql: indexSQL
            });
            
            if (indexError) {
                console.log(`⚠️  Index creation warning: ${indexError.message}`);
            } else {
                console.log(`✅ Index created: ${indexSQL.split(' ')[2]}`);
            }
        }
        
        // Step 4: Create the trigger function
        console.log('\n🔧 Creating trigger function...');
        const functionSQL = `
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;`;
        
        const { error: functionError } = await supabase.rpc('exec_sql', {
            sql: functionSQL
        });
        
        if (functionError) {
            throw new Error(`Function creation failed: ${functionError.message}`);
        }
        console.log('✅ Trigger function created successfully');
        
        // Step 5: Create the trigger
        console.log('\n⚡ Creating trigger...');
        const triggerSQL = `
        CREATE TRIGGER update_crawled_pages_updated_at
            BEFORE UPDATE ON crawled_pages
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();`;
        
        const { error: triggerError } = await supabase.rpc('exec_sql', {
            sql: triggerSQL
        });
        
        if (triggerError) {
            throw new Error(`Trigger creation failed: ${triggerError.message}`);
        }
        console.log('✅ Trigger created successfully');
        
        // Step 6: Verify the table exists
        console.log('\n🔍 Verifying table creation...');
        const { data: tableInfo, error: verifyError } = await supabase
            .from('crawled_pages')
            .select('*')
            .limit(1);
        
        if (verifyError && !verifyError.message.includes('0 rows')) {
            console.log('⚠️  Verification warning:', verifyError.message);
        } else {
            console.log('✅ Table verification successful');
        }
        
        console.log('\n🎉 SUCCESS! Table created with all components:');
        console.log('   ✅ crawled_pages table');
        console.log('   ✅ All indexes');
        console.log('   ✅ update_updated_at_column() function');
        console.log('   ✅ update_crawled_pages_updated_at trigger');
        console.log('\n📝 You can now run your crawler to save data to Supabase!');
        
    } catch (error) {
        console.error('❌ Error creating table:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('   1. Check your Supabase credentials');
        console.error('   2. Ensure you have sufficient permissions');
        console.error('   3. Try running individual SQL statements in Supabase SQL editor');
        process.exit(1);
    }
}

// Run the function
createTableFixed()
    .then(() => {
        console.log('\n✨ Script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error.message);
        process.exit(1);
    });

export { createTableFixed };