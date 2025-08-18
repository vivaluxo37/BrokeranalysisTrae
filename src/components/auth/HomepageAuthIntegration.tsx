import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { User, Settings, BookmarkPlus, TrendingUp, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomepageAuthIntegrationProps {
  className?: string;
}

export function HomepageAuthIntegration({ className }: HomepageAuthIntegrationProps) {
  const { user, isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <section className={`py-12 bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Unlock Personalized Broker Recommendations
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Create your free account to save searches, track your favorite brokers, and get AI-powered recommendations tailored to your trading style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookmarkPlus className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Save & Compare</h3>
                <p className="text-sm text-gray-600">Save your favorite brokers and create custom comparison lists</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Recommendations</h3>
                <p className="text-sm text-gray-600">Get personalized broker suggestions based on your trading profile</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-sm text-gray-600">Receive alerts about broker updates and market changes</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-12 bg-gradient-to-br from-green-50 to-emerald-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* User Profile Card */}
            <Card className="lg:w-1/3">
              <CardHeader className="text-center">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name || user.email} />
                  <AvatarFallback className="text-lg">
                    {(user.user_metadata?.full_name || user.email)?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
                </CardTitle>
                <CardDescription>
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Active Trader</Badge>
                  <Badge variant="outline">Verified</Badge>
                </div>
                <div className="space-y-2">
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                  </Link>
                  <Link to="/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions & Stats */}
            <div className="lg:w-2/3 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Trading Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">5</div>
                      <div className="text-sm text-gray-600">Saved Searches</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">12</div>
                      <div className="text-sm text-gray-600">Broker Comparisons</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
                      <div className="text-sm text-gray-600">Watchlist Items</div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/compare/wizard">
                    <Button className="w-full h-16 text-left justify-start">
                      <div>
                        <div className="font-semibold">Find New Broker</div>
                        <div className="text-sm opacity-90">Start personalized search</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/brokers">
                    <Button variant="outline" className="w-full h-16 text-left justify-start">
                      <div>
                        <div className="font-semibold">Browse All Brokers</div>
                        <div className="text-sm opacity-70">Explore our directory</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/saved-searches">
                    <Button variant="outline" className="w-full h-16 text-left justify-start">
                      <div>
                        <div className="font-semibold">Saved Searches</div>
                        <div className="text-sm opacity-70">Review past searches</div>
                      </div>
                    </Button>
                  </Link>
                  <Link to="/watchlist">
                    <Button variant="outline" className="w-full h-16 text-left justify-start">
                      <div>
                        <div className="font-semibold">My Watchlist</div>
                        <div className="text-sm opacity-70">Track favorite brokers</div>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomepageAuthIntegration;