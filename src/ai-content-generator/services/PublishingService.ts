/**
 * Publishing Service
 * 
 * This service handles the publishing workflow for generated content,
 * including content deployment, SEO optimization, and integration with the platform.
 */

import { ContentSchema, PublishingJob, ContentStatus, QAResult } from '../types';
import fs from 'fs';
import path from 'path';

export class PublishingService {
  private publishingQueue: Map<string, PublishingJob> = new Map();
  private publishedContent: Map<string, ContentSchema> = new Map();
  private outputDirectory: string;
  private sitemapPath: string;
  private robotsPath: string;

  constructor(
    outputDirectory: string = './public/generated-content',
    sitemapPath: string = './public/sitemap.xml',
    robotsPath: string = './public/robots.txt'
  ) {
    this.outputDirectory = outputDirectory;
    this.sitemapPath = sitemapPath;
    this.robotsPath = robotsPath;
    this.ensureDirectoriesExist();
  }

  /**
   * Ensure required directories exist
   */
  private ensureDirectoriesExist(): void {
    const directories = [
      this.outputDirectory,
      path.join(this.outputDirectory, 'broker-reviews'),
      path.join(this.outputDirectory, 'comparisons'),
      path.join(this.outputDirectory, 'toplists'),
      path.join(this.outputDirectory, 'educational'),
      path.join(this.outputDirectory, 'country-pages'),
      path.join(this.outputDirectory, 'faqs'),
      path.join(this.outputDirectory, 'assets'),
      path.join(this.outputDirectory, 'assets', 'images')
    ];

    directories.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Queue content for publishing
   */
  async queueForPublishing(
    content: ContentSchema,
    qaResult: QAResult,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): Promise<string> {
    const jobId = this.generateJobId();
    
    const job: PublishingJob = {
      id: jobId,
      contentId: content.id,
      content,
      qaResult,
      status: 'queued',
      priority,
      createdAt: new Date(),
      updatedAt: new Date(),
      retryCount: 0,
      maxRetries: 3
    };

    this.publishingQueue.set(jobId, job);
    
    // Process immediately if high priority
    if (priority === 'high') {
      await this.processPublishingJob(jobId);
    }

    return jobId;
  }

  /**
   * Process publishing job
   */
  async processPublishingJob(jobId: string): Promise<boolean> {
    const job = this.publishingQueue.get(jobId);
    if (!job) {
      console.error(`Publishing job ${jobId} not found`);
      return false;
    }

    try {
      job.status = 'processing';
      job.updatedAt = new Date();
      job.startedAt = new Date();

      // Validate QA results
      if (!job.qaResult.passed) {
        throw new Error(`Content failed QA checks: ${job.qaResult.issues.length} issues found`);
      }

      // Generate file paths
      const filePaths = this.generateFilePaths(job.content);
      
      // Create content files
      await this.createContentFiles(job.content, filePaths);
      
      // Update sitemap
      await this.updateSitemap(job.content);
      
      // Generate meta files
      await this.generateMetaFiles(job.content, filePaths);
      
      // Copy associated assets
      await this.copyContentAssets(job.content, filePaths);
      
      // Update content status
      job.content.status = 'published';
      job.content.publishedAt = new Date();
      
      // Mark job as completed
      job.status = 'completed';
      job.completedAt = new Date();
      job.publishedUrl = this.generatePublishedUrl(job.content);
      
      // Store published content
      this.publishedContent.set(job.content.id, job.content);
      
      console.log(`Successfully published content: ${job.content.title}`);
      return true;
      
    } catch (error) {
      console.error(`Publishing job ${jobId} failed:`, error);
      
      job.status = 'failed';
      job.error = error.message;
      job.retryCount++;
      job.updatedAt = new Date();
      
      // Retry if under max retries
      if (job.retryCount < job.maxRetries) {
        job.status = 'queued';
        console.log(`Retrying publishing job ${jobId} (attempt ${job.retryCount + 1}/${job.maxRetries})`);
      }
      
      return false;
    }
  }

  /**
   * Generate file paths for content
   */
  private generateFilePaths(content: ContentSchema): ContentFilePaths {
    const baseDir = path.join(this.outputDirectory, this.getContentTypeDirectory(content.type));
    const fileName = `${content.slug}.html`;
    const metaFileName = `${content.slug}.json`;
    
    return {
      htmlFile: path.join(baseDir, fileName),
      metaFile: path.join(baseDir, metaFileName),
      assetsDir: path.join(baseDir, 'assets', content.slug),
      relativeUrl: `/${this.getContentTypeDirectory(content.type)}/${content.slug}`
    };
  }

  /**
   * Get directory name for content type
   */
  private getContentTypeDirectory(contentType: string): string {
    const typeMap: Record<string, string> = {
      'broker-review': 'broker-reviews',
      'broker-comparison': 'comparisons',
      'toplist': 'toplists',
      'educational': 'educational',
      'country-page': 'country-pages',
      'faq': 'faqs'
    };
    
    return typeMap[contentType] || 'misc';
  }

  /**
   * Create content files
   */
  private async createContentFiles(
    content: ContentSchema,
    filePaths: ContentFilePaths
  ): Promise<void> {
    // Generate HTML content
    const htmlContent = this.generateHTMLContent(content);
    
    // Write HTML file
    fs.writeFileSync(filePaths.htmlFile, htmlContent, 'utf8');
    
    // Generate and write meta file
    const metaContent = this.generateMetaContent(content);
    fs.writeFileSync(filePaths.metaFile, JSON.stringify(metaContent, null, 2), 'utf8');
  }

  /**
   * Generate HTML content with proper structure
   */
  private generateHTMLContent(content: ContentSchema): string {
    const structuredData = this.generateStructuredData(content);
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.seo?.title || content.title}</title>
    <meta name="description" content="${content.seo?.metaDescription || ''}">
    <meta name="keywords" content="${content.seo?.keywords?.join(', ') || ''}">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${content.seo?.title || content.title}">
    <meta property="og:description" content="${content.seo?.metaDescription || ''}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${content.seo?.canonicalUrl || ''}">
    ${content.featuredImage ? `<meta property="og:image" content="${content.featuredImage.url}">` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${content.seo?.title || content.title}">
    <meta name="twitter:description" content="${content.seo?.metaDescription || ''}">
    ${content.featuredImage ? `<meta name="twitter:image" content="${content.featuredImage.url}">` : ''}
    
    <!-- Canonical URL -->
    ${content.seo?.canonicalUrl ? `<link rel="canonical" href="${content.seo.canonicalUrl}">` : ''}
    
    <!-- Structured Data -->
    <script type="application/ld+json">
    ${JSON.stringify(structuredData, null, 2)}
    </script>
    
    <!-- Styles -->
    <link rel="stylesheet" href="/assets/css/generated-content.css">
</head>
<body>
    <div class="content-wrapper">
        <header class="content-header">
            <h1>${content.title}</h1>
            ${content.excerpt ? `<p class="excerpt">${content.excerpt}</p>` : ''}
            <div class="content-meta">
                <span class="publish-date">Published: ${content.publishedAt?.toLocaleDateString() || new Date().toLocaleDateString()}</span>
                ${content.readingTime ? `<span class="reading-time">${content.readingTime} min read</span>` : ''}
            </div>
        </header>
        
        <main class="content-body">
            ${this.convertMarkdownToHTML(content.content)}
        </main>
        
        ${content.tags && content.tags.length > 0 ? `
        <footer class="content-footer">
            <div class="tags">
                <span class="tags-label">Tags:</span>
                ${content.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </footer>
        ` : ''}
    </div>
    
    <!-- Analytics and tracking scripts can be added here -->
</body>
</html>`;
  }

  /**
   * Convert markdown to HTML (basic implementation)
   */
  private convertMarkdownToHTML(markdown: string): string {
    return markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>')
      // Line breaks
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      // Wrap in paragraphs
      .replace(/^(.+)$/gm, '<p>$1</p>')
      // Clean up multiple paragraph tags
      .replace(/<\/p><p>/g, '</p>\n<p>')
      // Lists (basic)
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  }

  /**
   * Generate structured data for SEO
   */
  private generateStructuredData(content: ContentSchema): any {
    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": content.title,
      "description": content.excerpt || content.seo?.metaDescription,
      "datePublished": content.publishedAt?.toISOString() || new Date().toISOString(),
      "dateModified": content.updatedAt?.toISOString() || new Date().toISOString(),
      "author": {
        "@type": "Organization",
        "name": "BrokerAnalysis"
      },
      "publisher": {
        "@type": "Organization",
        "name": "BrokerAnalysis",
        "logo": {
          "@type": "ImageObject",
          "url": "/assets/images/logo.png"
        }
      }
    };

    // Add content-specific structured data
    if (content.type === 'broker-review') {
      return {
        ...baseStructuredData,
        "@type": "Review",
        "itemReviewed": {
          "@type": "FinancialService",
          "name": content.title.replace(' Review', '')
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": content.metadata?.rating || 4,
          "bestRating": 5
        }
      };
    }

    if (content.type === 'toplist') {
      return {
        ...baseStructuredData,
        "@type": "ItemList",
        "numberOfItems": content.metadata?.brokerCount || 10
      };
    }

    return baseStructuredData;
  }

  /**
   * Generate meta content file
   */
  private generateMetaContent(content: ContentSchema): any {
    return {
      id: content.id,
      title: content.title,
      slug: content.slug,
      type: content.type,
      status: content.status,
      publishedAt: content.publishedAt,
      updatedAt: content.updatedAt,
      seo: content.seo,
      metadata: content.metadata,
      tags: content.tags,
      readingTime: content.readingTime,
      wordCount: content.wordCount
    };
  }

  /**
   * Update sitemap with new content
   */
  private async updateSitemap(content: ContentSchema): Promise<void> {
    try {
      let sitemap = '';
      
      // Read existing sitemap if it exists
      if (fs.existsSync(this.sitemapPath)) {
        sitemap = fs.readFileSync(this.sitemapPath, 'utf8');
      } else {
        // Create new sitemap
        sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
      }
      
      // Add new URL entry
      const urlEntry = `
  <url>
    <loc>${content.seo?.canonicalUrl || `https://brokeranalysis.com${this.generatePublishedUrl(content)}`}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${this.getContentPriority(content.type)}</priority>
  </url>`;
      
      // Insert before closing urlset tag
      sitemap = sitemap.replace('</urlset>', `${urlEntry}
</urlset>`);
      
      // Write updated sitemap
      fs.writeFileSync(this.sitemapPath, sitemap, 'utf8');
      
    } catch (error) {
      console.error('Failed to update sitemap:', error);
    }
  }

  /**
   * Get content priority for sitemap
   */
  private getContentPriority(contentType: string): string {
    const priorityMap: Record<string, string> = {
      'toplist': '1.0',
      'broker-review': '0.9',
      'broker-comparison': '0.8',
      'country-page': '0.7',
      'educational': '0.6',
      'faq': '0.5'
    };
    
    return priorityMap[contentType] || '0.5';
  }

  /**
   * Generate meta files (robots.txt, etc.)
   */
  private async generateMetaFiles(
    content: ContentSchema,
    filePaths: ContentFilePaths
  ): Promise<void> {
    // Update robots.txt if needed
    if (!fs.existsSync(this.robotsPath)) {
      const robotsContent = `User-agent: *
Allow: /

Sitemap: https://brokeranalysis.com/sitemap.xml`;
      fs.writeFileSync(this.robotsPath, robotsContent, 'utf8');
    }
  }

