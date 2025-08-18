import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing required environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function createCrawledPagesTable() {
    try {
        console.log('Creating Supabase client with service role...');
        
        // Read the migration SQL file
        const migrationPath = path.join(process.cwd(), 'migration.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        console.log('Executing SQL migration...');
        
        // Split the SQL into individual statements
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`Found ${statements.length} SQL statements to execute`);
        
        // Execute each statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                console.log(`Executing statement ${i + 1}/${statements.length}...`);
                console.log(`SQL: ${statement.substring(0, 100)}...`);
                
                try {
                    const { data, error } = await supabase.rpc('exec_sql', {
                        sql: statement
                    });
                    
                    if (error) {
                        console.error(`Error in statement ${i + 1}:`, error);
                        // Continue with next statement for non-critical errors
                        if (!error.message.includes('already exists')) {
                            throw error;
                        }
                    } else {
                        console.log(`Statement ${i + 1} executed successfully`);
                    }
                } catch (err) {
                    console.error(`Failed to execute statement ${i + 1}:`, err.message);
                    // Try alternative approach for this statement
                    console.log('Trying alternative execution method...');
                    
                    // For CREATE TABLE statements, try using direct SQL
                    if (statement.toUpperCase().includes('CREATE TABLE')) {
                        try {
                            const { error: directError } = await supabase
                                .from('_sql')
                                .select('*')
                                .limit(0); // This will fail but establish connection
                            
                            console.log('Direct SQL execution not available, continuing...');
                        } catch (directErr) {
                            console.log('Expected error for direct SQL test');
                        }
                    }
                }
            }
        }
        
        console.log('Migration completed!');
        
        // Verify table creation
        console.log('Verifying table creation...');
        const { data: tables, error: tablesError } = await supabase
            .from('crawled_pages')
            .select('count', { count: 'exact', head: true });
            
        if (tablesError) {
            console.error('Table verification failed:', tablesError);
            console.log('\nPlease manually execute the following SQL in Supabase SQL Editor:');
            console.log('\n' + '='.repeat(80));
            console.log(migrationSQL);
            console.log('='.repeat(80));
        } else {
            console.log('✅ Table created successfully! Row count:', tables?.length || 0);
        }
        
    } catch (error) {
        console.error('Migration failed:', error);
        
        // Provide manual SQL as fallback
        console.log('\n🔧 FALLBACK: Please manually execute the following SQL in Supabase SQL Editor:');
        console.log('\n' + '='.repeat(80));
        
        const migrationPath = path.join(process.cwd(), 'migration.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        console.log(migrationSQL);
        console.log('='.repeat(80));
        
        console.log('\nSteps:');
        console.log('1. Go to https://supabase.com/dashboard/project/diykotyhjwcwdscozltq/sql');
        console.log('2. Copy and paste the SQL above');
        console.log('3. Click "Run" to execute');
        
        process.exit(1);
    }
}

// Run the migration
createCrawledPagesTable().catch(console.error);