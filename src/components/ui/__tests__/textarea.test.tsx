import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from '../textarea'

describe('Textarea', () => {
  it('renders with default props', () => {
    render(<Textarea placeholder="Enter message" />)
    const textarea = screen.getByPlaceholderText('Enter message')
    
    expect(textarea).toBeInTheDocument()
    expect(textarea).toHaveClass('border-gray-600')
    expect(textarea).toHaveClass('min-h-[80px]')
  })

  it('renders all variants correctly', () => {
    const variants = ['default', 'error', 'success'] as const
    
    variants.forEach(variant => {
      const { unmount } = render(
        <Textarea variant={variant} data-testid={`textarea-${variant}`} />
      )
      const textarea = screen.getByTestId(`textarea-${variant}`)
      expect(textarea).toBeInTheDocument()
      unmount()
    })
  })

  it('renders all sizes correctly', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    
    sizes.forEach(size => {
      const { unmount } = render(
        <Textarea textareaSize={size} data-testid={`textarea-${size}`} />
      )
      const textarea = screen.getByTestId(`textarea-${size}`)
      expect(textarea).toBeInTheDocument()
      unmount()
    })
  })

  it('shows error message', () => {
    render(
      <Textarea 
        id="test-textarea"
        error="This field is required" 
        placeholder="Test textarea"
      />
    )
    
    const textarea = screen.getByPlaceholderText('Test textarea')
    const errorMessage = screen.getByText('This field is required')
    
    expect(textarea).toHaveClass('border-red-500')
    expect(textarea).toHaveAttribute('aria-invalid', 'true')
    expect(textarea).toHaveAttribute('aria-describedby', 'test-textarea-error')
    expect(errorMessage).toBeInTheDocument()
    expect(errorMessage).toHaveClass('text-red-400')
  })

  it('shows success message', () => {
    render(
      <Textarea 
        id="test-textarea"
        success="Input is valid" 
        placeholder="Test textarea"
      />
    )
    
    const textarea = screen.getByPlaceholderText('Test textarea')
    const successMessage = screen.getByText('Input is valid')
    
    expect(textarea).toHaveClass('border-green-500')
    expect(textarea).toHaveAttribute('aria-describedby', 'test-textarea-success')
    expect(successMessage).toBeInTheDocument()
    expect(successMessage).toHaveClass('text-green-400')
  })

  it('shows helper text', () => {
    render(
      <Textarea 
        id="test-textarea"
        helperText="Enter your message here" 
        placeholder="Message"
      />
    )
    
    const textarea = screen.getByPlaceholderText('Message')
    const helperText = screen.getByText('Enter your message here')
    
    expect(textarea).toHaveAttribute('aria-describedby', 'test-textarea-helper')
    expect(helperText).toBeInTheDocument()
    expect(helperText).toHaveClass('text-gray-400')
  })

  it('shows character count when enabled', () => {
    render(
      <Textarea 
        value="Hello world"
        maxLength={100}
        showCharCount
        placeholder="Message"
        readOnly
      />
    )
    
    expect(screen.getByText('11/100')).toBeInTheDocument()
  })

  it('does not show character count when disabled', () => {
    render(
      <Textarea 
        value="Hello world"
        maxLength={100}
        showCharCount={false}
        placeholder="Message"
        readOnly
      />
    )
    
    expect(screen.queryByText('11/100')).not.toBeInTheDocument()
  })

  it('handles maxLength correctly', () => {
    render(<Textarea maxLength={50} placeholder="Limited textarea" />)
    
    const textarea = screen.getByPlaceholderText('Limited textarea')
    expect(textarea).toHaveAttribute('maxLength', '50')
  })

  it('prioritizes error over success and helper text', () => {
    render(
      <Textarea 
        id="test-textarea"
        error="Error message"
        success="Success message"
        helperText="Helper text"
        placeholder="Test textarea"
      />
    )
    
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.queryByText('Success message')).not.toBeInTheDocument()
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
  })

  it('handles change events', () => {
    const handleChange = vi.fn()
    render(<Textarea onChange={handleChange} placeholder="Test textarea" />)
    
    const textarea = screen.getByPlaceholderText('Test textarea')
    fireEvent.change(textarea, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />)
    
    const textarea = screen.getByPlaceholderText('Disabled textarea')
    expect(textarea).toBeDisabled()
    expect(textarea).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50')
  })

  it('forwards ref correctly', () => {
    const ref = vi.fn()
    render(<Textarea ref={ref} placeholder="Ref test" />)
    
    expect(ref).toHaveBeenCalled()
  })

  it('updates character count on value change', () => {
    const { rerender } = render(
      <Textarea 
        value=""
        maxLength={100}
        showCharCount
        placeholder="Message"
        readOnly
      />
    )
    
    expect(screen.getByText('0/100')).toBeInTheDocument()
    
    rerender(
      <Textarea 
        value="Hello"
        maxLength={100}
        showCharCount
        placeholder="Message"
        readOnly
      />
    )
    
    expect(screen.getByText('5/100')).toBeInTheDocument()
  })
})