import { Suspense, Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { Helmet } from '@dr.pogodin/react-helmet'
import { Layout } from './Layout'
import type { LayoutProps } from './Layout'
import { Breadcrumb } from './Breadcrumb'
import type { BreadcrumbItem } from './Breadcrumb'
import { PageHeader } from './PageHeader'
import { PageLoadingState } from './PageLoadingState'
import { PageErrorFallback } from './PageErrorFallback'
import { WebsiteStructuredData, OrganizationStructuredData, FAQStructuredData } from '@/components/common/StructuredData'
import { cn, containerClasses, sectionClasses } from '@/lib/style-utils'

/**
 * Page Layout Props Interface
 * Comprehensive configuration for page-level layout and SEO
 */
export interface PageLayoutProps extends Omit<LayoutProps, 'children'> {
  /** Page title for SEO and display */
  title: string
  /** Page description for SEO */
  description?: string
  /** Page keywords for SEO */
  keywords?: string[]
  /** Canonical URL for SEO */
  canonicalUrl?: string
  /** Open Graph image URL */
  ogImage?: string
  /** Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  /** Breadcrumb navigation items */
  breadcrumbs?: BreadcrumbItem[]
  /** Page header content */
  header?: ReactNode
  /** Page sidebar content */
  sidebar?: ReactNode
  /** Page actions (buttons, etc.) */
  actions?: ReactNode
  /** Main page content */
  children: ReactNode
  /** Whether to show page header (default: true) */
  showPageHeader?: boolean
  /** Whether to show breadcrumbs (default: true) */
  showBreadcrumbs?: boolean
  /** Page layout variant */
  pageVariant?: 'default' | 'sidebar' | 'full-width' | 'centered'
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: Error | null
  /** Custom loading component */
  loadingComponent?: ReactNode
  /** Custom error component */
  errorComponent?: ReactNode
  /** Structured data for SEO */
  structuredData?: Record<string, any>
  /** Additional meta tags */
  metaTags?: Array<{
    name?: string
    property?: string
    content: string
  }>
  /** Page-specific CSS classes */
  pageClassName?: string
  /** Content container classes */
  contentClassName?: string
  /** Whether to enable page animations */
  enableAnimations?: boolean
}

/**
 * Page Layout Template Component
 * 
 * Provides a comprehensive page layout with:
 * - SEO optimization with meta tags and structured data
 * - Breadcrumb navigation
 * - Loading states and error boundaries
 * - Flexible content areas
 * - Responsive design patterns
 */
export function PageLayout({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  twitterCard = 'summary_large_image',
  breadcrumbs = [],
  header,
  sidebar,
  actions,
  children,
  showPageHeader = true,
  showBreadcrumbs = true,
  pageVariant = 'default',
  isLoading = false,
  error = null,
  loadingComponent,
  errorComponent,
  structuredData,
  metaTags = [],
  pageClassName,
  contentClassName,
  enableAnimations = true,
  ...layoutProps
}: PageLayoutProps) {
  // Generate page-specific structured data
  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: canonicalUrl || window.location.href,
    ...(structuredData || {}),
  }

  // Page container classes
  const pageClasses = cn(
    'min-h-screen',
    {
      'animate-fade-in': enableAnimations,
    },
    pageClassName
  )

  // Content layout classes
  const contentLayoutClasses = cn(
    {
      'grid grid-cols-1': pageVariant === 'default' || pageVariant === 'centered',
      'grid grid-cols-1 lg:grid-cols-4 gap-8': pageVariant === 'sidebar',
      'w-full': pageVariant === 'full-width',
      'max-w-4xl mx-auto': pageVariant === 'centered',
    }
  )

  // Main content classes
  const mainContentClasses = cn(
    {
      'lg:col-span-3': pageVariant === 'sidebar' && sidebar,
      'lg:col-span-4': pageVariant === 'sidebar' && !sidebar,
    },
    contentClassName
  )

  // Sidebar classes
  const sidebarClasses = cn(
    'lg:col-span-1',
    {
      'order-first lg:order-last': pageVariant === 'sidebar',
    }
  )

  /**
   * Handle page error reset
   */
  const handleErrorReset = () => {
    window.location.reload()
  }

  /**
   * Simple Error Boundary Component
   */
  class SimpleErrorBoundary extends Component<
    { children: ReactNode; fallback: ReactNode; onReset?: () => void },
    { hasError: boolean; error?: Error }
  > {
    constructor(props: { children: ReactNode; fallback: ReactNode; onReset?: () => void }) {
      super(props)
      this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('PageLayout Error:', error, errorInfo)
    }

    render() {
      if (this.state.hasError) {
        return this.props.fallback
      }

      return this.props.children
    }
  }

  /**
   * Render page content with error boundary and suspense
   */
  const renderPageContent = () => (
    <SimpleErrorBoundary
      fallback={errorComponent || <PageErrorFallback error={error} resetErrorBoundary={handleErrorReset} />}
      onReset={handleErrorReset}
    >
      <Suspense fallback={loadingComponent || <PageLoadingState />}>
        <div className={pageClasses}>
          {/* Page Header */}
          {showPageHeader && (
            <div className={containerClasses()}>
              <div className={sectionClasses('py-8')}>
                {/* Breadcrumbs */}
                {showBreadcrumbs && breadcrumbs.length > 0 && (
                  <div className="mb-6">
                    <Breadcrumb items={breadcrumbs} />
                  </div>
                )}

                {/* Page Header */}
                {header || (
                  <PageHeader
                    title={title}
                    description={description}
                    actions={actions}
                  />
                )}
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className={containerClasses()}>
            <div className={contentLayoutClasses}>
              {/* Main Content */}
              <main className={mainContentClasses} role="main">
                {isLoading ? (
                  loadingComponent || <PageLoadingState />
                ) : error ? (
                  errorComponent || <PageErrorFallback error={error} resetErrorBoundary={handleErrorReset} />
                ) : (
                  children
                )}
              </main>

              {/* Sidebar */}
              {sidebar && pageVariant === 'sidebar' && (
                <aside className={sidebarClasses} role="complementary" aria-label="Page sidebar">
                  {sidebar}
                </aside>
              )}
            </div>
          </div>
        </div>
      </Suspense>
    </SimpleErrorBoundary>
  )

  return (
    <Layout {...layoutProps}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={title} />
        {description && <meta property="og:description" content={description} />}
        {ogImage && <meta property="og:image" content={ogImage} />}
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="BrokerAnalysis" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={title} />
        {description && <meta name="twitter:description" content={description} />}
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <meta name="twitter:site" content="@brokeranalysis" />
        
        {/* Additional Meta Tags */}
        {metaTags.map((tag, index) => (
          <meta
            key={index}
            {...(tag.name ? { name: tag.name } : {})}
            {...(tag.property ? { property: tag.property } : {})}
            content={tag.content}
          />
        ))}
        
        {/* Viewport and Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#000000" />
        
        {/* Preconnect to External Domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      {/* Structured Data */}
      <WebsiteStructuredData />
      <OrganizationStructuredData />
      <FAQStructuredData />
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            ...defaultStructuredData,
          })}
        </script>
      )}
      

      {/* Page Content */}
      {renderPageContent()}
    </Layout>
  )
}

