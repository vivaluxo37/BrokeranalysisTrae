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

async function verifyTableAccess() {
    console.log('🔍 Comprehensive Table Verification');
    console.log('==================================\n');
    
    try {
        // Test 1: Basic table access
        console.log('Test 1: Basic table access...');
        const { data: basicData, error: basicError } = await supabase
            .from('crawled_pages')
            .select('*')
            .limit(1);
            
        if (basicError) {
            console.log('❌ Basic access failed:', basicError.message);
        } else {
            console.log('✅ Basic access successful');
            console.log('📊 Sample data:', basicData);
        }
        
        // Test 2: Count query
        console.log('\nTest 2: Count query...');
        const { count, error: countError } = await supabase
            .from('crawled_pages')
            .select('*', { count: 'exact', head: true });
            
        if (countError) {
            console.log('❌ Count query failed:', countError.message);
        } else {
            console.log('✅ Count query successful');
            console.log('📊 Total rows:', count);
        }
        
        // Test 3: Insert test data
        console.log('\nTest 3: Insert test data...');
        const testData = {
            url: 'https://test-broker-' + Date.now() + '.com',
            status: 200,
            sha256: 'test-hash-' + Date.now(),
            html: '<html><body>Test</body></html>',
            text_content: 'Test content',
            meta: { title: 'Test Page' },
            data: { test: true }
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('crawled_pages')
            .insert(testData)
            .select();
            
        if (insertError) {
            console.log('❌ Insert failed:', insertError.message);
        } else {
            console.log('✅ Insert successful');
            console.log('📊 Inserted data:', insertData[0]);
            
            // Test 4: Verify the insert
            console.log('\nTest 4: Verify insert...');
            const { data: verifyData, error: verifyError } = await supabase
                .from('crawled_pages')
                .select('*')
                .eq('url', testData.url);
                
            if (verifyError) {
                console.log('❌ Verification failed:', verifyError.message);
            } else {
                console.log('✅ Verification successful');
                console.log('📊 Retrieved data:', verifyData[0]);
            }
        }
        
        // Test 5: Final count
        console.log('\nTest 5: Final count...');
        const { count: finalCount, error: finalCountError } = await supabase
            .from('crawled_pages')
            .select('*', { count: 'exact', head: true });
            
        if (finalCountError) {
            console.log('❌ Final count failed:', finalCountError.message);
        } else {
            console.log('✅ Final count successful');
            console.log('📊 Total rows after test:', finalCount);
        }
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
    
    console.log('\n🏁 Verification completed!');
}

// Run verification
verifyTableAccess().catch(console.error);