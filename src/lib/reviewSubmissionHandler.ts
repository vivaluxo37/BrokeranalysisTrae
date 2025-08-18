/**
 * Enhanced Review Submission Handler
 * 
 * Features:
 * - Cloudflare Turnstile captcha verification
 * - SimHash duplicate detection
 * - Profanity filtering using bad-words
 * - PII detection using compromise
 * - Rate limiting validation
 * - Admin moderation workflow
 */

import { createClient } from '@supabase/supabase-js'
import Filter from 'bad-words'
import nlp from 'compromise'
import { toast } from 'sonner'

// Types
interface ReviewSubmissionData {
  rating: number
  body: string
  captchaToken: string
  simHash: string
}

interface SubmissionResult {
  success: boolean
  reviewId?: string
  error?: string
  flagged?: boolean
  adminNotes?: string
}

interface TurnstileVerificationResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

// Initialize profanity filter
const profanityFilter = new Filter()

// Add additional profanity words specific to trading/finance
profanityFilter.addWords('scam', 'fraud', 'ponzi', 'pyramid', 'steal', 'thief', 'criminal')

// PII detection patterns
const PII_PATTERNS = {
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b/g,
  ssn: /\b\d{3}-?\d{2}-?\d{4}\b/g,
  creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  address: /\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr)\b/gi
}

/**
 * Verify Cloudflare Turnstile captcha token
 */
async function verifyCaptcha(token: string): Promise<boolean> {
  try {
    const secretKey = process.env.TURNSTILE_SECRET_KEY
    
    if (!secretKey) {
      console.warn('Turnstile secret key not configured, skipping captcha verification')
      return true // Allow in development/demo mode
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token
      })
    })

    const result: TurnstileVerificationResponse = await response.json()
    return result.success
  } catch (error) {
    console.error('Captcha verification failed:', error)
    return false
  }
}

/**
 * Check for duplicate reviews using SimHash
 */
async function checkDuplicateReview(
  supabase: any,
  brokerId: string,
  userId: string,
  simHash: string
): Promise<{ isDuplicate: boolean; similarReviewId?: string }> {
  try {
    // Check for exact duplicate by same user for same broker
    const { data: existingReviews, error } = await supabase
      .from('reviews')
      .select('id, body')
      .eq('broker_id', brokerId)
      .eq('author_id', userId)
      .eq('kind', 'user')

    if (error) {
      console.error('Error checking for duplicates:', error)
      return { isDuplicate: false }
    }

    // Simple SimHash comparison (in production, use a proper SimHash library)
    for (const review of existingReviews || []) {
      const existingHash = computeSimpleHash(review.body)
      const similarity = calculateHashSimilarity(simHash, existingHash)
      
      if (similarity > 0.8) { // 80% similarity threshold
        return { isDuplicate: true, similarReviewId: review.id }
      }
    }

    return { isDuplicate: false }
  } catch (error) {
    console.error('Error in duplicate check:', error)
    return { isDuplicate: false }
  }
}

/**
 * Simple hash function for duplicate detection
 */
function computeSimpleHash(text: string): string {
  const words = text.toLowerCase().split(/\s+/)
  const hash = words.reduce((acc, word) => {
    let wordHash = 0
    for (let i = 0; i < word.length; i++) {
      wordHash = ((wordHash << 5) - wordHash + word.charCodeAt(i)) & 0xffffffff
    }
    return acc ^ wordHash
  }, 0)
  return Math.abs(hash).toString(16)
}

/**
 * Calculate similarity between two hashes
 */
function calculateHashSimilarity(hash1: string, hash2: string): number {
  if (hash1 === hash2) return 1.0
  
  const num1 = parseInt(hash1, 16)
  const num2 = parseInt(hash2, 16)
  const xor = num1 ^ num2
  
  // Count differing bits
  let diffBits = 0
  let temp = xor
  while (temp) {
    diffBits += temp & 1
    temp >>= 1
  }
  
  // Calculate similarity (fewer different bits = higher similarity)
  return 1 - (diffBits / 32) // Assuming 32-bit hash
}

/**
 * Detect profanity in review content
 */
function detectProfanity(text: string): { hasProfanity: boolean; cleanedText: string } {
  const hasProfanity = profanityFilter.isProfane(text)
  const cleanedText = profanityFilter.clean(text)
  
  return { hasProfanity, cleanedText }
}

/**
 * Detect PII (Personally Identifiable Information) in review content
 */
