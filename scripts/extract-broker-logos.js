#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  sourceDir: path.join(__dirname, '..', 'Resources from other sites', 'img.brokersview.com', 'prod', 'ico', 'square'),
  targetDir: path.join(__dirname, '..', 'public', 'assets', 'brokers', 'logos'),
  sizes: [64, 128, 256],
  formats: ['png', 'webp'],
  fallbackImage: 'broker-fallback.png'
};

// Utility functions
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

function sanitizeBrokerName(filename) {
  // Remove file extension and convert to lowercase with hyphens
  return path.parse(filename).name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .trim();
}

function createBrokerMapping(brokerName, originalName) {
  const mapping = {
    id: sanitizeBrokerName(originalName),
    name: path.parse(originalName).name,
    originalName: originalName,
    assets: {
      original: `logos/original/${originalName}`,
      sizes: {}
    }
  };

  // Add size and format variations
  CONFIG.sizes.forEach(size => {
    mapping.assets.sizes[size] = {};
    CONFIG.formats.forEach(format => {
      mapping.assets.sizes[size][format] = `logos/${size}x${size}/${brokerName}.${format}`;
    });
  });

  return mapping;
}

async function processLogo(sourceFile, brokerName, originalName) {
  console.log(`\n📸 Processing: ${originalName}`);
  
  try {
    // Copy original file
    const originalDir = path.join(CONFIG.targetDir, 'original');
    ensureDirectoryExists(originalDir);
    fs.copyFileSync(sourceFile, path.join(originalDir, originalName));
    console.log(`  ✓ Copied original`);

    // Process different sizes and formats
    for (const size of CONFIG.sizes) {
      const sizeDir = path.join(CONFIG.targetDir, `${size}x${size}`);
      ensureDirectoryExists(sizeDir);

      for (const format of CONFIG.formats) {
        const outputPath = path.join(sizeDir, `${brokerName}.${format}`);
        
        await sharp(sourceFile)
          .resize(size, size, {
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0 }
          })
          .toFormat(format, {
            quality: format === 'webp' ? 90 : undefined,
            compressionLevel: format === 'png' ? 9 : undefined
          })
          .toFile(outputPath);
        
        console.log(`  ✓ Generated ${size}x${size} ${format.toUpperCase()}`);
      }
    }

    return createBrokerMapping(brokerName, originalName);
  } catch (error) {
    console.error(`  ❌ Error processing ${originalName}:`, error.message);
    return null;
  }
}

async function createFallbackImages() {
  console.log('\n🎨 Creating fallback images...');
  
  const fallbackSvg = `
    <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" fill="#f3f4f6" rx="8"/>
      <circle cx="128" cy="100" r="32" fill="#d1d5db"/>
      <rect x="64" y="160" width="128" height="16" fill="#d1d5db" rx="8"/>
      <rect x="80" y="184" width="96" height="12" fill="#e5e7eb" rx="6"/>
      <text x="128" y="220" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="12">No Logo</text>
    </svg>
  `;

  // Create fallback images in all sizes and formats
  for (const size of CONFIG.sizes) {
    const sizeDir = path.join(CONFIG.targetDir, `${size}x${size}`);
    ensureDirectoryExists(sizeDir);

    for (const format of CONFIG.formats) {
      const outputPath = path.join(sizeDir, `broker-fallback.${format}`);
      
      await sharp(Buffer.from(fallbackSvg))
        .resize(size, size)
        .toFormat(format, {
          quality: format === 'webp' ? 90 : undefined,
          compressionLevel: format === 'png' ? 9 : undefined
        })
        .toFile(outputPath);
      
      console.log(`  ✓ Created fallback ${size}x${size} ${format.toUpperCase()}`);
    }
  }

  // Also create original fallback
  const originalDir = path.join(CONFIG.targetDir, 'original');
  ensureDirectoryExists(originalDir);
  
  await sharp(Buffer.from(fallbackSvg))
    .resize(256, 256)
    .png()
    .toFile(path.join(originalDir, 'broker-fallback.png'));
  
  console.log(`  ✓ Created original fallback PNG`);
}

async function generateAssetMapping(brokerMappings) {
  console.log('\n📋 Generating asset mapping index...');
  
  const assetMapping = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    fallback: {
      original: 'logos/original/broker-fallback.png',
      sizes: {}
    },
    brokers: brokerMappings.filter(mapping => mapping !== null)
  };

  // Add fallback size mappings
  CONFIG.sizes.forEach(size => {
    assetMapping.fallback.sizes[size] = {};
    CONFIG.formats.forEach(format => {
      assetMapping.fallback.sizes[size][format] = `logos/${size}x${size}/broker-fallback.${format}`;
    });
  });

  const mappingPath = path.join(CONFIG.targetDir, 'asset-mapping.json');
  fs.writeFileSync(mappingPath, JSON.stringify(assetMapping, null, 2));
  
  console.log(`✓ Asset mapping saved to: ${mappingPath}`);
  console.log(`📊 Processed ${assetMapping.brokers.length} broker logos`);
  
  return assetMapping;
}

async function main() {
  console.log('🚀 Starting broker logo extraction and optimization...');
  console.log(`📁 Source: ${CONFIG.sourceDir}`);
  console.log(`📁 Target: ${CONFIG.targetDir}`);
  
  // Check if source directory exists
  if (!fs.existsSync(CONFIG.sourceDir)) {
    console.error(`❌ Source directory not found: ${CONFIG.sourceDir}`);
    process.exit(1);
  }

  // Ensure target directory structure exists
  ensureDirectoryExists(CONFIG.targetDir);

  // Get all PNG files from source directory
  const logoFiles = fs.readdirSync(CONFIG.sourceDir)
    .filter(file => path.extname(file).toLowerCase() === '.png');

  if (logoFiles.length === 0) {
    console.log('⚠️  No PNG files found in source directory');
    return;
  }

  console.log(`📋 Found ${logoFiles.length} logo files to process`);

  // Process each logo file
  const brokerMappings = [];
  for (const logoFile of logoFiles) {
    const sourceFile = path.join(CONFIG.sourceDir, logoFile);
    const brokerName = sanitizeBrokerName(logoFile);
    
    const mapping = await processLogo(sourceFile, brokerName, logoFile);
    if (mapping) {
      brokerMappings.push(mapping);
    }
  }

  // Create fallback images
  await createFallbackImages();

  // Generate asset mapping
  const assetMapping = await generateAssetMapping(brokerMappings);

  console.log('\n✅ Logo extraction and optimization completed successfully!');
  console.log(`\n📈 Summary:`);
  console.log(`   • Processed: ${assetMapping.brokers.length} broker logos`);
  console.log(`   • Sizes: ${CONFIG.sizes.join(', ')} pixels`);
  console.log(`   • Formats: ${CONFIG.formats.join(', ').toUpperCase()}`);
  console.log(`   • Total files generated: ${assetMapping.brokers.length * CONFIG.sizes.length * CONFIG.formats.length + CONFIG.sizes.length * CONFIG.formats.length + 1}`);
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

module.exports = { main, CONFIG };