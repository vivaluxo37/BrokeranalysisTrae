/**
 * Configuration Manager Component
 * 
 * Administrative interface for managing AI provider settings,
 * system configurations, environment variables, and API keys.
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  Settings,
  Key,
  Server,
  Database,
  Shield,
  Zap,
  Globe,
  Save,
  RefreshCw,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  EyeOff,
  Copy,
  Edit,
  Trash2,
  Plus,
  Download,
  Upload
} from 'lucide-react';

export interface AIProviderConfig {
  id: string;
  name: string;
  type: 'groq' | 'openrouter' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl?: string;
  isEnabled: boolean;
  priority: number;
  rateLimits: {
    requestsPerMinute: number;
    tokensPerMinute: number;
    dailyLimit: number;
  };
  models: {
    id: string;
    name: string;
    maxTokens: number;
    costPer1kTokens: number;
    isEnabled: boolean;
  }[];
  healthStatus: 'healthy' | 'degraded' | 'offline' | 'unknown';
  lastChecked: Date;
  responseTime: number;
  errorRate: number;
}

export interface SystemConfig {
  id: string;
  category: 'general' | 'ai' | 'content' | 'publishing' | 'security' | 'performance';
  key: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'json' | 'password';
  description: string;
  isRequired: boolean;
  isSecret: boolean;
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  lastModified: Date;
  modifiedBy: string;
}

export interface EnvironmentVariable {
  key: string;
  value: string;
  isSecret: boolean;
  description: string;
  isRequired: boolean;
  environment: 'development' | 'staging' | 'production' | 'all';
  lastModified: Date;
}

export interface ConfigurationManagerProps {
  onConfigUpdate?: (config: SystemConfig) => void;
  onProviderUpdate?: (provider: AIProviderConfig) => void;
  onEnvironmentUpdate?: (envVar: EnvironmentVariable) => void;
}

export const ConfigurationManager: React.FC<ConfigurationManagerProps> = ({
  onConfigUpdate,
  onProviderUpdate,
  onEnvironmentUpdate
}) => {
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [systemConfigs, setSystemConfigs] = useState<SystemConfig[]>([]);
  const [envVars, setEnvVars] = useState<EnvironmentVariable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<AIProviderConfig | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [isTestingProvider, setIsTestingProvider] = useState<string | null>(null);
  const [configFilter, setConfigFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState<Set<string>>(new Set());

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [providersResponse, configsResponse, envResponse] = await Promise.all([
        fetch('/api/admin/config/providers'),
        fetch('/api/admin/config/system'),
        fetch('/api/admin/config/environment')
      ]);

      if (providersResponse.ok) {
        const providersData = await providersResponse.json();
        setProviders(providersData);
      }

      if (configsResponse.ok) {
        const configsData = await configsResponse.json();
        setSystemConfigs(configsData);
      }

      if (envResponse.ok) {
        const envData = await envResponse.json();
        setEnvVars(envData);
      }
    } catch (error) {
      console.error('Failed to fetch configuration data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleProviderTest = async (providerId: string) => {
    setIsTestingProvider(providerId);
    try {
      const response = await fetch(`/api/admin/config/providers/${providerId}/test`, {
        method: 'POST'
      });
      
      const result = await response.json();
      setTestResults(prev => ({ ...prev, [providerId]: result }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [providerId]: { success: false, error: 'Test failed' }
      }));
    } finally {
      setIsTestingProvider(null);
    }
  };

  const handleProviderUpdate = async (providerId: string, updates: Partial<AIProviderConfig>) => {
    try {
      const response = await fetch(`/api/admin/config/providers/${providerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await fetchData();
        setUnsavedChanges(prev => {
          const newSet = new Set(prev);
          newSet.delete(providerId);
          return newSet;
        });
        onProviderUpdate?.(updates as AIProviderConfig);
      }
    } catch (error) {
      console.error('Failed to update provider:', error);
    }
  };

  const handleConfigUpdate = async (configId: string, value: any) => {
    try {
      const response = await fetch(`/api/admin/config/system/${configId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value })
      });

      if (response.ok) {
        await fetchData();
        setUnsavedChanges(prev => {
          const newSet = new Set(prev);
          newSet.delete(configId);
          return newSet;
        });
        onConfigUpdate?.({ id: configId, value } as SystemConfig);
      }
    } catch (error) {
      console.error('Failed to update config:', error);
    }
  };

  const handleEnvVarUpdate = async (key: string, updates: Partial<EnvironmentVariable>) => {
    try {
      const response = await fetch(`/api/admin/config/environment/${key}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await fetchData();
        setUnsavedChanges(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
        onEnvironmentUpdate?.(updates as EnvironmentVariable);
      }
    } catch (error) {
      console.error('Failed to update environment variable:', error);
    }
  };

  const toggleSecretVisibility = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-accent-blue" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-accent-blue" />;
      case 'offline': return <XCircle className="h-4 w-4 text-accent-blue" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredConfigs = systemConfigs.filter(config => {
    const matchesFilter = configFilter === 'all' || config.category === configFilter;
    const matchesSearch = searchQuery === '' || 
      config.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      config.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const renderConfigValue = (config: SystemConfig) => {
    const isSecret = config.isSecret || config.type === 'password';
    const showValue = showSecrets[config.id] || !isSecret;
    
    switch (config.type) {
      case 'boolean':
        return (
          <Switch
            checked={Boolean(config.value)}
            onCheckedChange={(checked) => {
              handleConfigUpdate(config.id, checked);
            }}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            value={config.value as number}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                handleConfigUpdate(config.id, value);
              }
            }}
            min={config.validation?.min}
            max={config.validation?.max}
          />
        );
      case 'password':
        return (
          <div className="flex items-center space-x-2">
            <Input
              type={showValue ? 'text' : 'password'}
              value={showValue ? config.value as string : '••••••••'}
              onChange={(e) => handleConfigUpdate(config.id, e.target.value)}
              className="flex-1"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => toggleSecretVisibility(config.id)}
            >
              {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        );
      case 'json':
        return (
          <Textarea
            value={JSON.stringify(config.value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleConfigUpdate(config.id, parsed);
              } catch (error) {
                // Invalid JSON, don't update
              }
            }}
            rows={4}
          />
        );
      default:
        if (config.validation?.options) {
          return (
            <Select
              value={config.value as string}
              onValueChange={(value) => handleConfigUpdate(config.id, value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.validation.options.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }
        return (
          <div className="flex items-center space-x-2">
            <Input
              type={isSecret && !showValue ? 'password' : 'text'}
              value={showValue ? config.value as string : '••••••••'}
              onChange={(e) => handleConfigUpdate(config.id, e.target.value)}
              pattern={config.validation?.pattern}
              className="flex-1"
            />
            {isSecret && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => toggleSecretVisibility(config.id)}
              >
                {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(config.value as string)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Configuration Manager</h2>
          <p className="text-muted-foreground">
            Manage AI providers, system settings, and environment variables
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {unsavedChanges.size > 0 && (
            <Alert className="w-auto">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {unsavedChanges.size} unsaved change(s)
              </AlertDescription>
            </Alert>
          )}
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="providers">
            <Zap className="h-4 w-4 mr-2" />
            AI Providers ({providers.length})
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="h-4 w-4 mr-2" />
            System Config ({systemConfigs.length})
          </TabsTrigger>
          <TabsTrigger value="environment">
            <Globe className="h-4 w-4 mr-2" />
            Environment ({envVars.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid gap-4">
            {providers.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getHealthStatusIcon(provider.healthStatus)}
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {provider.type.toUpperCase()} • Priority {provider.priority}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getHealthStatusColor(provider.healthStatus)}>
                        {provider.healthStatus.toUpperCase()}
                      </Badge>
                      <Switch
                        checked={provider.isEnabled}
                        onCheckedChange={(checked) => {
                          handleProviderUpdate(provider.id, { isEnabled: checked });
                        }}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Response Time</span>
                        <p className="font-medium">{provider.responseTime}ms</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Error Rate</span>
                        <p className="font-medium">{provider.errorRate}%</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Models</span>
                        <p className="font-medium">
                          {provider.models.filter(m => m.isEnabled).length}/{provider.models.length}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Checked</span>
                        <p className="font-medium">
                          {provider.lastChecked.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type={showSecrets[provider.id] ? 'text' : 'password'}
                          value={showSecrets[provider.id] ? provider.apiKey : '••••••••••••••••'}
                          onChange={(e) => {
                            handleProviderUpdate(provider.id, { apiKey: e.target.value });
                            setUnsavedChanges(prev => new Set(prev).add(provider.id));
                          }}
                          className="flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleSecretVisibility(provider.id)}
                        >
                          {showSecrets[provider.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(provider.apiKey)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {provider.baseUrl && (
                      <div className="space-y-2">
                        <Label>Base URL</Label>
                        <Input
                          value={provider.baseUrl}
                          onChange={(e) => {
                            handleProviderUpdate(provider.id, { baseUrl: e.target.value });
                            setUnsavedChanges(prev => new Set(prev).add(provider.id));
                          }}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Rate Limits</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label className="text-xs">Requests/min</Label>
                          <Input
                            type="number"
                            value={provider.rateLimits.requestsPerMinute}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                handleProviderUpdate(provider.id, {
                                  rateLimits: { ...provider.rateLimits, requestsPerMinute: value }
                                });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Tokens/min</Label>
                          <Input
                            type="number"
                            value={provider.rateLimits.tokensPerMinute}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                handleProviderUpdate(provider.id, {
                                  rateLimits: { ...provider.rateLimits, tokensPerMinute: value }
                                });
                              }
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Daily limit</Label>
                          <Input
                            type="number"
                            value={provider.rateLimits.dailyLimit}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                handleProviderUpdate(provider.id, {
                                  rateLimits: { ...provider.rateLimits, dailyLimit: value }
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{envVar.key}</h4>
                        <p className="text-sm text-muted-foreground">{envVar.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{envVar.environment}</Badge>
                        {envVar.isRequired && (
                          <Badge className="bg-red-100 text-red-800">Required</Badge>
                        )}
                        {envVar.isSecret && (
                          <Badge className="bg-yellow-100 text-yellow-800">Secret</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type={envVar.isSecret && !showSecrets[envVar.key] ? 'password' : 'text'}
                          value={showSecrets[envVar.key] || !envVar.isSecret ? envVar.value : '••••••••'}
                          onChange={(e) => {
                            handleEnvVarUpdate(envVar.key, { value: e.target.value });
                            setUnsavedChanges(prev => new Set(prev).add(envVar.key));
                          }}
                          className="flex-1"
                        />
                        {envVar.isSecret && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleSecretVisibility(envVar.key)}
                          >
                            {showSecrets[envVar.key] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(envVar.value)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last modified: {envVar.lastModified.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConfigurationManager;
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleProviderTest(provider.id)}
                          disabled={isTestingProvider === provider.id}
                        >
                          {isTestingProvider === provider.id ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4 mr-1" />
                          )}
                          Test Connection
                        </Button>
                        {testResults[provider.id] && (
                          <Badge className={testResults[provider.id].success ? 
                            'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {testResults[provider.id].success ? 'Success' : 'Failed'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
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

        <TabsContent value="system" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Search configurations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Select value={configFilter} onValueChange={setConfigFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="ai">AI</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="publishing">Publishing</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Config
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredConfigs.map((config) => (
              <Card key={config.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{config.key}</h4>
                        <p className="text-sm text-muted-foreground">{config.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{config.category}</Badge>
                        {config.isRequired && (
                          <Badge className="bg-red-100 text-red-800">Required</Badge>
                        )}
                        {config.isSecret && (
                          <Badge className="bg-yellow-100 text-yellow-800">Secret</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Value</Label>
                      {renderConfigValue(config)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last modified: {config.lastModified.toLocaleString()} by {config.modifiedBy}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="environment" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Environment Variables</h3>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Variable
              </Button>
            </div>
          </div>

          <div className="grid gap-4">
            {envVars.map((envVar) => (
              <Card key={envVar.key}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
