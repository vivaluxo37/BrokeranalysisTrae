import { NextApiRequest, NextApiResponse } from 'next';
import { generateRobotsTxt } from '../../src/utils/seo/sitemapGenerator';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Set appropriate headers for robots.txt
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // Cache for 24 hours
    
    // Get base URL from environment or request
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` :
                   'https://brokeranalysis.com';
    
    // Generate robots.txt content
    const robotsTxt = generateRobotsTxt(baseUrl);
    
    // Send robots.txt response
    res.status(200).send(robotsTxt);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).send('# Error generating robots.txt');
  }
}