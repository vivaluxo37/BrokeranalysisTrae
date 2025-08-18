import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://diykotyhjwcwdscozltq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Target brokers to import
const TARGET_BROKERS = [
  'fidelity',
  'charles schwab', 
  'robinhood',
  'jp morgan',
  'j.p. morgan',
  'sofi invest',
  'ally invest',
  'tradestation',
  'tastytrade',
  'oanda',
  'etrade',
  'e*trade',
  'moomoo',
  'merrill edge',
  'merril edge',
  'ninja trader',
  'ninjatrader'
];

// Helper function to create slug from broker name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Helper function to normalize broker name for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper function to check if broker is in target list
function isTargetBroker(brokerName) {
  const normalized = normalizeName(brokerName);
  return TARGET_BROKERS.some(target => {
    const normalizedTarget = normalizeName(target);
    return normalized.includes(normalizedTarget) || normalizedTarget.includes(normalized);
  });
}

// Helper function to extract rating from string
function extractRating(ratingStr) {
  if (!ratingStr) return null;
  const match = ratingStr.toString().match(/([0-9]+(\.[0-9]+)?)/); 
  return match ? parseFloat(match[1]) : null;
}

// Process CSV file and extract broker data
async function processCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      skip_records_with_error: true
    }, (err, records) => {
      if (err) {
        reject(err);
        return;
      }
      
      console.log(`📄 Processing ${records.length} records from ${path.basename(filePath)}`);
      
      for (const record of records) {
        const brokerName = record['Broker Name'] || record['name'] || '';
        
        if (!brokerName || !isTargetBroker(brokerName)) {
          continue;
        }
        
        console.log(`✅ Found target broker: ${brokerName}`);
        
        // Map data based on available columns
        const brokerData = {
          name: brokerName.trim(),
          slug: createSlug(brokerName),
          logo_url: record['Broker Logo URL'] || record['logo_url'] || null,
          avg_rating: extractRating(record['Overall Rating'] || record['Rating'] || record['avg_rating']),
          status: 'active',
          founded_year: null, // Not available in CSV
          headquarters: null, // Not available in CSV
          base_currency: record['Base Currencies Supported'] ? 
            record['Base Currencies Supported'].split(';')[0] || 'USD' : 'USD'
        };
        
        // Extract features from various columns
        const features = [];
        
        // Add pros as features
        if (record['Pros'] || record['Main Pros']) {
          const pros = (record['Pros'] || record['Main Pros']).split(';');
          pros.forEach(pro => {
            if (pro.trim()) {
              features.push({
                feature_key: 'pro',
                feature_value: pro.trim()
              });
            }
          });
        }
        
        // Add cons as features
        if (record['Cons'] || record['Main Cons']) {
          const cons = (record['Cons'] || record['Main Cons']).split(';');
          cons.forEach(con => {
            if (con.trim()) {
              features.push({
                feature_key: 'con',
                feature_value: con.trim()
              });
            }
          });
        }
        
        // Add minimum deposit info
        if (record['Minimum Deposit']) {
          features.push({
            feature_key: 'minimum_deposit',
            feature_value: record['Minimum Deposit']
          });
        }
        
        // Add trading fees info
        if (record['Trading Fee Breakdown']) {
          features.push({
            feature_key: 'trading_fees',
            feature_value: record['Trading Fee Breakdown']
          });
        }
        
        // Add regulation info
        const regulations = [];
        if (record['Regulatory Bodies']) {
          const regulators = record['Regulatory Bodies'].split(';');
          regulators.forEach(regulator => {
            if (regulator.trim()) {
              regulations.push({
                country_code: 'US', // Default to US for these brokers
                regulator_name: regulator.trim(),
                license_id: null
              });
            }
          });
        }
        
        results.push({
          broker: brokerData,
          features: features,
          regulations: regulations
        });
      }
      
      resolve(results);
    });
  });
}

