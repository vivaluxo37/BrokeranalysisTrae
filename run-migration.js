import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function runMigration() {
    console.log('🚀 Starting database migration...');
    
    // Create Supabase client with service role key
    const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    try {
        // Read migration SQL file
        const migrationSQL = fs.readFileSync('migration.sql', 'utf8');
        console.log('📄 Migration SQL loaded');
        
        // Execute the migration
        console.log('⚡ Executing migration...');
        const { data, error } = await supabase.rpc('exec_sql', {
            sql: migrationSQL
        });
        
        if (error) {
            // If rpc doesn't work, try direct SQL execution
            console.log('🔄 Trying alternative method...');
            
            // Split SQL into individual statements
            const statements = migrationSQL
                .split(';')
                .map(stmt => stmt.trim())
                .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
            
            for (const statement of statements) {
                if (statement.trim()) {
                    console.log(`Executing: ${statement.substring(0, 50)}...`);
                    const result = await supabase.rpc('exec_sql', { sql: statement });
                    if (result.error) {
                        console.error('❌ Error executing statement:', result.error);
                        throw result.error;
                    }
                }
            }
        }
        
        console.log('✅ Migration completed successfully!');
        
        // Verify table creation
        console.log('🔍 Verifying table creation...');
        const { data: tableCheck, error: checkError } = await supabase
            .from('crawled_pages')
            .select('count', { count: 'exact', head: true });
            
        if (checkError) {
            console.error('❌ Table verification failed:', checkError);
        } else {
            console.log('✅ Table verified successfully! Row count:', tableCheck.count || 0);
        }
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runMigration();
}

export { runMigration };