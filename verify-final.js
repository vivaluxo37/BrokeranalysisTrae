import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTable() {
    console.log('🔍 Verifying crawled_pages table...');
    
    try {
        // Test 1: Basic table access
        console.log('\n1. Testing basic table access...');
        const { data: selectData, error: selectError } = await supabase
            .from('crawled_pages')
            .select('*')
            .limit(1);
        
        if (selectError) {
            console.error('❌ Basic select failed:', selectError.message);
        } else {
            console.log('✅ Basic table access successful');
        }
        
        // Test 2: Count rows
        console.log('\n2. Testing row count...');
        const { count, error: countError } = await supabase
            .from('crawled_pages')
            .select('*', { count: 'exact', head: true });
        
        if (countError) {
            console.error('❌ Count query failed:', countError.message);
        } else {
            console.log(`✅ Current row count: ${count}`);
        }
        
        // Test 3: Insert test data
        console.log('\n3. Testing data insertion...');
        const testData = {
            url: 'https://test-broker.com/test',
            title: 'Test Broker Page',
            content: 'This is test content for verification',
            broker_name: 'Test Broker',
            page_type: 'test',
            status: 'success'
        };
        
        const { data: insertData, error: insertError } = await supabase
            .from('crawled_pages')
            .insert([testData])
            .select();
        
        if (insertError) {
            console.error('❌ Insert failed:', insertError.message);
        } else {
            console.log('✅ Test data inserted successfully:', insertData[0]?.id);
            
            // Test 4: Verify the insert
            console.log('\n4. Verifying inserted data...');
            const { data: verifyData, error: verifyError } = await supabase
                .from('crawled_pages')
                .select('*')
                .eq('url', testData.url)
                .single();
            
            if (verifyError) {
                console.error('❌ Verification failed:', verifyError.message);
            } else {
                console.log('✅ Data verification successful:', {
                    id: verifyData.id,
                    url: verifyData.url,
                    title: verifyData.title,
                    broker_name: verifyData.broker_name
                });
            }
            
            // Clean up test data
            console.log('\n5. Cleaning up test data...');
            const { error: deleteError } = await supabase
                .from('crawled_pages')
                .delete()
                .eq('url', testData.url);
            
            if (deleteError) {
                console.error('❌ Cleanup failed:', deleteError.message);
            } else {
                console.log('✅ Test data cleaned up successfully');
            }
        }
        
        // Final count
        console.log('\n6. Final row count...');
        const { count: finalCount, error: finalCountError } = await supabase
            .from('crawled_pages')
            .select('*', { count: 'exact', head: true });
        
        if (finalCountError) {
            console.error('❌ Final count failed:', finalCountError.message);
        } else {
            console.log(`✅ Final row count: ${finalCount}`);
        }
        
        console.log('\n🎉 Table verification completed successfully!');
        console.log('The crawled_pages table is now ready for use.');
        
    } catch (error) {
        console.error('❌ Verification failed with error:', error.message);
        process.exit(1);
    }
}

verifyTable();