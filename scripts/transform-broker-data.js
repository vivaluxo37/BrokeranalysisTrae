import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

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
 * Generate a consistent broker ID from broker name
 */
function generateBrokerId(brokerName) {
    return brokerName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Extract and transform broker data from crawled pages
 */
async function transformBrokerData() {
    console.log('🚀 Starting broker data transformation...');
    
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
        
        // Check if brokers table exists
        const { data: brokerTableCheck, error: brokerTableError } = await supabase
            .from('brokers')
            .select('count')
            .limit(1);
            
        if (brokerTableError) {
            console.error('❌ Brokers table does not exist or is not accessible:', brokerTableError.message);
            console.log('Please ensure the brokers table is created according to the schema in Complete_Site_Technical_Architecture.md');
            return;
        }
        
        console.log('✅ Brokers table exists and is accessible');
        
        // Fetch broker review pages from crawled_pages
        console.log('📊 Fetching broker review pages...');
        
        const { data: crawledPages, error: fetchError } = await supabase
            .from('crawled_pages')
            .select('*')
            .not('data', 'is', null);
            
        if (fetchError) {
            throw new Error(`Failed to fetch crawled pages: ${fetchError.message}`);
        }
        
        console.log(`📄 Found ${crawledPages.length} broker review pages`);
        
        if (crawledPages.length === 0) {
            console.log('ℹ️ No broker review pages found. Make sure the crawler has run and extracted broker data.');
            return;
        }
        
        // Transform and deduplicate broker data
        const brokerMap = new Map();
        let processedCount = 0;
        let skippedCount = 0;
        
        for (const page of crawledPages) {
            try {
                const reviewData = page.data?.reviewData;
                
                if (!reviewData || !reviewData.brokerName) {
                    skippedCount++;
                    continue;
                }
                
                const brokerId = generateBrokerId(reviewData.brokerName);
                
                // Create or update broker record
                const brokerRecord = {
                    id: brokerId,
                    name: reviewData.brokerName,
                    logo_url: reviewData.logoUrl || null,
                    rating: reviewData.rating ? parseFloat(reviewData.rating) : null,
                    review_count: reviewData.reviewCount ? parseInt(reviewData.reviewCount) : null,
                    features: {
                        pros: reviewData.pros || [],
                        cons: reviewData.cons || [],
                        sections: reviewData.sections || {}
                    },
                    fees: reviewData.sections?.fees ? {
                        content: reviewData.sections.fees
                    } : null,
                    regulation: reviewData.sections?.safety || reviewData.sections?.regulation ? {
                        safety: reviewData.sections.safety,
                        regulation: reviewData.sections.regulation
                    } : null,
                    is_active: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                
                // If broker already exists, merge data (keep highest rating, combine features)
                if (brokerMap.has(brokerId)) {
                    const existing = brokerMap.get(brokerId);
                    
                    // Keep highest rating
                    if (brokerRecord.rating && (!existing.rating || brokerRecord.rating > existing.rating)) {
                        existing.rating = brokerRecord.rating;
                    }
                    
                    // Combine features
                    if (brokerRecord.features.pros.length > 0) {
                        existing.features.pros = [...new Set([...existing.features.pros, ...brokerRecord.features.pros])];
                    }
                    if (brokerRecord.features.cons.length > 0) {
                        existing.features.cons = [...new Set([...existing.features.cons, ...brokerRecord.features.cons])];
                    }
                    
                    // Merge sections
                    existing.features.sections = { ...existing.features.sections, ...brokerRecord.features.sections };
                    
                    // Update fees and regulation if not present
                    if (!existing.fees && brokerRecord.fees) {
                        existing.fees = brokerRecord.fees;
                    }
                    if (!existing.regulation && brokerRecord.regulation) {
                        existing.regulation = brokerRecord.regulation;
                    }
                    
                    existing.updated_at = new Date().toISOString();
                } else {
                    brokerMap.set(brokerId, brokerRecord);
                }
                
                processedCount++;
                
            } catch (error) {
                console.warn(`⚠️ Error processing page ${page.url}:`, error.message);
                skippedCount++;
            }
        }
        
        console.log(`✅ Processed ${processedCount} pages, skipped ${skippedCount} pages`);
        console.log(`🎯 Found ${brokerMap.size} unique brokers`);
        
        if (brokerMap.size === 0) {
            console.log('ℹ️ No valid broker data found to transform.');
            return;
        }
        
        // Insert/update brokers in batches
        const brokers = Array.from(brokerMap.values());
        const batchSize = 50;
        let insertedCount = 0;
        let updatedCount = 0;
        
        console.log('💾 Inserting broker data into database...');
        
        for (let i = 0; i < brokers.length; i += batchSize) {
            const batch = brokers.slice(i, i + batchSize);
            
            const { data: upsertData, error: upsertError } = await supabase
                .from('brokers')
                .upsert(batch, { 
                    onConflict: 'id',
                    ignoreDuplicates: false 
                })
                .select('id');
                
            if (upsertError) {
                console.error(`❌ Error upserting batch ${Math.floor(i/batchSize) + 1}:`, upsertError.message);
                continue;
            }
            
            insertedCount += upsertData.length;
            console.log(`📝 Processed batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(brokers.length/batchSize)} (${upsertData.length} records)`);
        }
        
        // Get final statistics
        const { data: finalStats, error: statsError } = await supabase
            .from('brokers')
            .select('count');
            
        if (!statsError) {
            console.log(`\n🎉 Transformation completed successfully!`);
            console.log(`📊 Total brokers in database: ${finalStats.length}`);
            console.log(`✅ Processed: ${insertedCount} broker records`);
        }
        
        // Show sample of transformed data
        const { data: sampleBrokers, error: sampleError } = await supabase
            .from('brokers')
            .select('id, name, rating, review_count')
            .limit(5);
            
        if (!sampleError && sampleBrokers.length > 0) {
            console.log('\n📋 Sample broker records:');
            sampleBrokers.forEach(broker => {
                console.log(`  • ${broker.name} (${broker.id}) - Rating: ${broker.rating || 'N/A'}, Reviews: ${broker.review_count || 'N/A'}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Transformation failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run the transformation
transformBrokerData()
    .then(() => {
        console.log('\n✅ Broker data transformation completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });

export { transformBrokerData };