/**
 * Content Manager Component
 * 
 * Administrative interface for managing content generation jobs,
 * templates, publishing workflows, and content analytics.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Square,
  Trash2,
  Upload,
  XCircle
} from 'lucide-react';

export interface ContentJob {
  id: string;
  title: string;
  type: 'broker-review' | 'comparison' | 'educational' | 'landing-page' | 'tool';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  templateId: string;
  parameters: Record<string, any>;
  output?: {
    contentId: string;
    wordCount: number;
    qaScore: number;
    publishedUrl?: string;
  };
  error?: string;
  estimatedDuration: number;
  actualDuration?: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'broker-review' | 'comparison' | 'educational' | 'landing-page' | 'tool';
  version: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parameters: {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'select' | 'multiselect';
    required: boolean;
    defaultValue?: any;
    options?: string[];
    description: string;
  }[];
  template: string;
  qaRules: string[];
  estimatedTokens: number;
  successRate: number;
  usageCount: number;
}

export interface ContentAnalytics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  averageCompletionTime: number;
  totalTokensUsed: number;
  totalCost: number;
  successRate: number;
  popularTemplates: {
    templateId: string;
    name: string;
    usageCount: number;
  }[];
  dailyStats: {
    date: string;
    jobsCompleted: number;
    tokensUsed: number;
    cost: number;
  }[];
}

export interface ContentManagerProps {
  onJobCreate?: (job: Partial<ContentJob>) => void;
  onJobUpdate?: (jobId: string, updates: Partial<ContentJob>) => void;
  onTemplateCreate?: (template: Partial<ContentTemplate>) => void;
  onTemplateUpdate?: (templateId: string, updates: Partial<ContentTemplate>) => void;
}

export const ContentManager: React.FC<ContentManagerProps> = ({
  onJobCreate,
  onJobUpdate,
  onTemplateCreate,
  onTemplateUpdate
}) => {
  const [jobs, setJobs] = useState<ContentJob[]>([]);
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [analytics, setAnalytics] = useState<ContentAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<ContentJob | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isCreateTemplateOpen, setIsCreateTemplateOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch jobs, templates, and analytics
      const [jobsResponse, templatesResponse, analyticsResponse] = await Promise.all([
        fetch('/api/admin/content/jobs'),
        fetch('/api/admin/content/templates'),
        fetch('/api/admin/content/analytics')
      ]);

      if (jobsResponse.ok) {
        const jobsData = await jobsResponse.json();
        setJobs(jobsData);
      }

      if (templatesResponse.ok) {
        const templatesData = await templatesResponse.json();
        setTemplates(templatesData);
      }

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error('Failed to fetch content data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleJobAction = async (jobId: string, action: 'start' | 'pause' | 'stop' | 'retry') => {
    try {
      const response = await fetch(`/api/admin/content/jobs/${jobId}/${action}`, {
        method: 'POST'
      });

      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error(`Failed to ${action} job:`, error);
    }
  };

  const handleCreateJob = async (jobData: Partial<ContentJob>) => {
    try {
      const response = await fetch('/api/admin/content/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        await fetchData();
        setIsCreateJobOpen(false);
        onJobCreate?.(jobData);
      }
    } catch (error) {
      console.error('Failed to create job:', error);
    }
  };

  const handleCreateTemplate = async (templateData: Partial<ContentTemplate>) => {
    try {
      const response = await fetch('/api/admin/content/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(templateData)
      });

      if (response.ok) {
        await fetchData();
        setIsCreateTemplateOpen(false);
        onTemplateCreate?.(templateData);
      }
    } catch (error) {
      console.error('Failed to create template:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'running': return <Play className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'paused': return <Pause className="h-4 w-4 text-orange-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'paused': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = jobFilter === 'all' || job.status === jobFilter;
    const matchesSearch = searchQuery === '' || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading content data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Manager</h2>
          <p className="text-muted-foreground">
            Manage content generation jobs, templates, and publishing workflows
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
          <TabsTrigger value="templates">Templates ({templates.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Content Job</DialogTitle>
                </DialogHeader>
                <CreateJobForm
                  templates={templates}
                  onSubmit={handleCreateJob}
                  onCancel={() => setIsCreateJobOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(job.status)}
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {job.type.replace('-', ' ').toUpperCase()} • Created {job.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(job.priority)}>
                        {job.priority.toUpperCase()}
                      </Badge>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.status === 'running' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} />
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Template</span>
                        <p className="font-medium">
                          {templates.find(t => t.id === job.templateId)?.name || 'Unknown'}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Duration</span>
                        <p className="font-medium">
                          {job.actualDuration ? formatDuration(job.actualDuration) : 
                           job.status === 'running' ? 'In progress...' :
                           formatDuration(job.estimatedDuration)}
                        </p>
                      </div>
                      {job.output && (
                        <>
                          <div>
                            <span className="text-muted-foreground">Word Count</span>
                            <p className="font-medium">{job.output.wordCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">QA Score</span>
                            <p className="font-medium">{job.output.qaScore}%</p>
                          </div>
                        </>
                      )}
                    </div>

                    {job.error && (
                      <Alert className="border-red-200">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <AlertDescription>{job.error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {job.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleJobAction(job.id, 'start')}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {job.status === 'running' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleJobAction(job.id, 'pause')}
                            >
                              <Pause className="h-4 w-4 mr-1" />
                              Pause
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleJobAction(job.id, 'stop')}
                            >
                              <Square className="h-4 w-4 mr-1" />
                              Stop
                            </Button>
                          </>
                        )}
                        {job.status === 'paused' && (
                          <Button
                            size="sm"
                            onClick={() => handleJobAction(job.id, 'start')}
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                        )}
                        {job.status === 'failed' && (
                          <Button
                            size="sm"
                            onClick={() => handleJobAction(job.id, 'retry')}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {job.output?.publishedUrl && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Content Templates</h3>
            <Dialog open={isCreateTemplateOpen} onOpenChange={setIsCreateTemplateOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Create New Template</DialogTitle>
                </DialogHeader>
                <CreateTemplateForm
                  onSubmit={handleCreateTemplate}
                  onCancel={() => setIsCreateTemplateOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge className={template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type</span>
                        <p className="font-medium">{template.type.replace('-', ' ').toUpperCase()}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Version</span>
                        <p className="font-medium">{template.version}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Usage Count</span>
                        <p className="font-medium">{template.usageCount}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Success Rate</span>
                        <p className="font-medium">{template.successRate}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        ~{template.estimatedTokens.toLocaleString()} tokens
                      </span>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
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

        <TabsContent value="analytics" className="space-y-4">
          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.totalJobs}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.completedJobs} completed, {analytics.failedJobs} failed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analytics.successRate}%</div>
                    <Progress value={analytics.successRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatDuration(analytics.averageCompletionTime)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${analytics.totalCost.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      {analytics.totalTokensUsed.toLocaleString()} tokens used
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analytics.popularTemplates.map((template, index) => (
                      <div key={template.templateId} className="flex items-center justify-between">
                        <span className="font-medium">{template.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">
                            {template.usageCount} uses
                          </span>
                          <div className="w-20">
                            <Progress 
                              value={(template.usageCount / analytics.popularTemplates[0].usageCount) * 100} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper components for forms
const CreateJobForm: React.FC<{
  templates: ContentTemplate[];
  onSubmit: (data: Partial<ContentJob>) => void;
  onCancel: () => void;
}> = ({ templates, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'broker-review' as ContentJob['type'],
    templateId: '',
    priority: 'medium' as ContentJob['priority'],
    parameters: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Content Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ContentJob['type'] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="broker-review">Broker Review</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="landing-page">Landing Page</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="template">Template</Label>
          <Select value={formData.templateId} onValueChange={(value) => setFormData({ ...formData, templateId: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select template" />
            </SelectTrigger>
            <SelectContent>
              {templates.filter(t => t.type === formData.type && t.isActive).map(template => (
                <SelectItem key={template.id} value={template.id}>
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as ContentJob['priority'] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Job
        </Button>
      </div>
    </form>
  );
};

const CreateTemplateForm: React.FC<{
  onSubmit: (data: Partial<ContentTemplate>) => void;
  onCancel: () => void;
}> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'broker-review' as ContentTemplate['type'],
    template: '',
    parameters: [],
    qaRules: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Content Type</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as ContentTemplate['type'] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="broker-review">Broker Review</SelectItem>
              <SelectItem value="comparison">Comparison</SelectItem>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="landing-page">Landing Page</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="template">Template Content</Label>
        <Textarea
          id="template"
          value={formData.template}
          onChange={(e) => setFormData({ ...formData, template: e.target.value })}
          rows={10}
          placeholder="Enter template content with placeholders..."
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Template
        </Button>
      </div>
    </form>
  );
};

export default ContentManager;