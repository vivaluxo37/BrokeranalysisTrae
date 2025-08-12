import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Search, User } from 'lucide-react'
import { Input } from '../input'

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />)
    const input = screen.getByPlaceholderText('Enter text')
    
    expect(input).toBeInTheDocument()
    expect(input).toHaveClass('border-gray-600')
  })

  it('renders all variants correctly', () => {
    const variants = ['default', 'error', 'success'] as const
    
    variants.forEach(variant => {
      const { unmount } = render(
        <Input variant={variant} data-testid={`input-${variant}`} />
      )
      const input = screen.getByTestId(`input-${variant}`)
      expect(input).toBeInTheDocument()
      unmount()
    })
  })

  it('renders all sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach(size => {
      const { unmount } = render(
        <Input inputSize={size} data-testid={`input-${size}`} />
      )
      const input = screen.getByTestId(`input-${size}`)
      expect(input).toBeInTheDocument()
      unmount()
    })
  })

  it('renders with left icon', () => {
    render(
      <Input 
        icon={Search} 
        iconPosition="left" 
        placeholder="Search..."
        data-testid="input-with-icon"
      />
    )
    
    const input = screen.getByTestId('input-with-icon')
    const icon = screen.getByRole('img', { hidden: true })
    
    expect(input).toHaveClass('pl-10')
    expect(icon).toBeInTheDocument()
  })

  it('renders with right icon', () => {
    render(
      <Input 
        icon={User} 
        iconPosition="right" 
        placeholder="Username"
        data-testid="input-with-right-icon"
      />
    )
    
    const input = screen.getByTestId('input-with-right-icon')
    const icon = screen.getByRole('img', { hidden: true })
    
    expect(input).toHaveClass('pr-10')
    expect(icon).toBeInTheDocument()
  })

  it('handles password visibility toggle', () => {
    render(<Input type="password" placeholder="Password" />)
    
    const input = screen.getByPlaceholderText('Password')
    const toggleButton = screen.getByRole('button', { name: /show password/i })
    
    expect(input).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    
    expect(input).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(
      <Input 
        id="test-input"
        error="This field is required" 
        placeholder="Test input"
      />
    )
    
    const input = screen.getByPlaceholderText('Test input')
    const errorMessage = screen.getByText('This field is required')
    
    expect(input).toHaveClass('border-red-500')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-red-400')
  })

  it('shows success message', () => {
    render(
      <Input 
        id="test-input"
        success="Input is valid" 
        placeholder="Test input"
      />
    )
    
    const input = screen.getByPlaceholderText('Test input')
    const successMessage = screen.getByText('Input is valid')
    
    expect(input).toHaveClass('border-green-500')
    expect(input).toHaveAttribute('aria-describedby', 'test-input-success')
    expect(successMessage).toBeInTheDocument()
    expect(successMessage).toHaveClass('text-green-400')
  })

  it('shows helper text', () => {
    render(
      <Input 
        id="test-input"
        helperText="Enter your username" 
        placeholder="Username"
      />
    )
    
    const input = screen.getByPlaceholderText('Username')
    const helperText = screen.getByText('Enter your username')
    
    expect(input).toHaveAttribute('aria-describedby', 'test-input-helper')
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('text-gray-400')
  })

  it('prioritizes error over success and helper text', () => {
    render(
      <Input 
        id="test-input"
        error="Error message"
        success="Success message"
        helperText="Helper text"
        placeholder="Test input"
      />
    )
    
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.queryByText('Success message')).not.toBeInTheDocument()
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Test input" />)
    
    const input = screen.getByPlaceholderText('Test input')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />)
    
    const input = screen.getByPlaceholderText('Disabled input')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Input ref={ref} placeholder="Ref test" />)
    
    expect(ref).toHaveBeenCalled()
  })
})
