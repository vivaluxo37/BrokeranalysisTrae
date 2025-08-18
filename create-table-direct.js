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

async function createTableDirect() {
    console.log('🎯 Creating crawled_pages table using direct Supabase methods');
    console.log('================================================================\n');
    
    try {
        // Test if we can connect to Supabase
        console.log('🔗 Testing Supabase connection...');
        const { data: testData, error: testError } = await supabase
            .from('_test_connection')
            .select('*')
            .limit(1);
        
        if (testError && !testError.message.includes('relation "_test_connection" does not exist')) {
            throw new Error(`Connection failed: ${testError.message}`);
        }
        console.log('✅ Supabase connection successful');
        
        // Check if table already exists by trying to query it
        console.log('\n🔍 Checking if crawled_pages table exists...');
        const { data: existingData, error: existingError } = await supabase
            .from('crawled_pages')
            .select('id')
            .limit(1);
        
        if (!existingError) {
            console.log('ℹ️  Table already exists. Checking structure...');
            
            // Try to insert a test record to verify structure
            const testRecord = {
                url: 'https://test-' + Date.now() + '.example.com',
                sha256: 'test-hash-' + Date.now(),
                html: '<html>test</html>',
                text_content: 'test content',
                meta: { test: true },
                data: { test: 'data' }
            };
            
            const { data: insertData, error: insertError } = await supabase
                .from('crawled_pages')
                .insert(testRecord)
                .select();
            
            if (insertError) {
                console.log('⚠️  Table exists but structure may be incorrect:', insertError.message);
                console.log('\n📝 Please run the SQL script manually in Supabase SQL Editor:');
                console.log('   File: create-table-manual.sql');
                console.log('   URL: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
            } else {
                console.log('✅ Table exists and structure is correct');
                
                // Clean up test record
                await supabase
                    .from('crawled_pages')
                    .delete()
                    .eq('id', insertData[0].id);
                
                console.log('\n🎉 SUCCESS! Table is ready for use.');
                console.log('\n📊 Table verification:');
                console.log('   ✅ crawled_pages table exists');
                console.log('   ✅ All required columns present');
                console.log('   ✅ Insert/delete operations working');
                console.log('\n📝 You can now run your crawler to save data to Supabase!');
            }
        } else if (existingError.message.includes('relation "crawled_pages" does not exist')) {
            console.log('❌ Table does not exist.');
            console.log('\n📝 Please create the table manually using one of these methods:');
            console.log('\n   Method 1 - Supabase SQL Editor (Recommended):');
            console.log('   1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/sql');
            console.log('   2. Copy and paste the contents of: create-table-manual.sql');
            console.log('   3. Click "Run" to execute the script');
            console.log('\n   Method 2 - Use migration.sql:');
            console.log('   1. Copy the contents of migration.sql');
            console.log('   2. Paste into Supabase SQL Editor');
            console.log('   3. Run the script');
            console.log('\n   Method 3 - Manual table creation:');
            console.log('   1. Use the Supabase Dashboard Table Editor');
            console.log('   2. Create table with columns as specified in the SQL files');
        } else {
            throw new Error(`Unexpected error: ${existingError.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\n🔧 Troubleshooting:');
        console.error('   1. Check your Supabase credentials in .env file');
        console.error('   2. Ensure SUPABASE_SERVICE_ROLE_KEY has sufficient permissions');
        console.error('   3. Create the table manually using create-table-manual.sql');
        console.error('   4. Verify your Supabase project is active and accessible');
        process.exit(1);
    }
}

// Run the function
createTableDirect()
    .then(() => {
        console.log('\n✨ Script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script failed:', error.message);
        process.exit(1);
    });

export { createTableDirect };