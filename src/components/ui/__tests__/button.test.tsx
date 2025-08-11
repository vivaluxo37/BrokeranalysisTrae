import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Search, ArrowRight } from 'lucide-react'
import { Button } from '../button'

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-white', 'text-black')
  })

  it('renders all variants correctly', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
    
    variants.forEach(variant => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>)
      const button = screen.getByRole('button', { name: variant })
      expect(button).toBeInTheDocument()
      unmount()
    })
  })

  it('renders all sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg', 'icon'] as const
    
    sizes.forEach(size => {
      const { unmount } = render(<Button size={size}>{size}</Button>)
      const button = screen.getByRole('button', { name: size })
      expect(button).toBeInTheDocument()
      unmount()
    })
  })

  it('shows loading state correctly', () => {
    render(<Button loading>Loading button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('renders with icon on left by default', () => {
    render(<Button icon={Search}>Search</Button>)
    const button = screen.getByRole('button')
    const icon = button.querySelector('svg')
    
    expect(icon).toBeInTheDocument()
    expect(icon).toHaveClass('h-4', 'w-4')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders with icon on right when specified', () => {
    render(<Button icon={ArrowRight} iconPosition="right">Next</Button>)
    const button = screen.getByRole('button')
    const icon = button.querySelector('svg')
    
    expect(icon).toBeInTheDocument()
    expect(button.textContent).toBe('Next')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not handle click when disabled', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} disabled>Disabled</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  it('does not handle click when loading', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick} loading>Loading</Button>)
    
    const button = screen.getByRole('button')
    fireEvent.click(button)
    
    expect(handleClick).not.toHaveBeenCalled()
    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('custom-class')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Button ref={ref}>Ref test</Button>)
    
    expect(ref).toHaveBeenCalled()
  })

  it('renders as child component when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link button</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
  })

  it('does not throw React.Children.only error when asChild is true', () => {
    // This test ensures the Slot component receives exactly one React element child
    // Previously this would throw: "React.Children.only expected to receive a single React element child"
    expect(() => {
      render(
        <Button asChild variant="primary" size="lg">
          <a href="/test">Link with button styling</a>
        </Button>
      )
    }).not.toThrow()
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveClass('bg-white', 'text-black', 'h-12', 'px-8')
  })

  it('does not render icons or loading states when asChild is true', () => {
    // When asChild is true, the child component is responsible for its own content
    // Icons and loading states should not interfere with the single child requirement
    render(
      <Button asChild icon={Search} loading>
        <a href="/test">Custom Link</a>
      </Button>
    )
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveTextContent('Custom Link')
    
    // Should not render loading spinner or icon when asChild is true
    expect(link.querySelector('.animate-spin')).not.toBeInTheDocument()
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<Button>Accessible button</Button>)
    const button = screen.getByRole('button')
    
    expect(button).toHaveClass('focus-visible:outline-none')
    expect(button).toHaveClass('focus-visible:ring-2')
    expect(button).toHaveClass('focus-visible:ring-white')
  })

  it('shows loading spinner when loading', () => {
    render(<Button loading icon={Search}>Loading with icon</Button>)
    
    // Should show loading spinner instead of the original icon
    const loadingSpinner = screen.getByRole('button').querySelector('.animate-spin')
    expect(loadingSpinner).toBeInTheDocument()
    
    // Should have loading text for screen readers
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})