// Modal component for saving broker recommendation results
// Integrates with the BrokerRecommendationWizard for comprehensive results saving

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Loader2, Save, Share2, Eye, EyeOff, Tag } from 'lucide-react';
import { useCreateSavedResult } from '../../hooks/useUserData';
import { useToast } from "../../hooks/use-toast";
import type { Broker } from '../../types/broker';
import type { CreateSavedResultData } from '../../types/user';

interface SaveResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  brokers: Broker[];
  searchCriteria: Record<string, any>;
  searchQuery?: string;
  onSaveSuccess?: (resultId: string) => void;
}

interface SaveResultFormData {
  title: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  category: string;
  notes: string;
}

const RESULT_CATEGORIES = [
  { value: 'comparison', label: 'Broker Comparison' },
  { value: 'research', label: 'Research Results' },
  { value: 'recommendation', label: 'Recommendations' },
  { value: 'analysis', label: 'Market Analysis' },
  { value: 'screening', label: 'Broker Screening' },
  { value: 'other', label: 'Other' }
];

const SUGGESTED_TAGS = [
  'forex', 'stocks', 'crypto', 'cfd', 'options',
  'beginner', 'advanced', 'low-cost', 'regulated',
  'mobile-trading', 'research-tools', 'education'
];

export function SaveResultModal({
  isOpen,
  onClose,
  brokers,
  searchCriteria,
  searchQuery,
  onSaveSuccess
}: SaveResultModalProps) {
    const createSavedResultHook = useCreateSavedResult();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<SaveResultFormData>({
    title: '',
    description: '',
    tags: [],
    isPublic: false,
    category: 'comparison',
    notes: ''
  });
  
  const [newTag, setNewTag] = useState('');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);

  // Generate automatic title based on search criteria
  const generateAutoTitle = useCallback(async () => {
    setIsGeneratingTitle(true);
    try {
      let title = 'Broker Search Results';
      
      if (searchQuery) {
        title = `Search: ${searchQuery}`;
      } else if (searchCriteria) {
        const criteria = [];
        if (searchCriteria.tradingType) criteria.push(searchCriteria.tradingType);
        if (searchCriteria.experienceLevel) criteria.push(searchCriteria.experienceLevel);
        if (searchCriteria.accountSize) criteria.push(`${searchCriteria.accountSize} account`);
        if (searchCriteria.region) criteria.push(searchCriteria.region);
        
        if (criteria.length > 0) {
          title = `${criteria.join(' + ')} Brokers`;
        }
      }
      
      // Add broker count
      title += ` (${brokers.length} results)`;
      
      setFormData(prev => ({ ...prev, title }));
    } catch (error) {
      console.error('Error generating title:', error);
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [searchQuery, searchCriteria, brokers.length]);

  // Handle form submission
  const handleSave = useCallback(async () => {
    if (!formData.title.trim()) {
      toast({
        title: 'Title Required',
        description: 'Please enter a title for your saved results.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const resultData: CreateSavedResultData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        result_data: {
          brokers: brokers.map(broker => ({
            id: broker.id,
            name: broker.name,
            rating: broker.rating,
            logo_url: broker.logo_url,
            summary: broker.summary
          })),
          search_criteria: searchCriteria,
          search_query: searchQuery,
          total_results: brokers.length,
          generated_at: new Date().toISOString()
        },
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        is_public: formData.isPublic,
        category: formData.category,
        notes: formData.notes.trim() || undefined
      };

            await createSavedResultHook.mutateAsync(resultData);
      toast({
        title: 'Results Saved',
        description: 'Your broker search results have been saved successfully.',
      });
      onSaveSuccess?.(''); // Pass actual result ID if available
      onClose();
    } catch (error) {
      console.error('Error saving results:', error);
      toast({
        title: 'Error Saving Results',
        description: 'There was an error saving your results. Please try again.',
        variant: 'destructive'
      });
    }
  }, [formData, brokers, searchCriteria, searchQuery, createSavedResultHook, toast, onSaveSuccess, onClose]);

  // Handle tag management
  const addTag = useCallback((tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
    }
    setNewTag('');
  }, [formData.tags]);

  const removeTag = useCallback((tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag(newTag);
    }
  }, [newTag, addTag]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        tags: [],
        isPublic: false,
        category: 'comparison',
        notes: ''
      });
      setNewTag('');
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Search Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Results Summary */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Results Summary</h4>
            <p className="text-sm text-muted-foreground">
              {brokers.length} broker{brokers.length !== 1 ? 's' : ''} found
              {searchQuery && ` for "${searchQuery}"`}
            </p>
            {brokers.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {brokers.slice(0, 5).map(broker => (
                  <Badge key={broker.id} variant="secondary" className="text-xs">
                    {broker.name}
                  </Badge>
                ))}
                {brokers.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{brokers.length - 5} more
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <div className="flex gap-2">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter a title for your saved results"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateAutoTitle}
                disabled={isGeneratingTitle}
              >
                {isGeneratingTitle ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Auto'
                )}
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description to help you remember this search..."
              rows={3}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RESULT_CATEGORIES.map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add tags to categorize your results"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addTag(newTag)}
                  disabled={!newTag.trim()}
                >
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Suggested Tags */}
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-muted-foreground mr-2">Suggested:</span>
                {SUGGESTED_TAGS.filter(tag => !formData.tags.includes(tag)).slice(0, 6).map(tag => (
                  <Button
                    key={tag}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
              
              {/* Current Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {formData.isPublic ? (
                  <Eye className="h-4 w-4 text-green-600" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-600" />
                )}
                <Label htmlFor="public-toggle" className="font-medium">
                  {formData.isPublic ? 'Public' : 'Private'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.isPublic
                  ? 'Other users can view and learn from your results'
                  : 'Only you can view these results'
                }
              </p>
            </div>
            <Switch
              id="public-toggle"
              checked={formData.isPublic}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Personal Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add personal notes about these results..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
                        disabled={!formData.title.trim() || createSavedResultHook.isPending}
          >
            {createSavedResultHook.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Results
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default SaveResultModal;