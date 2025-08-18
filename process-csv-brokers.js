import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔧 Environment check:');
console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? 'Set' : 'Not set');
console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
console.log('__dirname:', __dirname);

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);



// Helper function to parse CSV data
function parseCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// Helper function to create a slug from broker name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Function to normalize broker data from different CSV formats
function normalizeBrokerData(rawData, fileName) {
  console.log(`\n📋 Processing broker data from ${fileName}:`);
  console.log('Raw data keys:', Object.keys(rawData));
  
  // Handle different CSV formats
  let brokerName = rawData['Broker Name'] || rawData['broker_name'] || rawData['name'];
  
  if (!brokerName || brokerName.trim() === '') {
    console.log('⚠️  No broker name found, skipping entry');
    return null;
  }

  // Extract and combine features from various CSV fields
  const features = [];
  if (rawData['Key Trading Features']) features.push(rawData['Key Trading Features']);
  if (rawData['Platform Features']) features.push(rawData['Platform Features']);
  if (rawData['Desktop platform features']) features.push(rawData['Desktop platform features']);
  if (rawData['Mobile app features']) features.push(rawData['Mobile app features']);
  
  // Extract and combine fee information
  const fees = [];
  if (rawData['Trading fee breakdown']) fees.push(`Trading: ${rawData['Trading fee breakdown']}`);
  if (rawData['Non-trading fee breakdown']) fees.push(`Non-trading: ${rawData['Non-trading fee breakdown']}`);
  if (rawData['Commission details']) fees.push(`Commission: ${rawData['Commission details']}`);
  if (rawData['Stock Trading Fees']) fees.push(`Stock: ${rawData['Stock Trading Fees']}`);
  if (rawData['Forex Trading Fees']) fees.push(`Forex: ${rawData['Forex Trading Fees']}`);
  if (rawData['CFD Trading Fees']) fees.push(`CFD: ${rawData['CFD Trading Fees']}`);
  if (rawData['Crypto Trading Fees']) fees.push(`Crypto: ${rawData['Crypto Trading Fees']}`);
  
  // Extract regulation information
  const regulation = [];
  if (rawData['Country / Regulation info']) regulation.push(rawData['Country / Regulation info']);
  if (rawData['Regulatory Bodies']) regulation.push(rawData['Regulatory Bodies']);
  if (rawData['Regulatory bodies']) regulation.push(rawData['Regulatory bodies']);
  if (rawData['Investor Protection']) regulation.push(`Protection: ${rawData['Investor Protection']}`);
  if (rawData['Investor protection details']) regulation.push(`Protection: ${rawData['Investor protection details']}`);

  const normalizedData = {
    id: createSlug(brokerName.trim()),
    name: brokerName.trim(),
    logo_url: rawData['Broker Logo URL'] || rawData['logo_url'] || null,
    rating: parseFloat(rawData['Rating'] || rawData['Overall Rating'] || rawData['Overall Rating (numeric)'] || rawData['rating'] || 0) || null,
    review_count: 0, // Default value, can be updated later
    features: features.length > 0 ? features.join('; ') : null,
    fees: fees.length > 0 ? fees.join('; ') : null,
    regulation: regulation.length > 0 ? regulation.join('; ') : null,
    is_active: true
    // Note: created_at and updated_at will be handled by database defaults
  };

  console.log(`✅ Normalized data for ${brokerName}:`, {
    id: normalizedData.id,
    name: normalizedData.name,
    rating: normalizedData.rating,
    has_logo: !!normalizedData.logo_url,
    has_features: !!normalizedData.features,
    has_fees: !!normalizedData.fees,
    has_regulation: !!normalizedData.regulation
  });

  return normalizedData;
}

// Function to check if broker exists in database
async function checkBrokerExists(name) {
  try {
    const { data, error } = await supabase
      .from('brokers')
      .select('id, name')
      .eq('name', name);
    
    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error checking broker existence:', error);
    return null;
  }
}

