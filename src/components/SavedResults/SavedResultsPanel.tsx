// Panel component for displaying and managing saved broker search results
// Integrates with homepage and user dashboard for comprehensive results management

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Share2, 
  Edit, 
  Trash2, 
  Calendar, 
  Tag, 
  Users, 
  Lock,
  TrendingUp,
  Clock,
  Star,
  Download,
  RefreshCw
} from 'lucide-react';
import { useUserData } from '../../hooks/useUserData';
import { useToast } from "../../hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import type { SavedResult, SavedResultFilters, PaginationParams } from '../../types/user';
import type { Broker } from '../../types/broker';

interface SavedResultsPanelProps {
  className?: string;
  showHeader?: boolean;
  maxResults?: number;
  onResultSelect?: (result: SavedResult) => void;
  onViewBrokers?: (brokers: Broker[]) => void;
}

interface ResultCardProps {
  result: SavedResult;
  onView: () => void;
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const SORT_OPTIONS = [
  { value: 'created_at_desc', label: 'Newest First' },
  { value: 'created_at_asc', label: 'Oldest First' },
  { value: 'title_asc', label: 'Title A-Z' },
  { value: 'title_desc', label: 'Title Z-A' },
  { value: 'updated_at_desc', label: 'Recently Updated' }
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'comparison', label: 'Broker Comparison' },
  { value: 'research', label: 'Research Results' },
  { value: 'recommendation', label: 'Recommendations' },
  { value: 'analysis', label: 'Market Analysis' },
  { value: 'screening', label: 'Broker Screening' },
  { value: 'other', label: 'Other' }
];

