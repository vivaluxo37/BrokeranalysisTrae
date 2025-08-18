import React, { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useQueries } from '@tanstack/react-query'
import { Helmet } from '@dr.pogodin/react-helmet'
import { supabase } from '@/lib/supabase'
import { useI18n } from '@/hooks/useI18n'
import { useAuth } from '@/hooks/useAuth'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Star, CheckCircle, XCircle, ExternalLink, Shield, TrendingUp, Users, Clock, AlertTriangle, Info, ThumbsUp, MessageCircle, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

// Enhanced TypeScript interfaces for comprehensive broker data
interface BrokerData {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website: string;
  rating: number;
  review_count: number;
  min_deposit: number;
  max_leverage: string;
  spreads_from: number;
  regulation: string[];
  platforms: string[];
  founded: number;
  headquarters: string;
  description: string;
  verified: boolean;
  featured: boolean;
  trust_score?: number;
  category: string;
  asset_classes: string[];
  account_types: string[];
  payment_methods: string[];
  customer_support: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  features?: {
    platforms?: string[]
    instruments?: string[]
    min_deposit?: number
  }
  fees?: {
    spread_eur_usd?: number
    commission?: string
  }
}

interface BrokerI18n {
  id: string;
  broker_id: string;
  language: string;
  name?: string;
  tldr_summary?: string;
  editorial_review?: string;
  pros?: string[];
  cons?: string[];
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

interface BrokerFeatures {
  id: string;
  broker_id: string;
  feature_name: string;
  feature_value: string;
  feature_type: 'fee' | 'platform' | 'tool' | 'service' | 'other';
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface RegulationData {
  id: string;
  broker_id: string;
  country: string;
  country_code: string;
  regulator: string;
  regulator_acronym: string;
  license_number?: string;
  license_type: string;
  status: 'active' | 'pending' | 'revoked' | 'suspended';
  issued_date?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

interface ReviewData {
  id: string;
  broker_id: string;
  user_id: string;
  rating: number;
  title: string;
  content: string;
  created_at: string;
  user_name?: string;
  verified: boolean;
  helpful_count: number;
  trading_experience: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  account_type?: string;
  trading_duration?: string;
  updated_at: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
    verified: boolean;
  };
}

interface FAQData {
  id: string;
  broker_id: string;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  language: string;
  created_at: string;
  updated_at: string;
}

interface ComparisonBroker {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  rating: number;
  min_deposit: number;
  spreads_from: number;
  key_features: string[];
}

// Error and loading state types
interface QueryError {
  message: string;
  code?: string;
  details?: any;
}

interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: 'created_at' | 'rating' | 'helpful_count';
  sortOrder?: 'asc' | 'desc';
}

// SEO and structured data types
interface SEOMetadata {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
  alternates: Array<{
    hreflang: string;
    href: string;
  }>;
}

interface JSONLDSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

const BrokerDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { t, currentLanguage } = useI18n()
  const { user } = useAuth()
  const [reviewFilter, setReviewFilter] = useState<'all' | 'verified' | 'recent' | 'helpful'>('all')
  const [newReview, setNewReview] = useState({ 
    rating: 5, 
    title: '', 
    content: '',
    trading_experience: '',
    verified: false
  })
  const [reviewPagination, setReviewPagination] = useState<PaginationParams>({
    page: 1,
    limit: 10,
    sortBy: 'created_at',
    sortOrder: 'desc'
  })

