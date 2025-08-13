import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  AlertTriangle, 
  BarChart3, 
  CheckCircle, 
  Download, 
  Eye, 
  FileText, 
  Pause, 
  Play, 
  RefreshCw, 
  Settings,
  Square,
  Trash2,
  Upload,
  XCircle
} from 'lucide-react';

import { 
  AIContentGeneratorService,
  ContentGenerationRequest,
  ContentStatus,
  ContentType,
  PublishingJob,
  QAResult,
  SystemMetrics
} from '../index';

interface AIContentGeneratorAdminProps {
  brokerLogosPath?: string;
  outputDirectory?: string;
}

interface GenerationJob {
  id: string;
  type: ContentType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  error?: string;
  result?: any;
}

export const AIContentGeneratorAdmin: React.FC<AIContentGeneratorAdminProps> = ({
  brokerLogosPath = 'c:/Users/LENOVO/Desktop/New folder (2)/Broker reviews │ BrokerChooser/',
  outputDirectory
}) => {
  const [generator, setGenerator] = useState<AIContentGeneratorService | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [generationJobs, setGenerationJobs] = useState<GenerationJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState<ContentType>('broker-review');
  const [batchConfig, setBatchConfig] = useState({
    brokerReviews: { limit: 10, targetCountry: 'US' },
    comparisons: { targetCountry: 'US' },
    toplists: { targetCountry: 'US' },
    educational: { topics: ['How to Choose a Broker'] },
    countryPages: { countries: ['US'] },
    faqs: { topics: ['How to start trading?'] }
  });
  const [autoPublish, setAutoPublish] = useState(false);
  const [systemHealth, setSystemHealth] = useState<any>(null);

  useEffect(() => {
    initializeGenerator();
  }, [brokerLogosPath, outputDirectory]);

  useEffect(() => {
    if (generator) {
      loadSystemMetrics();
      checkSystemHealth();
      const interval = setInterval(() => {
        loadSystemMetrics();
      }, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [generator]);

  const initializeGenerator = async () => {
    try {
      const gen = new AIContentGeneratorService(brokerLogosPath, outputDirectory);
      setGenerator(gen);
    } catch (error) {
      console.error('Failed to initialize AI Content Generator:', error);
    }
  };

  const loadSystemMetrics = async () => {
    if (!generator) return;
    try {
      const metrics = await generator.getSystemMetrics();
      setSystemMetrics(metrics);
    } catch (error) {
      console.error('Failed to load system metrics:', error);
    }
  };

  const checkSystemHealth = async () => {
    if (!generator) return;
    try {
      const health = await generator.healthCheck();
      setSystemHealth(health);
    } catch (error) {
      console.error('Failed to check system health:', error);
    }
  };

  const generateSingleContent = async () => {
    if (!generator) return;

    const jobId = `single-${Date.now()}`;
    const job: GenerationJob = {
      id: jobId,
      type: selectedContentType,
      status: 'running',
      progress: 0,
      startTime: new Date()
    };

    setGenerationJobs(prev => [...prev, job]);
    setIsGenerating(true);

    try {
      const request: ContentGenerationRequest = {
        type: selectedContentType,
        parameters: {
          wordCount: 1000,
          includeImages: true,
          seoOptimized: true,
          targetCountry: 'US'
        }
      };

      const result = await generator.generateContent(request);
      
      setGenerationJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { ...j, status: 'completed', progress: 100, endTime: new Date(), result }
          : j
      ));
    } catch (error) {
      setGenerationJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { ...j, status: 'failed', progress: 0, endTime: new Date(), error: error.message }
          : j
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const generateBatchContent = async () => {
    if (!generator) return;

    const jobId = `batch-${Date.now()}`;
    const job: GenerationJob = {
      id: jobId,
      type: 'batch' as ContentType,
      status: 'running',
      progress: 0,
      startTime: new Date()
    };

    setGenerationJobs(prev => [...prev, job]);
    setIsGenerating(true);

    try {
      const result = await generator.generateSiteMapContent(batchConfig, autoPublish);
      
      setGenerationJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { ...j, status: 'completed', progress: 100, endTime: new Date(), result }
          : j
      ));
    } catch (error) {
      setGenerationJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { ...j, status: 'failed', progress: 0, endTime: new Date(), error: error.message }
          : j
      ));
    } finally {
      setIsGenerating(false);
    }
  };

  const clearJobs = () => {
    setGenerationJobs([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-accent-blue" />;
      case 'failed': return <XCircle className="h-4 w-4 text-accent-blue" />;
      case 'running': return <RefreshCw className="h-4 w-4 text-accent-blue animate-spin" />;
      default: return <AlertTriangle className="h-4 w-4 text-accent-blue" />;
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-accent-blue';
      case 'degraded': return 'text-accent-blue';
      case 'unhealthy': return 'text-accent-blue';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Content Generator Admin</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor AI-powered content generation for the BrokerAnalysis platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={checkSystemHealth} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {systemHealth && (
            <Badge className={getHealthStatusColor(systemHealth.status)}>
              {systemHealth.status.toUpperCase()}
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="batch">Batch Generation</TabsTrigger>
          <TabsTrigger value="jobs">Generation Jobs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Content Generated</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{systemMetrics?.totalContentGenerated || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemMetrics?.successRate ? `${(systemMetrics.successRate * 100).toFixed(1)}%` : '0%'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Generation Time</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemMetrics?.averageGenerationTime ? `${systemMetrics.averageGenerationTime.toFixed(1)}s` : '0s'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${systemMetrics?.totalCost?.toFixed(2) || '0.00'}
                </div>
              </CardContent>
            </Card>
          </div>

          {systemHealth && (
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(systemHealth.services).map(([service, status]) => (
                    <div key={service} className="flex items-center justify-between">
                      <span className="capitalize">{service.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <div className="flex items-center space-x-2">
                        {status ? (
                          <CheckCircle className="h-4 w-4 text-accent-blue" />
                        ) : (
                          <XCircle className="h-4 w-4 text-accent-blue" />
                        )}
                        <span className={status ? 'text-accent-blue' : 'text-accent-blue'}>
                          {status ? 'Healthy' : 'Unhealthy'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate Single Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select value={selectedContentType} onValueChange={(value: ContentType) => setSelectedContentType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="broker-review">Broker Review</SelectItem>
                    <SelectItem value="broker-comparison">Broker Comparison</SelectItem>
                    <SelectItem value="toplist">Top Brokers List</SelectItem>
                    <SelectItem value="educational">Educational Content</SelectItem>
                    <SelectItem value="country-page">Country Page</SelectItem>
                    <SelectItem value="faq">FAQ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={generateSingleContent} 
                disabled={isGenerating || !generator}
                className="w-full"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Generate Content
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Content Generation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate content for the complete site map based on the provided configuration
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="auto-publish" 
                  checked={autoPublish} 
                  onCheckedChange={setAutoPublish} 
                />
                <Label htmlFor="auto-publish">Auto-publish generated content</Label>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Batch generation will create content for broker reviews, comparisons, toplists, 
                  educational pages, country pages, and FAQs. This process may take several minutes.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={generateBatchContent} 
                disabled={isGenerating || !generator}
                className="w-full"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Start Batch Generation
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Generation Jobs</CardTitle>
              <Button onClick={clearJobs} variant="outline" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Jobs
              </Button>
            </CardHeader>
            <CardContent>
              {generationJobs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No generation jobs yet. Start generating content to see jobs here.
                </p>
              ) : (
                <div className="space-y-4">
                  {generationJobs.map((job) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(job.status)}
                          <span className="font-medium capitalize">
                            {job.type.replace('-', ' ')}
                          </span>
                          <Badge variant="outline">{job.status}</Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {job.startTime.toLocaleTimeString()}
                        </span>
                      </div>
                      
                      {job.status === 'running' && (
                        <Progress value={job.progress} className="mb-2" />
                      )}
                      
                      {job.error && (
                        <Alert className="mt-2">
                          <XCircle className="h-4 w-4" />
                          <AlertDescription>{job.error}</AlertDescription>
                        </Alert>
                      )}
                      
                      {job.result && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Content generated successfully
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="broker-logos-path">Broker Logos Path</Label>
                <Input 
                  id="broker-logos-path" 
                  value={brokerLogosPath} 
                  readOnly
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Path to broker logos directory (read-only)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="output-directory">Output Directory</Label>
                <Input 
                  id="output-directory" 
                  value={outputDirectory || 'Default (./generated-content)'} 
                  readOnly
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Directory where generated content will be saved
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIContentGeneratorAdmin;