function ResultCard({ result, onView, onShare, onEdit, onDelete }: ResultCardProps) {
  const brokers = result.result_data?.brokers || [];
  const searchCriteria = result.result_data?.search_criteria || {};
  const totalResults = result.result_data?.total_results || brokers.length;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold truncate">
              {result.title}
            </CardTitle>
            {result.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {result.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>
                <Eye className="h-4 w-4 mr-2" />
                View Results
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Results Summary */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span>{totalResults} broker{totalResults !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDistanceToNow(new Date(result.created_at), { addSuffix: true })}</span>
          </div>
          {result.is_public ? (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Public</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              <span>Private</span>
            </div>
          )}
        </div>

        {/* Top Brokers Preview */}
        {brokers.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Top Results:</p>
            <div className="flex flex-wrap gap-1">
              {brokers.slice(0, 4).map((broker, index) => (
                <Badge key={broker.id || index} variant="secondary" className="text-xs">
                  {broker.name}
                  {broker.rating && (
                    <span className="ml-1 text-yellow-600">★{broker.rating}</span>
                  )}
                </Badge>
              ))}
              {brokers.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{brokers.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {result.tags && result.tags.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {result.tags.slice(0, 5).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {result.tags.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{result.tags.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Search Criteria Summary */}
        {Object.keys(searchCriteria).length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Criteria: </span>
            {Object.entries(searchCriteria)
              .filter(([_, value]) => value && value !== 'any')
              .slice(0, 3)
              .map(([key, value]) => `${key}: ${value}`)
              .join(', ')}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={onView} className="flex-1">
            <Eye className="h-4 w-4 mr-2" />
            View Results
          </Button>
          <Button size="sm" variant="outline" onClick={onShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SavedResultsPanel({
  className = '',
  showHeader = true,
  maxResults,
  onResultSelect,
  onViewBrokers
}: SavedResultsPanelProps) {
  const { savedResultsHook } = useUserData();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('created_at_desc');
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('my-results');

  // Build filters
  const filters = useMemo((): SavedResultFilters => {
    const baseFilters: SavedResultFilters = {};
    
    if (searchQuery.trim()) {
      baseFilters.search = searchQuery.trim();
    }
    
    if (selectedCategory !== 'all') {
      baseFilters.category = selectedCategory;
    }
    
    if (showPublicOnly) {
      baseFilters.is_public = true;
    }
    
    return baseFilters;
  }, [searchQuery, selectedCategory, showPublicOnly]);

  // Build pagination
  const pagination = useMemo((): PaginationParams => ({
    page: currentPage,
    limit: maxResults || 20,
    sort_by: sortBy.split('_')[0] as any,
    sort_order: sortBy.split('_')[1] as 'asc' | 'desc'
  }), [currentPage, maxResults, sortBy]);

  // Fetch results
  const {
    results,
    pagination: paginationInfo,
    isLoading,
    error,
    refetch
  } = savedResultsHook;

  // Handle result actions
  const handleViewResult = useCallback((result: SavedResult) => {
    onResultSelect?.(result);
    
    if (onViewBrokers && result.result_data?.brokers) {
      onViewBrokers(result.result_data.brokers);
    }
  }, [onResultSelect, onViewBrokers]);

  const handleShareResult = useCallback(async (result: SavedResult) => {
    try {
      // Generate share URL (implement based on your routing)
      const shareUrl = `${window.location.origin}/shared-results/${result.id}`;
      
      if (navigator.share) {
        await navigator.share({
          title: result.title,
          text: result.description || 'Check out these broker search results',
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: 'Link Copied',
          description: 'Share link has been copied to your clipboard.',
          variant: 'default'
        });
      }
    } catch (error) {
      console.error('Error sharing result:', error);
      toast({
        title: 'Share Failed',
        description: 'Failed to share the result. Please try again.',
        variant: 'destructive'
      });
    }
  }, [toast]);

  const handleEditResult = useCallback((result: SavedResult) => {
    // Implement edit functionality
    console.log('Edit result:', result.id);
    toast({
      title: 'Edit Feature',
      description: 'Edit functionality will be available soon.',
      variant: 'default'
    });
  }, [toast]);

  const handleDeleteResult = useCallback(async (resultId: string) => {
    try {
      await new Promise((resolve, reject) => {
        savedResultsHook.deleteResult(resultId, {
          onSuccess: () => {
            toast({
              title: 'Result Deleted',
              description: 'Your saved result has been deleted.',
              variant: 'default'
            });
            setDeleteConfirm(null);
            resolve(undefined);
          },
          onError: (error) => {
            toast({
              title: 'Delete Failed',
              description: 'Failed to delete the result. Please try again.',
              variant: 'destructive'
            });
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Error deleting result:', error);
    }
  }, [savedResultsHook, toast]);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground mb-4">Failed to load saved results.</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Saved Results</h2>
          <p className="text-muted-foreground">
            Access and manage your saved broker search results
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-results">My Results</TabsTrigger>
          <TabsTrigger value="public-results">Public Results</TabsTrigger>
        </TabsList>

        <TabsContent value="my-results" className="space-y-4">
          {/* Filters and Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your saved results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : results.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="mb-4">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Saved Results</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || selectedCategory !== 'all'
                    ? 'No results match your current filters.'
                    : 'You haven\'t saved any broker search results yet.'}
                </p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map(result => (
                  <ResultCard
                    key={result.id}
                    result={result}
                    onView={() => handleViewResult(result)}
                    onShare={() => handleShareResult(result)}
                    onEdit={() => handleEditResult(result)}
                    onDelete={() => setDeleteConfirm(result.id)}
                  />
                ))}
              </div>

              {/* Pagination */}
              {paginationInfo && paginationInfo.total_pages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!paginationInfo.has_prev}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-3 text-sm text-muted-foreground">
                    Page {paginationInfo.page} of {paginationInfo.total_pages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!paginationInfo.has_next}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="public-results">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="mb-4">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Public Results</h3>
              <p className="text-muted-foreground">
                Browse results shared by other users. This feature will be available soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved Result</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this saved result? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDeleteResult(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default SavedResultsPanel;