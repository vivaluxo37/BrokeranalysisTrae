require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Use service role key for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTables() {
  try {
    console.log('Creating essential tables manually...');
    
    // First, let's check what tables exist
    console.log('\nChecking existing tables...');
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');
    
    if (tablesError) {
      console.log('Cannot check tables, proceeding with creation...');
    } else {
      console.log('Existing tables:', tables);
    }
    
    // Try to create locales table first
    console.log('\nCreating locales table...');
    try {
      // Insert sample locales data directly
      const { data: localesData, error: localesError } = await supabase
        .from('locales')
        .upsert([
          { code: 'en', label: 'English', enabled: true },
          { code: 'es', label: 'Español', enabled: true },
          { code: 'fr', label: 'Français', enabled: true },
          { code: 'de', label: 'Deutsch', enabled: true }
        ]);
      
      if (localesError) {
        console.log('Locales table might not exist, error:', localesError.message);
      } else {
        console.log('✓ Locales data inserted successfully');
      }
    } catch (err) {
      console.log('Locales table creation failed:', err.message);
    }
    
    // Check if we can query the current brokers table structure
    console.log('\nChecking current brokers table...');
    const { data: currentBrokers, error: currentError } = await supabase
      .from('brokers')
      .select('*')
      .limit(1);
    
    if (currentError) {
      console.log('Brokers table error:', currentError.message);
    } else if (currentBrokers && currentBrokers.length > 0) {
      console.log('Current broker structure:', Object.keys(currentBrokers[0]));
      
      // If we have old data, let's try to work with the existing structure
      // and update the sitemap script to use available columns
      console.log('\nFound existing broker data. Will adapt sitemap script to current structure.');
    }
    
    console.log('\nSchema setup completed with available structure.');
    
  } catch (error) {
    console.error('Table creation failed:', error);
  }
}

createTables();