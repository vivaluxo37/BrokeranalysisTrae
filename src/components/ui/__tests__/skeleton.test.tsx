import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { 
  Skeleton, 
  CardSkeleton, 
  TableSkeleton, 
  ListSkeleton, 
  TextSkeleton,
  BrokerCardSkeleton,
  BrokerComparisonSkeleton
} from '../skeleton'

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('renders with default variant', () => {
      render(<Skeleton data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      
      expect(skeleton).toBeInTheDocument()
      expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-700')
    })

    it('renders all variants correctly', () => {
      const variants = ['default', 'light', 'dark'] as const
      
      variants.forEach(variant => {
        const { unmount } = render(
          <Skeleton variant={variant} data-testid={`skeleton-${variant}`} />
        )
        const skeleton = screen.getByTestId(`skeleton-${variant}`)
        expect(skeleton).toBeInTheDocument()
        unmount()
      })
    })

    it('applies custom className', () => {
      render(<Skeleton className="h-4 w-full" data-testid="skeleton" />)
      const skeleton = screen.getByTestId('skeleton')
      
      expect(skeleton).toHaveClass('h-4', 'w-full')
    })
  })

  describe('CardSkeleton', () => {
    it('renders with default props', () => {
      render(<CardSkeleton data-testid="card-skeleton" />)
      const cardSkeleton = screen.getByTestId('card-skeleton')
      
      expect(cardSkeleton).toBeInTheDocument()
      expect(cardSkeleton).toHaveClass('rounded-lg', 'border', 'bg-[#1a1a1a]')
    })

    it('renders without image when showImage is false', () => {
      const { container } = render(<CardSkeleton showImage={false} />)
      
      // Should not have the large image skeleton
      const imageSkeletons = container.querySelectorAll('.h-48')
      expect(imageSkeletons).toHaveLength(0)
    })

    it('renders without footer when showFooter is false', () => {
      const { container } = render(<CardSkeleton showFooter={false} />)
      
      // Should not have footer buttons
      const footerButtons = container.querySelectorAll('.h-8')
      expect(footerButtons).toHaveLength(0)
    })
  })

  describe('TableSkeleton', () => {
    it('renders with default props', () => {
      render(<TableSkeleton data-testid="table-skeleton" />)
      const tableSkeleton = screen.getByTestId('table-skeleton')
      
      expect(tableSkeleton).toBeInTheDocument()
      expect(tableSkeleton).toHaveClass('rounded-lg', 'border', 'bg-[#1a1a1a]')
    })

    it('renders correct number of rows and columns', () => {
      const { container } = render(<TableSkeleton rows={3} columns={2} />)
      
      // Should have header row + 3 data rows
      const rowContainers = container.querySelectorAll('.grid')
      expect(rowContainers).toHaveLength(4) // 1 header + 3 data rows
    })

    it('renders without header when showHeader is false', () => {
      const { container } = render(<TableSkeleton showHeader={false} />)
      
      // Should not have header background
      const headerBg = container.querySelector('.bg-\\[\\#0f0f0f\\]')
      expect(headerBg).not.toBeInTheDocument()
    })
  })

  describe('ListSkeleton', () => {
    it('renders with default props', () => {
      const { container } = render(<ListSkeleton />)
      
      // Should have 5 items by default
      const items = container.querySelectorAll('.flex.items-center')
      expect(items).toHaveLength(5)
    })

    it('renders correct number of items', () => {
      const { container } = render(<ListSkeleton items={3} />)
      
      const items = container.querySelectorAll('.flex.items-center')
      expect(items).toHaveLength(3)
    })

    it('renders with avatar when showAvatar is true', () => {
      const { container } = render(<ListSkeleton showAvatar={true} />)
      
      // Should have circular avatars
      const avatars = container.querySelectorAll('.rounded-full')
      expect(avatars.length).toBeGreaterThan(0)
    })
  })

  describe('TextSkeleton', () => {
    it('renders with default props', () => {
      const { container } = render(<TextSkeleton />)
      
      // Should have 3 lines by default
      const lines = container.querySelectorAll('.h-4')
      expect(lines).toHaveLength(3)
    })

    it('renders correct number of lines', () => {
      const { container } = render(<TextSkeleton lines={5} />)
      
      const lines = container.querySelectorAll('.h-4')
      expect(lines).toHaveLength(5)
    })

    it('makes last line shorter', () => {
      const { container } = render(<TextSkeleton lines={2} />)
      
      const lines = container.querySelectorAll('.h-4')
      expect(lines[0]).toHaveClass('w-full')
      expect(lines[1]).toHaveClass('w-2/3')
    })
  })

  describe('BrokerCardSkeleton', () => {
    it('renders broker-specific skeleton structure', () => {
      const { container } = render(<BrokerCardSkeleton />)
      
      // Should have the broker card structure
      expect(container.querySelector('.rounded-lg')).toBeInTheDocument()
      expect(container.querySelector('.border-gray-600')).toBeInTheDocument()
      
      // Should have multiple skeleton elements for different parts
      const skeletons = container.querySelectorAll('.animate-pulse')
      expect(skeletons.length).toBeGreaterThan(5) // Header, description, features, actions
    })
  })

  describe('BrokerComparisonSkeleton', () => {
    it('renders with default number of brokers', () => {
      const { container } = render(<BrokerComparisonSkeleton />)
      
      // Should have comparison structure
      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toBeInTheDocument()
    })

    it('renders correct number of broker columns', () => {
      const { container } = render(<BrokerComparisonSkeleton brokers={2} />)
      
      // Should have grid with correct column template
      const gridContainer = container.querySelector('.grid')
      expect(gridContainer).toHaveStyle('grid-template-columns: 200px repeat(2, 1fr)')
    })
  })
})