  // Multiple TanStack Query hooks for comprehensive data fetching
  const brokerQueries = useQueries({
    queries: [
      // Main broker data
      {
        queryKey: ['broker', slug],
        queryFn: async (): Promise<BrokerData> => {
          if (!slug) throw new Error('No broker slug provided')
          
          const { data, error } = await supabase
            .from('brokers')
            .select('*')
            .eq('slug', slug)
            .eq('is_active', true)
            .single()
          
          if (error) throw error
          return data as BrokerData
        },
        enabled: !!slug,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
      },
      // Localized content
      {
        queryKey: ['broker-i18n', slug, currentLanguage],
        queryFn: async (): Promise<BrokerI18n | null> => {
          if (!slug) return null
          
          const { data: brokerData } = await supabase
            .from('brokers')
            .select('id')
            .eq('slug', slug)
            .single()
          
          if (!brokerData) return null
          
          const { data, error } = await supabase
            .from('broker_i18n')
            .select('*')
            .eq('broker_id', brokerData.id)
            .eq('language', currentLanguage)
            .single()
          
          if (error && error.code !== 'PGRST116') throw error
          return data as BrokerI18n | null
        },
        enabled: !!slug && !!currentLanguage,
        staleTime: 10 * 60 * 1000,
      },
      // Broker features
      {
        queryKey: ['broker-features', slug],
        queryFn: async (): Promise<BrokerFeatures[]> => {
          if (!slug) return []
          
          const { data: brokerData } = await supabase
            .from('brokers')
            .select('id')
            .eq('slug', slug)
            .single()
          
          if (!brokerData) return []
          
          const { data, error } = await supabase
            .from('broker_features')
            .select('*')
            .eq('broker_id', brokerData.id)
            .order('display_order', { ascending: true })
          
          if (error) throw error
          return data as BrokerFeatures[]
        },
        enabled: !!slug,
        staleTime: 15 * 60 * 1000,
      },
      // Regulation data
      {
        queryKey: ['broker-regulations', slug],
        queryFn: async (): Promise<RegulationData[]> => {
          if (!slug) return []
          
          const { data: brokerData } = await supabase
            .from('brokers')
            .select('id')
            .eq('slug', slug)
            .single()
          
          if (!brokerData) return []
          
          const { data, error } = await supabase
            .from('broker_regulations')
            .select('*')
            .eq('broker_id', brokerData.id)
            .order('country', { ascending: true })
          
          if (error) throw error
          return data as RegulationData[]
        },
        enabled: !!slug,
        staleTime: 30 * 60 * 1000, // Regulations change less frequently
      },
      // FAQ data
      {
        queryKey: ['broker-faqs', slug, currentLanguage],
        queryFn: async (): Promise<FAQData[]> => {
          if (!slug) return []
          
          const { data: brokerData } = await supabase
            .from('brokers')
            .select('id')
            .eq('slug', slug)
            .single()
          
          if (!brokerData) return []
          
          const { data, error } = await supabase
            .from('broker_faqs')
            .select('*')
            .eq('broker_id', brokerData.id)
            .eq('language', currentLanguage)
            .order('order_index', { ascending: true })
          
          if (error) throw error
          return data as FAQData[]
        },
        enabled: !!slug && !!currentLanguage,
        staleTime: 20 * 60 * 1000,
      },
    ],
  })

  // Extract query results with proper typing
  const [
    { data: broker, isLoading: brokerLoading, error: brokerError },
    { data: brokerI18n, isLoading: i18nLoading, error: i18nError },
    { data: brokerFeatures, isLoading: featuresLoading, error: featuresError },
    { data: regulations, isLoading: regulationsLoading, error: regulationsError },
    { data: faqs, isLoading: faqsLoading, error: faqsError },
  ] = brokerQueries

