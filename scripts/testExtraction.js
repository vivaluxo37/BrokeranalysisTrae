const fs = require('fs');
const path = require('path');

console.log('Testing data extraction...');

try {
  const filePath = path.join(
    process.cwd(),
    'Resources from other sites',
    'frontendapi.brokersview.com',
    'spread',
    'overview.html'
  );
  
  console.log('Reading file:', filePath);
  
  if (!fs.existsSync(filePath)) {
    console.error('File does not exist:', filePath);
    process.exit(1);
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  console.log('File content length:', fileContent.length);
  
  // Parse the outer JSON response
  const response = JSON.parse(fileContent);
  console.log('Response code:', response.code);
  console.log('Response message:', response.message);
  
  if (response.code !== 0) {
    console.error('API response error:', response.message);
    process.exit(1);
  }
  
  // Parse the inner bodyMessage JSON
  const jsonData = JSON.parse(response.bodyMessage);
  console.log('Data list length:', jsonData.dataList.length);
  
  // Show first broker
  if (jsonData.dataList.length > 0) {
    console.log('First broker:', JSON.stringify(jsonData.dataList[0], null, 2));
  }
  
  console.log('Test completed successfully!');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}