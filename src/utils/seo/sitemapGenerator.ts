import { getBrokers } from '@/lib/supabase';
import { Broker } from '@/types/broker';

// Sitemap entry interface
interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

// Static pages configuration
const STATIC_PAGES: SitemapEntry[] = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    url: '/brokers',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/comparison',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: '/reviews',
    changefreq: 'daily',
    priority: 0.8
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.5
  },
  {
    url: '/privacy',
    changefreq: 'yearly',
    priority: 0.3
  },
  {
    url: '/terms',
    changefreq: 'yearly',
    priority: 0.3
  }
];

// Generate broker profile URLs
export async function generateBrokerUrls(): Promise<SitemapEntry[]> {
  try {
    const brokers = await getBrokers();
    
    return brokers.map((broker: Broker) => ({
      url: `/broker/${broker.slug}`,
      lastmod: broker.updated_at || new Date().toISOString(),
      changefreq: 'weekly' as const,
      priority: 0.7
    }));
  } catch (error) {
    console.error('Error generating broker URLs:', error);
    return [];
  }
}

// Generate comparison URLs
export function generateComparisonUrls(brokers: Broker[]): SitemapEntry[] {
  const comparisonUrls: SitemapEntry[] = [];
  
  // Generate pairwise comparisons for top brokers
  const topBrokers = brokers.slice(0, 10); // Limit to top 10 to avoid too many combinations
  
  for (let i = 0; i < topBrokers.length; i++) {
    for (let j = i + 1; j < topBrokers.length; j++) {
      const broker1 = topBrokers[i];
      const broker2 = topBrokers[j];
      
      comparisonUrls.push({
        url: `/comparison/${broker1.slug}-vs-${broker2.slug}`,
        changefreq: 'monthly',
        priority: 0.6
      });
    }
  }
  
  return comparisonUrls;
}

// Generate category URLs
export function generateCategoryUrls(): SitemapEntry[] {
  const categories = [
    'forex',
    'crypto',
    'stocks',
    'commodities',
    'indices',
    'etfs'
  ];
  
  return categories.map(category => ({
    url: `/brokers/${category}`,
    changefreq: 'weekly',
    priority: 0.7
  }));
}

// Generate country-specific URLs
export function generateCountryUrls(): SitemapEntry[] {
  const countries = [
    'us', 'uk', 'eu', 'au', 'ca', 'jp', 'sg', 'hk', 'ae', 'za'
  ];
  
  return countries.map(country => ({
    url: `/brokers/${country}`,
    changefreq: 'weekly',
    priority: 0.6
  }));
}

// Generate complete sitemap
export async function generateSitemap(): Promise<SitemapEntry[]> {
  try {
    const brokerUrls = await generateBrokerUrls();
    const brokers = await getBrokers();
    const comparisonUrls = generateComparisonUrls(brokers);
    const categoryUrls = generateCategoryUrls();
    const countryUrls = generateCountryUrls();
    
    return [
      ...STATIC_PAGES,
      ...brokerUrls,
      ...comparisonUrls,
      ...categoryUrls,
      ...countryUrls
    ];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return STATIC_PAGES; // Return at least static pages
  }
}

// Convert sitemap entries to XML format
export function generateSitemapXML(entries: SitemapEntry[], baseUrl: string = 'https://brokeranalysis.com'): string {
  const xmlEntries = entries.map(entry => {
    const url = `${baseUrl}${entry.url}`;
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
    const changefreq = entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : '';
    const priority = entry.priority ? `\n    <priority>${entry.priority}</priority>` : '';
    
    return `  <url>
    <loc>${url}</loc>${lastmod}${changefreq}${priority}
  </url>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

// Generate robots.txt content
export function generateRobotsTxt(baseUrl: string = 'https://brokeranalysis.com'): string {
  return `User-agent: *
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
}

// Validate sitemap entries
export function validateSitemapEntries(entries: SitemapEntry[]): { valid: SitemapEntry[]; invalid: SitemapEntry[] } {
  const valid: SitemapEntry[] = [];
  const invalid: SitemapEntry[] = [];
  
  entries.forEach(entry => {
    // Basic URL validation
    if (!entry.url || !entry.url.startsWith('/')) {
      invalid.push(entry);
      return;
    }
    
    // Priority validation
    if (entry.priority && (entry.priority < 0 || entry.priority > 1)) {
      invalid.push(entry);
      return;
    }
    
    // Date validation
    if (entry.lastmod && isNaN(Date.parse(entry.lastmod))) {
      invalid.push(entry);
      return;
    }
    
    valid.push(entry);
  });
  
  return { valid, invalid };
}

// Get sitemap statistics
export function getSitemapStats(entries: SitemapEntry[]): {
  total: number;
  byChangefreq: Record<string, number>;
  byPriority: Record<string, number>;
  avgPriority: number;
} {
  const byChangefreq: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  let totalPriority = 0;
  let priorityCount = 0;
  
  entries.forEach(entry => {
    if (entry.changefreq) {
      byChangefreq[entry.changefreq] = (byChangefreq[entry.changefreq] || 0) + 1;
    }
    
    if (entry.priority) {
      const priorityRange = entry.priority >= 0.8 ? 'high' : entry.priority >= 0.5 ? 'medium' : 'low';
      byPriority[priorityRange] = (byPriority[priorityRange] || 0) + 1;
      totalPriority += entry.priority;
      priorityCount++;
    }
  });
  
  return {
    total: entries.length,
    byChangefreq,
    byPriority,
    avgPriority: priorityCount > 0 ? totalPriority / priorityCount : 0
  };
}