import React from 'react';
import { render, screen } from '@testing-library/react';
import { PersonalizedWelcomeMessage } from '../PersonalizedWelcomeMessage';
import { User } from '@/types/auth';

const mockUser: User = {
  id: '1',
  email: 'john.doe@example.com',
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
    preferredInstruments: ['forex'],
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
  updatedAt: new Date('2024-01-15')
};

describe('PersonalizedWelcomeMessage', () => {
  it('renders welcome message for authenticated user', () => {
    render(<PersonalizedWelcomeMessage user={mockUser} />);

    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
    expect(screen.getByText('Ready to find your perfect broker?')).toBeInTheDocument();
  });

  it('renders generic welcome message for anonymous user', () => {
    render(<PersonalizedWelcomeMessage user={null} />);

    expect(screen.getByText('Welcome to BrokerAnalysis')).toBeInTheDocument();
    expect(screen.getByText('Discover the best brokers for your trading needs')).toBeInTheDocument();
  });

  it('shows last login when enabled for authenticated user', () => {
    render(<PersonalizedWelcomeMessage user={mockUser} showLastLogin={true} />);

    expect(screen.getByText(/Last activity:/)).toBeInTheDocument();
  });

  it('uses email username when firstName is not available', () => {
    const userWithoutName = {
      ...mockUser,
      profile: {
        ...mockUser.profile,
        firstName: ''
      }
    };

    render(<PersonalizedWelcomeMessage user={userWithoutName} />);

    expect(screen.getByText('Welcome back, john.doe!')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PersonalizedWelcomeMessage user={mockUser} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('does not show last login when disabled', () => {
    render(<PersonalizedWelcomeMessage user={mockUser} showLastLogin={false} />);

    expect(screen.queryByText(/Last activity:/)).not.toBeInTheDocument();
  });
});