/**
 * Page Layout Variants
 * Pre-configured page layouts for common use cases
 */

/**
 * Article Page Layout - For blog posts, news articles, etc.
 */
export function ArticlePageLayout({
  structuredData,
  ...props
}: PageLayoutProps) {
  const articleStructuredData = {
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    author: {
      '@type': 'Organization',
      name: 'BrokerAnalysis',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BrokerAnalysis',
      logo: {
        '@type': 'ImageObject',
        url: '/logo.png',
      },
    },
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    ...structuredData,
  }

  return (
    <PageLayout
      {...props}
      pageVariant="centered"
      structuredData={articleStructuredData}
    />
  )
}

/**
 * Broker Page Layout - For individual broker pages
 */
export function BrokerPageLayout({
  structuredData,
  ...props
}: PageLayoutProps) {
  const brokerStructuredData = {
    '@type': 'FinancialService',
    name: props.title,
    description: props.description,
    serviceType: 'Brokerage',
    ...structuredData,
  }

  return (
    <PageLayout
      {...props}
      pageVariant="sidebar"
      structuredData={brokerStructuredData}
    />
  )
}

/**
 * Tool Page Layout - For trading tools and calculators
 */
export function ToolPageLayout({
  structuredData,
  ...props
}: PageLayoutProps) {
  const toolStructuredData = {
    '@type': 'WebApplication',
    name: props.title,
    description: props.description,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    ...structuredData,
  }

  return (
    <PageLayout
      {...props}
      pageVariant="full-width"
      structuredData={toolStructuredData}
    />
  )
}

/**
 * Comparison Page Layout - For broker comparisons
 */
export function ComparisonPageLayout({
  structuredData,
  ...props
}: PageLayoutProps) {
  const comparisonStructuredData = {
    '@type': 'WebPage',
    name: props.title,
    description: props.description,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Broker Comparison',
    },
    ...structuredData,
  }

  return (
    <PageLayout
      {...props}
      pageVariant="full-width"
      structuredData={comparisonStructuredData}
    />
  )
}
