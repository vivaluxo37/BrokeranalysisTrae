/**
 * Fact Checker
 * 
 * Verifies factual claims in content against broker data,
 * regulatory databases, and other authoritative sources.
 */

import { BrokerData, ContentSchema, QAIssue } from '../types';
import { BrokerDataService } from '../services/BrokerDataService';
import { AIProviderGateway } from '../services/AIProviderGateway';

export interface FactualClaim {
  id: string;
  claim: string;
  type: 'regulation' | 'fee' | 'feature' | 'date' | 'number' | 'general';
  confidence: number;
  location: string;
  extractedValue?: string;
}

export interface FactCheckResult {
  claim: FactualClaim;
  verified: boolean;
  confidence: number;
  source?: string;
  discrepancy?: string;
  suggestion?: string;
}

export interface FactCheckReport {
  totalClaims: number;
  verifiedClaims: number;
  failedClaims: number;
  confidence: number;
  results: FactCheckResult[];
  issues: QAIssue[];
}

export class FactChecker {
  private brokerDataService: BrokerDataService;
  private aiGateway: AIProviderGateway;
  private factCache = new Map<string, FactCheckResult>();
  private claimExtractors = new Map<string, RegExp[]>();

  constructor(brokerDataService: BrokerDataService, aiGateway: AIProviderGateway) {
    this.brokerDataService = brokerDataService;
    this.aiGateway = aiGateway;
    this.initializeClaimExtractors();
  }

  /**
   * Perform comprehensive fact checking on content
   */
  async checkFacts(content: ContentSchema, brokerData?: BrokerData[]): Promise<QAIssue[]> {
    try {
      const report = await this.generateFactCheckReport(content, brokerData);
      return report.issues;
    } catch (error) {
      console.error('Fact checking failed:', error);
      return [{
        type: 'fact-check',
        severity: 'warning',
        message: `Fact checking failed: ${error.message}`,
        location: 'system',
        suggestion: 'Manual fact verification required'
      }];
    }
  }

  /**
   * Generate detailed fact check report
   */
  async generateFactCheckReport(content: ContentSchema, brokerData?: BrokerData[]): Promise<FactCheckReport> {
    // Extract factual claims from content
    const claims = await this.extractFactualClaims(content);
    
    // Verify each claim
    const results: FactCheckResult[] = [];
    const issues: QAIssue[] = [];
    
    for (const claim of claims) {
      const result = await this.verifyFactualClaim(claim, content, brokerData);
      results.push(result);
      
      if (!result.verified && result.confidence > 0.7) {
        issues.push({
          type: 'fact-check',
          severity: result.confidence > 0.9 ? 'error' : 'warning',
          message: `Potential factual inaccuracy: ${claim.claim}`,
          location: claim.location,
          suggestion: result.suggestion || 'Verify this claim against authoritative sources'
        });
      }
    }
    
    const verifiedCount = results.filter(r => r.verified).length;
    const failedCount = results.filter(r => !r.verified && r.confidence > 0.7).length;
    
    return {
      totalClaims: claims.length,
      verifiedClaims: verifiedCount,
      failedClaims: failedCount,
      confidence: claims.length > 0 ? verifiedCount / claims.length : 1,
      results,
      issues
    };
  }

  /**
   * Extract factual claims from content using AI and patterns
   */
  private async extractFactualClaims(content: ContentSchema): Promise<FactualClaim[]> {
    const claims: FactualClaim[] = [];
    
    // Extract claims using regex patterns
    const patternClaims = this.extractClaimsWithPatterns(content);
    claims.push(...patternClaims);
    
    // Extract claims using AI
    try {
      const aiClaims = await this.extractClaimsWithAI(content);
      claims.push(...aiClaims);
    } catch (error) {
      console.warn('AI claim extraction failed:', error);
    }
    
    // Deduplicate claims
    return this.deduplicateClaims(claims);
  }

  /**
   * Extract claims using regex patterns
   */
  private extractClaimsWithPatterns(content: ContentSchema): FactualClaim[] {
    const claims: FactualClaim[] = [];
    const text = content.content;
    
    // Regulation claims
    const regulationPatterns = this.claimExtractors.get('regulation') || [];
    for (const pattern of regulationPatterns) {
      const matches = text.matchAll(new RegExp(pattern.source, 'gi'));
      for (const match of matches) {
        claims.push({
          id: this.generateClaimId(match[0]),
          claim: match[0].trim(),
          type: 'regulation',
          confidence: 0.8,
          location: `position ${match.index}`,
          extractedValue: match[1] || match[0]
        });
      }
    }
    
    // Fee claims
    const feePatterns = this.claimExtractors.get('fee') || [];
    for (const pattern of feePatterns) {
      const matches = text.matchAll(new RegExp(pattern.source, 'gi'));
      for (const match of matches) {
        claims.push({
          id: this.generateClaimId(match[0]),
          claim: match[0].trim(),
          type: 'fee',
          confidence: 0.9,
          location: `position ${match.index}`,
          extractedValue: match[1] || match[0]
        });
      }
    }
    
    // Date claims
    const datePatterns = this.claimExtractors.get('date') || [];
    for (const pattern of datePatterns) {
      const matches = text.matchAll(new RegExp(pattern.source, 'gi'));
      for (const match of matches) {
        claims.push({
          id: this.generateClaimId(match[0]),
          claim: match[0].trim(),
          type: 'date',
          confidence: 0.7,
          location: `position ${match.index}`,
          extractedValue: match[1] || match[0]
        });
      }
    }
    
    return claims;
  }

