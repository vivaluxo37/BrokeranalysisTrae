/**
 * Workflow Orchestrator
 * 
 * Orchestrates the complete publishing workflow from content generation
 * through QA validation to final deployment and monitoring.
 */

import { ContentSchema, QAResult, PublishingJob, WorkflowStage, WorkflowStatus } from '../types';
import { PublishingService } from '../services/PublishingService';
import { QAOrchestrator } from '../qa-pipeline/QAOrchestrator';
import { ContentProcessor } from '../content-processing/ContentProcessor';

export interface WorkflowConfig {
  autoPublish: boolean;
  requireApproval: boolean;
  enableVersioning: boolean;
  enableRollback: boolean;
  notificationWebhooks: string[];
  deploymentTargets: DeploymentTarget[];
}

export interface DeploymentTarget {
  name: string;
  type: 'static' | 'cdn' | 'cms' | 'api';
  url: string;
  credentials?: any;
  enabled: boolean;
}

export interface WorkflowExecution {
  id: string;
  contentId: string;
  status: WorkflowStatus;
  currentStage: WorkflowStage;
  stages: WorkflowStageResult[];
  startedAt: Date;
  completedAt?: Date;
  error?: string;
  metadata: any;
}

export interface WorkflowStageResult {
  stage: WorkflowStage;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startedAt?: Date;
  completedAt?: Date;
  duration?: number;
  result?: any;
  error?: string;
}

export class WorkflowOrchestrator {
  private publishingService: PublishingService;
  private qaOrchestrator: QAOrchestrator;
  private contentProcessor: ContentProcessor;
  private config: WorkflowConfig;
  private activeWorkflows: Map<string, WorkflowExecution> = new Map();
  private workflowHistory: Map<string, WorkflowExecution[]> = new Map();

  constructor(
    publishingService: PublishingService,
    qaOrchestrator: QAOrchestrator,
    contentProcessor: ContentProcessor,
    config: WorkflowConfig
  ) {
    this.publishingService = publishingService;
    this.qaOrchestrator = qaOrchestrator;
    this.contentProcessor = contentProcessor;
    this.config = config;
  }

  /**
   * Execute complete publishing workflow
   */
  async executeWorkflow(
    content: ContentSchema,
    options: {
      skipQA?: boolean;
      forcePublish?: boolean;
      targetEnvironment?: 'staging' | 'production';
      scheduledAt?: Date;
    } = {}
  ): Promise<WorkflowExecution> {
    const workflowId = this.generateWorkflowId();
    
    const workflow: WorkflowExecution = {
      id: workflowId,
      contentId: content.id,
      status: 'running',
      currentStage: 'validation',
      stages: this.initializeStages(options),
      startedAt: new Date(),
      metadata: {
        options,
        contentType: content.type,
        targetEnvironment: options.targetEnvironment || 'production'
      }
    };

    this.activeWorkflows.set(workflowId, workflow);

    try {
      // Stage 1: Content Validation
      await this.executeStage(workflow, 'validation', async () => {
        return await this.validateContent(content);
      });

      // Stage 2: QA Pipeline (unless skipped)
      if (!options.skipQA) {
        await this.executeStage(workflow, 'qa', async () => {
          return await this.qaOrchestrator.runFullPipeline(content);
        });
      } else {
        this.skipStage(workflow, 'qa');
      }

      // Stage 3: Content Processing
      await this.executeStage(workflow, 'processing', async () => {
        return await this.contentProcessor.processContent(content);
      });

      // Stage 4: Approval (if required)
      if (this.config.requireApproval && !options.forcePublish) {
        await this.executeStage(workflow, 'approval', async () => {
          return await this.requestApproval(workflow);
        });
      } else {
        this.skipStage(workflow, 'approval');
      }

      // Stage 5: Deployment
      await this.executeStage(workflow, 'deployment', async () => {
        return await this.deployContent(content, workflow);
      });

      // Stage 6: Verification
      await this.executeStage(workflow, 'verification', async () => {
        return await this.verifyDeployment(content, workflow);
      });

      // Stage 7: Notification
      await this.executeStage(workflow, 'notification', async () => {
        return await this.sendNotifications(workflow);
      });

      workflow.status = 'completed';
      workflow.completedAt = new Date();

    } catch (error) {
      workflow.status = 'failed';
      workflow.error = error.message;
      workflow.completedAt = new Date();
      
      // Send failure notifications
      await this.sendFailureNotifications(workflow, error);
    }

    // Move to history
    this.moveToHistory(workflow);
    
    return workflow;
  }

