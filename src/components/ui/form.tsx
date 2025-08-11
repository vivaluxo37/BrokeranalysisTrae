import * as React from 'react'
import { useForm, FormProvider, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ZodSchema } from 'zod'
import { Slot } from '@radix-ui/react-slot'
import { type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Label } from './label'

// Form Provider Component
export interface ProfessionalFormProps<T extends FieldValues> {
  schema: ZodSchema<T>
  onSubmit: (data: T) => Promise<void> | void
  defaultValues?: Partial<T>
  children: React.ReactNode
  className?: string
}

export function ProfessionalForm<T extends FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
}: ProfessionalFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        {children}
      </form>
    </FormProvider>
  )
}

// Form Field Component
export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName
  children: (field: {
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    error?: string
    disabled?: boolean
  }) => React.ReactNode
}

export function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({ name, children }: FormFieldProps<TFieldValues, TName>) {
  const {
    register,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useFormContext<TFieldValues>()

  const fieldError = errors[name]
  const errorMessage = fieldError?.message as string | undefined

  const { onChange, onBlur, ...field } = register(name)
  const value = watch(name)

  return (
    <>
      {children({
        ...field,
        value,
        onChange: (newValue: any) => {
          setValue(name, newValue, { shouldValidate: true })
        },
        onBlur,
        error: errorMessage,
        disabled: isSubmitting,
      })}
    </>
  )
}

// Form Item Component
export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  required?: boolean
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, required, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('space-y-2', className)}
      {...props}
    />
  )
)
FormItem.displayName = 'FormItem'

// Form Label Component
export interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  required?: boolean
  icon?: LucideIcon
}

const FormLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  FormLabelProps
>(({ className, required, icon: Icon, children, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn(
      'text-sm font-medium text-white flex items-center gap-2',
      className
    )}
    {...props}
  >
    {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
    {children}
    {required && <span className="text-red-400 ml-1" aria-label="required">*</span>}
  </Label>
))
FormLabel.displayName = 'FormLabel'

// Form Control Component
const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => (
  <Slot ref={ref} {...props} />
))
FormControl.displayName = 'FormControl'

// Form Description Component
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-400', className)}
    {...props}
  />
))
FormDescription.displayName = 'FormDescription'

// Form Message Component
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    type?: 'error' | 'success' | 'info'
  }
>(({ className, type = 'error', ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-sm font-medium',
      {
        'text-red-400': type === 'error',
        'text-green-400': type === 'success',
        'text-blue-400': type === 'info',
      },
      className
    )}
    {...props}
  />
))
FormMessage.displayName = 'FormMessage'

// Form Actions Component
const FormActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-end space-x-4 pt-4 border-t border-gray-700',
      className
    )}
    {...props}
  />
))
FormActions.displayName = 'FormActions'

// Composite Form Field Component
export interface FormFieldWrapperProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends FormItemProps {
  name: TName
  label?: string
  description?: string
  required?: boolean
  icon?: LucideIcon
  children: (field: {
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    error?: string
    disabled?: boolean
  }) => React.ReactNode
}

export function FormFieldWrapper<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  required,
  icon,
  children,
  className,
  ...props
}: FormFieldWrapperProps<TFieldValues, TName>) {
  return (
    <FormItem className={className} required={required} {...props}>
      {label && (
        <FormLabel htmlFor={name} required={required} icon={icon}>
          {label}
        </FormLabel>
      )}
      <FormControl>
        <FormField name={name}>
          {(field) => children(field)}
        </FormField>
      </FormControl>
      {description && (
        <FormDescription>{description}</FormDescription>
      )}
      <FormField name={name}>
        {({ error }) => error && (
          <FormMessage type="error">{error}</FormMessage>
        )}
      </FormField>
    </FormItem>
  )
}

export {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormActions,
}