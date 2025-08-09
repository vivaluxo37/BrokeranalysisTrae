import fs from 'fs';
import path from 'path';

const fixBrokerVariables = () => {
  const brokersDir = path.join(process.cwd(), 'src', 'pages', 'brokers');
  
  if (!fs.existsSync(brokersDir)) {
    console.error('Brokers directory not found');
    return;
  }

  const brokerFiles = fs.readdirSync(brokersDir)
    .filter(file => file.endsWith('.tsx') && file !== 'index.tsx');

  console.log(`Found ${brokerFiles.length} broker files to fix`);

  brokerFiles.forEach(file => {
    const filePath = path.join(brokersDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace all instances of {broker. with {brokerData.
    content = content.replace(/\{broker\./g, '{brokerData.');
    
    // Write the fixed content back
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed variables in ${file}`);
  });

  console.log('All broker variable references have been fixed!');
};

// Run the script if called directly
if (import.meta.url.includes(process.argv[1]) || process.argv[1]?.includes('fixBrokerVariables')) {
  fixBrokerVariables();
}

export default fixBrokerVariables;