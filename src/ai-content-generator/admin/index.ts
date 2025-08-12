/**
 * Admin Interface Components
 * 
 * Centralized exports for all administrative interface components
 * used in the AI Content Generator system.
 */

// Main Admin Component
export { default as AIContentGeneratorAdmin } from './components/AIContentGeneratorAdmin';

// System Monitoring
export { SystemMonitor } from './SystemMonitor';
export type {
  SystemMetrics,
  PerformanceMetrics,
  AIProviderStatus,
  ContentGenerationStats,
  DatabaseMetrics,
  SystemAlert,
  AlertThreshold
} from './SystemMonitor';

// Content Management
export { ContentManager } from './ContentManager';
export type {
  ContentJob,
  ContentTemplate,
  ContentAnalytics,
  JobStatus,
  JobPriority,
  TemplateType
} from './ContentManager';

// Configuration Management
export { ConfigurationManager } from './ConfigurationManager';
export type {
  AIProviderConfig,
  SystemConfig,
  EnvironmentVariable,
  ConfigCategory,
  ProviderType
} from './ConfigurationManager';

// User Management
export { UserManagement } from './UserManagement';
export type {
  User,
  UserRole,
  Permission,
  UserActivity,
  UserStatus,
  ActivityType
} from './UserManagement';

// Workflow Management
export { WorkflowManager } from './WorkflowManager';
export type {
  WorkflowDefinition,
  WorkflowTrigger,
  WorkflowStep,
  WorkflowCondition,
  WorkflowSchedule,
  WorkflowExecution,
  WorkflowStepExecution,
  WorkflowLog,
  WorkflowTemplate,
  WorkflowStatus,
  TriggerType,
  StepType,
  ConditionOperator,
  ScheduleType,
  ExecutionStatus
} from './WorkflowManager';

// Log Viewer
export { LogViewer } from './LogViewer';
export type {
  LogEntry,
  LogFilter,
  LogStats,
  LogStream,
  LogViewerProps
} from './LogViewer';

// Re-export component types for convenience
export type {
  SystemMonitorProps
} from './SystemMonitor';

export type {
  ContentManagerProps
} from './ContentManager';

export type {
  ConfigurationManagerProps
} from './ConfigurationManager';

export type {
  UserManagementProps
} from './UserManagement';

export type {
  WorkflowManagerProps
} from './WorkflowManager';
