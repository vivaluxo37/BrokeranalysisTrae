# BrokerAnalysis Platform - Broker Integration Project
## Asset Optimization Guidelines

## Overview

This document provides comprehensive guidelines for optimizing broker assets including logos, images, and other visual resources. The optimization strategy focuses on performance, accessibility, and maintaining visual quality across different devices and network conditions.

## Asset Directory Structure

### Recommended Directory Organization

```
public/assets/brokers/
├── logos/
│   ├── square/
│   │   ├── webp/
│   │   │   ├── 64x64/
│   │   │   ├── 128x128/
│   │   │   └── 256x256/
│   │   ├── png/
│   │   │   ├── 64x64/
│   │   │   ├── 128x128/
│   │   │   └── 256x256/
│   │   └── svg/ (if available)
│   ├── horizontal/
│   │   ├── webp/
│   │   │   ├── small/ (200x80)
│   │   │   ├── medium/ (400x160)
│   │   │   └── large/ (800x320)
│   │   └── png/
│   │       ├── small/
│   │       ├── medium/
│   │       └── large/
│   ├── favicons/
│   │   ├── webp/
│   │   │   ├── 16x16/
│   │   │   ├── 32x32/
│   │   │   └── 64x64/
│   │   └── png/
│   │       ├── 16x16/
│   │       ├── 32x32/
│   │       └── 64x64/
│   └── symbols/ (icon-only versions)
│       ├── webp/
│       └── png/
├── images/
│   ├── screenshots/
│   │   ├── platforms/
│   │   ├── mobile-apps/
│   │   └── web-interfaces/
│   ├── banners/
│   └── promotional/
└── fallbacks/
    ├── default-logo.webp
    ├── default-logo.png
    ├── loading-placeholder.svg
    └── error-placeholder.svg
```

## Logo Optimization Standards

### 1. Format Specifications

#### WebP Format (Primary)
- **Quality**: 85-90% for logos with gradients, 95% for simple logos
- **Compression**: Lossless for logos with text, lossy for photographic elements
- **Color Profile**: sRGB
- **Metadata**: Strip all unnecessary metadata

#### PNG Format (Fallback)
- **Bit Depth**: 24-bit for full color, 8-bit for simple logos
- **Compression**: Maximum compression without quality loss
- **Transparency**: Preserve alpha channel for transparent backgrounds
- **Interlacing**: Progressive for larger files (>50KB)

#### SVG Format (When Available)
- **Optimization**: Remove unnecessary elements, comments, and metadata
- **Minification**: Compress paths and remove whitespace
- **Accessibility**: Include proper title and description elements
- **Fallback**: Always provide raster alternatives

### 2. Size Guidelines

#### Square Logos
```typescript
const SQUARE_LOGO_SIZES = {
  small: { width: 64, height: 64 },    // List views, small cards
  medium: { width: 128, height: 128 }, // Standard cards, comparison tables
  large: { width: 256, height: 256 }   // Detailed views, hero sections
};
```

#### Horizontal Logos
```typescript
const HORIZONTAL_LOGO_SIZES = {
  small: { width: 200, height: 80 },   // Compact layouts
  medium: { width: 400, height: 160 }, // Standard layouts
  large: { width: 800, height: 320 }   // Hero sections, banners
};
```

#### Favicons
```typescript
const FAVICON_SIZES = {
  small: { width: 16, height: 16 },    // Browser tabs
  medium: { width: 32, height: 32 },   // Bookmarks, shortcuts
  large: { width: 64, height: 64 }     // High-DPI displays
};
```

### 3. Naming Conventions

```typescript
// File naming pattern: {broker-id}-{variant}.{format}
// Examples:
const NAMING_EXAMPLES = {
  square: {
    webp: 'ig-markets.webp',
    png: 'ig-markets.png',
    svg: 'ig-markets.svg'
  },
  horizontal: {
    webp: 'ig-markets-horizontal.webp',
    png: 'ig-markets-horizontal.png'
  },
  favicon: {
    webp: 'ig-markets-favicon.webp',
    png: 'ig-markets-favicon.png'
  },
  symbol: {
    webp: 'ig-markets-symbol.webp',
    png: 'ig-markets-symbol.png'
  }
};
```

## Asset Processing Pipeline

### 1. Automated Processing Script

