import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  try {
    // Check if specific tables exist by trying to query them
    const tablesToCheck = ['brokers', 'broker_i18n', 'broker_regulations', 'broker_faqs', 'broker_reviews'];
    
    console.log('Checking table existence:');
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table}: ${error.message}`);
        } else {
          console.log(`✅ ${table}: exists (${data.length} rows found)`);
        }
      } catch (err) {
        console.log(`❌ ${table}: ${err.message}`);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

checkTables();