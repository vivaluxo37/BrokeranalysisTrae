import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function executeSQL(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      },
      body: JSON.stringify({ sql_query: sql })
    });

    if (!response.ok) {
      // If exec_sql doesn't exist, try direct SQL execution
      const directResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sql',
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY
        },
        body: sql
      });
      
      if (!directResponse.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
      }
      
      return await directResponse.text();
    }

    return await response.json();
  } catch (error) {
    throw new Error(`SQL execution failed: ${error.message}`);
  }
}

async function createTables() {
  console.log('🚀 Creating missing tables using direct SQL execution...');
  
  const tables = [
    {
      name: 'broker_features',
      sql: `
        CREATE TABLE IF NOT EXISTS broker_features (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
          feature_key TEXT NOT NULL,
          feature_value TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_broker_features_broker_id ON broker_features(broker_id);
        CREATE INDEX IF NOT EXISTS idx_broker_features_key ON broker_features(feature_key);
      `
    },
    {
      name: 'broker_regulation',
      sql: `
        CREATE TABLE IF NOT EXISTS broker_regulation (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
          country_code CHAR(2) NOT NULL,
          regulator_name TEXT NOT NULL,
          license_id TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_broker_regulation_broker_id ON broker_regulation(broker_id);
        CREATE INDEX IF NOT EXISTS idx_broker_regulation_country ON broker_regulation(country_code);
      `
    },
    {
      name: 'reviews',
      sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          broker_id UUID NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
          kind TEXT CHECK (kind IN ('editorial', 'user')) NOT NULL,
          author TEXT,
          author_id UUID,
          rating NUMERIC(2,1) CHECK (rating >= 0 AND rating <= 5),
          body TEXT NOT NULL,
          lang CHAR(2) DEFAULT 'en',
          flagged BOOLEAN DEFAULT FALSE,
          admin_notes TEXT,
          published_at TIMESTAMPTZ DEFAULT NOW(),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_reviews_broker_id ON reviews(broker_id);
        CREATE INDEX IF NOT EXISTS idx_reviews_kind ON reviews(kind);
        CREATE INDEX IF NOT EXISTS idx_reviews_author_id ON reviews(author_id);
        CREATE INDEX IF NOT EXISTS idx_reviews_published ON reviews(published_at DESC);
      `
    },
    {
      name: 'locales',
      sql: `
        CREATE TABLE IF NOT EXISTS locales (
          code VARCHAR(5) PRIMARY KEY,
          label TEXT NOT NULL,
          enabled BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    }
  ];
  
  // Insert default locales
  const localesData = `
    INSERT INTO locales (code, label) VALUES 
      ('en', 'English'),
      ('es', 'Español'),
      ('pt', 'Português'),
      ('fr', 'Français'),
      ('de', 'Deutsch'),
      ('it', 'Italiano'),
      ('ru', 'Русский'),
      ('zh-Hans', '简体中文'),
      ('zh-Hant', '繁體中文'),
      ('ja', '日本語'),
      ('ko', '한국어'),
      ('ar', 'العربية'),
      ('hi', 'हिन्दी'),
      ('bn', 'বাংলা'),
      ('ur', 'اردو')
    ON CONFLICT (code) DO NOTHING;
  `;
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const table of tables) {
    try {
      console.log(`📊 Creating table: ${table.name}...`);
      await executeSQL(table.sql);
      console.log(`✅ Table '${table.name}' created successfully`);
      successCount++;
    } catch (error) {
      console.log(`❌ Error creating table '${table.name}':`, error.message);
      errorCount++;
    }
  }
  
  // Insert default locales
  try {
    console.log('📊 Inserting default locales...');
    await executeSQL(localesData);
    console.log('✅ Default locales inserted successfully');
  } catch (error) {
    console.log('❌ Error inserting locales:', error.message);
  }
  
  console.log(`\n📈 Table Creation Summary:`);
  console.log(`✅ Successfully created: ${successCount} tables`);
  console.log(`❌ Failed to create: ${errorCount} tables`);
  
  // Verify tables exist by trying to query them
  console.log('\n🔍 Verifying table creation...');
  const allTables = ['brokers', 'broker_features', 'broker_regulation', 'reviews', 'locales'];
  
  for (const tableName of allTables) {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${tableName}?limit=1`, {
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY
        }
      });
      
      if (response.ok) {
        console.log(`✅ Table '${tableName}' exists and is accessible`);
      } else {
        console.log(`❌ Table '${tableName}' not accessible: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error checking table '${tableName}':`, error.message);
    }
  }
  
  console.log('\n🎉 Table creation process completed!');
}

// Run if called directly
if (process.argv[1] && process.argv[1].includes('create-tables-direct.js')) {
  createTables().catch(error => {
    console.error('💥 Table creation failed:', error);
    process.exit(1);
  });
}

export { createTables };