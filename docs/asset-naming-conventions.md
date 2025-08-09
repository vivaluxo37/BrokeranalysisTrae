# Broker Asset Naming Conventions

## Overview

This document defines the standardized naming conventions for all broker assets in the BrokerAnalysis platform. Consistent naming ensures easy asset discovery, automated processing, and maintainable file organization.

## General Naming Rules

### Base Format
```
{broker-name}-{asset-type}-{variant}-{size}.{extension}
```

### Broker Name Formatting
- **Lowercase only**: All broker names must be in lowercase
- **Hyphen separation**: Use hyphens (-) to separate words
- **No special characters**: Remove all special characters except hyphens
- **No spaces**: Replace spaces with hyphens
- **Consistent abbreviations**: Use standardized abbreviations for common terms

#### Examples:
- "ACY Securities" → `acy-securities`
- "ATFX Global" → `atfx-global`
- "ThinkMarkets" → `thinkmarkets`
- "IG Group" → `ig-group`
- "Plus500 Ltd" → `plus500`

## Logo Assets

### Directory Structure
```
public/assets/brokers/logos/
├── square/
├── horizontal/
└── favicon/
```

### Naming Convention
```
{broker-name}-{size}.{extension}
```

### Logo Sizes
- **small**: 64x64px (for lists, cards)
- **medium**: 128x128px (for detailed views)
- **large**: 256x256px (for hero sections)
- **favicon**: 32x32px (for browser tabs)

### Logo Variants
- **square**: Square format logos (1:1 aspect ratio)
- **horizontal**: Horizontal format logos (wider than tall)
- **favicon**: Small icon versions for browser tabs

### Examples
```
# Square logos
acy-securities-small.webp
acy-securities-medium.webp
acy-securities-large.webp

# Horizontal logos
acy-securities-small.webp
acy-securities-medium.webp
acy-securities-large.webp

# Favicons
acy-securities-favicon.ico
acy-securities-favicon.png
```

## Image Assets

### Directory Structure
```
public/assets/brokers/images/
├── screenshots/
└── promotional/
```

### Screenshots
Platform interface screenshots and trading platform images.

#### Naming Convention
```
{broker-name}-{platform}-{view}-{size}.{extension}
```

#### Platform Types
- **web**: Web-based trading platform
- **mobile**: Mobile app interface
- **desktop**: Desktop application
- **mt4**: MetaTrader 4 platform
- **mt5**: MetaTrader 5 platform
- **proprietary**: Broker's proprietary platform

#### View Types
- **dashboard**: Main trading dashboard
- **charts**: Chart analysis view
- **orderbook**: Order book interface
- **portfolio**: Portfolio/account view
- **research**: Research and analysis tools

#### Screenshot Sizes
- **thumbnail**: 300x200px (for preview cards)
- **medium**: 600x400px (for modal previews)
- **large**: 1200x800px (for detailed views)

#### Examples
```
acy-securities-web-dashboard-thumbnail.webp
acy-securities-mobile-charts-medium.webp
atfx-mt4-orderbook-large.webp
thinkmarkets-proprietary-portfolio-thumbnail.webp
```

### Promotional Images
Marketing materials, banners, and promotional graphics.

#### Naming Convention
```
{broker-name}-{promo-type}-{campaign}-{size}.{extension}
```

#### Promotional Types
- **banner**: Website banners
- **hero**: Hero section images
- **feature**: Feature highlight images
- **bonus**: Bonus/promotion graphics
- **award**: Award and certification images

#### Examples
```
acy-securities-banner-welcome-large.webp
atfx-hero-trading-medium.webp
thinkmarkets-feature-research-tools-small.webp
ig-group-bonus-cashback-thumbnail.webp
```

## Fallback Assets

### Directory Structure
```
public/assets/brokers/fallbacks/
├── logos/
└── images/
```

### Naming Convention
```
{broker-name}-fallback-{asset-type}.{extension}
```

### Examples
```
acy-securities-fallback-logo.png
atfx-fallback-screenshot.webp
default-fallback-logo.svg
default-fallback-image.webp
```

## File Format Standards

### Preferred Formats (in order of preference)
1. **WebP**: Modern format with excellent compression
2. **PNG**: For logos with transparency
3. **JPEG**: For photographs and complex images
4. **SVG**: For vector graphics and icons

