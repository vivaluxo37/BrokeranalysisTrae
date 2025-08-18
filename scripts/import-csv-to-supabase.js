import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration');
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Function to clean and normalize data
function cleanBrokerData(row) {
  // Extract rating number from "4.9/5" format
  const ratingMatch = row['Rating']?.match(/([0-9.]+)/);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
  
  // Clean broker name
  const name = row['Broker Name']?.trim();
  
  // Generate slug from name
  const slug = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') : null;
  
  return {
    name,
    slug,
    logo_url: row['Broker Logo URL']?.trim() || null,
    avg_rating: rating,
    status: 'active'
  };
}

// Function to create brokers table if it doesn't exist
async function createBrokersTable() {
  console.log('🔧 Creating brokers table...');
  
  // First, let's check what columns exist in the current table
  const { data: existingColumns, error: columnsError } = await supabase
    .from('brokers')
    .select('*')
    .limit(1);
  
  if (columnsError && columnsError.code === 'PGRST116') {
    // Table doesn't exist, create it with a simple structure
    console.log('🔧 Table does not exist, creating simple brokers table...');
    
    // Use a very simple approach - just insert and let Supabase handle the schema
    const testInsert = {
      slug: 'test-broker',
      name: 'Test Broker',
      logo_url: 'https://example.com/logo.png',
      avg_rating: 4.5,
      status: 'active'
    };
    
    const { error: testError } = await supabase
      .from('brokers')
      .insert(testInsert);
    
    if (testError) {
      console.log('❌ Test insert failed:', testError.message);
      return;
    } else {
      console.log('✅ Test insert successful, table structure confirmed');
      // Delete the test record
      await supabase
        .from('brokers')
        .delete()
        .eq('slug', 'test-broker');
    }
  } else {
    console.log('✅ Table already exists');
  }
}

// Function to import CSV data
async function importCSVData() {
  try {
    console.log('📊 Starting CSV import process...');
    
    // Read CSV file
    const csvPath = path.join(process.cwd(), 'brokerdatacsv', 'results.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    console.log('📁 CSV file loaded successfully');
    
    // Parse CSV with flexible column handling
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      quote: '"',
      escape: '"',
      relax_column_count: true, // Allow variable column counts
      skip_records_with_error: true // Skip malformed records
    });
    
    console.log(`📋 Found ${records.length} records in CSV`);
    
    // Clean and prepare data
    const brokers = [];
    const seenNames = new Set();
    
    for (const record of records) {
      const cleanedData = cleanBrokerData(record);
      
      // Skip if no name or duplicate
      if (!cleanedData.name || seenNames.has(cleanedData.name)) {
        continue;
      }
      
      seenNames.add(cleanedData.name);
      brokers.push(cleanedData);
    }
    
    console.log(`🔄 Processed ${brokers.length} unique brokers`);
    
    // Create table first
    await createBrokersTable();
    
    // Insert data in batches
    const batchSize = 10;
    let successCount = 0;
    let failCount = 0;
    
    for (let i = 0; i < brokers.length; i += batchSize) {
      const batch = brokers.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabase
          .from('brokers')
          .insert(batch)
          .select();
        
        if (error) {
          console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} failed:`, error.message);
          failCount += batch.length;
        } else {
          console.log(`✅ Batch ${Math.floor(i/batchSize) + 1} inserted successfully: ${data.length} brokers`);
          successCount += data.length;
        }
      } catch (err) {
        console.error(`❌ Batch ${Math.floor(i/batchSize) + 1} failed:`, err.message);
        failCount += batch.length;
      }
    }
    
    console.log('\n📊 Import Summary:');
    console.log(`✅ Successfully imported: ${successCount} brokers`);
    console.log(`❌ Failed to import: ${failCount} brokers`);
    
    // Verify the import
    const { data: verifyData, error: verifyError } = await supabase
      .from('brokers')
      .select('id, name, avg_rating')
      .order('avg_rating', { ascending: false })
      .limit(5);
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError.message);
    } else {
      console.log('\n🔍 Top 5 brokers by rating:');
      verifyData.forEach((broker, index) => {
        console.log(`${index + 1}. ${broker.name} (${broker.avg_rating}/5)`);
      });
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting Supabase CSV Import');
  console.log('📍 Project URL:', supabaseUrl);
  console.log('🔑 Using Service Role Key for admin operations\n');
  
  await importCSVData();
  
  console.log('\n🎉 Import process completed!');
}

// Run the script
main().catch(console.error);