# Broker Assets Management

This directory contains all broker-related assets for the BrokerAnalysis platform, including logos, screenshots, promotional images, and fallback assets.

## Directory Structure

```
public/assets/brokers/
├── logos/
│   ├── square/          # Square format logos (1:1 ratio)
│   ├── horizontal/      # Horizontal format logos
│   └── favicon/         # Small icon versions
├── images/
│   ├── screenshots/     # Platform interface screenshots
│   └── promotional/     # Marketing and promotional images
├── fallbacks/
│   ├── logos/          # Default logos for missing assets
│   └── images/         # Default images for missing assets
└── README.md           # This file
```

## Quick Start

### Adding New Broker Assets

1. **Prepare your assets** following the [naming conventions](../../../docs/asset-naming-conventions.md)
2. **Use the asset processor** to optimize and generate variants:
   ```bash
   npm run process-assets -- --broker="broker-name" --source="/path/to/assets"
   ```
3. **Verify the results** in the appropriate directories
4. **Update the asset manifest** (automatically done by the processor)

### Processing Existing Assets

```bash
# Process all assets for a specific broker
npm run process-assets -- --broker="acy-securities"

# Process specific asset types
npm run process-assets -- --type="logos" --broker="atfx"

# Batch process multiple brokers
npm run process-assets -- --batch --source="/path/to/broker/folders"
```

## Asset Requirements

### Logos

#### Required Variants
- **Square format**: For cards, lists, and square layouts
- **Horizontal format**: For headers and wide layouts
- **Favicon**: For browser tabs and small icons

#### Required Sizes
- **Small**: 64x64px (square), 128x32px (horizontal)
- **Medium**: 128x128px (square), 256x64px (horizontal)
- **Large**: 256x256px (square), 512x128px (horizontal)
- **Favicon**: 32x32px, 16x16px

#### Format Priority
1. **WebP** (primary, modern browsers)
2. **PNG** (fallback, transparency support)
3. **SVG** (vector graphics, scalable)

### Screenshots

#### Platform Types
- **web**: Web-based trading platforms
- **mobile**: Mobile app interfaces
- **desktop**: Desktop applications
- **mt4/mt5**: MetaTrader platforms
- **proprietary**: Broker-specific platforms

#### View Types
- **dashboard**: Main trading interface
- **charts**: Chart analysis views
- **orderbook**: Order book interfaces
- **portfolio**: Account/portfolio views
- **research**: Analysis and research tools

#### Required Sizes
- **Thumbnail**: 300x200px (preview cards)
- **Medium**: 600x400px (modal previews)
- **Large**: 1200x800px (detailed views)

### Promotional Images

#### Types
- **banner**: Website banners and headers
- **hero**: Hero section backgrounds
- **feature**: Feature highlight images
- **bonus**: Promotion and bonus graphics
- **award**: Awards and certifications

## File Naming Conventions

### Basic Format
```
{broker-name}-{asset-type}-{variant}-{size}.{extension}
```

### Examples
```
# Logos
acy-securities-small.webp
atfx-medium.png
thinkmarkets-large.svg

# Screenshots
acy-securities-web-dashboard-thumbnail.webp
atfx-mobile-charts-medium.webp
ig-group-mt4-orderbook-large.webp

# Promotional
thinkmarkets-banner-welcome-large.webp
plus500-hero-trading-medium.webp
```

### Broker Name Formatting
- **Lowercase only**: `acy-securities`, not `ACY-Securities`
- **Hyphen separation**: `think-markets`, not `think_markets`
- **No special characters**: Remove &, +, ., etc.
- **Consistent abbreviations**: Use standard forms

## Asset Processing

### Automated Pipeline

The asset processor automatically:
1. **Validates** file names and formats
2. **Optimizes** file sizes and quality
3. **Generates** multiple sizes and formats
4. **Creates** fallback assets
5. **Updates** asset manifests
6. **Validates** final output

### Manual Processing

#### Using the Asset Processor Script

