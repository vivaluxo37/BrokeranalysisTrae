/**
 * Quality Analyzer
 * 
 * Uses AI to analyze content quality, readability, tone, and overall
 * effectiveness for the target audience.
 */

import { ContentSchema, QAIssue } from '../types';
import { AIProviderGateway } from '../services/AIProviderGateway';

export interface QualityMetrics {
  readabilityScore: number;
  toneConsistency: number;
  engagementPotential: number;
  professionalismScore: number;
  clarityScore: number;
  overallQuality: number;
}

export interface QualityAnalysisResult {
  metrics: QualityMetrics;
  issues: QAIssue[];
  suggestions: string[];
  confidence: number;
}

export class QualityAnalyzer {
  private aiGateway: AIProviderGateway;
  private analysisCache: Map<string, QualityAnalysisResult> = new Map();

  constructor(aiGateway: AIProviderGateway) {
    this.aiGateway = aiGateway;
  }

  /**
   * Analyze content quality using AI
   */
  async analyzeQuality(content: ContentSchema): Promise<QAIssue[]> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(content);
      if (this.analysisCache.has(cacheKey)) {
        return this.analysisCache.get(cacheKey)!.issues;
      }

      // Perform AI analysis
      const analysisResult = await this.performAIAnalysis(content);
      
      // Cache the result
      this.analysisCache.set(cacheKey, analysisResult);
      
