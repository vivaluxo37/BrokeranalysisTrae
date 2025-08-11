// Layout components
// Export Header, Footer, Navigation components

export { Header } from './Header'
export { Footer } from './Footer'
export { Layout, MinimalLayout, FullWidthLayout, ContentLayout } from './Layout'
export { BrokerAnalysisHeader } from './BrokerAnalysisHeader'
export { BrokerAnalysisFooter } from './BrokerAnalysisFooter'
export { ProfessionalHeader } from './ProfessionalHeader'
export { ProfessionalFooter } from './ProfessionalFooter'
export { TrustBar } from './TrustBar'

// New PageLayout components
export { 
  PageLayout, 
  ArticlePageLayout, 
  BrokerPageLayout, 
  ToolPageLayout, 
  ComparisonPageLayout 
} from './PageLayout'
export { Breadcrumb, generateBreadcrumbsFromPath, createBrokerBreadcrumbs, createComparisonBreadcrumbs, createToolBreadcrumbs, createEducationBreadcrumbs, createNewsBreadcrumbs } from './Breadcrumb'

// Breadcrumb hooks
export { 
  useBreadcrumbs, 
  useBrokerBreadcrumbs, 
  useComparisonBreadcrumbs, 
  useToolBreadcrumbs, 
  useEducationBreadcrumbs, 
  useNewsBreadcrumbs 
} from '../../hooks/useBreadcrumbs'
export { PageHeader, HeroPageHeader, SectionHeader, MinimalHeader } from './PageHeader'
export { PageLoadingState, SkeletonLoader, ContentSkeleton, CardSkeleton, TableSkeleton, LoadingStates } from './PageLoadingState'
export { PageErrorFallback, NetworkErrorFallback, NotFoundErrorFallback, PermissionErrorFallback, MinimalErrorFallback, ErrorFallbacks, withErrorBoundary } from './PageErrorFallback'

// Types
export type { LayoutProps } from './Layout'
export type { PageLayoutProps } from './PageLayout'
export type { BreadcrumbItem, BreadcrumbProps } from './Breadcrumb'
export type { PageHeaderProps } from './PageHeader'
export type { PageLoadingStateProps } from './PageLoadingState'
export type { PageErrorFallbackProps } from './PageErrorFallback'
