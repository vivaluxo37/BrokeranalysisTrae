// Performance optimization utilities for Core Web Vitals

// Image optimization configuration
export interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  sizes: string;
  priority: boolean;
  placeholder: 'blur' | 'empty';
}

// Default image optimization settings
export const DEFAULT_IMAGE_CONFIG: ImageOptimizationConfig = {
  quality: 85,
  format: 'webp',
  sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority: false,
  placeholder: 'blur'
};

// Critical image configuration (above the fold)
export const CRITICAL_IMAGE_CONFIG: ImageOptimizationConfig = {
  ...DEFAULT_IMAGE_CONFIG,
  priority: true,
  quality: 90
};

// Lazy loading configuration
export interface LazyLoadConfig {
  rootMargin: string;
  threshold: number;
  triggerOnce: boolean;
}

export const DEFAULT_LAZY_CONFIG: LazyLoadConfig = {
  rootMargin: '50px',
  threshold: 0.1,
  triggerOnce: true
};

// Font optimization utilities
export function generateFontPreloadLinks(fonts: string[]): string {
  return fonts.map(font => 
    `<link rel="preload" href="${font}" as="font" type="font/woff2" crossorigin="anonymous">`
  ).join('\n');
}

// Critical CSS extraction
export function extractCriticalCSS(html: string, css: string): string {
  // This is a simplified version - in production, use tools like critical or critters
  const criticalSelectors = [
    'body', 'html', 'header', 'nav', '.hero', '.above-fold',
    'h1', 'h2', '.btn-primary', '.container', '.grid'
  ];
  
  const criticalRules: string[] = [];
  
  criticalSelectors.forEach(selector => {
    const regex = new RegExp(`${selector.replace('.', '\\.')}\\s*{[^}]*}`, 'g');
    const matches = css.match(regex);
    if (matches) {
      criticalRules.push(...matches);
    }
  });
  
  return criticalRules.join('\n');
}

// Resource hints generation
export interface ResourceHint {
  rel: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch';
  href: string;
  as?: string;
  type?: string;
  crossorigin?: boolean;
}

export function generateResourceHints(): ResourceHint[] {
  return [
    // Preconnect to external domains
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
    { rel: 'preconnect', href: 'https://api.supabase.co' },
    
    // DNS prefetch for analytics and other services
    { rel: 'dns-prefetch', href: 'https://www.google-analytics.com' },
    { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
    
    // Preload critical resources
    { rel: 'preload', href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: true },
  ];
}

// Bundle analysis utilities
export interface BundleAnalysis {
  totalSize: number;
  gzippedSize: number;
  chunks: Array<{
    name: string;
    size: number;
    modules: string[];
  }>;
  recommendations: string[];
}

export function analyzeBundleSize(bundleStats: any): BundleAnalysis {
  const recommendations: string[] = [];
  
  // Check for large chunks
  const largeChunks = bundleStats.chunks?.filter((chunk: any) => chunk.size > 250000) || [];
  if (largeChunks.length > 0) {
    recommendations.push('Consider code splitting for chunks larger than 250KB');
  }
  
  // Check for duplicate modules
  const allModules = bundleStats.chunks?.flatMap((chunk: any) => chunk.modules) || [];
  const duplicates = allModules.filter((module: string, index: number) => 
    allModules.indexOf(module) !== index
  );
  if (duplicates.length > 0) {
    recommendations.push('Remove duplicate modules to reduce bundle size');
  }
  
  // Check for unused dependencies
  if (bundleStats.unusedDependencies?.length > 0) {
    recommendations.push('Remove unused dependencies from package.json');
  }
  
  return {
    totalSize: bundleStats.totalSize || 0,
    gzippedSize: bundleStats.gzippedSize || 0,
    chunks: bundleStats.chunks || [],
    recommendations
  };
}

// Core Web Vitals monitoring
export interface WebVitalsMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export function getWebVitalsThresholds() {
  return {
    lcp: { good: 2500, needsImprovement: 4000 },
    fid: { good: 100, needsImprovement: 300 },
    cls: { good: 0.1, needsImprovement: 0.25 },
    fcp: { good: 1800, needsImprovement: 3000 },
    ttfb: { good: 800, needsImprovement: 1800 }
  };
}

export function analyzeWebVitals(metrics: Partial<WebVitalsMetrics>): {
  score: 'good' | 'needs-improvement' | 'poor';
  recommendations: string[];
} {
  const thresholds = getWebVitalsThresholds();
  const recommendations: string[] = [];
  let poorCount = 0;
  let needsImprovementCount = 0;
  
  Object.entries(metrics).forEach(([metric, value]) => {
    if (value === undefined) return;
    
    const threshold = thresholds[metric as keyof typeof thresholds];
    if (!threshold) return;
    
    if (value > threshold.needsImprovement) {
      poorCount++;
      switch (metric) {
        case 'lcp':
          recommendations.push('Optimize LCP: Use image optimization, preload critical resources, improve server response times');
          break;
        case 'fid':
          recommendations.push('Optimize FID: Reduce JavaScript execution time, use web workers, optimize event handlers');
          break;
        case 'cls':
          recommendations.push('Optimize CLS: Set image dimensions, avoid dynamic content insertion, use CSS transforms');
          break;
        case 'fcp':
          recommendations.push('Optimize FCP: Eliminate render-blocking resources, optimize critical rendering path');
          break;
        case 'ttfb':
          recommendations.push('Optimize TTFB: Improve server performance, use CDN, optimize database queries');
          break;
      }
    } else if (value > threshold.good) {
      needsImprovementCount++;
    }
  });
  
  if (poorCount > 0) {
    return { score: 'poor', recommendations };
  } else if (needsImprovementCount > 0) {
    return { score: 'needs-improvement', recommendations };
  } else {
    return { score: 'good', recommendations: ['All Core Web Vitals are in good range'] };
  }
}

// Service Worker utilities for caching
export function generateServiceWorkerConfig() {
  return {
    // Cache strategies
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-stylesheets',
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
          }
        }
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-webfonts',
          expiration: {
            maxEntries: 30,
            maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
          }
        }
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
          }
        }
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 5 // 5 minutes
          }
        }
      }
    ]
  };
}