      return analysisResult.issues;
    } catch (error) {
      console.error('Quality analysis failed:', error);
      return [{
        type: 'content-quality',
        severity: 'warning',
        message: `Quality analysis failed: ${error.message}`,
        location: 'system',
        suggestion: 'Review content quality manually'
      }];
    }
  }

  /**
   * Get detailed quality metrics
   */
  async getQualityMetrics(content: ContentSchema): Promise<QualityMetrics> {
    try {
      const cacheKey = this.generateCacheKey(content);
      let analysisResult = this.analysisCache.get(cacheKey);
      
      if (!analysisResult) {
        analysisResult = await this.performAIAnalysis(content);
        this.analysisCache.set(cacheKey, analysisResult);
      }
      
      return analysisResult.metrics;
    } catch (error) {
      console.error('Failed to get quality metrics:', error);
      return {
        readabilityScore: 0.5,
        toneConsistency: 0.5,
        engagementPotential: 0.5,
        professionalismScore: 0.5,
        clarityScore: 0.5,
        overallQuality: 0.5
      };
    }
  }

  /**
   * Perform AI-powered quality analysis
   */
  private async performAIAnalysis(content: ContentSchema): Promise<QualityAnalysisResult> {
    const prompt = this.buildAnalysisPrompt(content);
    
    const response = await this.aiGateway.generateContent({
      prompt,
      maxTokens: 1500,
      temperature: 0.1,
      contentType: 'quality-analysis'
    });

    if (!response.success || !response.content) {
      throw new Error('AI analysis request failed');
    }

    return this.parseAnalysisResponse(response.content);
  }

  /**
   * Build analysis prompt for AI
   */
  private buildAnalysisPrompt(content: ContentSchema): string {
    return `
Analyze the following content for quality, readability, and effectiveness. Provide a comprehensive assessment.

Content Type: ${content.type}
Title: ${content.title}
Target Audience: Financial services users, traders, and investors
Content Length: ${this.countWords(content.content)} words

Content:
${content.content.substring(0, 3000)}${content.content.length > 3000 ? '...' : ''}

Please analyze the content across these dimensions:

1. **Readability** (0-1): How easy is it to read and understand?
   - Sentence structure and length
   - Vocabulary complexity
   - Paragraph organization
   - Use of jargon and technical terms

2. **Tone Consistency** (0-1): Is the tone appropriate and consistent?
   - Professional yet accessible
   - Consistent voice throughout
   - Appropriate for financial content
   - Engaging but not overly casual

3. **Engagement Potential** (0-1): How likely is it to engage readers?
   - Compelling introduction
   - Clear value proposition
   - Use of examples and scenarios
   - Call-to-action effectiveness

4. **Professionalism** (0-1): Does it maintain professional standards?
   - Accuracy of information
   - Appropriate disclaimers
   - Credible and authoritative tone
   - Proper formatting and structure

5. **Clarity** (0-1): How clear and well-organized is the content?
   - Logical flow of information
   - Clear headings and structure
   - Effective use of bullet points/lists
   - Conclusion and key takeaways

Identify specific issues and provide actionable suggestions for improvement.

Respond in the following JSON format:
{
  "metrics": {
    "readabilityScore": 0.85,
    "toneConsistency": 0.90,
    "engagementPotential": 0.75,
    "professionalismScore": 0.95,
    "clarityScore": 0.80,
    "overallQuality": 0.85
  },
  "issues": [
    {
      "type": "readability|tone|engagement|professionalism|clarity",
      "severity": "error|warning|info",
      "message": "Specific issue description",
      "location": "Location in content or section",
      "suggestion": "Specific improvement suggestion"
    }
  ],
  "suggestions": [
    "Overall improvement suggestion 1",
    "Overall improvement suggestion 2"
  ],
  "confidence": 0.92
}
`;
  }

  /**
   * Parse AI analysis response
   */
  private parseAnalysisResponse(response: string): QualityAnalysisResult {
    try {
      const parsed = JSON.parse(response);
      
      // Validate and normalize the response
      const metrics: QualityMetrics = {
        readabilityScore: this.normalizeScore(parsed.metrics?.readabilityScore),
        toneConsistency: this.normalizeScore(parsed.metrics?.toneConsistency),
        engagementPotential: this.normalizeScore(parsed.metrics?.engagementPotential),
        professionalismScore: this.normalizeScore(parsed.metrics?.professionalismScore),
        clarityScore: this.normalizeScore(parsed.metrics?.clarityScore),
        overallQuality: this.normalizeScore(parsed.metrics?.overallQuality)
      };

      // Calculate overall quality if not provided
      if (!parsed.metrics?.overallQuality) {
        metrics.overallQuality = this.calculateOverallQuality(metrics);
      }

      const issues: QAIssue[] = (parsed.issues || []).map((issue: any) => ({
        type: 'content-quality',
        severity: issue.severity || 'warning',
        message: issue.message || 'Quality issue detected',
        location: issue.location || 'content',
        suggestion: issue.suggestion || 'Review and improve content quality'
      }));

      return {
        metrics,
        issues,
        suggestions: parsed.suggestions || [],
        confidence: this.normalizeScore(parsed.confidence || 0.8)
      };
    } catch (error) {
      console.error('Failed to parse AI analysis response:', error);
      
      // Fallback analysis
      return this.performFallbackAnalysis(response);
    }
  }

  /**
   * Perform fallback analysis when AI parsing fails
   */
  private performFallbackAnalysis(response: string): QualityAnalysisResult {
    const issues: QAIssue[] = [];
    const suggestions: string[] = [];

    // Basic text analysis
    const wordCount = this.countWords(response);
    const sentenceCount = (response.match(/[.!?]+/g) || []).length;
    const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);

    // Readability assessment
    let readabilityScore = 0.7;
    if (avgWordsPerSentence > 25) {
      readabilityScore -= 0.2;
      issues.push({
        type: 'content-quality',
        severity: 'warning',
        message: 'Sentences are too long, affecting readability',
        location: 'content',
        suggestion: 'Break down long sentences into shorter, clearer ones'
      });
    }

    // Check for common quality issues
    if (response.toLowerCase().includes('lorem ipsum')) {
      issues.push({
        type: 'content-quality',
        severity: 'error',
        message: 'Content contains placeholder text',
        location: 'content',
        suggestion: 'Replace placeholder text with actual content'
      });
    }

    const metrics: QualityMetrics = {
      readabilityScore,
      toneConsistency: 0.7,
      engagementPotential: 0.6,
      professionalismScore: 0.7,
      clarityScore: 0.6,
      overallQuality: 0.65
    };

    return {
      metrics,
      issues,
      suggestions: ['Consider professional editing for improved quality'],
      confidence: 0.5
    };
  }

  /**
   * Calculate overall quality score
   */
  private calculateOverallQuality(metrics: QualityMetrics): number {
    const weights = {
      readabilityScore: 0.25,
      toneConsistency: 0.20,
      engagementPotential: 0.20,
      professionalismScore: 0.25,
      clarityScore: 0.10
    };

    return (
      metrics.readabilityScore * weights.readabilityScore +
      metrics.toneConsistency * weights.toneConsistency +
      metrics.engagementPotential * weights.engagementPotential +
      metrics.professionalismScore * weights.professionalismScore +
      metrics.clarityScore * weights.clarityScore
    );
  }

  /**
   * Normalize score to 0-1 range
   */
  private normalizeScore(score: any): number {
    const num = parseFloat(score);
    if (isNaN(num)) return 0.5;
    return Math.max(0, Math.min(1, num));
  }

  /**
   * Generate cache key for content
   */
  private generateCacheKey(content: ContentSchema): string {
    const contentHash = this.simpleHash(content.content + content.title);
    return `${content.type}-${contentHash}`;
  }

  /**
   * Simple hash function for caching
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    return content
      .replace(/[#*`\[\]()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }

  /**
   * Clear analysis cache
   */
  clearCache(): void {
    this.analysisCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: this.analysisCache.size,
      hitRate: 0.75 // This would be calculated from actual usage
    };
  }
}