// Function to insert or update broker in database
async function upsertBroker(brokerData) {
  try {
    // Check if broker already exists by ID
    const { data: existingBroker, error: selectError } = await supabase
      .from('brokers')
      .select('id, name')
      .eq('id', brokerData.id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') {
      console.error('❌ Error checking existing broker:', selectError);
      return { action: 'error', error: selectError.message };
    }
    
    if (existingBroker) {
      console.log(`🔄 Updating existing broker: ${brokerData.name} (ID: ${existingBroker.id})`);
      
      // Remove id from update data since it's the primary key
      const { id, ...updateData } = brokerData;
      const { data, error } = await supabase
        .from('brokers')
        .update(updateData)
        .eq('id', existingBroker.id)
        .select();
      
      if (error) {
        console.error(`❌ Error updating broker ${brokerData.name}:`, error.message);
        return { action: 'error', error: error.message };
      }
      console.log(`✅ Updated broker: ${brokerData.name}`);
      return { action: 'updated', data: data[0] };
    } else {
      console.log(`➕ Creating new broker: ${brokerData.name} (ID: ${brokerData.id})`);
      
      // Insert new broker
      const { data, error } = await supabase
        .from('brokers')
        .insert([brokerData])
        .select();
      
      if (error) {
        console.error(`❌ Error creating broker ${brokerData.name}:`, error.message);
        return { action: 'error', error: error.message };
      }
      console.log(`✅ Created new broker: ${brokerData.name}`);
      return { action: 'created', data: data[0] };
    }
  } catch (error) {
    console.error(`❌ Unexpected error upserting broker ${brokerData.name}:`, error);
    return { action: 'error', error: error.message };
  }
}

// Main function to process all CSV files
async function processAllCSVFiles() {
  console.log('🚀 Starting CSV broker data processing...');
  
  const csvDirectory = path.join(__dirname, 'brokerdatacsv');
  const csvFiles = fs.readdirSync(csvDirectory).filter(file => file.endsWith('.csv'));
  
  console.log(`📁 Found ${csvFiles.length} CSV files:`, csvFiles);
  
  const results = {
    created: [],
    updated: [],
    errors: [],
    skipped: []
  };
  
  for (const csvFile of csvFiles) {
    console.log(`\n📄 Processing file: ${csvFile}`);
    const filePath = path.join(csvDirectory, csvFile);
    
    try {
      const csvData = await parseCSVFile(filePath);
      console.log(`📊 Found ${csvData.length} rows in ${csvFile}`);
      
      for (const rawRow of csvData) {
        const normalizedData = normalizeBrokerData(rawRow, csvFile);
        
        if (!normalizedData) {
          results.skipped.push({ file: csvFile, reason: 'No broker name found' });
          continue;
        }
        
        const result = await upsertBroker(normalizedData);
        
        switch (result.action) {
          case 'created':
            results.created.push({ broker: normalizedData.name, file: csvFile });
            break;
          case 'updated':
            results.updated.push({ broker: normalizedData.name, file: csvFile });
            break;
          case 'error':
            results.errors.push({ broker: normalizedData.name, file: csvFile, error: result.error });
            break;
        }
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (error) {
      console.error(`❌ Error processing file ${csvFile}:`, error);
      results.errors.push({ file: csvFile, error: error.message });
    }
  }
  
  // Print summary
  console.log('\n📈 PROCESSING SUMMARY:');
  console.log('='.repeat(50));
  console.log(`✅ Created: ${results.created.length} brokers`);
  results.created.forEach(item => console.log(`   - ${item.broker} (from ${item.file})`));
  
  console.log(`🔄 Updated: ${results.updated.length} brokers`);
  results.updated.forEach(item => console.log(`   - ${item.broker} (from ${item.file})`));
  
  console.log(`⚠️  Skipped: ${results.skipped.length} entries`);
  results.skipped.forEach(item => console.log(`   - ${item.reason} (from ${item.file})`));
  
  console.log(`❌ Errors: ${results.errors.length}`);
  results.errors.forEach(item => console.log(`   - ${item.broker || item.file}: ${item.error}`));
  
  console.log('\n🎉 CSV processing completed!');
  
  return results;
}

// Run the script
console.log('🔍 Checking execution condition...');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);

// Convert Windows path to file URL format
const normalizedArgv = process.argv[1].replace(/\\/g, '/');
const expectedUrl = `file:///${normalizedArgv}`;
console.log('Expected URL:', expectedUrl);
console.log('Condition result:', import.meta.url === expectedUrl);

if (import.meta.url === expectedUrl || import.meta.url.endsWith('process-csv-brokers.js')) {
  console.log('✅ Starting CSV processing...');
  processAllCSVFiles()
    .then(results => {
      console.log('\n✨ All done! Check the summary above for details.');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
} else {
  console.log('❌ Script not executed directly, skipping processing.');
}

export { processAllCSVFiles, normalizeBrokerData, upsertBroker };