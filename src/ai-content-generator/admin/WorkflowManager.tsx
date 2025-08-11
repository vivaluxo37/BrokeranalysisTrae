/**
 * Workflow Manager Component
 * 
 * Administrative interface for managing content generation workflows,
 * pipeline orchestration, and automated publishing processes.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Database,
  Download,
  Edit,
  FileText,
  Filter,
  GitBranch,
  Globe,
  Image,
  Pause,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  Square,
  Target,
  Timer,
  Trash2,
  Upload,
  Users,
  Workflow,
  XCircle,
  Zap
} from 'lucide-react';

export interface WorkflowDefinition {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'inactive' | 'draft';
  trigger: WorkflowTrigger;
  steps: WorkflowStep[];
  schedule?: WorkflowSchedule;
  metadata: {
    author: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    category: string;
  };
  settings: {
    timeout: number;
    retryAttempts: number;
    parallelExecution: boolean;
    errorHandling: 'stop' | 'continue' | 'retry';
    notifications: {
      onSuccess: boolean;
      onFailure: boolean;
      onStart: boolean;
      recipients: string[];
    };
  };
}

export interface WorkflowTrigger {
  type: 'manual' | 'scheduled' | 'webhook' | 'file_upload' | 'api_call';
  config: Record<string, any>;
  conditions?: WorkflowCondition[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: 'content_generation' | 'qa_validation' | 'publishing' | 'notification' | 'data_processing' | 'custom';
  config: Record<string, any>;
  dependencies: string[];
  timeout: number;
  retryAttempts: number;
  onFailure: 'stop' | 'continue' | 'retry';
  conditions?: WorkflowCondition[];
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'exists';
  value: any;
}

export interface WorkflowSchedule {
  type: 'cron' | 'interval' | 'once';
  expression: string;
  timezone: string;
  enabled: boolean;
  nextRun?: Date;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  trigger: {
    type: string;
    source: string;
    data?: Record<string, any>;
  };
  steps: WorkflowStepExecution[];
  logs: WorkflowLog[];
  metrics: {
    totalSteps: number;
    completedSteps: number;
    failedSteps: number;
    skippedSteps: number;
    processingTime: number;
    resourceUsage: {
      cpu: number;
      memory: number;
      storage: number;
    };
  };
  output?: Record<string, any>;
  error?: {
    message: string;
    stack: string;
    step: string;
  };
}

export interface WorkflowStepExecution {
  stepId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  input?: Record<string, any>;
  output?: Record<string, any>;
  error?: string;
  retryCount: number;
}

export interface WorkflowLog {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  stepId?: string;
  data?: Record<string, any>;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  definition: Partial<WorkflowDefinition>;
  isPublic: boolean;
  usageCount: number;
  rating: number;
  author: string;
  createdAt: Date;
}

export interface WorkflowManagerProps {
  onWorkflowUpdate?: (workflow: WorkflowDefinition) => void;
  onExecutionUpdate?: (execution: WorkflowExecution) => void;
}

export const WorkflowManager: React.FC<WorkflowManagerProps> = ({
  onWorkflowUpdate,
  onExecutionUpdate
}) => {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowDefinition | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [showWorkflowBuilder, setShowWorkflowBuilder] = useState(false);
  const [activeTab, setActiveTab] = useState('workflows');

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [workflowsResponse, executionsResponse, templatesResponse] = await Promise.all([
        fetch('/api/admin/workflows'),
        fetch('/api/admin/workflows/executions'),
        fetch('/api/admin/workflows/templates')
      ]);

      if (workflowsResponse.ok) {
        const workflowsData = await workflowsResponse.json();
        setWorkflows(workflowsData);
      }

      if (executionsResponse.ok) {
        const executionsData = await executionsResponse.json();
        setExecutions(executionsData);
      }

      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData);
      }
    } catch (error) {
      console.error('Failed to fetch workflow data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    
    // Set up real-time updates for executions
    const interval = setInterval(() => {
      fetchExecutions();
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchData]);

  const fetchExecutions = async () => {
    try {
      const response = await fetch('/api/admin/workflows/executions');
      if (response.ok) {
        const data = await response.json();
        setExecutions(data);
      }
    } catch (error) {
      console.error('Failed to fetch executions:', error);
    }
  };

  const handleWorkflowAction = async (workflowId: string, action: string, params?: any) => {
    try {
      const response = await fetch(`/api/admin/workflows/${workflowId}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params || {})
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error(`Failed to ${action} workflow:`, error);
    }
  };

  const handleExecutionAction = async (executionId: string, action: string) => {
    try {
      const response = await fetch(`/api/admin/workflows/executions/${executionId}/${action}`, {
        method: 'POST'
      });

      if (response.ok) {
        await fetchExecutions();
      }
    } catch (error) {
      console.error(`Failed to ${action} execution:`, error);
    }
  };

  const handleWorkflowUpdate = async (workflowId: string, updates: Partial<WorkflowDefinition>) => {
    try {
      const response = await fetch(`/api/admin/workflows/${workflowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await fetchData();
        onWorkflowUpdate?.(updates as WorkflowDefinition);
      }
    } catch (error) {
      console.error('Failed to update workflow:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return 'bg-green-100 text-green-800';
      case 'running': case 'pending': return 'bg-blue-100 text-blue-800';
      case 'failed': case 'cancelled': return 'bg-red-100 text-red-800';
      case 'inactive': case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running': return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'failed': case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'inactive': case 'draft': return <Pause className="h-4 w-4 text-gray-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'content_generation': return <FileText className="h-4 w-4" />;
      case 'qa_validation': return <Shield className="h-4 w-4" />;
      case 'publishing': return <Globe className="h-4 w-4" />;
      case 'notification': return <Users className="h-4 w-4" />;
      case 'data_processing': return <Database className="h-4 w-4" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = searchQuery === '' || 
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || workflow.metadata.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const workflowStats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    inactive: workflows.filter(w => w.status === 'inactive').length,
    draft: workflows.filter(w => w.status === 'draft').length
  };

  const executionStats = {
    total: executions.length,
    running: executions.filter(e => e.status === 'running').length,
    completed: executions.filter(e => e.status === 'completed').length,
    failed: executions.filter(e => e.status === 'failed').length,
    pending: executions.filter(e => e.status === 'pending').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading workflow manager...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Workflow Manager</h2>
          <p className="text-muted-foreground">
            Manage content generation workflows and automation pipelines
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setShowWorkflowBuilder(true)} variant="outline">
            <GitBranch className="h-4 w-4 mr-2" />
            Builder
          </Button>
          <Button onClick={() => setShowCreateWorkflow(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{workflowStats.total}</div>
            <p className="text-xs text-muted-foreground">Total Workflows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{workflowStats.active}</div>
            <p className="text-xs text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{executionStats.running}</div>
            <p className="text-xs text-muted-foreground">Running</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-600">{executionStats.failed}</div>
            <p className="text-xs text-muted-foreground">Failed Today</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">
            <Workflow className="h-4 w-4 mr-2" />
            Workflows ({workflows.length})
          </TabsTrigger>
          <TabsTrigger value="executions">
            <Activity className="h-4 w-4 mr-2" />
            Executions ({executions.length})
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Copy className="h-4 w-4 mr-2" />
            Templates ({templates.length})
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="publishing">Publishing</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Workflows Grid */}
          <div className="grid gap-4">
            {filteredWorkflows.map((workflow) => (
              <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Workflow className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{workflow.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(workflow.status)}>
                        {workflow.status.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">v{workflow.version}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <GitBranch className="h-4 w-4" />
                          <span>{workflow.steps.length} steps</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Timer className="h-4 w-4" />
                          <span>{workflow.settings.timeout}s timeout</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Target className="h-4 w-4" />
                          <span>{workflow.metadata.category}</span>
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        Updated {workflow.metadata.updatedAt.toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {workflow.steps.slice(0, 5).map((step) => (
                        <div key={step.id} className="flex items-center space-x-1 text-xs bg-muted px-2 py-1 rounded">
                          {getStepTypeIcon(step.type)}
                          <span>{step.name}</span>
                        </div>
                      ))}
                      {workflow.steps.length > 5 && (
                        <Badge variant="outline">+{workflow.steps.length - 5} more</Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {workflow.schedule && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Calendar className="h-3 w-3 mr-1" />
                            Scheduled
                          </Badge>
                        )}
                        {workflow.trigger.type === 'webhook' && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <Zap className="h-3 w-3 mr-1" />
                            Webhook
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWorkflowAction(workflow.id, 'execute')}
                          disabled={workflow.status !== 'active'}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedWorkflow(workflow)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWorkflowAction(workflow.id, 'duplicate')}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleWorkflowAction(workflow.id, 'delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="executions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Executions</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left">
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Workflow</th>
                      <th className="p-4 font-medium">Progress</th>
                      <th className="p-4 font-medium">Duration</th>
                      <th className="p-4 font-medium">Trigger</th>
                      <th className="p-4 font-medium">Started</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {executions.slice(0, 20).map((execution) => {
                      const workflow = workflows.find(w => w.id === execution.workflowId);
                      const progress = (execution.metrics.completedSteps / execution.metrics.totalSteps) * 100;
                      
                      return (
                        <tr key={execution.id} className="border-b hover:bg-muted/50">
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(execution.status)}
                              <Badge className={getStatusColor(execution.status)}>
                                {execution.status.toUpperCase()}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{workflow?.name || 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">
                                {execution.id.slice(0, 8)}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{execution.metrics.completedSteps}/{execution.metrics.totalSteps}</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                            </div>
                          </td>
                          <td className="p-4 text-sm">
                            {execution.duration ? 
                              `${Math.round(execution.duration / 1000)}s` : 
                              execution.status === 'running' ? 
                                `${Math.round((Date.now() - execution.startTime.getTime()) / 1000)}s` : 
                                '-'
                            }
                          </td>
                          <td className="p-4">
                            <Badge variant="outline">{execution.trigger.type}</Badge>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {execution.startTime.toLocaleString()}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedExecution(execution)}
                              >
                                <Activity className="h-4 w-4" />
                              </Button>
                              {execution.status === 'running' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleExecutionAction(execution.id, 'cancel')}
                                >
                                  <Square className="h-4 w-4" />
                                </Button>
                              )}
                              {execution.status === 'failed' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleExecutionAction(execution.id, 'retry')}
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Workflow Templates</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Used {template.usageCount} times</span>
                      <div className="flex items-center space-x-1">
                        <span>★</span>
                        <span>{template.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        by {template.author}
                      </div>
                      <Button size="sm">
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Execution Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {executionStats.total > 0 ? 
                    Math.round((executionStats.completed / executionStats.total) * 100) : 0
                  }%
                </div>
                <p className="text-sm text-muted-foreground">
                  {executionStats.completed} of {executionStats.total} executions successful
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Execution Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {executions.length > 0 ? 
                    Math.round(executions.reduce((acc, e) => acc + (e.duration || 0), 0) / executions.length / 1000) : 0
                  }s
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on {executions.filter(e => e.duration).length} completed executions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowManager;