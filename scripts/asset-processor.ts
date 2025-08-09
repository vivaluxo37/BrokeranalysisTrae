import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

/**
 * Asset Processing Configuration
 */
interface AssetConfig {
  inputDir: string;
  outputDir: string;
  formats: ImageFormat[];
  sizes: ImageSize[];
  quality: number;
  fallbackEnabled: boolean;
}

interface ImageFormat {
  extension: string;
  options: sharp.OutputOptions;
}

interface ImageSize {
  name: string;
  width: number;
  height?: number;
  fit?: keyof sharp.FitEnum;
}

/**
 * Broker Asset Types
 */
type AssetType = 'logo' | 'screenshot' | 'promotional' | 'favicon';
type LogoVariant = 'square' | 'horizontal';

/**
 * Asset Processing Class
 */
export class BrokerAssetProcessor {
  private config: AssetConfig;
  private readonly ASSETS_BASE_PATH = 'public/assets/brokers';
  private readonly FALLBACK_PATH = 'public/assets/brokers/fallbacks';

  constructor(config?: Partial<AssetConfig>) {
    this.config = {
      inputDir: 'Resources from other sites',
      outputDir: this.ASSETS_BASE_PATH,
      formats: [
        { extension: 'webp', options: { quality: 85 } },
        { extension: 'png', options: { quality: 90, compressionLevel: 6 } },
        { extension: 'jpg', options: { quality: 85, mozjpeg: true } }
      ],
      sizes: [
        { name: 'small', width: 64, height: 64, fit: 'cover' },
        { name: 'medium', width: 128, height: 128, fit: 'cover' },
        { name: 'large', width: 256, height: 256, fit: 'cover' }
      ],
      quality: 85,
      fallbackEnabled: true,
      ...config
    };
  }

  /**
   * Process broker logos from source directory
   */
  async processLogos(brokerName: string, variant: LogoVariant = 'square'): Promise<void> {
    const inputPath = this.findBrokerAsset(brokerName, 'logo');
    if (!inputPath) {
      console.warn(`Logo not found for broker: ${brokerName}`);
      if (this.config.fallbackEnabled) {
        await this.createFallbackLogo(brokerName, variant);
      }
      return;
    }

    const outputDir = path.join(this.config.outputDir, 'logos', variant);
    await this.ensureDirectory(outputDir);

    // Process logo in multiple formats and sizes
    for (const format of this.config.formats) {
      for (const size of this.config.sizes) {
        const outputPath = path.join(
          outputDir,
          `${this.sanitizeBrokerName(brokerName)}-${size.name}.${format.extension}`
        );

        await this.processImage(inputPath, outputPath, {
          width: size.width,
          height: size.height,
          fit: size.fit,
          format: format.extension as keyof sharp.FormatEnum,
          options: format.options
        });
      }
    }
  }

  /**
   * Process broker screenshots
   */
  async processScreenshots(brokerName: string): Promise<void> {
    const inputPath = this.findBrokerAsset(brokerName, 'screenshot');
    if (!inputPath) {
      console.warn(`Screenshot not found for broker: ${brokerName}`);
      return;
    }

    const outputDir = path.join(this.config.outputDir, 'images', 'screenshots');
    await this.ensureDirectory(outputDir);

    // Process screenshots in web-optimized formats
    const screenshotSizes = [
      { name: 'thumbnail', width: 300, height: 200 },
      { name: 'medium', width: 600, height: 400 },
      { name: 'large', width: 1200, height: 800 }
    ];

    for (const format of this.config.formats.filter(f => f.extension !== 'png')) {
      for (const size of screenshotSizes) {
        const outputPath = path.join(
          outputDir,
          `${this.sanitizeBrokerName(brokerName)}-${size.name}.${format.extension}`
        );

        await this.processImage(inputPath, outputPath, {
          width: size.width,
          height: size.height,
          fit: 'cover',
          format: format.extension as keyof sharp.FormatEnum,
          options: format.options
        });
      }
    }
  }

  /**
   * Batch process all broker assets
   */
  async processBrokerAssets(brokerNames: string[]): Promise<void> {
    console.log(`Processing assets for ${brokerNames.length} brokers...`);
    
    for (const brokerName of brokerNames) {
      try {
        console.log(`Processing assets for: ${brokerName}`);
        
        // Process logos in both variants
        await this.processLogos(brokerName, 'square');
        await this.processLogos(brokerName, 'horizontal');
        
        // Process screenshots
        await this.processScreenshots(brokerName);
        
        console.log(`✓ Completed processing for: ${brokerName}`);
      } catch (error) {
        console.error(`✗ Error processing ${brokerName}:`, error);
      }
    }
  }

  /**
   * Find broker asset in source directories
   */
  private findBrokerAsset(brokerName: string, assetType: AssetType): string | null {
    // Implementation will search through Resources from other sites
    // This is a placeholder for the actual asset discovery logic
    const searchPaths = [
      `${this.config.inputDir}/img.brokersview.com/prod/ico/square`,
      `${this.config.inputDir}/www.forexbrokers.com/cdn`,
      // Add more search paths as needed
    ];

    // TODO: Implement actual file search logic
    return null;
  }

  /**
   * Process individual image with Sharp
   */
  private async processImage(
    inputPath: string,
    outputPath: string,
    options: {
      width: number;
      height?: number;
      fit?: keyof sharp.FitEnum;
      format: keyof sharp.FormatEnum;
      options: sharp.OutputOptions;
    }
  ): Promise<void> {
    try {
      let pipeline = sharp(inputPath)
        .resize(options.width, options.height, { fit: options.fit || 'cover' });

      switch (options.format) {
        case 'webp':
          pipeline = pipeline.webp(options.options as sharp.WebpOptions);
          break;
        case 'png':
          pipeline = pipeline.png(options.options as sharp.PngOptions);
          break;
        case 'jpeg':
        case 'jpg':
          pipeline = pipeline.jpeg(options.options as sharp.JpegOptions);
          break;
      }

      await pipeline.toFile(outputPath);
      console.log(`✓ Processed: ${path.basename(outputPath)}`);
    } catch (error) {
      console.error(`✗ Failed to process ${inputPath}:`, error);
      throw error;
    }
  }

  /**
   * Create fallback logo for missing assets
   */
  private async createFallbackLogo(brokerName: string, variant: LogoVariant): Promise<void> {
    const outputDir = path.join(this.FALLBACK_PATH, 'logos');
    await this.ensureDirectory(outputDir);

    const size = variant === 'square' ? { width: 128, height: 128 } : { width: 200, height: 80 };
    const outputPath = path.join(outputDir, `${this.sanitizeBrokerName(brokerName)}-fallback.png`);

    // Create a simple text-based fallback logo
    const svg = `
      <svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" 
              text-anchor="middle" dominant-baseline="middle" fill="#6b7280">
          ${brokerName.substring(0, 3).toUpperCase()}
        </text>
      </svg>
    `;

    await sharp(Buffer.from(svg))
      .png({ quality: 90 })
      .toFile(outputPath);

    console.log(`✓ Created fallback logo: ${path.basename(outputPath)}`);
  }

  /**
   * Ensure directory exists
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  }

  /**
   * Sanitize broker name for file naming
   */
  private sanitizeBrokerName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Get asset statistics
   */
  async getAssetStats(): Promise<{
    totalAssets: number;
    assetsByType: Record<string, number>;
    totalSize: number;
  }> {
    // TODO: Implement asset statistics collection
    return {
      totalAssets: 0,
      assetsByType: {},
      totalSize: 0
    };
  }
}

/**
 * CLI Interface for asset processing
 */
if (require.main === module) {
  const processor = new BrokerAssetProcessor();
  
  // Example usage
  const brokerNames = [
    'acy-securities',
    'atfx',
    'thinkmarkets',
    // Add more broker names as needed
  ];
  
  processor.processBrokerAssets(brokerNames)
    .then(() => console.log('Asset processing completed!'))
    .catch(error => console.error('Asset processing failed:', error));
}

export default BrokerAssetProcessor;