### Format Usage Guidelines
- **Logos**: WebP primary, PNG fallback
- **Screenshots**: WebP primary, JPEG fallback
- **Promotional**: WebP primary, JPEG fallback
- **Favicons**: ICO primary, PNG fallback
- **Fallbacks**: SVG for logos, WebP for images

## Quality Standards

### Compression Settings
- **WebP**: Quality 85, lossless for logos
- **PNG**: Compression level 6, optimize for size
- **JPEG**: Quality 85, progressive encoding
- **SVG**: Minified, optimized paths

### Image Requirements
- **Minimum resolution**: 64x64px for logos, 300x200px for images
- **Maximum file size**: 500KB for logos, 2MB for images
- **Color space**: sRGB
- **Background**: Transparent for logos (when possible)

## Automated Processing

### Asset Pipeline
The asset processing pipeline automatically:
1. Validates naming conventions
2. Generates multiple sizes and formats
3. Optimizes file sizes
4. Creates fallback assets
5. Updates asset manifests

### Validation Rules
- File names must match the defined patterns
- Images must meet minimum quality standards
- File sizes must be within acceptable limits
- Required variants must be present

## Asset Manifest

### Structure
Each broker should have an asset manifest file:
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
      },
      "horizontal": {
        "small": "/assets/brokers/logos/horizontal/acy-securities-small.webp",
        "medium": "/assets/brokers/logos/horizontal/acy-securities-medium.webp",
        "large": "/assets/brokers/logos/horizontal/acy-securities-large.webp"
      },
      "favicon": "/assets/brokers/logos/favicon/acy-securities-favicon.ico"
    },
    "images": {
      "screenshots": [
        {
          "platform": "web",
          "view": "dashboard",
          "sizes": {
            "thumbnail": "/assets/brokers/images/screenshots/acy-securities-web-dashboard-thumbnail.webp",
            "medium": "/assets/brokers/images/screenshots/acy-securities-web-dashboard-medium.webp",
            "large": "/assets/brokers/images/screenshots/acy-securities-web-dashboard-large.webp"
          }
        }
      ],
      "promotional": [
        {
          "type": "banner",
          "campaign": "welcome",
          "sizes": {
            "large": "/assets/brokers/images/promotional/acy-securities-banner-welcome-large.webp"
          }
        }
      ]
    }
  },
  "fallbacks": {
    "logo": "/assets/brokers/fallbacks/logos/acy-securities-fallback-logo.png",
    "image": "/assets/brokers/fallbacks/images/acy-securities-fallback-screenshot.webp"
  },
  "lastUpdated": "2025-01-08T20:20:00Z",
  "version": "1.0.0"
}
```

## Migration Guidelines

### Existing Assets
1. **Audit current assets**: Identify all existing broker assets
2. **Rename files**: Apply new naming conventions
3. **Generate missing variants**: Create required sizes and formats
4. **Update references**: Update all code references to new paths
5. **Validate integrity**: Ensure all assets are accessible

### New Assets
1. **Follow conventions**: Use the defined naming patterns
2. **Process through pipeline**: Use the automated asset processor
3. **Update manifests**: Ensure asset manifests are updated
4. **Test integration**: Verify assets display correctly

## Best Practices

### File Organization
- Keep directory structure flat within each category
- Use consistent naming across all assets
- Maintain asset manifests for each broker
- Regular cleanup of unused assets

### Performance Optimization
- Prefer WebP format for modern browsers
- Provide fallback formats for compatibility
- Use appropriate compression settings
- Implement lazy loading for images

### Maintenance
- Regular asset audits
- Automated validation in CI/CD
- Version control for asset changes
- Documentation updates with new conventions

## Tools and Scripts

### Asset Processor
Use the `asset-processor.ts` script for:
- Batch processing of broker assets
- Format conversion and optimization
- Generating missing variants
- Creating fallback assets

### Validation Script
Use validation tools to:
- Check naming convention compliance
- Verify file integrity
- Identify missing assets
- Generate asset reports

---

*This document should be updated whenever naming conventions change. All team members should follow these guidelines to ensure consistency across the platform.*