```typescript
// scripts/processAssets.ts
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

interface ProcessingOptions {
  inputDir: string;
  outputDir: string;
  formats: ('webp' | 'png' | 'jpg')[];
  sizes: { width: number; height: number; name: string }[];
  quality: number;
  preserveAspectRatio: boolean;
}

export class AssetProcessor {
  private options: ProcessingOptions;

  constructor(options: ProcessingOptions) {
    this.options = options;
  }

  async processLogo(inputPath: string, brokerId: string): Promise<void> {
    const inputBuffer = await fs.readFile(inputPath);
    const metadata = await sharp(inputBuffer).metadata();

    console.log(`Processing logo for ${brokerId}:`, {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      size: `${(inputBuffer.length / 1024).toFixed(2)}KB`
    });

    // Process each size variant
    for (const size of this.options.sizes) {
      await this.generateSizeVariants(inputBuffer, brokerId, size);
    }
  }

  private async generateSizeVariants(
    inputBuffer: Buffer,
    brokerId: string,
    size: { width: number; height: number; name: string }
  ): Promise<void> {
    const baseProcessor = sharp(inputBuffer)
      .resize(size.width, size.height, {
        fit: this.options.preserveAspectRatio ? 'inside' : 'fill',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      });

    // Generate WebP version
    if (this.options.formats.includes('webp')) {
      const webpPath = path.join(
        this.options.outputDir,
        'webp',
        `${size.width}x${size.height}`,
        `${brokerId}.webp`
      );
      
      await this.ensureDirectoryExists(path.dirname(webpPath));
      await baseProcessor
        .clone()
        .webp({ 
          quality: this.options.quality,
          effort: 6,
          lossless: false
        })
        .toFile(webpPath);

      console.log(`Generated WebP: ${webpPath}`);
    }

    // Generate PNG version
    if (this.options.formats.includes('png')) {
      const pngPath = path.join(
        this.options.outputDir,
        'png',
        `${size.width}x${size.height}`,
        `${brokerId}.png`
      );
      
      await this.ensureDirectoryExists(path.dirname(pngPath));
      await baseProcessor
        .clone()
        .png({ 
          quality: 95,
          compressionLevel: 9,
          progressive: true
        })
        .toFile(pngPath);

      console.log(`Generated PNG: ${pngPath}`);
    }
  }

  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  async generateFallbackImages(): Promise<void> {
    const fallbackDir = path.join(this.options.outputDir, '..', 'fallbacks');
    await this.ensureDirectoryExists(fallbackDir);

    // Generate default logo placeholder
    const defaultLogo = sharp({
      create: {
        width: 256,
        height: 256,
        channels: 4,
        background: { r: 240, g: 240, b: 240, alpha: 1 }
      }
    })
    .composite([{
      input: Buffer.from(`
        <svg width="256" height="256" xmlns="http://www.w3.org/2000/svg">
          <rect width="256" height="256" fill="#f0f0f0"/>
          <text x="128" y="128" text-anchor="middle" dy=".3em" 
                font-family="Arial, sans-serif" font-size="24" fill="#999">
            No Logo
          </text>
        </svg>
      `),
      top: 0,
      left: 0
    }]);

    await defaultLogo.webp({ quality: 90 }).toFile(path.join(fallbackDir, 'default-logo.webp'));
    await defaultLogo.png({ quality: 95 }).toFile(path.join(fallbackDir, 'default-logo.png'));

    console.log('Generated fallback images');
  }
}

// Usage example
export async function processBrokerLogos(): Promise<void> {
  const processor = new AssetProcessor({
    inputDir: './resources/img.brokersview.com/prod/ico/square',
    outputDir: './public/assets/brokers/logos/square',
    formats: ['webp', 'png'],
    sizes: [
      { width: 64, height: 64, name: 'small' },
      { width: 128, height: 128, name: 'medium' },
      { width: 256, height: 256, name: 'large' }
    ],
    quality: 90,
    preserveAspectRatio: true
  });

  // Process all logos in the input directory
  const inputFiles = await fs.readdir(processor.options.inputDir);
  
  for (const file of inputFiles) {
    if (file.match(/\.(png|jpg|jpeg|webp)$/i)) {
      const brokerId = path.basename(file, path.extname(file))
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-');
      
      const inputPath = path.join(processor.options.inputDir, file);
      await processor.processLogo(inputPath, brokerId);
    }
  }

  await processor.generateFallbackImages();
}
```

### 2. Quality Validation