  /**
   * Copy content assets (images, etc.)
   */
  private async copyContentAssets(
    content: ContentSchema,
    filePaths: ContentFilePaths
  ): Promise<void> {
    if (!content.images || content.images.length === 0) {
      return;
    }

    // Ensure assets directory exists
    if (!fs.existsSync(filePaths.assetsDir)) {
      fs.mkdirSync(filePaths.assetsDir, { recursive: true });
    }

    // Copy images
    for (const image of content.images) {
      try {
        if (fs.existsSync(image.url)) {
          const fileName = path.basename(image.url);
          const destPath = path.join(filePaths.assetsDir, fileName);
          fs.copyFileSync(image.url, destPath);
        }
      } catch (error) {
        console.warn(`Failed to copy image ${image.url}:`, error);
      }
    }
  }

  /**
   * Generate published URL
   */
  private generatePublishedUrl(content: ContentSchema): string {
    return `/${this.getContentTypeDirectory(content.type)}/${content.slug}`;
  }

  /**
   * Process publishing queue
   */
  async processPublishingQueue(): Promise<void> {
    const queuedJobs = Array.from(this.publishingQueue.values())
      .filter(job => job.status === 'queued')
      .sort((a, b) => {
        // Sort by priority and creation time
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff !== 0) return priorityDiff;
        return a.createdAt.getTime() - b.createdAt.getTime();
      });

