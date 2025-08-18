import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

// Utility functions
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

function parseRating(ratingStr) {
  if (!ratingStr) return null;
  const match = ratingStr.match(/([0-9.]+)/);
  return match ? parseFloat(match[1]) : null;
}

function parseFeatures(prosStr, consStr) {
  const features = [];
  
  if (prosStr) {
    const pros = prosStr.split(';').filter(p => p.trim());
    pros.forEach(pro => {
      features.push({
        feature_key: 'pro',
        feature_value: pro.trim()
      });
    });
  }
  
  if (consStr) {
    const cons = consStr.split(';').filter(c => c.trim());
    cons.forEach(con => {
      features.push({
        feature_key: 'con',
        feature_value: con.trim()
      });
    });
  }
  
  return features;
}

function parseRegulation(regulationStr) {
  if (!regulationStr) return [];
  
  const regulations = [];
  
  // Parse different regulation formats
  if (regulationStr.includes('Regulated by')) {
    // Format: "Regulated by SEC (US), FCA (UK), ASIC (Australia)..."
    const matches = regulationStr.match(/([A-Z]{2,5})\s*\(([^)]+)\)/g);
    if (matches) {
      matches.forEach(match => {
        const [, regulator, country] = match.match(/([A-Z]{2,5})\s*\(([^)]+)\)/);
        regulations.push({
          country_code: getCountryCode(country),
          regulator_name: regulator,
          license_id: null
        });
      });
    }
  } else if (regulationStr.includes('Financial Conduct Authority')) {
    // Parse detailed regulation info
    const lines = regulationStr.split(';');
    lines.forEach(line => {
      if (line.includes('(') && line.includes(')')) {
        const match = line.match(/([^(]+)\(([^)]+)\)/);
        if (match) {
          const [, regulator, country] = match;
          regulations.push({
            country_code: getCountryCode(country.trim()),
            regulator_name: regulator.trim(),
            license_id: null
          });
        }
      }
    });
  }
  
  return regulations;
}

function getCountryCode(countryName) {
  const countryMap = {
    'US': 'US', 'United States': 'US',
    'UK': 'GB', 'United Kingdom': 'GB',
    'Australia': 'AU',
    'Canada': 'CA',
    'Ireland': 'IE',
    'Hong Kong': 'HK',
    'Singapore': 'SG',
    'Japan': 'JP',
    'India': 'IN',
    'Cyprus': 'CY'
  };
  
  return countryMap[countryName] || countryName.substring(0, 2).toUpperCase();
}

function parseKeyTradingFeatures(featuresStr) {
  if (!featuresStr) return [];
  
  const features = [];
  const parts = featuresStr.split(';');
  
  parts.forEach(part => {
    const trimmed = part.trim();
    if (trimmed.includes(':')) {
      const [key, value] = trimmed.split(':').map(s => s.trim());
      features.push({
        feature_key: key.toLowerCase().replace(/\s+/g, '_'),
        feature_value: value
      });
    }
  });
  
  return features;
}

// Main import function
async function importBrokerData() {
  console.log('🚀 Starting broker data import process...');
  
  const brokers = new Map(); // Use Map to handle duplicates
  const csvFiles = [
    'c:\\Users\\LENOVO\\Desktop\\brokeranalysis-project\\brokerdatacsv\\results.csv',
    'c:\\Users\\LENOVO\\Desktop\\brokeranalysis-project\\brokerdatacsv\\results (1).csv'
  ];
  
  // Process each CSV file
  for (const csvFile of csvFiles) {
    console.log(`📄 Processing ${csvFile}...`);
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFile)
        .pipe(csv())
        .on('data', (row) => {
          try {
            const brokerName = row['Broker Name']?.trim();
            if (!brokerName) return;
            
            const slug = createSlug(brokerName);
            const rating = parseRating(row['Rating'] || row['Overall Rating']);
            
            // Create or update broker data
            const brokerData = {
              slug,
              name: brokerName,
              logo_url: row['Broker Logo URL'] || null,
              avg_rating: rating,
              founded_year: null, // Could be extracted from descriptions
              headquarters: null, // Could be extracted from regulation info
              base_currency: 'USD', // Default, could be parsed from features
              status: 'active'
            };
            
            // Collect features
            const features = [];
            
            // Add pros/cons
            features.push(...parseFeatures(
              row['Main Pros'] || row['Pros'],
              row['Main Cons'] || row['Cons']
            ));
            
            // Add key trading features
            if (row['Key Trading Features']) {
              features.push(...parseKeyTradingFeatures(row['Key Trading Features']));
            }
            
            // Add other structured features
            if (row['Minimum Deposit']) {
              features.push({
                feature_key: 'minimum_deposit',
                feature_value: row['Minimum Deposit']
              });
            }
            
            if (row['Base Currencies Supported']) {
              features.push({
                feature_key: 'base_currencies',
                feature_value: row['Base Currencies Supported']
              });
            }
            
            // Parse regulation info
            const regulations = parseRegulation(
              row['Country / Regulation info'] || row['Regulatory Bodies']
            );
            
            // Store in map (will overwrite if duplicate, keeping latest)
            brokers.set(slug, {
              broker: brokerData,
              features,
              regulations,
              reviewUrl: row['Review Page Link'] || row['Review Page URL']
            });
            
          } catch (error) {
            console.error(`❌ Error processing row for ${row['Broker Name']}:`, error.message);
          }
        })
        .on('end', () => {
          console.log(`✅ Finished processing ${csvFile}`);
          resolve();
        })
        .on('error', reject);
    });
  }
  
  console.log(`📊 Total unique brokers found: ${brokers.size}`);
  
  // Insert data into Supabase
  let successCount = 0;
  let errorCount = 0;
  
  for (const [slug, data] of brokers) {
    try {
      console.log(`💾 Inserting broker: ${data.broker.name}`);
      
      // Insert broker
      const { data: insertedBroker, error: brokerError } = await supabase
        .from('brokers')
        .upsert(data.broker, { onConflict: 'slug' })
        .select()
        .single();
      
      if (brokerError) {
        throw new Error(`Broker insert failed: ${brokerError.message}`);
      }
      
      const brokerId = insertedBroker.id;
      
      // Insert features
      if (data.features.length > 0) {
        const featuresWithBrokerId = data.features.map(feature => ({
          ...feature,
          broker_id: brokerId
        }));
        
        const { error: featuresError } = await supabase
          .from('broker_features')
          .upsert(featuresWithBrokerId, { onConflict: 'broker_id,feature_key,feature_value' });
        
        if (featuresError) {
          console.warn(`⚠️  Features insert warning for ${data.broker.name}: ${featuresError.message}`);
        }
      }
      
      // Insert regulations
      if (data.regulations.length > 0) {
        const regulationsWithBrokerId = data.regulations.map(regulation => ({
          ...regulation,
          broker_id: brokerId
        }));
        
        const { error: regulationsError } = await supabase
          .from('broker_regulation')
          .upsert(regulationsWithBrokerId, { onConflict: 'broker_id,country_code,regulator_name' });
        
        if (regulationsError) {
          console.warn(`⚠️  Regulations insert warning for ${data.broker.name}: ${regulationsError.message}`);
        }
      }
      
      successCount++;
      console.log(`✅ Successfully imported: ${data.broker.name}`);
      
    } catch (error) {
      errorCount++;
      console.error(`❌ Failed to import ${data.broker.name}:`, error.message);
    }
  }
  
  console.log('\n📈 Import Summary:');
  console.log(`✅ Successfully imported: ${successCount} brokers`);
  console.log(`❌ Failed imports: ${errorCount} brokers`);
  console.log(`📊 Total processed: ${brokers.size} brokers`);
  
  // Verify data
  console.log('\n🔍 Verifying imported data...');
  const { data: brokerCount, error: countError } = await supabase
    .from('brokers')
    .select('id', { count: 'exact', head: true });
  
  if (!countError) {
    console.log(`📊 Total brokers in database: ${brokerCount.length || 0}`);
  }
  
  const { data: featuresCount, error: featuresCountError } = await supabase
    .from('broker_features')
    .select('id', { count: 'exact', head: true });
  
  if (!featuresCountError) {
    console.log(`🔧 Total features in database: ${featuresCount.length || 0}`);
  }
  
  console.log('\n🎉 Broker data import completed!');
}

// Run the import
if (import.meta.url.startsWith('file:') && process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  console.log('🚀 Starting broker data import...');
  importBrokerData().catch(error => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });
}

// Alternative: Always run if this is the main module
if (process.argv[1] && process.argv[1].includes('import-broker-data.js')) {
  console.log('🚀 Starting broker data import...');
  importBrokerData().catch(error => {
    console.error('💥 Import failed:', error);
    process.exit(1);
  });
}

export { importBrokerData };