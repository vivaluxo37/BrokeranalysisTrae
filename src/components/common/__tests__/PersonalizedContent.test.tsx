import React from 'react';
import { render, screen } from '@testing-library/react';
import { PersonalizedContent } from '../PersonalizedContent';
import { User } from '@/types/auth';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    country: 'US',
    language: 'en',
    timezone: 'UTC',
    isVerified: true
  },
  preferences: {
    tradingStyle: ['day-trading'],
    preferredInstruments: ['forex', 'stocks'],
    riskTolerance: 'medium',
    budgetRange: { min: 1000, max: 10000, currency: 'USD' },
    importantFeatures: ['low-spreads'],
    notifications: {
      email: true,
      push: false,
      brokerUpdates: true,
      marketNews: true,
      personalizedRecommendations: true
    }
  },
  tradingExperience: {
    level: 'intermediate',
    yearsTrading: 2,
    primaryMarkets: ['forex'],
    averageTradesPerMonth: 50,
    typicalTradeSize: 1000
  },
  subscriptions: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('PersonalizedContent', () => {
  it('renders children with personalization context for authenticated user', () => {
    render(
      <PersonalizedContent user={mockUser}>
        {(context) => (
          <div>
            <span data-testid="auth-status">
              {context.isAuthenticated ? 'Authenticated' : 'Anonymous'}
            </span>
            <span data-testid="welcome-message">{context.welcomeMessage}</span>
            <span data-testid="user-name">{context.user?.profile?.firstName}</span>
          </div>
        )}
      </PersonalizedContent>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome back, John!');
    expect(screen.getByTestId('user-name')).toHaveTextContent('John');
  });

  it('renders children with anonymous context for unauthenticated user', () => {
    render(
      <PersonalizedContent user={null}>
        {(context) => (
          <div>
            <span data-testid="auth-status">
              {context.isAuthenticated ? 'Authenticated' : 'Anonymous'}
            </span>
            <span data-testid="welcome-message">{context.welcomeMessage}</span>
          </div>
        )}
      </PersonalizedContent>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Anonymous');
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome to BrokerAnalysis');
  });

  it('renders fallback content for unauthenticated user when provided', () => {
    const fallbackContent = <div data-testid="fallback">Please sign in</div>;

    render(
      <PersonalizedContent user={null} fallbackContent={fallbackContent}>
        {(context) => <div data-testid="main-content">Main content</div>}
      </PersonalizedContent>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('main-content')).not.toBeInTheDocument();
  });

  it('provides correct personalization flags', () => {
    render(
      <PersonalizedContent user={mockUser}>
        {(context) => (
          <div>
            <span data-testid="show-personalized">
              {context.showPersonalizedFeatures ? 'Show' : 'Hide'}
            </span>
          </div>
        )}
      </PersonalizedContent>
    );

    expect(screen.getByTestId('show-personalized')).toHaveTextContent('Show');
  });
});