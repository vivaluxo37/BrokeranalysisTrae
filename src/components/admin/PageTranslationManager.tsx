import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { pageTranslationService } from '../../services/PageTranslationService';
import { useI18n } from '../../providers/I18nProvider';
import { PlusIcon, TrashIcon, PencilIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface TranslationFormData {
  page_key: string;
  lang: string;
  translation_key: string;
  translation_value: string;
}

/**
 * Admin component for managing page translations
 * Provides CRUD operations for the pages_i18n table
 */
export const PageTranslationManager: React.FC = () => {
  const { language } = useI18n();
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [editingTranslation, setEditingTranslation] = useState<string | null>(null);
  const [formData, setFormData] = useState<TranslationFormData>({
    page_key: '',
    lang: language,
    translation_key: '',
    translation_value: ''
  });

  // Set query client for the service
  useEffect(() => {
    pageTranslationService.setQueryClient(queryClient);
  }, [queryClient]);

  // Fetch available pages
  const { data: availablePages = [] } = useQuery({
    queryKey: ['availablePages'],
    queryFn: () => pageTranslationService.getAvailablePages(),
  });

  // Fetch available languages
  const { data: availableLanguages = [] } = useQuery({
    queryKey: ['availableLanguages'],
    queryFn: () => pageTranslationService.getAvailableLanguages(),
  });

  // Fetch translation stats
  const { data: stats } = useQuery({
    queryKey: ['translationStats'],
    queryFn: () => pageTranslationService.getTranslationStats(),
  });

  // Fetch translations for selected page and language
  const { data: translations = {}, isLoading, refetch } = useQuery({
    queryKey: ['pageTranslations', selectedPage, selectedLanguage],
    queryFn: () => pageTranslationService.getPageTranslations(selectedPage, selectedLanguage),
    enabled: Boolean(selectedPage && selectedLanguage),
  });

  // Search translations
  const { data: searchResults = [] } = useQuery({
    queryKey: ['searchTranslations', searchTerm, selectedPage, selectedLanguage],
    queryFn: () => pageTranslationService.searchTranslations(
      searchTerm,
      selectedPage || undefined,
      selectedLanguage || undefined
    ),
    enabled: Boolean(searchTerm.length >= 2),
  });

  const handleAddNew = () => {
    setFormData({
      page_key: selectedPage || '',
      lang: selectedLanguage || language,
      translation_key: '',
      translation_value: ''
    });
    setIsAddingNew(true);
    setEditingTranslation(null);
  };

  const handleEdit = (key: string, value: string) => {
    setFormData({
      page_key: selectedPage,
      lang: selectedLanguage,
      translation_key: key,
      translation_value: value
    });
    setEditingTranslation(key);
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    try {
      await pageTranslationService.upsertTranslation(
        formData.page_key,
        formData.lang,
        formData.translation_key,
        formData.translation_value
      );
      
      // Refresh data
      refetch();
      queryClient.invalidateQueries({ queryKey: ['availablePages'] });
      queryClient.invalidateQueries({ queryKey: ['availableLanguages'] });
      queryClient.invalidateQueries({ queryKey: ['translationStats'] });
      
      // Reset form
      setIsAddingNew(false);
      setEditingTranslation(null);
      setFormData({
        page_key: '',
        lang: language,
        translation_key: '',
        translation_value: ''
      });
    } catch (error) {
      console.error('Failed to save translation:', error);
      alert('Failed to save translation. Please try again.');
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Are you sure you want to delete the translation for "${key}"?`)) {
      return;
    }

    try {
      await pageTranslationService.deleteTranslation(selectedPage, selectedLanguage, key);
      refetch();
      queryClient.invalidateQueries({ queryKey: ['translationStats'] });
    } catch (error) {
      console.error('Failed to delete translation:', error);
      alert('Failed to delete translation. Please try again.');
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingTranslation(null);
    setFormData({
      page_key: '',
      lang: language,
      translation_key: '',
      translation_value: ''
    });
  };

  const filteredTranslations = Object.entries(translations).filter(([key, value]) => {
    if (!searchTerm) return true;
    return key.toLowerCase().includes(searchTerm.toLowerCase()) ||
           value.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Translation Manager
        </h1>
        
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total_pages}</div>
              <div className="text-sm text-blue-800">Total Pages</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.total_languages}</div>
              <div className="text-sm text-green-800">Languages</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{stats.total_translations}</div>
              <div className="text-sm text-purple-800">Total Translations</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.total_pages > 0 ? Math.round((stats.total_translations / (stats.total_pages * stats.total_languages)) * 100) : 0}%
              </div>
              <div className="text-sm text-orange-800">Coverage</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page
            </label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a page...</option>
              {availablePages.map(page => (
                <option key={page} value={page}>{page}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a language...</option>
              {availableLanguages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search translations..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Translation List */}
      {selectedPage && selectedLanguage && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Translations for {selectedPage} ({selectedLanguage})
            </h2>
            <button
              onClick={handleAddNew}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Translation
            </button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading translations...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Add/Edit Form */}
              {(isAddingNew || editingTranslation) && (
                <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {isAddingNew ? 'Add New Translation' : 'Edit Translation'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Key
                      </label>
                      <input
                        type="text"
                        value={formData.page_key}
                        onChange={(e) => setFormData({ ...formData, page_key: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isAddingNew}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <input
                        type="text"
                        value={formData.lang}
                        onChange={(e) => setFormData({ ...formData, lang: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!isAddingNew}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Translation Key
                      </label>
                      <input
                        type="text"
                        value={formData.translation_key}
                        onChange={(e) => setFormData({ ...formData, translation_key: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!!editingTranslation}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Translation Value
                      </label>
                      <textarea
                        value={formData.translation_value}
                        onChange={(e) => setFormData({ ...formData, translation_value: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={!formData.page_key || !formData.lang || !formData.translation_key || !formData.translation_value}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Translation List */}
              {filteredTranslations.length > 0 ? (
                <div className="space-y-2">
                  {filteredTranslations.map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{key}</div>
                        <div className="text-gray-600 mt-1">{value}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(key, value)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(key)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No translations found matching your search.' : 'No translations found for this page and language.'}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchTerm.length >= 2 && searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search Results ({searchResults.length})
          </h2>
          <div className="space-y-2">
            {searchResults.map((result) => (
              <div key={result.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500">
                      {result.page_key} ({result.lang})
                    </div>
                    <div className="font-medium text-gray-900">{result.translation_key}</div>
                    <div className="text-gray-600 mt-1">{result.translation_value}</div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPage(result.page_key);
                      setSelectedLanguage(result.lang);
                      setSearchTerm('');
                    }}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View Page
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTranslationManager;