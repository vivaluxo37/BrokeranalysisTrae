import { createClient } from '@supabase/supabase-js';
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

// Helper functions
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

function isTargetBroker(brokerName) {
  const normalized = normalizeName(brokerName);
  return TARGET_BROKERS.some(target => normalized.includes(target) || target.includes(normalized));
}

function extractRating(ratingStr) {
  if (!ratingStr) return null;
  const match = ratingStr.toString().match(/([0-9]+(\.[0-9]+)?)/);
  return match ? parseFloat(match[1]) : null;
}

async function processCsvFile(filePath) {
  console.log(`📄 Processing CSV file: ${path.basename(filePath)}`);
  
  return new Promise((resolve, reject) => {
    const brokers = [];
    
    try {
    
    // Read file content first
    const data = fs.readFileSync(filePath, 'utf8');
    
    // Parse CSV with more flexible approach to handle variable column counts
    const lines = data.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    console.log(`📋 CSV Headers (${headers.length}):`, headers.slice(0, 5).join(', '), '...');
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        // Split line and handle quoted values
        const values = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim()); // Add the last value
        
        // Create record object using only the first 11 values to match headers
        const record = {};
        for (let k = 0; k < Math.min(headers.length, values.length, 11); k++) {
          record[headers[k]] = values[k].replace(/^"|"$/g, ''); // Remove surrounding quotes
        }
        
        // Get broker name from first column
        const brokerName = Object.values(record)[0] || record['Broker Name'] || record['broker_name'] || record['name'];
          
          if (brokerName && typeof brokerName === 'string') {
            // Debug: Log all broker names being processed
            console.log(`🔍 Processing broker: "${brokerName}" -> normalized: "${normalizeName(brokerName)}"`);
            
            if (isTargetBroker(brokerName)) {
              // Extract data based on current schema: id, name, logo_url, rating, review_count, features, fees, regulation, is_active
              const brokerData = {
                name: brokerName.trim(),
                logo_url: record['Broker Logo URL'] || record['logo_url'] || null,
                rating: extractRating(record['Rating'] || record['Overall Rating'] || record['rating']) || 0,
                review_count: 0, // Default value
                features: {
                  pros: record['Main Pros'] || record['pros'] || '',
                  cons: record['Main Cons'] || record['cons'] || '',
                  trading_features: record['Key Trading Features'] || record['trading_features'] || '',
                  minimum_deposit: record['Minimum Deposit'] || record['minimum_deposit'] || '',
                  trading_fees: record['Trading Fees'] || record['trading_fees'] || ''
                },
                fees: {
                  commission: record['Commission'] || record['commission'] || '',
                  spread: record['Spread'] || record['spread'] || '',
                  overnight_fees: record['Overnight Fees'] || record['overnight_fees'] || ''
                },
                regulation: {
                  country: record['Country / Regulation info'] || record['country'] || '',
                  regulator: record['Regulator'] || record['regulator'] || '',
                  license: record['License'] || record['license'] || ''
                },
                is_active: true
              };
              
              brokers.push(brokerData);
              console.log(`🎯 Found target broker: ${brokerName}`);
            }
          }
        } catch (rowError) {
          console.warn(`⚠️ Skipping malformed row ${i} in ${filePath}:`, rowError.message);
        }
    }
    
    console.log(`📊 Extracted ${brokers.length} target brokers from ${filePath}`);
     resolve(brokers);
     
   } catch (error) {
     console.error(`❌ Error processing CSV ${filePath}:`, error.message);
     resolve([]); // Return empty array instead of rejecting
   }
   });
 }

function createBrokerId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function insertBroker(brokerData) {
  try {
    // Generate ID for the broker
    const brokerId = createBrokerId(brokerData.name);
    
    // Check if broker already exists
    const { data: existingBroker, error: checkError } = await supabase
      .from('brokers')
      .select('id, name')
      .eq('id', brokerId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error(`❌ Error checking existing broker ${brokerData.name}:`, checkError);
      return false;
    }
    
    // Prepare broker data with ID
    const brokerWithId = {
      id: brokerId,
      ...brokerData
    };
    
    if (existingBroker) {
      // Update existing broker
      const { data: updatedBroker, error: updateError } = await supabase
        .from('brokers')
        .update({
          name: brokerData.name,
          logo_url: brokerData.logo_url,
          rating: brokerData.rating,
          features: brokerData.features,
          fees: brokerData.fees,
          regulation: brokerData.regulation,
          updated_at: new Date().toISOString()
        })
        .eq('id', brokerId)
        .select()
        .single();
      
      if (updateError) {
        console.error(`❌ Error updating broker ${brokerData.name}:`, updateError);
        return false;
      }
      
      console.log(`🔄 Updated existing broker: ${updatedBroker.name}`);
      return true;
    } else {
      // Insert new broker
      const { data: newBroker, error: insertError } = await supabase
        .from('brokers')
        .insert(brokerWithId)
        .select()
        .single();
      
      if (insertError) {
        console.error(`❌ Error inserting broker ${brokerData.name}:`, insertError);
        return false;
      }
      
      console.log(`✅ Inserted new broker: ${newBroker.name}`);
      return true;
    }
  } catch (error) {
    console.error(`❌ Unexpected error with broker ${brokerData.name}:`, error);
    return false;
  }
}

async function importBrokers() {
  console.log('🚀 Starting broker import process...');
  console.log(`🎯 Target brokers: ${TARGET_BROKERS.join(', ')}`);
  
  const csvDir = path.join(__dirname, '..', 'brokerdatacsv');
  const csvFiles = fs.readdirSync(csvDir).filter(file => file.endsWith('.csv'));
  
  console.log(`📁 Found ${csvFiles.length} CSV files to process`);
  
  let allBrokers = [];
  
  // Process each CSV file
  for (const csvFile of csvFiles) {
    const filePath = path.join(csvDir, csvFile);
    try {
      const brokers = await processCsvFile(filePath);
      allBrokers = allBrokers.concat(brokers);
    } catch (error) {
      console.error(`❌ Failed to process ${csvFile}:`, error);
    }
  }
  
  // Remove duplicates based on broker name
  const uniqueBrokers = [];
  const seenNames = new Set();
  
  for (const broker of allBrokers) {
    const normalizedName = normalizeName(broker.name);
    if (!seenNames.has(normalizedName)) {
      seenNames.add(normalizedName);
      uniqueBrokers.push(broker);
    }
  }
  
  console.log(`📊 Found ${uniqueBrokers.length} unique target brokers to import`);
  
  // Import brokers
  let successCount = 0;
  let failCount = 0;
  
  for (const broker of uniqueBrokers) {
    const success = await insertBroker(broker);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n📈 Import Summary:`);
  console.log(`   ✅ Successfully imported: ${successCount}`);
  console.log(`   ❌ Failed to import: ${failCount}`);
  console.log(`   📊 Total processed: ${uniqueBrokers.length}`);
  
  // Verify imports
  console.log('\n🔍 Verifying imported brokers...');
  
  for (const targetBroker of TARGET_BROKERS) {
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, rating')
      .ilike('name', `%${targetBroker}%`);
    
    if (error) {
      console.log(`❌ Error checking ${targetBroker}:`, error.message);
    } else if (brokers && brokers.length > 0) {
      console.log(`✅ Found ${targetBroker}: ${brokers.map(b => `${b.name} (${b.rating})`).join(', ')}`);
    } else {
      console.log(`❌ Missing ${targetBroker}`);
    }
  }
  
  console.log('\n🎉 Broker import process completed!');
}

// Run the import
importBrokers().catch(console.error);