```bash
# Basic usage
node scripts/asset-processor.js --broker="broker-name" --source="/path/to/assets"

# With specific options
node scripts/asset-processor.js \
  --broker="acy-securities" \
  --source="./raw-assets/acy" \
  --quality=85 \
  --formats="webp,png" \
  --sizes="small,medium,large"
```

#### Available Options

- `--broker`: Target broker identifier
- `--source`: Source directory with raw assets
- `--type`: Asset type (logos, screenshots, promotional)
- `--quality`: Compression quality (1-100)
- `--formats`: Output formats (webp, png, jpg, svg)
- `--sizes`: Size variants to generate
- `--force`: Overwrite existing assets
- `--dry-run`: Preview changes without applying

### Quality Standards

#### Compression Settings
- **WebP**: Quality 85, lossless for logos
- **PNG**: Compression level 6
- **JPEG**: Quality 85, progressive
- **SVG**: Minified and optimized

#### File Size Limits
- **Logos**: Maximum 500KB
- **Screenshots**: Maximum 2MB
- **Promotional**: Maximum 3MB
- **Favicons**: Maximum 50KB

## Asset Manifests

### Purpose
Asset manifests provide a structured index of all available assets for each broker, enabling:
- **Dynamic asset loading** in components
- **Fallback handling** for missing assets
- **Version tracking** and cache management
- **Automated validation** and testing

### Location
```
public/assets/brokers/manifests/{broker-name}.json
```

### Structure
```json
{
  "brokerId": "acy-securities",
  "name": "ACY Securities",
  "assets": {
    "logos": {
      "square": {
        "small": "/assets/brokers/logos/square/acy-securities-small.webp",
        "medium": "/assets/brokers/logos/square/acy-securities-medium.webp",
        "large": "/assets/brokers/logos/square/acy-securities-large.webp"
      }
    }
  },
  "fallbacks": {
    "logo": "/assets/brokers/fallbacks/logos/default-logo.svg",
    "image": "/assets/brokers/fallbacks/images/default-screenshot.webp"
  },
  "metadata": {
    "lastUpdated": "2025-01-08T20:20:00Z",
    "version": "1.0.0",
    "totalAssets": 15,
    "totalSize": "2.4MB"
  }
}
```

## Usage in Components

### React Hook for Asset Loading

```typescript
import { useBrokerAssets } from '@/hooks/useBrokerAssets';

function BrokerCard({ brokerId }: { brokerId: string }) {
  const { logo, screenshot, isLoading, error } = useBrokerAssets(brokerId);
  
  return (
    <div className="broker-card">
      <img 
        src={logo.square.medium} 
        alt={`${brokerId} logo`}
        onError={(e) => {
          e.currentTarget.src = logo.fallback;
        }}
      />
      {/* ... */}
    </div>
  );
}
```

### Asset Utility Functions

```typescript
import { getBrokerAsset, getBrokerLogo } from '@/utils/assetUtils';

// Get specific asset with fallback
const logoUrl = getBrokerLogo('acy-securities', 'square', 'medium');

// Get asset with automatic fallback
const screenshotUrl = getBrokerAsset('acy-securities', 'screenshot', 'web-dashboard-thumbnail');
```

## Fallback Strategy

### Hierarchy
1. **Requested asset** (exact match)
2. **Alternative size** (same type, different size)
3. **Alternative format** (same asset, different format)
4. **Broker fallback** (broker-specific default)
5. **Global fallback** (platform default)

### Implementation
```typescript
function getAssetWithFallback(brokerId: string, assetType: string, variant: string): string {
  // Try exact match
  let asset = getAsset(brokerId, assetType, variant);
  if (asset) return asset;
  
  // Try alternative sizes
  asset = getAssetAlternativeSize(brokerId, assetType);
  if (asset) return asset;
  
  // Try broker fallback
  asset = getBrokerFallback(brokerId, assetType);
  if (asset) return asset;
  
  // Use global fallback
  return getGlobalFallback(assetType);
}
```

