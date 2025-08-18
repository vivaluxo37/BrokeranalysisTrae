import { createClient } from '@supabase/supabase-js'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { Database } from '../src/types/supabase'

// Environment variables for Supabase connection
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  console.error('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

// Create Supabase client
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Configuration
const DOMAIN = process.env.DOMAIN || 'https://brokeranalysis.com'
const OUTPUT_PATH = join(process.cwd(), 'public', 'sitemap.xml')

// Static pages with their priorities
const STATIC_PAGES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/brokers', priority: '0.9', changefreq: 'daily' },
  { url: '/comparison', priority: '0.8', changefreq: 'weekly' },
  { url: '/education', priority: '0.7', changefreq: 'weekly' },
  { url: '/news', priority: '0.7', changefreq: 'daily' },
  { url: '/tools', priority: '0.6', changefreq: 'weekly' },
  { url: '/about', priority: '0.5', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms', priority: '0.3', changefreq: 'yearly' }
]

interface SitemapUrl {
  loc: string
  lastmod: string
  changefreq: string
  priority: string
}

/**
 * Fetch all active brokers from Supabase
 */
async function fetchActiveBrokers() {
  try {
    const { data: brokers, error } = await supabase
      .from('brokers')
      .select('id, name, updated_at')
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching brokers:', error)
      return []
    }

    // Transform brokers to include slug based on name
    const brokersWithSlug = (brokers || []).map(broker => ({
      ...broker,
      slug: broker.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    }))

    return brokersWithSlug
  } catch (error) {
    console.error('Failed to fetch brokers:', error)
    return []
  }
}

/**
 * Fetch all enabled locales from Supabase
 */
async function fetchEnabledLocales() {
  try {
    const { data: locales, error } = await supabase
      .from('locales')
      .select('code')
      .eq('enabled', true)
      .order('code')

    if (error) {
      console.error('Error fetching locales:', error)
      // Fallback to default locales if database query fails
      return [{ code: 'en' }, { code: 'es' }, { code: 'fr' }, { code: 'de' }]
    }

    return locales || [{ code: 'en' }]
  } catch (error) {
    console.error('Failed to fetch locales:', error)
    // Fallback to default locales
    return [{ code: 'en' }, { code: 'es' }, { code: 'fr' }, { code: 'de' }]
  }
}

/**
 * Generate sitemap URLs for all combinations of brokers and locales
 */
function generateBrokerUrls(brokers: any[], locales: any[]): SitemapUrl[] {
  const urls: SitemapUrl[] = []
  const now = new Date().toISOString()

  for (const broker of brokers) {
    for (const locale of locales) {
      const lastmod = broker.updated_at || now
      
      // Localized broker detail page
      urls.push({
        loc: `${DOMAIN}/${locale.code}/brokers/${broker.slug}`,
        lastmod: lastmod,
        changefreq: 'weekly',
        priority: '0.8'
      })

      // Localized broker review page
      urls.push({
        loc: `${DOMAIN}/${locale.code}/brokers/${broker.slug}/review`,
        lastmod: lastmod,
        changefreq: 'weekly',
        priority: '0.7'
      })
    }
  }

  return urls
}

/**
 * Generate sitemap URLs for static pages in all locales
 */
function generateStaticUrls(locales: any[]): SitemapUrl[] {
  const urls: SitemapUrl[] = []
  const now = new Date().toISOString()

  for (const locale of locales) {
    for (const page of STATIC_PAGES) {
      // Skip root page for non-default locales (handled separately)
      if (page.url === '/' && locale.code !== 'en') {
        urls.push({
          loc: `${DOMAIN}/${locale.code}`,
          lastmod: now,
          changefreq: page.changefreq,
          priority: page.priority
        })
      } else {
        const url = locale.code === 'en' 
          ? `${DOMAIN}${page.url}`
          : `${DOMAIN}/${locale.code}${page.url}`
        
        urls.push({
          loc: url,
          lastmod: now,
          changefreq: page.changefreq,
          priority: page.priority
        })
      }
    }
  }

  return urls
}

/**
 * Generate XML sitemap content
 */
function generateSitemapXml(urls: SitemapUrl[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>'
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const urlsetClose = '</urlset>'

  const urlElements = urls.map(url => {
    return `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  }).join('\n')

  return `${xmlHeader}\n${urlsetOpen}\n${urlElements}\n${urlsetClose}`
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      case '"': return '&quot;'
      default: return c
    }
  })
}

/**
 * Main function to generate sitemap
 */
async function generateSitemap() {
  console.log('🚀 Starting sitemap generation...')
  console.log('Environment variables:')
  console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL)
  console.log('VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
  
  try {
    // Fetch data from Supabase
    console.log('📊 Fetching brokers and locales from Supabase...')
    const [brokers, locales] = await Promise.all([
      fetchActiveBrokers(),
      fetchEnabledLocales()
    ])

    console.log(`✅ Found ${brokers.length} active brokers`)
    console.log(`✅ Found ${locales.length} enabled locales: ${locales.map(l => l.code).join(', ')}`)

    // Generate URLs
    console.log('🔗 Generating sitemap URLs...')
    const staticUrls = generateStaticUrls(locales)
    const brokerUrls = generateBrokerUrls(brokers, locales)
    const allUrls = [...staticUrls, ...brokerUrls]

    console.log(`📝 Generated ${staticUrls.length} static page URLs`)
    console.log(`📝 Generated ${brokerUrls.length} broker page URLs`)
    console.log(`📝 Total URLs: ${allUrls.length}`)

    // Generate XML
    console.log('🔧 Generating XML sitemap...')
    const sitemapXml = generateSitemapXml(allUrls)

    // Write to file
    console.log(`💾 Writing sitemap to ${OUTPUT_PATH}...`)
    await writeFile(OUTPUT_PATH, sitemapXml, 'utf-8')

    console.log('✅ Sitemap generated successfully!')
    console.log(`📍 Location: ${OUTPUT_PATH}`)
    console.log(`📊 Total URLs: ${allUrls.length}`)
    console.log(`🌐 Domain: ${DOMAIN}`)
    
    // Log sample URLs for verification
    console.log('\n📋 Sample URLs:')
    allUrls.slice(0, 5).forEach(url => {
      console.log(`  - ${url.loc} (${url.priority})`)
    })
    if (allUrls.length > 5) {
      console.log(`  ... and ${allUrls.length - 5} more`)
    }

  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    process.exit(1)
  }
}

// Run the script
console.log('Script loaded, checking execution condition...')
console.log('import.meta.url:', import.meta.url)
console.log('process.argv[1]:', process.argv[1])
console.log('file URL:', `file://${process.argv[1]}`)

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Condition met, running generateSitemap...')
  generateSitemap()
} else {
  console.log('Condition not met, script not executed as main module')
  // Force execution for debugging
  generateSitemap()
}

export { generateSitemap }