// Insert broker data into Supabase
async function insertBrokerData(brokerData) {
  try {
    // Insert broker
    const { data: broker, error: brokerError } = await supabase
      .from('brokers')
      .upsert(brokerData.broker, { onConflict: 'slug' })
      .select()
      .single();
    
    if (brokerError) {
      console.error(`❌ Error inserting broker ${brokerData.broker.name}:`, brokerError);
      return false;
    }
    
    console.log(`✅ Inserted/Updated broker: ${broker.name}`);
    
    // Insert features
    if (brokerData.features.length > 0) {
      const featuresWithBrokerId = brokerData.features.map(feature => ({
        ...feature,
        broker_id: broker.id
      }));
      
      // Delete existing features first
      await supabase
        .from('broker_features')
        .delete()
        .eq('broker_id', broker.id);
      
      const { error: featuresError } = await supabase
        .from('broker_features')
        .insert(featuresWithBrokerId);
      
      if (featuresError) {
        console.error(`⚠️ Error inserting features for ${broker.name}:`, featuresError);
      } else {
        console.log(`✅ Inserted ${brokerData.features.length} features for ${broker.name}`);
      }
    }
    
    // Insert regulations
    if (brokerData.regulations.length > 0) {
      const regulationsWithBrokerId = brokerData.regulations.map(regulation => ({
        ...regulation,
        broker_id: broker.id
      }));
      
      // Delete existing regulations first
      await supabase
        .from('broker_regulation')
        .delete()
        .eq('broker_id', broker.id);
      
      const { error: regulationsError } = await supabase
        .from('broker_regulation')
        .insert(regulationsWithBrokerId);
      
      if (regulationsError) {
        console.error(`⚠️ Error inserting regulations for ${broker.name}:`, regulationsError);
      } else {
        console.log(`✅ Inserted ${brokerData.regulations.length} regulations for ${broker.name}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Unexpected error inserting broker ${brokerData.broker.name}:`, error);
    return false;
  }
}

// Main import function
async function importBrokers() {
  console.log('🚀 Starting comprehensive broker import...');
  console.log(`🎯 Target brokers: ${TARGET_BROKERS.join(', ')}`);
  
  const csvDir = path.join(__dirname, '..', 'brokerdatacsv');
  const csvFiles = [
    path.join(csvDir, 'results.csv'),
    path.join(csvDir, 'results (1).csv')
  ];
  
  let allBrokerData = [];
  
  // Process all CSV files
  for (const csvFile of csvFiles) {
    if (fs.existsSync(csvFile)) {
      console.log(`\n📂 Processing file: ${path.basename(csvFile)}`);
      try {
        const brokerData = await processCsvFile(csvFile);
        allBrokerData = allBrokerData.concat(brokerData);
      } catch (error) {
        console.error(`❌ Error processing ${csvFile}:`, error);
      }
    } else {
      console.log(`⚠️ File not found: ${csvFile}`);
    }
  }
  
  // Remove duplicates based on slug
  const uniqueBrokers = [];
  const seenSlugs = new Set();
  
  for (const brokerData of allBrokerData) {
    if (!seenSlugs.has(brokerData.broker.slug)) {
      seenSlugs.add(brokerData.broker.slug);
      uniqueBrokers.push(brokerData);
    }
  }
  
  console.log(`\n📊 Found ${uniqueBrokers.length} unique target brokers to import`);
  
  // Import brokers
  let successCount = 0;
  let failCount = 0;
  
  for (const brokerData of uniqueBrokers) {
    const success = await insertBrokerData(brokerData);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n📈 Import Summary:`);
  console.log(`✅ Successfully imported: ${successCount} brokers`);
  console.log(`❌ Failed to import: ${failCount} brokers`);
  
  // Verify import by querying the database
  console.log(`\n🔍 Verifying imported brokers...`);
  const { data: importedBrokers, error } = await supabase
    .from('brokers')
    .select('name, slug, avg_rating, status')
    .order('avg_rating', { ascending: false });
  
  if (error) {
    console.error('❌ Error verifying import:', error);
  } else {
    console.log(`\n📋 Current brokers in database (${importedBrokers.length} total):`);
    importedBrokers.forEach(broker => {
      console.log(`  • ${broker.name} (${broker.slug}) - Rating: ${broker.avg_rating || 'N/A'} - Status: ${broker.status}`);
    });
  }
  
  console.log('\n🎉 Import process completed!');
}

// Run the import
importBrokers().catch(console.error);