## Performance Optimization

### Lazy Loading
```typescript
// Implement lazy loading for images
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      src={isInView ? src : undefined}
      alt={alt}
      onLoad={() => setIsLoaded(true)}
      {...props}
    />
  );
};
```

### Preloading Critical Assets
```typescript
// Preload critical broker logos
function preloadCriticalAssets(brokerIds: string[]) {
  brokerIds.forEach(brokerId => {
    const logoUrl = getBrokerLogo(brokerId, 'square', 'small');
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = logoUrl;
    document.head.appendChild(link);
  });
}
```

### CDN Integration
```typescript
// Configure CDN for asset delivery
const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL || '';

function getAssetUrl(path: string): string {
  return `${CDN_BASE}${path}`;
}
```

## Validation and Testing

### Asset Validation Script
```bash
# Validate all assets
npm run validate-assets

# Validate specific broker
npm run validate-assets -- --broker="acy-securities"

# Check for missing assets
npm run validate-assets -- --check-missing
```

### Automated Tests
```typescript
// Test asset availability
describe('Broker Assets', () => {
  test('should load all required logo variants', async () => {
    const brokers = await getBrokerList();
    
    for (const broker of brokers) {
      const manifest = await getBrokerManifest(broker.id);
      expect(manifest.assets.logos.square.small).toBeDefined();
      expect(manifest.assets.logos.square.medium).toBeDefined();
      expect(manifest.assets.logos.square.large).toBeDefined();
    }
  });
});
```

## Troubleshooting

### Common Issues

#### Missing Assets
```bash
# Check for missing assets
npm run validate-assets -- --check-missing

# Generate missing fallbacks
npm run process-assets -- --generate-fallbacks
```

#### Large File Sizes
```bash
# Re-optimize with lower quality
npm run process-assets -- --quality=75 --force

# Check file sizes
npm run validate-assets -- --check-sizes
```

#### Naming Convention Violations
```bash
# Validate naming conventions
npm run validate-assets -- --check-naming

# Auto-fix naming issues
npm run process-assets -- --fix-naming
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=assets:* npm run process-assets

# Verbose output
npm run process-assets -- --verbose
```

## Maintenance

### Regular Tasks

1. **Weekly**: Validate asset integrity
2. **Monthly**: Optimize file sizes and cleanup unused assets
3. **Quarterly**: Review and update naming conventions
4. **As needed**: Process new broker assets

### Cleanup Script
```bash
# Remove unused assets
npm run cleanup-assets

# Archive old versions
npm run archive-assets -- --older-than=6months
```

### Monitoring
```bash
# Generate asset report
npm run asset-report

# Check asset usage statistics
npm run asset-stats
```

## Contributing

### Adding New Brokers
1. Create broker directory structure
2. Add raw assets following naming conventions
3. Run asset processor
4. Validate results
5. Update documentation if needed

### Updating Existing Assets
1. Replace source assets
2. Re-run asset processor with `--force` flag
3. Validate changes
4. Update version in manifest

### Reporting Issues
When reporting asset-related issues, include:
- Broker ID and asset type
- Expected vs actual behavior
- Browser and device information
- Console errors (if any)

---

## Scripts Reference

| Script | Description |
|--------|-------------|
| `npm run process-assets` | Process and optimize broker assets |
| `npm run validate-assets` | Validate asset integrity and conventions |
| `npm run cleanup-assets` | Remove unused and outdated assets |
| `npm run asset-report` | Generate comprehensive asset report |
| `npm run asset-stats` | Show asset usage statistics |

## Related Documentation

- [Asset Naming Conventions](../../../docs/asset-naming-conventions.md)
- [Asset Processing Guidelines](../../../docs/asset-processing-guidelines.md)
- [Performance Optimization](../../../docs/performance-optimization.md)
- [Component Integration](../../../docs/component-integration.md)

---

*For questions or support, please refer to the project documentation or contact the development team.*