```typescript
// scripts/validateAssets.ts
import sharp from 'sharp';
import { promises as fs } from 'fs';

interface AssetValidationResult {
  path: string;
  valid: boolean;
  issues: string[];
  metadata: {
    format: string;
    width: number;
    height: number;
    size: number;
    quality?: number;
  };
}

export class AssetValidator {
  async validateAsset(filePath: string): Promise<AssetValidationResult> {
    const issues: string[] = [];
    let valid = true;

    try {
      const buffer = await fs.readFile(filePath);
      const metadata = await sharp(buffer).metadata();
      
      const result: AssetValidationResult = {
        path: filePath,
        valid: true,
        issues: [],
        metadata: {
          format: metadata.format || 'unknown',
          width: metadata.width || 0,
          height: metadata.height || 0,
          size: buffer.length
        }
      };

      // Validate file size
      if (buffer.length > 500 * 1024) { // 500KB limit
        issues.push(`File size too large: ${(buffer.length / 1024).toFixed(2)}KB`);
        valid = false;
      }

      // Validate dimensions
      if (!metadata.width || !metadata.height) {
        issues.push('Invalid dimensions');
        valid = false;
      }

      // Validate format
      if (!['webp', 'png', 'svg'].includes(metadata.format || '')) {
        issues.push(`Unsupported format: ${metadata.format}`);
        valid = false;
      }

      // Validate aspect ratio for square logos
      if (filePath.includes('/square/') && metadata.width !== metadata.height) {
        issues.push('Square logo must have 1:1 aspect ratio');
        valid = false;
      }

      result.valid = valid;
      result.issues = issues;
      return result;

    } catch (error) {
      return {
        path: filePath,
        valid: false,
        issues: [`Processing error: ${error.message}`],
        metadata: {
          format: 'unknown',
          width: 0,
          height: 0,
          size: 0
        }
      };
    }
  }

  async validateDirectory(dirPath: string): Promise<AssetValidationResult[]> {
    const results: AssetValidationResult[] = [];
    const files = await this.getAllFiles(dirPath);

    for (const file of files) {
      if (file.match(/\.(webp|png|svg)$/i)) {
        const result = await this.validateAsset(file);
        results.push(result);
      }
    }

    return results;
  }

  private async getAllFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      if (item.isDirectory()) {
        files.push(...await this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }
}
```

## Fallback System Implementation

### 1. Image Loading Component

```typescript
// src/components/common/OptimizedImage.tsx
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
  placeholder?: 'blur' | 'skeleton' | 'none';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = '/assets/brokers/fallbacks/default-logo.webp',
  placeholder = 'skeleton',
  priority = false,
  onLoad,
  onError
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
    onError?.();
  }, [currentSrc, fallbackSrc, onError]);

  // Generate WebP and fallback sources
  const webpSrc = currentSrc.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const pngSrc = currentSrc.replace(/\.webp$/i, '.png');

  if (hasError) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400',
          className
        )}
        style={{ width, height }}
      >
        <svg 
          className="w-8 h-8" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)} style={{ width, height }}>
      {isLoading && placeholder === 'skeleton' && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
      
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <source srcSet={pngSrc} type="image/png" />
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100',
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </picture>
    </div>
  );
};
```

### 2. Broker Logo Component

```typescript
// src/components/common/BrokerLogo.tsx
import React from 'react';
import { OptimizedImage } from './OptimizedImage';
import { Broker } from '@/types/broker';

interface BrokerLogoProps {
  broker: Broker;
  variant?: 'square' | 'horizontal' | 'favicon' | 'symbol';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  priority?: boolean;
}

export const BrokerLogo: React.FC<BrokerLogoProps> = ({
  broker,
  variant = 'square',
  size = 'medium',
  className,
  priority = false
}) => {
  const logoVariant = broker.logo[variant];
  const webpSrc = logoVariant?.webp?.[size];
  const pngSrc = logoVariant?.png?.[size];
  const svgSrc = logoVariant?.svg;

  // Determine dimensions based on variant and size
  const dimensions = getDimensions(variant, size);
  
  // Use SVG if available and appropriate
  const primarySrc = svgSrc || webpSrc || pngSrc;
  const fallbackSrc = pngSrc || webpSrc;

  if (!primarySrc) {
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gray-100 text-gray-400 rounded',
          className
        )}
        style={dimensions}
      >
        <span className="text-xs font-medium">
          {broker.name.substring(0, 2).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <OptimizedImage
      src={primarySrc}
      alt={`${broker.name} logo`}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      fallbackSrc={fallbackSrc}
      priority={priority}
    />
  );
};

function getDimensions(variant: string, size: string) {
  const sizeMap = {
    square: {
      small: { width: 64, height: 64 },
      medium: { width: 128, height: 128 },
      large: { width: 256, height: 256 }
    },
    horizontal: {
      small: { width: 200, height: 80 },
      medium: { width: 400, height: 160 },
      large: { width: 800, height: 320 }
    },
    favicon: {
      small: { width: 16, height: 16 },
      medium: { width: 32, height: 32 },
      large: { width: 64, height: 64 }
    },
    symbol: {
      small: { width: 48, height: 48 },
      medium: { width: 96, height: 96 },
      large: { width: 192, height: 192 }
    }
  };

  return sizeMap[variant]?.[size] || sizeMap.square.medium;
}
```

