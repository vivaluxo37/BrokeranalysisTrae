import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
    console.log('🔍 Checking database tables...');
    
    try {
        // Check brokers table
        console.log('\n📊 Checking brokers table...');
        const { count: brokersCount, error: brokersError } = await supabase
            .from('brokers')
            .select('*', { count: 'exact', head: true });
            
        if (brokersError) {
            console.log('❌ Brokers table error:', brokersError.message);
        } else {
            console.log('✅ Brokers table count:', brokersCount);
        }
        
        // Check crawled_pages table
        console.log('\n📄 Checking crawled_pages table...');
        const { count: pagesCount, error: pagesError } = await supabase
            .from('crawled_pages')
            .select('*', { count: 'exact', head: true });
            
        if (pagesError) {
            console.log('❌ Crawled_pages table error:', pagesError.message);
        } else {
            console.log('✅ Crawled_pages table count:', pagesCount);
        }
        
        // If brokers table exists, get sample data
        if (!brokersError && brokersCount > 0) {
            console.log('\n🔍 Sample broker data:');
            const { data: sampleBrokers, error: sampleError } = await supabase
                .from('brokers')
                .select('id, name, rating, review_count')
                .limit(5);
                
            if (sampleError) {
                console.log('❌ Error fetching sample brokers:', sampleError.message);
            } else {
                console.table(sampleBrokers);
            }
        }
        
        // If crawled_pages table exists, get sample data
        if (!pagesError && pagesCount > 0) {
            console.log('\n🔍 Sample crawled pages data:');
            const { data: samplePages, error: samplePagesError } = await supabase
                .from('crawled_pages')
                .select('url, status, fetched_at')
                .limit(5);
                
            if (samplePagesError) {
                console.log('❌ Error fetching sample pages:', samplePagesError.message);
            } else {
                console.table(samplePages);
            }
        }
        
    } catch (error) {
        console.error('❌ Database check failed:', error.message);
    }
}

checkTables();