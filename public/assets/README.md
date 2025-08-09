# Asset Organization and Naming Conventions

## Directory Structure

```
public/assets/
├── brokers/
│   ├── logos/
│   │   ├── square/          # Square broker logos (64x64, 128x128, 256x256)
│   │   ├── horizontal/      # Horizontal broker logos for headers/banners
│   │   └── favicon/         # Small broker favicons (16x16, 32x32)
│   └── images/              # Additional broker images and graphics
└── icons/                   # UI icons and graphics
```

## Naming Conventions

### Broker Logos
- **Format**: `{broker-id}-{size}.{format}`
- **Examples**:
  - `fxpro-64.webp` (square logo, 64x64)
  - `fxpro-128.webp` (square logo, 128x128)
  - `fxpro-horizontal.webp` (horizontal logo)
  - `fxpro-favicon.webp` (favicon)

### Broker IDs
- Use lowercase, hyphenated format
- Examples: `fxpro`, `ic-markets`, `pepperstone`, `oanda`

### File Formats
- **Primary**: WebP format for optimal performance
- **Fallback**: PNG format for compatibility
- **Avoid**: JPEG for logos (poor quality with transparency)

### Size Standards
- **Square logos**: 64x64, 128x128, 256x256 pixels
- **Horizontal logos**: Variable width, 64px height standard
- **Favicons**: 16x16, 32x32 pixels

## File Organization Rules

1. **Consistent naming**: All files must follow the naming convention
2. **Size variants**: Provide multiple sizes for responsive design
3. **Format optimization**: Use WebP with PNG fallbacks
4. **Directory separation**: Keep different logo types in separate directories
5. **Documentation**: Update this README when adding new conventions

## Asset Optimization Guidelines

1. **Compression**: All images should be optimized for web
2. **Format selection**: WebP preferred, PNG for fallbacks
3. **Size limits**: 
   - Logos: Maximum 50KB per file
   - Images: Maximum 200KB per file
4. **Quality**: Maintain visual quality while optimizing file size

## Usage Examples

```typescript
// Square logo usage
const logoUrl = `/assets/brokers/logos/square/${brokerId}-128.webp`;

// Horizontal logo usage  
const horizontalLogoUrl = `/assets/brokers/logos/horizontal/${brokerId}-horizontal.webp`;

// Favicon usage
const faviconUrl = `/assets/brokers/logos/favicon/${brokerId}-favicon.webp`;
```

## Maintenance

- Regular cleanup of unused assets
- Periodic optimization of existing assets
- Version control for asset updates
- Documentation updates for new brokers