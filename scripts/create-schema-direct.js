import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Required: VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createBrokersTable() {
  console.log('🚀 Creating brokers table with correct schema...');
  
  // SQL from supabase-schema.sql
  const createTableSQL = `
    -- Drop existing table if it exists
    DROP TABLE IF EXISTS brokers CASCADE;
    
    -- Create brokers table with correct schema
    CREATE TABLE brokers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        founded_year INTEGER,
        headquarters TEXT,
        base_currency TEXT,
        avg_rating NUMERIC(2,1) CHECK (avg_rating >= 0 AND avg_rating <= 5),
        logo_url TEXT,
        status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    
    -- Create indexes
    CREATE INDEX idx_brokers_slug ON brokers(slug);
    CREATE INDEX idx_brokers_status ON brokers(status);
    CREATE INDEX idx_brokers_rating ON brokers(avg_rating DESC);
  `;
  
  try {
    const { data, error } = await supabase.rpc('exec', { sql: createTableSQL });
    
    if (error) {
      console.error('❌ Failed to create table via RPC:', error.message);
      
      // Try individual statements
      const statements = createTableSQL.split(';').filter(s => s.trim());
      
      for (const statement of statements) {
        if (statement.trim()) {
          console.log('🔄 Executing:', statement.trim().substring(0, 50) + '...');
          const { error: stmtError } = await supabase.rpc('exec', { sql: statement.trim() });
          if (stmtError) {
            console.error('❌ Statement failed:', stmtError.message);
          } else {
            console.log('✅ Statement executed successfully');
          }
        }
      }
    } else {
      console.log('✅ Table created successfully');
    }
    
    // Verify table structure
    const { data: tableInfo, error: infoError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'brokers')
      .eq('table_schema', 'public');
    
    if (infoError) {
      console.error('❌ Failed to verify table structure:', infoError.message);
    } else {
      console.log('\n📋 Table structure:');
      tableInfo.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type}`);
      });
    }
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

createBrokersTable().then(() => {
  console.log('\n🎉 Schema creation completed!');
}).catch(err => {
  console.error('❌ Process failed:', err.message);
});