// Performance budget configuration
export interface PerformanceBudget {
  maxBundleSize: number; // in bytes
  maxImageSize: number; // in bytes
  maxFontSize: number; // in bytes
  maxCSSSize: number; // in bytes
  maxJSSize: number; // in bytes
}

export const DEFAULT_PERFORMANCE_BUDGET: PerformanceBudget = {
  maxBundleSize: 500000, // 500KB
  maxImageSize: 200000, // 200KB
  maxFontSize: 100000, // 100KB
  maxCSSSize: 150000, // 150KB
  maxJSSize: 300000 // 300KB
};

export function checkPerformanceBudget(
  assets: { type: string; size: number; name: string }[],
  budget: PerformanceBudget = DEFAULT_PERFORMANCE_BUDGET
): { passed: boolean; violations: string[] } {
  const violations: string[] = [];
  
  const totalBundle = assets.reduce((sum, asset) => sum + asset.size, 0);
  if (totalBundle > budget.maxBundleSize) {
    violations.push(`Total bundle size (${Math.round(totalBundle / 1000)}KB) exceeds budget (${Math.round(budget.maxBundleSize / 1000)}KB)`);
  }
  
  assets.forEach(asset => {
    switch (asset.type) {
      case 'image':
        if (asset.size > budget.maxImageSize) {
          violations.push(`Image ${asset.name} (${Math.round(asset.size / 1000)}KB) exceeds budget (${Math.round(budget.maxImageSize / 1000)}KB)`);
        }
        break;
      case 'font':
        if (asset.size > budget.maxFontSize) {
          violations.push(`Font ${asset.name} (${Math.round(asset.size / 1000)}KB) exceeds budget (${Math.round(budget.maxFontSize / 1000)}KB)`);
        }
        break;
      case 'css':
        if (asset.size > budget.maxCSSSize) {
          violations.push(`CSS ${asset.name} (${Math.round(asset.size / 1000)}KB) exceeds budget (${Math.round(budget.maxCSSSize / 1000)}KB)`);
        }
        break;
      case 'js':
        if (asset.size > budget.maxJSSize) {
          violations.push(`JavaScript ${asset.name} (${Math.round(asset.size / 1000)}KB) exceeds budget (${Math.round(budget.maxJSSize / 1000)}KB)`);
        }
        break;
    }
  });
  
  return {
    passed: violations.length === 0,
    violations
  };
}