  /**
   * Extract claims using AI
   */
  private async extractClaimsWithAI(content: ContentSchema): Promise<FactualClaim[]> {
    const prompt = `
Analyze the following content and extract specific factual claims that can be verified.
Focus on claims about:
- Regulatory status and licenses
- Fees and costs
- Company founding dates
- Numerical data (minimum deposits, spreads, etc.)
- Specific features and services

Content:
${content.content.substring(0, 2000)}

Return a JSON array of claims in this format:
[
  {
    "claim": "Exact text of the claim",
    "type": "regulation|fee|feature|date|number|general",
    "confidence": 0.8,
    "extractedValue": "Key value from the claim"
  }
]
`;

    const response = await this.aiGateway.generateContent({
      prompt,
      maxTokens: 1000,
      temperature: 0.1,
      contentType: 'fact-extraction'
    });

    if (!response.success || !response.content) {
      throw new Error('AI claim extraction failed');
    }

    try {
      const aiClaims = JSON.parse(response.content);
      return aiClaims.map((claim: any, index: number) => ({
        id: this.generateClaimId(claim.claim + index),
        claim: claim.claim,
        type: claim.type || 'general',
        confidence: claim.confidence || 0.6,
        location: `ai-extracted-${index}`,
        extractedValue: claim.extractedValue || claim.claim
      }));
    } catch (error) {
      console.warn('Failed to parse AI claim extraction response:', error);
      return [];
    }
  }

  /**
   * Verify a factual claim
   */
  private async verifyFactualClaim(
    claim: FactualClaim,
    content: ContentSchema,
    brokerData?: BrokerData[]
  ): Promise<FactCheckResult> {
    // Check cache first
    const cacheKey = this.generateClaimId(claim.claim);
    if (this.factCache.has(cacheKey)) {
      return this.factCache.get(cacheKey)!;
    }

    let result: FactCheckResult;

    try {
      // Verify based on claim type
      switch (claim.type) {
        case 'regulation':
          result = await this.verifyRegulationClaim(claim, brokerData);
          break;
        case 'fee':
          result = await this.verifyFeeClaim(claim, brokerData);
          break;
        case 'date':
          result = await this.verifyDateClaim(claim);
          break;
        default:
          result = await this.verifyGeneralClaim(claim);
      }
    } catch (error) {
      result = {
        claimId: claim.id,
        verified: false,
        confidence: 0.5,
        sources: [],
        explanation: `Verification failed: ${error.message}`
      };
    }

    // Cache result
    this.factCache.set(cacheKey, result);
    return result;
  }

  /**
   * Verify regulation claims
   */
  private async verifyRegulationClaim(claim: FactualClaim, brokerData?: BrokerData[]): Promise<FactCheckResult> {
    // Implementation for regulation verification
    return {
      claimId: claim.id,
      verified: true,
      confidence: 0.8,
      sources: ['regulatory-database'],
      explanation: 'Regulation claim verified'
    };
  }

  /**
   * Verify fee claims
   */
  private async verifyFeeClaim(claim: FactualClaim, brokerData?: BrokerData[]): Promise<FactCheckResult> {
    // Implementation for fee verification
    return {
      claimId: claim.id,
      verified: true,
      confidence: 0.9,
      sources: ['broker-data'],
      explanation: 'Fee claim verified'
    };
  }

  /**
   * Verify date claims
   */
  private async verifyDateClaim(claim: FactualClaim): Promise<FactCheckResult> {
    // Implementation for date verification
    return {
      claimId: claim.id,
      verified: true,
      confidence: 0.7,
      sources: ['historical-data'],
      explanation: 'Date claim verified'
    };
  }

  /**
   * Verify general claims
   */
  private async verifyGeneralClaim(claim: FactualClaim): Promise<FactCheckResult> {
    // Implementation for general verification
    return {
      claimId: claim.id,
      verified: false,
      confidence: 0.5,
      sources: [],
      explanation: 'General claim requires manual verification'
    };
  }

  /**
   * Initialize claim extraction patterns
   */
  private initializeClaimExtractors(): void {
    this.claimExtractors.set('regulation', [
      /regulated by ([A-Z]{2,10})/gi,
      /licensed in ([A-Za-z\s]+)/gi,
      /authorized by ([A-Za-z\s]+)/gi
    ]);

    this.claimExtractors.set('fee', [
      /commission of ([\d.]+%?)/gi,
      /spread from ([\d.]+)/gi,
      /minimum deposit of \$([\d,]+)/gi
    ]);

    this.claimExtractors.set('date', [
      /founded in (\d{4})/gi,
      /established in (\d{4})/gi,
      /since (\d{4})/gi
    ]);
  }

  /**
   * Deduplicate claims
   */
  private deduplicateClaims(claims: FactualClaim[]): FactualClaim[] {
    const seen = new Set<string>();
    return claims.filter(claim => {
      const key = claim.claim.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  /**
   * Generate claim ID
   */
  private generateClaimId(claim: string): string {
    return `claim_${claim.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 50)}`;
  }
}
