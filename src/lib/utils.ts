import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Compute a simple hash for duplicate detection
 * This is a simplified version of SimHash for client-side use
 */
export function computeSimHash(text: string): string {
  if (!text || typeof text !== 'string') {
    return '0'
  }
  
  // Normalize text: lowercase, remove extra spaces, basic cleanup
  const normalizedText = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Split into words and create word frequency map
  const words = normalizedText.split(' ').filter(word => word.length > 2)
  const wordFreq: Record<string, number> = {}
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1
  })
  
  // Create a simple hash based on word frequencies
  let hash = 0
  Object.entries(wordFreq).forEach(([word, freq]) => {
    let wordHash = 0
    for (let i = 0; i < word.length; i++) {
      wordHash = ((wordHash << 5) - wordHash + word.charCodeAt(i)) & 0xffffffff
    }
    hash ^= (wordHash * freq)
  })
  
  // Convert to positive hex string
  return Math.abs(hash).toString(16)
}