    for (const job of queuedJobs) {
      await this.processPublishingJob(job.id);
    }
  }

  /**
   * Get publishing job status
   */
  getJobStatus(jobId: string): PublishingJob | null {
    return this.publishingQueue.get(jobId) || null;
  }

  /**
   * Get all publishing jobs
   */
  getAllJobs(): PublishingJob[] {
    return Array.from(this.publishingQueue.values());
  }

  /**
   * Get published content
   */
  getPublishedContent(contentId: string): ContentSchema | null {
    return this.publishedContent.get(contentId) || null;
  }

  /**
   * Get all published content
   */
  getAllPublishedContent(): ContentSchema[] {
    return Array.from(this.publishedContent.values());
  }

  /**
   * Unpublish content
   */
  async unpublishContent(contentId: string): Promise<boolean> {
    const content = this.publishedContent.get(contentId);
    if (!content) {
      return false;
    }

    try {
      const filePaths = this.generateFilePaths(content);
      
      // Remove files
      if (fs.existsSync(filePaths.htmlFile)) {
        fs.unlinkSync(filePaths.htmlFile);
      }
      if (fs.existsSync(filePaths.metaFile)) {
        fs.unlinkSync(filePaths.metaFile);
      }
      
      // Remove assets directory
      if (fs.existsSync(filePaths.assetsDir)) {
        fs.rmSync(filePaths.assetsDir, { recursive: true, force: true });
      }
      
      // Update content status
      content.status = 'draft';
      content.publishedAt = undefined;
      
      // Remove from published content
      this.publishedContent.delete(contentId);
      
      return true;
    } catch (error) {
      console.error(`Failed to unpublish content ${contentId}:`, error);
      return false;
    }
  }

  /**
   * Generate job ID
   */
  private generateJobId(): string {
    return `pub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get publishing statistics
   */
  async getPublishingStats(): Promise<any> {
    const jobs = Array.from(this.publishingQueue.values());
    
    return {
      totalJobs: jobs.length,
      completedJobs: jobs.filter(j => j.status === 'completed').length,
      failedJobs: jobs.filter(j => j.status === 'failed').length,
      queuedJobs: jobs.filter(j => j.status === 'queued').length,
      processingJobs: jobs.filter(j => j.status === 'processing').length,
      publishedContent: this.publishedContent.size,
      averageProcessingTime: this.calculateAverageProcessingTime(jobs)
    };
  }

  private calculateAverageProcessingTime(jobs: PublishingJob[]): number {
    const completedJobs = jobs.filter(j => j.status === 'completed' && j.startedAt && j.completedAt);
    if (completedJobs.length === 0) return 0;
    
    const totalTime = completedJobs.reduce((sum, job) => {
      return sum + (job.completedAt!.getTime() - job.startedAt!.getTime());
    }, 0);
    
    return totalTime / completedJobs.length;
  }
}

/**
 * Content file paths interface
 */
interface ContentFilePaths {
  htmlFile: string;
  metaFile: string;
  assetsDir: string;
  relativeUrl: string;
}