  // Separate query for reviews with pagination
  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError, refetch: refetchReviews } = useQuery({
    queryKey: ['broker-reviews', slug, reviewPagination],
    queryFn: async (): Promise<{ reviews: ReviewData[], total: number }> => {
      if (!slug) return { reviews: [], total: 0 }
      
      const { data: brokerData } = await supabase
        .from('brokers')
        .select('id')
        .eq('slug', slug)
        .single()
      
      if (!brokerData) return { reviews: [], total: 0 }
      
      const from = (reviewPagination.page - 1) * reviewPagination.limit
      const to = from + reviewPagination.limit - 1
      
      const { data, error, count } = await supabase
        .from('broker_reviews')
        .select(`
          *,
          user:profiles(id, username, avatar_url, verified)
        `, { count: 'exact' })
        .eq('broker_id', brokerData.id)
        .order(reviewPagination.sortBy || 'created_at', { 
          ascending: reviewPagination.sortOrder === 'asc' 
        })
        .range(from, to)
      
      if (error) throw error
      return { 
        reviews: data as ReviewData[], 
        total: count || 0 
      }
    },
    enabled: !!slug,
    staleTime: 2 * 60 * 1000, // Reviews update more frequently
  })

  // Separate query for comparison brokers
  const { data: comparisonBrokers } = useQuery({
    queryKey: ['comparison-brokers', broker?.category],
    queryFn: async (): Promise<ComparisonBroker[]> => {
      if (!broker?.category || !broker?.id) return []
      
      const { data, error } = await supabase
        .from('brokers')
        .select('id, name, slug, logo_url, rating, min_deposit, spreads_from')
        .eq('category', broker.category)
        .eq('is_active', true)
        .neq('id', broker.id)
        .order('rating', { ascending: false })
        .limit(3)
      
      if (error) throw error
      return data.map(b => ({
        ...b,
        key_features: [] // This would be populated from features table
      })) as ComparisonBroker[]
    },
    enabled: !!broker?.category && !!broker?.id,
    staleTime: 15 * 60 * 1000,
  })

  // Combined loading and error states
  const isLoading = brokerLoading || i18nLoading || featuresLoading || regulationsLoading || faqsLoading
  const hasError = brokerError || i18nError || featuresError || regulationsError || faqsError
  const reviews = reviewsData?.reviews || []
  const totalReviews = reviewsData?.total || 0

  // SEO metadata generation
  const seoMetadata = useMemo((): SEOMetadata => {
    if (!broker) {
      return {
        title: 'Broker Details | BrokerAnalysis',
        description: 'Comprehensive broker analysis and reviews',
        canonical: `${window.location.origin}/brokers/${slug}`,
        alternates: []
      }
    }

    // Use i18n title with BrokerAnalysis suffix as specified
    const i18nTitle = brokerI18n?.meta_title || broker.name
    const title = `${i18nTitle} | BrokerAnalysis`
    
    // Use tldr_summary as description as specified
    const description = brokerI18n?.meta_description || 
      brokerI18n?.tldr_summary || 
      `${broker.description.substring(0, 150)}. Rating: ${broker.rating}/5 from ${broker.review_count} reviews.`
    
    // Generate canonical URL for current locale
    const canonicalUrl = currentLanguage === 'en' 
      ? `${window.location.origin}/brokers/${broker.slug}`
      : `${window.location.origin}/${currentLanguage}/brokers/${broker.slug}`
    
    // Generate og:image URL pointing to API endpoint as specified
    const ogImageUrl = `${window.location.origin}/api/og/broker?slug=${broker.slug}`
    
    // Generate alternates for all supported locales + x-default
    const supportedLanguages = ['en', 'es', 'fr', 'de', 'it', 'pt']
    const alternates = [
      // x-default pointing to root as specified
      { hreflang: 'x-default', href: `${window.location.origin}/` },
      // All supported locales
      ...supportedLanguages.map(lang => ({
        hreflang: lang,
        href: lang === 'en' 
          ? `${window.location.origin}/brokers/${broker.slug}`
          : `${window.location.origin}/${lang}/brokers/${broker.slug}`
      }))
    ]
    
    return {
      title,
      description,
      canonical: canonicalUrl,
      ogImage: ogImageUrl,
      alternates
    }
  }, [broker, brokerI18n, slug, currentLanguage])

  // JSON-LD structured data generation
  const jsonLdSchemas = useMemo((): JSONLDSchema[] => {
    if (!broker) return []

    const schemas: JSONLDSchema[] = []

    // Organization schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      name: broker.name,
      description: brokerI18n?.editorial_review || broker.description,
      url: broker.website,
      logo: broker.logo_url,
      foundingDate: broker.founded?.toString(),
      address: {
        '@type': 'PostalAddress',
        addressLocality: broker.headquarters
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: broker.rating,
        reviewCount: broker.review_count,
        bestRating: 5,
        worstRating: 1
      },
      offers: {
        '@type': 'Offer',
        description: `Trading services with minimum deposit of $${broker.min_deposit}`,
        priceSpecification: {
          '@type': 'PriceSpecification',
          price: broker.min_deposit,
          priceCurrency: 'USD'
        }
      }
    })

    // Review schema with individual reviews
    if (reviews.length > 0) {
      reviews.slice(0, 5).forEach(review => {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'FinancialService',
            name: broker.name
          },
          author: {
            '@type': 'Person',
            name: review.user?.username || review.user_name || 'Anonymous'
          },
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1
          },
          reviewBody: review.content,
          datePublished: review.created_at,
          headline: review.title
        })
      })
    }

    // FAQ schema
    if (faqs && faqs.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(faq => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      })
    }

    // Breadcrumb schema
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${window.location.origin}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Brokers',
          item: `${window.location.origin}/brokers`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: broker.name,
          item: `${window.location.origin}/brokers/${broker.slug}`
        }
      ]
    })

    return schemas
  }, [broker, brokerI18n, reviews, faqs])

  // Submit new review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error(t('auth.loginRequired'))
      return
    }
    
    if (!broker?.id || !newReview.title || !newReview.content) return
    
    try {
      const { error } = await supabase
        .from('broker_reviews')
        .insert({
          broker_id: broker.id,
          user_id: user.id,
          rating: newReview.rating,
          title: newReview.title,
          content: newReview.content,
          trading_experience: 'intermediate',
          verified: false
        })
      
      if (error) throw error
      
      toast.success(t('review.submitted'))
      setNewReview({ rating: 5, title: '', content: '', trading_experience: '', verified: false })
      refetchReviews()
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error(t('review.submitError'))
    }
  }

  // Enhanced loading states with skeletons
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
          
          {/* TL;DR skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
          
          {/* Main content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Pros/Cons skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-16" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-16" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-4 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Editorial review skeleton */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar skeleton */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Enhanced error handling
  if (hasError || !broker) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              {!broker ? 'Broker Not Found' : 'Error Loading Broker'}
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              {!broker 
                ? "The broker you're looking for doesn't exist or has been removed." 
                : 'We encountered an error while loading the broker information. Please try again later.'
              }
            </p>
          </div>
          
          {hasError && (
            <Alert className="max-w-md mx-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {brokerError?.message || i18nError?.message || 'An unexpected error occurred'}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
            <Button asChild>
              <Link to="/brokers">Browse All Brokers</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Use broker data with fallbacks
  const displayName = broker.name
  const displayTldr = `${broker.name} is a trading broker offering various financial instruments with competitive conditions.`
  const displayEditorial = `${broker.name} provides trading services with a focus on user experience and regulatory compliance.`
  const displayPros = ['Regulated broker', 'Multiple trading platforms', 'Competitive spreads']
  const displayCons = ['Limited educational resources', 'Withdrawal fees may apply']

  // Helper functions for URL generation
  const generateCanonicalUrl = (brokerSlug: string): string => {
    return `${window.location.origin}/brokers/${brokerSlug}`
  }

  const generateAlternateUrls = (brokerSlug: string) => {
    const languages = ['en', 'es', 'fr', 'de', 'it', 'pt']
    return languages.map(lang => ({
      hreflang: lang,
      href: `${window.location.origin}/${lang}/brokers/${brokerSlug}`
    }))
  }

  return (
    <>
      <Helmet>
        <title>{seoMetadata.title}</title>
        <meta name="description" content={seoMetadata.description} />
        <link rel="canonical" href={seoMetadata.canonical} />
        
        {seoMetadata.alternates.map(alt => (
          <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
        ))}
        
        {/* OpenGraph tags */}
        <meta property="og:title" content={seoMetadata.title} />
        <meta property="og:description" content={seoMetadata.description} />
        <meta property="og:url" content={seoMetadata.canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="BrokerAnalysis" />
        {seoMetadata.ogImage && <meta property="og:image" content={seoMetadata.ogImage} />}
        
        {/* Twitter tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoMetadata.title} />
        <meta name="twitter:description" content={seoMetadata.description} />
        {seoMetadata.ogImage && <meta name="twitter:image" content={seoMetadata.ogImage} />}
        
        {/* JSON-LD structured data */}
        {jsonLdSchemas.map((schema, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {broker.logo_url && (
              <img 
                src={broker.logo_url} 
                alt={`${displayName} logo`}
                className="w-16 h-16 object-contain"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{displayName}</h1>
              {broker.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(broker.rating!)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {broker.rating}/5 ({broker.review_count || 0} reviews)
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <Button asChild className="mb-4">
            <a href={`https://example.com`} target="_blank" rel="noopener noreferrer">
              Visit {displayName} <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </header>

        {/* TL;DR Section */}
        {displayTldr && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">TL;DR</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{displayTldr}</p>
            </CardContent>
          </Card>
        )}

        {/* Pros and Cons */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {displayPros.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-green-700 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Pros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {displayPros.map((pro, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{pro}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          
          {displayCons.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-red-700 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Cons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {displayCons.map((con, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{con}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Enhanced Key Facts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Info className="h-5 w-5" />
              Key Facts
            </CardTitle>
            <CardDescription>
              Essential information about {broker.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Rating
                </dt>
                <dd className="font-semibold flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(broker.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-1">{broker.rating}/5</span>
                  <span className="text-sm text-gray-500">({broker.review_count} reviews)</span>
                </dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-600">Minimum Deposit</dt>
                <dd className="font-semibold text-green-600">${broker.min_deposit?.toLocaleString() || 'N/A'}</dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-600">Maximum Leverage</dt>
                <dd className="font-semibold">{broker.max_leverage || 'N/A'}</dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-600">Spreads From</dt>
                <dd className="font-semibold">{broker.spreads_from ? `${broker.spreads_from} pips` : 'N/A'}</dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-600 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Founded
                </dt>
                <dd className="font-semibold">{broker.founded || 'N/A'}</dd>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-600">Headquarters</dt>
                <dd className="font-semibold">{broker.headquarters || 'N/A'}</dd>
              </div>
              
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-600">Platforms</dt>
                <dd className="font-semibold text-right max-w-48">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {broker.platforms?.map((platform, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    )) || 'N/A'}
                  </div>
                </dd>
              </div>
              
              <div className="flex justify-between items-start py-2 border-b border-gray-100">
                <dt className="font-medium text-gray-600">Asset Classes</dt>
                <dd className="font-semibold text-right max-w-48">
                  <div className="flex flex-wrap gap-1 justify-end">
                    {broker.asset_classes?.map((asset, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {asset}
                      </Badge>
                    )) || 'N/A'}
                  </div>
                </dd>
              </div>
              
              {broker.trust_score && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <dt className="font-medium text-gray-600 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Trust Score
                  </dt>
                  <dd className="font-semibold">
                    <Badge 
                      variant={broker.trust_score >= 8 ? 'default' : broker.trust_score >= 6 ? 'secondary' : 'destructive'}
                    >
                      {broker.trust_score}/10
                    </Badge>
                  </dd>
                </div>
              )}
              
              <div className="flex justify-between items-center py-2">
                <dt className="font-medium text-gray-600 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Verified
                </dt>
                <dd className="font-semibold">
                  {broker.verified ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Pending
                    </Badge>
                  )}
                </dd>
              </div>
            </dl>
            
            {/* Additional broker features */}
            {brokerFeatures && brokerFeatures.length > 0 && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Additional Features</h4>
                <div className="grid grid-cols-1 gap-2">
                  {brokerFeatures.map((feature) => (
                    <div key={feature.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{feature.feature_name}</span>
                      <span className="font-medium">{feature.feature_value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 pt-6 border-t space-y-3">
              <Button asChild className="w-full">
                <a href={broker.website} target="_blank" rel="noopener noreferrer">
                  Visit Broker Website
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              
              {comparisonBrokers && comparisonBrokers.length > 0 && (
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/compare?brokers=${broker.slug},${comparisonBrokers[0]?.slug}`}>
                    Compare with Similar Brokers
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Regulation Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Regulation & Licensing
            </CardTitle>
            <CardDescription>
              Regulatory oversight and licensing information for {broker.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {regulations && regulations.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Country/Region</TableHead>
                      <TableHead>Regulatory Body</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>License Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regulations.map((regulation) => (
                      <TableRow key={regulation.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{regulation.country_code}</span>
                            {regulation.country}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{regulation.regulator}</div>
                            {regulation.regulator_acronym && (
                              <div className="text-sm text-gray-500">({regulation.regulator_acronym})</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {regulation.license_number ? (
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                              {regulation.license_number}
                            </code>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={regulation.status === 'active' ? 'default' : 
                                    regulation.status === 'pending' ? 'secondary' : 'destructive'}
                            className={regulation.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                          >
                            {regulation.status?.charAt(0).toUpperCase() + regulation.status?.slice(1) || 'Unknown'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{regulation.license_type || 'Standard'}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No detailed regulation information available</p>
                {broker.regulation && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{Array.isArray(broker.regulation) ? broker.regulation.join(', ') : broker.regulation}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Regulation Notes */}
            <div className="mt-6 pt-6 border-t">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Important Note</p>
                    <p className="text-blue-800">
                      Regulatory status can change. Always verify current licensing with the respective regulatory bodies before trading.
                      {broker.verified && ' This broker has been verified by our team.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Editorial Review */}
        {displayEditorial && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Editorial Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {displayEditorial.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Accordion */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Info className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Common questions about {broker.name} answered by our experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {faqs && faqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq) => (
                  <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        {faq.updated_at && (
                          <p className="text-xs text-gray-500 mt-3 border-t pt-2">
                            Last updated: {new Date(faq.updated_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No FAQ available for this broker yet.</p>
                <p className="text-sm text-gray-400">
                  Have a question? Contact our support team and we'll add it to the FAQ.
                </p>
              </div>
            )}
            
            {/* FAQ Footer */}
            <div className="mt-6 pt-6 border-t">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-1">Need More Help?</p>
                    <p className="text-gray-700">
                      Can't find what you're looking for? Visit our{' '}
                      <Link to="/help" className="text-blue-600 hover:text-blue-800 underline">
                        Help Center
                      </Link>{' '}
                      or contact our support team for personalized assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Reviews Section */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Reviews
              </CardTitle>
              {reviewsData && (
                <div className="text-sm text-gray-600">
                  {reviewsData.total} review{reviewsData.total !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            {reviewsData && reviewsData.reviews.length > 0 && (
              <CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(reviewsData.average_rating || 0)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {reviewsData.average_rating?.toFixed(1) || '0.0'}
                    </span>
                    <span className="text-gray-500">({reviewsData.total} reviews)</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {reviewsData.verified_count || 0} verified
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {reviewsData.recent_count || 0} recent
                    </Badge>
                  </div>
                </div>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {/* Review Filters */}
            {reviewsData && reviewsData.reviews.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={reviewFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReviewFilter('all')}
                  >
                    All Reviews
                  </Button>
                  <Button
                    variant={reviewFilter === 'verified' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReviewFilter('verified')}
                  >
                    Verified Only
                  </Button>
                  <Button
                    variant={reviewFilter === 'recent' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReviewFilter('recent')}
                  >
                    Recent (30 days)
                  </Button>
                  <Button
                    variant={reviewFilter === 'helpful' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setReviewFilter('helpful')}
                  >
                    Most Helpful
                  </Button>
                </div>
              </div>
            )}

            {/* Review Form for Logged In Users */}
            {user && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="font-semibold mb-4">Write a Review</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Rating</label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setNewReview(prev => ({ ...prev, rating }))}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                rating <= newReview.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Trading Experience</label>
                      <select
                        value={newReview.trading_experience || ''}
                        onChange={(e) => setNewReview(prev => ({ ...prev, trading_experience: e.target.value }))}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select experience level</option>
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (1-3 years)</option>
                        <option value="advanced">Advanced (3-5 years)</option>
                        <option value="expert">Expert (5+ years)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Review Title</label>
                    <input
                      type="text"
                      value={newReview.title}
                      onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full p-2 border rounded"
                      placeholder="Summarize your experience"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Detailed Review</label>
                    <Textarea
                      value={newReview.content}
                      onChange={(e) => setNewReview(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Share your detailed experience with this broker. What did you like? What could be improved?"
                      rows={4}
                      maxLength={1000}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {newReview.content.length}/1000 characters
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="verified-trader"
                      checked={newReview.verified || false}
                      onChange={(e) => setNewReview(prev => ({ ...prev, verified: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="verified-trader" className="text-sm">
                      I am a verified trader with this broker
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSubmitReview} 
                      disabled={!newReview.title || !newReview.content || newReview.rating === 0}
                      className="flex-1"
                    >
                      Submit Review
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setNewReview({ rating: 0, title: '', content: '', trading_experience: '', verified: false })}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviewsData && reviewsData.reviews.length > 0 ? (
              <div className="space-y-4">
                {reviewsData.reviews.map((review) => (
                  <div key={review.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-lg">{review.title}</h4>
                          {review.verified && (
                            <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-medium">{review.rating}/5</span>
                          </div>
                          <span>by {review.profiles?.full_name || 'Anonymous'}</span>
                          {review.trading_experience && (
                            <Badge variant="outline" className="text-xs capitalize">
                              {review.trading_experience}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                        {review.helpful_count > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {review.helpful_count} found helpful
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3">{review.content}</p>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs">
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Helpful ({review.helpful_count || 0})
                        </Button>
                        <Button variant="ghost" size="sm" className="text-xs">
                          <MessageCircle className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.floor((Date.now() - new Date(review.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Enhanced Pagination */}
                {reviewsData.total > reviewPagination.limit && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Showing {((reviewPagination.page - 1) * reviewPagination.limit) + 1} to {Math.min(reviewPagination.page * reviewPagination.limit, reviewsData.total)} of {reviewsData.total} reviews
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                        disabled={reviewPagination.page === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: Math.min(5, Math.ceil(reviewsData.total / reviewPagination.limit)) }, (_, i) => {
                        const pageNum = reviewPagination.page <= 3 ? i + 1 : reviewPagination.page - 2 + i;
                        return (
                          <Button
                            key={pageNum}
                            variant={reviewPagination.page === pageNum ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setReviewPagination(prev => ({ ...prev, page: pageNum }))}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReviewPagination(prev => ({ ...prev, page: Math.min(Math.ceil(reviewsData.total / reviewPagination.limit), prev.page + 1) }))}
                        disabled={reviewPagination.page >= Math.ceil(reviewsData.total / reviewPagination.limit)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 mb-4">
                  {user ? 'Be the first to share your experience with this broker!' : 'Sign in to write the first review.'}
                </p>
                {!user && (
                  <Button variant="outline" onClick={() => window.location.href = '/auth/login'}>
                    Sign In to Review
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Internal Links / Topic Cluster */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Related Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/comparison/best-online-brokers" className="text-blue-600 hover:underline">
                Best Online Brokers 2024
              </Link>
              <Link to="/tools/brokerage-fee-calculator" className="text-blue-600 hover:underline">
                Brokerage Fee Calculator
              </Link>
              <Link to="/education/how-to-choose-broker-2025" className="text-blue-600 hover:underline">
                How to Choose a Broker
              </Link>
              <Link to="/comparison/best-forex-brokers" className="text-blue-600 hover:underline">
                Best Forex Brokers
              </Link>
              <Link to="/tools/find-my-broker" className="text-blue-600 hover:underline">
                Broker Finder Tool
              </Link>
              <Link to="/education/trading-glossary" className="text-blue-600 hover:underline">
                Trading Glossary
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default BrokerDetail

// Helper function to generate canonical URL and alternates
export const generateBrokerCanonicalAndAlternates = (slug: string) => {
  const baseUrl = 'https://brokeranalysis.com'
  const canonical = `${baseUrl}/brokers/${slug}`
  
  const alternates = [
    { hreflang: 'en', href: `${baseUrl}/brokers/${slug}` },
    { hreflang: 'es', href: `${baseUrl}/es/brokers/${slug}` },
    { hreflang: 'fr', href: `${baseUrl}/fr/brokers/${slug}` },
    { hreflang: 'de', href: `${baseUrl}/de/brokers/${slug}` },
    { hreflang: 'x-default', href: canonical }
  ]
  
  return { canonical, alternates }
}