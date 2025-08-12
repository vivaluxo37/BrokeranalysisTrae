import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { User, Mail } from 'lucide-react'
import { 
  ProfessionalForm, 
  FormFieldWrapper,
  FormActions,
  FormMessage 
} from '../form'
import { Input } from '../input'
import { Button } from '../button'

const testSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().optional(),
})

type TestFormData = z.infer<typeof testSchema>

describe('Form Components', () => {
  describe('ProfessionalForm', () => {
    it('renders form with fields', () => {
      const onSubmit = vi.fn()
      
      render(
        <ProfessionalForm schema={testSchema} onSubmit={onSubmit}>
          <FormFieldWrapper name="name" label="Name" required>
            {({ value, onChange, error }) => (
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                error={error}
              />
            )}
          </FormFieldWrapper>
          
          <FormFieldWrapper name="email" label="Email" required icon={Mail}>
            {({ value, onChange, error }) => (
              <Input
                type="email"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                error={error}
              />
            )}
          </FormFieldWrapper>
          
          <FormActions>
            <Button type="submit">Submit</Button>
          </FormActions>
        </ProfessionalForm>
      )
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })

    it('validates fields and shows errors', async () => {
      const onSubmit = vi.fn()
      
      render(
        <ProfessionalForm schema={testSchema} onSubmit={onSubmit}>
          <FormFieldWrapper name="name" label="Name" required>
            {({ value, onChange, error }) => (
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                error={error}
              />
            )}
          </FormFieldWrapper>
          
          <FormFieldWrapper name="email" label="Email" required>
            {({ value, onChange, error }) => (
              <Input
                type="email"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                error={error}
              />
            )}
          </FormFieldWrapper>
          
          <Button type="submit">Submit</Button>
        </ProfessionalForm>
      )
      
      const submitButton = screen.getByRole('button', { name: /submit/i })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument()
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
      
      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('submits valid form data', async () => {
      const onSubmit = vi.fn()
      
      render(
        <ProfessionalForm schema={testSchema} onSubmit={onSubmit}>
          <FormFieldWrapper name="name" label="Name" required>
            {({ value, onChange, error }) => (
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                error={error}
              />
            )}
          </FormFieldWrapper>
          
          <FormFieldWrapper name="email" label="Email" required>
            {({ value, onChange, error }) => (
              <Input
                type="email"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                error={error}
              />
            )}
          </FormFieldWrapper>
          
          <Button type="submit">Submit</Button>
        </ProfessionalForm>
      )
      
      const nameInput = screen.getByLabelText(/name/i)
      const emailInput = screen.getByLabelText(/email/i)
      const submitButton = screen.getByRole('button', { name: /submit/i })
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } })
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.click(submitButton)
      
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
        })
      })
    })

    it('uses default values', () => {
      const onSubmit = vi.fn()
      const defaultValues = { name: 'Default Name', email: 'default@example.com' }
      
      render(
        <ProfessionalForm 
          schema={testSchema} 
          onSubmit={onSubmit}
          defaultValues={defaultValues}
        >
          <FormFieldWrapper name="name" label="Name">
            {({ value, onChange }) => (
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormFieldWrapper>
          
          <FormFieldWrapper name="email" label="Email">
            {({ value, onChange }) => (
              <Input
                type="email"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormFieldWrapper>
        </ProfessionalForm>
      )
      
      expect(screen.getByDisplayValue('Default Name')).toBeInTheDocument()
      expect(screen.getByDisplayValue('default@example.com')).toBeInTheDocument()
    })
  })

  describe('FormFieldWrapper', () => {
    const TestForm = ({ children }: { children: React.ReactNode }) => (
      <ProfessionalForm schema={testSchema} onSubmit={vi.fn()}>
        {children}
      </ProfessionalForm>
    )

    it('renders label with required indicator', () => {
      render(
        <TestForm>
          <FormFieldWrapper name="name" label="Full Name" required>
            {({ value, onChange }) => (
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormFieldWrapper>
        </TestForm>
      )
      
      expect(screen.getByText('Full Name')).toBeInTheDocument()
      expect(screen.getByText('*')).toBeInTheDocument()
    })

    it('renders with icon', () => {
      render(
        <TestForm>
          <FormFieldWrapper name="name" label="Name" icon={User}>
            {({ value, onChange }) => (
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormFieldWrapper>
        </TestForm>
      )
      
      const icon = screen.getByRole('img', { hidden: true })
      expect(icon).toBeInTheDocument()
    })

    it('renders description', () => {
      render(
        <TestForm>
          <FormFieldWrapper 
            name="name" 
            label="Name" 
            description="Enter your full name"
          >
            {({ value, onChange }) => (
              <Input
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </FormFieldWrapper>
        </TestForm>
      )
      
      expect(screen.getByText('Enter your full name')).toBeInTheDocument()
    })
  })

  describe('FormMessage', () => {
    it('renders error message', () => {
      render(<FormMessage type="error">This is an error</FormMessage>)
      
      const message = screen.getByText('This is an error')
      expect(message).toBeInTheDocument()
      expect(message).toHaveClass('text-red-400')
    })

    it('renders success message', () => {
      render(<FormMessage type="success">This is success</FormMessage>)
      
      const message = screen.getByText('This is success')
      expect(message).toBeInTheDocument()
      expect(message).toHaveClass('text-green-400')
    })

    it('renders info message', () => {
      render(<FormMessage type="info">This is info</FormMessage>)
      
      const message = screen.getByText('This is info')
      expect(message).toBeInTheDocument()
      expect(message).toHaveClass('text-blue-400')
    })
  })

  describe('FormActions', () => {
    it('renders action buttons', () => {
      render(
        <FormActions>
          <Button variant="secondary">Cancel</Button>
          <Button type="submit">Submit</Button>
        </FormActions>
      )
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    })
  })
})