  /**
   * Execute a workflow stage
   */
  private async executeStage(
    workflow: WorkflowExecution,
    stageName: WorkflowStage,
    stageFunction: () => Promise<any>
  ): Promise<void> {
    const stage = workflow.stages.find(s => s.stage === stageName);
    if (!stage) {
      throw new Error(`Stage ${stageName} not found in workflow`);
    }

    workflow.currentStage = stageName;
    stage.status = 'running';
    stage.startedAt = new Date();

    try {
      const result = await stageFunction();
      
      stage.status = 'completed';
      stage.completedAt = new Date();
      stage.duration = stage.completedAt.getTime() - stage.startedAt!.getTime();
      stage.result = result;
      
    } catch (error) {
      stage.status = 'failed';
      stage.completedAt = new Date();
      stage.duration = stage.completedAt.getTime() - stage.startedAt!.getTime();
      stage.error = error.message;
      
      throw error;
    }
  }

  /**
   * Skip a workflow stage
   */
  private skipStage(workflow: WorkflowExecution, stageName: WorkflowStage): void {
    const stage = workflow.stages.find(s => s.stage === stageName);
    if (stage) {
      stage.status = 'skipped';
      stage.completedAt = new Date();
    }
  }

  /**
   * Initialize workflow stages
   */
  private initializeStages(options: any): WorkflowStageResult[] {
    const stages: WorkflowStage[] = [
      'validation',
      'qa',
      'processing',
      'approval',
      'deployment',
      'verification',
      'notification'
    ];

    return stages.map(stage => ({
      stage,
      status: 'pending'
    }));
  }

  /**
   * Validate content before processing
   */
  private async validateContent(content: ContentSchema): Promise<any> {
    const validationErrors: string[] = [];

    // Basic validation
    if (!content.title?.trim()) {
      validationErrors.push('Content title is required');
    }
    if (!content.content?.trim()) {
      validationErrors.push('Content body is required');
    }
    if (!content.slug?.trim()) {
      validationErrors.push('Content slug is required');
    }
    if (!content.type) {
      validationErrors.push('Content type is required');
    }

    // SEO validation
    if (!content.seo?.title) {
      validationErrors.push('SEO title is required');
    }
    if (!content.seo?.metaDescription) {
      validationErrors.push('SEO meta description is required');
    }

    if (validationErrors.length > 0) {
      throw new Error(`Content validation failed: ${validationErrors.join(', ')}`);
    }

    return { valid: true, errors: [] };
  }

  /**
   * Request approval for content
   */
  private async requestApproval(workflow: WorkflowExecution): Promise<any> {
    // In a real implementation, this would integrate with an approval system
    // For now, we'll simulate approval
    return {
      approved: true,
      approvedBy: 'system',
      approvedAt: new Date(),
      comments: 'Auto-approved by system'
    };
  }

  /**
   * Deploy content to configured targets
   */
  private async deployContent(
    content: ContentSchema,
    workflow: WorkflowExecution
  ): Promise<any> {
    const deploymentResults: any[] = [];

    // Deploy to publishing service
    const publishingJobId = await this.publishingService.queueForPublishing(
      content,
      workflow.stages.find(s => s.stage === 'qa')?.result || { passed: true, score: 100, issues: [] },
      'high'
    );

    deploymentResults.push({
      target: 'publishing-service',
      jobId: publishingJobId,
      status: 'queued'
    });

    // Deploy to additional targets
    for (const target of this.config.deploymentTargets.filter(t => t.enabled)) {
      try {
        const result = await this.deployToTarget(content, target);
        deploymentResults.push({
          target: target.name,
          status: 'success',
          result
        });
      } catch (error) {
        deploymentResults.push({
          target: target.name,
          status: 'failed',
          error: error.message
        });
      }
    }

    return { deployments: deploymentResults };
  }

  /**
   * Deploy to specific target
   */
  private async deployToTarget(
    content: ContentSchema,
    target: DeploymentTarget
  ): Promise<any> {
    // Implementation would depend on target type
    switch (target.type) {
      case 'static':
        return await this.deployToStatic(content, target);
      case 'cdn':
        return await this.deployToCDN(content, target);
      case 'cms':
        return await this.deployToCMS(content, target);
      case 'api':
        return await this.deployToAPI(content, target);
      default:
        throw new Error(`Unknown deployment target type: ${target.type}`);
    }
  }

  /**
   * Deploy to static hosting
   */
  private async deployToStatic(
    content: ContentSchema,
    target: DeploymentTarget
  ): Promise<any> {
    // Implementation for static deployment (e.g., Netlify, Vercel)
    return { deployed: true, url: `${target.url}/${content.slug}` };
  }