## Performance Optimization

### 1. Lazy Loading Strategy

```typescript
// src/hooks/useLazyImages.ts
import { useEffect, useRef, useState } from 'react';

interface UseLazyImagesOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useLazyImages({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
}: UseLazyImagesOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isIntersecting };
}
```

### 2. Image Preloading

```typescript
// src/utils/imagePreloader.ts
export class ImagePreloader {
  private cache = new Map<string, Promise<void>>();
  private loadedImages = new Set<string>();

  async preload(src: string): Promise<void> {
    if (this.loadedImages.has(src)) {
      return Promise.resolve();
    }

    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedImages.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });

    this.cache.set(src, promise);
    return promise;
  }

  async preloadBrokerLogos(brokers: Broker[], variant: string = 'square', size: string = 'medium'): Promise<void> {
    const promises = brokers.map(broker => {
      const logoVariant = broker.logo[variant];
      const webpSrc = logoVariant?.webp?.[size];
      const pngSrc = logoVariant?.png?.[size];
      
      const preloadPromises = [];
      if (webpSrc) preloadPromises.push(this.preload(webpSrc));
      if (pngSrc) preloadPromises.push(this.preload(pngSrc));
      
      return Promise.allSettled(preloadPromises);
    });

    await Promise.allSettled(promises);
  }

  isLoaded(src: string): boolean {
    return this.loadedImages.has(src);
  }

  clear(): void {
    this.cache.clear();
    this.loadedImages.clear();
  }
}

export const imagePreloader = new ImagePreloader();
```

### 3. Bundle Optimization

```typescript
// vite.config.ts - Asset optimization configuration
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    assetsInlineLimit: 4096, // 4KB limit for inlining
    chunkSizeWarningLimit: 1000
  },
  assetsInclude: ['**/*.webp', '**/*.avif'],
  optimizeDeps: {
    include: ['sharp'] // Pre-bundle image processing dependencies
  }
});
```

## Monitoring and Analytics

### 1. Asset Performance Tracking

```typescript
// src/utils/assetAnalytics.ts
interface AssetMetrics {
  src: string;
  loadTime: number;
  fileSize?: number;
  format: string;
  success: boolean;
  fallbackUsed: boolean;
}

export class AssetAnalytics {
  private metrics: AssetMetrics[] = [];

  trackImageLoad(src: string, startTime: number, success: boolean, fallbackUsed: boolean = false): void {
    const loadTime = performance.now() - startTime;
    const format = this.getImageFormat(src);
    
    this.metrics.push({
      src,
      loadTime,
      format,
      success,
      fallbackUsed
    });

    // Send to analytics service
    this.sendMetrics({
      event: 'image_load',
      properties: {
        src,
        loadTime,
        format,
        success,
        fallbackUsed
      }
    });
  }

  getPerformanceReport(): {
    averageLoadTime: number;
    successRate: number;
    fallbackRate: number;
    formatBreakdown: Record<string, number>;
  } {
    if (this.metrics.length === 0) {
      return {
        averageLoadTime: 0,
        successRate: 0,
        fallbackRate: 0,
        formatBreakdown: {}
      };
    }

    const totalLoadTime = this.metrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    const successCount = this.metrics.filter(m => m.success).length;
    const fallbackCount = this.metrics.filter(m => m.fallbackUsed).length;
    
    const formatBreakdown = this.metrics.reduce((acc, metric) => {
      acc[metric.format] = (acc[metric.format] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      averageLoadTime: totalLoadTime / this.metrics.length,
      successRate: successCount / this.metrics.length,
      fallbackRate: fallbackCount / this.metrics.length,
      formatBreakdown
    };
  }

  private getImageFormat(src: string): string {
    const extension = src.split('.').pop()?.toLowerCase();
    return extension || 'unknown';
  }

  private sendMetrics(data: any): void {
    // Implementation depends on your analytics service
    console.log('Asset metrics:', data);
  }
}

export const assetAnalytics = new AssetAnalytics();
```

This comprehensive asset optimization guide ensures that all broker logos and images are processed efficiently, load quickly, and provide excellent user experience across all devices and network conditions while maintaining visual quality and brand consistency.