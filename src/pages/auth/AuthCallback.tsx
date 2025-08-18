import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Alert, AlertDescription } from '../../components/ui/alert'

interface AuthCallbackState {
  loading: boolean
  success: boolean
  error: string | null
  user: any
}

const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [state, setState] = useState<AuthCallbackState>({
    loading: true,
    success: false,
    error: null,
    user: null
  })

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setState({
            loading: false,
            success: false,
            error: error.message,
            user: null
          })
          return
        }

        if (data.session) {
          setState({
            loading: false,
            success: true,
            error: null,
            user: data.session.user
          })
          
          // Redirect to dashboard or intended page after 2 seconds
          setTimeout(() => {
            const redirectTo = searchParams.get('redirectTo') || '/dashboard'
            navigate(redirectTo, { replace: true })
          }, 2000)
        } else {
          setState({
            loading: false,
            success: false,
            error: 'No session found. Please try signing in again.',
            user: null
          })
        }
      } catch (err) {
        setState({
          loading: false,
          success: false,
          error: err instanceof Error ? err.message : 'An unexpected error occurred',
          user: null
        })
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  const handleRetry = () => {
    navigate('/auth/login', { replace: true })
  }

  const handleContinue = () => {
    const redirectTo = searchParams.get('redirectTo') || '/dashboard'
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {state.loading ? 'Completing Sign In...' : state.success ? 'Welcome!' : 'Authentication Error'}
            </CardTitle>
            <CardDescription>
              {state.loading 
                ? 'Please wait while we complete your authentication'
                : state.success 
                ? 'You have been successfully signed in'
                : 'There was a problem with your authentication'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {state.loading && (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-sm text-gray-600">Processing your authentication...</p>
              </div>
            )}

            {state.success && (
              <div className="flex flex-col items-center space-y-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Welcome back, {state.user?.email || state.user?.user_metadata?.full_name || 'User'}!
                  </p>
                  <p className="text-xs text-gray-500">
                    Redirecting you to your dashboard...
                  </p>
                </div>
                <Button onClick={handleContinue} className="w-full">
                  Continue to Dashboard
                </Button>
              </div>
            )}

            {state.error && (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <XCircle className="h-12 w-12 text-red-600" />
                  <Alert variant="destructive">
                    <AlertDescription>
                      {state.error}
                    </AlertDescription>
                  </Alert>
                </div>
                <div className="space-y-2">
                  <Button onClick={handleRetry} className="w-full">
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/', { replace: true })} 
                    className="w-full"
                  >
                    Go to Homepage
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Having trouble? <a href="/support" className="text-blue-600 hover:text-blue-500">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthCallback