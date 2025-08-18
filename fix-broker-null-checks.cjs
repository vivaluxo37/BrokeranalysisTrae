const fs = require('fs');
const path = require('path');

// Define the regex patterns and their replacements
const replacements = [
  // Summary cards null checks
  {
    pattern: /\{brokerData\.regulators\.join\(', '\)\}/g,
    replacement: '{(brokerData?.regulators || []).join(\', \')}'  
  },
  {
    pattern: /\{brokerData\.assetClasses\.length\}/g,
    replacement: '{(brokerData?.assetClasses || []).length}'
  },
  {
    pattern: /\{brokerData\.platforms\.length\}/g,
    replacement: '{(brokerData?.platforms || []).length}'
  },
  // Map operations null checks
  {
    pattern: /\{brokerData\.platforms\.map\(/g,
    replacement: '{(brokerData?.platforms || []).map('
  },
  {
    pattern: /\{brokerData\.assetClasses\.map\(/g,
    replacement: '{(brokerData?.assetClasses || []).map('
  },
  // Regulators array access
  {
    pattern: /\{brokerData\.regulators\[0\]\}/g,
    replacement: "{(brokerData?.regulators || [])[0] || 'N/A'}"
  }
];

function fixBrokerFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changes = [];
    
    replacements.forEach((replacement, index) => {
      const matches = content.match(replacement.pattern);
      if (matches) {
        content = content.replace(replacement.pattern, replacement.replacement);
        modified = true;
        changes.push(`Pattern ${index + 1}: ${matches.length} replacements`);
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${path.basename(filePath)}`);
      changes.forEach(change => console.log(`   - ${change}`));
      return true;
    } else {
      console.log(`⏭️  Skipped: ${path.basename(filePath)} (no changes needed)`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function fixAllBrokerFiles(testMode = false, testFiles = []) {
  const brokersDir = path.join(__dirname, 'src', 'pages', 'brokers');
  
  if (!fs.existsSync(brokersDir)) {
    console.error('❌ Brokers directory not found:', brokersDir);
    return;
  }
  
  let filesToProcess;
  
  if (testMode && testFiles.length > 0) {
    filesToProcess = testFiles.map(file => path.join(brokersDir, file));
    console.log('🧪 Running in TEST MODE on specific files:');
  } else {
    const allFiles = fs.readdirSync(brokersDir)
      .filter(file => file.endsWith('.tsx'))
      .map(file => path.join(brokersDir, file));
    filesToProcess = allFiles;
    console.log(`🔧 Processing ${allFiles.length} broker files...`);
  }
  
  let fixedCount = 0;
  let totalCount = filesToProcess.length;
  
  filesToProcess.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      if (fixBrokerFile(filePath)) {
        fixedCount++;
      }
    } else {
      console.log(`⚠️  File not found: ${path.basename(filePath)}`);
    }
  });
  
  console.log(`\n📊 Summary: ${fixedCount}/${totalCount} files modified`);
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('--test')) {
  // Test mode with specific files
  const testFiles = ['interactive-brokers.tsx', 'charles-schwab.tsx'];
  fixAllBrokerFiles(true, testFiles);
} else if (args.includes('--all')) {
  // Process all files
  fixAllBrokerFiles(false);
} else {
  console.log('Usage:');
  console.log('  node fix-broker-null-checks.js --test    # Test on interactive-brokers.tsx and charles-schwab.tsx');
  console.log('  node fix-broker-null-checks.js --all     # Process all broker files');
}