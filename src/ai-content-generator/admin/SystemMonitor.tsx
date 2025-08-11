/**
 * System Monitor Component
 * 
 * Real-time monitoring dashboard for the AI Content Generator system,
 * including performance metrics, resource usage, and health checks.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  HardDrive,
  MemoryStick,
  RefreshCw,
  Server,
  TrendingDown,
  TrendingUp,
  Wifi,
  XCircle
} from 'lucide-react';

export interface SystemMetrics {
  timestamp: Date;
  cpu: {
    usage: number;
    cores: number;
    temperature?: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    latency: number;
  };
  aiProviders: {
    groq: {
      status: 'online' | 'offline' | 'degraded';
      responseTime: number;
      requestsPerMinute: number;
      errorRate: number;
    };
    openrouter: {
      status: 'online' | 'offline' | 'degraded';
      responseTime: number;
      requestsPerMinute: number;
      errorRate: number;
    };
  };
  contentGeneration: {
    activeJobs: number;
    queuedJobs: number;
    completedToday: number;
    failedToday: number;
    averageProcessingTime: number;
  };
  database: {
    connections: number;
    maxConnections: number;
    queryTime: number;
    cacheHitRate: number;
  };
}

export interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  source: string;
}

export interface SystemMonitorProps {
  refreshInterval?: number;
  onAlert?: (alert: SystemAlert) => void;
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({
  refreshInterval = 5000,
  onAlert
}) => {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [historicalData, setHistoricalData] = useState<SystemMetrics[]>([]);

  const fetchSystemMetrics = useCallback(async () => {
    try {
      // In a real implementation, this would call your monitoring API
      const response = await fetch('/api/admin/system-metrics');
      if (!response.ok) {
        throw new Error('Failed to fetch system metrics');
      }
      
      const data: SystemMetrics = await response.json();
      setMetrics(data);
      setLastUpdate(new Date());
      
      // Store historical data (keep last 100 points)
      setHistoricalData(prev => {
        const newData = [...prev, data].slice(-100);
        return newData;
      });
      
      // Check for alerts
      checkForAlerts(data);
      
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
      const errorAlert: SystemAlert = {
        id: `error-${Date.now()}`,
        type: 'error',
        title: 'Monitoring Error',
        message: 'Failed to fetch system metrics',
        timestamp: new Date(),
        acknowledged: false,
        source: 'SystemMonitor'
      };
      addAlert(errorAlert);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkForAlerts = (data: SystemMetrics) => {
    const newAlerts: SystemAlert[] = [];

    // CPU usage alert
    if (data.cpu.usage > 90) {
      newAlerts.push({
        id: `cpu-${Date.now()}`,
        type: 'error',
        title: 'High CPU Usage',
        message: `CPU usage is at ${data.cpu.usage.toFixed(1)}%`,
        timestamp: new Date(),
        acknowledged: false,
        source: 'CPU Monitor'
      });
    } else if (data.cpu.usage > 75) {
      newAlerts.push({
        id: `cpu-warning-${Date.now()}`,
        type: 'warning',
        title: 'Elevated CPU Usage',
        message: `CPU usage is at ${data.cpu.usage.toFixed(1)}%`,
        timestamp: new Date(),
        acknowledged: false,
        source: 'CPU Monitor'
      });
    }

    // Memory usage alert
    if (data.memory.percentage > 90) {
      newAlerts.push({
        id: `memory-${Date.now()}`,
        type: 'error',
        title: 'High Memory Usage',
        message: `Memory usage is at ${data.memory.percentage.toFixed(1)}%`,
        timestamp: new Date(),
        acknowledged: false,
        source: 'Memory Monitor'
      });
    }

    // AI Provider alerts
    Object.entries(data.aiProviders).forEach(([provider, stats]) => {
      if (stats.status === 'offline') {
        newAlerts.push({
          id: `${provider}-offline-${Date.now()}`,
          type: 'error',
          title: `${provider.toUpperCase()} Offline`,
          message: `AI provider ${provider} is currently offline`,
          timestamp: new Date(),
          acknowledged: false,
          source: 'AI Provider Monitor'
        });
      } else if (stats.errorRate > 0.1) {
        newAlerts.push({
          id: `${provider}-errors-${Date.now()}`,
          type: 'warning',
          title: `High Error Rate`,
          message: `${provider.toUpperCase()} error rate is ${(stats.errorRate * 100).toFixed(1)}%`,
          timestamp: new Date(),
          acknowledged: false,
          source: 'AI Provider Monitor'
        });
      }
    });

    // Add new alerts
    newAlerts.forEach(addAlert);
  };

  const addAlert = (alert: SystemAlert) => {
    setAlerts(prev => {
      // Avoid duplicate alerts
      const exists = prev.some(a => 
        a.title === alert.title && 
        a.source === alert.source &&
        Date.now() - a.timestamp.getTime() < 60000 // Within last minute
      );
      
      if (!exists) {
        onAlert?.(alert);
        return [alert, ...prev].slice(0, 50); // Keep last 50 alerts
      }
      return prev;
    });
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const clearAcknowledgedAlerts = () => {
    setAlerts(prev => prev.filter(alert => !alert.acknowledged));
  };

  useEffect(() => {
    fetchSystemMetrics();
    const interval = setInterval(fetchSystemMetrics, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchSystemMetrics, refreshInterval]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'offline': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (isLoading && !metrics) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading system metrics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Monitor</h2>
          <p className="text-muted-foreground">
            Real-time monitoring of AI Content Generator system
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={fetchSystemMetrics} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {lastUpdate && (
            <span className="text-sm text-muted-foreground">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="providers">AI Providers</TabsTrigger>
          <TabsTrigger value="alerts">Alerts ({alerts.filter(a => !a.acknowledged).length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.contentGeneration.activeJobs || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.contentGeneration.queuedJobs || 0} queued
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.contentGeneration.completedToday || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {metrics?.contentGeneration.failedToday || 0} failed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.contentGeneration.averageProcessingTime?.toFixed(1) || 0}s
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">DB Connections</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics?.database.connections || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  of {metrics?.database.maxConnections || 0} max
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2" />
                  CPU Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Usage</span>
                    <span>{metrics?.cpu.usage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics?.cpu.usage || 0} />
                  <div className="text-sm text-muted-foreground">
                    {metrics?.cpu.cores} cores
                    {metrics?.cpu.temperature && ` • ${metrics.cpu.temperature}°C`}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MemoryStick className="h-5 w-5 mr-2" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Usage</span>
                    <span>{metrics?.memory.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics?.memory.percentage || 0} />
                  <div className="text-sm text-muted-foreground">
                    {formatBytes(metrics?.memory.used || 0)} of {formatBytes(metrics?.memory.total || 0)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HardDrive className="h-5 w-5 mr-2" />
                  Disk Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Usage</span>
                    <span>{metrics?.disk.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={metrics?.disk.percentage || 0} />
                  <div className="text-sm text-muted-foreground">
                    {formatBytes(metrics?.disk.used || 0)} of {formatBytes(metrics?.disk.total || 0)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wifi className="h-5 w-5 mr-2" />
                  Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Latency</span>
                    <span>{metrics?.network.latency}ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>In</span>
                    <span>{formatBytes(metrics?.network.bytesIn || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Out</span>
                    <span>{formatBytes(metrics?.network.bytesOut || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics && Object.entries(metrics.aiProviders).map(([provider, stats]) => (
              <Card key={provider}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{provider}</span>
                    {getStatusIcon(stats.status)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Status</span>
                      <Badge className={getStatusColor(stats.status)}>
                        {stats.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span>{stats.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Requests/min</span>
                      <span>{stats.requestsPerMinute}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span>{(stats.errorRate * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">System Alerts</h3>
            <Button 
              onClick={clearAcknowledgedAlerts} 
              variant="outline" 
              size="sm"
              disabled={alerts.filter(a => a.acknowledged).length === 0}
            >
              Clear Acknowledged
            </Button>
          </div>
          
          {alerts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">No alerts - system is running smoothly</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <Alert 
                  key={alert.id} 
                  className={`${alert.acknowledged ? 'opacity-50' : ''} ${alert.type === 'error' ? 'border-red-200' : alert.type === 'warning' ? 'border-yellow-200' : 'border-blue-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-2">
                      {getAlertIcon(alert.type)}
                      <div>
                        <h4 className="font-semibold">{alert.title}</h4>
                        <AlertDescription>{alert.message}</AlertDescription>
                        <div className="text-xs text-muted-foreground mt-1">
                          {alert.source} • {alert.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button 
                        onClick={() => acknowledgeAlert(alert.id)}
                        variant="outline" 
                        size="sm"
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </Alert>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemMonitor;