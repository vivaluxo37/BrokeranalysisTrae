/**
 * AuthContainer Component
 * 
 * Main container for authentication forms with tab switching between login and register
 */

import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

interface AuthContainerProps {
  defaultTab?: 'login' | 'register'
  onSuccess?: () => void
  onClose?: () => void
  showTabs?: boolean
  className?: string
}

export function AuthContainer({ 
  defaultTab = 'login', 
  onSuccess, 
  onClose,
  showTabs = true,
  className = ''
}: AuthContainerProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab)

  const handleSuccess = () => {
    onSuccess?.()
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto ${className}`}>
      {/* Header with close button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {activeTab === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Tab Navigation */}
      {showTabs && (
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>
      )}

      {/* Form Content */}
      <div className="min-h-[400px]">
        {activeTab === 'login' ? (
          <LoginForm 
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setActiveTab('register')}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setActiveTab('login')}
          />
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
