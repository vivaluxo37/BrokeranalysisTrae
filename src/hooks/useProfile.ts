import { useState, useEffect, useCallback } from 'react';

export interface UserProfile {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  preferred_language?: string;
  timezone?: string;
  email_notifications?: boolean;
  marketing_emails?: boolean;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (userId?: string) => {
    if (!userId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Placeholder for actual profile fetching
      console.log('Fetching profile for user:', userId);
      
      const mockProfile: UserProfile = {
        id: userId,
        email: 'user@example.com',
        name: 'User Name',
        preferred_language: 'en',
        timezone: 'UTC',
        email_notifications: true,
        marketing_emails: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setProfile(mockProfile);
      return mockProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Updating profile with:', updates);
      
      const updatedProfile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      setProfile(updatedProfile);
      return updatedProfile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  return {
    profile,
    isLoading,
    error,
    fetchProfile,
    updateProfile,
    clearProfile
  };
}
