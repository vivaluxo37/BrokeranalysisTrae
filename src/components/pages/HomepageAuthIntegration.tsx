/**
 * HomepageAuthIntegration Component
 * 
 * Integrates authentication features into the homepage with personalized content
 */

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { AuthContainer } from '@/components/auth'

interface HomepageAuthIntegrationProps {
  className?: string
}

export function HomepageAuthIntegration({ className = '' }: HomepageAuthIntegrationProps) {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login')

  const handleShowLogin = () => {
    setAuthTab('login')
    setShowAuthModal(true)
  }

  const handleShowRegister = () => {
    setAuthTab('register')
    setShowAuthModal(true)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className={className}>
        {isAuthenticated && user ? (
          // Authenticated User UI
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user.profile.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  Welcome back, {user.profile.firstName}!
                </p>
                <p className="text-xs text-gray-500">
                  {user.subscription?.plan === 'premium' ? 'Premium Member' : 'Free Account'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {/* Navigate to dashboard */}}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          // Anonymous User UI
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShowLogin}
              className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={handleShowRegister}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Get Started
            </button>
          </div>
        )}
      </div>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <AuthContainer
              defaultTab={authTab}
              onSuccess={handleAuthSuccess}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

/**
 * PersonalizedHomepageSection Component
 * 
 * Shows personalized content based on user authentication status
 */
export function PersonalizedHomepageSection() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Start Your Trading Journey Today
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of traders who trust our platform to find the best brokers. 
              Get personalized recommendations, save your favorite brokers, and track your research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HomepageAuthIntegration className="flex justify-center" />
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user.profile.firstName}!
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Continue your broker research with personalized recommendations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Saved Brokers</h3>
              <p className="text-gray-600 text-sm mb-4">Quick access to your research</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                View Saved →
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendations</h3>
              <p className="text-gray-600 text-sm mb-4">Brokers matched to your profile</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                See Matches →
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Updates</h3>
              <p className="text-gray-600 text-sm mb-4">Latest news for your interests</p>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                Read More →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
