import { Request, Response } from 'express';
import { generateSitemap, generateSitemapXML } from '../utils/seo/sitemapGenerator';

// Generate and serve XML sitemap
export async function handleSitemapRequest(req: Request, res: Response): Promise<void> {
  try {
    // Set appropriate headers for XML sitemap
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Generate sitemap entries
    const sitemapEntries = await generateSitemap();
    
    // Get base URL from request or environment
    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const host = req.get('Host');
    const baseUrl = process.env.SITE_URL || `${protocol}://${host}`;
    
    // Generate XML sitemap
    const sitemapXML = generateSitemapXML(sitemapEntries, baseUrl);
    
    // Send XML response
    res.status(200).send(sitemapXML);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>');
  }
}

// Generate and serve robots.txt
export function handleRobotsRequest(req: Request, res: Response): void {
  try {
    // Set appropriate headers for robots.txt
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    
    // Get base URL from request or environment
    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const host = req.get('Host');
    const baseUrl = process.env.SITE_URL || `${protocol}://${host}`;
    
    // Generate robots.txt content
    const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/

# Allow important crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
    
    // Send robots.txt response
    res.status(200).send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).send('# Error generating robots.txt');
  }
}

// Get sitemap statistics (for admin/monitoring)
export async function handleSitemapStatsRequest(req: Request, res: Response): Promise<void> {
  try {
    const { getSitemapStats } = await import('../utils/seo/sitemapGenerator');
    
    // Generate sitemap entries
    const sitemapEntries = await generateSitemap();
    
    // Get statistics
    const stats = getSitemapStats(sitemapEntries);
    
    // Add additional metadata
    const response = {
      ...stats,
      lastGenerated: new Date().toISOString(),
      baseUrl: process.env.SITE_URL || 'https://brokeranalysis.com',
      entries: sitemapEntries.length > 100 ? sitemapEntries.slice(0, 10) : sitemapEntries // Sample entries
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error generating sitemap stats:', error);
    res.status(500).json({ error: 'Failed to generate sitemap statistics' });
  }
}

// Validate sitemap entries (for admin/monitoring)
export async function handleSitemapValidationRequest(req: Request, res: Response): Promise<void> {
  try {
    const { validateSitemapEntries } = await import('../utils/seo/sitemapGenerator');
    
    // Generate sitemap entries
    const sitemapEntries = await generateSitemap();
    
    // Validate entries
    const validation = validateSitemapEntries(sitemapEntries);
    
    const response = {
      totalEntries: sitemapEntries.length,
      validEntries: validation.valid.length,
      invalidEntries: validation.invalid.length,
      validationErrors: validation.invalid.map(entry => ({
        url: entry.url,
        issues: [
          !entry.url || !entry.url.startsWith('/') ? 'Invalid URL format' : null,
          entry.priority && (entry.priority < 0 || entry.priority > 1) ? 'Invalid priority range' : null,
          entry.lastmod && isNaN(Date.parse(entry.lastmod)) ? 'Invalid date format' : null
        ].filter(Boolean)
      })),
      lastValidated: new Date().toISOString()
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error validating sitemap:', error);
    res.status(500).json({ error: 'Failed to validate sitemap' });
  }
}