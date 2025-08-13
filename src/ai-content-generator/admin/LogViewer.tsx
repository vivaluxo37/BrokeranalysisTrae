/**
 * Log Viewer Component
 * 
 * Administrative interface for viewing, filtering, and analyzing system logs,
 * errors, and debugging information across the AI content generation system.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Archive,
  Bug,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Code,
  Copy,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Globe,
  HardDrive,
  Info,
  Monitor,
  Network,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Settings,
  Square,
  Terminal,
  Trash2,
  XCircle,
  Zap
} from 'lucide-react';

export interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  source: string;
  category: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  userId?: string;
  sessionId?: string;
  requestId?: string;
  duration?: number;
  tags: string[];
}

export interface LogFilter {
  levels: string[];
  sources: string[];
  categories: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  searchQuery: string;
  tags: string[];
  userId?: string;
  sessionId?: string;
  requestId?: string;
}

export interface LogStats {
  total: number;
  byLevel: Record<string, number>;
  bySource: Record<string, number>;
  byCategory: Record<string, number>;
  errorRate: number;
  avgResponseTime: number;
  topErrors: {
    message: string;
    count: number;
    lastOccurrence: Date;
  }[];
}

export interface LogStream {
  id: string;
  name: string;
  source: string;
  isActive: boolean;
  filter: LogFilter;
  autoScroll: boolean;
  maxEntries: number;
}

export interface LogViewerProps {
  onLogAction?: (action: string, logId: string) => void;
  onFilterChange?: (filter: LogFilter) => void;
}

export const LogViewer: React.FC<LogViewerProps> = ({
  onLogAction,
  onFilterChange
}) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [streams, setStreams] = useState<LogStream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [maxEntries, setMaxEntries] = useState(1000);
  const [activeTab, setActiveTab] = useState('live');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [filter, setFilter] = useState<LogFilter>({
    levels: ['debug', 'info', 'warn', 'error', 'fatal'],
    sources: [],
    categories: [],
    dateRange: {},
    searchQuery: '',
    tags: []
  });

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const params = new URLSearchParams({
        limit: maxEntries.toString(),
        ...filter.levels.length > 0 && { levels: filter.levels.join(',') },
        ...filter.sources.length > 0 && { sources: filter.sources.join(',') },
        ...filter.categories.length > 0 && { categories: filter.categories.join(',') },
        ...filter.searchQuery && { search: filter.searchQuery },
        ...filter.tags.length > 0 && { tags: filter.tags.join(',') },
        ...filter.userId && { userId: filter.userId },
        ...filter.sessionId && { sessionId: filter.sessionId },
        ...filter.requestId && { requestId: filter.requestId },
        ...filter.dateRange.start && { startDate: filter.dateRange.start.toISOString() },
        ...filter.dateRange.end && { endDate: filter.dateRange.end.toISOString() }
      });

      const [logsResponse, statsResponse] = await Promise.all([
        fetch(`/api/admin/logs?${params}`),
        fetch('/api/admin/logs/stats')
      ]);

      if (logsResponse.ok) {
        const logsData = await logsResponse.json();
        setLogs(logsData.map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp)
        })));
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filter, maxEntries]);

  const setupWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const ws = new WebSocket(`ws://localhost:3001/api/admin/logs/stream`);
    
    ws.onopen = () => {
      setIsStreaming(true);
      console.log('Log stream connected');
    };

    ws.onmessage = (event) => {
      const logEntry: LogEntry = {
        ...JSON.parse(event.data),
        timestamp: new Date(JSON.parse(event.data).timestamp)
      };
      
      setLogs(prevLogs => {
        const newLogs = [logEntry, ...prevLogs].slice(0, maxEntries);
        return newLogs;
      });

      // Auto-scroll to bottom if enabled
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    };

    ws.onclose = () => {
      setIsStreaming(false);
      console.log('Log stream disconnected');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsStreaming(false);
    };

    wsRef.current = ws;
  }, [maxEntries]);

  useEffect(() => {
    fetchLogs();
    
    if (autoRefresh && !isStreaming) {
      const interval = setInterval(fetchLogs, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchLogs, autoRefresh, refreshInterval, isStreaming]);

  useEffect(() => {
    if (activeTab === 'live' && !isStreaming) {
      setupWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [activeTab, setupWebSocket, isStreaming]);

  useEffect(() => {
    // Apply filters to logs
    const filtered = logs.filter(log => {
      const matchesLevel = filter.levels.includes(log.level);
      const matchesSource = filter.sources.length === 0 || filter.sources.includes(log.source);
      const matchesCategory = filter.categories.length === 0 || filter.categories.includes(log.category);
      const matchesSearch = !filter.searchQuery || 
        log.message.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
        log.source.toLowerCase().includes(filter.searchQuery.toLowerCase());
      const matchesTags = filter.tags.length === 0 || 
        filter.tags.some(tag => log.tags.includes(tag));
      const matchesUserId = !filter.userId || log.userId === filter.userId;
      const matchesSessionId = !filter.sessionId || log.sessionId === filter.sessionId;
      const matchesRequestId = !filter.requestId || log.requestId === filter.requestId;
      
      const matchesDateRange = (!filter.dateRange.start || log.timestamp >= filter.dateRange.start) &&
        (!filter.dateRange.end || log.timestamp <= filter.dateRange.end);

      return matchesLevel && matchesSource && matchesCategory && matchesSearch && 
        matchesTags && matchesUserId && matchesSessionId && matchesRequestId && matchesDateRange;
    });

    setFilteredLogs(filtered);
    onFilterChange?.(filter);
  }, [logs, filter, onFilterChange]);

  const handleFilterChange = (key: keyof LogFilter, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleLogAction = (action: string, logId: string) => {
    onLogAction?.(action, logId);
  };

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const exportLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filter, format: 'json' })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to export logs:', error);
    }
  };

  const clearLogs = async () => {
    try {
      const response = await fetch('/api/admin/logs', {
        method: 'DELETE'
      });

      if (response.ok) {
        setLogs([]);
        setFilteredLogs([]);
      }
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'debug': return 'bg-gray-100 text-gray-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'warn': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      case 'fatal': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'debug': return <Bug className="h-4 w-4 text-gray-500" />;
      case 'info': return <Info className="h-4 w-4 text-accent-blue" />;
      case 'warn': return <AlertTriangle className="h-4 w-4 text-accent-blue" />;
      case 'error': return <XCircle className="h-4 w-4 text-accent-blue" />;
      case 'fatal': return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'api': return <Globe className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      case 'server': return <Server className="h-4 w-4" />;
      case 'ai': return <Zap className="h-4 w-4" />;
      case 'system': return <Monitor className="h-4 w-4" />;
      default: return <Terminal className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading logs...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Log Viewer</h2>
          <p className="text-muted-foreground">
            Monitor system logs, errors, and debugging information
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
              disabled={isStreaming}
            />
            <Label className="text-sm">Auto Refresh</Label>
          </div>
          {isStreaming && (
            <Badge className="bg-green-100 text-green-800">
              <Activity className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          )}
          <Button onClick={fetchLogs} variant="outline" size="sm" disabled={isStreaming}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={clearLogs} variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total Logs</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {stats.byLevel.error || 0}
              </div>
              <p className="text-xs text-muted-foreground">Errors</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.byLevel.warn || 0}
              </div>
              <p className="text-xs text-muted-foreground">Warnings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {stats.errorRate.toFixed(2)}%
              </div>
              <p className="text-xs text-muted-foreground">Error Rate</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="live">
            <Activity className="h-4 w-4 mr-2" />
            Live Logs ({filteredLogs.length})
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-2" />
            Search & Filter
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="streams">
            <Terminal className="h-4 w-4 mr-2" />
            Streams
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          {/* Quick Filters */}
          <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Level:</Label>
              <div className="flex items-center space-x-1">
                {['debug', 'info', 'warn', 'error', 'fatal'].map(level => (
                  <Button
                    key={level}
                    size="sm"
                    variant={filter.levels.includes(level) ? "default" : "outline"}
                    onClick={() => {
                      const newLevels = filter.levels.includes(level)
                        ? filter.levels.filter(l => l !== level)
                        : [...filter.levels, level];
                      handleFilterChange('levels', newLevels);
                    }}
                    className="h-7 px-2 text-xs"
                  >
                    {getLevelIcon(level)}
                    <span className="ml-1 capitalize">{level}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Search:</Label>
              <Input
                placeholder="Filter logs..."
                value={filter.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                className="w-64 h-8"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Label className="text-sm font-medium">Max:</Label>
              <Select value={maxEntries.toString()} onValueChange={(value) => setMaxEntries(parseInt(value))}>
                <SelectTrigger className="w-20 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="500">500</SelectItem>
                  <SelectItem value="1000">1000</SelectItem>
                  <SelectItem value="5000">5000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Log Entries */}
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[600px]" ref={scrollAreaRef}>
                <div className="space-y-1 p-4">
                  {filteredLogs.map((log) => {
                    const isExpanded = expandedLogs.has(log.id);
                    
                    return (
                      <div
                        key={log.id}
                        className="border rounded-lg p-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleLogExpansion(log.id)}
                              className="h-6 w-6 p-0 mt-1"
                            >
                              {isExpanded ? 
                                <ChevronDown className="h-4 w-4" /> : 
                                <ChevronRight className="h-4 w-4" />
                              }
                            </Button>
                            
                            <div className="flex items-center space-x-2 mt-1">
                              {getLevelIcon(log.level)}
                              <Badge className={getLevelColor(log.level)}>
                                {log.level.toUpperCase()}
                              </Badge>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                {getSourceIcon(log.source)}
                                <span>{log.source}</span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {log.category}
                              </Badge>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm break-words">
                                {log.message}
                              </div>
                              {log.tags.length > 0 && (
                                <div className="flex items-center space-x-1 mt-1">
                                  {log.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>{formatTimestamp(log.timestamp)}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(JSON.stringify(log, null, 2))}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {isExpanded && (
                          <div className="mt-3 pl-9 space-y-2">
                            {log.metadata && Object.keys(log.metadata).length > 0 && (
                              <div>
                                <Label className="text-xs font-medium">Metadata:</Label>
                                <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-x-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                            
                            {log.stackTrace && (
                              <div>
                                <Label className="text-xs font-medium">Stack Trace:</Label>
                                <pre className="text-xs bg-red-50 p-2 rounded mt-1 overflow-x-auto text-red-800">
                                  {log.stackTrace}
                                </pre>
                              </div>
                            )}
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              {log.userId && <span>User: {log.userId}</span>}
                              {log.sessionId && <span>Session: {log.sessionId.slice(0, 8)}</span>}
                              {log.requestId && <span>Request: {log.requestId.slice(0, 8)}</span>}
                              {log.duration && <span>Duration: {log.duration}ms</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {filteredLogs.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No logs match the current filters</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Log Levels</Label>
                  <div className="flex flex-wrap gap-2">
                    {['debug', 'info', 'warn', 'error', 'fatal'].map(level => (
                      <Button
                        key={level}
                        size="sm"
                        variant={filter.levels.includes(level) ? "default" : "outline"}
                        onClick={() => {
                          const newLevels = filter.levels.includes(level)
                            ? filter.levels.filter(l => l !== level)
                            : [...filter.levels, level];
                          handleFilterChange('levels', newLevels);
                        }}
                      >
                        {getLevelIcon(level)}
                        <span className="ml-1 capitalize">{level}</span>
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Sources</Label>
                  <Input
                    placeholder="API, Database, Server..."
                    value={filter.sources.join(', ')}
                    onChange={(e) => handleFilterChange('sources', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <Input
                    placeholder="Authentication, Content, AI..."
                    value={filter.categories.join(', ')}
                    onChange={(e) => handleFilterChange('categories', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="performance, security, error..."
                    value={filter.tags.join(', ')}
                    onChange={(e) => handleFilterChange('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>User ID</Label>
                  <Input
                    placeholder="Filter by user ID"
                    value={filter.userId || ''}
                    onChange={(e) => handleFilterChange('userId', e.target.value || undefined)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Session ID</Label>
                  <Input
                    placeholder="Filter by session ID"
                    value={filter.sessionId || ''}
                    onChange={(e) => handleFilterChange('sessionId', e.target.value || undefined)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button onClick={() => setFilter({
                  levels: ['debug', 'info', 'warn', 'error', 'fatal'],
                  sources: [],
                  categories: [],
                  dateRange: {},
                  searchQuery: '',
                  tags: []
                })}>
                  Reset Filters
                </Button>
                <Button onClick={fetchLogs} variant="outline">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Error Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.topErrors.slice(0, 5).map((error, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{error.message}</div>
                          <div className="text-xs text-muted-foreground">
                            Last: {error.lastOccurrence.toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="destructive">{error.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Logs by Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.bySource).map(([source, count]) => (
                      <div key={source} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getSourceIcon(source)}
                          <span className="capitalize">{source}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="streams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Terminal className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Log streams configuration coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Log Detail Dialog */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Log Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Level</Label>
                  <Badge className={getLevelColor(selectedLog.level)}>
                    {selectedLog.level.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Source</Label>
                  <div className="flex items-center space-x-1">
                    {getSourceIcon(selectedLog.source)}
                    <span>{selectedLog.source}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Badge variant="outline">{selectedLog.category}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Timestamp</Label>
                  <div className="text-sm">{formatTimestamp(selectedLog.timestamp)}</div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <pre className="text-sm bg-muted p-3 rounded mt-1 whitespace-pre-wrap">
                  {selectedLog.message}
                </pre>
              </div>
              
              {selectedLog.metadata && (
                <div>
                  <Label className="text-sm font-medium">Metadata</Label>
                  <pre className="text-sm bg-muted p-3 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}
              
              {selectedLog.stackTrace && (
                <div>
                  <Label className="text-sm font-medium">Stack Trace</Label>
                  <pre className="text-sm bg-red-50 p-3 rounded mt-1 overflow-x-auto text-red-800">
                    {selectedLog.stackTrace}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LogViewer;
