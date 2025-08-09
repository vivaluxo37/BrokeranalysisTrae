/**
 * Content Version Manager
 * 
 * Manages content versioning, rollbacks, change tracking, and content history
 * for the publishing workflow system.
 */

import { ContentSchema } from '../types';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export interface ContentVersion {
  id: string;
  contentId: string;
  version: number;
  content: ContentSchema;
  checksum: string;
  createdAt: Date;
  createdBy: string;
  changes: ContentChange[];
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  parentVersion?: string;
  metadata: {
    size: number;
    wordCount: number;
    changesSummary: string;
    deploymentInfo?: any;
  };
}

export interface ContentChange {
  field: string;
  oldValue: any;
  newValue: any;
  changeType: 'added' | 'modified' | 'removed';
  timestamp: Date;
}

export interface VersionComparison {
  contentId: string;
  fromVersion: number;
  toVersion: number;
  changes: ContentChange[];
  summary: {
    totalChanges: number;
    fieldsChanged: string[];
    significantChanges: boolean;
  };
}

export interface RollbackResult {
  success: boolean;
  newVersionId: string;
  rolledBackToVersion: number;
  changes: ContentChange[];
  error?: string;
}

export interface VersioningConfig {
  maxVersions: number;
  autoArchiveAfterDays: number;
  significantChangeThreshold: number;
  trackFields: string[];
  compressionEnabled: boolean;
  backupLocation: string;
}

export class ContentVersionManager {
  private config: VersioningConfig;
  private versions: Map<string, ContentVersion[]> = new Map();
  private currentVersions: Map<string, string> = new Map();
  private versionIndex: Map<string, ContentVersion> = new Map();

  constructor(config: VersioningConfig) {
    this.config = config;
  }

  /**
   * Create a new version of content
   */
  async createVersion(
    content: ContentSchema,
    createdBy: string,
    options: {
      tags?: string[];
      forceNewVersion?: boolean;
      changesSummary?: string;
    } = {}
  ): Promise<ContentVersion> {
    const contentVersions = this.versions.get(content.id) || [];
    const currentVersion = this.getCurrentVersion(content.id);
    
    // Calculate changes if there's a previous version
    const changes = currentVersion 
      ? this.calculateChanges(currentVersion.content, content)
      : [];

    // Check if we need a new version
    if (!options.forceNewVersion && !this.shouldCreateNewVersion(changes)) {
      // Update current version in place
      if (currentVersion) {
        currentVersion.content = content;
        currentVersion.checksum = this.calculateChecksum(content);
        currentVersion.metadata.wordCount = this.countWords(content.content || '');
        currentVersion.metadata.size = JSON.stringify(content).length;
        return currentVersion;
      }
    }

    const versionNumber = contentVersions.length + 1;
    const versionId = this.generateVersionId(content.id, versionNumber);
    
    const version: ContentVersion = {
      id: versionId,
      contentId: content.id,
      version: versionNumber,
      content: { ...content },
      checksum: this.calculateChecksum(content),
      createdAt: new Date(),
      createdBy,
      changes,
      tags: options.tags || [],
      status: 'draft',
      parentVersion: currentVersion?.id,
      metadata: {
        size: JSON.stringify(content).length,
        wordCount: this.countWords(content.content || ''),
        changesSummary: options.changesSummary || this.generateChangesSummary(changes)
      }
    };

    // Store version
    contentVersions.push(version);
    this.versions.set(content.id, contentVersions);
    this.versionIndex.set(versionId, version);
    this.currentVersions.set(content.id, versionId);

    // Clean up old versions if needed
    await this.cleanupOldVersions(content.id);

    // Backup version
    await this.backupVersion(version);

    return version;
  }

  /**
   * Get current version of content
   */
  getCurrentVersion(contentId: string): ContentVersion | null {
    const currentVersionId = this.currentVersions.get(contentId);
    return currentVersionId ? this.versionIndex.get(currentVersionId) || null : null;
  }

  /**
   * Get specific version
   */
  getVersion(versionId: string): ContentVersion | null {
    return this.versionIndex.get(versionId) || null;
  }

  /**
   * Get version by number
   */
  getVersionByNumber(contentId: string, versionNumber: number): ContentVersion | null {
    const versions = this.versions.get(contentId) || [];
    return versions.find(v => v.version === versionNumber) || null;
  }

  /**
   * Get all versions for content
   */
  getVersionHistory(contentId: string): ContentVersion[] {
    return this.versions.get(contentId) || [];
  }

  /**
   * Compare two versions
   */
  compareVersions(
    contentId: string,
    fromVersion: number,
    toVersion: number
  ): VersionComparison | null {
    const fromVer = this.getVersionByNumber(contentId, fromVersion);
    const toVer = this.getVersionByNumber(contentId, toVersion);
    
    if (!fromVer || !toVer) {
      return null;
    }

    const changes = this.calculateChanges(fromVer.content, toVer.content);
    
    return {
      contentId,
      fromVersion,
      toVersion,
      changes,
      summary: {
        totalChanges: changes.length,
        fieldsChanged: [...new Set(changes.map(c => c.field))],
        significantChanges: changes.length >= this.config.significantChangeThreshold
      }
    };
  }

  /**
   * Rollback to specific version
   */
  async rollbackToVersion(
    contentId: string,
    targetVersion: number,
    createdBy: string
  ): Promise<RollbackResult> {
    try {
      const targetVer = this.getVersionByNumber(contentId, targetVersion);
      const currentVer = this.getCurrentVersion(contentId);
      
      if (!targetVer) {
        return {
          success: false,
          newVersionId: '',
          rolledBackToVersion: targetVersion,
          changes: [],
          error: `Version ${targetVersion} not found`
        };
      }

      if (!currentVer) {
        return {
          success: false,
          newVersionId: '',
          rolledBackToVersion: targetVersion,
          changes: [],
          error: 'No current version found'
        };
      }

      // Create new version with rolled back content
      const rolledBackContent = { ...targetVer.content };
      const changes = this.calculateChanges(currentVer.content, rolledBackContent);
      
      const newVersion = await this.createVersion(
        rolledBackContent,
        createdBy,
        {
          tags: ['rollback'],
          forceNewVersion: true,
          changesSummary: `Rolled back to version ${targetVersion}`
        }
      );

      return {
        success: true,
        newVersionId: newVersion.id,
        rolledBackToVersion: targetVersion,
        changes
      };
      
    } catch (error) {
      return {
        success: false,
        newVersionId: '',
        rolledBackToVersion: targetVersion,
        changes: [],
        error: error.message
      };
    }
  }

  /**
   * Mark version as published
   */
  markAsPublished(
    versionId: string,
    deploymentInfo?: any
  ): boolean {
    const version = this.versionIndex.get(versionId);
    if (!version) {
      return false;
    }

    version.status = 'published';
    version.metadata.deploymentInfo = deploymentInfo;
    
    return true;
  }

  /**
   * Archive old versions
   */
  async archiveVersion(versionId: string): Promise<boolean> {
    const version = this.versionIndex.get(versionId);
    if (!version) {
      return false;
    }

    version.status = 'archived';
    
    // In a real implementation, this would move to cold storage
    await this.backupVersion(version);
    
    return true;
  }

  /**
   * Delete version
   */
  async deleteVersion(versionId: string): Promise<boolean> {
    const version = this.versionIndex.get(versionId);
    if (!version) {
      return false;
    }

    // Don't delete current version
    const currentVersionId = this.currentVersions.get(version.contentId);
    if (currentVersionId === versionId) {
      return false;
    }

    // Remove from all maps
    this.versionIndex.delete(versionId);
    
    const versions = this.versions.get(version.contentId) || [];
    const filteredVersions = versions.filter(v => v.id !== versionId);
    this.versions.set(version.contentId, filteredVersions);

    return true;
  }

  /**
   * Calculate changes between two content objects
   */
  private calculateChanges(
    oldContent: ContentSchema,
    newContent: ContentSchema
  ): ContentChange[] {
    const changes: ContentChange[] = [];
    const timestamp = new Date();

    // Track only configured fields
    const fieldsToTrack = this.config.trackFields.length > 0 
      ? this.config.trackFields 
      : Object.keys(newContent);

    for (const field of fieldsToTrack) {
      const oldValue = this.getNestedValue(oldContent, field);
      const newValue = this.getNestedValue(newContent, field);
      
      if (!this.deepEqual(oldValue, newValue)) {
        let changeType: 'added' | 'modified' | 'removed';
        
        if (oldValue === undefined && newValue !== undefined) {
          changeType = 'added';
        } else if (oldValue !== undefined && newValue === undefined) {
          changeType = 'removed';
        } else {
          changeType = 'modified';
        }

        changes.push({
          field,
          oldValue,
          newValue,
          changeType,
          timestamp
        });
      }
    }

    return changes;
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Deep equality check
   */
  private deepEqual(a: any, b: any): boolean {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (typeof a !== typeof b) return false;
    
    if (typeof a === 'object') {
      const keysA = Object.keys(a);
      const keysB = Object.keys(b);
      
      if (keysA.length !== keysB.length) return false;
      
      for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!this.deepEqual(a[key], b[key])) return false;
      }
      
      return true;
    }
    
    return false;
  }

  /**
   * Check if new version should be created
   */
  private shouldCreateNewVersion(changes: ContentChange[]): boolean {
    if (changes.length === 0) return false;
    
    // Check for significant changes
    const significantFields = ['title', 'content', 'seo.title', 'seo.metaDescription'];
    const hasSignificantChanges = changes.some(change => 
      significantFields.includes(change.field)
    );
    
    return hasSignificantChanges || changes.length >= this.config.significantChangeThreshold;
  }

  /**
   * Generate changes summary
   */
  private generateChangesSummary(changes: ContentChange[]): string {
    if (changes.length === 0) return 'No changes';
    
    const changesByType = changes.reduce((acc, change) => {
      acc[change.changeType] = (acc[change.changeType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const parts: string[] = [];
    if (changesByType.added) parts.push(`${changesByType.added} added`);
    if (changesByType.modified) parts.push(`${changesByType.modified} modified`);
    if (changesByType.removed) parts.push(`${changesByType.removed} removed`);
    
    return parts.join(', ');
  }

  /**
   * Calculate content checksum
   */
  private calculateChecksum(content: ContentSchema): string {
    const contentString = JSON.stringify(content, Object.keys(content).sort());
    return crypto.createHash('sha256').update(contentString).digest('hex');
  }

  /**
   * Count words in content
   */
  private countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Generate version ID
   */
  private generateVersionId(contentId: string, version: number): string {
    return `${contentId}_v${version}_${Date.now()}`;
  }

  /**
   * Cleanup old versions
   */
  private async cleanupOldVersions(contentId: string): Promise<void> {
    const versions = this.versions.get(contentId) || [];
    
    if (versions.length <= this.config.maxVersions) {
      return;
    }

    // Sort by creation date and keep only the latest versions
    const sortedVersions = versions.sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
    
    const versionsToKeep = sortedVersions.slice(0, this.config.maxVersions);
    const versionsToArchive = sortedVersions.slice(this.config.maxVersions);
    
    // Archive old versions
    for (const version of versionsToArchive) {
      await this.archiveVersion(version.id);
    }
    
    this.versions.set(contentId, versionsToKeep);
  }

  /**
   * Backup version to storage
   */
  private async backupVersion(version: ContentVersion): Promise<void> {
    if (!this.config.compressionEnabled) {
      return;
    }

    try {
      const backupPath = path.join(
        this.config.backupLocation,
        version.contentId,
        `${version.id}.json`
      );
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(backupPath), { recursive: true });
      
      // Write version data
      await fs.writeFile(backupPath, JSON.stringify(version, null, 2));
      
    } catch (error) {
      console.error(`Failed to backup version ${version.id}:`, error);
    }
  }

  /**
   * Restore version from backup
   */
  async restoreVersionFromBackup(
    contentId: string,
    versionId: string
  ): Promise<ContentVersion | null> {
    try {
      const backupPath = path.join(
        this.config.backupLocation,
        contentId,
        `${versionId}.json`
      );
      
      const data = await fs.readFile(backupPath, 'utf-8');
      const version: ContentVersion = JSON.parse(data);
      
      // Restore to memory
      this.versionIndex.set(versionId, version);
      
      const versions = this.versions.get(contentId) || [];
      if (!versions.find(v => v.id === versionId)) {
        versions.push(version);
        this.versions.set(contentId, versions);
      }
      
      return version;
      
    } catch (error) {
      console.error(`Failed to restore version ${versionId}:`, error);
      return null;
    }
  }

  /**
   * Get version statistics
   */
  getVersionStats(): any {
    const allVersions = Array.from(this.versionIndex.values());
    const contentIds = Array.from(this.versions.keys());
    
    return {
      totalVersions: allVersions.length,
      totalContent: contentIds.length,
      averageVersionsPerContent: contentIds.length > 0 
        ? allVersions.length / contentIds.length 
        : 0,
      statusBreakdown: {
        draft: allVersions.filter(v => v.status === 'draft').length,
        published: allVersions.filter(v => v.status === 'published').length,
        archived: allVersions.filter(v => v.status === 'archived').length
      },
      totalSize: allVersions.reduce((sum, v) => sum + v.metadata.size, 0),
      oldestVersion: allVersions.reduce((oldest, v) => 
        !oldest || v.createdAt < oldest.createdAt ? v : oldest, null as ContentVersion | null
      )?.createdAt,
      newestVersion: allVersions.reduce((newest, v) => 
        !newest || v.createdAt > newest.createdAt ? v : newest, null as ContentVersion | null
      )?.createdAt
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<VersioningConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Export version history
   */
  async exportVersionHistory(contentId: string): Promise<string> {
    const versions = this.getVersionHistory(contentId);
    return JSON.stringify(versions, null, 2);
  }

  /**
   * Import version history
   */
  async importVersionHistory(contentId: string, data: string): Promise<boolean> {
    try {
      const versions: ContentVersion[] = JSON.parse(data);
      
      // Validate versions
      for (const version of versions) {
        if (version.contentId !== contentId) {
          throw new Error('Content ID mismatch in version data');
        }
      }
      
      // Import versions
      this.versions.set(contentId, versions);
      
      // Update indexes
      for (const version of versions) {
        this.versionIndex.set(version.id, version);
      }
      
      // Set current version to latest
      const latestVersion = versions.reduce((latest, v) => 
        !latest || v.createdAt > latest.createdAt ? v : latest
      );
      
      if (latestVersion) {
        this.currentVersions.set(contentId, latestVersion.id);
      }
      
      return true;
      
    } catch (error) {
      console.error('Failed to import version history:', error);
      return false;
    }
  }
}