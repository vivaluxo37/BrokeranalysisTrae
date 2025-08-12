import * as React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/style-utils'

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border bg-[#1a1a1a] px-3 py-2 text-sm text-white transition-all duration-200 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50 resize-none',
  {
    variants: {
      variant: {
        default: 'border-gray-600 hover:border-gray-400 focus-visible:border-white',
        error: 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
        success: 'border-green-500 focus-visible:border-green-500 focus-visible:ring-green-500/20',
      },
      textareaSize: {
        sm: 'min-h-[60px] px-2 py-1 text-xs',
        md: 'min-h-[80px] px-3 py-2 text-sm',
        lg: 'min-h-[120px] px-4 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      textareaSize: 'md',
    },
  }
)

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string
  success?: string
  helperText?: string
  maxLength?: number
  showCharCount?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant, 
    textareaSize,
    error,
    success,
    helperText,
    maxLength,
    showCharCount = false,
    value,
    ...props 
  }, ref) => {
    const actualVariant = error ? 'error' : success ? 'success' : variant
    const currentLength = typeof value === 'string' ? value.length : 0

    return (
      <div className="w-full">
        <textarea
          className={cn(textareaVariants({ variant: actualVariant, textareaSize, className }))}
          ref={ref}
          maxLength={maxLength}
          value={value}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${props.id}-error` : 
            success ? `${props.id}-success` : 
            helperText ? `${props.id}-helper` : undefined
          }
          {...props}
        />
        
        <div className="mt-1 flex items-center justify-between">
          <div className="text-sm">
            {error && (
              <p 
                id={`${props.id}-error`}
                className="flex items-center gap-1 text-red-400"
                role="alert"
              >
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                {error}
              </p>
            )}
            {success && !error && (
              <p 
                id={`${props.id}-success`}
                className="text-green-400"
              >
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p 
                id={`${props.id}-helper`}
                className="text-gray-400"
              >
                {helperText}
              </p>
            )}
          </div>
          
          {showCharCount && maxLength && (
            <div className="text-xs text-gray-400">
              {currentLength}/{maxLength}
            </div>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea, textareaVariants }
