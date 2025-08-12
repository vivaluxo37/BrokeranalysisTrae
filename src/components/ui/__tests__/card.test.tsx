import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Calculator, Star } from 'lucide-react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  ProfessionalCard,
  BrokerCard,
  ToolCard
} from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders with default variant', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('border-gray-600')
    })

    it('renders all variants correctly', () => {
      const variants = ['default', 'featured', 'compact', 'interactive', 'broker', 'tool', 'content'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(
          <Card variant={variant} data-testid={`card-${variant}`}>
            {variant}
          </Card>
        )
        const card = screen.getByTestId(`card-${variant}`)
        expect(card).toBeInTheDocument()
        unmount()
      })
    })

    it('applies interactive styles for interactive variant', () => {
      render(<Card variant="interactive" data-testid="interactive-card">Interactive</Card>)
      const card = screen.getByTestId('interactive-card')
      
      expect(card).toHaveClass('cursor-pointer')
      expect(card).toHaveClass('hover:border-gray-400')
    })
  })

  describe('CardHeader', () => {
    it('renders with icon and badge', () => {
      render(
        <CardHeader icon={Star} badge="Featured">
          Header content
        </CardHeader>
      )
      
      expect(screen.getByText('Header content')).toBeInTheDocument()
      expect(screen.getByText('Featured')).toBeInTheDocument()
      
      const icon = screen.getByRole('img', { hidden: true })
      expect(icon).toBeInTheDocument()
    })

    it('renders without icon and badge', () => {
      render(<CardHeader>Simple header</CardHeader>)
      
      expect(screen.getByText('Simple header')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('renders with default heading level', () => {
      render(<CardTitle>Default Title</CardTitle>)
      const title = screen.getByRole('heading', { level: 3 })
      
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Default Title')
    })

    it('renders with custom heading level', () => {
      render(<CardTitle level={2}>Custom Title</CardTitle>)
      const title = screen.getByRole('heading', { level: 2 })
      
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-2xl')
    })
  })

  describe('CardDescription', () => {
    it('renders description text', () => {
      render(<CardDescription>This is a description</CardDescription>)
      const description = screen.getByText('This is a description')
      
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-gray-400')
    })
  })

  describe('ProfessionalCard', () => {
    it('renders with header and footer', () => {
      render(
        <ProfessionalCard
          header={<div>Card Header</div>}
          footer={<div>Card Footer</div>}
        >
          Card Content
        </ProfessionalCard>
      )
      
      expect(screen.getByText('Card Header')).toBeInTheDocument()
      expect(screen.getByText('Card Content')).toBeInTheDocument()
      expect(screen.getByText('Card Footer')).toBeInTheDocument()
    })

    it('shows loading state', () => {
      render(
        <ProfessionalCard loading>
          Content that should not show
        </ProfessionalCard>
      )
      
      expect(screen.queryByText('Content that should not show')).not.toBeInTheDocument()
      
      // Should show loading skeleton
      const card = screen.getByRole('generic')
      expect(card).toHaveClass('animate-pulse')
    })
  })

  describe('BrokerCard', () => {
    const mockProps = {
      brokerName: 'Test Broker',
      rating: 4.5,
      features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
      onCompare: vi.fn(),
      onViewDetails: vi.fn(),
    }

    it('renders broker information correctly', () => {
      render(<BrokerCard {...mockProps}>Broker details</BrokerCard>)
      
      expect(screen.getByText('Test Broker')).toBeInTheDocument()
      expect(screen.getByText('4.5')).toBeInTheDocument()
      expect(screen.getByText('★')).toBeInTheDocument()
      expect(screen.getByText('Broker details')).toBeInTheDocument()
    })

    it('renders features list', () => {
      render(<BrokerCard {...mockProps}>Content</BrokerCard>)
      
      expect(screen.getByText('Key Features')).toBeInTheDocument()
      expect(screen.getByText('Feature 1')).toBeInTheDocument()
      expect(screen.getByText('Feature 2')).toBeInTheDocument()
      expect(screen.getByText('Feature 3')).toBeInTheDocument()
      // Should only show first 3 features
      expect(screen.queryByText('Feature 4')).not.toBeInTheDocument()
    })

    it('handles compare and view details clicks', () => {
      render(<BrokerCard {...mockProps}>Content</BrokerCard>)
      
      const compareButton = screen.getByText('Compare')
      const viewDetailsButton = screen.getByText('View Details')
      
      fireEvent.click(compareButton)
      fireEvent.click(viewDetailsButton)
      
      expect(mockProps.onCompare).toHaveBeenCalledTimes(1)
      expect(mockProps.onViewDetails).toHaveBeenCalledTimes(1)
    })

    it('renders without rating', () => {
      const propsWithoutRating = { ...mockProps, rating: undefined }
      render(<BrokerCard {...propsWithoutRating}>Content</BrokerCard>)
      
      expect(screen.queryByText('★')).not.toBeInTheDocument()
    })
  })

  describe('ToolCard', () => {
    const mockProps = {
      toolName: 'Calculator Tool',
      description: 'A useful calculation tool',
      icon: Calculator,
      onUse: vi.fn(),
    }

    it('renders tool information correctly', () => {
      render(<ToolCard {...mockProps} />)
      
      expect(screen.getByText('Calculator Tool')).toBeInTheDocument()
      expect(screen.getByText('A useful calculation tool')).toBeInTheDocument()
      
      const icon = screen.getByRole('img', { hidden: true })
      expect(icon).toBeInTheDocument()
    })

    it('handles use tool click', () => {
      render(<ToolCard {...mockProps} />)
      
      const useButton = screen.getByText('Use Tool')
      fireEvent.click(useButton)
      
      expect(mockProps.onUse).toHaveBeenCalledTimes(1)
    })

    it('renders without use button when onUse is not provided', () => {
      const propsWithoutOnUse = { ...mockProps, onUse: undefined }
      render(<ToolCard {...propsWithoutOnUse} />)
      
      expect(screen.queryByText('Use Tool')).not.toBeInTheDocument()
    })
  })
})