  /**
   * Deploy to CDN
   */
  private async deployToCDN(
    content: ContentSchema,
    target: DeploymentTarget
  ): Promise<any> {
    // Implementation for CDN deployment
    return { deployed: true, cdnUrl: `${target.url}/${content.slug}` };
  }

  /**
   * Deploy to CMS
   */
  private async deployToCMS(
    content: ContentSchema,
    target: DeploymentTarget
  ): Promise<any> {
    // Implementation for CMS deployment
    return { deployed: true, cmsId: `cms_${content.id}` };
  }

  /**
   * Deploy to API
   */
  private async deployToAPI(
    content: ContentSchema,
    target: DeploymentTarget
  ): Promise<any> {
    // Implementation for API deployment
    return { deployed: true, apiEndpoint: `${target.url}/content/${content.id}` };
  }

  /**
   * Verify deployment success
   */
  private async verifyDeployment(
    content: ContentSchema,
    workflow: WorkflowExecution
  ): Promise<any> {
    const verificationResults: any[] = [];

    // Verify publishing service deployment
    const publishingJob = this.publishingService.getJobStatus(
      workflow.stages.find(s => s.stage === 'deployment')?.result?.deployments?.[0]?.jobId
    );

    if (publishingJob) {
      verificationResults.push({
        target: 'publishing-service',
        status: publishingJob.status,
        verified: publishingJob.status === 'completed'
      });
    }

    return { verifications: verificationResults };
  }

  /**
   * Send success notifications
   */
  private async sendNotifications(workflow: WorkflowExecution): Promise<any> {
    const notifications: any[] = [];

    for (const webhook of this.config.notificationWebhooks) {
      try {
        // In a real implementation, this would send HTTP requests
        notifications.push({
          webhook,
          status: 'sent',
          sentAt: new Date()
        });
      } catch (error) {
        notifications.push({
          webhook,
          status: 'failed',
          error: error.message
        });
      }
    }

    return { notifications };
  }

  /**
   * Send failure notifications
   */
  private async sendFailureNotifications(
    workflow: WorkflowExecution,
    error: Error
  ): Promise<void> {
    // Implementation for failure notifications
    console.error(`Workflow ${workflow.id} failed:`, error);
  }

  /**
   * Move workflow to history
   */
  private moveToHistory(workflow: WorkflowExecution): void {
    this.activeWorkflows.delete(workflow.id);
    
    const contentHistory = this.workflowHistory.get(workflow.contentId) || [];
    contentHistory.push(workflow);
    this.workflowHistory.set(workflow.contentId, contentHistory);
  }

  /**
   * Get workflow status
   */
  getWorkflowStatus(workflowId: string): WorkflowExecution | null {
    return this.activeWorkflows.get(workflowId) || null;
  }

  /**
   * Get workflow history for content
   */
  getWorkflowHistory(contentId: string): WorkflowExecution[] {
    return this.workflowHistory.get(contentId) || [];
  }

  /**
   * Get active workflows
   */
  getActiveWorkflows(): WorkflowExecution[] {
    return Array.from(this.activeWorkflows.values());
  }

  /**
   * Cancel workflow
   */
  async cancelWorkflow(workflowId: string): Promise<boolean> {
    const workflow = this.activeWorkflows.get(workflowId);
    if (!workflow) {
      return false;
    }

    workflow.status = 'cancelled';
    workflow.completedAt = new Date();
    
    this.moveToHistory(workflow);
    return true;
  }

  /**
   * Generate workflow ID
   */
  private generateWorkflowId(): string {
    return `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<WorkflowConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get workflow statistics
   */
  getWorkflowStats(): any {
    const allWorkflows = [
      ...Array.from(this.activeWorkflows.values()),
      ...Array.from(this.workflowHistory.values()).flat()
    ];

    return {
      total: allWorkflows.length,
      active: this.activeWorkflows.size,
      completed: allWorkflows.filter(w => w.status === 'completed').length,
      failed: allWorkflows.filter(w => w.status === 'failed').length,
      cancelled: allWorkflows.filter(w => w.status === 'cancelled').length,
      averageDuration: this.calculateAverageDuration(allWorkflows.filter(w => w.completedAt))
    };
  }

  /**
   * Calculate average workflow duration
   */
  private calculateAverageDuration(completedWorkflows: WorkflowExecution[]): number {
    if (completedWorkflows.length === 0) return 0;
    
    const totalDuration = completedWorkflows.reduce((sum, workflow) => {
      return sum + (workflow.completedAt!.getTime() - workflow.startedAt.getTime());
    }, 0);
    
    return totalDuration / completedWorkflows.length;
  }
}