# Asset Serving Configuration for Vercel Deployment

This document outlines the asset serving configuration implemented for the BrokerAnalysis platform to ensure proper static asset delivery in the Vercel environment.

## Overview

The asset serving configuration ensures that all static assets (images, icons, CSS, JS) are properly served with correct paths and optimal caching headers in the Vercel deployment environment.

## Configuration Files

### 1. Vercel Configuration (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rootDirectory": "brokeranalysis",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(js|css|woff2?|png|jpe?g|webp|svg|ico))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Key Features:**
- **Caching Headers**: Long-term caching (1 year) for static assets with `immutable` flag
- **Asset Path Handling**: Proper routing for `/assets/` directory
- **File Type Coverage**: Covers all common asset file types (JS, CSS, images, fonts)
- **SPA Routing**: Fallback to `index.html` for client-side routing

### 2. Vite Configuration (`vite.config.ts`)

```typescript
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Organize assets by type for better caching
          if (/\.(png|jpe?g|webp|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(css)$/i.test(assetInfo.name || '')) {
            return `assets/css/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    }
  },
  publicDir: 'public'
});
```

**Key Features:**
- **Asset Organization**: Separates assets by type (images, CSS, fonts, JS)
- **Hash-based Naming**: Enables cache busting with content hashes
- **Public Directory**: Ensures `public/` assets are copied to build output

## Asset Directory Structure

```
public/
├── assets/
│   ├── brokers/
│   │   ├── logos/
│   │   │   ├── square/          # Square broker logos (64x64, 128x128, 256x256)
│   │   │   ├── horizontal/      # Horizontal broker logos
│   │   │   ├── favicon/         # Small broker favicons
│   │   │   └── asset-mapping.json
│   │   ├── images/              # Additional broker images
│   │   └── fallbacks/           # Fallback images
│   └── icons/                   # UI icons and graphics
│       ├── broker-placeholder.svg
│       └── broker-placeholder.webp
├── favicon.svg
└── vite.svg
```

## Asset Optimization Utilities

### Core Functions

1. **`getBrokerAssetPaths(brokerId: string)`**
   - Generates standardized asset paths for broker logos
   - Supports multiple sizes and formats

2. **`checkImageExists(url: string)`**
   - Validates asset accessibility
   - Used for fallback handling

3. **`validateAssetAccessibility()`**
   - Comprehensive asset validation
   - Returns detailed error and warning reports

4. **`getOptimizedImageProps(options)`**
   - Provides React-ready image props
   - Includes lazy loading and error handling

### Asset Testing

The configuration includes comprehensive testing utilities:

- **Node.js Script**: `npm run test:assets` - Tests asset existence in file system
- **Browser Component**: `AssetTestComponent` - Tests asset loading in browser
- **Build Verification**: `npm run verify:build` - Tests build output

## Testing Commands

```bash
# Test asset accessibility (file system)
npm run test:assets

# Build and test assets
npm run verify:build

# Development server with asset testing
npm run dev
# Then visit: http://localhost:5173/asset-test
```

## Vercel-Specific Optimizations

### 1. Cache Headers
- **Static Assets**: 1-year cache with `immutable` flag
- **Versioned Assets**: Content-based hashing prevents cache issues
- **Public Assets**: Served directly from CDN edge locations

### 2. Path Resolution
- **Absolute Paths**: All asset paths start with `/` for consistent resolution
- **No Double Slashes**: Path validation prevents malformed URLs
- **Environment Agnostic**: Works in both development and production

### 3. Error Handling
- **Graceful Fallbacks**: PNG fallbacks for WebP images
- **Placeholder Images**: Default broker placeholder for missing logos
- **Error Boundaries**: React error boundaries for asset loading failures

## Monitoring and Validation

### Automated Checks
1. **Build-time Validation**: Asset existence checked during build
2. **Runtime Validation**: Browser-based asset loading tests
3. **Path Structure Validation**: Ensures proper URL formatting

### Manual Verification
1. **Asset Test Page**: Visit `/asset-test` to verify asset loading
2. **Direct Asset Links**: Test individual asset URLs
3. **Network Tab**: Monitor asset loading in browser dev tools

## Troubleshooting

### Common Issues

1. **404 Errors for Assets**
   - Check `public/` directory structure
   - Verify Vite `publicDir` configuration
   - Ensure assets are included in build output

2. **Cache Issues**
   - Content hashes should prevent cache problems
   - Clear browser cache if needed
   - Check Vercel cache headers

3. **Path Resolution**
   - Use absolute paths starting with `/`
   - Avoid relative paths in asset references
   - Check for double slashes in URLs

### Debugging Commands

```bash
# Check build output
ls -la dist/assets/

# Test specific asset
curl -I https://your-domain.vercel.app/assets/icons/broker-placeholder.svg

# Run comprehensive tests
npm run verify:build
```

## Performance Considerations

1. **Image Formats**: WebP preferred with PNG fallbacks
2. **Lazy Loading**: Implemented for non-critical images
3. **Preloading**: Critical assets can be preloaded
4. **CDN Optimization**: Vercel CDN handles global distribution

## Security

1. **No Sensitive Data**: Assets contain no sensitive information
2. **Public Access**: All assets are publicly accessible by design
3. **Content Validation**: Asset content is validated during build

This configuration ensures reliable, performant, and maintainable asset serving for the BrokerAnalysis platform on Vercel.