function detectPII(text: string): { hasPII: boolean; piiTypes: string[]; cleanedText: string } {
  const piiTypes: string[] = []
  let cleanedText = text
  
  // Check for various PII patterns
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    if (pattern.test(text)) {
      piiTypes.push(type)
      cleanedText = cleanedText.replace(pattern, '[REDACTED]')
    }
  })
  
  // Use compromise to detect names
  const doc = nlp(text)
  const people = doc.people().out('array')
  if (people.length > 0) {
    piiTypes.push('names')
    people.forEach(name => {
      cleanedText = cleanedText.replace(new RegExp(name, 'gi'), '[NAME]')
    })
  }
  
  return {
    hasPII: piiTypes.length > 0,
    piiTypes,
    cleanedText
  }
}

/**
 * Check rate limiting (max 3 reviews per broker per user per 24 hours)
 */
async function checkRateLimit(
  supabase: any,
  brokerId: string,
  userId: string
): Promise<{ withinLimit: boolean; reviewCount: number }> {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data, error, count } = await supabase
      .from('reviews')
      .select('id', { count: 'exact' })
      .eq('broker_id', brokerId)
      .eq('author_id', userId)
      .eq('kind', 'user')
      .gte('created_at', twentyFourHoursAgo)
    
    if (error) {
      console.error('Error checking rate limit:', error)
      return { withinLimit: true, reviewCount: 0 } // Allow on error
    }
    
    const reviewCount = count || 0
    return {
      withinLimit: reviewCount < 3,
      reviewCount
    }
  } catch (error) {
    console.error('Error in rate limit check:', error)
    return { withinLimit: true, reviewCount: 0 }
  }
}

/**
 * Main review submission handler
 */
export async function submitReview(
  brokerId: string,
  userId: string,
  reviewData: ReviewSubmissionData
): Promise<SubmissionResult> {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    )

    // Step 1: Verify captcha
    const captchaValid = await verifyCaptcha(reviewData.captchaToken)
    if (!captchaValid) {
      return {
        success: false,
        error: 'Captcha verification failed. Please try again.'
      }
    }

    // Step 2: Check rate limiting
    const { withinLimit, reviewCount } = await checkRateLimit(supabase, brokerId, userId)
    if (!withinLimit) {
      return {
        success: false,
        error: `You have reached the maximum of 3 reviews per broker in 24 hours. You have submitted ${reviewCount} reviews.`
      }
    }

    // Step 3: Check for duplicates
    const { isDuplicate, similarReviewId } = await checkDuplicateReview(
      supabase,
      brokerId,
      userId,
      reviewData.simHash
    )
    if (isDuplicate) {
      return {
        success: false,
        error: 'This review appears to be very similar to a previous review you submitted.'
      }
    }

    // Step 4: Content filtering
    const { hasProfanity, cleanedText: profanityCleanedText } = detectProfanity(reviewData.body)
    const { hasPII, piiTypes, cleanedText: piiCleanedText } = detectPII(profanityCleanedText)
    
    // Determine if review should be flagged
    const shouldFlag = hasProfanity || hasPII
    const adminNotes = []
    
    if (hasProfanity) {
      adminNotes.push('Contains profanity')
    }
    if (hasPII) {
      adminNotes.push(`Contains PII: ${piiTypes.join(', ')}`)
    }

    // Step 5: Insert review into database
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        broker_id: brokerId,
        author_id: userId,
        kind: 'user',
        rating: reviewData.rating,
        body: shouldFlag ? piiCleanedText : reviewData.body, // Use cleaned text if flagged
        lang: 'en', // Default to English, could be detected
        flagged: shouldFlag,
        admin_notes: adminNotes.length > 0 ? adminNotes.join('; ') : null,
        published_at: shouldFlag ? null : new Date().toISOString(), // Don't publish if flagged
        created_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error inserting review:', error)
      return {
        success: false,
        error: 'Failed to submit review. Please try again.'
      }
    }

    // Step 6: Return success result
    const result: SubmissionResult = {
      success: true,
      reviewId: data.id,
      flagged: shouldFlag
    }

    if (shouldFlag) {
      result.adminNotes = adminNotes.join('; ')
    }

    return result
  } catch (error) {
    console.error('Review submission error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * Validate review data before submission
 */
export function validateReviewData(data: Partial<ReviewSubmissionData>): string | null {
  if (!data.rating || data.rating < 1 || data.rating > 5) {
    return 'Please provide a rating between 1 and 5 stars'
  }
  
  if (!data.body || data.body.trim().length < 10) {
    return 'Review must be at least 10 characters long'
  }
  
  if (data.body.length > 1000) {
    return 'Review must be less than 1000 characters'
  }
  
  if (!data.captchaToken) {
    return 'Please complete the security verification'
  }
  
  return null
}

export default submitReview