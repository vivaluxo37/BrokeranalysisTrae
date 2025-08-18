import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration');
    console.error('Please ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Create the brokers table according to the schema
 */
async function createBrokersTable() {
    console.log('🚀 Creating brokers table...');
    
    try {
        // Test database connection
        const { data: testData, error: testError } = await supabase
            .from('crawled_pages')
            .select('count')
            .limit(1);
            
        if (testError) {
            throw new Error(`Database connection failed: ${testError.message}`);
        }
        
        console.log('✅ Database connection successful');
        
        // Create brokers table SQL
        const createTableSQL = `
            -- Create brokers table
            CREATE TABLE IF NOT EXISTS brokers (
                id VARCHAR(255) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                logo_url TEXT,
                rating DECIMAL(3,2),
                review_count INTEGER DEFAULT 0,
                features JSONB,
                fees JSONB,
                regulation JSONB,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        
        // Create indexes SQL
        const createIndexesSQL = `
            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_brokers_rating ON brokers(rating DESC);
            CREATE INDEX IF NOT EXISTS idx_brokers_active ON brokers(is_active);
            CREATE INDEX IF NOT EXISTS idx_brokers_name ON brokers(name);
        `;
        
        console.log('📊 Creating brokers table...');
        
        // Execute table creation
        const { data: tableData, error: tableError } = await supabase.rpc('exec_sql', {
            sql: createTableSQL
        });
        
        if (tableError) {
            // Try alternative approach using raw SQL
            console.log('⚠️ RPC method failed, trying direct SQL execution...');
            
            // Note: Supabase client doesn't support direct DDL execution
            // We need to use the SQL editor in Supabase dashboard or use a different approach
            console.log('\n📋 Please execute the following SQL in your Supabase SQL editor:');
            console.log('\n' + createTableSQL);
            console.log('\n' + createIndexesSQL);
            console.log('\n🔗 Go to: https://supabase.com/dashboard/project/[your-project-id]/sql');
            
            return;
        }
        
        console.log('✅ Brokers table created successfully');
        
        console.log('📊 Creating indexes...');
        
        // Execute index creation
        const { data: indexData, error: indexError } = await supabase.rpc('exec_sql', {
            sql: createIndexesSQL
        });
        
        if (indexError) {
            console.log('⚠️ Index creation failed, but table was created. Please create indexes manually:');
            console.log('\n' + createIndexesSQL);
        } else {
            console.log('✅ Indexes created successfully');
        }
        
        // Verify table creation
        const { data: verifyData, error: verifyError } = await supabase
            .from('brokers')
            .select('count')
            .limit(1);
            
        if (verifyError) {
            console.log('❌ Table verification failed:', verifyError.message);
        } else {
            console.log('✅ Brokers table verified and accessible');
        }
        
    } catch (error) {
        console.error('❌ Table creation failed:', error.message);
        
        // Provide manual SQL as fallback
        console.log('\n📋 Manual SQL to execute in Supabase dashboard:');
        console.log(`
-- Create brokers table
CREATE TABLE IF NOT EXISTS brokers (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    features JSONB,
    fees JSONB,
    regulation JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_brokers_rating ON brokers(rating DESC);
CREATE INDEX IF NOT EXISTS idx_brokers_active ON brokers(is_active);
CREATE INDEX IF NOT EXISTS idx_brokers_name ON brokers(name);`);
        
        console.log('\n🔗 Execute this at: https://supabase.com/dashboard/project/[your-project-id]/sql');
        process.exit(1);
    }
}

// Run the table creation
createBrokersTable()
    .then(() => {
        console.log('\n✅ Brokers table setup completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });

export { createBrokersTable };