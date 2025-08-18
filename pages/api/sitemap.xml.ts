import { NextApiRequest, NextApiResponse } from 'next';
import { generateSitemap, generateSitemapXML } from '../../src/utils/seo/sitemapGenerator';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Set appropriate headers for XML sitemap
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600'); // Cache for 1 hour
    
    // Generate sitemap entries
    const sitemapEntries = await generateSitemap();
    
    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   'https://brokeranalysis.com';
    
    // Generate XML sitemap
    const sitemapXML = generateSitemapXML(sitemapEntries, baseUrl);
    
    // Send XML response
    res.status(200).send(sitemapXML);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('<?xml version="1.0" encoding="UTF-8"?><error>Failed to generate sitemap</error>');
  }
}