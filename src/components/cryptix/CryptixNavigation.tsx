import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../hooks/useAuth';
import { AuthContainer } from '../auth/AuthContainer';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { User, Settings, LogOut, BookmarkPlus } from 'lucide-react';
import CryptixLogoIcon from '../icons/CryptixLogoIcon';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export function CryptixNavigation() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openAuthModal = (tab: 'login' | 'register') => {
    setAuthTab(tab);
    setShowAuthModal(true);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-cryptix-dark/80 backdrop-blur-lg border-b border-cryptix-border">
      <div className="content-container">
        <div className="flex items-center justify-between h-24">
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <CryptixLogoIcon width={26} height={24} color="#f5f5f5" />
            <span className="text-2xl font-medium text-pure-white font-['DM_Sans']">
              Cryptix
            </span>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#why-cryptix" className="text-cryptix-light-grey hover:text-pure-white transition-colors duration-200 font-['DM_Sans']">
              Why Cryptix?
            </a>
            <a href="#cryptos" className="text-cryptix-light-grey hover:text-pure-white transition-colors duration-200 font-['DM_Sans']">
              Cryptos
            </a>
            <a href="#how-it-works" className="text-cryptix-light-grey hover:text-pure-white transition-colors duration-200 font-['DM_Sans']">
              How it works
            </a>
            <a href="#testimonials" className="text-cryptix-light-grey hover:text-pure-white transition-colors duration-200 font-['DM_Sans']">
              Testimonials
            </a>
            <a href="#faq" className="text-cryptix-light-grey hover:text-pure-white transition-colors duration-200 font-['DM_Sans']">
              FAQ
            </a>
            
            {/* Language Switcher */}
            <LanguageSwitcher variant="desktop" className="ml-2" />
          </div>

          {/* Authentication Section */}
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-cryptix-border animate-pulse" />
          ) : isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.profile?.avatar} alt={user.profile?.displayName || user.email} />
                    <AvatarFallback className="bg-cryptix-accent text-cryptix-dark">
                      {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-cryptix-dark border-cryptix-border" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium text-pure-white">
                      {user.profile?.displayName || `${user.profile?.firstName} ${user.profile?.lastName}`.trim() || 'User'}
                    </p>
                    <p className="w-[200px] truncate text-sm text-cryptix-light-grey">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-cryptix-border" />
                <DropdownMenuItem className="text-cryptix-light-grey hover:text-pure-white hover:bg-white/5">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-cryptix-light-grey hover:text-pure-white hover:bg-white/5">
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Saved Brokers
                </DropdownMenuItem>
                <DropdownMenuItem className="text-cryptix-light-grey hover:text-pure-white hover:bg-white/5">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cryptix-border" />
                <DropdownMenuItem 
                  className="text-cryptix-light-grey hover:text-pure-white hover:bg-white/5"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={() => openAuthModal('login')}
                className="text-cryptix-light-grey hover:text-pure-white hover:bg-white/5 font-['DM_Sans'] font-medium"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => openAuthModal('register')}
                className="bg-cryptix-accent hover:bg-cryptix-accent/90 text-cryptix-dark rounded-[48px] px-6 py-3 font-['DM_Sans'] font-medium"
              >
                Get Started
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShowAuthModal(false)}
          />
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-white rounded-lg shadow-xl">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {authTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <AuthContainer
                  defaultTab={authTab}
                  onSuccess={handleAuthSuccess}
                  showTabs={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}